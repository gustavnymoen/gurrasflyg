"use client";

import { useActionState } from "react";
import Button from "../../components/Button";
import Card from "../../components/Card";
import Field, { fieldInputClass } from "../../components/Field";
import { loginAction } from "./actions";

export default function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, { error: null });

  return (
    <Card className="w-full max-w-sm">
      <form action={action} className="flex flex-col gap-4">
        <h1 className="text-section font-bold">Admin</h1>
        <Field label="Lösenord" htmlFor="password" error={state.error}>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            autoFocus
            required
            aria-invalid={state.error ? true : undefined}
            aria-describedby={state.error ? "password-error" : undefined}
            className={fieldInputClass}
          />
        </Field>
        <Button type="submit" disabled={pending}>
          {pending ? "Loggar in…" : "Logga in"}
        </Button>
      </form>
    </Card>
  );
}
