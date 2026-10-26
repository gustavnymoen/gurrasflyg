"use client";

import { useId, useState } from "react";
import Button from "./Button";
import { ChevronIcon } from "./icons";

// Innehållet i ett valkort: en knapp över hela kortets bredd som fäller ut
// detaljerna och Välj (flygkorten på /flyg, plankorten på /flyg/plan). Kortets
// ram och yta sätter den som använder det; här finns bara det som är gemensamt.
// summaryClassName och chevronClassName styr rutnätet, som skiljer mellan korten.
export default function ChoiceCard({
  summary,
  summaryClassName,
  chevronClassName,
  onChoose,
  children,
}: {
  summary: React.ReactNode;
  summaryClassName: string;
  chevronClassName: string;
  onChoose: () => void;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const detailsId = useId();

  return (
    <>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={detailsId}
        onClick={() => setOpen(!open)}
        className={`w-full rounded-card-compact px-5 py-4 text-left transition-colors duration-160 hover:bg-surface-float ${summaryClassName}`}
      >
        {summary}
        <ChevronIcon open={open} className={`h-5 w-5 text-ink-muted ${chevronClassName}`} />
      </button>

      {open && (
        <div id={detailsId} className="flex flex-col gap-4 border-t border-line px-5 py-4">
          {children}
          <Button onClick={onChoose} className="self-start">
            Välj
          </Button>
        </div>
      )}
    </>
  );
}
