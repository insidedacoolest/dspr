import Link from "next/link";
import { requireAdmin } from "../lib/authGuard";
import { prisma } from "../lib/db";
import { usd, fmtDate } from "../lib/format";
import { BOOKING_STATUS, ORDER_STATUS, statusLabel } from "../lib/constants";

export const metadata = { title: "Dashboard — Admin" };

export default async function AdminHome() {
  await requireAdmin();
  const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1);

  const [newBookings, pendingOrders, monthRevenue, soldOut, bookings, orders, nextEvent, counts] = await Promise.all([
    prisma.booking.count({ where: { status: "new" } }),
    prisma.order.count({ where: { status: "paid" } }),
    prisma.order.aggregate({ _sum: { total: true }, where: { paidAt: { gte: monthStart }, status: { notIn: ["awaiting_payment", "cancelled", "refunded"] } } }),
    prisma.product.count({ where: { inStock: false } }),
    prisma.booking.findMany({ orderBy: { createdAt: "desc" }, take: 6 }),
    prisma.order.findMany({ where: { status: { not: "awaiting_payment" } }, orderBy: { createdAt: "desc" }, take: 6 }),
    prisma.event.findFirst({ where: { date: { gte: new Date() } }, orderBy: { date: "asc" } }),
    Promise.all([prisma.product.count(), prisma.driver.count(), prisma.service.count(), prisma.newsPost.count()]),
  ]);

  return (
    <>
      <div className="admin-head">
        <div>
          <h1>Dashboard</h1>
          <p>{nextEvent ? <>Next event: <b>{nextEvent.title}</b> · {fmtDate(nextEvent.date)}</> : "No upcoming events."}</p>
        </div>
        <div className="admin-head-actions">
          <Link href="/admin/content" className="btn btn-sm btn-white"><span>Edit site content</span></Link>
          <Link href="/admin/products/new" className="btn btn-sm btn-white"><span>+ Product</span></Link>
          <Link href="/admin/events/new" className="btn btn-sm btn-teal"><span>+ Event</span></Link>
        </div>
      </div>

      <div className="kpis">
        <Link href="/admin/bookings?status=new" className={`kpi${newBookings ? " hot" : ""}`}><b>{newBookings}</b><span>New bookings</span></Link>
        <Link href="/admin/orders?status=paid" className={`kpi${pendingOrders ? " hot" : ""}`}><b>{pendingOrders}</b><span>Paid orders to ship</span></Link>
        <Link href="/admin/orders" className="kpi"><b>{usd(monthRevenue._sum.total || 0)}</b><span>Paid sales this month</span></Link>
        <Link href="/admin/products" className="kpi"><b>{soldOut}</b><span>Sold-out products</span></Link>
        <Link href="/admin/products" className="kpi"><b>{counts[0]}</b><span>Products</span></Link>
        <Link href="/admin/drivers" className="kpi"><b>{counts[1]}</b><span>Drivers</span></Link>
        <Link href="/admin/services" className="kpi"><b>{counts[2]}</b><span>Services</span></Link>
        <Link href="/admin/news" className="kpi"><b>{counts[3]}</b><span>News posts</span></Link>
      </div>

      <div className="admin-grid-2">
        <div className="panel">
          <h2>Latest bookings <Link href="/admin/bookings">See all →</Link></h2>
          <div className="table-wrap">
            <table>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b.id}>
                    <td><Link href={`/admin/bookings/${b.id}`}><b>{b.name}</b></Link><div className="muted">{b.car}</div></td>
                    <td className="muted">{b.service || "Inspection"}</td>
                    <td className="num"><span className={`status status-${b.status}`}>{statusLabel(BOOKING_STATUS, b.status)}</span></td>
                  </tr>
                ))}
                {bookings.length === 0 && <tr><td className="muted">No bookings yet.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
        <div className="panel">
          <h2>Latest paid orders <Link href="/admin/orders">See all →</Link></h2>
          <div className="table-wrap">
            <table>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id}>
                    <td><Link href={`/admin/orders/${o.id}`}><b>#{o.id} · {o.name}</b></Link><div className="muted">{fmtDate(o.createdAt)}</div></td>
                    <td className="num">{usd(o.total)}</td>
                    <td className="num"><span className={`status status-${o.status}`}>{statusLabel(ORDER_STATUS, o.status)}</span></td>
                  </tr>
                ))}
                {orders.length === 0 && <tr><td className="muted">No orders yet.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
