"use client";

import { useRouter } from "next/navigation";
import { type ReactNode, useEffect, useRef, useState } from "react";
import { type FleetAircraft, firstSeating, legTotal, type PlanFlight, type Seating } from "@/lib/fare-rules";
import { formatPrice, travellersText } from "@/lib/format";
import { firstViews, LEG_NAMES, type LegView, type PlanChoice, placeTraveller } from "@/lib/trip";
import Card from "../../components/Card";
import LegCard, { legIds } from "./LegCard";

// Plan och klasser för de valda resorna, en resa i taget (R2, R3, R10, TRIP-026,
// TRIP-043), för flyg och charter (TRIP-039). Fortsätt på sista resan går vidare till resenärerna. Valen läses från adressen av sidan som visar
// den och skrivs tillbaka dit, så att sidan går att ladda om och besökaren kan gå
// tillbaka till resorna och hit igen utan att något försvinner. Vilket kort som är öppet hålls på
// sidan; efter en omladdning räknas det fram från valen (firstViews, TRIP-026-R5).
// urlFor är adressen med valen, och sidan visar stegen och Din resa själv.
export default function PlanBuilder({
  legs,
  flights,
  fleet,
  travellers,
  urlFor,
  emptyLink,
  nextHref,
  steps,
  overview,
  compareTime = true,
}: {
  legs: PlanChoice[];
  flights: PlanFlight[];
  fleet: FleetAircraft[];
  travellers: number;
  urlFor: (legs: PlanChoice[]) => string;
  emptyLink: { href: string; label: string };
  nextHref: string;
  steps: ReactNode;
  overview: ReactNode;
  // Charter ignorerar tidsfaktorn (TRIP-039-R2), så alla plan har samma flygtid och "Snabbast" säger inget (TRIP-042)
  compareTime?: boolean;
}) {
  const aircraftOf = (leg: PlanChoice) => fleet.find((a) => a.id === leg.aircraftId);
  // Saknas antalen (första gången, efter ett annat plan eller i en ändrad
  // adress) har varje klass 0 (TRIP-024-R2)
  const seatingOf = (leg: PlanChoice): Seating => {
    const aircraft = aircraftOf(leg);
    return leg.seating ?? (aircraft ? firstSeating(aircraft) : {});
  };
  const [views, setViews] = useState<LegView[]>(() => firstViews(legs, travellers));
  // Planet vars rad är öppen i varje flyg; undefined = planet som har resenärerna, om något (TRIP-043-R5)
  const [opened, setOpened] = useState<(number | null | undefined)[]>(() => legs.map(() => undefined));
  const router = useRouter();

  // Rubriken (eller sammanfattningen) som ska få fokus när ett kort fälls ihop,
  // så att fokus aldrig försvinner. Den väntar tills delen finns på sidan.
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
  const setOpenedAt = (i: number, aircraftId: number | null | undefined) =>
    setOpened((current) => current.with(i, aircraftId));
  const save = (i: number, leg: PlanChoice) => window.history.replaceState(null, "", urlFor(legs.with(i, leg)));

  // Ett antal ändras: planet tar alla resenärerna, och ett annat plan släpper dem (TRIP-043-R6)
  function place(i: number, aircraft: FleetAircraft, classId: number, by: number) {
    save(i, placeTraveller(legs[i], aircraft, classId, by));
  }

  // Fortsätt: kortet fälls ihop och nästa flyg som inte är klart öppnas (TRIP-043-R7, R8).
  // Finns inget kvar går det vidare till resenärerna.
  function proceed(i: number) {
    const next = views.findIndex((view, j) => j > i && view !== "folded");
    if (next === -1) {
      router.push(nextHref);
      return;
    }
    // Fokus till nästa korts rubrik
    setView(i, "folded", legIds(LEG_NAMES[next].key).card);
    if (views[next] === "hidden") setView(next, "open", legIds(LEG_NAMES[next].key).card);
  }

  const tripTotal = flights.reduce((sum, f, i) => {
    const aircraft = aircraftOf(legs[i]);
    return sum + (aircraft ? legTotal(aircraft, f.price, seatingOf(legs[i])) : 0);
  }, 0);

  return (
    <div className="flex flex-col gap-8">
      {steps}

      {overview}

      <p>
        Välj plan och fördela resenärerna på klasser.{flights.length > 1 && " Hemresan kommer sedan."}
      </p>

      {flights.map((flight, i) => {
        const view = views[i];
        if (view === "hidden") return null;
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
            openAircraft={opened[i] === undefined ? legs[i].aircraftId : opened[i]}
            seating={seatingOf(legs[i])}
            travellers={travellers}
            emptyLink={emptyLink}
            compareTime={compareTime}
            onOpenAircraft={(id) => setOpenedAt(i, id)}
            onChangeSeating={(aircraft, classId, by) => place(i, aircraft, classId, by)}
            onContinue={() => proceed(i)}
            onChange={() => {
              setOpenedAt(i, undefined);
              setView(i, "open", legIds(LEG_NAMES[i].key).card);
            }}
          />
        );
      })}

      <TripTotal total={tripTotal} travellers={travellers} />
    </div>
  );
}

// Priset för hela resan, summan av resornas (R4). Vidare till resenärerna går det med
// Fortsätt på sista resan, när alla har en klass på varje resa (TRIP-024-R4, TRIP-043-R7).
function TripTotal({ total, travellers }: { total: number; travellers: number }) {
  return (
    <Card>
      <p className="flex flex-wrap items-baseline justify-between gap-2">
        <span className="text-ink-muted">
          Totalt för resan, {travellersText(travellers)}
        </span>
        <span className="text-xl font-bold">{formatPrice(total)}</span>
      </p>
    </Card>
  );
}
