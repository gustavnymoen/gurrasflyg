import type { Metadata } from "next";
import { Suspense } from "react";
import { getDestinationCards } from "@/lib/travel";
import DestinationBrowser from "./DestinationBrowser";

export const metadata: Metadata = {
  title: "Charter – Gurras Flyg",
};

// Charter: sök och bläddra bland resmålen (TRIP-013). Fliken Charter på startsidan länkar hit.
export default function CharterPage() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-4 pt-8 pb-16 md:pt-12">
      <h1 className="text-title-phone font-bold">Charter</h1>
      <p className="max-w-130 text-[17px] text-ink-muted">
        Resor till övergivna städer, industriplatser och kalla krigets lämningar, från Stockholm Arlanda och Köpenhamn.
      </p>
      {/* Resmålen läses från databasen när sidan efterfrågas */}
      <Suspense fallback={<div className="h-96" />}>
        <Destinations />
      </Suspense>
    </main>
  );
}

async function Destinations() {
  return <DestinationBrowser cards={await getDestinationCards()} />;
}
