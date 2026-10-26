"use client";

import type { CharterSummary } from "@/lib/charter-rules";
import { formatPrice } from "@/lib/format";
import Card from "../components/Card";
import Problem from "../flyg/Problem";
import PriceList from "../flyg/PriceList";
import { CHARTER_BOOKED_KEY, useStored } from "../flyg/boka/store";
import TripFacts from "./TripFacts";

// Bokningsnumret, resorna, resenärerna, tilläggen, kontaktpersonen, betalsättet och
// priset (TRIP-014-R9), från fliken där bokningen gjordes
export default function CharterBooked() {
  const summary = useStored(CHARTER_BOOKED_KEY) as CharterSummary | null | undefined;
  if (summary === undefined) return null;
  if (summary === null || typeof summary.bookingNumber !== "string") {
    return (
      <>
        <h1 className="text-title-phone font-bold">Ingen bokning</h1>
        <Problem
          text="Det finns ingen bokning att visa här. En bokning visas bara direkt efter att den är gjord."
          href="/charter"
          link="Till charterresorna"
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
        <p className="text-ink-muted">{summary.destination}</p>
      </div>

      <Card labelledBy="resor" className="flex flex-col gap-3">
        <h2 id="resor" className="text-section font-bold">
          Resor
        </h2>
        <ul className="flex flex-col divide-y divide-line">
          {summary.trips.map(({ title, trip }) => (
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
        <ul className="flex flex-col gap-1">
          {summary.passengers.map((p, i) => (
            <li key={i} className="font-bold">
              {p.name}, {p.age} år
            </li>
          ))}
        </ul>
      </Card>

      {summary.extras.length > 0 && (
        <Card labelledBy="tillagg" className="flex flex-col gap-3">
          <h2 id="tillagg" className="text-section font-bold">
            Tillägg
          </h2>
          <ul className="flex flex-col gap-1">
            {summary.extras.map((extra) => (
              <li key={extra.name} className="flex flex-wrap justify-between gap-2">
                <span>{extra.name}</span>
                <span className="tabular-nums">{formatPrice(extra.sum)}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}

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
        <PriceList total={summary.total} />
        <p className="flex flex-wrap items-baseline justify-between gap-2">
          <span className="text-ink-muted">Totalt</span>
          <span className="text-xl font-bold">{formatPrice(summary.total)}</span>
        </p>
      </Card>
    </>
  );
}
