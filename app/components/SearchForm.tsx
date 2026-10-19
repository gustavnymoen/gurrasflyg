"use client";

import { Suspense, use, useState } from "react";
import { io } from "next/cache";

const MIN_PASSENGERS = 1;
const MAX_PASSENGERS = 9;

// Gemensam stil för alla inmatningsfält: vinröd ram, mörk bakgrund
const inputClass =
  "w-full rounded-lg border-2 border-wine bg-neutral-800 px-4 py-3 text-foreground placeholder:text-neutral-500 outline-none focus:border-wine-light";

export default function SearchForm() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");
  const [passengers, setPassengers] = useState(1);

  return (
    <form className="flex w-full max-w-md flex-col gap-5">
      <Field label="Från" htmlFor="from">
        <input
          id="from"
          type="text"
          placeholder="Varifrån reser du? T.ex. Stockholm"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          className={inputClass}
        />
      </Field>

      <Field label="Till" htmlFor="to">
        <input
          id="to"
          type="text"
          placeholder="Vart vill du åka? T.ex. London"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          className={inputClass}
        />
      </Field>

      <Field label="Datum" htmlFor="date">
        {/* Datumgränserna beror på dagens datum, så de räknas ut i webbläsaren.
            Under tiden visas ett inaktiverat fält. */}
        <Suspense
          fallback={<input id="date" type="date" disabled className={inputClass} />}
        >
          <DateInput value={date} onChange={setDate} />
        </Suspense>
      </Field>

      <Field label="Antal resenärer">
        <div className="flex items-center justify-between rounded-lg border-2 border-wine bg-neutral-800 px-4 py-2">
          <div className="flex items-center gap-2">
            <PersonIcon />
            <span className="text-lg tabular-nums">{passengers}</span>
          </div>
          <div className="flex gap-2">
            <CounterButton
              label="Färre resenärer"
              disabled={passengers <= MIN_PASSENGERS}
              onClick={() => setPassengers((p) => p - 1)}
            >
              −
            </CounterButton>
            <CounterButton
              label="Fler resenärer"
              disabled={passengers >= MAX_PASSENGERS}
              onClick={() => setPassengers((p) => p + 1)}
            >
              +
            </CounterButton>
          </div>
        </div>
      </Field>
    </form>
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

  const today = new Date();
  const maxDate = addMonths(today, 6);

  // Datumfält har inget stöd för placeholder, så vi lägger en egen text
  // ovanpå när fältet är tomt och inte markerat.
  const showPlaceholder = !value && !focused;

  return (
    <div className="relative">
      <input
        id="date"
        type="date"
        min={toDateString(today)}
        max={toDateString(maxDate)}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onClick={(e) => e.currentTarget.showPicker?.()}
        className={`${inputClass} ${showPlaceholder ? "text-transparent" : ""}`}
      />
      {showPlaceholder && (
        <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-neutral-500">
          När vill du resa?
        </span>
      )}
    </div>
  );
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-sm font-medium text-neutral-300">
        {label}
      </label>
      {children}
    </div>
  );
}

function CounterButton({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string;
  disabled: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-wine text-xl leading-none transition-colors hover:bg-wine disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent"
    >
      {children}
    </button>
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
