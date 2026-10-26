"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import { bookingTotal, fieldIds, paymentProblems, travellerProblems } from "@/lib/booking-rules";
import { bookingUrl, paymentUrl } from "@/lib/trip";
import Problem from "../Problem";
import Steps, { tripSteps } from "../Steps";
import TripOverview from "../TripOverview";
import { bookAction } from "./actions";
import { PayCard, PaymentMethodCard } from "./PaymentParts";
import { BOOKED_KEY, FORM_KEY, store } from "./store";
import { type BookingProps, saveForm, useBookingForm } from "./TravellersForm";

export const BOOKED_PATH = "/flyg/bokad";

// Betalsättet och Betala (R7, R8). Tillbaka till resenärerna finns allt kvar,
// eftersom det är sparat i fliken. Betala sparar bokningen på servern och
// visar sammanfattningen (R9).
export default function PaymentForm({ search, legs, flights, fleet, booking }: BookingProps) {
  const router = useRouter();
  const form = useBookingForm({ search, booking });
  // Försök att betala utan betalsätt; varje försök flyttar fokus igen
  const [attempts, setAttempts] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [booked, setBooked] = useState(false);
  const [pending, startTransition] = useTransition();

  // Första betalsättet får fokus när inget är valt
  const focusFirst = useRef(false);
  useEffect(() => {
    if (!focusFirst.current) return;
    focusFirst.current = false;
    document.getElementById(fieldIds.payment)?.focus();
  });

  if (!form) return null;
  if (booked) return <p role="status">Bokningen är sparad.</p>;
  // Utan ifyllda resenärer, t.ex. om sidan öppnas direkt, finns inget att betala
  if (Object.keys(travellerProblems(form, booking)).length > 0) {
    return <Problem text="Fyll i resenärerna först." href={bookingUrl(search, legs)} link="Till resenärerna" />;
  }

  const total = bookingTotal(form, booking);
  const problem = attempts > 0 ? (paymentProblems(form)[fieldIds.payment] ?? null) : null;

  function pay() {
    if (pending) return;
    if (Object.keys(paymentProblems(form!)).length > 0) {
      setAttempts((n) => n + 1);
      focusFirst.current = true;
      return;
    }
    setError(null);
    startTransition(async () => {
      const result = await bookAction(paymentUrl(search, legs).split("?")[1], form!);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      // Sammanfattningen visas bara i den här fliken, och formuläret töms
      setBooked(true);
      store(BOOKED_KEY, result.summary);
      store(FORM_KEY, null);
      router.replace(BOOKED_PATH);
    });
  }

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        pay();
      }}
      className="flex flex-col gap-8"
    >
      <Steps steps={tripSteps(search, legs)} current={3} />
      <TripOverview flights={flights} legs={legs} fleet={fleet} travellers={search.travellers} classes />

      <PaymentMethodCard
        payment={form.payment}
        problem={problem}
        onChange={(payment) => saveForm({ ...form, payment })}
      />
      <PayCard
        total={total}
        travellers={search.travellers}
        error={error}
        pending={pending}
        backHref={bookingUrl(search, legs)}
      />
    </form>
  );
}
