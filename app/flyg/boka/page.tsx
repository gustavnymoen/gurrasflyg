import type { Metadata } from "next";
import { Suspense } from "react";
import BookingStep from "./BookingStep";

export const metadata: Metadata = {
  title: "Resenärer – Gurras Flyg",
};

// Resenärerna, tilläggen och kontaktpersonen (TRIP-012-R1–R6). Resan står i
// adressen som på /flyg/plan; det besökaren fyller i sparas i fliken (store.ts).
export default function BookingPage({ searchParams }: PageProps<"/flyg/boka">) {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-4 pt-8 pb-16 md:pt-12">
      <h1 className="text-title-phone font-bold">Resenärer</h1>
      {/* Resan läses från databasen när sidan efterfrågas */}
      <Suspense>
        <BookingStep searchParams={searchParams} step="travellers" />
      </Suspense>
    </main>
  );
}
