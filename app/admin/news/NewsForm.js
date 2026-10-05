import { NEWS_SECTIONS } from "../../lib/constants";
import { toDateInput } from "../../lib/format";

export default function NewsForm({ action, initial, submitLabel }) {
  return (
    <form action={action} className="admin-form">
      <fieldset>
        <legend>Post</legend>
        <label className="field"><span>Title</span><input name="title" required defaultValue={initial?.title} /></label>
        <div className="form-row">
          <label className="field">
            <span>Section</span>
            <select name="section" defaultValue={initial?.section || "drift"}>
              {NEWS_SECTIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </label>
          <label className="field"><span>Publish date</span><input type="date" name="publishedAt" defaultValue={toDateInput(initial?.publishedAt || new Date())} /></label>
        </div>
        <label className="field"><span>Summary (shown on cards)</span><textarea name="excerpt" rows={2} required defaultValue={initial?.excerpt} /></label>
        <label className="field"><span>Full text</span><textarea name="body" rows={12} defaultValue={initial?.body} /></label>
      </fieldset>
      <fieldset>
        <legend>Image</legend>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {initial?.imageUrl && <img src={initial.imageUrl} alt="" className="current-image" />}
        <input type="file" name="image" accept="image/*" />
        {initial?.imageUrl && <label className="check"><input type="checkbox" name="removeImage" /> Remove image</label>}
        <span className="hint">Recommended ratio 16:10.</span>
      </fieldset>
      <div className="form-actions"><button className="btn btn-pink"><span>{submitLabel}</span></button></div>
    </form>
  );
}
