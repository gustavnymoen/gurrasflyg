"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { clearBooking } from "../flyg/boka/store";
import { abortTarget, isInFlow } from "@/lib/flow";
import Button from "./Button";
import Dialog from "./Dialog";

// Att lämna flygbokningen eller charter med avsikt (TRIP-018-R3). Inne i ett
// flöde frågar Avbryt, ordmärket och länkarna i menyn först; på andra sidor är
// ordmärket och Start vanliga länkar.

// Frågan "Är du säker?": Ja, avbryt kastar bort bokningen och går till to
function AbortDialog({ to, onClose }: { to: string; onClose: () => void }) {
  const router = useRouter();

  function abort() {
    clearBooking();
    // Stängs först, så att frågan inte ligger kvar öppen nästa gång besökaren
    // är i ett flöde
    onClose();
    router.push(to);
  }

  return (
    <Dialog role="dialog" title="Är du säker?" detail="Det du har valt kastas bort." onClose={onClose}>
      <Button size="compact" onClick={abort}>
        Ja, avbryt
      </Button>
      <Button variant="secondary" size="compact" onClick={onClose} data-autofocus>
        Nej, fortsätt
      </Button>
    </Dialog>
  );
}

// Knappen Avbryt, bara i ett flöde
export function AbortButton() {
  const [asking, setAsking] = useState(false);
  const pathname = usePathname();
  if (!isInFlow(pathname)) return null;
  return (
    <>
      <Button variant="secondary" size="compact" onClick={() => setAsking(true)}>
        Avbryt
      </Button>
      {asking && <AbortDialog to={abortTarget(pathname)} onClose={() => setAsking(false)} />}
    </>
  );
}

// En länk till valfri sida: i ett flöde en knapp som frågar först (TRIP-023-R1).
// onNavigate körs när länken följs direkt, utan frågan.
export function FlowLink({
  to,
  className,
  onNavigate,
  children,
}: {
  to: string;
  className: string;
  onNavigate?: () => void;
  children: React.ReactNode;
}) {
  const [asking, setAsking] = useState(false);
  const pathname = usePathname();
  if (!isInFlow(pathname)) {
    return (
      <Link href={to} className={className} onClick={onNavigate}>
        {children}
      </Link>
    );
  }
  return (
    <>
      <button type="button" className={`${className} cursor-pointer`} onClick={() => setAsking(true)}>
        {children}
      </button>
      {asking && <AbortDialog to={to} onClose={() => setAsking(false)} />}
    </>
  );
}

// Länken till startsidan
export function StartLink({ className, children }: { className: string; children: React.ReactNode }) {
  return (
    <FlowLink to="/" className={className}>
      {children}
    </FlowLink>
  );
}
