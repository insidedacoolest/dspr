import { prisma } from "../../../lib/db";
import { getSettings } from "../../../lib/settings";
import { checkOrderToken } from "../../../lib/orderToken";
import { createPayPalOrder, paypalConfigured } from "../../../lib/paypal";

// Called by the PayPal button (createOrder): creates the PayPal order for one
// of our orders, using the totals stored in our DB.
export async function POST(request) {
  if (!paypalConfigured()) return Response.json({ error: "Online payment is not configured yet." }, { status: 503 });
  const { orderId, token } = await request.json().catch(() => ({}));
  const id = Number(orderId);
  if (!id || !checkOrderToken(id, token)) return Response.json({ error: "Invalid order." }, { status: 400 });

  const order = await prisma.order.findUnique({ where: { id }, include: { items: true } });
  if (!order) return Response.json({ error: "Order not found." }, { status: 404 });
  if (order.status !== "awaiting_payment") return Response.json({ error: "This order was already paid." }, { status: 409 });

  try {
    const settings = await getSettings();
    const pp = await createPayPalOrder(order, settings.brandFull || "D-Spare Garage");
    await prisma.order.update({ where: { id }, data: { paypalOrderId: pp.id } });
    return Response.json({ id: pp.id });
  } catch (e) {
    console.error("[paypal] create order failed:", e.message, JSON.stringify(e.data || {}));
    return Response.json({ error: "Could not start the payment. Please try again." }, { status: 502 });
  }
}
