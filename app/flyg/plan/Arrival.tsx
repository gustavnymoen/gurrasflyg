import { arrival, type FleetAircraft, flightMinutes } from "@/lib/fare-rules";
import type { Flight } from "@/lib/flight-rules";

// Ankomsten med ett plan: lokal tid på ankomstflygplatsen (R7)
export default function Arrival({ flight, aircraft }: { flight: Flight; aircraft: FleetAircraft }) {
  return <ArrivalTime {...arrival(flight, flightMinutes(flight.routeMinutes, aircraft.timePercent))} />;
}

// "15:40", eller "00:30 +1" en senare dag. Skärmläsare får "nästa dag".
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
