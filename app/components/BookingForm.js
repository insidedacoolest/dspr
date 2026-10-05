"use client";

import { useActionState } from "react";
import { createBooking } from "../actions/booking";

export default function BookingForm({ services }) {
  const [state, action, pending] = useActionState(createBooking, undefined);

  if (state?.success) {
    return (
      <div className="booking-done">
        <span className="tag">Request #{state.id}</span>
        <h3>You’re on the grid!</h3>
        <p>We got your request. We’ll reach out to confirm the date, quote and details.</p>
      </div>
    );
  }

  return (
    <form action={action} className="form">
      <div className="form-row">
        <label className="field">
          <span>Name</span>
          <input name="name" required autoComplete="name" defaultValue={state?.values?.name} />
        </label>
        <label className="field">
          <span>Phone</span>
          <input name="phone" type="tel" required autoComplete="tel" defaultValue={state?.values?.phone} />
        </label>
      </div>
      <div className="form-row">
        <label className="field">
          <span>Email</span>
          <input name="email" type="email" required autoComplete="email" defaultValue={state?.values?.email} />
        </label>
        <label className="field">
          <span>Car (make, model, year)</span>
          <input name="car" required placeholder="e.g. Lexus IS300 2003" defaultValue={state?.values?.car} />
        </label>
      </div>
      <div className="form-row">
        <label className="field">
          <span>Service</span>
          <select name="service" defaultValue={state?.values?.service || ""}>
            <option value="">Not sure yet — need a look</option>
            {services.map((s) => <option key={s.id} value={s.name}>{s.name}</option>)}
          </select>
        </label>
        <label className="field">
          <span>Preferred date</span>
          <input name="preferredDate" type="date" defaultValue={state?.values?.preferredDate} />
        </label>
      </div>
      <label className="field">
        <span>What do you need?</span>
        <textarea name="message" rows={4} placeholder="Tell us the goal: street, track, drift, power, a problem to fix…" defaultValue={state?.values?.message} />
      </label>
      {state?.error && <p className="form-error">{state.error}</p>}
      <button type="submit" className="btn btn-pink btn-lg" disabled={pending}>
        <span>{pending ? "Sending…" : "Request booking"}</span>
      </button>
      <p className="fine">We only use your details to reply to this request.</p>
    </form>
  );
}
