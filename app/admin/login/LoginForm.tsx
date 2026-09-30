"use client";

import { useActionState } from "react";
import { login, type LoginState } from "./actions";
import styles from "../admin.module.css";

const initialState: LoginState = { success: false, message: "" };

export default function LoginForm() {
  const [state, formAction, pending] = useActionState(login, initialState);

  return (
    <form action={formAction} className={styles.loginForm}>
      <label className={styles.field}>
        <span className={styles.label}>Password</span>
        <input
          type="password"
          name="password"
          className={styles.input}
          autoComplete="current-password"
          autoFocus
          required
        />
      </label>

      {state.message && !state.success && (
        <p className={styles.error}>{state.message}</p>
      )}

      <button type="submit" className={styles.primaryBtn} disabled={pending}>
        {pending ? "Checking…" : "Log in"}
      </button>
    </form>
  );
}
