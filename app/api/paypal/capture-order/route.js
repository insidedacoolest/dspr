import { prisma } from "../../../lib/db";
import { checkOrderToken } from "../../../lib/orderToken";
import { capturePayPalOrder, readCapture, paypalConfigured } from "../../../lib/paypal";
import { markOrderPaid } from "../../../lib/orders";

// Called by the PayPal button (onApprove): captures the payment, checks the
// amount against our order and marks it paid (which sends the emails).
export async function POST(request) {
  if (!paypalConfigured()) return Response.json({ error: "Online payment is not configured yet." }, { status: 503 });
  const { orderId, token } = await request.json().catch(() => ({}));
  const id = Number(orderId);
  if (!id || !checkOrderToken(id, token)) return Response.json({ error: "Invalid order." }, { status: 400 });

  const order = await prisma.order.findUnique({ where: { id } });
  if (!order || !order.paypalOrderId) return Response.json({ error: "Order not found." }, { status: 404 });
  if (order.status !== "awaiting_payment") return Response.json({ ok: true, orderId: id, already: true });

  let capture;
  try {
    capture = readCapture(await capturePayPalOrder(order.paypalOrderId, id));
  } catch (e) {
    console.error("[paypal] capture failed:", e.message, JSON.stringify(e.data || {}));
    const declined = e.data?.details?.some((d) => d.issue === "INSTRUMENT_DECLINED");
    return Response.json(
      { error: declined ? "Your payment method was declined. Please try another card or PayPal." : "The payment could not be completed.", declined },
      { status: 402 }
    );
  }

  const amountOk = Math.abs(capture.amount - order.total) < 0.01 && capture.currency === "USD";
  if (capture.status !== "COMPLETED" || !amountOk || capture.referenceId !== String(id)) {
    console.error("[paypal] unexpected capture for order", id, capture);
    await prisma.order.update({ where: { id }, data: { paypalCaptureId: capture.captureId, notes: `${order.notes}\n[PayPal: capture ${capture.status} ${capture.amount} ${capture.currency} — check manually]`.trim() } });
    return Response.json({ error: "Payment received but it needs a manual check. We’ll contact you." }, { status: 409 });
  }

  await markOrderPaid(id, { method: capture.method, captureId: capture.captureId });
  return Response.json({ ok: true, orderId: id });
}
