import type { Metadata } from "next";
import { Suspense } from "react";
import { findFlights, getAirportPair, listFleet } from "@/lib/flights";
import { parseSearch, searchUrl } from "@/lib/search";
import { parseLegs } from "@/lib/trip";
import SearchForm from "../components/SearchForm";
import FlightResults from "./FlightResults";

export const metadata: Metadata = {
  title: "Välj flyg – Gurras Flyg",
};

// Sökresultaten (TRIP-010). Sökningen står i adressen, t.ex.
// /flyg?fran=ARN&till=LHR&utresa=2026-11-13&resenarer=2 (lib/search.ts).
export default function FlightsPage({ searchParams }: PageProps<"/flyg">) {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-4 pt-8 pb-16 md:pt-12">
      <h1 className="text-title-phone font-bold">Välj ditt flyg</h1>
      {/* Sökningen läses från adressen och databasen när sidan efterfrågas */}
      <Suspense>
        <Results searchParams={searchParams} />
      </Suspense>
    </main>
  );
}

async function Results({ searchParams }: Pick<PageProps<"/flyg">, "searchParams">) {
  const params = await searchParams;
  const search = parseSearch(params);
  // "Från"-priset beror på planen (TRIP-011-R9); de läses samtidigt som flygplatserna
  const [airports, fleet] = search
    ? await Promise.all([getAirportPair(search.from, search.to), listFleet()])
    : [null, []];
  if (!search || !airports) {
    return (
      <>
        <SearchForm />
        <p>Sökningen saknar något. Fyll i formuläret och tryck på Sök.</p>
      </>
    );
  }

  const [outbound, inbound] = await Promise.all([
    findFlights(search.from, search.to, search.outbound, search.travellers, fleet),
    search.return ? findFlights(search.to, search.from, search.return, search.travellers, fleet) : null,
  ]);
  // En ny sökning börjar om: formuläret och resultaten byggs om från början
  const key = searchUrl(search);
  return (
    <>
      <SearchForm
        key={`form-${key}`}
        initial={{
          from: airports.from,
          to: airports.to,
          dates: { outbound: search.outbound, return: search.return, roundTrip: search.return !== null },
          travellers: search.travellers,
        }}
      />
      <FlightResults
        key={key}
        search={search}
        cities={{ from: airports.from.city, to: airports.to.city }}
        outbound={outbound}
        inbound={inbound}
        chosen={parseLegs(params, search)}
      />
    </>
  );
}
