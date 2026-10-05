import { checkOrderToken } from "../../../lib/orderToken";
import { markOrderPaid } from "../../../lib/orders";

// Development only: marks an order as paid without PayPal so the
// confirmation flow and emails can be tested locally. Disabled in production.
export async function POST(request) {
  if (process.env.NODE_ENV === "production") return new Response("Not found", { status: 404 });
  const { orderId, token } = await request.json().catch(() => ({}));
  const id = Number(orderId);
  if (!id || !checkOrderToken(id, token)) return Response.json({ error: "Invalid order." }, { status: 400 });
  await markOrderPaid(id, { method: "Test payment (dev)", captureId: `DEV-${Date.now()}` });
  return Response.json({ ok: true, orderId: id });
}
