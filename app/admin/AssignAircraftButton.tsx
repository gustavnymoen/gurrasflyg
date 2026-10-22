"use client";

import Button from "../components/Button";
import Message from "../components/Message";
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
      <Button size="compact" onClick={() => run(assignAircraftAction, () => {})} disabled={pending || total === 0}>
        {pending ? "Tilldelar…" : "Tilldela plan"}
      </Button>
      {error ? (
        <Message kind="error" className="max-w-64 text-right">
          {error}
        </Message>
      ) : (
        <p className="text-xs text-ink-muted">
          {assigned} av {total} rutter har plan
        </p>
      )}
    </div>
  );
}
