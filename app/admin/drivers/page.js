import Link from "next/link";
import { requireAdmin } from "../../lib/authGuard";
import { prisma } from "../../lib/db";

export const metadata = { title: "Drivers — Admin" };

export default async function DriversPage() {
  await requireAdmin();
  const drivers = await prisma.driver.findMany({ orderBy: [{ order: "asc" }, { id: "asc" }] });
  return (
    <>
      <div className="admin-head">
        <div><h1>Drivers</h1><p>The team shown on the Drift page.</p></div>
        <Link href="/admin/drivers/new" className="btn btn-pink btn-sm"><span>+ New driver</span></Link>
      </div>
      <div className="table-wrap">
        <table>
          <thead><tr><th /><th>#</th><th>Driver</th><th>Car</th><th className="num">hp</th><th className="num">Order</th><th /></tr></thead>
          <tbody>
            {drivers.map((d) => (
              <tr key={d.id}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <td style={{ width: 60 }}>{d.imageUrl ? <img src={d.imageUrl} alt="" className="thumb" /> : <span className="thumb" />}</td>
                <td><b style={{ color: "var(--pink)" }}>{d.num}</b></td>
                <td><b>{d.name}</b><div className="muted">{d.role}{d.nickname ? ` · “${d.nickname}”` : ""}</div></td>
                <td>{d.car}</td>
                <td className="num">{d.power || "—"}</td>
                <td className="num">{d.order}</td>
                <td><div className="row-actions"><Link href={`/drift/${d.slug}`} target="_blank">View</Link><Link href={`/admin/drivers/${d.id}`}>Edit</Link></div></td>
              </tr>
            ))}
            {drivers.length === 0 && <tr><td colSpan={7} className="muted">No drivers yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  );
}
