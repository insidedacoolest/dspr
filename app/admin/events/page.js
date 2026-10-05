import Link from "next/link";
import { requireAdmin } from "../../lib/authGuard";
import { prisma } from "../../lib/db";
import { fmtDate } from "../../lib/format";
import { eventKindLabel } from "../../lib/constants";

export const metadata = { title: "Calendar — Admin" };

export default async function EventosPage() {
  await requireAdmin();
  const events = await prisma.event.findMany({ orderBy: { date: "desc" } });
  const now = new Date();
  return (
    <>
      <div className="admin-head">
        <div><h1>Calendar</h1><p>Competitions, demos and practice days. The next one shows on the home page with a countdown.</p></div>
        <Link href="/admin/events/new" className="btn btn-pink btn-sm"><span>+ New event</span></Link>
      </div>
      <div className="table-wrap">
        <table>
          <thead><tr><th>Date</th><th>Event</th><th>Type</th><th>Result</th><th /></tr></thead>
          <tbody>
            {events.map((e) => (
              <tr key={e.id} style={e.date < now ? { opacity: 0.6 } : undefined}>
                <td>{fmtDate(e.date)}</td>
                <td><b>{e.title}</b><div className="muted">{e.location}</div></td>
                <td>{eventKindLabel(e.kind)}</td>
                <td>{e.result || <span className="muted">—</span>}</td>
                <td><div className="row-actions"><Link href={`/admin/events/${e.id}`}>Edit</Link></div></td>
              </tr>
            ))}
            {events.length === 0 && <tr><td colSpan={5} className="muted">No events.</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  );
}
