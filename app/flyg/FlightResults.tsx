"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { formatDay } from "@/lib/dates";
import { type Flight, searchDelay, type SortBy, sortFlights, totalPrice } from "@/lib/flight-rules";
import { formatPrice } from "@/lib/format";
import type { Search } from "@/lib/search";
import { keepChoice, type LegChoice, planUrl } from "@/lib/trip";
import Button, { buttonClass } from "../components/Button";
import Card from "../components/Card";
import FlightCard, { FlightSkeleton } from "./FlightCard";
import FlightLine from "./FlightLine";
import Steps from "./Steps";

type Step = "outbound" | "return" | "summary";

const STEPS: { step: Step; label: string }[] = [
  { step: "outbound", label: "Utresa" },
  { step: "return", label: "Hemresa" },
  { step: "summary", label: "Din resa" },
];

// Sökresultaten: först en simulerad sökning med skelettkort (R3), sedan
// flygen att välja bland, för tur och retur i två steg (R8), och till sist
// den valda resan (R9) med Fortsätt till plan och klasser (TRIP-011-R1).
// inbound är null för en enkel resa; cities är städerna för sökningens Från
// och Till. chosen är det som valts tidigare, när besökaren kommer tillbaka
// från plan och klasser (TRIP-011-R10).
export default function FlightResults({
  search,
  cities,
  outbound,
  inbound,
  chosen,
}: {
  search: Search;
  cities: { from: string; to: string };
  outbound: Flight[];
  inbound: Flight[] | null;
  chosen: LegChoice[] | null;
}) {
  const ready = useSimulatedSearch();
  const started = useHydrated();
  const [sortBy, setSortBy] = useState<SortBy>("time");
  const [chosenOutbound, setChosenOutbound] = useState<Flight | null>(
    () => outbound.find((f) => f.time === chosen?.[0].time) ?? null,
  );
  const [chosenReturn, setChosenReturn] = useState<Flight | null>(
    () => inbound?.find((f) => f.time === chosen?.[1]?.time) ?? null,
  );

  const step: Step = !chosenOutbound ? "outbound" : inbound && !chosenReturn ? "return" : "summary";

  // Rubriken för steget får fokus när besökaren byter steg, inte när sidan öppnas
  const heading = useRef<HTMLHeadingElement>(null);
  const moveFocus = useRef(false);
  useEffect(() => {
    if (!moveFocus.current) return;
    moveFocus.current = false;
    heading.current?.focus();
  }, [step]);

  function choose(flight: Flight) {
    moveFocus.current = true;
    if (step === "outbound") setChosenOutbound(flight);
    else setChosenReturn(flight);
  }

  // Att ändra ett tidigare steg tar bort valen i stegen efter (R8)
  function changeOutbound() {
    moveFocus.current = true;
    setChosenOutbound(null);
    setChosenReturn(null);
  }

  function changeReturn() {
    moveFocus.current = true;
    setChosenReturn(null);
  }

  const status = !started ? "" : ready ? `${outbound.length} flyg hittades` : "Söker flyg…";

  return (
    <div className="flex flex-col gap-6">
      {/* Skärmläsare får höra när sökningen börjar och hur många flyg den hittade (R3) */}
      <p role="status" className="sr-only">
        {status}
      </p>

      {inbound && <Steps steps={STEPS} current={STEPS.findIndex((s) => s.step === step)} />}

      {step === "outbound" && (
        <FlightList
          headingRef={heading}
          title={`Utresa ${cities.from} – ${cities.to}`}
          date={search.outbound}
          flights={outbound}
          travellers={search.travellers}
          ready={ready}
          sortBy={sortBy}
          onSort={setSortBy}
          onChoose={choose}
        />
      )}

      {step === "return" && chosenOutbound && inbound && search.return && (
        <>
          <ChosenOutbound flight={chosenOutbound} onChange={changeOutbound} />
          <FlightList
            headingRef={heading}
            title={`Hemresa ${cities.to} – ${cities.from}`}
            date={search.return}
            flights={inbound}
            travellers={search.travellers}
            ready
            sortBy={sortBy}
            onSort={setSortBy}
            onChoose={choose}
          />
        </>
      )}

      {step === "summary" && chosenOutbound && (
        <Summary
          headingRef={heading}
          outbound={chosenOutbound}
          inbound={chosenReturn}
          travellers={search.travellers}
          next={planUrl(search, [
            keepChoice(chosen?.[0], chosenOutbound.time),
            ...(chosenReturn ? [keepChoice(chosen?.[1], chosenReturn.time)] : []),
          ])}
          onChangeOutbound={changeOutbound}
          onChangeReturn={changeReturn}
        />
      )}
    </div>
  );
}

// Den simulerade sökningen: sant när den är klar, 1–4 sekunder efter att sidan
// startat i webbläsaren (R3)
function useSimulatedSearch() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setReady(true), searchDelay(Math.random()));
    return () => clearTimeout(timer);
  }, []);
  return ready;
}

// Sant när sidan körs i webbläsaren. "Söker flyg…" visas först då, alltså
// när sökningens timer har startat, och läses upp som en ändring.
function useHydrated() {
  return useSyncExternalStore(subscribeNever, () => true, () => false);
}
// Inget att prenumerera på: värdet ändras bara från server till webbläsare
const subscribeNever = () => () => {};

function FlightList({
  headingRef,
  title,
  date,
  flights,
  travellers,
  ready,
  sortBy,
  onSort,
  onChoose,
}: {
  headingRef: React.Ref<HTMLHeadingElement>;
  title: string;
  date: string;
  flights: Flight[];
  travellers: number;
  ready: boolean;
  sortBy: SortBy;
  onSort: (sortBy: SortBy) => void;
  onChoose: (flight: Flight) => void;
}) {
  return (
    <section aria-labelledby="flight-list-heading" className="flex flex-col gap-4">
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
        <div>
          <h2 id="flight-list-heading" ref={headingRef} tabIndex={-1} className="text-section font-bold outline-none">
            {title}
          </h2>
          <p className="mt-1 text-ink-muted">
            {formatDay(date)}
            {ready && ` · ${flights.length} flyg`}
          </p>
        </div>
        {ready && flights.length > 1 && <SortChoice value={sortBy} onChange={onSort} />}
      </div>

      {!ready ? (
        <ul aria-hidden="true" className="flex flex-col gap-3">
          {[1, 2, 3, 4].map((i) => (
            <FlightSkeleton key={i} />
          ))}
        </ul>
      ) : flights.length === 0 ? (
        <p>Inga flyg kvar den här dagen. Prova ett annat datum i sökningen ovan.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {sortFlights(flights, sortBy).map((flight) => (
            <FlightCard key={flight.id} flight={flight} travellers={travellers} onChoose={() => onChoose(flight)} />
          ))}
        </ul>
      )}
    </section>
  );
}

// Sortering på avgångstid eller pris (R7): två radioknappar som ser ut som en knappgrupp
function SortChoice({ value, onChange }: { value: SortBy; onChange: (sortBy: SortBy) => void }) {
  const options: { value: SortBy; label: string }[] = [
    { value: "time", label: "Avgångstid" },
    { value: "price", label: "Pris" },
  ];
  return (
    <fieldset className="flex items-center gap-3">
      <legend className="float-left mr-3 text-small text-ink-muted">Sortera på</legend>
      <div className="flex rounded-pill border-[1.5px] border-line-strong p-1">
        {options.map((o) => (
          <label
            key={o.value}
            className={`cursor-pointer rounded-pill px-3.5 py-1.5 text-sm font-bold transition-colors duration-160 has-focus-visible:outline-2 has-focus-visible:outline-offset-1 has-focus-visible:outline-accent-strong ${
              value === o.value ? "bg-accent text-on-accent" : "text-ink-muted hover:text-ink"
            }`}
          >
            <input
              type="radio"
              name="sort"
              value={o.value}
              checked={value === o.value}
              onChange={() => onChange(o.value)}
              className="sr-only"
            />
            {o.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

// Den valda utresan ovanför hemresorna, med en knapp för att ändra den (R8)
function ChosenOutbound({ flight, onChange }: { flight: Flight; onChange: () => void }) {
  return (
    <Card size="compact" className="flex flex-wrap items-center justify-between gap-3">
      <div>
        <p className="text-small text-ink-muted">Vald utresa</p>
        <FlightLine flight={flight} />
      </div>
      <Button variant="secondary" size="compact" onClick={onChange}>
        Ändra utresa
      </Button>
    </Card>
  );
}

// Den valda resan och priset för alla resenärer (R9). next är sidan för plan och klasser.
function Summary({
  headingRef,
  outbound,
  inbound,
  travellers,
  next,
  onChangeOutbound,
  onChangeReturn,
}: {
  headingRef: React.Ref<HTMLHeadingElement>;
  outbound: Flight;
  inbound: Flight | null;
  travellers: number;
  next: string;
  onChangeOutbound: () => void;
  onChangeReturn: () => void;
}) {
  const legs = [
    { label: "Utresa", flight: outbound, onChange: onChangeOutbound },
    ...(inbound ? [{ label: "Hemresa", flight: inbound, onChange: onChangeReturn }] : []),
  ];
  const total = legs.reduce((sum, leg) => sum + totalPrice(leg.flight.fromPrice, travellers), 0);

  return (
    <Card className="flex flex-col gap-5">
      <h2 ref={headingRef} tabIndex={-1} className="text-section font-bold outline-none">
        Din resa
      </h2>
      <ul className="flex flex-col divide-y divide-line">
        {legs.map((leg) => (
          <li key={leg.label} className="flex flex-wrap items-center justify-between gap-3 py-3 first:pt-0">
            <div>
              <p className="text-small text-ink-muted">{leg.label}</p>
              <FlightLine flight={leg.flight} />
              <p className="text-small text-ink-muted">
                {leg.flight.number} · från {formatPrice(leg.flight.fromPrice)} / person
              </p>
            </div>
            <Button variant="secondary" size="compact" onClick={leg.onChange}>
              Ändra {leg.label.toLowerCase()}
            </Button>
          </li>
        ))}
      </ul>
      <p className="flex flex-wrap items-baseline justify-between gap-2 border-t border-line pt-4">
        <span className="text-ink-muted">
          Totalt för {travellers} {travellers === 1 ? "resenär" : "resenärer"}
        </span>
        <span className="text-xl font-bold">från {formatPrice(total)}</span>
      </p>
      <Link href={next} className={`${buttonClass()} self-start`}>
        Fortsätt
      </Link>
    </Card>
  );
}
