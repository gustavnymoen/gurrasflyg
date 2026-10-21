"use client";

// Formulär för att skapa eller ändra ett plan: namn, klasser och addons.
// Inget sparas förrän man trycker Spara, då sparas hela planet på en gång.

import { useState } from "react";
import type { Addon, Aircraft, AircraftInput, CabinClass } from "@/lib/admin";
import { parseWholeNumber } from "@/lib/numbers";
import { CheckIcon, XIcon } from "../components/icons";
import { Alert, fieldClass, RoundButton, compactInputClass } from "../components/ui";
import type { ActionResult } from "./actions";
import { EditButton, IconButton, RemoveButton, SaveCancel, useAction } from "./admin-ui";

type ClassRow = { classId: number; capacity: number };
type AddonRow = { key: number; addonId: number; classId: number };

// Unik nyckel per addonrad (samma addon kan finnas på flera rader, en per klass)
let nextKey = 0;

export default function AircraftForm({
  title,
  classes,
  addons,
  initial,
  onSave,
  onDone,
}: {
  title: string;
  classes: CabinClass[];
  addons: Addon[];
  initial?: Aircraft;
  onSave: (input: AircraftInput) => Promise<ActionResult>;
  onDone: () => void;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [classRows, setClassRows] = useState<ClassRow[]>(
    initial?.classes.map((c) => ({ classId: c.classId, capacity: c.capacity })) ?? [],
  );
  const [addonRows, setAddonRows] = useState<AddonRow[]>(
    initial?.classes.flatMap((c) =>
      c.addons.map((a) => ({ key: nextKey++, addonId: a.id, classId: c.classId })),
    ) ?? [],
  );
  // Fälten för ny klass/addon visas först när man klickat på "Lägg till"
  const [addingClass, setAddingClass] = useState(false);
  const [addingAddon, setAddingAddon] = useState(false);
  const { pending, error, run } = useAction();

  const className = (id: number) => classes.find((c) => c.id === id)?.name ?? "?";
  const addonName = (id: number) => addons.find((a) => a.id === id)?.name ?? "?";
  // Klasserna sorteras i samma ordning som i klasstabellen (Ekonomi, Business, ...)
  const classOrder = (id: number) => classes.findIndex((c) => c.id === id);

  const sortedClassRows = [...classRows].sort((a, b) => classOrder(a.classId) - classOrder(b.classId));
  const sortedAddonRows = [...addonRows].sort(
    (a, b) =>
      classOrder(a.classId) - classOrder(b.classId) ||
      addonName(a.addonId).localeCompare(addonName(b.addonId), "sv"),
  );
  const planeClasses = sortedClassRows.map((r) => ({ id: r.classId, name: className(r.classId) }));

  // Finns kombinationen addon + klass redan (på en annan rad än exceptKey)?
  const duplicateError = (addonId: number, classId: number, exceptKey?: number) =>
    addonRows.some((r) => r.addonId === addonId && r.classId === classId && r.key !== exceptKey)
      ? "Den addonen finns redan i den klassen."
      : null;

  function removeClass(classId: number) {
    setClassRows((rows) => rows.filter((r) => r.classId !== classId));
    // Addons i klassen försvinner med klassen
    setAddonRows((rows) => rows.filter((r) => r.classId !== classId));
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        run(
          () =>
            onSave({
              name,
              classes: classRows,
              addons: addonRows.map(({ addonId, classId }) => ({ addonId, classId })),
            }),
          onDone,
        );
      }}
      className="flex flex-col gap-4 rounded-lg border border-wine/40 bg-neutral-900/60 p-4 text-sm"
    >
      <h3 className="text-sm font-semibold text-wine-light">{title}</h3>
      <input
        aria-label="Planets namn"
        placeholder="Namn, t.ex. Airbus A320neo"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className={compactInputClass}
        autoFocus
      />

      <div className="grid gap-6 md:grid-cols-2">
        {/* ---- Klasser */}
        <section className="flex flex-col gap-2">
          <h4 className="text-xs font-medium uppercase tracking-wider text-neutral-500">Klasser</h4>
          {addingClass ? (
            <ClassAdder
              options={classes.filter((c) => !classRows.some((r) => r.classId === c.id))}
              onAdd={(row) => {
                setClassRows((rows) => [...rows, row]);
                setAddingClass(false);
              }}
              onCancel={() => setAddingClass(false)}
            />
          ) : (
            <AddButton
              label="Lägg till klass"
              disabled={classRows.length >= classes.length}
              onClick={() => setAddingClass(true)}
            />
          )}
          <ul>
            {classRows.length === 0 && (
              <li className="py-1.5 text-sm text-neutral-500">Inga klasser tillagda.</li>
            )}
            {sortedClassRows.map((row) => (
              <ClassListRow
                key={row.classId}
                name={className(row.classId)}
                capacity={row.capacity}
                onChange={(capacity) =>
                  setClassRows((rows) =>
                    rows.map((r) => (r.classId === row.classId ? { ...r, capacity } : r)),
                  )
                }
                onRemove={() => removeClass(row.classId)}
              />
            ))}
          </ul>
        </section>

        {/* ---- Addons */}
        <section className="flex flex-col gap-2">
          <h4 className="text-xs font-medium uppercase tracking-wider text-neutral-500">Addons</h4>
          {addingAddon ? (
            <AddonPicker
              mode="add"
              addons={addons}
              classes={planeClasses}
              validate={(addonId, classId) => duplicateError(addonId, classId)}
              onConfirm={(addonId, classId) => {
                setAddonRows((rows) => [...rows, { key: nextKey++, addonId, classId }]);
                setAddingAddon(false);
              }}
              onCancel={() => setAddingAddon(false)}
            />
          ) : (
            <AddButton
              label="Lägg till addon"
              disabled={addons.length === 0 || classRows.length === 0}
              onClick={() => setAddingAddon(true)}
            />
          )}
          <ul>
            {addonRows.length === 0 && (
              <li className="py-1.5 text-sm text-neutral-500">Inga addons tillagda.</li>
            )}
            {sortedAddonRows.map((row) => (
              <AddonListRow
                key={row.key}
                row={row}
                addons={addons}
                classes={planeClasses}
                addonName={addonName(row.addonId)}
                className={className(row.classId)}
                validate={(addonId, classId) => duplicateError(addonId, classId, row.key)}
                onChange={(addonId, classId) =>
                  setAddonRows((rows) =>
                    rows.map((r) => (r.key === row.key ? { ...r, addonId, classId } : r)),
                  )
                }
                onRemove={() => setAddonRows((rows) => rows.filter((r) => r.key !== row.key))}
              />
            ))}
          </ul>
        </section>
      </div>

      {error && <Alert kind="error" compact>{error}</Alert>}
      <SaveCancel pending={pending} onCancel={onDone} />
    </form>
  );
}

// ---------------------------------------------------------------- Klasser

// Antal platser måste vara ett heltal större än 0
function parseCapacity(value: string) {
  const n = parseWholeNumber(value);
  return n !== null && n > 0 ? n : null;
}

// Enter i ett fält ska utföra radens åtgärd, inte spara hela formuläret
function onEnter(action: () => void) {
  return (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      action();
    }
  };
}

function ClassAdder({
  options,
  onAdd,
  onCancel,
}: {
  options: { id: number; name: string }[];
  onAdd: (row: ClassRow) => void;
  onCancel: () => void;
}) {
  const [classId, setClassId] = useState("");
  const [capacity, setCapacity] = useState("");
  const parsed = parseCapacity(capacity);

  function add() {
    if (classId === "" || parsed === null) return;
    onAdd({ classId: Number(classId), capacity: parsed });
    setClassId("");
    setCapacity("");
  }

  return (
    <div className="flex items-center gap-2">
      <select
        aria-label="Klass att lägga till"
        value={classId}
        onChange={(e) => setClassId(e.target.value)}
        className={fieldClass("compact", "min-w-0 flex-1")}
        autoFocus
      >
        <option value="" disabled>
          {options.length === 0 ? "Alla klasser tillagda" : "Välj klass"}
        </option>
        {options.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>
      <input
        aria-label="Antal platser"
        inputMode="numeric"
        placeholder="Platser"
        value={capacity}
        onChange={(e) => setCapacity(e.target.value)}
        onKeyDown={onEnter(add)}
        className={fieldClass("compact", "w-24 text-right")}
      />
      <RoundButton compact label="Lägg till klass" disabled={classId === "" || parsed === null} onClick={add}>
        +
      </RoundButton>
      <IconButton label="Avbryt" onClick={onCancel}>
        <XIcon />
      </IconButton>
    </div>
  );
}

function ClassListRow({
  name,
  capacity,
  onChange,
  onRemove,
}: {
  name: string;
  capacity: number;
  onChange: (capacity: number) => void;
  onRemove: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState("");
  const parsed = parseCapacity(value);

  function confirm() {
    if (parsed === null) return;
    onChange(parsed);
    setEditing(false);
  }

  return (
    <li className="flex h-9 items-center gap-2 border-t border-wine/15">
      <span className="flex-1">{name}</span>
      {editing ? (
        <>
          <input
            aria-label={`Antal platser i ${name}`}
            inputMode="numeric"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={onEnter(confirm)}
            className={fieldClass("compact", "w-20 text-right")}
            autoFocus
          />
          <ConfirmCancel valid={parsed !== null} onConfirm={confirm} onCancel={() => setEditing(false)} />
        </>
      ) : (
        <>
          <span className="text-sm text-neutral-400">{capacity} platser</span>
          <EditButton
            label={`Ändra platser i ${name}`}
            onClick={() => {
              setValue(String(capacity));
              setEditing(true);
            }}
          />
          <RemoveButton label={`Ta bort ${name} från planet`} onClick={onRemove} />
        </>
      )}
    </li>
  );
}

// ---------------------------------------------------------------- Addons

// Två dropdowns (addon + klass), båda måste väljas. Används både för att
// lägga till en ny addon och när en befintlig rad redigeras.
function AddonPicker({
  mode,
  addons,
  classes,
  initial,
  validate,
  onConfirm,
  onCancel,
}: {
  mode: "add" | "edit";
  addons: Addon[];
  classes: { id: number; name: string }[];
  initial?: { addonId: number; classId: number };
  validate: (addonId: number, classId: number) => string | null;
  onConfirm: (addonId: number, classId: number) => void;
  onCancel: () => void;
}) {
  const [addonId, setAddonId] = useState(initial ? String(initial.addonId) : "");
  const [classId, setClassId] = useState(initial ? String(initial.classId) : "");
  const [error, setError] = useState<string | null>(null);
  const valid = addonId !== "" && classId !== "";
  const editing = mode === "edit";

  function confirm() {
    if (!valid) return;
    const problem = validate(Number(addonId), Number(classId));
    if (problem) {
      setError(problem);
      return;
    }
    onConfirm(Number(addonId), Number(classId));
  }

    return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <select
          aria-label="Addon"
          value={addonId}
          onChange={(e) => setAddonId(e.target.value)}
          className={fieldClass("compact", "min-w-0 flex-1")}
          autoFocus
        >
          <option value="" disabled>
            {addons.length === 0 ? "Inga addons finns" : "Välj addon"}
          </option>
          {addons.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name}
            </option>
          ))}
        </select>
        <select
          aria-label="Klass"
          value={classId}
          onChange={(e) => setClassId(e.target.value)}
          className={fieldClass("compact", "min-w-0 flex-1")}
        >
          <option value="" disabled>
            {classes.length === 0 ? "Lägg till klass först" : "Välj klass"}
          </option>
          {/* Bara klasser som planet har */}
          {classes.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        {editing ? (
          <ConfirmCancel valid={valid} onConfirm={confirm} onCancel={onCancel} />
        ) : (
          <>
            <RoundButton compact label="Lägg till addon" disabled={!valid} onClick={confirm}>
              +
            </RoundButton>
            <IconButton label="Avbryt" onClick={onCancel}>
              <XIcon />
            </IconButton>
          </>
        )}
      </div>
      {error && <p className="text-sm text-wine-light">{error}</p>}
    </div>
  );
}

function AddonListRow({
  row,
  addons,
  classes,
  addonName,
  className,
  validate,
  onChange,
  onRemove,
}: {
  row: AddonRow;
  addons: Addon[];
  classes: { id: number; name: string }[];
  addonName: string;
  className: string;
  validate: (addonId: number, classId: number) => string | null;
  onChange: (addonId: number, classId: number) => void;
  onRemove: () => void;
}) {
  const [editing, setEditing] = useState(false);

  if (editing) {
    return (
      <li className="border-t border-wine/15 py-1.5">
        <AddonPicker
          mode="edit"
          addons={addons}
          classes={classes}
          initial={row}
          validate={validate}
          onConfirm={(addonId, classId) => {
            onChange(addonId, classId);
            setEditing(false);
          }}
          onCancel={() => setEditing(false)}
        />
      </li>
    );
  }

  return (
    <li className="flex h-9 items-center gap-2 border-t border-wine/15">
      <span className="flex-1">{addonName}</span>
      <span className="text-sm text-neutral-400">{className}</span>
      <EditButton label={`Ändra ${addonName}`} onClick={() => setEditing(true)} />
      <RemoveButton label={`Ta bort ${addonName} från planet`} onClick={onRemove} />
    </li>
  );
}

// ---------------------------------------------------------------- Gemensamt

// Textknapp som visar fälten för en ny klass/addon
function AddButton({
  label,
  disabled,
  onClick,
}: {
  label: string;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex items-center gap-1.5 self-start text-xs font-medium text-wine-light hover:underline disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:no-underline"
    >
      <span className="text-base leading-none">+</span> {label}
    </button>
  );
}

// Bock och kryss för att bekräfta eller avbryta en rad i redigeringsläge
function ConfirmCancel({
  valid,
  onConfirm,
  onCancel,
}: {
  valid: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <>
      <IconButton label="Klar" onClick={onConfirm} disabled={!valid}>
        <CheckIcon />
      </IconButton>
      <IconButton label="Avbryt" onClick={onCancel}>
        <XIcon />
      </IconButton>
    </>
  );
}
