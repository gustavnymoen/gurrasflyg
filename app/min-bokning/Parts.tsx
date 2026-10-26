import { TOO_LATE_TEXT } from "@/lib/cancel-rules";

// Texten "Det är för sent att avboka" under ett flyg eller en resa, som kryssrutorna pekar på (TRIP-023-R8)
export function TooLate({ id }: { id: string }) {
  return (
    <p id={id} className="text-small text-ink-muted">
      {TOO_LATE_TEXT}
    </p>
  );
}

// "Avbokad" bredvid en avbokad del (R4)
export function CancelledTag() {
  return <span className="text-small font-bold text-danger">Avbokad</span>;
}
