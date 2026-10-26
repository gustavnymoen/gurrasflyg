import { canAdd, classOptions, type FleetAircraft, legTotal, placed, type Seating, seatingCounter, seatingProblem } from "@/lib/fare-rules";
import type { Flight } from "@/lib/flight-rules";
import { formatPrice } from "@/lib/format";
import Button from "../../components/Button";
import { CheckIcon } from "../../components/icons";
import Message from "../../components/Message";
import RoundButton from "../../components/RoundButton";
import Comparison from "./Comparison";

// Klasserna på det valda planet för ett flyg (R3): pris per person, skillnaden
// mot den billigaste klassen och hur många resenärer som sitter i varje.
// Priset för flyget räknas om direkt när ett antal ändras (R4) och är summan
// för de resenärer som har en klass hittills (TRIP-024-R3). En räknare säger
// hur många som är kvar att placera, och Klar fäller ihop kortet; saknar
// någon en klass står det i stället vad som saknas (TRIP-026-R3).
export default function ClassList({
  headingId,
  title,
  totalLabel,
  flight,
  aircraft,
  travellers,
  seating,
  tried,
  onChange,
  onDone,
}: {
  headingId: string;
  title: string;
  totalLabel: string;
  flight: Flight;
  aircraft: FleetAircraft;
  travellers: number;
  seating: Seating;
  tried: boolean;
  onChange: (seating: Seating) => void;
  onDone: () => void;
}) {
  const problem = tried ? seatingProblem(seating, travellers) : null;
  const everyone = placed(seating) === travellers;
  const change = (classId: number, by: number) =>
    onChange({ ...seating, [classId]: (seating[classId] ?? 0) + by });

  return (
    <section aria-labelledby={headingId} className="flex flex-col gap-4">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h3 id={headingId} tabIndex={-1} className="text-lg font-bold outline-none">
          {title}
        </h3>
        {/* Skärmläsare hör när antalet kvar ändras */}
        <p aria-live="polite" className={`flex items-center gap-1.5 text-small font-medium ${everyone ? "text-success" : ""}`}>
          {everyone && <CheckIcon />}
          {seatingCounter(seating, travellers)}
        </p>
      </div>
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
                  onClick={() => change(cabinClass.id, 1)}
                >
                  +
                </RoundButton>
              </div>
            </li>
          );
        })}
      </ul>
      <p className="flex flex-wrap items-baseline justify-between gap-2 border-t border-line pt-4">
        <span className="text-ink-muted">{totalLabel}</span>
        <span className="text-lg font-bold">{formatPrice(legTotal(aircraft, flight.price, seating))}</span>
      </p>
      {problem && <Message kind="error">{problem}</Message>}
      <Button onClick={onDone} className="self-start">
        Klar
      </Button>
    </section>
  );
}
