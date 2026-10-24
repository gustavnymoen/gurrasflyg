"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { everyoneSeated, type FleetAircraft, firstSeating, legTotal } from "@/lib/fare-rules";
import type { Flight } from "@/lib/flight-rules";
import { formatPrice } from "@/lib/format";
import type { Search } from "@/lib/search";
import {
  checkChoice,
  chooseAircraft,
  keepChoice,
  type LegChoice,
  parseLegs,
  parseStep,
  planUrl,
  resultsUrl,
  type TripStep,
} from "@/lib/trip";
import Button from "../../components/Button";
import Card from "../../components/Card";
import FlightLine from "../FlightLine";
import Steps from "../Steps";
import AircraftList from "./AircraftList";
import AircraftTime from "./FlightTime";
import ClassList from "./ClassList";

// Utresan och hemresan, med och utan stor bokstav
const LEG_NAMES = [
  { title: "Utresa", of: "utresan" },
  { title: "Hemresa", of: "hemresan" },
];

// Stegen Plan och Klasser för de valda flygen (R2, R3, R10). Valen läses från
// adressen och skrivs tillbaka dit, så att sidan går att ladda om och
// besökaren kan gå tillbaka till flygen och hit igen utan att något försvinner.
// Ett nytt steg blir en ny rad i webbläsarens historik, ett ändrat val inte.
export default function TripBuilder({
  search,
  flights,
  fleet,
}: {
  search: Search;
  flights: Flight[];
  fleet: FleetAircraft[];
}) {
  const params = Object.fromEntries(useSearchParams());
  const parsed = parseLegs(params, search);
  const legs = flights.map((f, i) => checkChoice(keepChoice(parsed?.[i], f.time), fleet, search.travellers));
  const allChosen = legs.every((leg) => leg.aircraftId !== null);
  const step: TripStep = parseStep(params) === "classes" && allChosen ? "classes" : "aircraft";
  const aircraftOf = (leg: LegChoice) => fleet.find((a) => a.id === leg.aircraftId);

  // Planet och antalen per klass för varje flyg, när alla flyg har ett plan.
  // Saknas antalen (första gången, efter ett annat plan eller i en ändrad
  // adress) har varje klass 0 (TRIP-024-R2).
  const seated = allChosen
    ? legs.map((leg) => {
        const aircraft = aircraftOf(leg)!;
        return { aircraft, seating: leg.seating ?? firstSeating(aircraft) };
      })
    : [];

  // Har besökaren försökt gå vidare utan att välja plan för alla flyg?
  const [tried, setTried] = useState(false);

  // Rubriken för steget får fokus när besökaren byter steg, inte när sidan öppnas
  const heading = useRef<HTMLHeadingElement>(null);
  const moveFocus = useRef(false);
  useEffect(() => {
    if (!moveFocus.current) return;
    moveFocus.current = false;
    heading.current?.focus();
  }, [step]);

  function save(next: LegChoice[], nextStep: TripStep) {
    const url = planUrl(search, next, nextStep);
    if (nextStep === step) window.history.replaceState(null, "", url);
    else {
      moveFocus.current = true;
      window.history.pushState(null, "", url);
    }
  }

  const update = (i: number, leg: LegChoice) => save(legs.with(i, leg), step);

  function toClasses() {
    setTried(true);
    if (!allChosen) return;
    save(legs.map((leg, i) => ({ ...leg, seating: seated[i].seating })), "classes");
  }

  const steps = [
    { label: "Flyg", href: resultsUrl(search, legs) },
    { label: "Plan", onClick: () => save(legs, "aircraft") },
    { label: "Klasser" },
    { label: "Resenärer" },
  ];

  return (
    <div className="flex flex-col gap-8">
      <Steps steps={steps} current={step === "aircraft" ? 1 : 2} />

      <Overview flights={flights} legs={legs} fleet={fleet} travellers={search.travellers} />

      {step === "aircraft" ? (
        <>
          {flights.map((flight, i) => (
            <AircraftList
              key={flight.id}
              headingRef={i === 0 ? heading : undefined}
              title={`Plan för ${LEG_NAMES[i].of}`}
              flight={flight}
              fleet={fleet}
              travellers={search.travellers}
              chosenId={legs[i].aircraftId}
              missing={tried && legs[i].aircraftId === null ? `Välj ett plan för ${LEG_NAMES[i].of}.` : null}
              onChoose={(id) => update(i, chooseAircraft(legs[i], id))}
            />
          ))}
          <Button onClick={toClasses} className="self-start">
            Fortsätt
          </Button>
        </>
      ) : (
        <>
          {flights.map((flight, i) => (
            <ClassList
              key={flight.id}
              headingRef={i === 0 ? heading : undefined}
              title={`Klasser på ${LEG_NAMES[i].of}`}
              totalLabel={`Totalt för ${LEG_NAMES[i].of}`}
              flight={flight}
              aircraft={seated[i].aircraft}
              travellers={search.travellers}
              seating={seated[i].seating}
              onChange={(seating) => update(i, { ...legs[i], seating })}
            />
          ))}
          <TripTotal
            total={flights.reduce((sum, f, i) => sum + legTotal(seated[i].aircraft, f.price, seated[i].seating), 0)}
            travellers={search.travellers}
            done={everyoneSeated(seated.map((s) => s.seating), search.travellers)}
          />
        </>
      )}
    </div>
  );
}

// De valda flygen och antalet resenärer (R1). Under ett flyg med valt plan
// står planet, flygtiden och ankomsten, samma som i listan med plan (R7, TRIP-024-R1).
function Overview({
  flights,
  legs,
  fleet,
  travellers,
}: {
  flights: Flight[];
  legs: LegChoice[];
  fleet: FleetAircraft[];
  travellers: number;
}) {
  return (
    <Card size="compact" className="flex flex-col gap-3">
      <h2 className="text-lg font-bold">Din resa</h2>
      <ul className="flex flex-col divide-y divide-line">
        {flights.map((flight, i) => {
          const aircraft = fleet.find((a) => a.id === legs[i].aircraftId);
          return (
            <li key={flight.id} className="py-2 first:pt-0 last:pb-0">
              <p className="text-small text-ink-muted">{LEG_NAMES[i].title}</p>
              <FlightLine flight={flight} />
              {aircraft && (
                <p className="text-small text-ink-muted">
                  {aircraft.name} · <AircraftTime flight={flight} aircraft={aircraft} />
                </p>
              )}
            </li>
          );
        })}
      </ul>
      <p className="text-small text-ink-muted">
        {travellers} {travellers === 1 ? "resenär" : "resenärer"}
      </p>
    </Card>
  );
}

// Priset för hela resan, summan av flygens (R4). Vidare till resenärerna går
// det först när alla har en klass på varje flyg (TRIP-024-R4).
function TripTotal({ total, travellers, done }: { total: number; travellers: number; done: boolean }) {
  return (
    <Card className="flex flex-col gap-3">
      <p className="flex flex-wrap items-baseline justify-between gap-2">
        <span className="text-ink-muted">
          Totalt för resan, {travellers} {travellers === 1 ? "resenär" : "resenärer"}
        </span>
        <span className="text-xl font-bold">{formatPrice(total)}</span>
      </p>
      <p className="text-small text-ink-muted">
        {done
          ? "Snart fyller du i resenärerna och bokar här."
          : "Lägg alla resenärer i en klass på varje flyg för att gå vidare."}
      </p>
    </Card>
  );
}
