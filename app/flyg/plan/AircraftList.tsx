import Link from "next/link";
import { useId, useState } from "react";
import { type AircraftOption, aircraftOptions, type FleetAircraft } from "@/lib/fare-rules";
import type { Flight } from "@/lib/flight-rules";
import { formatDuration, formatPrice } from "@/lib/format";
import Button, { buttonClass } from "../../components/Button";
import { ChevronIcon } from "../../components/icons";
import { FlightTime } from "./FlightTime";
import Comparison from "./Comparison";

// Planen att välja bland för ett flyg (R2): pris per person i billigaste
// klassen, flygtid och ankomst (R7), och skillnaden mot det billigaste och det
// snabbaste. Bara planen med plats för alla visas (TRIP-026-R1). Ett plan
// öppnas med ett klick och väljs med Välj, som ett flyg på /flyg (TRIP-026-R2).
export default function AircraftList({
  headingId,
  title,
  flight,
  fleet,
  travellers,
  flightsHref,
  onChoose,
}: {
  headingId: string;
  title: string;
  flight: Flight;
  fleet: FleetAircraft[];
  travellers: number;
  flightsHref: string;
  onChoose: (aircraftId: number) => void;
}) {
  const options = aircraftOptions(fleet, flight, travellers);

  return (
    <section aria-labelledby={headingId} className="flex flex-col gap-4">
      <h3 id={headingId} tabIndex={-1} className="text-lg font-bold outline-none">
        {title}
      </h3>
      {options.length === 0 ? (
        <div className="flex flex-col items-start gap-4">
          <p>
            Inget plan har plats för {travellers} {travellers === 1 ? "resenär" : "resenärer"}.
          </p>
          <Link href={flightsHref} className={buttonClass("secondary")}>
            Till flygen
          </Link>
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {options.map((option) => (
            <AircraftCard key={option.aircraft.id} option={option} onChoose={() => onChoose(option.aircraft.id)} />
          ))}
        </ul>
      )}
    </section>
  );
}

// Ett plan i listan. Hela kortet är en knapp som fäller ut klasserna och Välj.
function AircraftCard({ option, onChoose }: { option: AircraftOption; onChoose: () => void }) {
  const [open, setOpen] = useState(false);
  const detailsId = useId();
  const { aircraft } = option;

  return (
    <li className="rounded-card-compact border border-line-strong">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={detailsId}
        onClick={() => setOpen(!open)}
        className="grid w-full grid-cols-[1fr_auto] items-start gap-x-4 gap-y-1 rounded-card-compact px-5 py-4 text-left transition-colors duration-160 hover:bg-surface-float sm:grid-cols-[1fr_auto_auto]"
      >
        <span className="col-start-1 row-start-1 min-w-0">
          <span className="block font-bold">{aircraft.name}</span>
          <span className="block text-small text-ink-muted">
            <FlightTime minutes={option.minutes} arrival={option.arrival} />
          </span>
        </span>
        <span className="col-start-1 row-start-2 flex flex-col gap-1 text-small sm:col-start-2 sm:row-start-1 sm:items-end sm:text-right">
          <span>
            <span className="text-base font-bold">{formatPrice(option.price)}</span> / person
          </span>
          <Comparison best={option.cheapest} bestLabel="Billigast" diff={`+${formatPrice(option.priceDiff)} / person`} />
          <Comparison best={option.fastest} bestLabel="Snabbast" diff={`+${formatDuration(option.timeDiff)}`} />
        </span>
        <ChevronIcon open={open} className="col-start-2 row-start-1 mt-1 h-5 w-5 text-ink-muted sm:col-start-3" />
      </button>

      {open && (
        <div id={detailsId} className="flex flex-col gap-4 border-t border-line px-5 py-4">
          <ul className="flex flex-col gap-1 text-sm">
            {aircraft.classes.map((c) => (
              <li key={c.id}>
                {c.name}: {c.capacity} {c.capacity === 1 ? "plats" : "platser"}
              </li>
            ))}
          </ul>
          <Button onClick={onChoose} className="self-start">
            Välj
          </Button>
        </div>
      )}
    </li>
  );
}
