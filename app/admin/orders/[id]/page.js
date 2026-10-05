import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "../../../lib/authGuard";
import { prisma } from "../../../lib/db";
import { usd } from "../../../lib/format";
import { ORDER_STATUS, statusLabel } from "../../../lib/constants";
import { updateOrderStatus, deleteOrder, resendOrderEmails } from "../actions";
import { ConfirmButton } from "../../ui";

export const metadata = { title: "Order — Admin" };

const when = (d) => (d ? new Date(d).toLocaleString("en-US") : "—");

export default async function OrderPage({ params }) {
  await requireAdmin();
  const { id } = await params;
  const o = await prisma.order.findUnique({ where: { id: Number(id) || 0 }, include: { items: true } });
  if (!o) notFound();
  const paid = Boolean(o.paidAt);
  const ppBase = process.env.PAYPAL_ENV === "live" ? "https://www.paypal.com" : "https://www.sandbox.paypal.com";

  return (
    <>
      <div className="admin-head">
        <div>
          <h1>Order #{o.id}</h1>
          <p><Link href="/admin/orders">← Back to orders</Link> · <span className={`status status-${o.status}`}>{statusLabel(ORDER_STATUS, o.status)}</span></p>
        </div>
        <div className="admin-head-actions">
          <a href={`mailto:${o.email}?subject=Your D-Spare Garage order #${o.id}`} className="btn btn-sm btn-pink"><span>Email the customer</span></a>
        </div>
      </div>

      <div className="admin-grid-2">
        <div className="panel">
          <h2>Customer & delivery</h2>
          <dl className="dl">
            <dt>Name</dt><dd>{o.name}</dd>
            <dt>Email</dt><dd><a href={`mailto:${o.email}`}>{o.email}</a></dd>
            <dt>Phone</dt><dd><a href={`tel:${o.phone}`}>{o.phone}</a></dd>
            <dt>Delivery</dt><dd>{o.delivery === "pickup" ? "Pickup at the shop" : "Ship"}</dd>
            {o.delivery === "ship" && (
              <>
                <dt>Ship to</dt>
                <dd>{o.address}<br />{o.city}, {o.state} {o.zip}<br />{o.country}</dd>
              </>
            )}
            <dt>Placed</dt><dd>{when(o.createdAt)}</dd>
            <dt>Notes</dt><dd style={{ whiteSpace: "pre-line" }}>{o.notes || "—"}</dd>
          </dl>
        </div>

        <div style={{ display: "grid", gap: "1.5rem", alignContent: "start" }}>
          <div className="panel">
            <h2>Payment</h2>
            <dl className="dl">
              <dt>Status</dt><dd>{paid ? <b style={{ color: "var(--teal)" }}>Paid</b> : <span className="muted">Not paid</span>}</dd>
              <dt>Method</dt><dd>{o.paymentMethod || "—"}</dd>
              <dt>Paid at</dt><dd>{when(o.paidAt)}</dd>
              <dt>PayPal order</dt><dd>{o.paypalOrderId || "—"}</dd>
              <dt>Capture ID</dt>
              <dd>{o.paypalCaptureId ? <a href={`${ppBase}/activity/payment/${o.paypalCaptureId}`} target="_blank" rel="noopener noreferrer">{o.paypalCaptureId} ↗</a> : "—"}</dd>
              <dt>Emails</dt><dd>{o.emailsSentAt ? `Sent ${when(o.emailsSentAt)}` : "Not sent"}</dd>
            </dl>
            {paid && (
              <form action={resendOrderEmails.bind(null, o.id)} style={{ marginTop: "1rem" }}>
                <button className="btn btn-sm btn-white"><span>Resend confirmation emails</span></button>
              </form>
            )}
            <p className="hint" style={{ marginTop: "1rem" }}>Refunds are made in your PayPal account; then set the status to “Refunded”.</p>
          </div>

          <div className="panel">
            <h2>Status</h2>
            <form action={updateOrderStatus.bind(null, o.id)} className="form">
              <label className="field">
                <span>Order status</span>
                <select name="status" defaultValue={o.status}>
                  {ORDER_STATUS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
              </label>
              <div className="form-actions"><button className="btn btn-pink btn-sm"><span>Save status</span></button></div>
            </form>
          </div>
        </div>
      </div>

      <h2 className="form-title" style={{ margin: "2rem 0 1rem" }}>Items</h2>
      <div className="table-wrap">
        <table>
          <thead><tr><th>Product</th><th>Option</th><th className="num">Qty</th><th className="num">Price</th><th className="num">Subtotal</th></tr></thead>
          <tbody>
            {o.items.map((it) => (
              <tr key={it.id}>
                <td>{it.productId ? <Link href={`/admin/products/${it.productId}`}>{it.productName}</Link> : it.productName}</td>
                <td>{it.size || "—"}</td>
                <td className="num">{it.qty}</td>
                <td className="num">{usd(it.price)}</td>
                <td className="num">{usd(it.price * it.qty)}</td>
              </tr>
            ))}
            <tr><td colSpan={4} className="num">Subtotal</td><td className="num">{usd(o.subtotal)}</td></tr>
            <tr><td colSpan={4} className="num">{o.delivery === "pickup" ? "Pickup" : "Shipping"}</td><td className="num">{o.shipping > 0 ? usd(o.shipping) : "Free"}</td></tr>
            <tr><td colSpan={4} className="num"><b>Total</b></td><td className="num"><b>{usd(o.total)}</b></td></tr>
          </tbody>
        </table>
      </div>

      <div className="danger-zone">
        <h3>Danger zone</h3>
        <form action={deleteOrder.bind(null, o.id)}><ConfirmButton>Delete order</ConfirmButton></form>
      </div>
    </>
  );
}
