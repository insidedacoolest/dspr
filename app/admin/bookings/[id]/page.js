import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "../../../lib/authGuard";
import { prisma } from "../../../lib/db";
import { fmtDate } from "../../../lib/format";
import { BOOKING_STATUS } from "../../../lib/constants";
import { updateBooking, deleteBooking } from "../actions";
import { ConfirmButton } from "../../ui";

export const metadata = { title: "Booking — Admin" };

export default async function MarcacaoPage({ params }) {
  await requireAdmin();
  const { id } = await params;
  const b = await prisma.booking.findUnique({ where: { id: Number(id) || 0 } });
  if (!b) notFound();
  const phone = b.phone.replace(/[^\d+]/g, "");

  return (
    <>
      <div className="admin-head">
        <div><h1>Booking #{b.id}</h1><p><Link href="/admin/bookings">← Back to bookings</Link></p></div>
        <div className="admin-head-actions">
          <a href={`tel:${phone}`} className="btn btn-sm btn-white"><span>Call</span></a>
          <a href={`https://wa.me/${phone.replace("+", "")}`} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-white"><span>WhatsApp</span></a>
          <a href={`mailto:${b.email}?subject=Booking D-Spare Garage #${b.id}`} className="btn btn-sm btn-pink"><span>Reply by email</span></a>
        </div>
      </div>

      <div className="admin-grid-2">
        <div className="panel">
          <h2>Request</h2>
          <dl className="dl">
            <dt>Name</dt><dd>{b.name}</dd>
            <dt>Email</dt><dd><a href={`mailto:${b.email}`}>{b.email}</a></dd>
            <dt>Phone</dt><dd><a href={`tel:${phone}`}>{b.phone}</a></dd>
            <dt>Car</dt><dd>{b.car}</dd>
            <dt>Service</dt><dd>{b.service || "Inspection / to be defined"}</dd>
            <dt>Preferred date</dt><dd>{b.preferredDate ? fmtDate(b.preferredDate) : "—"}</dd>
            <dt>Received</dt><dd>{new Date(b.createdAt).toLocaleString("en-US")}</dd>
            <dt>Message</dt><dd style={{ whiteSpace: "pre-line" }}>{b.message || "—"}</dd>
          </dl>
        </div>
        <div className="panel">
          <h2>Manage</h2>
          <form action={updateBooking.bind(null, b.id)} className="form">
            <label className="field">
              <span>Status</span>
              <select name="status" defaultValue={b.status}>
                {BOOKING_STATUS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </label>
            <label className="field">
              <span>Internal notes</span>
              <textarea name="adminNotes" rows={6} defaultValue={b.adminNotes} placeholder="Quote sent, date agreed, parts to order…" />
            </label>
            <div className="form-actions"><button className="btn btn-pink btn-sm"><span>Save</span></button></div>
          </form>
        </div>
      </div>

      <div className="danger-zone">
        <h3>Danger zone</h3>
        <form action={deleteBooking.bind(null, b.id)}><ConfirmButton>Delete booking</ConfirmButton></form>
      </div>
    </>
  );
}
