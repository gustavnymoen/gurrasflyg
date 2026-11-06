"use client";

import { formatLong } from "@/lib/dates";
import { type Flight, fillInDelay, totalPrice } from "@/lib/flight-rules";
import { formatPrice, travellersText } from "@/lib/format";
import Card from "../components/Card";
import ChoiceCard from "../components/ChoiceCard";
import Detail from "../components/Detail";

// Ett flyg i resultatlistan (R5) med Välj på raden och detaljerna i en utfällning
// (TRIP-043-R1, R2). Flygtid och ankomsttid visas inte: de beror på
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
          label={`${flight.number} kl ${flight.time}`}
          summary={
            <span className="grid items-center gap-x-5 gap-y-1 sm:grid-cols-[auto_1fr_auto]">
              <span className="text-2xl font-bold tabular-nums">{flight.time}</span>
              <span className="min-w-0">
                <AirportName airport={flight.from} /> <span aria-hidden="true">–</span>
                <span className="sr-only">till</span> <AirportName airport={flight.to} />
              </span>
              <span className="sm:text-right">
                från <span className="font-bold">{formatPrice(flight.fromPrice)}</span> / person
              </span>
            </span>
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
