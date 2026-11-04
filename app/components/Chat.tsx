"use client";

import { useEffect, useId, useRef, useState } from "react";
import {
  type ChatMessage,
  FAIL_TEXT,
  lastMessages,
  MAX_QUESTION_LENGTH,
  SHOW_LEFT_FROM,
  waitText,
} from "@/lib/chat-rules";
import Button, { buttonClass } from "./Button";
import Dialog from "./Dialog";
import { fieldClass } from "./Field";

// failed: frågan som inte fick något svar, med Agnetas felmeddelande efter sig (inget av det följer med nästa fråga)
type Entry = ChatMessage & { failed?: boolean; notice?: boolean };

// Knappen "Fråga Agneta" och chatten (TRIP-017-R7, R9). Samtalet ligger här, så det finns kvar när
// rutan stängs och öppnas igen, men inte efter en omladdning eller på en annan sida.
export default function Chat() {
  const [open, setOpen] = useState(false);
  const [entries, setEntries] = useState<Entry[]>([]);
  // Här och inte i rutan: stängs rutan medan Agneta tänker ska en ny fråga inte kunna skickas samtidigt
  const [waiting, setWaiting] = useState(false);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={`${buttonClass("primary", "compact")} fixed right-4 bottom-4 z-20 shadow-float`}>
        Fråga Agneta
      </button>
      {open && <ChatDialog entries={entries} setEntries={setEntries} waiting={waiting} setWaiting={setWaiting} onClose={() => setOpen(false)} />}
    </>
  );
}

function ChatDialog({
  entries,
  setEntries,
  waiting,
  setWaiting,
  onClose,
}: {
  entries: Entry[];
  setEntries: React.Dispatch<React.SetStateAction<Entry[]>>;
  waiting: boolean;
  setWaiting: (waiting: boolean) => void;
  onClose: () => void;
}) {
  const [question, setQuestion] = useState("");
  const labelId = useId();
  const logRef = useRef<HTMLDivElement>(null);

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
    const notice = (content: string) => setEntries((list) => [...list.slice(0, -1), { ...asked, failed: true }, { role: "assistant", content, notice: true }]);
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
        setEntries((list) => [...list, { role: "assistant", content: reply }]);
      } else {
        notice(FAIL_TEXT);
      }
    } catch {
      notice(FAIL_TEXT);
    } finally {
      setWaiting(false);
    }
  }

  const left = MAX_QUESTION_LENGTH - question.length;
  return (
    <Dialog
      title="Fråga Agneta"
      detail="Agneta svarar bara om våra charterresmål och hur du bokar. Skriv inga personuppgifter: frågorna skickas till Anthropic."
      role="dialog"
      wide
      onClose={onClose}
    >
      <div ref={logRef} tabIndex={0} role="log" aria-label="Samtalet" className="flex max-h-[45vh] min-h-24 flex-col gap-3 overflow-y-auto pr-1 text-left">
        {entries.map((e, i) => (
          <p key={i} className={e.role === "user" ? "self-end rounded-field bg-surface-sunk px-3 py-2" : "self-start"}>
            <span className="sr-only">{e.role === "user" ? "Du: " : "Agneta: "}</span>
            {e.content}
          </p>
        ))}
        {waiting && <p className="self-start text-ink-muted">Agneta tänker …</p>}
      </div>
      <form onSubmit={send} className="mt-4 flex flex-col gap-2 text-left">
        <label htmlFor={labelId} className="text-small text-ink-muted">
          Din fråga
        </label>
        <input
          id={labelId}
          data-autofocus
          value={question}
          maxLength={MAX_QUESTION_LENGTH}
          autoComplete="off"
          onChange={(e) => setQuestion(e.target.value)}
          className={fieldClass("small")}
        />
        {question.length >= SHOW_LEFT_FROM && (
          <p className="text-small text-ink-muted">{left} tecken kvar</p>
        )}
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose}>
            Stäng
          </Button>
          <Button type="submit" disabled={waiting}>
            Skicka
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
