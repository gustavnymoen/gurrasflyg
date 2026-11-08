"use client";

import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { applyActions, bookNow, readContext, sameContext } from "./chatAgent";
import { bookedText, CHANGED_TEXT } from "@/lib/agent-rules";
import {
  FAIL_TEXT,
  GREETING,
  lastMessages,
  MAX_QUESTION_LENGTH,
  SHOW_LEFT_FROM,
  waitText,
} from "@/lib/chat-rules";
import type { Entry } from "@/lib/chat-saved";
import Answer from "./Answer";
import Button from "./Button";
import { fieldClass } from "./Field";
import AgnetaAvatar from "./AgnetaAvatar";
import { chatEpoch, updateChat } from "./useSavedChat";

const setEntries = (change: (entries: Entry[]) => Entry[]) =>
  updateChat((saved) => ({ ...saved, entries: change(saved.entries) }));


// Rubrikraden i panelen och i dialogen (TRIP-032-R3). Medan Agneta kopplas in syns bara knapparna;
// namnet finns då bara för skärmläsare, så att rutan har ett namn.
export function ChatHeader({
  connected,
  id,
  onMinimise,
  onClose,
}: {
  connected: boolean;
  id?: string;
  onMinimise: () => void;
  onClose: () => void;
}) {
  const [big, setBig] = useState(false);
  const picture = useRef<HTMLButtonElement>(null);

  // Den förstorade bilden stängs först av Escape (innan chatten minimeras) och av ett klick utanför (TRIP-035-R3)
  useEffect(() => {
    if (!big) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      e.preventDefault();
      e.stopPropagation();
      setBig(false);
    };
    const onPointer = (e: PointerEvent) => !picture.current?.contains(e.target as Node) && setBig(false);
    document.addEventListener("keydown", onKey, true);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey, true);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [big]);

  return (
    <div className="flex items-center gap-3">
      {connected && (
        <button
          ref={picture}
          type="button"
          aria-label="Förstora bilden på Agneta"
          aria-expanded={big}
          onClick={() => setBig((b) => !b)}
          className="shrink-0 rounded-full"
        >
          <AgnetaAvatar size={128} className={`${big ? "size-32" : "size-16 [@media(hover:hover)]:hover:size-32"} transition-[width,height] motion-reduce:transition-none`} />
        </button>
      )}
      {connected ? (
        <div className="flex-1">
          <h2 id={id} className="text-lg leading-tight font-semibold">
            Agneta Karenelius
          </h2>
          <p className="text-small text-ink-muted">Kundtjänstmedarbetare</p>
          <p className="flex items-center gap-1.5 text-small text-ink-muted">
            <span aria-hidden="true" data-testid="agneta-live-dot" className="size-2 rounded-full bg-success" />
            Live
          </p>
        </div>
      ) : (
        <>
          <h2 id={id} className="sr-only">
            Agneta
          </h2>
          <span className="flex-1" />
        </>
      )}
      <HeaderButton label="Minimera chatten" onClick={onMinimise} path="M5 12h14" />
      <HeaderButton label="Stäng chatten" onClick={onClose} path="M6 6l12 12M18 6L6 18" />
    </div>
  );
}

// Samtalet, hälsningen och fältet. tall: panelen, där loggen fyller höjden; dialogen har en högsta höjd.
export default function ChatBody({
  entries,
  agent,
  waiting,
  setWaiting,
  tall,
}: {
  entries: Entry[];
  agent: boolean;
  waiting: boolean;
  setWaiting: (waiting: boolean) => void;
  tall: boolean;
}) {
  const router = useRouter();
  const [question, setQuestion] = useState("");
  // Boka och betala: medan bokningen sparas, och felet om den inte gick
  const [booking, setBooking] = useState(false);
  const [bookError, setBookError] = useState<string | null>(null);
  const labelId = useId();
  const root = useRef<HTMLDivElement>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const fieldRef = useRef<HTMLInputElement>(null);
  const connecting = entries.length === 0;
  const wasConnecting = useRef(connecting);

  // Första gången i en session: en kort inkoppling, sedan Agnetas hälsning (R7). Hälsningen ligger i
  // samtalet, så den kommer inte igen. Stängs chatten under tiden börjar inkopplingen om.
  useEffect(() => {
    if (!connecting) return;
    const timer = setTimeout(
      () => setEntries((list) => (list.length > 0 ? list : [{ role: "assistant", content: GREETING }])),
      2000 + Math.random() * 1000,
    );
    return () => clearTimeout(timer);
  }, [connecting]);

  // Inkopplingsvyn som hade fokus försvinner: fokus går till fältet
  useEffect(() => {
    const active = document.activeElement;
    if (wasConnecting.current && !connecting && (active === document.body || root.current?.contains(active))) {
      fieldRef.current?.focus();
    }
    wasConnecting.current = connecting;
  }, [connecting]);

  // Det senaste syns alltid
  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight });
  }, [entries, waiting]);

  async function send(event: React.FormEvent) {
    event.preventDefault();
    const text = question.trim();
    if (text === "" || waiting) return;
    const asked: Entry = { role: "user", content: text };
    setEntries((list) => [...list, asked]);
    setQuestion("");
    setWaiting(true);
    const history = [...entries, asked].filter((e) => !e.failed && !e.notice);
    // I agentläget följer sidan och det icke-personliga som valts med frågan (TRIP-030-R4)
    const context = agent ? readContext() : undefined;
    // Rensas chatten medan frågan väntar (Stäng) händer inget mer med den: Chat har redan nollställt väntan
    const epoch = chatEpoch();
    const current = (change: () => void) => epoch === chatEpoch() && change();
    const notice = (content: string) =>
      current(() => setEntries((list) => [...list.slice(0, -1), { ...asked, failed: true }, { role: "assistant", content, notice: true }]));
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: lastMessages(history), ...(context && { agent: context }) }),
      });
      if (response.status === 429) {
        notice(waitText(Number(response.headers.get("Retry-After")) || 60));
      } else if (response.ok) {
        const { reply, help, book, actions, all } = await response.json();
        current(() => {
          // Har besökaren ändrat något medan Agneta svarade släpps åtgärderna och knappen, och hon säger det (R4)
          const changed = !!context && !sameContext(context, readContext());
          setEntries((list) => [
            ...list,
            { role: "assistant", content: reply, ...(help === true && !changed && { help: true }), ...(all === true && { all: true }), ...(book === true && !changed && { book: true }) },
            ...(changed ? [{ role: "assistant" as const, content: CHANGED_TEXT, notice: true }] : []),
          ]);
          if (context && !changed && Array.isArray(actions)) applyActions(actions, router);
        });
      } else {
        notice(FAIL_TEXT);
      }
    } catch {
      notice(FAIL_TEXT);
    } finally {
      current(() => setWaiting(false));
    }
  }

  function startAgent(on: boolean) {
    updateChat((saved) => ({ ...saved, agent: on }));
    fieldRef.current?.focus();
  }

  async function book() {
    if (booking) return;
    setBooking(true);
    setBookError(null);
    const result = await bookNow(router);
    if ("error" in result) setBookError(result.error);
    else setEntries((list) => [...list, { role: "assistant", content: bookedText(result.bookingNumber), notice: true }]);
    setBooking(false);
  }

  const left = MAX_QUESTION_LENGTH - question.length;
  return (
    <div ref={root} className={`flex flex-col text-left ${tall ? "min-h-0 flex-1" : ""}`}>
      <p className="mt-3 text-small text-ink-muted">
        Agneta svarar bara om våra charterresmål och hur du bokar. Skriv inga personuppgifter: frågorna skickas till
        Anthropic.{agent && " Namn, bokningsnummer och kontaktuppgifter fyller du i på sidan, aldrig här."}
      </p>
      <p role="status" className="sr-only">
        {agent ? "Agneta hjälper dig nu." : ""}
      </p>
      {connecting ? (
        <div role="status" tabIndex={-1} data-autofocus className="mt-4 flex items-center gap-3 text-ink-muted">
          <span
            aria-hidden="true"
            className="size-5 animate-spin rounded-full border-2 border-line-strong border-t-accent-strong motion-reduce:animate-none"
          />
          Kopplar in Agneta …
        </div>
      ) : (
        <>
          {agent && (
            <div className="mt-3 flex items-center justify-between gap-2 rounded-lg border border-line bg-surface-sunk px-3 py-2">
              <span className="font-medium">Agneta hjälper dig</span>
              <Button size="compact" variant="secondary" onClick={() => startAgent(false)}>
                Sluta
              </Button>
            </div>
          )}
          <div
            ref={logRef}
            tabIndex={0}
            role="log"
            aria-label="Samtalet"
            className={`mt-4 flex min-h-24 flex-col gap-3 overflow-y-auto pr-1 ${tall ? "flex-1" : "max-h-[45vh]"}`}
          >
            {entries.map((e, i) => (
              <Bubble key={i} mine={e.role === "user"}>
                <span className="sr-only">{e.role === "user" ? "Du: " : "Agneta: "}</span>
                {e.role === "user" ? e.content : <Answer text={e.content} whole={e.all} />}
                {i === entries.length - 1 && !waiting && (
                  <>
                    {e.help && !agent && (
                      <Button size="compact" className="mt-2" onClick={() => startAgent(true)}>
                        Hjälp mig
                      </Button>
                    )}
                    {e.book && agent && (
                      <div className="mt-2 flex flex-col gap-2">
                        <Button size="compact" disabled={booking} onClick={book}>
                          Boka och betala
                        </Button>
                        {bookError && (
                          <p role="alert" className="text-small font-medium">
                            {bookError}
                          </p>
                        )}
                      </div>
                    )}
                  </>
                )}
              </Bubble>
            ))}
            {waiting && (
              <Bubble mine={false}>
                <span className="text-ink-muted">Agneta tänker …</span>
              </Bubble>
            )}
          </div>
          <form onSubmit={send} className="mt-4 flex flex-col gap-2">
            <label htmlFor={labelId} className="text-small text-ink-muted">
              Din fråga
            </label>
            <input
              id={labelId}
              ref={fieldRef}
              data-autofocus
              value={question}
              maxLength={MAX_QUESTION_LENGTH}
              autoComplete="off"
              onChange={(e) => setQuestion(e.target.value)}
              className={fieldClass("small")}
            />
            {question.length >= SHOW_LEFT_FROM && <p className="text-small text-ink-muted">{left} tecken kvar</p>}
            <div className="flex justify-end">
              <Button type="submit" disabled={waiting}>
                Skicka
              </Button>
            </div>
          </form>
        </>
      )}
    </div>
  );
}

// En pratbubbla (TRIP-032-R3, TRIP-035-R2): besökarens till höger (högst 85 % bred), Agnetas till vänster över hela bredden, med ett kantigt hörn mot avsändaren
function Bubble({ mine, children }: { mine: boolean; children: React.ReactNode }) {
  const side = mine ? "max-w-[85%] self-end rounded-br-sm bg-accent text-on-accent" : "w-full self-start rounded-bl-sm border border-line bg-surface-sunk";
  return <div className={`rounded-2xl px-3 py-2 wrap-break-word ${side}`}>{children}</div>;
}

function HeaderButton({ label, onClick, path }: { label: string; onClick: () => void; path: string }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="grid size-9 place-items-center rounded-full text-ink-muted hover:bg-accent/25 hover:text-ink"
    >
      <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5 fill-none stroke-current" strokeWidth="2" strokeLinecap="round">
        <path d={path} />
      </svg>
    </button>
  );
}
