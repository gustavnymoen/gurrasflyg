"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { buttonClass } from "./Button";
import ChatBody, { ChatHeader } from "./ChatBody";
import Dialog from "./Dialog";
import AgnetaAvatar from "./AgnetaAvatar";
import Button from "./Button";
import { clearChat, updateChat, useSavedChat } from "./useSavedChat";

// lg i Tailwind: från den här bredden är chatten en panel till höger, annars en dialog (TRIP-032-R4)
const WIDE = "(min-width: 64rem)";

function useWide() {
  return useSyncExternalStore(
    (listener) => {
      const query = matchMedia(WIDE);
      query.addEventListener("change", listener);
      return () => query.removeEventListener("change", listener);
    },
    () => matchMedia(WIDE).matches,
    () => false,
  );
}

// Knappen "Fråga Agneta" och chatten (TRIP-017-R7, R9, TRIP-032). Samtalet och om chatten är öppen
// ligger i sessionslagringen (useSavedChat), så de följer med till nästa sida och en omladdning.
// Minimera döljer chatten men behåller samtalet; Stäng frågar först och rensar samtalet, så att nästa
// öppning är en ny chatt med ny inkoppling och hälsning.
export default function Chat() {
  const { open, agent, entries } = useSavedChat();
  const wide = useWide();
  // Här och inte i rutan: stängs rutan medan Agneta tänker ska en ny fråga inte kunna skickas samtidigt
  const [waiting, setWaiting] = useState(false);
  const [asking, setAsking] = useState(false);
  const button = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const focusField = useRef(false); // besökaren öppnade chatten nu, till skillnad från när den återställs vid en sidladdning
  // Fokus till knappen när chatten dolts. Dialogens egen återgång räcker inte efter Stäng: knappen den
  // kom från är då borta.
  const returnFocus = useRef(false);
  const panel = open && wide;

  // Panelen trycker ihop sidan: globals.css ger sidan marginal så länge attributet finns
  useEffect(() => {
    if (!panel) return;
    document.documentElement.setAttribute("data-agneta-panel", "");
    if (focusField.current) panelRef.current?.querySelector<HTMLElement>("[data-autofocus]")?.focus();
    focusField.current = false;
    return () => document.documentElement.removeAttribute("data-agneta-panel");
  }, [panel]);

  // Knappen finns först när chatten har stängts: fokus går tillbaka dit (R6)
  useEffect(() => {
    if (open || !returnFocus.current) return;
    returnFocus.current = false;
    button.current?.focus();
  }, [open]);

  const minimise = () => {
    returnFocus.current = true;
    updateChat((saved) => ({ ...saved, open: false }));
  };
  const closeAndClear = () => {
    setAsking(false);
    returnFocus.current = true;
    setWaiting(false);
    clearChat();
  };
  const show = () => {
    focusField.current = wide;
    updateChat((saved) => ({ ...saved, open: true }));
  };
  const connected = entries.length > 0;

  return (
    <>
      {!panel && (
        <button ref={button} type="button" onClick={show} className={`${buttonClass("primary", "compact")} fixed right-4 bottom-4 z-20 pl-1.5 shadow-float`}>
          <AgnetaAvatar size={28} className="size-7" />
          Fråga Agneta
        </button>
      )}
      {panel && (
        <section
          ref={panelRef}
          aria-label="Agneta"
          onKeyDown={(e) => e.key === "Escape" && minimise()}
          className="fixed top-0 right-0 z-30 flex h-dvh w-(--agneta-panel-width) flex-col border-l border-line bg-surface-float p-4 text-ink"
        >
          <ChatHeader connected={connected} onMinimise={minimise} onClose={() => setAsking(true)} />
          <ChatBody entries={entries} agent={agent} waiting={waiting} setWaiting={setWaiting} tall />
        </section>
      )}
      {open && !wide && (
        <Dialog
          header={(id) => <ChatHeader connected={connected} id={id} onMinimise={minimise} onClose={() => setAsking(true)} />}
          role="dialog"
          wide
          onClose={minimise}
        >
          <ChatBody entries={entries} agent={agent} waiting={waiting} setWaiting={setWaiting} tall={false} />
        </Dialog>
      )}
      {asking && (
        <Dialog role="dialog" title="Är du säker?" detail="Samtalet rensas, och nästa gång du öppnar chatten börjar den om." onClose={() => setAsking(false)}>
          <Button size="compact" onClick={closeAndClear}>
            Ja, stäng och rensa
          </Button>
          <Button variant="secondary" size="compact" onClick={() => setAsking(false)} data-autofocus>
            Nej, behåll
          </Button>
        </Dialog>
      )}
    </>
  );
}
