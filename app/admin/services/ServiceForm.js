import { SERVICE_ICONS } from "../../lib/constants";

export default function ServiceForm({ action, initial, submitLabel }) {
  return (
    <form action={action} className="admin-form">
      <fieldset>
        <legend>Service</legend>
        <label className="field"><span>Name</span><input name="name" required defaultValue={initial?.name} /></label>
        <label className="field"><span>Description</span><textarea name="description" rows={4} required defaultValue={initial?.description} /></label>
        <div className="form-row-3">
          <label className="field"><span>Price from ($, empty = quote)</span><input type="number" step="0.01" min="0" name="priceFrom" defaultValue={initial?.priceFrom ?? ""} /></label>
          <label className="field"><span>Duration</span><input name="duration" placeholder="1 day" defaultValue={initial?.duration} /></label>
          <label className="field"><span>Order</span><input type="number" name="order" defaultValue={initial?.order ?? 0} /></label>
        </div>
        <label className="field">
          <span>Icon</span>
          <select name="icon" defaultValue={initial?.icon || "wrench"}>
            {SERVICE_ICONS.map((i) => <option key={i} value={i}>{i}</option>)}
          </select>
        </label>
        <label className="check"><input type="checkbox" name="featured" defaultChecked={initial?.featured} /> Featured service</label>
      </fieldset>
      <div className="form-actions"><button className="btn btn-pink"><span>{submitLabel}</span></button></div>
    </form>
  );
}
