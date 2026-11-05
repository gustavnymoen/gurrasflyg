"use client";

import { useSearchParams } from "next/navigation";
import type { FleetAircraft } from "@/lib/fare-rules";
import type { Flight } from "@/lib/flight-rules";
import type { Search } from "@/lib/search";
import { bookingUrl, checkChoice, keepChoice, parseLegs, type PlanChoice, planUrl, resultsUrl } from "@/lib/trip";
import Steps, { tripSteps } from "../Steps";
import TripOverview from "../TripOverview";
import PlanBuilder from "./PlanBuilder";

// Plan och klasser för de valda flygen (TRIP-011): valen läses från adressen, och
// PlanBuilder, som charter delar (TRIP-039), gör resten
export default function TripBuilder({ search, flights, fleet }: { search: Search; flights: Flight[]; fleet: FleetAircraft[] }) {
  const { travellers } = search;
  const parsed = parseLegs(Object.fromEntries(useSearchParams()), search);
  const legs = flights.map((f, i) => checkChoice(keepChoice(parsed?.[i], f.time), fleet, travellers));
  const withTimes = (plans: PlanChoice[]) => plans.map((plan, i) => ({ ...plan, time: legs[i].time }));

  return (
    <PlanBuilder
      legs={legs}
      flights={flights}
      fleet={fleet}
      travellers={travellers}
      urlFor={(plans) => planUrl(search, withTimes(plans))}
      emptyLink={{ href: resultsUrl(search, legs), label: "Till flygen" }}
      nextHref={bookingUrl(search, legs)}
      steps={<Steps steps={tripSteps(search, legs)} current={1} />}
      overview={<TripOverview flights={flights} legs={legs} fleet={fleet} travellers={travellers} />}
    />
  );
}
