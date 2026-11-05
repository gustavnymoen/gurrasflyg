import type { Metadata } from "next";
import { Suspense } from "react";
import CharterStep from "../CharterStep";

export const metadata: Metadata = {
  title: "Välj plan och klass – Gurras Flyg",
};

// Plan och klasser för de två resorna (TRIP-039). Resorna och valen står i adressen som på de andra stegen.
export default function PlanPage({ params, searchParams }: PageProps<"/charter/[id]/plan">) {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-4 pt-8 pb-16 md:pt-12">
      <h1 className="text-title-phone font-bold">Välj plan och klass</h1>
      {/* Sökningen, resorna och planen läses från databasen när sidan efterfrågas */}
      <Suspense>
        <CharterStep params={params} searchParams={searchParams} step="plan" />
      </Suspense>
    </main>
  );
}
