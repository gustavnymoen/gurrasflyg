"use client";

// Byggstenar för adminsidans tabeller: ihopfällbart kort, dialogruta,
// fält med etikett, penna/papperskorg-knappar och en hjälpare för att anropa
// server actions.
// De bygger på de delade komponenterna i app/components/ (DESIGN.md).

import { cloneElement, useEffect, useId, useRef, useState, useTransition } from "react";
import type { ActionResult } from "./actions";
import { ChevronIcon, PencilIcon, TrashIcon } from "../components/icons";
import Button from "../components/Button";
import Card, { floatingCardClass } from "../components/Card";
import { fieldClass } from "../components/Field";

// ---- Kort som går att fälla ihop

export function CollapsibleCard({
  title,
  count,
  children,
}: {
  title: string;
  count?: number;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(true);
  return (
    <Card size="compact">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="flex w-full items-center gap-1.5 text-left text-base font-semibold"
      >
        <ChevronIcon open={open} />
        {title}
        {count !== undefined && (
          <span className="text-xs font-normal text-ink-muted">({count})</span>
        )}
      </button>
      {open && <div className="mt-3">{children}</div>}
    </Card>
  );
}

// ---- Fält med en etikett som syns ovanför (WCAG 3.3.2)

// Etiketten kopplas till fältet med htmlFor och blir fältets namn för
// skärmläsare. Den omsluter inte fältet: då skulle en <select> få sitt valda
// alternativ i namnet ("Klass Välj klass"). Bredden sätts här, fältet inuti
// fyller den (w-full).
export function LabeledField({
  label,
  className = "",
  children,
}: {
  label: string;
  className?: string;
  children: React.ReactElement<{ id?: string }>; // ett <input>, <select> eller <textarea>
}) {
  const id = useId();
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <label htmlFor={id} className="text-xs text-ink-muted">
        {label}
      </label>
      {cloneElement(children, { id })}
    </div>
  );
}

// Ett fält för en pris- eller tidsfaktor (TRIP-011-R6, R8), rött när den inte
// går att läsa. Meddelandet står under formuläret, med id errorId.
export function FactorField({
  label,
  value,
  onChange,
  invalid,
  errorId,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  invalid: boolean;
  errorId: string;
}) {
  return (
    <LabeledField label={label} className="w-24">
      <input
        inputMode="decimal"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={invalid || undefined}
        aria-describedby={invalid ? errorId : undefined}
        className={fieldClass("compact", "w-full text-right", invalid)}
      />
    </LabeledField>
  );
}

// ---- Dialogruta som svävar ovanpå sidan

// Webbläsarens egen <dialog> med showModal(): sidan bakom går inte att nå med
// Tab och Escape stänger (WCAG 2.1.2). När dialogen stängs får knappen som
// öppnade den fokus igen (WCAG 2.4.3). Klick utanför rutan stänger också.
// Själva <dialog> är det svävande kortet.
export function Dialog({
  title,
  detail,
  onClose,
  children,
}: {
  title: string;
  detail?: string;
  onClose: () => void;
  children: React.ReactNode; // knapparna
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  useEffect(() => {
    const dialog = ref.current!;
    const opener = document.activeElement as HTMLElement | null;
    dialog.showModal();
    // Reacts autoFocus körs medan dialogen ännu är stängd, så knappen som ska
    // ha fokus först märks med data-autofocus och får fokus här
    dialog.querySelector<HTMLElement>("[data-autofocus]")?.focus();
    // Webbläsaren lämnar inte tillbaka fokus själv: när den här städningen körs
    // har React redan tagit bort dialogen från sidan
    return () => {
      dialog.close();
      opener?.focus();
    };
  }, []);

  return (
    <dialog
      ref={ref}
      role="alertdialog"
      aria-labelledby={titleId}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        // Klick på bakgrunden landar på själva <dialog>, utanför rutan. Klick på
        // knapparna (också med Enter, som ger ett klick i punkten 0, 0) räknas inte.
        if (e.target !== e.currentTarget) return;
        const box = e.currentTarget.getBoundingClientRect();
        const outside =
          e.clientX < box.left || e.clientX > box.right || e.clientY < box.top || e.clientY > box.bottom;
        if (outside) onClose();
      }}
      className={`${floatingCardClass} m-auto w-[calc(100%-2rem)] max-w-sm text-center text-ink backdrop:bg-ground/80`}
    >
      <h2 id={titleId} className="text-lg font-semibold">
        {title}
      </h2>
      {detail && <p className="mt-2 text-sm text-ink-muted">{detail}</p>}
      <div className="mt-6 flex justify-center gap-3">{children}</div>
    </dialog>
  );
}

// ---- Små knappar med en ikon: penna, papperskorg, bock, kryss och pil

export function IconButton({
  label,
  onClick,
  disabled = false,
  expanded,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  // Bara för knappar som fäller ut något
  expanded?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-expanded={expanded}
      title={label}
      onClick={onClick}
      disabled={disabled}
      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-ink-muted transition-colors hover:bg-accent/25 hover:text-ink disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent"
    >
      {children}
    </button>
  );
}

export function EditButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <IconButton label={label} onClick={onClick}>
      <PencilIcon />
    </IconButton>
  );
}

// Papperskorg utan varning, för rader i ett formulär som inte är sparat än
export function RemoveButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <IconButton label={label} onClick={onClick}>
      <TrashIcon />
    </IconButton>
  );
}

// Papperskorg med varning: "Är du säker?" med Ja/Nej. Om raden används avgör
// servern vid borttagningen och felet visas som "Du kan ej ta bort". Sidans
// egen uppgift om vad som används kan vara gammal precis efter en ändring
// (TRIP-016), så knappen litar inte på den.
export function DeleteButton({
  label,
  onDelete,
}: {
  label: string;
  onDelete: () => Promise<ActionResult>;
}) {
  const [dialog, setDialog] = useState<null | "confirm" | { blocked: string }>(null);
  const [pending, startTransition] = useTransition();

  function confirm() {
    startTransition(async () => {
      const result = await onDelete();
      // Används raden visas serverns förklaring
      setDialog(result.ok ? null : { blocked: result.error });
    });
  }

  return (
    <>
      <IconButton label={label} onClick={() => setDialog("confirm")}>
        <TrashIcon />
      </IconButton>
      {dialog === "confirm" && (
        <Dialog title="Är du säker?" onClose={() => setDialog(null)}>
          <Button size="compact" onClick={confirm} disabled={pending}>
            {pending ? "Tar bort…" : "Ja"}
          </Button>
          <Button variant="secondary" size="compact" onClick={() => setDialog(null)} data-autofocus>
            Nej
          </Button>
        </Dialog>
      )}
      {dialog !== null && dialog !== "confirm" && (
        <Dialog title="Du kan ej ta bort" detail={dialog.blocked} onClose={() => setDialog(null)}>
          <Button size="compact" onClick={() => setDialog(null)} data-autofocus>
            OK
          </Button>
        </Dialog>
      )}
    </>
  );
}

// ---- Spara / Avbryt

export function SaveCancel({ pending, onCancel }: { pending: boolean; onCancel: () => void }) {
  return (
    <div className="flex gap-2">
      <Button type="submit" size="compact" disabled={pending}>
        {pending ? "Sparar…" : "Spara"}
      </Button>
      <Button variant="secondary" size="compact" onClick={onCancel}>
        Avbryt
      </Button>
    </div>
  );
}

// ---- Anropa en server action och håll koll på "sparar…" och fel

export function useAction() {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function run(action: () => Promise<ActionResult>, onSuccess: () => void) {
    setError(null);
    startTransition(async () => {
      const result = await action();
      if (result.ok) onSuccess();
      else setError(result.error);
    });
  }

  return { pending, error, setError, run };
}

// Tabellstilar
export const thClass =
  "pb-1.5 text-left text-[11px] font-medium uppercase tracking-wider text-ink-muted";
export const rowClass = "border-t border-line";
// Rubrik inne i en container, t.ex. "Klasser" och "Addons"
export const subheadingClass = "mb-2 text-sm font-semibold text-ink";
