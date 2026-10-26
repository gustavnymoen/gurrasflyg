"use client";

import { useId, useRef, useState } from "react";

export type Tab = { id: string; label: string; content: React.ReactNode };

// Flikar enligt WAI-ARIA: bara den valda fliken når man med Tab, pilarna
// flyttar mellan flikarna (och Home och End till första och sista), och en
// flik väljs när den får fokus (TRIP-018-R1). Alla paneler ligger kvar i
// sidan och de som inte syns är dolda, så att det besökaren fyllt i finns
// kvar när hen byter flik och tillbaka.
export default function Tabs({ label, tabs }: { label: string; tabs: Tab[] }) {
  const [selected, setSelected] = useState(tabs[0].id);
  const base = useId();
  const refs = useRef<Record<string, HTMLButtonElement | null>>({});

  function move(e: React.KeyboardEvent, index: number) {
    const last = tabs.length - 1;
    const target =
      e.key === "ArrowRight" ? (index === last ? 0 : index + 1)
      : e.key === "ArrowLeft" ? (index === 0 ? last : index - 1)
      : e.key === "Home" ? 0
      : e.key === "End" ? last
      : null;
    if (target === null) return;
    e.preventDefault();
    setSelected(tabs[target].id);
    refs.current[tabs[target].id]?.focus();
  }

  return (
    <div>
      <div role="tablist" aria-label={label} className="mb-3 flex gap-2">
        {tabs.map((tab, i) => (
          <button
            key={tab.id}
            ref={(el) => {
              refs.current[tab.id] = el;
            }}
            role="tab"
            id={`${base}-tab-${tab.id}`}
            aria-selected={tab.id === selected}
            aria-controls={`${base}-panel-${tab.id}`}
            tabIndex={tab.id === selected ? 0 : -1}
            onClick={() => setSelected(tab.id)}
            onKeyDown={(e) => move(e, i)}
            className={`h-10 cursor-pointer rounded-pill border-[1.5px] px-5 font-bold transition-[background-color,border-color,color] duration-160 ease-out ${
              tab.id === selected
                ? "border-line-strong bg-accent-soft text-ink"
                : "border-transparent text-ink-muted hover:text-ink"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {tabs.map((tab) => (
        <div
          key={tab.id}
          role="tabpanel"
          id={`${base}-panel-${tab.id}`}
          aria-labelledby={`${base}-tab-${tab.id}`}
          hidden={tab.id !== selected}
        >
          {tab.content}
        </div>
      ))}
    </div>
  );
}
