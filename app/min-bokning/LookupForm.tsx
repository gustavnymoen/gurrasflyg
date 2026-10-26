"use client";

import { useState, useTransition } from "react";
import type { MyBooking } from "@/lib/cancel-rules";
import type { Credentials } from "@/lib/my-booking";
import Button from "../components/Button";
import Card from "../components/Card";
import Field, { fieldInputClass } from "../components/Field";
import Message from "../components/Message";
import { lookUpAction } from "./actions";

// Bokningsnumret och efternamnet (TRIP-023-R2). Fälten behåller det som skrevs när svaret är ett fel.
export default function LookupForm({ onFound }: { onFound: (booking: MyBooking, credentials: Credentials) => void }) {
  const [credentials, setCredentials] = useState<Credentials>({ bookingNumber: "", lastName: "" });
  const [error, setError] = useState<{ text: string; field?: keyof Credentials } | null>(null);
  const [pending, startTransition] = useTransition();

  function submit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    startTransition(async () => {
      const result = await lookUpAction(credentials);
      if ("booking" in result) return onFound(result.booking, credentials);
      setError({ text: result.error, field: result.missing });
    });
  }

  const fieldError = (name: keyof Credentials) => (error?.field === name ? error.text : null);
  return (
    <>
      <h1 className="text-title-phone font-bold">Min bokning</h1>
      <Card className="w-full max-w-md">
        <form onSubmit={submit} noValidate className="flex flex-col gap-4">
          <p className="text-ink-muted">Skriv bokningsnumret och efternamnet på den som bokade, så visar vi hela bokningen.</p>
          <Field label="Bokningsnummer" htmlFor="booking-number" error={fieldError("bookingNumber")}>
            <input
              id="booking-number"
              autoComplete="off"
              autoCapitalize="characters"
              spellCheck={false}
              value={credentials.bookingNumber}
              onChange={(e) => setCredentials({ ...credentials, bookingNumber: e.target.value })}
              aria-invalid={fieldError("bookingNumber") ? true : undefined}
              aria-describedby={fieldError("bookingNumber") ? "booking-number-error" : undefined}
              className={fieldInputClass}
            />
          </Field>
          <Field label="Efternamn" htmlFor="last-name" error={fieldError("lastName")}>
            <input
              id="last-name"
              autoComplete="off"
              value={credentials.lastName}
              onChange={(e) => setCredentials({ ...credentials, lastName: e.target.value })}
              aria-invalid={fieldError("lastName") ? true : undefined}
              aria-describedby={fieldError("lastName") ? "last-name-error" : undefined}
              className={fieldInputClass}
            />
          </Field>
          {error && !error.field && <Message kind="error">{error.text}</Message>}
          <Button type="submit" disabled={pending}>
            {pending ? "Söker…" : "Visa min bokning"}
          </Button>
        </form>
      </Card>
    </>
  );
}
