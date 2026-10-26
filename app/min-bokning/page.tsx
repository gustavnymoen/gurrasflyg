import type { Metadata } from "next";
import MyBooking from "./MyBooking";

export const metadata: Metadata = {
  title: "Min bokning – Gurras Flyg",
};

// Hitta sin bokning med bokningsnummer och efternamn och avboka delar av den (TRIP-023).
// Numret och efternamnet finns aldrig i adressen: de skickas i en förfrågan och
// sidan visar bokningen utan att den går att öppna igen med en länk.
export default function MyBookingPage() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-4 pt-8 pb-16 md:pt-12">
      <MyBooking />
    </main>
  );
}
