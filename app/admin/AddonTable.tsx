"use client";

import { useState } from "react";
import type { Addon, AddonInput } from "@/lib/admin";
import { formatAmount } from "@/lib/format";
import Button from "../components/Button";
import { fieldClass, textAreaClass } from "../components/Field";
import Message from "../components/Message";
import { createAddonAction, deleteAddonAction, updateAddonAction } from "./actions";
import type { ActionResult } from "./actions";
import {
  DeleteButton,
  EditButton,
  LabeledField,
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
        Addons <span className="text-xs font-normal text-ink-muted">({addons.length})</span>
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
              initial={{ name: "", description: "", price: "" }}
              onSave={(addon) => createAddonAction(addon)}
              onDone={() => setAdding(false)}
            />
          )}
        </tbody>
      </table>
      {addons.length === 0 && !adding && (
        <p className="py-1.5 text-sm text-ink-muted">Inga addons än.</p>
      )}
      {!adding && (
        <Button size="compact" onClick={() => setAdding(true)} className="mt-3">
          Lägg till
        </Button>
      )}
    </section>
  );
}

function AddonRow({ addon }: { addon: Addon }) {
  const [editing, setEditing] = useState(false);

  if (editing) {
    return (
      <AddonForm
        initial={{ name: addon.name, description: addon.description, price: String(addon.price) }}
        onSave={(input) => updateAddonAction(addon.id, input)}
        onDone={() => setEditing(false)}
      />
    );
  }

  return (
    <tr className={`${rowClass} align-top`}>
      <td className="py-1.5">
        <div>{addon.name}</div>
        <div className="text-sm text-ink-muted">{addon.description}</div>
      </td>
      <td className="whitespace-nowrap py-2 text-right text-ink">{formatAmount(addon.price)}</td>
      <td className="py-1.5">
        <div className="flex justify-end gap-1">
          <EditButton label={`Ändra ${addon.name}`} onClick={() => setEditing(true)} />
          <DeleteButton
            label={`Ta bort ${addon.name}`}
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
  initial: { name: string; description: string; price: string };
  onSave: (addon: AddonInput) => Promise<ActionResult>;
  onDone: () => void;
}) {
  const [name, setName] = useState(initial.name);
  const [description, setDescription] = useState(initial.description);
  const [price, setPrice] = useState(initial.price);
  const { pending, error, setError, run } = useAction();

  function save() {
    if (price === "") {
      setError("Ange ett pris.");
      return;
    }
    run(() => onSave({ name, description, price }), onDone);
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
            <LabeledField label="Namn på addon" className="min-w-0 flex-1">
              <input
                placeholder="t.ex. Extra bagage"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={fieldClass("compact")}
                autoFocus
              />
            </LabeledField>
            <LabeledField label="Pris i kronor" className="w-24">
              <input
                inputMode="numeric"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className={fieldClass("compact", "w-full text-right")}
              />
            </LabeledField>
          </div>
          <LabeledField label="Beskrivning">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={textAreaClass("compact")}
            />
          </LabeledField>
          <SaveCancel pending={pending} onCancel={onDone} />
          {error && <Message kind="error">{error}</Message>}
        </form>
      </td>
    </tr>
  );
}
