import type { Contact } from "@/lib/booking-rules";
import { type Cancellation, leftToPay, type MyBooking, refundedTotal } from "@/lib/cancel-rules";
import { formatPrice } from "@/lib/format";
import Card from "../components/Card";

// Kontaktpersonen (TRIP-023-R4, R5)
export function ContactCard({ contact }: { contact: Contact }) {
  return (
    <Card labelledBy="kontakt" className="flex flex-col gap-1">
      <h2 id="kontakt" className="mb-2 text-section font-bold">
        Kontaktperson
      </h2>
      <p>
        {contact.firstName} {contact.lastName}
      </p>
      <p>{contact.email}</p>
      <p>{contact.phone}</p>
      <p>{contact.address}</p>
    </Card>
  );
}

// Betalsättet och priset. Efter en avbokning också vad som har betalats tillbaka och vad som är kvar att betala (R4).
export function TotalsCard({ booking }: { booking: MyBooking }) {
  const changed = booking.cancellations.length > 0;
  return (
    <Card labelledBy="pris" className="flex flex-col gap-2">
      <h2 id="pris" className="sr-only">
        Pris
      </h2>
      <p className="flex flex-wrap items-baseline justify-between gap-2">
        <span className="text-ink-muted">Betalsätt</span>
        <span className="font-bold">{booking.payment}</span>
      </p>
      <p className="flex flex-wrap items-baseline justify-between gap-2">
        <span className="text-ink-muted">Totalt</span>
        <span className={changed ? "tabular-nums" : "text-xl font-bold"}>{formatPrice(booking.total)}</span>
      </p>
      {changed && (
        <>
          <p className="flex flex-wrap items-baseline justify-between gap-2">
            <span className="text-ink-muted">Återbetalat</span>
            <span className="tabular-nums">{formatPrice(refundedTotal(booking.cancellations))}</span>
          </p>
          <p className="flex flex-wrap items-baseline justify-between gap-2">
            <span className="text-ink-muted">Kvar att betala</span>
            <span className="text-xl font-bold">{formatPrice(leftToPay(booking))}</span>
          </p>
        </>
      )}
    </Card>
  );
}

// Avbokningarna och hur lotteriet gick (R10, R11)
export function CancellationHistory({ cancellations }: { cancellations: Cancellation[] }) {
  return (
    <Card labelledBy="avbokningar" className="flex flex-col gap-3">
      <h2 id="avbokningar" className="text-section font-bold">
        Avbokningar
      </h2>
      <ul className="flex flex-col divide-y divide-line">
        {cancellations.map((c) => (
          <li key={c.id} className="flex flex-col gap-0.5 py-2 first:pt-0 last:pb-0">
            <p className="text-small text-ink-muted">{c.at}</p>
            <p>
              Avbokat för {formatPrice(c.amount)}.{" "}
              {c.won ? `Du fick ${formatPrice(c.refunded)} tillbaka.` : "Du fick inget tillbaka."}
            </p>
          </li>
        ))}
      </ul>
    </Card>
  );
}
