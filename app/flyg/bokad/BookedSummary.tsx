"use client";

import type { BookingSummary } from "@/lib/booking-rules";
import { formatPrice } from "@/lib/format";
import Card from "../../components/Card";
import Problem from "../Problem";
import { BOOKED_KEY, useStored } from "../boka/store";
import FlightLine from "../FlightLine";
import { FlightTime } from "../plan/FlightTime";

// Bokningsnumret, flygen, passagerarna med klass och tillägg, kontaktpersonen,
// betalsättet och priset (R9), från fliken där bokningen gjordes
export default function BookedSummary() {
  const summary = useStored(BOOKED_KEY) as BookingSummary | null | undefined;
  if (summary === undefined) return null;
  if (summary === null || typeof summary.bookingNumber !== "string") {
    return (
      <>
        <h1 className="text-title-phone font-bold">Ingen bokning</h1>
        <Problem
          text="Det finns ingen bokning att visa här. En bokning visas bara direkt efter att den är gjord."
          href="/"
          link="Till sökningen"
        />
      </>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-2">
        <h1 className="text-title-phone font-bold">Tack för din bokning!</h1>
        <p className="text-lg">
          Bokningsnummer <strong className="tracking-wider">{summary.bookingNumber}</strong>
        </p>
      </div>

      <Card labelledBy="flyg" className="flex flex-col gap-3">
        <h2 id="flyg" className="text-section font-bold">
          Flyg
        </h2>
        <ul className="flex flex-col divide-y divide-line">
          {summary.legs.map((leg) => (
            <li key={leg.title} className="py-2 first:pt-0 last:pb-0">
              <p className="text-small text-ink-muted">{leg.title}</p>
              <FlightLine flight={leg.flight} />
              <p className="text-small text-ink-muted">
                {leg.aircraft} · <FlightTime minutes={leg.minutes} arrival={leg.arrival} />
              </p>
            </li>
          ))}
        </ul>
      </Card>

      <Card labelledBy="passagerare" className="flex flex-col gap-3">
        <h2 id="passagerare" className="text-section font-bold">
          Passagerare
        </h2>
        <ul className="flex flex-col divide-y divide-line">
          {summary.passengers.map((p, i) => (
            <li key={i} className="flex flex-col gap-1 py-3 first:pt-0 last:pb-0">
              <p className="font-bold">
                {p.name}, {p.age} år
              </p>
              {p.legs.map((leg, j) => (
                <p key={j} className="text-small">
                  {summary.legs[j].title}: {leg.className}
                  {leg.addons.length > 0 &&
                    ` · ${leg.addons.map((a) => (a.count > 1 ? `${a.count} × ${a.name}` : a.name)).join(", ")}`}
                </p>
              ))}
            </li>
          ))}
        </ul>
      </Card>

      <Card labelledBy="kontakt" className="flex flex-col gap-1">
        <h2 id="kontakt" className="mb-2 text-section font-bold">
          Kontaktperson
        </h2>
        <p>
          {summary.contact.firstName} {summary.contact.lastName}
        </p>
        <p>{summary.contact.email}</p>
        <p>{summary.contact.phone}</p>
        <p>{summary.contact.address}</p>
      </Card>

      <Card className="flex flex-col gap-2">
        <p className="flex flex-wrap items-baseline justify-between gap-2">
          <span className="text-ink-muted">Betalsätt</span>
          <span className="font-bold">{summary.payment}</span>
        </p>
        <p className="flex flex-wrap items-baseline justify-between gap-2">
          <span className="text-ink-muted">Totalt</span>
          <span className="text-xl font-bold">{formatPrice(summary.total)}</span>
        </p>
      </Card>
    </>
  );
}
