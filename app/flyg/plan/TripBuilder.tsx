"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { type FleetAircraft, firstSeating, legTotal, type Seating } from "@/lib/fare-rules";
import type { Flight } from "@/lib/flight-rules";
import { formatPrice } from "@/lib/format";
import type { Search } from "@/lib/search";
import {
  bookingUrl,
  checkChoice,
  chooseAircraft,
  firstViews,
  keepChoice,
  LEG_NAMES,
  type LegChoice,
  legDone,
  type LegView,
  parseLegs,
  planUrl,
  resultsUrl,
} from "@/lib/trip";
import { buttonClass } from "../../components/Button";
import Card from "../../components/Card";
import Steps, { tripSteps } from "../Steps";
import TripOverview from "../TripOverview";
import LegCard, { legIds } from "./LegCard";

// Plan och klasser för de valda flygen, ett flyg i taget (R2, R3, R10,
// TRIP-026). Valen läses från adressen och skrivs tillbaka dit, så att sidan
// går att ladda om och besökaren kan gå tillbaka till flygen och hit igen
// utan att något försvinner. Vilket kort som är öppet hålls på sidan; efter
// en omladdning räknas det fram från valen (firstViews, TRIP-026-R5).
export default function TripBuilder({
  search,
  flights,
  fleet,
}: {
  search: Search;
  flights: Flight[];
  fleet: FleetAircraft[];
}) {
  const { travellers } = search;
  const params = Object.fromEntries(useSearchParams());
  const parsed = parseLegs(params, search);
  const legs = flights.map((f, i) => checkChoice(keepChoice(parsed?.[i], f.time), fleet, travellers));
  const aircraftOf = (leg: LegChoice) => fleet.find((a) => a.id === leg.aircraftId);
  // Saknas antalen (första gången, efter ett annat plan eller i en ändrad
  // adress) har varje klass 0 (TRIP-024-R2)
  const seatingOf = (leg: LegChoice): Seating => {
    const aircraft = aircraftOf(leg);
    return leg.seating ?? (aircraft ? firstSeating(aircraft) : {});
  };

  const [views, setViews] = useState<LegView[]>(() => firstViews(legs, travellers));
  // Har besökaren tryckt Klar på flyget utan att alla har en klass?
  const [tried, setTried] = useState<boolean[]>(() => legs.map(() => false));

  // Rubriken (eller sammanfattningen) som ska få fokus när en del öppnas
  // eller fälls ihop, så att fokus aldrig försvinner. Den väntar tills delen
  // finns på sidan, eftersom adressen kan läsas tillbaka en rendering senare.
  const focusId = useRef<string | null>(null);
  useEffect(() => {
    const target = focusId.current && document.getElementById(focusId.current);
    if (!target) return;
    focusId.current = null;
    target.focus();
  });

  const setView = (i: number, view: LegView, focus: string) => {
    focusId.current = focus;
    setViews((current) => current.with(i, view));
  };
  const setTriedAt = (i: number, value: boolean) => setTried((current) => current.with(i, value));
  const save = (i: number, leg: LegChoice) =>
    window.history.replaceState(null, "", planUrl(search, legs.with(i, leg)));

  // Välj: planet överst och klasserna under. Ett annat plan tar bort antalen (R10).
  function choose(i: number, aircraftId: number) {
    const leg = chooseAircraft(legs[i], aircraftId);
    if (leg !== legs[i]) setTriedAt(i, false);
    save(i, leg);
    setView(i, "classes", legIds(LEG_NAMES[i].key).classes);
  }

  // Klar: saknar någon en klass står det vad som saknas, annars fälls kortet
  // ihop och nästa flyg som inte är klart öppnas (TRIP-026-R3)
  function done(i: number) {
    if (!legDone(legs[i], travellers)) {
      setTriedAt(i, true);
      return;
    }
    setTriedAt(i, false);
    const next = views.findIndex((view, j) => j > i && view !== "folded");
    // Fokus till nästa korts rubrik, eller till det hopfällda kortet om inget är kvar
    const focus = next === -1 ? legIds(LEG_NAMES[i].key).folded : legIds(LEG_NAMES[next].key).card;
    setView(i, "folded", focus);
    if (next !== -1 && views[next] === "hidden") {
      setViews((current) => current.with(next, legs[next].aircraftId === null ? "aircraft" : "classes"));
    }
  }

  const tripTotal = flights.reduce((sum, f, i) => {
    const aircraft = aircraftOf(legs[i]);
    return sum + (aircraft ? legTotal(aircraft, f.price, seatingOf(legs[i])) : 0);
  }, 0);

  return (
    <div className="flex flex-col gap-8">
      <Steps steps={tripSteps(search, legs)} current={1} />

      <TripOverview flights={flights} legs={legs} fleet={fleet} travellers={travellers} />

      {flights.map((flight, i) => {
        const view = views[i];
        if (view === "hidden") return null;
        const ids = legIds(LEG_NAMES[i].key);
        return (
          <LegCard
            key={flight.id}
            legKey={LEG_NAMES[i].key}
            title={LEG_NAMES[i].title}
            of={LEG_NAMES[i].of}
            view={view}
            flight={flight}
            fleet={fleet}
            aircraft={aircraftOf(legs[i])}
            seating={seatingOf(legs[i])}
            travellers={travellers}
            tried={tried[i]}
            flightsHref={resultsUrl(search, legs)}
            onChoose={(id) => choose(i, id)}
            onShowAircraft={() => setView(i, "aircraft", ids.aircraft)}
            onChangeSeating={(seating) => save(i, { ...legs[i], seating })}
            onDone={() => done(i)}
            onOpen={() => setView(i, "classes", ids.classes)}
          />
        );
      })}

      <TripTotal
        total={tripTotal}
        travellers={travellers}
        seated={legs.every((leg) => legDone(leg, travellers))}
        nextHref={views.every((view) => view === "folded") ? bookingUrl(search, legs) : null}
      />
    </div>
  );
}

// Priset för hela resan, summan av flygens (R4). Vidare till resenärerna går
// det först när alla har en klass på varje flyg (TRIP-024-R4) och varje kort
// är hopfällt med Klar; då kommer Fortsätt (TRIP-012-R1).
function TripTotal({
  total,
  travellers,
  seated,
  nextHref,
}: {
  total: number;
  travellers: number;
  seated: boolean;
  nextHref: string | null;
}) {
  return (
    <Card className="flex flex-col gap-3">
      <p className="flex flex-wrap items-baseline justify-between gap-2">
        <span className="text-ink-muted">
          Totalt för resan, {travellers} {travellers === 1 ? "resenär" : "resenärer"}
        </span>
        <span className="text-xl font-bold">{formatPrice(total)}</span>
      </p>
      {nextHref && seated ? (
        <Link href={nextHref} className={`${buttonClass()} self-start`}>
          Fortsätt
        </Link>
      ) : (
        <p className="text-small text-ink-muted">
          {seated
            ? "Tryck Klar på varje flyg för att gå vidare."
            : "Lägg alla resenärer i en klass på varje flyg för att gå vidare."}
        </p>
      )}
    </Card>
  );
}
