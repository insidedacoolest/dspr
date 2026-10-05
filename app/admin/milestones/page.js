import Link from "next/link";
import { requireAdmin } from "../../lib/authGuard";
import { prisma } from "../../lib/db";
import { createMilestone, updateMilestone, deleteMilestone } from "./actions";
import { ConfirmButton } from "../ui";

export const metadata = { title: "About timeline — Admin" };

export default async function MilestonesPage() {
  await requireAdmin();
  const items = await prisma.milestone.findMany({ orderBy: [{ order: "asc" }, { id: "asc" }] });
  return (
    <>
      <div className="admin-head">
        <div><h1>About timeline</h1><p>The milestones shown on the <Link href="/about" target="_blank">About page</Link>, in order.</p></div>
      </div>

      <form action={createMilestone} className="admin-form" style={{ marginBottom: "2.5rem" }}>
        <fieldset>
          <legend>New milestone</legend>
          <div className="form-row-3">
            <label className="field"><span>Year / label</span><input name="year" required placeholder="2026" /></label>
            <label className="field"><span>Title</span><input name="title" required /></label>
            <label className="field"><span>Order</span><input name="order" type="number" defaultValue={items.length} /></label>
          </div>
          <label className="field"><span>Text</span><textarea name="text" rows={2} /></label>
          <div className="form-actions"><button className="btn btn-pink btn-sm"><span>Add</span></button></div>
        </fieldset>
      </form>

      <div className="stack">
        {items.map((m) => (
          <form key={m.id} id={`m${m.id}`} action={updateMilestone.bind(null, m.id)} className="admin-form">
            <fieldset>
              <legend>{m.year} · {m.title}</legend>
              <div className="form-row-3">
                <label className="field"><span>Year / label</span><input name="year" defaultValue={m.year} required /></label>
                <label className="field"><span>Title</span><input name="title" defaultValue={m.title} required /></label>
                <label className="field"><span>Order</span><input name="order" type="number" defaultValue={m.order} /></label>
              </div>
              <label className="field"><span>Text</span><textarea name="text" rows={2} defaultValue={m.text} /></label>
              <div className="form-actions">
                <button className="btn btn-sm btn-teal"><span>Save</span></button>
                <ConfirmButton className="danger-btn" message="Delete this milestone?" formAction={deleteMilestone.bind(null, m.id)}>Delete</ConfirmButton>
              </div>
            </fieldset>
          </form>
        ))}
        {items.length === 0 && <p className="hint">No milestones yet — the timeline is hidden until you add one.</p>}
      </div>
    </>
  );
}
