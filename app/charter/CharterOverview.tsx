import { type CharterTrip, TRIP_NAMES } from "@/lib/charter-rules";
import { formatPrice, travellersText } from "@/lib/format";
import Card from "../components/Card";
import TripFacts from "./TripFacts";

// Din resa: de valda resorna, antalet resenärer, tilläggen och priset så här långt (TRIP-014-R5, R7, R8).
// trips är utresan och hemresan, undefined när de inte är valda än. children står under priset (t.ex. Fortsätt).
export default function CharterOverview({
  destination,
  trips,
  travellers,
  extras = [],
  total,
  children,
}: {
  destination: string;
  trips: (CharterTrip | undefined)[];
  travellers: number;
  extras?: { name: string; sum: number }[];
  total: number;
  children?: React.ReactNode;
}) {
  return (
    <Card size="compact" labelledBy="din-resa" className="flex flex-col gap-3">
      <h2 id="din-resa" className="text-lg font-bold">
        Din resa
      </h2>
      <p className="text-small text-ink-muted">{destination}</p>
      <ul className="flex flex-col divide-y divide-line">
        {TRIP_NAMES.map(({ title }, i) => (
          <li key={title} className="py-2 first:pt-0 last:pb-0">
            <p className="text-small text-ink-muted">{title}</p>
            {trips[i] ? <TripFacts trip={trips[i]} /> : <p className="text-ink-muted">Inte vald än</p>}
          </li>
        ))}
      </ul>
      {extras.length > 0 && (
        <ul aria-label="Tillägg" className="flex flex-col gap-1 border-t border-line pt-3 text-small">
          {extras.map((extra) => (
            <li key={extra.name} className="flex flex-wrap justify-between gap-2">
              <span>{extra.name}</span>
              <span className="tabular-nums">{formatPrice(extra.sum)}</span>
            </li>
          ))}
        </ul>
      )}
      <p className="flex flex-wrap items-baseline justify-between gap-2 border-t border-line pt-3">
        <span className="text-ink-muted">Totalt för resan, {travellersText(travellers)}</span>
        <span aria-live="polite" className="text-xl font-bold">
          {formatPrice(total)}
        </span>
      </p>
      {children}
    </Card>
  );
}
