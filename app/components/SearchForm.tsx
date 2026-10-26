"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Airport } from "@/lib/db";
import { MIN_TRAVELLERS, searchUrl } from "@/lib/search";
import Autocomplete from "./Autocomplete";
import Button from "./Button";
import Card from "./Card";
import DatePicker, { type TripDates } from "./DatePicker";
import Field, { fieldInputClass } from "./Field";
import TravellerCount from "./TravellerCount";

const SAME_AIRPORT_ERROR = "Ajja bajja, du måste flyga någonstans!";
// Fälten som måste vara ifyllda när besökaren trycker Sök (TRIP-010-R1)
const MISSING = {
  from: "Välj var du vill flyga från.",
  to: "Välj vart du vill flyga.",
  outbound: "Välj datum för utresan.",
  return: "Välj datum för hemresan.",
};

// Det formuläret visar från början, t.ex. sökningen på resultatsidan (TRIP-010-R2)
export type SearchFormValues = { from: Airport; to: Airport; dates: TripDates; travellers: number };

export default function SearchForm({ initial }: { initial?: SearchFormValues }) {
  const router = useRouter();
  const [from, setFrom] = useState<Airport | null>(initial?.from ?? null);
  const [to, setTo] = useState<Airport | null>(initial?.to ?? null);
  // Fältet som valdes sist. Är från och till samma visas felet där.
  const [lastAirportField, setLastAirportField] = useState<"from" | "to">("to");
  const [dates, setDates] = useState<TripDates>(
    initial?.dates ?? { outbound: null, return: null, roundTrip: true },
  );
  const [passengers, setPassengers] = useState(initial?.travellers ?? MIN_TRAVELLERS);
  // Sant när besökaren tryckt Sök: då visas meddelanden för det som saknas
  const [submitted, setSubmitted] = useState(false);

  const sameAirport = from !== null && to !== null && from.id === to.id;
  const missing = {
    from: submitted && !from ? MISSING.from : null,
    to: submitted && !to ? MISSING.to : null,
    outbound: submitted && !dates.outbound ? MISSING.outbound : null,
    return: submitted && dates.roundTrip && !dates.return ? MISSING.return : null,
  };
  const fromError = sameAirport && lastAirportField === "from" ? SAME_AIRPORT_ERROR : missing.from;
  const toError = sameAirport && lastAirportField === "to" ? SAME_AIRPORT_ERROR : missing.to;

  function search(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    if (!from || !to || sameAirport || !dates.outbound || (dates.roundTrip && !dates.return)) return;
    router.push(
      searchUrl({ from: from.iata, to: to.iata, outbound: dates.outbound, return: dates.return, travellers: passengers }),
    );
  }

  return (
    <Card className="w-full max-w-5xl">
      {/* En rad på bredare skärmar. På mobil ett fält eller en grupp per rad. */}
      <form onSubmit={search} className="flex flex-col gap-3 md:flex-row md:items-start">
        <Field label="Från" htmlFor="from" error={fromError} className="md:flex-[1.25]">
          <AirportInput
            id="from"
            placeholder="Varifrån?"
            error={fromError}
            initial={initial?.from}
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
            initial={initial?.to}
            onSelect={(airport) => {
              setTo(airport);
              if (airport) setLastAirportField("to");
            }}
          />
        </Field>

        <DatePicker
          value={dates}
          onChange={setDates}
          missing={{ outbound: missing.outbound, return: missing.return }}
          className="md:w-52"
        />

        <TravellerCount value={passengers} onChange={setPassengers} className="md:w-44" />

        {/* Till höger om Resenärer, på mobil under, i fältens höjd */}
        <Button type="submit" className="md:h-14.5 md:px-6">
          Sök
        </Button>
      </form>
    </Card>
  );
}

function AirportInput({
  id,
  placeholder,
  error,
  initial,
  onSelect,
}: {
  id: string;
  placeholder: string;
  error: string | null;
  initial?: Airport;
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
      initial={initial}
      onSelect={onSelect}
    />
  );
}
