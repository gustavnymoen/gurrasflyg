import Link from "next/link";
import { type AircraftOption, aircraftOptions, type FleetAircraft, firstSeating, type PlanFlight, type Seating, totalSeats } from "@/lib/fare-rules";
import { formatDuration, formatPrice, travellersText } from "@/lib/format";
import Button, { buttonClass } from "../../components/Button";
import ClassList from "./ClassList";
import Comparison from "./Comparison";
import { FlightTime } from "./FlightTime";

// Planen att välja bland för ett flyg (R2, TRIP-043-R4): en rad per plan med pris per
// person i billigaste klassen, flygtid och ankomst (R7) och skillnaden mot det billigaste
// och det snabbaste. Bara planen med plats för alla visas (TRIP-026-R1). Välj öppnar
// radens klasser; bara en rad är öppen i taget (TRIP-043-R5). seating är antalen på
// planet som har resenärer (holder), de andra planen har inga (TRIP-043-R6).
export default function AircraftList({
  headingId,
  title,
  of,
  flight,
  fleet,
  travellers,
  open,
  holder,
  seating,
  emptyLink,
  compareTime,
  onOpen,
  onChange,
  onContinue,
}: {
  headingId: string;
  title: string;
  of: string;
  flight: PlanFlight;
  fleet: FleetAircraft[];
  travellers: number;
  open: number | null;
  holder: number | null;
  seating: Seating;
  emptyLink: { href: string; label: string };
  compareTime: boolean;
  onOpen: (aircraftId: number) => void;
  onChange: (aircraft: FleetAircraft, classId: number, by: number) => void;
  onContinue: () => void;
}) {
  const options = aircraftOptions(fleet, flight, travellers);

  return (
    <section aria-labelledby={headingId} className="flex flex-col gap-4">
      <h3 id={headingId} className="text-lg font-bold">
        {title}
      </h3>
      {options.length === 0 ? (
        <div className="flex flex-col items-start gap-4">
          <p>
            Inget plan har plats för {travellersText(travellers)}.
          </p>
          <Link href={emptyLink.href} className={buttonClass("secondary")}>
            {emptyLink.label}
          </Link>
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {options.map((option) => {
            const isOpen = option.aircraft.id === open;
            // Ett plan utan resenärer visar noll i varje klass
            const rowSeating = option.aircraft.id === holder ? seating : firstSeating(option.aircraft);
            return (
              <AircraftRow
                key={option.aircraft.id}
                option={option}
                compareTime={compareTime}
                open={isOpen}
                onOpen={() => onOpen(option.aircraft.id)}
              >
                <ClassList
                  of={of}
                  flight={flight}
                  aircraft={option.aircraft}
                  travellers={travellers}
                  seating={rowSeating}
                  onChange={(classId, by) => onChange(option.aircraft, classId, by)}
                  onContinue={onContinue}
                />
              </AircraftRow>
            );
          })}
        </ul>
      )}
    </section>
  );
}

// Ett plan i listan. Välj öppnar raden, som då visar planets klasser (TRIP-043-R5).
function AircraftRow({
  option,
  compareTime,
  open,
  onOpen,
  children,
}: {
  option: AircraftOption;
  compareTime: boolean;
  open: boolean;
  onOpen: () => void;
  children: React.ReactNode;
}) {
  const { aircraft } = option;

  return (
    <li className={`rounded-card-compact border ${open ? "border-accent-strong ring-2 ring-accent-strong" : "border-line-strong"}`}>
      <div className="flex flex-wrap items-start justify-between gap-x-5 gap-y-3 px-5 py-4">
        <div className="min-w-0 flex-1 basis-56">
          <p className="font-bold">{aircraft.name}</p>
          <p className="text-small text-ink-muted">
            <FlightTime minutes={option.minutes} arrival={option.arrival} />
          </p>
          <p className="text-small text-ink-muted">{totalSeats(aircraft)} platser</p>
        </div>
        <div className="flex flex-col gap-1 text-small sm:items-end sm:text-right">
          <p>
            <span className="text-base font-bold">{formatPrice(option.price)}</span> / person
          </p>
          <Comparison
            best={option.cheapest}
            bestLabel="Billigast"
            diff={`+${formatPrice(option.priceDiff)} / person`}
          />
          {compareTime && (
            <Comparison best={option.fastest} bestLabel="Snabbast" diff={`+${formatDuration(option.timeDiff)}`} />
          )}
        </div>
        <Button
          variant={open ? "primary" : "secondary"}
          size="compact"
          aria-pressed={open}
          aria-label={`Välj ${aircraft.name}`}
          onClick={onOpen}
        >
          Välj
        </Button>
      </div>
      {open && (
        <div className="border-t border-line px-5 py-4">
          {children}
        </div>
      )}
    </li>
  );
}
