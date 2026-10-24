import { aircraftFare, classOptions, type FleetAircraft, legTotal, type Seating } from "@/lib/fare-rules";
import type { Flight } from "@/lib/flight-rules";
import { formatPrice } from "@/lib/format";
import type { LegView } from "@/lib/trip";
import Card from "../../components/Card";
import { ChevronIcon } from "../../components/icons";
import FlightLine from "../FlightLine";
import AircraftList from "./AircraftList";
import ClassList from "./ClassList";
import AircraftTime from "./FlightTime";

// Rubrikerna i ett kort, som får fokus när en del öppnas eller fälls ihop (TRIP-026)
export const legIds = (key: string) => ({
  card: `${key}-kort`,
  aircraft: `${key}-plan`,
  classes: `${key}-klasser`,
  folded: `${key}-sammanfattning`,
});

// Ett flyg på /flyg/plan (TRIP-026-R2–R4): först planen, sedan det valda
// planet överst och klasserna under, och efter Klar en sammanfattning.
// Ett klick på planet eller sammanfattningen öppnar dem igen.
export default function LegCard({
  legKey,
  title,
  of,
  view,
  flight,
  fleet,
  aircraft,
  seating,
  travellers,
  tried,
  flightsHref,
  onChoose,
  onShowAircraft,
  onChangeSeating,
  onDone,
  onOpen,
}: {
  legKey: string;
  title: string;
  of: string;
  view: Exclude<LegView, "hidden">;
  flight: Flight;
  fleet: FleetAircraft[];
  aircraft: FleetAircraft | undefined;
  seating: Seating;
  travellers: number;
  tried: boolean;
  flightsHref: string;
  onChoose: (aircraftId: number) => void;
  onShowAircraft: () => void;
  onChangeSeating: (seating: Seating) => void;
  onDone: () => void;
  onOpen: () => void;
}) {
  const ids = legIds(legKey);
  // Klasserna och sammanfattningen kräver ett plan; adressen kan ligga ett steg efter
  const shown = aircraft ? view : "aircraft";

  return (
    <Card className="flex flex-col gap-5">
      <div>
        <h2 id={ids.card} tabIndex={-1} className="text-section font-bold outline-none">
          {title}
        </h2>
        <FlightLine flight={flight} />
      </div>

      {shown === "aircraft" && (
        <AircraftList
          headingId={ids.aircraft}
          title={`Plan för ${of}`}
          flight={flight}
          fleet={fleet}
          travellers={travellers}
          flightsHref={flightsHref}
          onChoose={onChoose}
        />
      )}

      {shown === "classes" && aircraft && (
        <>
          <Unfold label="Valt plan" onClick={onShowAircraft}>
            <span className="block font-bold">{aircraft.name}</span>
            <span className="block text-small text-ink-muted">
              <AircraftTime flight={flight} aircraft={aircraft} />
            </span>
            <span className="block text-small">
              <span className="font-bold">{formatPrice(aircraftFare(aircraft, flight.price))}</span> / person
            </span>
          </Unfold>
          <ClassList
            headingId={ids.classes}
            title={`Klasser på ${of}`}
            totalLabel={`Totalt för ${of}`}
            flight={flight}
            aircraft={aircraft}
            travellers={travellers}
            seating={seating}
            tried={tried}
            onChange={onChangeSeating}
            onDone={onDone}
          />
        </>
      )}

      {shown === "folded" && aircraft && (
        <Unfold id={ids.folded} label={`Klart för ${of}`} onClick={onOpen}>
          <span className="block font-bold">{aircraft.name}</span>
          <span className="block text-small text-ink-muted">
            <AircraftTime flight={flight} aircraft={aircraft} />
          </span>
          <span className="block text-small">
            {classOptions(aircraft, flight.price)
              .filter((o) => (seating[o.cabinClass.id] ?? 0) > 0)
              .map((o) => `${o.cabinClass.name}: ${seating[o.cabinClass.id]}`)
              .join(" · ")}
          </span>
          <span className="block text-small">
            Totalt <span className="font-bold">{formatPrice(legTotal(aircraft, flight.price, seating))}</span>
          </span>
        </Unfold>
      )}
    </Card>
  );
}

// Ett valt plan eller ett klart flyg: hela rutan är en knapp som öppnar det igen
function Unfold({
  id,
  label,
  onClick,
  children,
}: {
  id?: string;
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      id={id}
      type="button"
      onClick={onClick}
      className="flex w-full items-start justify-between gap-4 rounded-card-compact border border-line-strong px-5 py-4 text-left transition-colors duration-160 hover:bg-surface-float"
    >
      <span className="min-w-0">
        <span className="block text-small text-ink-muted">{label}</span>
        {children}
      </span>
      <ChevronIcon open={false} className="mt-1 h-5 w-5 shrink-0 text-ink-muted" />
    </button>
  );
}
