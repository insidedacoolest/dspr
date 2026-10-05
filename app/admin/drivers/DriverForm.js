"use client";

import { useActionState } from "react";

export default function DriverForm({ action, initial, submitLabel }) {
  const [state, formAction, pending] = useActionState(action, undefined);

  return (
    <form action={formAction} className="admin-form">
      <fieldset>
        <legend>Driver</legend>
        <div className="form-row-3">
          <label className="field"><span>Name</span><input name="name" required defaultValue={initial?.name} /></label>
          <label className="field"><span>Nickname</span><input name="nickname" defaultValue={initial?.nickname} /></label>
          <label className="field"><span>Number</span><input name="num" required maxLength={4} defaultValue={initial?.num} /></label>
        </div>
        <div className="form-row-3">
          <label className="field"><span>Role</span><input name="role" defaultValue={initial?.role || "Driver"} /></label>
          <label className="field"><span>Instagram (link)</span><input name="instagram" type="url" defaultValue={initial?.instagram} /></label>
          <label className="field"><span>Order</span><input type="number" name="order" defaultValue={initial?.order ?? 0} /></label>
        </div>
        <label className="field"><span>Bio</span><textarea name="bio" rows={4} defaultValue={initial?.bio} /></label>
        <label className="field">
          <span>Page address (optional)</span>
          <input name="slug" defaultValue={initial?.slug} placeholder="generated from the name" />
          <span className="hint">The page lives at /drift/<b>address</b>.</span>
        </label>
      </fieldset>

      <fieldset>
        <legend>Car</legend>
        <div className="form-row-3">
          <label className="field"><span>Car</span><input name="car" required defaultValue={initial?.car} /></label>
          <label className="field"><span>Engine</span><input name="engine" defaultValue={initial?.engine} /></label>
          <label className="field"><span>Power (hp)</span><input type="number" min="0" name="power" defaultValue={initial?.power ?? 0} /></label>
        </div>
        <label className="field"><span>Build list (one item per line)</span><textarea name="specs" rows={5} defaultValue={initial?.specs} /></label>
      </fieldset>

      <fieldset>
        <legend>Photos</legend>
        <div className="form-row">
          <label className="field">
            <span>Driver photo (4:5)</span>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {initial?.imageUrl && <img src={initial.imageUrl} alt="" className="current-image" />}
            <input type="file" name="image" accept="image/*" />
            {initial?.imageUrl && <label className="check"><input type="checkbox" name="removeImage" /> Remove photo</label>}
          </label>
          <label className="field">
            <span>Car photo (wide)</span>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {initial?.carImageUrl && <img src={initial.carImageUrl} alt="" className="current-image" />}
            <input type="file" name="carImage" accept="image/*" />
            {initial?.carImageUrl && <label className="check"><input type="checkbox" name="removeCarImage" /> Remove photo</label>}
          </label>
        </div>
      </fieldset>

      {state?.error && <p className="form-error">{state.error}</p>}
      <div className="form-actions"><button className="btn btn-pink" disabled={pending}><span>{pending ? "Saving…" : submitLabel}</span></button></div>
    </form>
  );
}
