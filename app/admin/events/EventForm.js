import { EVENT_KINDS } from "../../lib/constants";

function pad(n) {
  return String(n).padStart(2, "0");
}
function localDate(d) {
  return d ? `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}` : "";
}
function localTime(d) {
  return d ? `${pad(d.getHours())}:${pad(d.getMinutes())}` : "09:00";
}

export default function EventForm({ action, initial, submitLabel }) {
  const date = initial?.date ? new Date(initial.date) : null;
  const end = initial?.endDate ? new Date(initial.endDate) : null;
  return (
    <form action={action} className="admin-form">
      <fieldset>
        <legend>Event</legend>
        <label className="field"><span>Title</span><input name="title" required defaultValue={initial?.title} /></label>
        <div className="form-row">
          <label className="field"><span>Location</span><input name="location" required defaultValue={initial?.location} /></label>
          <label className="field">
            <span>Type</span>
            <select name="kind" defaultValue={initial?.kind || "comp"}>
              {EVENT_KINDS.map((k) => <option key={k.value} value={k.value}>{k.label}</option>)}
            </select>
          </label>
        </div>
        <div className="form-row-3">
          <label className="field"><span>Date</span><input type="date" name="date" required defaultValue={localDate(date)} /></label>
          <label className="field"><span>Time</span><input type="time" name="time" defaultValue={localTime(date)} /></label>
          <label className="field"><span>End date (optional)</span><input type="date" name="endDate" defaultValue={localDate(end)} /></label>
        </div>
        <label className="field"><span>Description</span><textarea name="desc" rows={3} defaultValue={initial?.desc} /></label>
        <label className="field"><span>Link (tickets, organizer…)</span><input type="url" name="link" defaultValue={initial?.link || ""} /></label>
        <label className="field">
          <span>Result (after the event)</span>
          <input name="result" placeholder="e.g. 2nd place Pro · Top 8" defaultValue={initial?.result} />
        </label>
      </fieldset>
      <div className="form-actions"><button className="btn btn-pink"><span>{submitLabel}</span></button></div>
    </form>
  );
}
