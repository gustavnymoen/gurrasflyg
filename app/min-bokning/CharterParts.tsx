import { type CharterBooking, groupState, toggleGroup, toggleOne } from "@/lib/cancel-rules";
import { formatPrice } from "@/lib/format";
import Card from "../components/Card";
import Checkbox from "../components/Checkbox";
import TripFacts from "../charter/TripFacts";
import { CancelledTag, TooLate } from "./Parts";

type Props = { booking: CharterBooking; selected: ReadonlySet<number>; onChange: (selected: ReadonlySet<number>) => void };

// Resorna, resenärerna och tilläggen, och kryssrutorna för hela resan eller en resenär.
// Ut- och hemresan går inte att avboka var för sig (TRIP-023-R5, R7, R8).
export default function CharterParts({ booking, selected, onChange }: Props) {
  const active = booking.passengers.filter((p) => !p.cancelled);
  const ids = active.map((p) => p.id);
  const late = booking.late && active.length > 0;
  const done = active.length === 0;
  return (
    <>
      <Card labelledBy="resor" className="flex flex-col gap-3">
        <h2 id="resor" className="text-section font-bold">
          Resor
        </h2>
        <ul className={`flex flex-col divide-y divide-line ${done ? "line-through" : ""}`}>
          {booking.trips.map(({ title, trip }) => (
            <li key={title} className="py-2 first:pt-0 last:pb-0">
              <p className="text-small text-ink-muted">{title}</p>
              <TripFacts trip={trip} />
            </li>
          ))}
        </ul>
      </Card>

      <Card labelledBy="resenarer" className="flex flex-col gap-3">
        <h2 id="resenarer" className="text-section font-bold">
          Resenärer
        </h2>
        {late && <TooLate id="late" />}
        {!done && (
          <Checkbox
            id="all-passengers"
            label="Avboka hela resan"
            checked={late ? false : groupState(selected, ids) === "all"}
            onChange={() => onChange(toggleGroup(selected, ids))}
            unavailable={late}
            describedBy={late ? "late" : undefined}
          />
        )}
        <ul className="flex flex-col divide-y divide-line">
          {booking.passengers.map((p) => {
            const who = `${p.name}, ${p.age} år · ${formatPrice(p.amount)}`;
            return (
              <li key={p.id} className="py-3 first:pt-0 last:pb-0">
                {p.cancelled ? (
                  <p className="flex flex-wrap items-baseline gap-x-3">
                    <span className="line-through">{who}</span>
                    <CancelledTag />
                  </p>
                ) : (
                  <Checkbox
                    id={`passenger-${p.id}`}
                    label={who}
                    checked={!late && selected.has(p.id)}
                    onChange={() => onChange(toggleOne(selected, p.id))}
                    unavailable={late}
                    describedBy={late ? "late" : undefined}
                  />
                )}
              </li>
            );
          })}
        </ul>
        <p className="text-small text-ink-muted">
          Priset per resenär gäller både utresan, hemresan och tilläggen. Utresan eller hemresan går inte att avboka var för sig.
        </p>
      </Card>

      {booking.extras.length > 0 && (
        <Card labelledBy="tillagg" className="flex flex-col gap-3">
          <h2 id="tillagg" className="text-section font-bold">
            Tillägg
          </h2>
          <ul className="flex flex-col gap-1">
            {booking.extras.map((extra) => (
              <li key={extra.name} className="flex flex-wrap justify-between gap-2">
                <span>{extra.name}</span>
                <span className="tabular-nums">{formatPrice(extra.price)} per person</span>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </>
  );
}
