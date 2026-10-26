"use client";

import { useRef, useState, useTransition } from "react";
import type { Selection } from "@/lib/cancel-rules";
import { formatPrice } from "@/lib/format";
import type { Cancelled, Credentials } from "@/lib/my-booking";
import Button from "../components/Button";
import Card from "../components/Card";
import Dialog from "../components/Dialog";
import Message from "../components/Message";
import { cancelAction } from "./actions";

// Vad som är kryssat, vad det är värt och att det är ett lotteri, före knappen
// (TRIP-023-R9), och frågan "Är du säker?" som är det enda som avbokar.
// Webbläsaren skickar bara vad som är kryssat: beloppet och utfallet kommer från servern (R10).
export default function CancelPanel({
  selection,
  credentials,
  ids,
  onCancelled,
}: {
  selection: Selection;
  credentials: Credentials;
  ids: number[];
  onCancelled: (done: Cancelled) => void;
}) {
  const [asking, setAsking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  // Ett nytt id för varje fråga; två klick på Ja, avboka blir en avbokning (R10)
  const requestId = useRef("");
  const { lines, amount } = selection;

  function ask() {
    requestId.current = crypto.randomUUID();
    setError(null);
    setAsking(true);
  }

  function confirm() {
    startTransition(async () => {
      const result = await cancelAction({ ...credentials, requestId: requestId.current, ids });
      setAsking(false);
      if ("error" in result) setError(result.error);
      else onCancelled(result);
    });
  }

  return (
    <Card labelledBy="avboka" className="flex flex-col gap-3">
      <h2 id="avboka" className="text-section font-bold">
        Avboka
      </h2>
      <p>
        Att avboka hos Gurras Flyg är ett lotteri. Vi singlar slant: 50/50 att du får pengarna tillbaka. Förlorar du
        betalar du fullt pris ändå.
      </p>
      {lines.length === 0 ? (
        <p className="text-ink-muted">Kryssa det du vill avboka.</p>
      ) : (
        <>
          <ul className="flex flex-col gap-0.5">
            {lines.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
          <p>
            Vinner du får du <strong>{formatPrice(amount)}</strong> tillbaka. Förlorar du får du inget.
          </p>
        </>
      )}
      {error && <Message kind="error">{error}</Message>}
      <div>
        <Button disabled={lines.length === 0} onClick={ask}>
          Avboka
        </Button>
      </div>
      {asking && (
        <Dialog
          title="Är du säker?"
          detail={`Du avbokar ${lines.join(", ")} för ${formatPrice(amount)}. Det är 50/50 att du får pengarna tillbaka. Förlorar du betalar du fullt pris ändå. Det går inte att ångra.`}
          onClose={() => !pending && setAsking(false)}
        >
          <Button size="compact" onClick={confirm} disabled={pending}>
            Ja, avboka
          </Button>
          <Button variant="secondary" size="compact" onClick={() => setAsking(false)} disabled={pending} data-autofocus>
            Nej
          </Button>
        </Dialog>
      )}
    </Card>
  );
}
