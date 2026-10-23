"use client";

import { Suspense, use, useState } from "react";
import { io } from "next/cache";
import type { Airport } from "@/lib/db";
import { bookableRange, dateError } from "@/lib/dates";
import Autocomplete from "./Autocomplete";
import Card from "./Card";
import Checkbox from "./Checkbox";
import Field, { fieldInputClass } from "./Field";
import RoundButton from "./RoundButton";

const MIN_PASSENGERS = 1;
const MAX_PASSENGERS = 10;
const SAME_AIRPORT_ERROR = "Ajja bajja, du måste flyga någonstans!";

export default function SearchForm() {
  const [from, setFrom] = useState<Airport | null>(null);
  const [to, setTo] = useState<Airport | null>(null);
  // Fältet som valdes sist. Är från och till samma visas felet där.
  const [lastAirportField, setLastAirportField] = useState<"from" | "to">("to");
  const [date, setDate] = useState("");
  const [passengers, setPassengers] = useState(1);
  const [returnTrip, setReturnTrip] = useState(false);

  const sameAirport = from !== null && to !== null && from.id === to.id;
  const fromError = sameAirport && lastAirportField === "from" ? SAME_AIRPORT_ERROR : null;
  const toError = sameAirport && lastAirportField === "to" ? SAME_AIRPORT_ERROR : null;

  return (
    <Card className="flex w-full max-w-5xl flex-col gap-4">
      {/* En rad på bredare skärmar. På mobil Från och Till i full bredd,
          Datum och Resenärer bredvid varandra under. */}
      <form className="grid grid-cols-2 gap-3 md:flex md:items-start">
        <Field label="Från" htmlFor="from" error={fromError} className="col-span-2 md:flex-[1.25]">
          <AirportInput
            id="from"
            placeholder="Varifrån?"
            error={fromError}
            onSelect={(airport) => {
              setFrom(airport);
              if (airport) setLastAirportField("from");
            }}
          />
        </Field>

        <Field label="Till" htmlFor="to" error={toError} className="col-span-2 md:flex-1">
          <AirportInput
            id="to"
            placeholder="Vart vill du?"
            error={toError}
            onSelect={(airport) => {
              setTo(airport);
              if (airport) setLastAirportField("to");
            }}
          />
        </Field>

        {/* Datumgränserna beror på dagens datum, så de räknas ut i webbläsaren.
            Under tiden visas ett inaktiverat fält. */}
        <Suspense
          fallback={
            <Field label="Datum" htmlFor="date" className="md:w-48">
              <input id="date" type="date" disabled className={`${fieldInputClass} text-transparent`} />
            </Field>
          }
        >
          <DateInput value={date} onChange={setDate} />
        </Suspense>

        {/* Etiketten syns i rutan; gruppens namn säger vad siffran är */}
        <Field label="Resenärer" className="md:w-48">
          <div role="group" aria-label="Antal resenärer">
            <span className="tabular-nums">{passengers}</span>
            {/* Knapparna mitt i rutans höjd, till höger om etikett och siffra */}
            <div className="absolute inset-y-0 right-3 flex items-center gap-2">
              <RoundButton
                label="Färre resenärer"
                disabled={passengers <= MIN_PASSENGERS}
                onClick={() => setPassengers((p) => p - 1)}
              >
                −
              </RoundButton>
              <RoundButton
                label="Fler resenärer"
                disabled={passengers >= MAX_PASSENGERS}
                onClick={() => setPassengers((p) => p + 1)}
              >
                +
              </RoundButton>
            </div>
          </div>
        </Field>
      </form>

      <Checkbox label="Boka returresa" checked={returnTrip} onChange={setReturnTrip} className="self-start" />
    </Card>
  );
}

function AirportInput({
  id,
  placeholder,
  error,
  onSelect,
}: {
  id: string;
  placeholder: string;
  error: string | null;
  onSelect: (airport: Airport | null) => void;
}) {
  return (
    <Autocomplete<Airport>
      id={id}
      placeholder={placeholder}
      className={`${fieldInputClass} ${error ? "text-danger" : ""}`}
      searchUrl="/api/airports"
      label={(a) => `${a.name} (${a.iata})`}
      detail={(a) => a.country}
      badge={(a) => a.iata}
      emptyText="Inga flygplatser matchar"
      errorId={error ? `${id}-error` : undefined}
      onSelect={onSelect}
    />
  );
}

function DateInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  // Säger åt Next att vänta med detta tills sidan körs på riktigt,
  // så att "idag" blir besökarens idag och inte dagen sidan byggdes.
  use(io());
  const [focused, setFocused] = useState(false);

  const range = bookableRange(new Date());
  // Kalendern hindrar datum utanför gränserna, men man kan fortfarande
  // skriva in ett datum för hand
  const error = dateError(value, range);

  // Datumfält har inget stöd för placeholder, så vi lägger en egen text
  // ovanpå när fältet är tomt och inte markerat.
  const showPlaceholder = !value && !focused;
  const textColor = showPlaceholder ? "text-transparent" : error ? "text-danger" : "";

  return (
    <Field label="Datum" htmlFor="date" error={error} className="md:w-48">
      <div className="relative">
        <input
          id="date"
          type="date"
          min={range.min}
          max={range.max}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onClick={(e) => e.currentTarget.showPicker?.()}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? "date-error" : undefined}
          className={`${fieldInputClass} ${textColor}`}
        />
        {showPlaceholder && (
          <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center text-ink-faint">
            Välj datum
          </span>
        )}
      </div>
    </Field>
  );
}

