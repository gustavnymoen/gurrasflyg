"use client";

import { useState } from "react";
import type { CabinClass } from "@/lib/admin";
import Button from "../components/Button";
import { fieldClass } from "../components/Field";
import Message from "../components/Message";
import { createClassAction, deleteClassAction, updateClassAction } from "./actions";
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
              initialName=""
              onSave={(name) => createClassAction(name)}
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
        initialName={cabinClass.name}
        onSave={(name) => updateClassAction(cabinClass.id, name)}
        onDone={() => setEditing(false)}
      />
    );
  }

  return (
    <tr className={rowClass}>
      <td className="py-1.5">{cabinClass.name}</td>
      <td className="py-1.5">
        <div className="flex justify-end gap-1">
          <EditButton label={`Ändra ${cabinClass.name}`} onClick={() => setEditing(true)} />
          <DeleteButton
            label={`Ta bort ${cabinClass.name}`}
            inUse={cabinClass.inUse}
            inUseReason={`${cabinClass.name} används av ett eller flera plan.`}
            onDelete={() => deleteClassAction(cabinClass.id)}
          />
        </div>
      </td>
    </tr>
  );
}

// Rad med fält, både för att lägga till och ändra en klass
function ClassForm({
  initialName,
  onSave,
  onDone,
}: {
  initialName: string;
  onSave: (name: string) => Promise<ActionResult>;
  onDone: () => void;
}) {
  const [name, setName] = useState(initialName);
  const { pending, error, run } = useAction();

  return (
    <tr className={rowClass}>
      <td colSpan={2} className="py-3">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            run(() => onSave(name), onDone);
          }}
          className="flex flex-col gap-2"
        >
          <LabeledField label="Namn på klassen">
            <input
              placeholder="t.ex. Premium"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={fieldClass("compact")}
              autoFocus
            />
          </LabeledField>
          <SaveCancel pending={pending} onCancel={onDone} />
          {error && <Message kind="error">{error}</Message>}
        </form>
      </td>
    </tr>
  );
}
