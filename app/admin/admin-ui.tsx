"use client";

// Byggstenar för adminsidans tabeller: ihopfällbart kort, dialogruta,
// penna/papperskorg-knappar och en hjälpare för att anropa server actions.

import { useState, useTransition } from "react";
import type { ActionResult } from "./actions";
import { ChevronIcon, PencilIcon, TrashIcon } from "../components/icons";
import { cardClass, primaryButtonClass, secondaryButtonClass } from "../components/ui";

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
    <section className={cardClass}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="flex w-full items-center gap-2 text-left text-xl font-semibold text-wine-light"
      >
        <ChevronIcon open={open} className="h-5 w-5" />
        {title}
        {count !== undefined && (
          <span className="text-sm font-normal text-neutral-500">({count})</span>
        )}
      </button>
      {open && <div className="mt-4">{children}</div>}
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
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
        {detail && <p className="mt-2 text-sm text-neutral-400">{detail}</p>}
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
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-neutral-400 transition-colors hover:bg-wine/25 hover:text-wine-light disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent"
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
          <button type="button" onClick={confirm} disabled={pending} className={primaryButtonClass}>
            {pending ? "Tar bort…" : "Ja"}
          </button>
          <button
            type="button"
            onClick={() => setDialog(null)}
            className={secondaryButtonClass}
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
            className={primaryButtonClass}
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
      <button type="submit" disabled={pending} className={primaryButtonClass}>
        {pending ? "Sparar…" : "Spara"}
      </button>
      <button type="button" onClick={onCancel} className={secondaryButtonClass}>
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
export const thClass = "pb-2 text-left text-xs font-medium uppercase tracking-wider text-neutral-500";
export const rowClass = "border-t border-wine/15";
