import Link from "next/link";
import { requireAdmin } from "../../lib/authGuard";
import { prisma } from "../../lib/db";
import { fmtDate } from "../../lib/format";
import { BOOKING_STATUS, statusLabel } from "../../lib/constants";

export const metadata = { title: "Bookings — Admin" };

export default async function MarcacoesPage({ searchParams }) {
  await requireAdmin();
  const { status } = await searchParams;
  const bookings = await prisma.booking.findMany({
    where: status ? { status: status } : undefined,
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      <div className="admin-head">
        <div><h1>Bookings</h1><p>Requests sent through the Garage booking form.</p></div>
      </div>
      <div className="filter-tabs">
        <Link href="/admin/bookings" className={!status ? "active" : ""}>All</Link>
        {BOOKING_STATUS.map((s) => (
          <Link key={s.value} href={`/admin/bookings?status=${s.value}`} className={status === s.value ? "active" : ""}>{s.label}</Link>
        ))}
      </div>
      <div className="table-wrap">
        <table>
          <thead><tr><th>Received</th><th>Customer</th><th>Car</th><th>Service</th><th>Pref. date</th><th>Status</th><th /></tr></thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b.id}>
                <td className="muted">{fmtDate(b.createdAt)}</td>
                <td><b>{b.name}</b><div className="muted">{b.phone}</div></td>
                <td>{b.car}</td>
                <td>{b.service || <span className="muted">Inspection</span>}</td>
                <td>{b.preferredDate ? fmtDate(b.preferredDate) : "—"}</td>
                <td><span className={`status status-${b.status}`}>{statusLabel(BOOKING_STATUS, b.status)}</span></td>
                <td><div className="row-actions"><Link href={`/admin/bookings/${b.id}`}>Open</Link></div></td>
              </tr>
            ))}
            {bookings.length === 0 && <tr><td colSpan={7} className="muted">No bookings.</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  );
}
