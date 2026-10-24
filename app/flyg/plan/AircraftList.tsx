import { useId } from "react";
import { type AircraftOption, aircraftOptions, type FleetAircraft, totalSeats } from "@/lib/fare-rules";
import type { Flight } from "@/lib/flight-rules";
import { formatDuration, formatPrice } from "@/lib/format";
import Card from "../../components/Card";
import Message from "../../components/Message";
import FlightLine from "../FlightLine";
import { ArrivalTime } from "./Arrival";
import Comparison from "./Comparison";

// Planen att välja bland för ett flyg (R2): pris per person i billigaste
// klassen, flygtid och ankomst (R7), och skillnaden mot det billigaste och det
// snabbaste. Ett plan med för få platser går inte att välja och jämförs inte. Planen är
// radioknappar, så att tangentbord och skärmläsare fungerar som vanligt.
export default function AircraftList({
  headingRef,
  title,
  flight,
  fleet,
  travellers,
  chosenId,
  missing,
  onChoose,
}: {
  headingRef?: React.Ref<HTMLHeadingElement>;
  title: string;
  flight: Flight;
  fleet: FleetAircraft[];
  travellers: number;
  chosenId: number | null;
  missing: string | null;
  onChoose: (aircraftId: number) => void;
}) {
  const headingId = useId();
  const options = aircraftOptions(fleet, flight, travellers);

  return (
    <section aria-labelledby={headingId} className="flex flex-col gap-4">
      <div>
        <h2 id={headingId} ref={headingRef} tabIndex={-1} className="text-section font-bold outline-none">
          {title}
        </h2>
        <FlightLine flight={flight} />
      </div>
      {options.length === 0 ? (
        <p>Det finns inga plan att välja just nu.</p>
      ) : (
        <fieldset>
          <legend className="sr-only">{title}</legend>
          <ul className="flex flex-col gap-3">
            {options.map((option) => (
              <AircraftCard
                key={option.aircraft.id}
                name={`plan-${headingId}`}
                option={option}
                travellers={travellers}
                checked={option.aircraft.id === chosenId}
                onChoose={() => onChoose(option.aircraft.id)}
              />
            ))}
          </ul>
        </fieldset>
      )}
      {missing && <Message kind="error">{missing}</Message>}
    </section>
  );
}

function AircraftCard({
  name,
  option,
  travellers,
  checked,
  onChoose,
}: {
  name: string;
  option: AircraftOption;
  travellers: number;
  checked: boolean;
  onChoose: () => void;
}) {
  const { aircraft, selectable } = option;
  const seats = totalSeats(aircraft);
  // Planets namn är radioknappens namn, resten dess beskrivning
  const id = useId();
  return (
    <li>
      <Card size="flush">
        <label
          className={`grid grid-cols-[auto_1fr] items-start gap-x-4 gap-y-1 rounded-card-compact px-5 py-4 transition-colors duration-160 has-focus-visible:ring-3 has-focus-visible:ring-accent-glow sm:grid-cols-[auto_1fr_auto] ${
            selectable ? "cursor-pointer hover:bg-surface-float" : "cursor-not-allowed"
          } ${checked ? "bg-accent-soft" : ""}`}
        >
          <input
            type="radio"
            name={name}
            checked={checked}
            disabled={!selectable}
            onChange={onChoose}
            aria-labelledby={`${id}-name`}
            aria-describedby={`${id}-time ${id}-price`}
            className="mt-1 h-5 w-5 accent-accent-strong"
          />
          <span className="min-w-0">
            <span id={`${id}-name`} className="block font-bold">
              {aircraft.name}
            </span>
            <span id={`${id}-time`} className="block text-small text-ink-muted">
              {formatDuration(option.minutes)} · landar <ArrivalTime {...option.arrival} />
              {!selectable && (
                <span className="block">
                  För få platser: {seats} {seats === 1 ? "plats" : "platser"} för {travellers} resenärer
                </span>
              )}
            </span>
          </span>
          <span
            id={`${id}-price`}
            className="col-start-2 flex flex-col gap-1 text-small sm:col-start-auto sm:items-end sm:text-right"
          >
            <span>
              <span className="text-base font-bold">{formatPrice(option.price)}</span> / person
            </span>
            {/* Jämförelsen gäller bara plan som går att välja */}
            {selectable && (
              <>
                <Comparison best={option.cheapest} bestLabel="Billigast" diff={`+${formatPrice(option.priceDiff)} / person`} />
                <Comparison best={option.fastest} bestLabel="Snabbast" diff={`+${formatDuration(option.timeDiff)}`} />
              </>
            )}
          </span>
        </label>
      </Card>
    </li>
  );
}
