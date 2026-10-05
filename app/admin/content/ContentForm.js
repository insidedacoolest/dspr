"use client";

import { useActionState } from "react";

function Field({ field, value }) {
  const { key, label, type, hint } = field;
  if (type === "image") {
    return (
      <label className="field">
        <span>{label}</span>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {value && <img src={value} alt="" className="current-image" />}
        <input type="file" name={key} accept="image/*" />
        {value && <label className="check"><input type="checkbox" name={`remove_${key}`} /> Remove image</label>}
        {hint && <span className="hint">{hint}</span>}
      </label>
    );
  }
  const long = type === "textarea" || type === "lines";
  const rows = type === "lines" ? 5 : String(value || "").length > 180 ? 6 : 3;
  return (
    <label className="field">
      <span>{label}</span>
      {long ? (
        <textarea name={key} rows={rows} defaultValue={value} />
      ) : (
        <input name={key} type={type === "url" ? "url" : "text"} defaultValue={value} />
      )}
      {hint && <span className="hint">{hint}</span>}
    </label>
  );
}

export default function ContentForm({ group, values, action }) {
  const [state, formAction, pending] = useActionState(action, undefined);
  return (
    <form action={formAction} className="admin-form" key={group.id}>
      <fieldset>
        <legend>{group.label}</legend>
        {group.hint && <p className="hint">{group.hint}</p>}
        {group.fields.map((f) => <Field key={f.key} field={f} value={values[f.key]} />)}
      </fieldset>
      {state?.error && <p className="form-error">{state.error}</p>}
      <div className="form-actions sticky-actions">
        <button className="btn btn-pink" disabled={pending}><span>{pending ? "Saving…" : "Save changes"}</span></button>
        {state?.saved && !pending && <span className="saved">✓ Saved — live on the site</span>}
      </div>
    </form>
  );
}
