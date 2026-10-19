"use client";

import { Fragment, useState } from "react";
import type { Addon, Aircraft, CabinClass } from "@/lib/admin";
import { formatPrice } from "@/lib/format";
import { ChevronIcon } from "../components/icons";
import { primaryButtonClass } from "../components/ui";
import { createAircraftAction, deleteAircraftAction, updateAircraftAction } from "./actions";
import AircraftForm from "./AircraftForm";
import { CollapsibleCard, DeleteButton, EditButton, rowClass, thClass } from "./admin-ui";

export default function AircraftTable({
  aircraft,
  classes,
  addons,
}: {
  aircraft: Aircraft[];
  classes: CabinClass[];
  addons: Addon[];
}) {
  const [adding, setAdding] = useState(false);

  return (
    <CollapsibleCard title="Plan" count={aircraft.length}>
      <div className="flex flex-col gap-4">
        {adding ? (
          <AircraftForm
            title="Nytt plan"
            classes={classes}
            addons={addons}
            onSave={(input) => createAircraftAction(input)}
            onDone={() => setAdding(false)}
          />
        ) : (
          <button type="button" onClick={() => setAdding(true)} className={`${primaryButtonClass} self-start`}>
            Lägg till plan
          </button>
        )}

        <table className="w-full">
          <thead>
            <tr>
              <th className="w-8" />
              <th className={thClass}>Namn</th>
              <th className={`${thClass} text-right`}>Klasser</th>
              <th className={`${thClass} text-right`}>Platser</th>
              <th className={`${thClass} text-right`}>Rutter</th>
              <th className="w-20">
                <span className="sr-only">Åtgärder</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {aircraft.map((a) => (
              <AircraftRow key={a.id} aircraft={a} classes={classes} addons={addons} />
            ))}
          </tbody>
        </table>
        {aircraft.length === 0 && <p className="text-sm text-neutral-500">Inga plan än.</p>}
      </div>
    </CollapsibleCard>
  );
}

function AircraftRow({
  aircraft,
  classes,
  addons,
}: {
  aircraft: Aircraft;
  classes: CabinClass[];
  addons: Addon[];
}) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const seats = aircraft.classes.reduce((sum, c) => sum + c.capacity, 0);

  if (editing) {
    return (
      <tr className={rowClass}>
        <td colSpan={6} className="py-3">
          <AircraftForm
            title={`Ändra ${aircraft.name}`}
            classes={classes}
            addons={addons}
            initial={aircraft}
            onSave={(input) => updateAircraftAction(aircraft.id, input)}
            onDone={() => setEditing(false)}
          />
        </td>
      </tr>
    );
  }

  return (
    <>
      <tr className={rowClass}>
        <td className="py-2">
          <ExpandButton open={open} label={aircraft.name} onClick={() => setOpen(!open)} />
        </td>
        <td className="py-2 font-medium">{aircraft.name}</td>
        <td className="py-2 text-right text-neutral-300">{aircraft.classes.length}</td>
        <td className="py-2 text-right text-neutral-300">{seats}</td>
        <td className="py-2 text-right text-neutral-300">{aircraft.routeCount}</td>
        <td className="py-2">
          <div className="flex justify-end gap-1">
            <EditButton label={`Ändra ${aircraft.name}`} onClick={() => setEditing(true)} />
            <DeleteButton
              label={`Ta bort ${aircraft.name}`}
              inUse={aircraft.inUse}
              inUseReason={`${aircraft.name} används av en eller flera flighter.`}
              onDelete={() => deleteAircraftAction(aircraft.id)}
            />
          </div>
        </td>
      </tr>
      {open &&
        aircraft.classes.map((c) => <ClassSubRow key={c.classId} cabinClass={c} />)}
    </>
  );
}

// En klass under ett expanderat plan. Kan i sin tur expanderas för att visa addons.
function ClassSubRow({ cabinClass }: { cabinClass: Aircraft["classes"][number] }) {
  const [open, setOpen] = useState(false);
  return (
    <Fragment>
      <tr className="bg-neutral-900/50 text-sm">
        <td />
        <td className="py-1.5">
          <div className="flex items-center gap-2 pl-2">
            <ExpandButton open={open} label={cabinClass.className} onClick={() => setOpen(!open)} />
            {cabinClass.className}
          </div>
        </td>
        <td className="py-1.5 text-right text-neutral-500">
          {cabinClass.addons.length} {cabinClass.addons.length === 1 ? "addon" : "addons"}
        </td>
        <td className="py-1.5 text-right text-neutral-400">{cabinClass.capacity}</td>
        <td colSpan={2} />
      </tr>
      {open && (
        <tr className="bg-neutral-900/50 text-sm">
          <td />
          <td colSpan={5} className="pb-3 pl-12">
            {cabinClass.addons.length === 0 ? (
              <span className="text-neutral-500">Inga addons i den här klassen.</span>
            ) : (
              <div className="flex flex-wrap gap-2">
                {cabinClass.addons.map((a) => (
                  <span key={a.id} className="rounded-full border border-wine/60 px-2.5 py-0.5 text-xs">
                    {a.name} <span className="text-neutral-400">· {formatPrice(a.price)}</span>
                  </span>
                ))}
              </div>
            )}
          </td>
        </tr>
      )}
    </Fragment>
  );
}

function ExpandButton({ open, label, onClick }: { open: boolean; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={open}
      aria-label={open ? `Fäll ihop ${label}` : `Visa ${label}`}
      className="flex h-7 w-7 items-center justify-center rounded-md text-neutral-400 hover:bg-wine/25 hover:text-wine-light"
    >
      <ChevronIcon open={open} />
    </button>
  );
}
