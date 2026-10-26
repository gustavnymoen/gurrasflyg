import type { Metadata } from "next";
import BookedSummary from "./BookedSummary";

export const metadata: Metadata = {
  title: "Din bokning – Gurras Flyg",
};

// Sammanfattningen direkt efter Betala (TRIP-012-R9). Den finns bara i fliken
// där bokningen gjordes; adressen visar ingen bokning för någon annan, och
// det går inte att öppna en bokning med ett bokningsnummer.
export default function BookedPage() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-4 pt-8 pb-16 md:pt-12">
      <BookedSummary />
    </main>
  );
}
