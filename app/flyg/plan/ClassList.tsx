import { useId } from "react";
import { canAdd, classOptions, type FleetAircraft, legTotal, placed, type PlanFlight, type Seating, seatingCounter, seatingLeft } from "@/lib/fare-rules";
import { formatPrice } from "@/lib/format";
import Button from "../../components/Button";
import { CheckIcon } from "../../components/icons";
import RoundButton from "../../components/RoundButton";
import Comparison from "./Comparison";

// Klasserna på ett plan i dess öppna rad (R3, TRIP-043-R5): pris per person, antalet
// platser, skillnaden mot den billigaste klassen och hur många resenärer som sitter i
// varje. Priset för flyget räknas om direkt när ett antal ändras (R4) och är summan för
// de resenärer som har en klass hittills (TRIP-024-R3). Räknaren säger hur många som är
// placerade (TRIP-043-R9). Fortsätt tänds när alla har en klass; innan dess står det
// hur många som är kvar (TRIP-043-R7).
export default function ClassList({
  of,
  flight,
  aircraft,
  travellers,
  seating,
  onChange,
  onContinue,
}: {
  of: string;
  flight: PlanFlight;
  aircraft: FleetAircraft;
  travellers: number;
  seating: Seating;
  onChange: (classId: number, by: number) => void;
  onContinue: () => void;
}) {
  const left = seatingLeft(seating, travellers);
  const leftId = useId();

  return (
    <section aria-label={`Klasser på ${of}`} className="flex flex-col gap-4">
      {/* Skärmläsare hör när antalet placerade ändras */}
      <p aria-live="polite" className={`flex items-center gap-1.5 text-small font-medium ${left ? "" : "text-success"}`}>
        {!left && <CheckIcon />}
        {seatingCounter(seating, travellers)}
      </p>
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
                  onClick={() => onChange(cabinClass.id, -1)}
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
                  onClick={() => onChange(cabinClass.id, 1)}
                >
                  +
                </RoundButton>
              </div>
            </li>
          );
        })}
      </ul>
      <p className="flex flex-wrap items-baseline justify-between gap-2 border-t border-line pt-4">
        <span className="text-ink-muted">Totalt för {of}</span>
        <span className="text-lg font-bold">{formatPrice(legTotal(aircraft, flight.price, seating))}</span>
      </p>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <Button onClick={onContinue} disabled={placed(seating) !== travellers} aria-describedby={left ? leftId : undefined}>
          Fortsätt
        </Button>
        {left && (
          <p id={leftId} className="text-small text-ink-muted">
            {left}
          </p>
        )}
      </div>
    </section>
  );
}
