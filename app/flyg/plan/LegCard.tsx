import { type FleetAircraft, legTotal, type PlanFlight, type Seating, seatingText } from "@/lib/fare-rules";
import { formatPrice } from "@/lib/format";
import type { LegView } from "@/lib/trip";
import Card from "../../components/Card";
import { ChevronIcon } from "../../components/icons";
import FlightLine from "../FlightLine";
import AircraftList from "./AircraftList";
import AircraftTime from "./FlightTime";

// Rubrikerna i ett kort, som får fokus när kortet fälls ihop eller nästa öppnas (TRIP-026)
export const legIds = (key: string) => ({
  card: `${key}-kort`,
  aircraft: `${key}-plan`,
  folded: `${key}-sammanfattning`,
});

// Ett flyg på /flyg/plan (TRIP-043-R5, R7): planen i en lista där en rad är öppen
// med sina klasser, och efter Fortsätt en sammanfattning. Ett klick på
// sammanfattningen öppnar flyget igen.
export default function LegCard({
  legKey,
  title,
  of,
  view,
  flight,
  fleet,
  aircraft,
  openAircraft,
  seating,
  travellers,
  emptyLink,
  compareTime,
  onOpenAircraft,
  onChangeSeating,
  onContinue,
  onChange,
}: {
  legKey: string;
  title: string;
  of: string;
  view: Exclude<LegView, "hidden">;
  flight: PlanFlight;
  fleet: FleetAircraft[];
  // Planet med resenärer (om något) och planet vars rad är öppen
  aircraft: FleetAircraft | undefined;
  openAircraft: number | null;
  seating: Seating;
  travellers: number;
  emptyLink: { href: string; label: string };
  compareTime: boolean;
  onOpenAircraft: (aircraftId: number) => void;
  onChangeSeating: (aircraft: FleetAircraft, classId: number, by: number) => void;
  onContinue: () => void;
  onChange: () => void;
}) {
  const ids = legIds(legKey);

  return (
    <Card className="flex flex-col gap-5">
      <div>
        <h2 id={ids.card} tabIndex={-1} className="text-section font-bold outline-none">
          {title}
        </h2>
        <FlightLine flight={flight} />
      </div>

      {view === "open" && (
        <AircraftList
          headingId={ids.aircraft}
          title={`Plan för ${of}`}
          of={of}
          flight={flight}
          fleet={fleet}
          travellers={travellers}
          open={openAircraft}
          holder={aircraft?.id ?? null}
          seating={seating}
          emptyLink={emptyLink}
          compareTime={compareTime}
          onOpen={onOpenAircraft}
          onChange={onChangeSeating}
          onContinue={onContinue}
        />
      )}

      {view === "folded" && aircraft && (
        <button
          id={ids.folded}
          type="button"
          onClick={onChange}
          className="flex w-full items-start justify-between gap-4 rounded-card-compact border border-line-strong px-5 py-4 text-left transition-colors duration-160 hover:bg-surface-float"
        >
          <span className="min-w-0">
            <span className="block text-small text-ink-muted">{`Klart för ${of}`}</span>
            <span className="block font-bold">{aircraft.name}</span>
            <span className="block text-small text-ink-muted">
              <AircraftTime flight={flight} aircraft={aircraft} />
            </span>
            <span className="block text-small">{seatingText(aircraft, seating)}</span>
            <span className="block text-small">
              Totalt <span className="font-bold">{formatPrice(legTotal(aircraft, flight.price, seating))}</span>
            </span>
          </span>
          <ChevronIcon open={false} className="mt-1 h-5 w-5 shrink-0 text-ink-muted" />
        </button>
      )}
    </Card>
  );
}
