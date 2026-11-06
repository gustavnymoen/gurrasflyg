"use client";

import { useSearchParams } from "next/navigation";
import type { FleetAircraft } from "@/lib/fare-rules";
import {
  type CharterChoice,
  type CharterSearch,
  type CharterTrip,
  charterParams,
  CHARTER_PATH,
  planText,
  toPlanFlight,
  travellersUrl,
} from "@/lib/charter-rules";
import { checkChoice, LEG_NAMES, parsePlan } from "@/lib/trip";
import Steps from "../flyg/Steps";
import PlanBuilder from "../flyg/plan/PlanBuilder";
import CharterOverview from "./CharterOverview";
import { charterSteps } from "./steps";

// Plan och klasser för de två resorna (TRIP-039-R1–R3): samma kort och räknare som på /flyg/plan
// (PlanBuilder). Valen läses från adressen och skrivs tillbaka dit; avgångens pris är basen och
// flygtiden och ankomsten är avgångens egna, så planets tidsfaktor syns inte (R2).
export default function CharterPlan({
  id,
  title,
  search,
  choice,
  outbound,
  home,
  fleet,
}: {
  id: string;
  title: string;
  search: CharterSearch;
  choice: CharterChoice;
  outbound: CharterTrip;
  home: CharterTrip;
  fleet: FleetAircraft[];
}) {
  const params = Object.fromEntries(useSearchParams());
  const plans = LEG_NAMES.map(({ key }) => checkChoice(parsePlan(params, key), fleet, search.travellers));
  const current = { ...choice, plans };

  return (
    <PlanBuilder
      legs={plans}
      flights={[outbound, home].map(toPlanFlight)}
      fleet={fleet}
      travellers={search.travellers}
      compareTime={false}
      urlFor={(next) => `${CHARTER_PATH}/${id}/plan?${charterParams(search, { ...choice, plans: next })}`}
      emptyLink={{ href: `${CHARTER_PATH}/${id}`, label: "Ändra antal resenärer" }}
      nextHref={travellersUrl(id, search, current)}
      steps={<Steps steps={charterSteps(id, search, current)} current={1} />}
      overview={
        <CharterOverview
          destination={title}
          trips={[outbound, home]}
          plans={plans.map((plan) => planText(plan, fleet))}
          travellers={search.travellers}
        />
      }
    />
  );
}
