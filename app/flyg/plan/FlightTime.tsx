import { arrival, type FleetAircraft, flightMinutes } from "@/lib/fare-rules";
import type { Flight } from "@/lib/flight-rules";
import { formatDuration } from "@/lib/format";

// Flygtiden och ankomsten för ett flyg med ett plan, i Din resa (TRIP-024-R1) och i korten för flygen (TRIP-026)
export default function AircraftTime({ flight, aircraft }: { flight: Flight; aircraft: FleetAircraft }) {
  const minutes = flightMinutes(flight.routeMinutes, aircraft.timePercent);
  return <FlightTime minutes={minutes} arrival={arrival(flight, minutes)} />;
}

// "9 h 20 min · landar 15:40": samma text i listan med plan och i Din resa (R7)
export function FlightTime({ minutes, arrival }: { minutes: number; arrival: { time: string; days: number } }) {
  return (
    <>
      {formatDuration(minutes)} · landar <ArrivalTime {...arrival} />
    </>
  );
}

// Ankomsten i lokal tid på ankomstflygplatsen: "15:40", eller "00:30 +1" en senare dag. Skärmläsare får "nästa dag".
export function ArrivalTime({ time, days }: { time: string; days: number }) {
  return (
    <span className="tabular-nums">
      {time}
      {days !== 0 && (
        <>
          <span aria-hidden="true"> {days > 0 ? `+${days}` : days}</span>
          <span className="sr-only">{days === 1 ? " nästa dag" : days > 1 ? ` ${days} dagar senare` : " dagen före"}</span>
        </>
      )}
    </span>
  );
}
