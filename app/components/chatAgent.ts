"use client";

import type { useRouter } from "next/navigation";
import { type AgentAction, type AgentContext, MAX_URL_LENGTH, NOT_READY_TEXT, safeActions } from "@/lib/agent-rules";
import {
  asCharterForm,
  charterProblems,
  emptyCharterForm,
  fitTravellers,
  parseCharterSearch,
  parseChoice,
  withoutUnavailable,
} from "@/lib/charter-rules";
import { bookCharter } from "../charter/book";
import { saveCharterForm } from "../charter/form";
import { CHARTER_FORM_KEY, getStored } from "../flyg/boka/store";

// Chattens del av agentläget (TRIP-030): vilken sida och vilka val som följer med en fråga, att utföra
// åtgärderna som kommer tillbaka, och att boka med knappen. Inget personligt lämnar sidan härifrån.

type Router = ReturnType<typeof useRouter>;

const savedForm = () => asCharterForm(getStored(CHARTER_FORM_KEY));
const searchOf = () => parseCharterSearch(Object.fromEntries(new URLSearchParams(location.search)));

// Sidan och det icke-personliga besökaren valt (R4). Formuläret går inte med, bara om det stämmer.
export function readContext(): AgentContext {
  const url = location.pathname + location.search;
  const form = savedForm();
  const search = searchOf();
  const fitted = form && search ? fitTravellers(form, search.travellers) : null;
  return {
    url: url.length > MAX_URL_LENGTH ? "/okand" : url,
    extras: form?.extras ?? [],
    payment: form?.payment ?? null,
    valid: !!fitted && Object.keys(charterProblems(fitted, [])).length === 0,
  };
}

// Har besökaren ändrat sidan eller valen sedan frågan skickades? Då släpps åtgärderna (R4).
export const sameContext = (a: AgentContext, b: AgentContext) => JSON.stringify(a) === JSON.stringify(b);

// Utför åtgärderna: formuläret först, sidan sist. Varje åtgärd kontrolleras en gång till (R3).
export function applyActions(actions: AgentAction[], router: Router) {
  for (const action of safeActions(actions)) {
    const form = savedForm() ?? emptyCharterForm("");
    if (action.type === "extras") saveCharterForm({ ...form, extras: withoutUnavailable(action.extras, form.passengers) }); // dryckespaketet aldrig med någon under 18 (R6)
    if (action.type === "payment") saveCharterForm({ ...form, payment: action.payment });
    if (action.type === "goto") router.push(action.url);
  }
}

// Boka och betala-knappen (R8): bokar från sidans adress och formuläret med samma åtgärd som Betala.
// Kräver att sidan är Resenärer eller betalning med båda resorna valda, ett giltigt formulär och ett betalsätt.
export async function bookNow(router: Router): Promise<{ error: string } | { bookingNumber: string }> {
  const [, , id, step] = location.pathname.split("/");
  const search = searchOf();
  const choice = parseChoice(Object.fromEntries(new URLSearchParams(location.search)));
  const form = savedForm();
  const fitted = form && search ? fitTravellers(form, search.travellers) : null;
  if (step !== "boka" || !id || !search || !choice.out || !choice.back || !fitted || !fitted.payment || Object.keys(charterProblems(fitted, [])).length > 0) {
    return { error: NOT_READY_TEXT };
  }
  // Ett id för bokningen, så att två tryck blir en bokning
  const ready = { ...fitted, requestId: fitted.requestId || crypto.randomUUID() };
  saveCharterForm(ready);
  return bookCharter(router, id, search, choice, ready);
}
