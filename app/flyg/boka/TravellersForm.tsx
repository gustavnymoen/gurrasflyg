"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  asForm,
  type BookingForm,
  type BookingLeg,
  bookingTotal,
  changeClass,
  emptyForm,
  fieldIds,
  fitForm,
  MAX_ADDONS,
  NERVES,
  NERVES_PRICE,
  type Passenger,
  seatPrice,
  travellerProblems,
} from "@/lib/booking-rules";
import type { FleetAircraft } from "@/lib/fare-rules";
import type { Flight } from "@/lib/flight-rules";
import { formatPrice, travellersText } from "@/lib/format";
import type { Search } from "@/lib/search";
import { LEG_NAMES, type LegChoice, paymentUrl } from "@/lib/trip";
import Button from "../../components/Button";
import Card, { floatClass } from "../../components/Card";
import Checkbox from "../../components/Checkbox";
import Field, { fieldInputClass } from "../../components/Field";
import Message from "../../components/Message";
import RoundButton from "../../components/RoundButton";
import Steps, { tripSteps } from "../Steps";
import { ContactCard, PersonFields, QuestionsCard } from "./FormParts";
import TripOverview from "../TripOverview";
import { FORM_KEY, store, useStored } from "./store";

// Det sidorna för resenärerna och betalningen får från servern
export type BookingProps = {
  search: Search;
  legs: LegChoice[];
  flights: Flight[];
  fleet: FleetAircraft[];
  booking: BookingLeg[];
};

// Formuläret som det är sparat i fliken, anpassat till resan som den ser ut
// nu (R10), eller undefined innan sidan har läst det
export function useBookingForm({ search, booking }: Pick<BookingProps, "search" | "booking">) {
  const stored = useStored(FORM_KEY);
  if (stored === undefined) return undefined;
  return fitForm(asForm(stored) ?? emptyForm(""), booking, search.travellers);
}

export const saveForm = (form: BookingForm) => store(FORM_KEY, form);

// Klassen för en passagerare på ett flyg. Den första passagerarens får fokus
// när antalen per klass inte stämmer (R2).
const classId = (p: number, legIndex: number) => `p${p}-klass-${legIndex}`;

// Resenärerna, deras tillägg, kontaktpersonen och de tre frågorna (R1–R6).
// Allt sparas i fliken medan det fylls i. Till betalning går det först när
// allt stämmer; annars blir fälten som saknas röda med vad som ska göras, och
// fokus flyttas till det första.
export default function TravellersForm({ search, legs, flights, fleet, booking }: BookingProps) {
  const router = useRouter();
  const form = useBookingForm({ search, booking });
  // Hur många gånger besökaren försökt gå vidare med något som saknas. Varje
  // försök ritar om sidan, så att fokus flyttas även när felen redan syns.
  const [attempts, setAttempts] = useState(0);

  // Fältet som ska få fokus när något saknas, när felen syns på sidan
  const focusId = useRef<string | null>(null);
  useEffect(() => {
    const target = focusId.current && document.getElementById(focusId.current);
    if (!target) return;
    focusId.current = null;
    target.focus();
  });

  if (!form) return null;

  const problems = attempts > 0 ? travellerProblems(form, booking) : {};
  const error = (id: string) => problems[id] ?? null;
  const setPassenger = (p: number, passenger: Passenger) =>
    saveForm({ ...form, passengers: form.passengers.with(p, passenger) });

  function next() {
    const first = Object.keys(travellerProblems(form!, booking))[0];
    if (first) {
      setAttempts((n) => n + 1);
      // Stämmer inte antalen på ett flyg får den första passagerarens klass fokus
      focusId.current = first.startsWith("klasser-") ? classId(0, Number(first.split("-")[1])) : first;
      return;
    }
    // Ett id för bokningen, så att två tryck på Betala blir en bokning (R8)
    saveForm({ ...form!, requestId: form!.requestId || crypto.randomUUID() });
    router.push(paymentUrl(search, legs));
  }

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        next();
      }}
      className="flex flex-col gap-8"
    >
      <Steps steps={tripSteps(search, legs)} current={2} />
      <TripOverview flights={flights} legs={legs} fleet={fleet} travellers={search.travellers} classes />

      {form.passengers.map((passenger, p) => (
        <PassengerCard
          key={p}
          index={p}
          passenger={passenger}
          booking={booking}
          error={error}
          onChange={(changed) => setPassenger(p, changed)}
        />
      ))}
      {booking.map(
        (_, i) =>
          error(fieldIds.classes(i)) && (
            <Message key={i} kind="error" id={fieldIds.classes(i)}>
              {error(fieldIds.classes(i))}
            </Message>
          ),
      )}

      <ContactCard
        contact={form.contact}
        error={error}
        onChange={(contact) => saveForm({ ...form, contact })}
      />
      <QuestionsCard checks={form.checks} error={error} onChange={(checks) => saveForm({ ...form, checks })} />

      <Card className="flex flex-col gap-3">
        <p className="flex flex-wrap items-baseline justify-between gap-2">
          <span className="text-ink-muted">
            Totalt för resan, {travellersText(search.travellers)}
          </span>
          <span className="text-xl font-bold">{formatPrice(bookingTotal(form, booking))}</span>
        </p>
        {Object.keys(problems).length > 0 && (
          <Message kind="error">Något saknas. Rätta det som är rött ovan.</Message>
        )}
        <Button type="submit" className="self-start">
          Till betalning
        </Button>
      </Card>
    </form>
  );
}

// En passagerare: namn, ålder, Dåliga nerver och klass och tillägg på varje flyg (R2–R4)
function PassengerCard({
  index,
  passenger,
  booking,
  error,
  onChange,
}: {
  index: number;
  passenger: Passenger;
  booking: BookingLeg[];
  error: (id: string) => string | null;
  onChange: (passenger: Passenger) => void;
}) {
  const headingId = `p${index}`;
  const number = index + 1;
  return (
    <Card labelledBy={headingId} className="flex flex-col gap-5">
      <h2 id={headingId} className="text-section font-bold">
        Passagerare {number}
      </h2>
      <PersonFields
        index={index}
        person={passenger}
        error={error}
        onChange={(person) => onChange({ ...passenger, ...person })}
      />
      <Nerves
        id={`p${index}-nerver`}
        checked={passenger.nerves}
        onChange={(nerves) => onChange({ ...passenger, nerves })}
      />
      {booking.map((leg, i) => (
        <PassengerLegFields
          key={leg.key}
          passenger={passenger}
          index={index}
          leg={leg}
          legIndex={i}
          error={error(fieldIds.classes(i))}
          onChange={onChange}
        />
      ))}
    </Card>
  );
}

// Klassen och tilläggen för en passagerare på ett flyg (R2, R3)
function PassengerLegFields({
  passenger,
  index,
  leg,
  legIndex,
  error,
  onChange,
}: {
  passenger: Passenger;
  index: number;
  leg: BookingLeg;
  legIndex: number;
  error: string | null;
  onChange: (passenger: Passenger) => void;
}) {
  const passengerLeg = passenger.legs[legIndex];
  const addons = leg.addons[passengerLeg.classId] ?? [];
  const id = classId(index, legIndex);
  const setCount = (addonId: number, count: number) =>
    onChange({
      ...passenger,
      legs: passenger.legs.with(legIndex, { ...passengerLeg, addons: { ...passengerLeg.addons, [addonId]: count } }),
    });

  return (
    <fieldset className="flex flex-col gap-3 border-t border-line pt-4">
      <legend className="float-left mb-3 w-full font-bold">{LEG_NAMES[legIndex].title}</legend>
      <Field label="Klass" htmlFor={id} className="sm:max-w-sm">
        <select
          id={id}
          value={passengerLeg.classId}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? fieldIds.classes(legIndex) : undefined}
          onChange={(e) => onChange(changeClass(passenger, legIndex, leg, Number(e.target.value)))}
          className={fieldInputClass}
        >
          {leg.aircraft.classes.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}, {formatPrice(seatPrice(leg, c.id))}
            </option>
          ))}
        </select>
      </Field>
      {addons.length === 0 ? (
        <p className="text-small text-ink-muted">Inga tillägg i den här klassen.</p>
      ) : (
        <ul aria-label={`Tillägg på ${leg.of}`} className="flex flex-col divide-y divide-line">
          {addons.map((addon) => {
            const count = passengerLeg.addons[addon.id] ?? 0;
            return (
              <li key={addon.id} className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 py-3 first:pt-0">
                <div className="flex min-w-0 flex-col gap-0.5">
                  <span className="font-bold">{addon.name}</span>
                  <span className="text-small text-ink-muted">{addon.description}</span>
                  <span className="text-small">{formatPrice(addon.price)} / st</span>
                </div>
                <div className="flex items-center gap-3">
                  <RoundButton
                    label={`Färre ${addon.name}`}
                    disabled={count === 0}
                    onClick={() => setCount(addon.id, count - 1)}
                  >
                    −
                  </RoundButton>
                  {/* Antalet läses upp när det ändras */}
                  <span aria-live="polite" className="w-6 text-center text-lg font-bold tabular-nums">
                    {count}
                    <span className="sr-only"> {addon.name}</span>
                  </span>
                  <RoundButton
                    label={`Fler ${addon.name}`}
                    disabled={count >= MAX_ADDONS}
                    onClick={() => setCount(addon.id, count + 1)}
                  >
                    +
                  </RoundButton>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </fieldset>
  );
}

// Dåliga nerver med ett tips som visas när musen är över rutan eller den har
// fokus, och som skärmläsare läser som rutans beskrivning. Esc döljer tipset (R4, WCAG 1.4.13).
function Nerves({ id, checked, onChange }: { id: string; checked: boolean; onChange: (checked: boolean) => void }) {
  const [tip, setTip] = useState(false);
  const tipId = `${id}-tips`;
  return (
    <div
      className="relative self-start"
      onMouseEnter={() => setTip(true)}
      onMouseLeave={() => setTip(false)}
      onFocus={() => setTip(true)}
      onBlur={() => setTip(false)}
      onKeyDown={(e) => {
        if (e.key === "Escape") setTip(false);
      }}
    >
      <Checkbox id={id} label={NERVES} checked={checked} onChange={onChange} describedBy={tipId} />
      <p
        id={tipId}
        role="tooltip"
        className={`absolute top-full left-0 z-10 mt-2 w-max max-w-72 rounded-option px-3 py-2 text-small ${floatClass} ${tip ? "" : "hidden"}`}
      >
        Flyget blir mindre spännande, men kostar {formatPrice(NERVES_PRICE)} mer
      </p>
    </div>
  );
}
