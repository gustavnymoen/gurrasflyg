"use client";

import { useActionState } from "react";
import { Card, primaryButtonClass, smallInputClass } from "../../components/ui";
import { loginAction } from "./actions";

export default function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, { error: null });

  return (
    <Card className="w-full max-w-sm">
      <form action={action} className="flex flex-col gap-4">
        <h1 className="bg-linear-to-br from-wine-light via-wine to-[#5c1029] bg-clip-text text-3xl font-extrabold tracking-tight text-transparent">
          Admin
        </h1>
        <div>
          <label htmlFor="password" className="sr-only">
            Lösenord
          </label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Lösenord"
            autoComplete="current-password"
            autoFocus
            required
            aria-invalid={state.error ? true : undefined}
            aria-describedby={state.error ? "password-error" : undefined}
            className={smallInputClass}
          />
          {state.error && (
            <p id="password-error" role="alert" className="mt-1.5 text-xs text-red-400">
              {state.error}
            </p>
          )}
        </div>
        <button type="submit" disabled={pending} className={primaryButtonClass}>
          {pending ? "Loggar in…" : "Logga in"}
        </button>
      </form>
    </Card>
  );
}
