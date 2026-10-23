import { formatDay } from "@/lib/dates";
import type { Flight } from "@/lib/flight-rules";

// "fre 13 nov, 07:20 ARN Stockholm – LHR London"
export default function FlightLine({ flight }: { flight: Flight }) {
  return (
    <p className="font-medium">
      {formatDay(flight.date)}, <span className="tabular-nums">{flight.time}</span> {flight.from.iata}{" "}
      {flight.from.city} – {flight.to.iata} {flight.to.city}
    </p>
  );
}
