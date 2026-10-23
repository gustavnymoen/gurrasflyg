"use client";

import { useRef, useState } from "react";
import { floatClass } from "./Card";

// Hur länge vi väntar efter sista tangenttrycket innan vi söker (ms)
const SEARCH_DELAY = 150;

// Sökfält med förslagslista. Hämtar förslag från searchUrl?q=<text>,
// som ska svara med en JSON-lista av objekt med id och name. Listan läggs
// under närmaste positionerade förälder, t.ex. rutan i en <Field>.
export default function Autocomplete<T extends { id: number; name: string }>({
  id,
  placeholder,
  className,
  searchUrl,
  label,
  detail,
  badge,
  emptyText = "Inga träffar",
  errorId,
  initial,
  onSelect,
}: {
  id: string;
  placeholder: string;
  className: string;
  searchUrl: string;
  // Texten som står i fältet när något är valt
  label: (item: T) => string;
  // Liten text under namnet, och text till höger, i förslagslistan
  detail?: (item: T) => string;
  badge?: (item: T) => string;
  emptyText?: string;
  // id på ett felmeddelande som hör till fältet (fältet markeras då som ogiltigt)
  errorId?: string;
  // Det som är valt från början, t.ex. sökningen på resultatsidan
  initial?: T;
  // Anropas med valt objekt, eller null när fältet töms/ändras.
  // Returnera false för att neka valet (fältet töms då).
  onSelect: (item: T | null) => boolean | void;
}) {
  const [text, setText] = useState(initial ? label(initial) : "");
  const [suggestions, setSuggestions] = useState<T[]>([]);
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(0);
  // Söktexten som förslagen i listan svarar på
  const [answered, setAnswered] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const pending = useRef<AbortController>(undefined);

  async function search(query: string) {
    // Avbryt en tidigare sökning som inte hunnit bli klar,
    // så att ett gammalt svar inte skriver över ett nyare
    pending.current?.abort();
    const controller = new AbortController();
    pending.current = controller;
    try {
      const res = await fetch(`${searchUrl}?q=${encodeURIComponent(query)}`, {
        signal: controller.signal,
      });
      setSuggestions(await res.json());
      setAnswered(query);
      setHighlighted(0);
      setOpen(true);
    } catch (e) {
      if ((e as Error).name !== "AbortError") throw e;
    }
  }

  function handleChange(value: string) {
    setText(value);
    onSelect(null); // texten matchar inte längre ett val
    clearTimeout(timer.current);
    if (value.trim() === "") {
      pending.current?.abort();
      setSuggestions([]);
      setOpen(false);
      return;
    }
    timer.current = setTimeout(() => search(value.trim()), SEARCH_DELAY);
  }

  function choose(item: T) {
    setText(onSelect(item) === false ? "" : label(item));
    setOpen(false);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!open || suggestions.length === 0) return;
    // Förslag för en äldre söktext (de nya har inte kommit än) väljs inte
    // med Enter eller Tab, så att valet alltid matchar det som står i fältet
    const current = answered === text.trim();
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlighted((i) => (i + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlighted((i) => (i - 1 + suggestions.length) % suggestions.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (current) choose(suggestions[highlighted]);
    } else if (e.key === "Tab") {
      // Tab väljer det markerade förslaget och fokus går vidare som vanligt (TRIP-010-R13)
      if (current) choose(suggestions[highlighted]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  const listId = `${id}-list`;

  return (
    <>
      <input
        id={id}
        type="text"
        role="combobox"
        aria-expanded={open}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={open && suggestions.length > 0 ? `${id}-opt-${highlighted}` : undefined}
        autoComplete="off"
        aria-invalid={errorId ? true : undefined}
        aria-describedby={errorId}
        placeholder={placeholder}
        value={text}
        onChange={(e) => handleChange(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => suggestions.length > 0 && setOpen(true)}
        onBlur={() => setOpen(false)}
        className={className}
      />
      {open && (
        <ul
          id={listId}
          role="listbox"
          className={`absolute top-full left-0 z-10 mt-1.5 w-full min-w-64 rounded-card-compact p-1.5 text-base ${floatClass}`}
        >
          {suggestions.length === 0 && <li className="px-3 py-2.5 text-ink-muted">{emptyText}</li>}
          {suggestions.map((item, i) => (
            <li
              key={item.id}
              id={`${id}-opt-${i}`}
              role="option"
              aria-selected={i === highlighted}
              // onMouseDown i stället för onClick: annars hinner fältet tappa
              // fokus och stänga listan innan klicket registreras
              onMouseDown={(e) => {
                e.preventDefault();
                choose(item);
              }}
              onMouseEnter={() => setHighlighted(i)}
              className={`flex cursor-pointer items-center justify-between gap-3 rounded-option px-3 py-2.5 ${
                i === highlighted ? "bg-accent/30" : ""
              }`}
            >
              <span>
                <Highlight text={item.name} query={text.trim()} />
                {detail && <span className="block text-small text-ink-muted">{detail(item)}</span>}
              </span>
              {badge && (
                <span className="rounded-md border border-line px-1.5 py-0.5 text-xs font-semibold text-ink-muted">
                  {badge(item)}
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

// Fetmarkerar den del av texten som matchar söktexten
function Highlight({ text, query }: { text: string; query: string }) {
  const start = text.toLowerCase().indexOf(query.toLowerCase());
  if (query === "" || start === -1) return <>{text}</>;
  const end = start + query.length;
  return (
    <>
      {text.slice(0, start)}
      <strong className="font-bold text-ink">{text.slice(start, end)}</strong>
      {text.slice(end)}
    </>
  );
}
