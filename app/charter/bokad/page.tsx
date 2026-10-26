import type { Metadata } from "next";
import CharterBooked from "../CharterBooked";

export const metadata: Metadata = {
  title: "Din bokning – Gurras Flyg",
};

// Sammanfattningen direkt efter Betala (TRIP-014-R9). Den finns bara i fliken där bokningen
// gjordes; adressen visar ingen bokning för någon annan.
export default function CharterBookedPage() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-4 pt-8 pb-16 md:pt-12">
      <CharterBooked />
    </main>
  );
}
