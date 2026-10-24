import type { Metadata } from "next";
import { Suspense } from "react";
import BookingStep from "../BookingStep";

export const metadata: Metadata = {
  title: "Betala – Gurras Flyg",
};

// Betalsättet och Betala (TRIP-012-R7, R8). Resan står i adressen, resenärerna
// och kontaktpersonen i fliken (store.ts).
export default function PaymentPage({ searchParams }: PageProps<"/flyg/boka/betala">) {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-4 pt-8 pb-16 md:pt-12">
      <h1 className="text-title-phone font-bold">Betala</h1>
      {/* Resan läses från databasen när sidan efterfrågas */}
      <Suspense>
        <BookingStep searchParams={searchParams} step="payment" />
      </Suspense>
    </main>
  );
}
