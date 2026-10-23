"use client";

import { useState } from "react";
import type { Airport } from "@/lib/db";
import Autocomplete from "./Autocomplete";
import Card from "./Card";
import DatePicker, { type TripDates } from "./DatePicker";
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
  const [dates, setDates] = useState<TripDates>({ outbound: null, return: null, roundTrip: true });
  const [passengers, setPassengers] = useState(1);

  const sameAirport = from !== null && to !== null && from.id === to.id;
  const fromError = sameAirport && lastAirportField === "from" ? SAME_AIRPORT_ERROR : null;
  const toError = sameAirport && lastAirportField === "to" ? SAME_AIRPORT_ERROR : null;

  return (
    <Card className="w-full max-w-5xl">
      {/* En rad på bredare skärmar. På mobil ett fält eller en grupp per rad. */}
      <form className="flex flex-col gap-3 md:flex-row md:items-start">
        <Field label="Från" htmlFor="from" error={fromError} className="md:flex-[1.25]">
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

        <Field label="Till" htmlFor="to" error={toError} className="md:flex-1">
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

        <DatePicker value={dates} onChange={setDates} className="md:w-56" />

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
