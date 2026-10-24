import { useId } from "react";
import { canAdd, classOptions, type FleetAircraft, legTotal, type Seating, seatingProblem } from "@/lib/fare-rules";
import type { Flight } from "@/lib/flight-rules";
import { formatPrice } from "@/lib/format";
import Card from "../../components/Card";
import Message from "../../components/Message";
import RoundButton from "../../components/RoundButton";
import FlightLine from "../FlightLine";
import Comparison from "./Comparison";

// Klasserna på det valda planet för ett flyg (R3): pris per person, skillnaden
// mot den billigaste klassen och hur många resenärer som sitter i varje.
// Priset för flyget räknas om direkt när ett antal ändras (R4) och är summan
// för de resenärer som har en klass hittills (TRIP-024-R3).
export default function ClassList({
  headingRef,
  title,
  totalLabel,
  flight,
  aircraft,
  travellers,
  seating,
  onChange,
}: {
  headingRef?: React.Ref<HTMLHeadingElement>;
  title: string;
  totalLabel: string;
  flight: Flight;
  aircraft: FleetAircraft;
  travellers: number;
  seating: Seating;
  onChange: (seating: Seating) => void;
}) {
  const headingId = useId();
  const problem = seatingProblem(seating, travellers);
  const change = (classId: number, by: number) =>
    onChange({ ...seating, [classId]: (seating[classId] ?? 0) + by });

  return (
    <section aria-labelledby={headingId} className="flex flex-col gap-4">
      <div>
        <h2 id={headingId} ref={headingRef} tabIndex={-1} className="text-section font-bold outline-none">
          {title}
        </h2>
        <p className="text-small text-ink-muted">{aircraft.name}</p>
        <FlightLine flight={flight} />
      </div>
      <Card size="compact" className="flex flex-col gap-4">
        <ul className="flex flex-col divide-y divide-line">
          {classOptions(aircraft, flight.price).map(({ cabinClass, price, priceDiff }) => {
            const count = seating[cabinClass.id] ?? 0;
            return (
              <li
                key={cabinClass.id}
                className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 py-3 first:pt-0"
              >
                <div className="flex min-w-0 flex-col gap-1">
                  <span className="font-bold">{cabinClass.name}</span>
                  <span className="text-small">
                    {formatPrice(price)} / person · {cabinClass.capacity}{" "}
                    {cabinClass.capacity === 1 ? "plats" : "platser"}
                  </span>
                  <span className="flex text-small">
                    <Comparison best={priceDiff === 0} bestLabel="Billigast" diff={`+${formatPrice(priceDiff)} / person`} />
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <RoundButton
                    label={`Färre i ${cabinClass.name}`}
                    disabled={count === 0}
                    keepFocus
                    onClick={() => change(cabinClass.id, -1)}
                  >
                    −
                  </RoundButton>
                  {/* Antalet läses upp när det ändras */}
                  <span aria-live="polite" className="w-6 text-center text-lg font-bold tabular-nums">
                    {count}
                    <span className="sr-only"> i {cabinClass.name}</span>
                  </span>
                  <RoundButton
                    label={`Fler i ${cabinClass.name}`}
                    disabled={!canAdd(cabinClass, seating, travellers)}
                    keepFocus
                    onClick={() => change(cabinClass.id, 1)}
                  >
                    +
                  </RoundButton>
                </div>
              </li>
            );
          })}
        </ul>
        {problem && <Message kind="error">{problem}</Message>}
        <p className="flex flex-wrap items-baseline justify-between gap-2 border-t border-line pt-4">
          <span className="text-ink-muted">{totalLabel}</span>
          <span className="text-lg font-bold">{formatPrice(legTotal(aircraft, flight.price, seating))}</span>
        </p>
      </Card>
    </section>
  );
}
