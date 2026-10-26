import { type CharterTrip, stopsText } from "@/lib/charter-rules";
import { formatDay } from "@/lib/dates";
import { formatDuration } from "@/lib/format";
import { ArrivalTime } from "../flyg/plan/FlightTime";

// En charterresa i korten och i Din resa: dag och flygplatser, flygbolaget och
// flygnumren, tiderna med ankomsten, restiden och byten (TRIP-014-R3).
// Ankomsten är i ankomstflygplatsens tid.
export default function TripFacts({ trip }: { trip: CharterTrip }) {
  return (
    <div className="flex flex-col gap-0.5">
      <p className="font-medium">
        {formatDay(trip.date)}, {trip.from.iata} {trip.from.city} – {trip.to.iata} {trip.to.city}
      </p>
      <p className="text-small text-ink-muted">
        {trip.airline} · {trip.flights.join(", ")}
      </p>
      <p>
        <span className="tabular-nums">{trip.time}</span>
        <span aria-hidden="true"> – </span>
        <span className="sr-only"> landar </span>
        <ArrivalTime {...trip.arrival} />
        <span className="text-ink-muted">
          {" "}
          · {formatDuration(trip.minutes)} · {stopsText(trip.stops)}
        </span>
      </p>
    </div>
  );
}
