"use client";

import { useActionState } from "react";
import { changePassword } from "./actions";

export default function SettingsForm() {
  const [state, action, pending] = useActionState(changePassword, undefined);
  return (
    <form action={action} className="admin-form">
      <fieldset>
        <legend>Change password</legend>
        <div className="form-row">
          <label className="field"><span>Current password</span><input type="password" name="current" required autoComplete="current-password" /></label>
          <label className="field"><span>New password (min. 8 characters)</span><input type="password" name="next" required minLength={8} autoComplete="new-password" /></label>
        </div>
        {state?.error && <p className="form-error">{state.error}</p>}
        {state?.ok && <p className="saved">✓ Password changed.</p>}
        <div className="form-actions"><button className="btn btn-sm btn-pink" disabled={pending}><span>Update password</span></button></div>
      </fieldset>
    </form>
  );
}
