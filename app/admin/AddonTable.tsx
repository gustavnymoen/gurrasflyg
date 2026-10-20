"use client";

import { useState } from "react";
import type { Addon, AddonInput } from "@/lib/admin";
import { formatAmount } from "@/lib/format";
import { Alert, fieldClass, noSpinnerClass, compactPrimaryButtonClass, compactTextareaClass } from "../components/ui";
import { createAddonAction, deleteAddonAction, updateAddonAction } from "./actions";
import type { ActionResult } from "./actions";
import {
  DeleteButton,
  EditButton,
  rowClass,
  SaveCancel,
  subheadingClass,
  thClass,
  useAction,
} from "./admin-ui";

export default function AddonTable({ addons }: { addons: Addon[] }) {
  const [adding, setAdding] = useState(false);

  return (
    <section>
      <h3 className={subheadingClass}>
        Addons <span className="text-xs font-normal text-neutral-500">({addons.length})</span>
      </h3>
      <table className="w-full text-sm">
        <thead>
          <tr>
            <th className={thClass}>Namn</th>
            <th className={`${thClass} text-right`}>Pris (SEK)</th>
            <th className="w-20">
              <span className="sr-only">Åtgärder</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {addons.map((a) => (
            <AddonRow key={a.id} addon={a} />
          ))}
          {adding && (
            <AddonForm
              initial={{ name: "", description: "", priceKr: "" }}
              onSave={(addon) => createAddonAction(addon)}
              onDone={() => setAdding(false)}
            />
          )}
        </tbody>
      </table>
      {addons.length === 0 && !adding && (
        <p className="py-1.5 text-sm text-neutral-500">Inga addons än.</p>
      )}
      {!adding && (
        <button type="button" onClick={() => setAdding(true)} className={`${compactPrimaryButtonClass} mt-3`}>
          Lägg till
        </button>
      )}
    </section>
  );
}

function AddonRow({ addon }: { addon: Addon }) {
  const [editing, setEditing] = useState(false);

  if (editing) {
    return (
      <AddonForm
        initial={{ name: addon.name, description: addon.description, priceKr: String(addon.price / 100) }}
        onSave={(input) => updateAddonAction(addon.id, input)}
        onDone={() => setEditing(false)}
      />
    );
  }

  return (
    <tr className={`${rowClass} align-top`}>
      <td className="py-1.5">
        <div>{addon.name}</div>
        <div className="text-sm text-neutral-500">{addon.description}</div>
      </td>
      <td className="whitespace-nowrap py-2 text-right text-neutral-300">{formatAmount(addon.price)}</td>
      <td className="py-1.5">
        <div className="flex justify-end gap-1">
          <EditButton label={`Ändra ${addon.name}`} onClick={() => setEditing(true)} />
          <DeleteButton
            label={`Ta bort ${addon.name}`}
            inUse={addon.inUse}
            inUseReason={`${addon.name} används av ett eller flera plan.`}
            onDelete={() => deleteAddonAction(addon.id)}
          />
        </div>
      </td>
    </tr>
  );
}

// Rad med fält, både för att lägga till och ändra en addon
function AddonForm({
  initial,
  onSave,
  onDone,
}: {
  initial: { name: string; description: string; priceKr: string };
  onSave: (addon: AddonInput) => Promise<ActionResult>;
  onDone: () => void;
}) {
  const [name, setName] = useState(initial.name);
  const [description, setDescription] = useState(initial.description);
  const [price, setPrice] = useState(initial.priceKr);
  const { pending, error, setError, run } = useAction();

  function save() {
    if (price === "") {
      setError("Ange ett pris.");
      return;
    }
    run(() => onSave({ name, description, priceKr: Number(price) }), onDone);
  }

  return (
    <tr className={rowClass}>
      <td colSpan={3} className="py-3">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            save();
          }}
          className="flex flex-col gap-2"
        >
          <div className="flex gap-3">
            <input
              aria-label="Namn på addon"
              placeholder="Namn, t.ex. Extra bagage"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={fieldClass("compact", "min-w-0 flex-1")}
              autoFocus
            />
            <input
              aria-label="Pris i kronor"
              type="number"
              min={0}
              step="any"
              placeholder="Pris"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className={`${fieldClass("compact", "w-24 text-right")} ${noSpinnerClass}`}
            />
          </div>
          <textarea
            aria-label="Beskrivning"
            placeholder="Beskrivning"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={compactTextareaClass}
          />
          <SaveCancel pending={pending} onCancel={onDone} />
          {error && <Alert kind="error" compact>{error}</Alert>}
        </form>
      </td>
    </tr>
  );
}
