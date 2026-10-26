"use client";

import { useId, useState } from "react";
import type { CabinClass } from "@/lib/admin";
import { formatFactor, parsePriceFactor, PRICE_FACTOR_ERROR } from "@/lib/numbers";
import Button from "../components/Button";
import { fieldClass } from "../components/Field";
import Message from "../components/Message";
import { createClassAction, deleteClassAction, updateClassAction } from "./actions";
import type { ActionResult } from "./actions";
import {
  DeleteButton,
  EditButton,
  FactorField,
  LabeledField,
  rowClass,
  SaveCancel,
  subheadingClass,
  thClass,
  useAction,
} from "./admin-ui";

export default function ClassTable({ classes }: { classes: CabinClass[] }) {
  const [adding, setAdding] = useState(false);

  return (
    <section>
      <h3 className={subheadingClass}>
        Klasser <span className="text-xs font-normal text-ink-muted">({classes.length})</span>
      </h3>
      <table className="w-full text-sm">
        <thead>
          <tr>
            <th className={thClass}>Namn</th>
            <th className={`${thClass} text-right`}>Prisfaktor</th>
            <th className="w-20">
              <span className="sr-only">Åtgärder</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {classes.map((c) => (
            <ClassRow key={c.id} cabinClass={c} />
          ))}
          {adding && (
            <ClassForm
              initial={{ name: "", factor: formatFactor(100) }}
              onSave={(name, factor) => createClassAction(name, factor)}
              onDone={() => setAdding(false)}
            />
          )}
        </tbody>
      </table>
      {classes.length === 0 && !adding && (
        <p className="py-1.5 text-sm text-ink-muted">Inga klasser än.</p>
      )}
      {!adding && (
        <Button size="compact" onClick={() => setAdding(true)} className="mt-3">
          Lägg till
        </Button>
      )}
    </section>
  );
}

function ClassRow({ cabinClass }: { cabinClass: CabinClass }) {
  const [editing, setEditing] = useState(false);

  if (editing) {
    return (
      <ClassForm
        initial={{ name: cabinClass.name, factor: formatFactor(cabinClass.pricePercent) }}
        onSave={(name, factor) => updateClassAction(cabinClass.id, name, factor)}
        onDone={() => setEditing(false)}
      />
    );
  }

  return (
    <tr className={rowClass}>
      <td className="py-1.5">{cabinClass.name}</td>
      <td className="py-1.5 text-right tabular-nums">{formatFactor(cabinClass.pricePercent)}</td>
      <td className="py-1.5">
        <div className="flex justify-end gap-1">
          <EditButton label={`Ändra ${cabinClass.name}`} onClick={() => setEditing(true)} />
          <DeleteButton
            label={`Ta bort ${cabinClass.name}`}
            onDelete={() => deleteClassAction(cabinClass.id)}
          />
        </div>
      </td>
    </tr>
  );
}

// Rad med fält, både för att lägga till och ändra en klass. Prisfaktorn
// kontrolleras här och igen på servern (TRIP-011-R6).
function ClassForm({
  initial,
  onSave,
  onDone,
}: {
  initial: { name: string; factor: string };
  onSave: (name: string, factor: string) => Promise<ActionResult>;
  onDone: () => void;
}) {
  const [name, setName] = useState(initial.name);
  const [factor, setFactor] = useState(initial.factor);
  const [factorError, setFactorError] = useState(false);
  const { pending, error, setError, run } = useAction();
  const errorId = useId();

  function save() {
    const invalid = parsePriceFactor(factor) === null;
    setFactorError(invalid);
    if (invalid) setError(PRICE_FACTOR_ERROR);
    else run(() => onSave(name, factor), onDone);
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
            <LabeledField label="Namn på klassen" className="min-w-0 flex-1">
              <input
                placeholder="t.ex. Premium"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={fieldClass("compact")}
                autoFocus
              />
            </LabeledField>
            <FactorField label="Prisfaktor" value={factor} onChange={setFactor} invalid={factorError} errorId={errorId} />
          </div>
          <SaveCancel pending={pending} onCancel={onDone} />
          {error && (
            <Message kind="error" id={errorId}>
              {error}
            </Message>
          )}
        </form>
      </td>
    </tr>
  );
}
