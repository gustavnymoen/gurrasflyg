"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  charterProblems,
  charterTotal,
  EXTRAS,
  extraRows,
  extrasProblem,
  MINOR_TEXT,
  anyMinor,
  paymentUrl,
  withoutUnavailable,
} from "@/lib/charter-rules";
import { formatPrice, travellersText } from "@/lib/format";
import type { Person } from "@/lib/booking-rules";
import Button from "../components/Button";
import Card from "../components/Card";
import Checkbox from "../components/Checkbox";
import Message from "../components/Message";
import { ContactCard, PersonFields, QuestionsCard } from "../flyg/boka/FormParts";
import Steps from "../flyg/Steps";
import CharterOverview from "./CharterOverview";
import { saveCharterForm, useCharterForm } from "./form";
import { type CharterStepProps, charterSteps } from "./steps";

const DRINKS_REMOVED = "Dryckespaket XXXL är borttaget eftersom en resenär är under 18 år.";

// Resenärerna, kontaktpersonen, de tre frågorna och tilläggen för hela resan (TRIP-014-R6, R7).
// Allt sparas i fliken medan det fylls i. Till betalning går det först när allt stämmer;
// annars blir fälten som saknas röda med vad som ska göras, och fokus flyttas till det första.
export default function CharterTravellersForm({ id, title, search, choice, outbound, home }: CharterStepProps) {
  const router = useRouter();
  const form = useCharterForm(search.travellers);
  // Hur många gånger besökaren försökt gå vidare med något som saknas
  const [attempts, setAttempts] = useState(0);
  // Läses upp när ett tillägg tas bort av att en ålder ändrats
  const [notice, setNotice] = useState("");

  const focusId = useRef<string | null>(null);
  useEffect(() => {
    const target = focusId.current && document.getElementById(focusId.current);
    if (!target) return;
    focusId.current = null;
    target.focus();
  });

  if (!form) return null;

  const problems = attempts > 0 ? charterProblems(form) : {};
  const error = (field: string) => problems[field] ?? null;
  const minor = anyMinor(form.passengers);

  function setPassenger(p: number, changed: Partial<Person>) {
    const passengers = form!.passengers.map((person, i) => (i === p ? { ...person, ...changed } : person));
    const extras = withoutUnavailable(form!.extras, passengers);
    setNotice(extras.length < form!.extras.length ? DRINKS_REMOVED : "");
    saveCharterForm({ ...form!, passengers, extras });
  }

  function setExtra(code: string, on: boolean) {
    setNotice("");
    saveCharterForm({ ...form!, extras: EXTRAS.filter((e) => (e.code === code ? on : form!.extras.includes(e.code))).map((e) => e.code) });
  }

  function next() {
    const first = Object.keys(charterProblems(form!))[0];
    if (first) {
      setAttempts((n) => n + 1);
      focusId.current = first;
      return;
    }
    if (extrasProblem(form!)) return;
    // Ett id för bokningen, så att två tryck på Betala blir en bokning (R8)
    saveCharterForm({ ...form!, requestId: form!.requestId || crypto.randomUUID() });
    router.push(paymentUrl(id, search, choice));
  }

  const rows = extraRows(form.extras, search.travellers);
  const total = charterTotal([outbound.price, home.price], form.extras, search.travellers);
  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        next();
      }}
      className="flex flex-col gap-8"
    >
      <Steps steps={charterSteps(id, search, choice)} current={1} />

      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="flex flex-col gap-8">
          {form.passengers.map((passenger, p) => (
            <Card key={p} labelledBy={`p${p}`} className="flex flex-col gap-5">
              <h2 id={`p${p}`} className="text-section font-bold">
                Passagerare {p + 1}
              </h2>
              <PersonFields index={p} person={passenger} error={error} onChange={(changed) => setPassenger(p, changed)} />
            </Card>
          ))}

          <ContactCard
            contact={form.contact}
            error={error}
            onChange={(contact) => saveCharterForm({ ...form, contact })}
          />
          <QuestionsCard checks={form.checks} error={error} onChange={(checks) => saveCharterForm({ ...form, checks })} />

          <Card labelledBy="tillagg" className="flex flex-col gap-4">
            <h2 id="tillagg" className="text-section font-bold">
              Tillägg för hela resan
            </h2>
            <p className="text-small text-ink-muted">
              Priset är per person och gäller {travellersText(search.travellers)}. Du kan välja vilka du vill.
            </p>
            {EXTRAS.map((extra) => {
              const unavailable = extra.adultsOnly && minor;
              const field = `extra-${extra.code}`;
              return (
                <div key={extra.code} className="flex flex-col gap-1">
                  <Checkbox
                    id={field}
                    label={extra.name}
                    checked={form.extras.includes(extra.code)}
                    unavailable={unavailable}
                    describedBy={`${field}-info`}
                    onChange={(on) => setExtra(extra.code, on)}
                  />
                  <div id={`${field}-info`} className="ml-8 flex flex-col gap-0.5 text-small text-ink-muted">
                    <p>{extra.description}</p>
                    <p>
                      {formatPrice(extra.price)} / person, {formatPrice(extra.price * search.travellers)} totalt
                    </p>
                    {unavailable && <p>{MINOR_TEXT}</p>}
                  </div>
                </div>
              );
            })}
            <p role="status" className="text-small font-medium">
              {notice}
            </p>
          </Card>
        </div>

        <div className="flex flex-col gap-3 lg:sticky lg:top-6">
          <CharterOverview
            destination={title}
            trips={[outbound, home]}
            travellers={search.travellers}
            extras={rows}
            total={total}
          >
            {Object.keys(problems).length > 0 && <Message kind="error">Något saknas. Rätta det som är rött ovan.</Message>}
            <Button type="submit" className="self-start">
              Till betalning
            </Button>
          </CharterOverview>
        </div>
      </div>
    </form>
  );
}
