import { priceList, type PriceListArea } from "@/lib/booking-rules";
import { formatPrice } from "@/lib/format";

// Totalen uppdelad i prislistans rader (TRIP-027), på Betala och i
// sammanfattningen, med raderna för flyg eller charter (TRIP-029). Bara
// summorna visas, utom skatten som får visa sina 0 %.
export default function PriceList({ total, area }: { total: number; area: PriceListArea }) {
  return (
    <dl className="flex flex-col gap-1 text-sm">
      {priceList(total, area).map(({ label, percent, amount }) => (
        <div key={label} className="flex flex-wrap items-baseline justify-between gap-2">
          <dt className="text-ink-muted">{percent === 0 ? `${label} ${percent} %` : label}</dt>
          {/* Högerställd också när ett långt namn skjuter ner beloppet på en egen rad */}
          <dd className="ml-auto tabular-nums">{formatPrice(amount)}</dd>
        </div>
      ))}
    </dl>
  );
}
