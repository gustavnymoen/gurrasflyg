import { formatDay } from "@/lib/dates";

// "fre 13 nov, 07:20 ARN Stockholm – LHR London"
export default function FlightLine({
  flight,
}: {
  flight: { date: string; time: string; from: { iata: string; city: string }; to: { iata: string; city: string } };
}) {
  return (
    <p className="font-medium">
      {formatDay(flight.date)}, <span className="tabular-nums">{flight.time}</span> {flight.from.iata}{" "}
      {flight.from.city} – {flight.to.iata} {flight.to.city}
    </p>
  );
}
