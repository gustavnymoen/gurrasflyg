"use client";

import { useState } from "react";
import type { CabinClass } from "@/lib/admin";
import { Alert, primaryButtonClass, smallInputClass } from "../components/ui";
import { createClassAction, deleteClassAction, updateClassAction } from "./actions";
import type { ActionResult } from "./actions";
import {
  CollapsibleCard,
  DeleteButton,
  EditButton,
  rowClass,
  SaveCancel,
  thClass,
  useAction,
} from "./admin-ui";

export default function ClassTable({ classes }: { classes: CabinClass[] }) {
  const [adding, setAdding] = useState(false);

  return (
    <CollapsibleCard title="Klasser" count={classes.length}>
      <table className="w-full">
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
        <p className="py-2 text-sm text-neutral-500">Inga klasser än.</p>
      )}
      {!adding && (
        <button type="button" onClick={() => setAdding(true)} className={`${primaryButtonClass} mt-4`}>
          Lägg till
        </button>
      )}
    </CollapsibleCard>
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
      <td className="py-2">{cabinClass.name}</td>
      <td className="py-2">
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
          className="flex flex-col gap-3"
        >
          <input
            aria-label="Namn på klassen"
            placeholder="Namn, t.ex. Premium"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={smallInputClass}
            autoFocus
          />
          <SaveCancel pending={pending} onCancel={onDone} />
          {error && <Alert kind="error">{error}</Alert>}
        </form>
      </td>
    </tr>
  );
}
