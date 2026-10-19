"use client";

import { Suspense, use, useState } from "react";
import { io } from "next/cache";
import type { Airport } from "@/lib/db";
import Autocomplete from "./Autocomplete";
import { Card, inputClass, RoundButton } from "./ui";

const MIN_PASSENGERS = 1;
const MAX_PASSENGERS = 10;
const SAME_AIRPORT_ERROR = "Ajja bajja, du måste flyga någonstans!";

// Fel visas diskret: värdet i fältet blir rött och en liten röd text visas under
const errorTextClass = "text-red-400";

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
      {/* En rad på bredare skärmar, staplat på mobil */}
      <form className="flex flex-col gap-3 md:flex-row md:items-start">
        <Field label="Från" htmlFor="from" error={fromError} className="md:flex-1">
          <AirportInput
            id="from"
            placeholder="Från"
            error={fromError}
            onSelect={(airport) => {
              setFrom(airport);
              if (airport) setLastAirportField("from");
            }}
          />
        </Field>

        <Field label="Till" htmlFor="to" error={toError} className="md:flex-1">
          <AirportInput
            id="to"
            placeholder="Till"
            error={toError}
            onSelect={(airport) => {
              setTo(airport);
              if (airport) setLastAirportField("to");
            }}
          />
        </Field>

        <Field label="Datum" htmlFor="date" className="md:w-52">
          {/* Datumgränserna beror på dagens datum, så de räknas ut i webbläsaren.
              Under tiden visas ett inaktiverat fält. */}
          <Suspense
            fallback={<input id="date" type="date" disabled className={inputClass} />}
          >
            <DateInput value={date} onChange={setDate} />
          </Suspense>
        </Field>

        <Field label="Antal resenärer">
          <div className="flex h-14 items-center justify-between gap-4 rounded-lg border-2 border-wine bg-neutral-900 px-4">
            <div className="flex items-center gap-2">
              <PersonIcon />
              <span className="w-5 text-lg tabular-nums">{passengers}</span>
            </div>
            <div className="flex gap-2">
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

      <label className="flex cursor-pointer items-center gap-2 self-start text-sm text-neutral-300">
        <input
          type="checkbox"
          checked={returnTrip}
          onChange={(e) => setReturnTrip(e.target.checked)}
          className="h-4 w-4 cursor-pointer accent-wine"
        />
        Boka returresa
      </label>
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
      className={`${inputClass} ${error ? errorTextClass : ""}`}
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

  const min = toDateString(new Date());
  const max = toDateString(addMonths(new Date(), 6));

  // Kalendern hindrar datum utanför gränserna, men man kan fortfarande
  // skriva in ett datum för hand. Datumen är "YYYY-MM-DD" och går därför
  // att jämföra som text.
  const error =
    value !== "" && value < min
      ? "Datumet har redan passerat."
      : value > max
        ? "Du kan boka max 6 månader framåt."
        : null;

  // Datumfält har inget stöd för placeholder, så vi lägger en egen text
  // ovanpå när fältet är tomt och inte markerat.
  const showPlaceholder = !value && !focused;
  const textColor = showPlaceholder ? "text-transparent" : error ? errorTextClass : "";

  return (
    <>
      <div className="relative">
        <input
          id="date"
          type="date"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onClick={(e) => e.currentTarget.showPicker?.()}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? "date-error" : undefined}
          className={`${inputClass} ${textColor}`}
        />
        {showPlaceholder && (
          <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-neutral-500">
            Datum
          </span>
        )}
      </div>
      <FieldError id="date-error" message={error} />
    </>
  );
}

function Field({
  label,
  htmlFor,
  error = null,
  className = "",
  children,
}: {
  label: string;
  htmlFor?: string;
  error?: string | null;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      {/* Etiketten syns inte (placeholdern räcker), men skärmläsare läser upp den */}
      <label htmlFor={htmlFor} className="sr-only">
        {label}
      </label>
      {children}
      {htmlFor && <FieldError id={`${htmlFor}-error`} message={error} />}
    </div>
  );
}

function FieldError({ id, message }: { id: string; message: string | null }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className={`mt-1.5 text-xs ${errorTextClass}`}>
      {message}
    </p>
  );
}

function PersonIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className="h-6 w-6 text-wine-light"
    >
      <circle cx="12" cy="7" r="4" />
      <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8z" />
    </svg>
  );
}

// "YYYY-MM-DD" i lokal tid (toISOString() ger UTC och kan bli fel dag)
function toDateString(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

// Lägger till månader utan att "rinna över", t.ex. 31 aug + 6 mån = 28/29 feb
function addMonths(d: Date, months: number) {
  const result = new Date(d.getFullYear(), d.getMonth() + months, 1);
  const lastDay = new Date(result.getFullYear(), result.getMonth() + 1, 0).getDate();
  result.setDate(Math.min(d.getDate(), lastDay));
  return result;
}
