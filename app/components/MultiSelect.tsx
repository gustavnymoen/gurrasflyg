"use client";

import { useEffect, useId, useRef, useState } from "react";
import Checkbox from "./Checkbox";
import { floatClass } from "./Card";
import { fieldClass } from "./Field";
import { ChevronIcon } from "./icons";

export type MultiSelectOption = { value: string; name: string; count: number };

// Flervalsrutan (TRIP-034): en knapp med rutans namn och val ("Land: 2 valda")
// som öppnar en panel med en kryssruta per val. Escape och klick utanför stänger
// panelen, och fokus går då tillbaka till knappen, som i Menu. Valen sparas inte
// här: de ägs av den som använder rutan (onChange).
export default function MultiSelect({
  label,
  options,
  selected,
  onChange,
}: {
  label: string;
  options: MultiSelectOption[];
  selected: string[];
  onChange: (values: string[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const button = useRef<HTMLButtonElement>(null);
  const wrapper = useRef<HTMLDivElement>(null);
  const id = useId();

  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: PointerEvent) {
      if (wrapper.current?.contains(e.target as Node)) return;
      setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  const chosen = options.filter((option) => selected.includes(option.value));
  const summary = selected.length === 0 ? "Alla" : selected.length === 1 ? (chosen[0]?.name ?? "1 vald") : `${selected.length} valda`;

  return (
    <div
      ref={wrapper}
      className="relative"
      onKeyDown={(e) => {
        if (e.key !== "Escape" || !open) return;
        setOpen(false);
        button.current?.focus();
      }}
      // Tab ut ur panelen stänger den
      onBlur={(e) => e.relatedTarget && !wrapper.current?.contains(e.relatedTarget as Node) && setOpen(false)}
    >
      <button
        ref={button}
        type="button"
        aria-expanded={open}
        aria-controls={open ? id : undefined}
        onClick={() => setOpen(!open)}
        className={`${fieldClass("small")} flex cursor-pointer items-center justify-between gap-2 text-left`}
      >
        <span className="min-w-0 truncate">
          {label}: {summary}
        </span>
        <ChevronIcon open={open} className="h-4 w-4 shrink-0" />
      </button>
      {open && (
        <div
          id={id}
          role="group"
          aria-label={label}
          className={`${floatClass} absolute top-full left-0 z-20 mt-2 max-h-72 w-full overflow-y-auto rounded-card-compact p-2`}
        >
          <ul className="flex flex-col">
            {options.map((option, i) => (
              <li key={option.value} className="rounded-field px-3 py-1.5 hover:bg-accent/25">
                <Checkbox
                  id={`${id}-${i}`}
                  label={`${option.name} (${option.count})`}
                  checked={selected.includes(option.value)}
                  onChange={(checked) =>
                    onChange(checked ? [...selected, option.value] : selected.filter((v) => v !== option.value))
                  }
                />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
