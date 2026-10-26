"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Schedules } from "@/lib/charter";
import { DEPARTURES, resultsUrl, runsOn } from "@/lib/charter-rules";
import { MIN_TRAVELLERS } from "@/lib/search";
import Button from "../components/Button";
import Card from "../components/Card";
import DatePicker, { type TripDates } from "../components/DatePicker";
import Field, { fieldInputClass } from "../components/Field";
import TravellerCount from "../components/TravellerCount";

// Utresan och hemresan: bara dagar då en resa går går att välja (TRIP-014-R2)
const MISSING = { outbound: "Välj datum för utresan.", return: "Välj datum för hemresan." };

// Sökformuläret på resmålets sida (TRIP-014-R1): Avresa från, Utresa, Hemresa och Resenärer.
// Man reser tur och retur och kommer tillbaka till flygplatsen man åkte från.
// schedules är dagarna tidtabellerna går, per avgångsflygplats, till och från resmålets flygplats.
export default function CharterSearchForm({ id, schedules }: { id: string; schedules: Schedules }) {
  const router = useRouter();
  const [from, setFrom] = useState(DEPARTURES[0].iata);
  const [dates, setDates] = useState<TripDates>({ outbound: null, return: null, roundTrip: true });
  const [travellers, setTravellers] = useState(MIN_TRAVELLERS);
  // Sant när besökaren tryckt Sök resor: då visas meddelanden för det som saknas
  const [submitted, setSubmitted] = useState(false);

  const runs = (airport: string) => (leg: "outbound" | "return", day: string) =>
    (leg === "outbound" ? schedules[airport].out : schedules[airport].back).some((t) => runsOn(t, day));

  // Ett datum som inte passar den nya flygplatsen tas bort (R2)
  function changeAirport(airport: string) {
    const fits = runs(airport);
    setFrom(airport);
    setDates({
      ...dates,
      outbound: dates.outbound && fits("outbound", dates.outbound) ? dates.outbound : null,
      return: dates.return && fits("return", dates.return) ? dates.return : null,
    });
  }

  const missing = {
    outbound: submitted && !dates.outbound ? MISSING.outbound : null,
    return: submitted && !dates.return ? MISSING.return : null,
  };

  function search(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    if (!dates.outbound || !dates.return) {
      // Fokus till det första som saknas
      document.getElementById(dates.outbound ? "return" : "outbound")?.focus();
      return;
    }
    router.push(resultsUrl(id, { from, outbound: dates.outbound, return: dates.return, travellers }));
  }

  return (
    <Card labelledBy="sok-resa" className="flex flex-col gap-4">
      <h2 id="sok-resa" className="text-section font-bold">
        Sök resa
      </h2>
      <form onSubmit={search} noValidate className="flex flex-col gap-3">
        <Field label="Avresa från" htmlFor="avresa">
          <select
            id="avresa"
            value={from}
            onChange={(e) => changeAirport(e.target.value)}
            className={fieldInputClass}
          >
            {DEPARTURES.map((airport) => (
              <option key={airport.iata} value={airport.iata}>
                {airport.name} ({airport.iata})
              </option>
            ))}
          </select>
        </Field>
        {/* Nytt val av flygplats bygger om väljaren med de datum som finns kvar */}
        <DatePicker key={from} value={dates} onChange={setDates} missing={missing} runs={runs(from)} />
        <TravellerCount value={travellers} onChange={setTravellers} />
        <Button type="submit">Sök resor</Button>
      </form>
    </Card>
  );
}
