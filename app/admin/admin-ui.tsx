"use client";

// Byggstenar för adminsidans tabeller: ihopfällbart kort, dialogruta,
// penna/papperskorg-knappar och en hjälpare för att anropa server actions.

import { useState, useTransition } from "react";
import type { ActionResult } from "./actions";
import { ChevronIcon, PencilIcon, TrashIcon } from "../components/icons";
import { buttonClass } from "../components/Button";
import { cardClass, compactCardClass } from "../components/Card";

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
    <section className={compactCardClass}>
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
    </section>
  );
}

// ---- Dialogruta ovanpå sidan

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
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ground/80 p-4"
      onClick={onClose}
      onKeyDown={(e) => e.key === "Escape" && onClose()}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        onClick={(e) => e.stopPropagation()}
        className={`${cardClass} w-full max-w-sm text-center`}
      >
        <h2 id="dialog-title" className="text-lg font-semibold">
          {title}
        </h2>
        {detail && <p className="mt-2 text-sm text-ink-muted">{detail}</p>}
        <div className="mt-6 flex justify-center gap-3">{children}</div>
      </div>
    </div>
  );
}

// ---- Penna och papperskorg

export function IconButton({
  label,
  onClick,
  disabled = false,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
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

// Papperskorg med varning. Används något (inUse) visas "Du kan ej ta bort",
// annars "Är du säker?" med Ja/Nej.
export function DeleteButton({
  label,
  inUse,
  inUseReason,
  onDelete,
}: {
  label: string;
  inUse: boolean;
  inUseReason: string;
  onDelete: () => Promise<ActionResult>;
}) {
  const [dialog, setDialog] = useState<null | "confirm" | { blocked: string }>(null);
  const [pending, startTransition] = useTransition();

  function confirm() {
    startTransition(async () => {
      const result = await onDelete();
      // Gick det inte (t.ex. om någon hann koppla raden) visas felet
      setDialog(result.ok ? null : { blocked: result.error });
    });
  }

  return (
    <>
      <IconButton
        label={label}
        onClick={() => setDialog(inUse ? { blocked: inUseReason } : "confirm")}
      >
        <TrashIcon />
      </IconButton>
      {dialog === "confirm" && (
        <Dialog title="Är du säker?" onClose={() => setDialog(null)}>
          <button type="button" onClick={confirm} disabled={pending} className={buttonClass("primary")}>
            {pending ? "Tar bort…" : "Ja"}
          </button>
          <button
            type="button"
            onClick={() => setDialog(null)}
            className={buttonClass("secondary")}
            autoFocus
          >
            Nej
          </button>
        </Dialog>
      )}
      {dialog !== null && dialog !== "confirm" && (
        <Dialog title="Du kan ej ta bort" detail={dialog.blocked} onClose={() => setDialog(null)}>
          <button
            type="button"
            onClick={() => setDialog(null)}
            className={buttonClass("primary")}
            autoFocus
          >
            OK
          </button>
        </Dialog>
      )}
    </>
  );
}

// ---- Spara / Avbryt

export function SaveCancel({ pending, onCancel }: { pending: boolean; onCancel: () => void }) {
  return (
    <div className="flex gap-2">
      <button type="submit" disabled={pending} className={buttonClass("primary", "compact")}>
        {pending ? "Sparar…" : "Spara"}
      </button>
      <button type="button" onClick={onCancel} className={buttonClass("secondary", "compact")}>
        Avbryt
      </button>
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
