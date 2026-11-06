import "server-only";
import { type FlightData, flightLine, readFlight } from "./agent-flight";
import { type AgentContext, isAgentUrl, isFlightUrl } from "./agent-rules";
import { type CharterData, readCharter } from "./charter";
import { type CharterTrip, extraRows, parseCharterSearch, parseChoice, planText, stopsText } from "./charter-rules";
import { type Filters, filtersToParams, parseFilters } from "./destinations";
import { formatPrice } from "./format";
import { PAYMENTS } from "./booking-rules";
import type { Params } from "./search";
import { getDestinationAirport, getDestinationCards } from "./travel";

// Sidan besökaren är på, läst med sidornas egna regler (TRIP-030-R4). Adressen litar ingen på:
// det som inte går att läsa är "en okänd sida", och resorna kontrolleras mot databasen.
export type PageInfo =
  | { kind: "unknown" | "start" }
  | { kind: "list"; filters: Filters }
  | { kind: "destination"; id: string; title: string }
  | { kind: "trip"; step: "results" | "plan" | "travellers" | "payment"; data: CharterData }
  | { kind: "flight"; step: "results" | "plan" | "travellers" | "payment"; data: FlightData };

const MAX_SHOWN_SEARCH = 80;
const UNKNOWN: PageInfo = { kind: "unknown" };

export async function readPage(url: string, now: Date): Promise<PageInfo> {
  if (url === "/") return { kind: "start" };
  if (!isAgentUrl(url)) return UNKNOWN;
  const [path, query = ""] = url.split("?");
  if (isFlightUrl(url)) return readFlightPage(path, Object.fromEntries(new URLSearchParams(query)), now);
  const [id, step, last] = path.split("/").slice(2); // efter "" och "charter"
  if (!id) return { kind: "list", filters: parseFilters(new URLSearchParams(query), await getDestinationCards()) };
  if (!step) {
    const card = (await getDestinationCards()).find((c) => c.id === id);
    return card ? { kind: "destination", id, title: card.title } : UNKNOWN;
  }
  const params = Object.fromEntries(new URLSearchParams(query));
  const search = parseCharterSearch(params);
  const destination = search ? await getDestinationAirport(id) : null;
  const data = search && destination ? await readCharter(destination, search, parseChoice(params), now) : null;
  if (!data) return UNKNOWN;
  const steps: Record<string, "results" | "plan" | "travellers"> = { resor: "results", plan: "plan", boka: "travellers" };
  return { kind: "trip", step: last === "betala" ? "payment" : steps[step], data };
}

const FLIGHT_STEPS: Record<string, "results" | "plan" | "travellers" | "payment"> = { "/flyg": "results", "/flyg/plan": "plan", "/flyg/boka": "travellers", "/flyg/boka/betala": "payment" };

async function readFlightPage(path: string, params: Params, now: Date): Promise<PageInfo> {
  const data = await readFlight(params, now);
  return data ? { kind: "flight", step: FLIGHT_STEPS[path], data } : UNKNOWN;
}

// En resa på en rad, med det modellen behöver för att välja och berätta
export function tripLine(t: CharterTrip) {
  const next = t.arrival.days > 0 ? ` (+${t.arrival.days} day)` : "";
  return `${t.id}: ${t.date} ${t.time} ${t.from.iata} to ${t.to.iata}, arrives ${t.arrival.time}${next} local time, ${t.airline} ${t.flights.join(" + ")}, ${stopsText(t.stops)}, ${formatPrice(t.price)} per person`;
}

// Det valda i en bokning som text: datum, resenärer, de valda resorna och deras plan och klasser
export function tripText({ destination, search, outbound, home, choice, fleet }: CharterData) {
  const [outPlan, backPlan] = choice.plans.map((plan) => planText(plan, fleet) ?? "none yet");
  return [
    `Destination: ${destination.title} (${destination.id}), airport ${destination.airport}`,
    `Search: from ${search.from}, outbound ${search.outbound}, return ${search.return}, ${search.travellers} travellers`,
    `Chosen outbound trip: ${outbound ? tripLine(outbound) : "none yet"}`,
    `Chosen return trip: ${home ? tripLine(home) : "none yet"}`,
    `Chosen aircraft and travellers per class, outbound: ${outPlan}`,
    `Chosen aircraft and travellers per class, return: ${backPlan}`,
  ].join("\n");
}

const LEG_ORDER = ["outbound", "return"];

// Det valda på flygens sidor som text: sökningen, de valda flygen och deras plan och klasser
export function flightText({ search, flights, plans, fleet }: FlightData) {
  return [
    `Search: from ${search.from} to ${search.to}, outbound ${search.outbound}, ${search.return ? `return ${search.return}` : "one way"}, ${search.travellers} travellers`,
    ...flights.flatMap((f, i) => [
      `Chosen ${LEG_ORDER[i]} flight: ${f ? flightLine(f) : "none yet"}`,
      `Chosen aircraft and travellers per class, ${LEG_ORDER[i]}: ${planText(plans[i], fleet) ?? "none yet"}`,
    ]),
  ].join("\n");
}

// Det modellen får veta om sidan före varje fråga. Bara det som är icke-personligt (R4).
export function pageText(info: PageInfo, context: AgentContext) {
  const lines: string[] = [];
  switch (info.kind) {
    case "unknown":
      lines.push("The visitor is on a page you do not know.");
      break;
    case "start":
      lines.push("The visitor is on the start page.");
      break;
    case "list": {
      const params = filtersToParams({ ...info.filters, q: info.filters.q.slice(0, MAX_SHOWN_SEARCH) }); // en länk kan bära en lång text som inte ska till modellen
      lines.push(`The visitor is on the list of destinations${params.size > 0 ? ` with these filters (as in the address): ${params}` : " with no filters"}.`);
      break;
    }
    case "destination":
      lines.push(`The visitor is on the page of ${info.title} (${info.id}).`);
      break;
    case "flight": {
      const names = {
        results: "the flight results page (choose the departures, outbound first)",
        plan: "the plan step (choose the aircraft and the number of travellers per class, for each flight)",
        travellers: "the Resenärer page (the visitor fills in travellers and contact details; the classes are shown but cannot be changed here, only in the plan step)",
        payment: "the payment page",
      };
      lines.push(`The visitor is on ${names[info.step]}.`, flightText(info.data));
      break;
    }
    case "trip": {
      const names = {
        results: "the results page (choose trips)",
        plan: "the plan step (choose the aircraft and the number of travellers per class, for each trip)",
        travellers: "the Resenärer page (the visitor fills in travellers and contact details; the classes are shown but cannot be changed here, only in the plan step)",
        payment: "the payment page",
      };
      lines.push(`The visitor is on ${names[info.step]}.`, tripText(info.data));
      break;
    }
  }
  const extras = extraRows(context.extras, 1).map((e) => e.name);
  lines.push(
    `Extras chosen: ${extras.join(", ") || "none"}`,
    `Payment method: ${PAYMENTS.find((p) => p.value === context.payment)?.label ?? "not chosen"}`,
    `The traveller form is ${context.valid ? "valid" : "not valid (not filled in or wrong)"}.`,
  );
  return `<page>\n${lines.join("\n")}\n</page>`;
}
