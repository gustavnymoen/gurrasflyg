import { type FleetAircraft, seatingText } from "@/lib/fare-rules";
import type { Flight } from "@/lib/flight-rules";
import { LEG_NAMES, type LegChoice } from "@/lib/trip";
import Card from "../components/Card";
import FlightLine from "./FlightLine";
import AircraftTime from "./plan/FlightTime";

// Din resa: de valda flygen och antalet resenärer (TRIP-011-R1). Under ett
// flyg med valt plan står planet, flygtiden och ankomsten (TRIP-024-R1), och
// med classes också antalen per klass (resenärerna och betalningen, TRIP-012-R1).
export default function TripOverview({
  flights,
  legs,
  fleet,
  travellers,
  classes = false,
}: {
  flights: Flight[];
  legs: LegChoice[];
  fleet: FleetAircraft[];
  travellers: number;
  classes?: boolean;
}) {
  return (
    <Card size="compact" labelledBy="din-resa" className="flex flex-col gap-3">
      <h2 id="din-resa" className="text-lg font-bold">
        Din resa
      </h2>
      <ul className="flex flex-col divide-y divide-line">
        {flights.map((flight, i) => {
          const { seating } = legs[i];
          const aircraft = fleet.find((a) => a.id === legs[i].aircraftId);
          return (
            <li key={flight.id} className="py-2 first:pt-0 last:pb-0">
              <p className="text-small text-ink-muted">{LEG_NAMES[i].title}</p>
              <FlightLine flight={flight} />
              {aircraft && (
                <p className="text-small text-ink-muted">
                  {aircraft.name} · <AircraftTime flight={flight} aircraft={aircraft} />
                </p>
              )}
              {classes && aircraft && seating && (
                <p className="text-small text-ink-muted">
                  {seatingText(aircraft, seating)}
                </p>
              )}
            </li>
          );
        })}
      </ul>
      <p className="text-small text-ink-muted">
        {travellers} {travellers === 1 ? "resenär" : "resenärer"}
      </p>
    </Card>
  );
}
