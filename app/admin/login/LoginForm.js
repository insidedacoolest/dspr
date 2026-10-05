"use client";

import { useActionState } from "react";
import { login } from "../../actions/auth";

export default function LoginForm() {
  const [state, action, pending] = useActionState(login, undefined);

  return (
    <form action={action} className="form">
      <label className="field">
        <span>Email</span>
        <input type="email" name="email" required autoComplete="username" />
      </label>
      <label className="field">
        <span>Password</span>
        <input type="password" name="password" required autoComplete="current-password" />
      </label>
      {state?.error && <p className="form-error">{state.error}</p>}
      <button type="submit" className="btn btn-pink btn-block" disabled={pending}>
        <span>{pending ? "Logging in…" : "Log in"}</span>
      </button>
    </form>
  );
}
