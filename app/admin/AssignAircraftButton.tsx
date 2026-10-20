"use client";

import { compactPrimaryButtonClass } from "../components/ui";
import { assignAircraftAction } from "./actions";
import { useAction } from "./admin-ui";

// Ger alla rutter ett slumpat plan
export default function AssignAircraftButton({
  total,
  assigned,
}: {
  total: number;
  assigned: number;
}) {
  const { pending, error, run } = useAction();

  return (
    <div className="flex flex-col items-end gap-1.5">
      <button
        type="button"
        onClick={() => run(assignAircraftAction, () => {})}
        disabled={pending || total === 0}
        className={compactPrimaryButtonClass}
      >
        {pending ? "Tilldelar…" : "Tilldela plan"}
      </button>
      {error ? (
        <p className="max-w-64 text-right text-xs text-red-400">{error}</p>
      ) : (
        <p className="text-xs text-neutral-500">
          {assigned} av {total} rutter har plan
        </p>
      )}
    </div>
  );
}
