import { requireAdmin } from "../../lib/authGuard";
import { prisma } from "../../lib/db";
import { createPartner, updatePartner, deletePartner } from "./actions";
import { ConfirmButton } from "../ui";

export const metadata = { title: "Partners — Admin" };

const inputStyle = { background: "var(--bg)", border: "1px solid var(--line-2)", padding: ".5rem .6rem", width: "100%" };

export default async function ParceirosPage() {
  await requireAdmin();
  const partners = await prisma.partner.findMany({ orderBy: [{ order: "asc" }, { id: "asc" }] });
  return (
    <>
      <div className="admin-head"><div><h1>Partners</h1><p>Logos shown on the home page. Without a logo, the name is shown.</p></div></div>

      <form action={createPartner} className="admin-form" style={{ marginBottom: "2.5rem" }}>
        <fieldset>
          <legend>New partner</legend>
          <div className="form-row-3">
            <label className="field"><span>Name</span><input name="name" required /></label>
            <label className="field"><span>Link</span><input name="link" type="url" /></label>
            <label className="field"><span>Order</span><input name="order" type="number" defaultValue={partners.length} /></label>
          </div>
          <label className="field"><span>Logo (PNG/SVG with transparent background)</span><input type="file" name="logo" accept="image/*" /></label>
          <div className="form-actions"><button className="btn btn-pink btn-sm"><span>Add</span></button></div>
        </fieldset>
      </form>

      <div className="table-wrap">
        <table>
          <thead><tr><th>Logo</th><th>Name</th><th>Link</th><th>Order</th><th>New logo</th><th /></tr></thead>
          <tbody>
            {partners.map((p) => (
              <tr key={p.id}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <td style={{ width: 80 }}>{p.logoUrl ? <img src={p.logoUrl} alt="" style={{ maxHeight: 36, maxWidth: 70 }} /> : <span className="muted">—</span>}</td>
                <td><input form={`p${p.id}`} name="name" defaultValue={p.name} style={inputStyle} /></td>
                <td><input form={`p${p.id}`} name="link" defaultValue={p.link} style={inputStyle} /></td>
                <td style={{ width: 90 }}><input form={`p${p.id}`} name="order" type="number" defaultValue={p.order} style={inputStyle} /></td>
                <td><input form={`p${p.id}`} type="file" name="logo" accept="image/*" style={{ fontSize: ".75rem" }} /></td>
                <td>
                  <div className="row-actions">
                    <form id={`p${p.id}`} action={updatePartner.bind(null, p.id)}><button>Save</button></form>
                    <form action={deletePartner.bind(null, p.id)}><ConfirmButton className="danger" message="Delete this partner?">Delete</ConfirmButton></form>
                  </div>
                </td>
              </tr>
            ))}
            {partners.length === 0 && <tr><td colSpan={6} className="muted">No partners.</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  );
}
