"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  asForm,
  type BookingForm,
  type BookingLeg,
  bookingTotal,
  emptyForm,
  fitForm,
  isAdult,
  NERVES,
  NERVES_PRICE,
  type Passenger,
  removedAddons,
  travellerProblems,
  withoutBeerUnder18,
} from "@/lib/booking-rules";
import type { FleetAircraft } from "@/lib/fare-rules";
import type { Flight } from "@/lib/flight-rules";
import { formatPrice, travellersText } from "@/lib/format";
import type { Search } from "@/lib/search";
import { LEG_NAMES, type LegChoice, paymentUrl, planUrl } from "@/lib/trip";
import Button from "../../components/Button";
import Card, { floatClass } from "../../components/Card";
import Checkbox from "../../components/Checkbox";
import Message from "../../components/Message";
import Steps, { tripSteps } from "../Steps";
import { ClassesNote, ContactCard, LegFields, PersonFields, QuestionsCard } from "./FormParts";
import TripOverview from "../TripOverview";
import { FORM_KEY, store, useStored } from "./store";

// Det sidorna för resenärerna och betalningen får från servern
export type BookingProps = {
  search: Search;
  legs: LegChoice[];
  flights: Flight[];
  fleet: FleetAircraft[];
  booking: BookingLeg[];
  // Tilläggens namn efter id, för att berätta vilka som togs bort (bara Resenärer)
  addonNames?: Record<number, string>;
};

// Formuläret som det är sparat i fliken, anpassat till resan som den ser ut
// nu (R10), eller undefined innan sidan har läst det. removed är tilläggen som
// togs bort för att planet eller antalen per klass ändrats (TRIP-041-R2).
export function useBookingForm({ search, booking, addonNames = {} }: Pick<BookingProps, "search" | "booking" | "addonNames">) {
  const stored = useStored(FORM_KEY);
  if (stored === undefined) return undefined;
  const saved = asForm(stored) ?? emptyForm("");
  return { form: fitForm(saved, booking, search.travellers), removed: removedAddons(saved, booking, search.travellers, addonNames) };
}

export const saveForm = (form: BookingForm) => store(FORM_KEY, form);

// Resenärerna, deras tillägg, kontaktpersonen och de tre frågorna (R1–R6). Klassen är vald i
// steget Plan och klass och visas bara som text (TRIP-041-R1).
// Allt sparas i fliken medan det fylls i. Till betalning går det först när
// allt stämmer; annars blir fälten som saknas röda med vad som ska göras, och
// fokus flyttas till det första.
export default function TravellersForm({ search, legs, flights, fleet, booking, addonNames }: BookingProps) {
  const router = useRouter();
  const state = useBookingForm({ search, booking, addonNames });
  const form = state?.form;
  // Hur många gånger besökaren försökt gå vidare med något som saknas. Varje
  // försök ritar om sidan, så att fokus flyttas även när felen redan syns.
  const [attempts, setAttempts] = useState(0);
  // Tilläggen som togs bort av ett ändrat plan: de står kvar efter första ändringen i
  // formuläret, som sparar den nya formen (TRIP-041-R2)
  const [kept, setKept] = useState<string[]>([]);
  const removed = state && state.removed.length > 0 ? state.removed : kept;

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
  // Sparar formuläret och minns vilka tillägg som togs bort av ett ändrat plan
  function save(changed: BookingForm) {
    if (state && state.removed.length > 0) setKept(state.removed);
    saveForm(changed);
  }
  const setPassenger = (p: number, passenger: Passenger) =>
    save({ ...form, passengers: form.passengers.with(p, passenger) });

  function next() {
    const first = Object.keys(travellerProblems(form!, booking))[0];
    if (first) {
      setAttempts((n) => n + 1);
      focusId.current = first;
      return;
    }
    // Ett id för bokningen, så att två tryck på Betala blir en bokning (R8)
    save({ ...form!, requestId: form!.requestId || crypto.randomUUID() });
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
      <ClassesNote removed={removed} planHref={planUrl(search, legs)} />

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

      <ContactCard
        contact={form.contact}
        error={error}
        onChange={(contact) => save({ ...form, contact })}
      />
      <QuestionsCard checks={form.checks} error={error} onChange={(checks) => save({ ...form, checks })} />

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

// En passagerare: namn, ålder, Dåliga nerver och klass (bara text) och tillägg på varje flyg (R2–R4).
// Blir åldern under 18 tas ölen bort, och kortet säger varför (TRIP-029-R4).
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
  const [beerRemoved, setBeerRemoved] = useState(false);
  return (
    <Card labelledBy={headingId} className="flex flex-col gap-5">
      <h2 id={headingId} className="text-section font-bold">
        Passagerare {number}
      </h2>
      <PersonFields
        index={index}
        person={passenger}
        error={error}
        onChange={(person) => {
          const { passenger: changed, removed } = withoutBeerUnder18({ ...passenger, ...person }, booking);
          if (removed) setBeerRemoved(true);
          else if (isAdult(changed.age)) setBeerRemoved(false);
          onChange(changed);
        }}
      />
      {/* Alltid på sidan, så att skärmläsare läser texten när den kommer; tom tar den ingen plats */}
      <p role="status" className={beerRemoved ? "text-small text-ink-muted" : "sr-only"}>
        {beerRemoved ? "Ölen togs bort eftersom passageraren är under 18 år." : ""}
      </p>
      <Nerves
        id={`p${index}-nerver`}
        checked={passenger.nerves}
        onChange={(nerves) => onChange({ ...passenger, nerves })}
      />
      {booking.map((leg, i) => (
        <LegFields
          key={leg.key}
          leg={leg}
          title={LEG_NAMES[i].title}
          passengerLeg={passenger.legs[i]}
          age={passenger.age}
          onCount={(addonId, count) => {
            const passengerLeg = passenger.legs[i];
            const changed = { ...passengerLeg, addons: { ...passengerLeg.addons, [addonId]: count } };
            onChange({ ...passenger, legs: passenger.legs.with(i, changed) });
          }}
        />
      ))}
    </Card>
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
