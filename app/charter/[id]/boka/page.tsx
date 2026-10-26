import type { Metadata } from "next";
import { Suspense } from "react";
import CharterStep from "../CharterStep";

export const metadata: Metadata = {
  title: "Resenärer – Gurras Flyg",
};

// Resenärerna, kontaktpersonen och tilläggen (TRIP-014-R6, R7). Resan står i adressen, det besökaren fyller i sparas i fliken.
export default function TravellersPage({ params, searchParams }: PageProps<"/charter/[id]/boka">) {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-4 pt-8 pb-16 md:pt-12">
      <h1 className="text-title-phone font-bold">Resenärer</h1>
      {/* Sökningen och resorna läses från databasen när sidan efterfrågas */}
      <Suspense>
        <CharterStep params={params} searchParams={searchParams} step="travellers" />
      </Suspense>
    </main>
  );
}
