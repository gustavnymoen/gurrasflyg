import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { findFlights, getAirportPair, listFleet } from "@/lib/flights";
import { parseSearch, searchUrl } from "@/lib/search";
import { parseLegs } from "@/lib/trip";
import { buttonClass } from "../../components/Button";
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
  const params = await searchParams;
  const search = parseSearch(params);
  const legs = search && parseLegs(params, search);
  const [airports, fleet] = search
    ? await Promise.all([getAirportPair(search.from, search.to), listFleet()])
    : [null, []];
  if (!search || !legs || !airports) {
    return (
      <Problem text="Adressen saknar något. Börja med att söka efter ett flyg." href="/" link="Till sökningen" />
    );
  }

  // Utresan och hemresan. Priserna och tiderna räknas från databasen, aldrig från adressen.
  const routes = [
    { from: search.from, to: search.to, date: search.outbound },
    { from: search.to, to: search.from, date: search.return },
  ];
  const flights = await Promise.all(
    legs.map(async (leg, i) => {
      const { from, to, date } = routes[i];
      const found = date ? await findFlights(from, to, date, search.travellers, fleet) : [];
      return found.find((f) => f.time === leg.time);
    }),
  );
  if (flights.some((f) => f === undefined)) {
    return (
      <Problem
        text="Flyget finns inte eller har redan gått. Välj ett annat flyg."
        href={searchUrl(search)}
        link="Till flygen"
      />
    );
  }

  return <TripBuilder search={search} flights={flights.filter((f) => f !== undefined)} fleet={fleet} />;
}

function Problem({ text, href, link }: { text: string; href: string; link: string }) {
  return (
    <div className="flex flex-col items-start gap-4">
      <p>{text}</p>
      <Link href={href} className={buttonClass("secondary")}>
        {link}
      </Link>
    </div>
  );
}
