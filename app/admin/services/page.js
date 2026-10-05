import Link from "next/link";
import { requireAdmin } from "../../lib/authGuard";
import { prisma } from "../../lib/db";
import { usd } from "../../lib/format";
import Icon from "../../components/Icon";

export const metadata = { title: "Services — Admin" };

export default async function ServicosPage() {
  await requireAdmin();
  const services = await prisma.service.findMany({ orderBy: [{ order: "asc" }, { id: "asc" }] });
  return (
    <>
      <div className="admin-head">
        <div><h1>Services</h1><p>Shown on the Garage page and in the booking form.</p></div>
        <Link href="/admin/services/new" className="btn btn-pink btn-sm"><span>+ New service</span></Link>
      </div>
      <div className="table-wrap">
        <table>
          <thead><tr><th /><th>Service</th><th>Duration</th><th className="num">Price from</th><th className="num">Order</th><th /></tr></thead>
          <tbody>
            {services.map((s) => (
              <tr key={s.id}>
                <td style={{ width: 40, color: "var(--pink)" }}><Icon name={s.icon} size={22} /></td>
                <td><b>{s.name}</b>{s.featured && <span className="muted"> ★ featured</span>}</td>
                <td>{s.duration || "—"}</td>
                <td className="num">{s.priceFrom ? usd(s.priceFrom) : "quote"}</td>
                <td className="num">{s.order}</td>
                <td><div className="row-actions"><Link href={`/admin/services/${s.id}`}>Edit</Link></div></td>
              </tr>
            ))}
            {services.length === 0 && <tr><td colSpan={6} className="muted">No services.</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  );
}
