"use client";

import { useId, useState } from "react";
import Button from "./Button";
import { ChevronIcon } from "./icons";

// Innehållet i ett avgångskort (flygkorten på /flyg, resorna i charter): en rad med
// sammanfattningen, en synlig Välj och en egen knapp som fäller ut detaljerna.
// Att fälla ut väljer ingenting och Välj kräver ingen utfällning (TRIP-043-R1, R2).
// Kortets ram och yta sätter den som använder det. label säger vilken avgång det är
// ("SK1122 kl 06:50"), för knapparnas namn. chosen sätts bara när valet blir kvar på
// sidan efter Välj (charter): då visas det vilken som är vald.
export default function ChoiceCard({
  summary,
  label,
  chosen,
  onChoose,
  children,
}: {
  summary: React.ReactNode;
  label: string;
  chosen?: boolean;
  onChoose: () => void;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const detailsId = useId();

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-x-5 gap-y-3 px-5 py-4">
        <div className="min-w-0 flex-1 basis-64">{summary}</div>
        <div className="flex items-center gap-3">
          {chosen && (
            <span aria-hidden="true" className="text-small font-bold">
              ✓ Vald
            </span>
          )}
          <Button
            variant={chosen ? "primary" : "secondary"}
            size="compact"
            aria-pressed={chosen}
            aria-label={`Välj ${label}`}
            onClick={onChoose}
          >
            Välj
          </Button>
          <button
            type="button"
            aria-expanded={open}
            aria-controls={detailsId}
            aria-label={`Visa mer om ${label}`}
            onClick={() => setOpen(!open)}
            className="flex h-8.5 w-8.5 items-center justify-center rounded-pill text-ink-muted transition-colors duration-160 hover:bg-surface-float hover:text-ink"
          >
            <ChevronIcon open={open} className="h-5 w-5" />
          </button>
        </div>
      </div>

      {open && (
        <div id={detailsId} className="border-t border-line px-5 py-4">
          {children}
        </div>
      )}
    </>
  );
}
