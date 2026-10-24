import type { Metadata } from "next";
import { Suspense } from "react";
import { loadTrip } from "@/lib/flights";
import { TripProblem } from "../Problem";
import TripBuilder from "./TripBuilder";

export const metadata: Metadata = {
  title: "Välj plan och klass – Gurras Flyg",
};

// Plan och klasser för de valda flygen (TRIP-011). Sökningen och valen står i
// adressen (lib/trip.ts), t.ex. /flyg/plan?fran=ARN&till=LHR&utresa=2026-11-13&resenarer=2&ut=07:20
export default function PlanPage({ searchParams }: PageProps<"/flyg/plan">) {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-4 pt-8 pb-16 md:pt-12">
      <h1 className="text-title-phone font-bold">Välj plan och klass</h1>
      {/* Flygen och planen läses från databasen när sidan efterfrågas */}
      <Suspense>
        <Trip searchParams={searchParams} />
      </Suspense>
    </main>
  );
}

async function Trip({ searchParams }: Pick<PageProps<"/flyg/plan">, "searchParams">) {
  const trip = await loadTrip(await searchParams);
  if ("problem" in trip) return <TripProblem trip={trip} />;
  return <TripBuilder search={trip.search} flights={trip.flights} fleet={trip.fleet} />;
}
