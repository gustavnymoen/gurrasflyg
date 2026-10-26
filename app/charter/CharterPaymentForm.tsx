"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import { fieldIds, paymentProblems } from "@/lib/booking-rules";
import {
  CHARTER_BOOKED_PATH,
  charterParams,
  charterProblems,
  charterTotal,
  extraRows,
  travellersUrl,
} from "@/lib/charter-rules";
import Problem from "../flyg/Problem";
import { PayCard, PaymentMethodCard } from "../flyg/boka/PaymentParts";
import Steps from "../flyg/Steps";
import { CHARTER_BOOKED_KEY, CHARTER_FORM_KEY, store } from "../flyg/boka/store";
import { bookCharterAction } from "./actions";
import CharterOverview from "./CharterOverview";
import { saveCharterForm, useCharterForm } from "./form";
import { type CharterStepProps, charterSteps } from "./steps";

// Betalsättet och Betala (TRIP-014-R8). Tillbaka till resenärerna finns allt kvar, eftersom
// det är sparat i fliken. Betala sparar bokningen på servern och visar sammanfattningen (R9).
export default function CharterPaymentForm({ id, title, search, choice, outbound, home }: CharterStepProps) {
  const router = useRouter();
  const form = useCharterForm(search.travellers);
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
  if (Object.keys(charterProblems(form)).length > 0) {
    return <Problem text="Fyll i resenärerna först." href={travellersUrl(id, search, choice)} link="Till resenärerna" />;
  }

  const total = charterTotal([outbound.price, home.price], form.extras, search.travellers);
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
      const result = await bookCharterAction(id, charterParams(search, choice).toString(), form!);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      // Sammanfattningen visas bara i den här fliken, och formuläret töms
      setBooked(true);
      store(CHARTER_BOOKED_KEY, result.summary);
      store(CHARTER_FORM_KEY, null);
      router.replace(CHARTER_BOOKED_PATH);
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
      <Steps steps={charterSteps(id, search, choice)} current={2} />
      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="flex flex-col gap-8">
          <PaymentMethodCard
            payment={form.payment}
            problem={problem}
            onChange={(payment) => saveCharterForm({ ...form, payment })}
          />
          <PayCard
            area="charter"
            total={total}
            travellers={search.travellers}
            error={error}
            pending={pending}
            backHref={travellersUrl(id, search, choice)}
          />
        </div>
        <div className="lg:sticky lg:top-6">
          <CharterOverview
            destination={title}
            trips={[outbound, home]}
            travellers={search.travellers}
            extras={extraRows(form.extras, search.travellers)}
            total={total}
          />
        </div>
      </div>
    </form>
  );
}
