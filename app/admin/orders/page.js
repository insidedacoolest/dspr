import Link from "next/link";
import { requireAdmin } from "../../lib/authGuard";
import { prisma } from "../../lib/db";
import { usd, fmtDate } from "../../lib/format";
import { ORDER_STATUS, statusLabel } from "../../lib/constants";

export const metadata = { title: "Orders — Admin" };

export default async function OrdersPage({ searchParams }) {
  await requireAdmin();
  const { status } = await searchParams;
  const orders = await prisma.order.findMany({
    where: status ? { status: status } : undefined,
    include: { _count: { select: { items: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      <div className="admin-head">
        <div><h1>Orders</h1><p>Shop orders. “Paid — to ship” means the customer already paid online. “Awaiting payment” are checkouts that were never completed.</p></div>
      </div>
      <div className="filter-tabs">
        <Link href="/admin/orders" className={!status ? "active" : ""}>All</Link>
        {ORDER_STATUS.map((s) => (
          <Link key={s.value} href={`/admin/orders?status=${s.value}`} className={status === s.value ? "active" : ""}>{s.label}</Link>
        ))}
      </div>
      <div className="table-wrap">
        <table>
          <thead><tr><th>#</th><th>Date</th><th>Customer</th><th>Delivery</th><th>Payment</th><th className="num">Items</th><th className="num">Total</th><th>Status</th><th /></tr></thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id}>
                <td>#{o.id}</td>
                <td className="muted">{fmtDate(o.createdAt)}</td>
                <td><b>{o.name}</b><div className="muted">{o.email}</div></td>
                <td>{o.delivery === "pickup" ? "Pickup" : `Ship · ${o.state || "—"}`}</td>
                <td className="muted">{o.paymentMethod || "—"}</td>
                <td className="num">{o._count.items}</td>
                <td className="num">{usd(o.total)}</td>
                <td><span className={`status status-${o.status}`}>{statusLabel(ORDER_STATUS, o.status)}</span></td>
                <td><div className="row-actions"><Link href={`/admin/orders/${o.id}`}>Open</Link></div></td>
              </tr>
            ))}
            {orders.length === 0 && <tr><td colSpan={9} className="muted">No orders.</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  );
}
