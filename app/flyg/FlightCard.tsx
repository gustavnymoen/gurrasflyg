"use client";

import { formatLong } from "@/lib/dates";
import { type Flight, fillInDelay, totalPrice } from "@/lib/flight-rules";
import { formatPrice, travellersText } from "@/lib/format";
import Card from "../components/Card";
import ChoiceCard from "../components/ChoiceCard";

// Ett flyg i resultatlistan (R5). Hela kortet är en knapp som fäller ut
// detaljerna och Välj (R6). Flygtid och ankomsttid visas inte: de beror på
// planet, som väljs i TRIP-011. fillInIndex är kortets plats i listan när det
// ska tona in uppifrån (TRIP-025), annars ingen animation.
export default function FlightCard({
  flight,
  travellers,
  fillInIndex,
  onChoose,
}: {
  flight: Flight;
  travellers: number;
  fillInIndex?: number;
  onChoose: () => void;
}) {
  const animated = fillInIndex !== undefined;
  return (
    <li
      className={animated ? "animate-fill-in" : undefined}
      style={animated ? { animationDelay: `${fillInDelay(fillInIndex)}ms` } : undefined}
    >
      <Card size="flush">
        <ChoiceCard
          onChoose={onChoose}
          summaryClassName="grid grid-cols-[auto_1fr_auto] items-center gap-x-5 gap-y-1 sm:grid-cols-[auto_1fr_auto_auto]"
          chevronClassName="col-start-3 row-span-2 row-start-1 sm:col-start-auto sm:row-span-1"
          summary={
            <>
              <span className="text-2xl font-bold tabular-nums">{flight.time}</span>
              <span className="min-w-0">
                <AirportName airport={flight.from} /> <span aria-hidden="true">–</span>
                <span className="sr-only">till</span> <AirportName airport={flight.to} />
              </span>
              <span className="col-span-2 row-start-2 sm:col-span-1 sm:row-start-auto sm:text-right">
                från <span className="font-bold">{formatPrice(flight.fromPrice)}</span> / person
              </span>
            </>
          }
        >
          <dl className="grid gap-x-6 gap-y-2 text-sm sm:grid-cols-[auto_1fr]">
            <Detail term="Flygnummer">{flight.number}</Detail>
            <Detail term="Från">
              {flight.from.name}, {flight.from.country}
            </Detail>
            <Detail term="Till">
              {flight.to.name}, {flight.to.country}
            </Detail>
            <Detail term="Datum">{formatLong(flight.date)}</Detail>
            <Detail term={`Totalt för ${travellersText(travellers)}`}>
              från {formatPrice(totalPrice(flight.fromPrice, travellers))}
            </Detail>
          </dl>
        </ChoiceCard>
      </Card>
    </li>
  );
}

// "ARN Stockholm"
function AirportName({ airport }: { airport: Flight["from"] }) {
  return (
    <span className="whitespace-nowrap">
      <span className="font-bold">{airport.iata}</span> {airport.city}
    </span>
  );
}

function Detail({ term, children }: { term: string; children: React.ReactNode }) {
  return (
    <>
      <dt className="text-ink-muted">{term}</dt>
      <dd>{children}</dd>
    </>
  );
}

// Ett skelettkort i flygkortets form medan sökningen pågår (R3). Pulserar
// bara när besökaren inte valt minskad rörelse.
export function FlightSkeleton() {
  const bar = "rounded-md bg-surface-float";
  return (
    <li>
      <Card size="flush" className="flex items-center gap-5 px-5 py-4 motion-safe:animate-pulse">
        <div className={`h-8 w-16 ${bar}`} />
        <div className={`h-5 flex-1 ${bar}`} />
        <div className={`hidden h-5 w-36 sm:block ${bar}`} />
      </Card>
    </li>
  );
}
