"use client";

import { useEffect, useRef, useState } from "react";
import {
  bookingCancelled,
  charterSelection,
  flightSelection,
  type MyBooking,
} from "@/lib/cancel-rules";
import type { Cancelled, Credentials } from "@/lib/my-booking";
import Button from "../components/Button";
import Message from "../components/Message";
import { CancellationHistory, ContactCard, TotalsCard } from "./BookingParts";
import CancelPanel from "./CancelPanel";
import CharterParts from "./CharterParts";
import FlightParts from "./FlightParts";

// Hela bokningen och det som går att avboka (TRIP-023-R4–R10)
export default function BookingView({
  initial,
  credentials,
  onReset,
}: {
  initial: MyBooking;
  credentials: Credentials;
  onReset: () => void;
}) {
  const [booking, setBooking] = useState(initial);
  const [selected, setSelected] = useState<ReadonlySet<number>>(new Set());
  const [result, setResult] = useState<Pick<Cancelled, "won" | "amount"> | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const cancelled = bookingCancelled(booking);

  // Beskedet om lotteriet får fokus, så att det läses upp och fokus inte hamnar på en knapp som har försvunnit
  useEffect(() => resultRef.current?.focus(), [result]);

  const selection = booking.kind === "flight" ? flightSelection(booking, selected) : charterSelection(booking, selected);

  return (
    <>
      <div className="flex flex-col gap-2">
        <h1 className="text-title-phone font-bold">Din bokning</h1>
        <p className="text-lg">
          Bokningsnummer <strong className="tracking-wider">{booking.bookingNumber}</strong>
          {cancelled && <strong className="ml-3 text-danger">Avbokad</strong>}
        </p>
        {booking.kind === "charter" && <p className="text-ink-muted">{booking.destination}</p>}
      </div>

      <div ref={resultRef} tabIndex={-1} className="outline-none empty:hidden">
        {result && (
          <Message kind={result.won ? "success" : "error"}>
            {result.won
              ? "Grattis! Vi får se om du får några pengar tillbaka – du får det!"
              : "Du måste betala fullt pris ändå, ledsen för det. Hör av dig till våra advokater om du är missnöjd."}
          </Message>
        )}
      </div>

      {booking.kind === "flight" ? (
        <FlightParts booking={booking} selected={selected} onChange={setSelected} />
      ) : (
        <CharterParts booking={booking} selected={selected} onChange={setSelected} />
      )}
      <ContactCard contact={booking.contact} />
      <TotalsCard booking={booking} />
      {booking.cancellations.length > 0 && <CancellationHistory cancellations={booking.cancellations} />}
      {!cancelled && (
        <CancelPanel
          selection={selection}
          credentials={credentials}
          ids={[...selected]}
          onCancelled={(done) => {
            setBooking(done.booking);
            setSelected(new Set());
            setResult({ won: done.won, amount: done.amount });
          }}
        />
      )}
      <div>
        <Button variant="secondary" onClick={onReset}>
          Sök en annan bokning
        </Button>
      </div>
    </>
  );
}
