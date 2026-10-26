import type { Metadata } from "next";
import { Suspense } from "react";
import CharterStep from "../CharterStep";

export const metadata: Metadata = {
  title: "Välj resa – Gurras Flyg",
};

// Resorna för sökningen i adressen: utresa och hemresa att välja bland (TRIP-014-R3, R5).
export default function ResultsPage({ params, searchParams }: PageProps<"/charter/[id]/resor">) {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-4 pt-8 pb-16 md:pt-12">
      <h1 className="text-title-phone font-bold">Välj din resa</h1>
      {/* Sökningen och resorna läses från databasen när sidan efterfrågas */}
      <Suspense>
        <CharterStep params={params} searchParams={searchParams} step="results" />
      </Suspense>
    </main>
  );
}
