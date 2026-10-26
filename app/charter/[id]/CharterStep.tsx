import { loadCharter } from "@/lib/charter";
import { resultsUrl } from "@/lib/charter-rules";
import type { Params } from "@/lib/search";
import CharterPaymentForm from "../CharterPaymentForm";
import CharterResults from "../CharterResults";
import CharterTravellersForm from "../CharterTravellersForm";
import Problem from "../../flyg/Problem";

// Resorna, resenärerna eller betalningen för resmålet och sökningen i adressen (TRIP-014).
// Sökningen, resorna och priserna läses från databasen; saknas något i adressen står det vad.
export default async function CharterStep({
  params,
  searchParams,
  step,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Params>;
  step: "results" | "travellers" | "payment";
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
  const Form = step === "travellers" ? CharterTravellersForm : CharterPaymentForm;
  return <Form id={id} title={destination.title} search={search} choice={choice} outbound={outbound} home={home} />;
}
