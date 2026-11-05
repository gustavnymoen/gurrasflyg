import "server-only";
import type Anthropic from "@anthropic-ai/sdk";
import { type AgentAction } from "./agent-rules";
import { readPage, tripLine, tripText } from "./agent-page";
import { type CharterData, readCharter } from "./charter";
import {
  charterTotal,
  EXTRAS,
  extraByCode,
  extraRows,
  NO_CHOICE,
  parseCharterSearch,
  resultsUrl,
  travellersUrl,
} from "./charter-rules";
import { MAX_MONTHS_AHEAD, MAX_TRIP_MONTHS } from "./dates";
import { ACCESS_NAMES, CATEGORY_NAMES, CONTINENT_NAMES } from "./destination-names";
import { applyFilters, DEPARTURE_AIRPORTS, type Filters, filtersToParams, NO_FILTERS } from "./destinations";
import { formatPrice } from "./format";
import { PAYMENTS, type Payment } from "./booking-rules";
import { getDestinationAirport, getDestinationCards } from "./travel";

// Agnetas verktyg (TRIP-030-R2, R3, R5, R6). Ett verktyg ändrar aldrig något själv: det läser ur
// databasen, och vill det öppna en sida eller skriva till formuläret lägger det en åtgärd i
// State.actions, som chatten utför om sidan är oförändrad. Bokningen är inget verktyg (R8).

// Det som ett svar bygger på och ändrar: sidan, tilläggen och betalsättet som de är nu, och åtgärderna hittills
export type AgentState = {
  url: string;
  extras: string[];
  payment: Payment | null;
  valid: boolean;
  actions: { goto?: string; extras?: string[]; payment?: Payment };
};

// Ett fel som modellen får läsa ("fel argument", R2). Ingenting har hänt.
export class ToolError extends Error {}

const ID_NOTE = "Use the destination id from the knowledge, e.g. teufelsberg.";
const tripProps = {
  id: { type: "string", description: ID_NOTE },
  from: { type: "string", enum: DEPARTURE_AIRPORTS, description: "Departure airport: ARN (Stockholm Arlanda) or CPH (Köpenhamn Kastrup)." },
  outbound: { type: "string", description: "Outbound date, YYYY-MM-DD." },
  return: { type: "string", description: "Return date, YYYY-MM-DD, on or after the outbound date." },
  travellers: { type: "integer", description: "Number of travellers, 1 to 10." },
} as const;
const tripRequired = ["id", "from", "outbound", "return", "travellers"];

export const TOOLS: Anthropic.Tool[] = [
  {
    name: "show_destinations",
    description: `Open the list of charter destinations in the visitor's browser, with a search text and filters, and get back how many destinations match and the first 15. A filter with several values means "any of them"; different filters must all match. Use the exact English values: continent (${Object.keys(CONTINENT_NAMES).join(", ")}), access (${Object.keys(ACCESS_NAMES).join(", ")}), category (${Object.keys(CATEGORY_NAMES).join(", ")}), country (the English country name from the knowledge). Leave out what the visitor did not ask for.`,
    input_schema: {
      type: "object",
      properties: {
        q: { type: "string", description: "Free search text, matched against names, places, countries and tags." },
        continent: { type: "array", items: { type: "string" } },
        country: { type: "array", items: { type: "string" } },
        access: { type: "array", items: { type: "string" } },
        category: { type: "array", items: { type: "string" } },
      },
    },
  },
  {
    name: "show_destination",
    description: `Open one destination's page in the visitor's browser. ${ID_NOTE}`,
    input_schema: { type: "object", properties: { id: tripProps.id }, required: ["id"] },
  },
  {
    name: "find_trips",
    description:
      "Look up the trips that run for a destination, a departure airport, an outbound date, a return date and a number of travellers: the same trips and prices the results page shows. Opens nothing. Use it before you name a trip or a price, and to check that trips run on the dates. A return trip must leave after the outbound trip has landed.",
    input_schema: { type: "object", properties: tripProps, required: tripRequired },
  },
  {
    name: "show_results",
    description:
      "Open the results page (where trips are chosen) for a destination and a search, in the visitor's browser. Give outbound_trip and return_trip (trip ids from find_trips) only when the visitor has agreed to them. Does nothing if no trips run on the dates.",
    input_schema: {
      type: "object",
      properties: { ...tripProps, outbound_trip: { type: "string" }, return_trip: { type: "string" } },
      required: tripRequired,
    },
  },
  {
    name: "show_travellers",
    description:
      "Open the Resenärer page in the visitor's browser, with the search and one outbound and one return trip already chosen, skipping the results page. Both trips are required (ids from find_trips). The visitor fills in names, ages and contact details there; you cannot and must not.",
    input_schema: {
      type: "object",
      properties: { ...tripProps, outbound_trip: { type: "string" }, return_trip: { type: "string" } },
      required: [...tripRequired, "outbound_trip", "return_trip"],
    },
  },
  {
    name: "set_extras",
    description: `Set which extras the booking has, replacing the earlier choice (an empty list clears it). Codes: ${EXTRAS.map((e) => `${e.code} = ${e.name}, ${formatPrice(e.price)} per person`).join("; ")}. The drinks package is dropped by the page if a traveller is under 18.`,
    input_schema: {
      type: "object",
      properties: { extras: { type: "array", items: { type: "string", enum: EXTRAS.map((e) => e.code) } } },
      required: ["extras"],
    },
  },
  {
    name: "set_payment",
    description: `Set how the visitor pays: ${PAYMENTS.map((p) => `${p.value} = ${p.label}`).join("; ")}.`,
    input_schema: {
      type: "object",
      properties: { payment: { type: "string", enum: PAYMENTS.map((p) => p.value) } },
      required: ["payment"],
    },
  },
  {
    name: "summarise",
    description:
      "Get the booking as it stands for the page the visitor is on: destination, dates, the chosen trips, travellers, extras, payment method, the total price from the database, and whether the traveller form is valid. Use it before you summarise the trip to the visitor.",
    input_schema: { type: "object", properties: {} },
  },
];

const text = (value: unknown) => (typeof value === "string" ? value : undefined);
const strings = (value: unknown) => (Array.isArray(value) ? value.filter((v): v is string => typeof v === "string") : []);
const fold = (value: string) => value.trim().toLowerCase();

// Ger varje värde som finns bland de kända (utan hänsyn till versaler) med den kändas stavning
function known(values: string[], options: string[]) {
  const found: string[] = [];
  const ignored: string[] = [];
  for (const value of values) {
    const match = options.find((option) => fold(option) === fold(value));
    (match ? found : ignored).push(match ?? value);
  }
  return { found: [...new Set(found)], ignored };
}

async function showDestinations(input: Record<string, unknown>, state: AgentState) {
  const cards = await getDestinationCards();
  const ignored: string[] = [];
  const pick = (options: string[], values: string[]) => {
    const result = known(values, options);
    ignored.push(...result.ignored);
    return result.found;
  };
  const countryNames = cards.flatMap((c) => [c.countryNameEn, c.country]);
  const countries = known(strings(input.country), countryNames);
  ignored.push(...countries.ignored);
  const filters: Filters = {
    ...NO_FILTERS,
    q: text(input.q)?.trim() ?? "",
    continent: pick([...new Set(cards.map((c) => c.continent))], strings(input.continent)),
    country: [...new Set(countries.found.flatMap((name) => cards.filter((c) => c.countryNameEn === name || c.country === name).map((c) => c.country)))],
    access: pick([...new Set(cards.map((c) => c.access))], strings(input.access)),
    category: pick([...new Set(cards.map((c) => c.category))], strings(input.category)),
  };
  const params = filtersToParams(filters);
  go(state, params.size > 0 ? `/charter?${params}` : "/charter");
  const matches = applyFilters(cards, filters);
  const rows = matches.slice(0, 15).map((c) => `- ${c.id}: ${c.title}, ${c.country}, ${c.category}${c.price === null ? ", no flights" : `, round trip from ${formatPrice(c.price)} per person`}`);
  return [
    `Opened the list: ${matches.length} destinations match.`,
    ...(ignored.length > 0 ? [`Ignored values that do not exist: ${ignored.join(", ")}`] : []),
    ...rows,
    ...(matches.length > rows.length ? [`(${matches.length - rows.length} more)`] : []),
  ].join("\n");
}

async function showDestination(input: Record<string, unknown>, state: AgentState) {
  const card = (await getDestinationCards()).find((c) => c.id === text(input.id));
  if (!card) throw new ToolError("No such destination id. Use an id from the knowledge.");
  go(state, `/charter/${card.id}`);
  return `Opened the page of ${card.title}.`;
}

const go = (state: AgentState, url: string) => {
  state.actions.goto = url;
  state.url = url;
  state.valid = false; // en ny sida: formuläret är inte kontrollerat där
};

// Resmålet och sökningen ur verktygets argument, kontrollerade (R2: fel argument ger ett felsvar)
async function tripArgs(input: Record<string, unknown>) {
  const id = text(input.id);
  const search = parseCharterSearch({ fran: text(input.from), utresa: text(input.outbound), hemresa: text(input.return), resenarer: String(input.travellers) });
  if (!id || !search) {
    throw new ToolError("Give id, from (ARN or CPH), outbound and return as YYYY-MM-DD (return on or after outbound) and travellers (1 to 10).");
  }
  const destination = await getDestinationAirport(id);
  if (!destination) throw new ToolError("No such destination id, or no flights go there.");
  return { destination, search };
}

const DATES_TEXT = `Those dates cannot be booked: from today up to ${MAX_MONTHS_AHEAD} months ahead, and the return on or after the outbound date and at most ${MAX_TRIP_MONTHS} months later.`;

async function charterOf(input: Record<string, unknown>, choice = NO_CHOICE) {
  const { destination, search } = await tripArgs(input);
  const data = await readCharter(destination, search, choice, new Date());
  if (!data) throw new ToolError(DATES_TEXT);
  return data;
}

const tripList = (title: string, trips: CharterData["out"]) => `${title}:\n${trips.length > 0 ? trips.map((t) => `- ${tripLine(t)}`).join("\n") : "- none: no trip runs on this date"}`;

async function findTrips(input: Record<string, unknown>) {
  const data = await charterOf(input);
  return [
    tripList(`Outbound trips on ${data.search.outbound}`, data.out),
    tripList(`Return trips on ${data.search.return}`, data.back),
    "A return trip must leave after the chosen outbound trip has landed.",
  ].join("\n");
}

// Resultatsidan, eller Resenärer direkt (R3, R4). Valda resor måste finnas och passa ihop: det avgör sidans egen regel.
async function showTrip(input: Record<string, unknown>, state: AgentState, step: "results" | "travellers") {
  const choice = { out: text(input.outbound_trip) ?? null, back: text(input.return_trip) ?? null };
  const data = await charterOf(input, choice);
  if (data.out.length === 0 || data.back.length === 0) {
    throw new ToolError("No trip runs on one of the dates, so nothing was opened. Tell the visitor and suggest other dates.");
  }
  if ((choice.out && data.choice.out !== choice.out) || (choice.back && data.choice.back !== choice.back)) {
    throw new ToolError("A trip you gave does not run on that date, or the return does not leave after the outbound has landed. Check with find_trips.");
  }
  if (step === "travellers" && !(data.outbound && data.home)) throw new ToolError("Both trips are required.");
  const open = step === "results" ? resultsUrl : travellersUrl;
  go(state, open(data.destination.id, data.search, data.choice));
  return `Opened ${step === "results" ? "the results page" : "the Resenärer page"}.\n${tripText(data)}`;
}

function setExtras(input: Record<string, unknown>, state: AgentState) {
  const codes = strings(input.extras);
  const unknown = codes.filter((code) => !extraByCode(code));
  if (unknown.length > 0) throw new ToolError(`Unknown extra: ${unknown.join(", ")}. Codes: ${EXTRAS.map((e) => e.code).join(", ")}.`);
  state.extras = EXTRAS.filter((e) => codes.includes(e.code)).map((e) => e.code);
  state.actions.extras = state.extras;
  return `Extras set: ${extraRows(state.extras, 1).map((e) => e.name).join(", ") || "none"}.`;
}

function setPayment(input: Record<string, unknown>, state: AgentState) {
  const payment = PAYMENTS.find((p) => p.value === input.payment);
  if (!payment) throw new ToolError(`Unknown payment method. Use ${PAYMENTS.map((p) => p.value).join(" or ")}.`);
  state.payment = payment.value;
  state.actions.payment = payment.value;
  return `Payment method set: ${payment.label}.`;
}

// Bokningen som den ser ut på sidan besökaren är på, med priset från databasen (R8)
async function summary(state: AgentState) {
  const info = await readPage(state.url, new Date());
  if (info.kind !== "trip" || !info.data.outbound || !info.data.home) {
    throw new ToolError("Nothing to summarise yet: the visitor has not chosen an outbound and a return trip.");
  }
  const { data } = info;
  const rows = extraRows(state.extras, data.search.travellers);
  const total = charterTotal([data.outbound!.price, data.home!.price], state.extras, data.search.travellers);
  return [
    tripText(data),
    `Extras: ${rows.map((e) => `${e.name} (${formatPrice(e.sum)})`).join(", ") || "none"}`,
    `Payment method: ${PAYMENTS.find((p) => p.value === state.payment)?.label ?? "not chosen"}`,
    `Total price: ${formatPrice(total)}`,
    `The traveller form is ${state.valid ? "valid" : "not valid (not filled in or wrong)"}.`,
  ].join("\n");
}

// Kör ett verktyg. Okänt verktyg eller fel argument ger ToolError, som modellen får läsa.
export async function runTool(name: string, input: unknown, state: AgentState): Promise<string> {
  const args = (typeof input === "object" && input !== null ? input : {}) as Record<string, unknown>;
  switch (name) {
    case "show_destinations":
      return showDestinations(args, state);
    case "show_destination":
      return showDestination(args, state);
    case "find_trips":
      return findTrips(args);
    case "show_results":
      return showTrip(args, state, "results");
    case "show_travellers":
      return showTrip(args, state, "travellers");
    case "set_extras":
      return setExtras(args, state);
    case "set_payment":
      return setPayment(args, state);
    case "summarise":
      return summary(state);
    default:
      throw new ToolError(`There is no tool called ${name}.`);
  }
}

// Åtgärderna efter svaret, i den ordning chatten utför dem: formuläret först, sidan sist
export function actionsOf({ actions }: AgentState): AgentAction[] {
  return [
    ...(actions.extras ? [{ type: "extras" as const, extras: actions.extras }] : []),
    ...(actions.payment ? [{ type: "payment" as const, payment: actions.payment }] : []),
    ...(actions.goto ? [{ type: "goto" as const, url: actions.goto }] : []),
  ];
}
