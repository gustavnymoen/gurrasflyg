import Link from "next/link";
import { fieldIds, PAYMENTS, type Payment } from "@/lib/booking-rules";
import { formatPrice, travellersText } from "@/lib/format";
import Button, { buttonClass } from "../../components/Button";
import Card from "../../components/Card";
import Message from "../../components/Message";
import PriceList from "../PriceList";

// Delarna av Betala som flygbokningen (TRIP-012) och charterbokningen (TRIP-014) har gemensamma

// "Hur vill du betala?": ett betalsätt, och meddelandet när inget är valt
export function PaymentMethodCard({
  payment,
  problem,
  onChange,
}: {
  payment: Payment | null;
  problem: string | null;
  onChange: (payment: Payment) => void;
}) {
  const errorId = `${fieldIds.payment}-error`;
  return (
    <Card className="flex flex-col gap-5">
      <fieldset className="flex flex-col gap-3">
        <legend className="mb-3 text-section font-bold">Hur vill du betala?</legend>
        {PAYMENTS.map(({ value, label }, i) => (
          <label key={value} className="flex items-center gap-3">
            <input
              id={i === 0 ? fieldIds.payment : undefined}
              type="radio"
              name="betalning"
              value={value}
              checked={payment === value}
              aria-describedby={problem ? errorId : undefined}
              onChange={() => onChange(value)}
              className="h-5 w-5 shrink-0 accent-accent-strong"
            />
            {label}
          </label>
        ))}
        {problem && (
          <Message kind="error" id={errorId}>
            {problem}
          </Message>
        )}
      </fieldset>
    </Card>
  );
}

// "Att betala" med prislistan, Betala och länken tillbaka till resenärerna (TRIP-027-R1)
export function PayCard({
  total,
  travellers,
  error,
  pending,
  backHref,
}: {
  total: number;
  travellers: number;
  error: string | null;
  pending: boolean;
  backHref: string;
}) {
  return (
    <Card className="flex flex-col gap-3">
      <p className="flex flex-wrap items-baseline justify-between gap-2">
        <span className="text-ink-muted">Att betala, {travellersText(travellers)}</span>
        <span className="text-xl font-bold">{formatPrice(total)}</span>
      </p>
      <PriceList total={total} />
      {error && <Message kind="error">{error}</Message>}
      <div className="flex flex-wrap gap-3">
        <Button type="submit" aria-disabled={pending || undefined}>
          {pending ? "Betalar…" : "Betala"}
        </Button>
        <Link href={backHref} className={buttonClass("secondary")}>
          Tillbaka till resenärerna
        </Link>
      </div>
    </Card>
  );
}
