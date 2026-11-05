import { redirect } from "next/navigation";
import { loadCharter } from "@/lib/charter";
import { planUrl, resultsUrl } from "@/lib/charter-rules";
import { readAddonNames } from "@/lib/flights";
import type { Params } from "@/lib/search";
import CharterPaymentForm from "../CharterPaymentForm";
import CharterPlan from "../CharterPlan";
import CharterResults from "../CharterResults";
import CharterTravellersForm from "../CharterTravellersForm";
import Problem from "../../flyg/Problem";

// Resorna, plan och klass, resenärerna eller betalningen för resmålet och sökningen i adressen (TRIP-014, TRIP-039).
// Sökningen, resorna, planen och priserna läses från databasen; saknas något i adressen står det vad.
// Resenärerna och betalningen kräver ett plan och klasser för båda resorna; saknas de går besökaren
// till plan och klass med resorna kvar och inget valt åt hen (TRIP-039-R6).
export default async function CharterStep({
  params,
  searchParams,
  step,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Params>;
  step: "results" | "plan" | "travellers" | "payment";
}) {
  const { id } = await params;
  const data = await loadCharter(id, await searchParams);
  if ("problem" in data) {
    return <Problem text="Sökningen saknar något. Börja med att välja en destination." href="/charter" link="Till charterresorna" />;
  }

  const { destination, search, choice, outbound, home } = data;
  if (step === "results") {
    return (
      <CharterResults
        key={resultsUrl(id, search)}
        id={id}
        title={destination.title}
        airport={destination.airport}
        search={search}
        out={data.out}
        back={data.back}
        initial={choice}
      />
    );
  }
  if (!outbound || !home) {
    return <Problem text="Välj en utresa och en hemresa först." href={resultsUrl(id, search, choice)} link="Till resorna" />;
  }
  const { fleet, legs } = data;
  if (step === "plan") {
    return <CharterPlan id={id} title={destination.title} search={search} choice={choice} outbound={outbound} home={home} fleet={fleet} />;
  }
  if (!legs) redirect(planUrl(id, search, choice));
  const Form = step === "travellers" ? CharterTravellersForm : CharterPaymentForm;
  const addonNames = step === "travellers" ? await readAddonNames() : {};
  return (
    <Form
      id={id}
      title={destination.title}
      search={search}
      choice={choice}
      outbound={outbound}
      home={home}
      legs={legs}
      addonNames={addonNames}
    />
  );
}
