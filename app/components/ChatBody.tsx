"use client";

import { useEffect, useId, useRef, useState } from "react";
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
  return (
    <div className="flex items-center gap-3">
      {connected && <AgnetaAvatar size={40} className="size-10" />}
      {connected ? (
        <div className="flex-1">
          <h2 id={id} className="text-lg leading-tight font-semibold">
            Agneta Spydenius
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
  waiting,
  setWaiting,
  tall,
}: {
  entries: Entry[];
  waiting: boolean;
  setWaiting: (waiting: boolean) => void;
  tall: boolean;
}) {
  const [question, setQuestion] = useState("");
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
    // Rensas chatten medan frågan väntar (Stäng) händer inget mer med den: Chat har redan nollställt väntan
    const epoch = chatEpoch();
    const current = (change: () => void) => epoch === chatEpoch() && change();
    const notice = (content: string) =>
      current(() => setEntries((list) => [...list.slice(0, -1), { ...asked, failed: true }, { role: "assistant", content, notice: true }]));
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: lastMessages(history) }),
      });
      if (response.status === 429) {
        notice(waitText(Number(response.headers.get("Retry-After")) || 60));
      } else if (response.ok) {
        const { reply } = await response.json();
        current(() => setEntries((list) => [...list, { role: "assistant", content: reply }]));
      } else {
        notice(FAIL_TEXT);
      }
    } catch {
      notice(FAIL_TEXT);
    } finally {
      current(() => setWaiting(false));
    }
  }

  const left = MAX_QUESTION_LENGTH - question.length;
  return (
    <div ref={root} className={`flex flex-col text-left ${tall ? "min-h-0 flex-1" : ""}`}>
      <p className="mt-3 text-small text-ink-muted">
        Agneta svarar bara om våra charterresmål och hur du bokar. Skriv inga personuppgifter: frågorna skickas till
        Anthropic.
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
                {e.role === "user" ? e.content : <Answer text={e.content} />}
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

// En pratbubbla (R3): besökarens till höger, Agnetas till vänster, med ett kantigt hörn mot avsändaren
function Bubble({ mine, children }: { mine: boolean; children: React.ReactNode }) {
  const side = mine ? "self-end rounded-br-sm bg-accent text-on-accent" : "self-start rounded-bl-sm border border-line bg-surface-sunk";
  return <div className={`max-w-[85%] rounded-2xl px-3 py-2 wrap-break-word ${side}`}>{children}</div>;
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
