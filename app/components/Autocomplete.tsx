"use client";

import { useRef, useState } from "react";

// Hur länge vi väntar efter sista tangenttrycket innan vi söker (ms)
const SEARCH_DELAY = 150;

// Sökfält med förslagslista. Hämtar förslag från searchUrl?q=<text>,
// som ska svara med en JSON-lista av objekt med id och name.
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
  // Anropas med valt objekt, eller null när fältet töms/ändras.
  // Returnera false för att neka valet (fältet töms då).
  onSelect: (item: T | null) => boolean | void;
}) {
  const [text, setText] = useState("");
  const [suggestions, setSuggestions] = useState<T[]>([]);
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(0);
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
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlighted((i) => (i + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlighted((i) => (i - 1 + suggestions.length) % suggestions.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      choose(suggestions[highlighted]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  const listId = `${id}-list`;

  return (
    <div className="relative">
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
          className="absolute z-10 mt-1 w-full min-w-64 overflow-hidden rounded-lg border-2 border-wine bg-neutral-900 shadow-xl shadow-black/50"
        >
          {suggestions.length === 0 && <li className="px-4 py-3 text-neutral-500">{emptyText}</li>}
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
              className={`flex cursor-pointer items-center justify-between gap-3 px-4 py-2.5 ${
                i === highlighted ? "bg-wine/40" : ""
              }`}
            >
              <span>
                <Highlight text={item.name} query={text.trim()} />
                {detail && <span className="block text-xs text-neutral-500">{detail(item)}</span>}
              </span>
              {badge && <span className="font-mono text-sm text-neutral-400">{badge(item)}</span>}
            </li>
          ))}
        </ul>
      )}
    </div>
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
      <strong className="text-wine-light">{text.slice(start, end)}</strong>
      {text.slice(end)}
    </>
  );
}
