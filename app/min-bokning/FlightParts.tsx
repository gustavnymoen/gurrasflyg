import {
  type BookedFlight,
  type FlightBooking,
  flightCancelled,
  groupState,
  seatAmount,
  tickableSeats,
  toggleGroup,
  toggleOne,
} from "@/lib/cancel-rules";
import { formatPrice } from "@/lib/format";
import Card from "../components/Card";
import Checkbox from "../components/Checkbox";
import FlightLine from "../flyg/FlightLine";
import { FlightTime } from "../flyg/plan/FlightTime";
import { CancelledTag, TooLate } from "./Parts";

type Props = { booking: FlightBooking; selected: ReadonlySet<number>; onChange: (selected: ReadonlySet<number>) => void };

// Flygen med passagerarna, klasserna och tilläggen, och kryssrutorna för att avboka ett flyg
// eller en passagerares plats (TRIP-023-R4, R6, R8)
export default function FlightParts({ booking, selected, onChange }: Props) {
  return (
    <>
      {booking.flights.map((flight) => (
        <FlightCard key={flight.id} flight={flight} booking={booking} selected={selected} onChange={onChange} />
      ))}
    </>
  );
}

function FlightCard({ flight, booking, selected, onChange }: Props & { flight: BookedFlight }) {
  const done = flightCancelled(flight);
  const ids = tickableSeats(flight).map((s) => s.id);
  // Platserna går att kryssa om flyget inte är för sent; annars är rutorna gråa (R8)
  const late = flight.late && !done;
  const lateId = `late-${flight.id}`;
  return (
    <Card labelledBy={`flight-${flight.id}`} className="flex flex-col gap-3">
      <div className="flex flex-wrap items-baseline gap-x-3">
        <h2 id={`flight-${flight.id}`} className="text-section font-bold">
          {flight.title}
        </h2>
        {done && <CancelledTag />}
      </div>
      <div className={done ? "line-through" : undefined}>
        <FlightLine flight={flight} />
        <p className="text-small text-ink-muted">
          {flight.aircraft} · <FlightTime minutes={flight.minutes} arrival={flight.arrival} />
        </p>
      </div>
      {late && <TooLate id={lateId} />}
      {!done && (
        <Checkbox
          id={`all-${flight.id}`}
          label={`Avboka ${flight.of}`}
          checked={late ? false : groupState(selected, ids) === "all"}
          onChange={() => onChange(toggleGroup(selected, ids))}
          unavailable={late}
          describedBy={late ? lateId : undefined}
        />
      )}
      <ul className="flex flex-col divide-y divide-line">
        {flight.seats.map((seat) => {
          const passenger = booking.passengers.find((p) => p.id === seat.passengerId)!;
          const who = `${passenger.name}, ${passenger.age} år · ${seat.className} · ${formatPrice(seatAmount(seat))}`;
          return (
            <li key={seat.id} className="flex flex-col gap-1 py-3 first:pt-0 last:pb-0">
              {seat.cancelled ? (
                <p className="flex flex-wrap items-baseline gap-x-3">
                  <span className="line-through">{who}</span>
                  <CancelledTag />
                </p>
              ) : (
                <Checkbox
                  id={`seat-${seat.id}`}
                  label={who}
                  checked={!late && selected.has(seat.id)}
                  onChange={() => onChange(toggleOne(selected, seat.id))}
                  unavailable={late}
                  describedBy={late ? lateId : undefined}
                />
              )}
              {seat.addons.length > 0 && (
                <p className={`ml-8 text-small text-ink-muted ${seat.cancelled ? "line-through" : ""}`}>
                  {seat.addons
                    .map((a) => `${a.count > 1 ? `${a.count} × ` : ""}${a.name} ${formatPrice(a.price * a.count)}`)
                    .join(", ")}
                </p>
              )}
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
