import "server-only";
import type Anthropic from "@anthropic-ai/sdk";
import { type AddonChoice, type AgentAction, isFlightUrl, isMyBookingUrl } from "./agent-rules";
import { allParts, type BookingExtract, whyNot } from "./cancel-extract";
import { MY_BOOKING_PATH } from "./cancel-rules";
import { chosenLegs, type FlightData, flightAircraftText, flightDatesProblem, flightLine } from "./agent-flight";
import { aircraftText, checkPlan } from "./agent-plan";
import { flightText, type PageInfo, readPage, tripLine, tripText } from "./agent-page";
import { type CharterData, readCharter } from "./charter";
import {
  EXTRAS,
  extraByCode,
  extraRows,
  NO_CHOICE,
  parseCharterSearch,
  planText,
  planUrl,
  resultsUrl,
  paymentUrl,
  travellersUrl,
} from "./charter-rules";
import { MAX_MONTHS_AHEAD, MAX_TRIP_MONTHS } from "./dates";
import { ACCESS_NAMES, CATEGORY_NAMES, CONTINENT_NAMES } from "./destination-names";
import { applyFilters, DEPARTURE_AIRPORTS, type Filters, filtersToParams, NO_FILTERS } from "./destinations";
import { formatPrice } from "./format";
import { type AddonOption, type BookingLeg, fitPassengerLegs, isBeer, MAX_ADDONS, NERVES_PRICE, PAYMENTS, type Payment, seatsTotal } from "./booking-rules";
import type { FleetAircraft } from "./fare-rules";
import { findAirports, findFlights, getAirportPair, listFleet } from "./flights";
import { parseSearch } from "./search";
import { bookingUrl, paymentUrl as flightPaymentUrl, type PlanChoice, planUrl as flightPlanUrl, resultsUrl as flightResultsUrl } from "./trip";
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
  // Utdraget av bokningen på Min bokning, om en är hittad (TRIP-037)
  booking?: BookingExtract;
  // Klasser och tillägg som besökaren valt i formuläret, och hur många som kryssat Dåliga nerver (TRIP-044)
  choice?: AddonChoice;
  nerves?: number;
  actions: { tick?: number[]; goto?: string; extras?: string[]; payment?: Payment; addons?: Omit<Extract<AgentAction, { type: "addons" }>, "type"> };
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
const flightProps = {
  from: { type: "string", description: "Departure airport, an IATA code from find_airports." },
  to: { type: "string", description: "Arrival airport, an IATA code from find_airports." },
  outbound: tripProps.outbound,
  return: { type: "string", description: "Return date, YYYY-MM-DD, on or after the outbound date. Leave out for a one-way trip." },
  travellers: tripProps.travellers,
} as const;
const flightRequired = ["from", "to", "outbound", "travellers"];

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
    name: "show_plan",
    description:
      "Open the plan step (choose the aircraft and the number of travellers per class, for each trip) in the visitor's browser, with the search and one outbound and one return trip already chosen, skipping the results page. Both trips are required (ids from find_trips). Aircraft and classes are chosen on it with list_aircraft and set_plan.",
    input_schema: {
      type: "object",
      properties: { ...tripProps, outbound_trip: { type: "string" }, return_trip: { type: "string" } },
      required: [...tripRequired, "outbound_trip", "return_trip"],
    },
  },
  {
    name: "find_airports",
    description:
      "Look up airports for ordinary flights by a city, airport name, country or IATA code (e.g. London or ARN): up to 10 matches with their IATA codes. Opens nothing. Use it to get the codes for find_flights and show_flights; never guess a code.",
    input_schema: { type: "object", properties: { q: { type: "string" } }, required: ["q"] },
  },
  {
    name: "find_flights",
    description:
      "Look up the ordinary flights (not charter) between two airports on an outbound date and, for a round trip, a return date, for a number of travellers: the same departures and prices the flight results page shows. Opens nothing. Use it before you name a flight or a price. The departure time of a flight is its id.",
    input_schema: { type: "object", properties: flightProps, required: flightRequired },
  },
  {
    name: "show_flights",
    description:
      "Open the flight results page for a search in the visitor's browser. Give outbound_flight (and return_flight for a round trip), as departure times from find_flights, only when the visitor has agreed to them: both or none. Does nothing if no flight leaves on a date.",
    input_schema: { type: "object", properties: { ...flightProps, outbound_flight: { type: "string" }, return_flight: { type: "string" } }, required: flightRequired },
  },
  {
    name: "show_flight_plan",
    description:
      "Open the plan step for ordinary flights (choose the aircraft and the number of travellers per class, for each flight) with the search and the flights already chosen, skipping the results page. The outbound flight is required, and the return flight for a round trip (departure times from find_flights). Aircraft and classes are then chosen with list_aircraft and set_plan.",
    input_schema: { type: "object", properties: { ...flightProps, outbound_flight: { type: "string" }, return_flight: { type: "string" } }, required: [...flightRequired, "outbound_flight"] },
  },
  {
    name: "list_aircraft",
    description:
      "List the aircraft that seat all travellers on the page the visitor is on (both trips chosen), with each class's room and price per person for each trip, cheapest first: the same prices the plan step shows. Opens nothing. Use it before you name an aircraft or a price. A charter trip flies when its timetable says, so the aircraft has no flight time: never quote one.",
    input_schema: { type: "object", properties: {} },
  },
  {
    name: "set_plan",
    description:
      "Choose the aircraft and the number of travellers per class for one trip, on the plan step in the visitor's browser (it opens the page with the choice in the address). The numbers must add up to the number of travellers, and no class may get more than it has room for. Do it only when the visitor has agreed. A wrong choice is refused and nothing changes.",
    input_schema: {
      type: "object",
      properties: {
        trip: { type: "string", enum: ["outbound", "return"] },
        aircraft_id: { type: "integer", description: "An aircraft id from list_aircraft." },
        classes: {
          type: "array",
          items: { type: "object", properties: { class_id: { type: "integer" }, count: { type: "integer" } }, required: ["class_id", "count"] },
          description: "Travellers per class, e.g. [{ class_id: 1, count: 2 }].",
        },
      },
      required: ["trip", "aircraft_id", "classes"],
    },
  },
  {
    name: "list_addons",
    description:
      "List the add-ons (with price per piece) that can be bought in the classes chosen for each trip on the page the visitor is on. Needs aircraft and classes set for both trips.",
    input_schema: { type: "object", properties: {} },
  },
  {
    name: "set_addons",
    description: `Put add-ons in the traveller form: the given number of each, per traveller on both trips, wherever the add-on can be bought in the traveller's class. Names from list_addons. Beer cannot be set by you (an age rule): the visitor chooses it in the form. Replaces earlier add-ons set this way. Needs aircraft and classes set for both trips. At most ${MAX_ADDONS} of each.`,
    input_schema: {
      type: "object",
      properties: {
        addons: {
          type: "array",
          items: { type: "object", properties: { name: { type: "string" }, count: { type: "integer" } }, required: ["name", "count"] },
        },
      },
      required: ["addons"],
    },
  },
  {
    name: "show_travellers",
    description:
      "Open the Resenärer page for the page the visitor is on, with the chosen trips, aircraft and classes. Refused until aircraft and classes are set for both trips. The visitor fills in names, ages and contact details there; you cannot and must not.",
    input_schema: { type: "object", properties: {} },
  },
  {
    name: "show_payment",
    description:
      "Open the payment page, where the visitor chooses how to pay and checks the booking, with the chosen trips, aircraft and classes. Refused until the traveller form is valid; the visitor fills it in on Resenärer.",
    input_schema: { type: "object", properties: {} },
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
    name: "show_my_booking",
    description:
      "Open Min bokning in the visitor's browser, where the visitor finds a booking by typing the booking number and the contact's last name in the page's fields. You cannot look a booking up and never ask for the number or the name.",
    input_schema: { type: "object", properties: {} },
  },
  {
    name: "tick_cancellation",
    description:
      "On Min bokning, tick the boxes of the parts the visitor wants to cancel, replacing the boxes ticked now (include the ones the visitor ticked and still wants; an empty list clears them). Ids are the 'id' numbers in the <page> block. Parts that cannot be cancelled are not ticked and the answer says why. It does not cancel anything: the visitor presses Avboka on the page and answers Ja, avboka.",
    input_schema: { type: "object", properties: { ids: { type: "array", items: { type: "integer" } } }, required: ["ids"] },
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

// Resultatsidan, eller plan och klass direkt (R3). Valda resor måste finnas och passa ihop: det avgör sidans egen regel.
async function showTrip(input: Record<string, unknown>, state: AgentState, step: "results" | "plan") {
  const choice = { ...NO_CHOICE, out: text(input.outbound_trip) ?? null, back: text(input.return_trip) ?? null };
  const data = await charterOf(input, choice);
  if (data.out.length === 0 || data.back.length === 0) {
    throw new ToolError("No trip runs on one of the dates, so nothing was opened. Tell the visitor and suggest other dates.");
  }
  if ((choice.out && data.choice.out !== choice.out) || (choice.back && data.choice.back !== choice.back)) {
    throw new ToolError("A trip you gave does not run on that date, or the return does not leave after the outbound has landed. Check with find_trips.");
  }
  if (step === "plan" && !(data.outbound && data.home)) throw new ToolError("Both trips are required.");
  const open = step === "results" ? resultsUrl : planUrl;
  go(state, open(data.destination.id, data.search, data.choice));
  return `Opened ${step === "results" ? "the results page" : "the plan step"}.\n${tripText(data)}`;
}

// Sökningen på flygen ur verktygets argument, kontrollerad som sökformuläret kontrollerar den (fel argument ger ett felsvar)
async function flightArgs(input: Record<string, unknown>) {
  const search = parseSearch({ fran: text(input.from), till: text(input.to), utresa: text(input.outbound), hemresa: text(input.return), resenarer: String(input.travellers) });
  if (!search) {
    throw new ToolError("Give from and to (different IATA codes), outbound as YYYY-MM-DD, return as YYYY-MM-DD on or after outbound (leave it out for one way) and travellers (1 to 10).");
  }
  const problem = flightDatesProblem(search, new Date());
  if (problem) throw new ToolError(`${problem} ${DATES_TEXT}`);
  if (!(await getAirportPair(search.from, search.to))) throw new ToolError("No such airport. Look the codes up with find_airports.");
  return { search, fleet: await listFleet() };
}

const flightList = (title: string, flights: FlightData["out"]) => `${title}:\n${flights.length > 0 ? flights.map((f) => `- ${flightLine(f)}`).join("\n") : "- none: no flight leaves on this date"}`;

async function flightsOf(input: Record<string, unknown>) {
  const { search, fleet } = await flightArgs(input);
  const [out, back] = await Promise.all([
    findFlights(search.from, search.to, search.outbound, search.travellers, fleet),
    search.return ? findFlights(search.to, search.from, search.return, search.travellers, fleet) : null,
  ]);
  return { search, out, back };
}

async function findAirportsTool(input: Record<string, unknown>) {
  const airports = await findAirports((text(input.q) ?? "").trim().slice(0, 50));
  return airports.length > 0 ? airports.map((a) => `- ${a.iata}: ${a.name}, ${a.city}, ${a.country}`).join("\n") : "No airport matches. Try a city or a country.";
}

async function findFlightsTool(input: Record<string, unknown>) {
  const { search, out, back } = await flightsOf(input);
  return [flightList(`Outbound flights ${search.from} to ${search.to} on ${search.outbound}`, out), ...(back ? [flightList(`Return flights ${search.to} to ${search.from} on ${search.return}`, back)] : [])].join("\n");
}

// Resultatsidan, eller plan och klass direkt, för flygen (TRIP-036-R2). Valda flyg måste finnas, båda eller inget.
async function showFlights(input: Record<string, unknown>, state: AgentState, step: "results" | "plan") {
  const { search, out, back } = await flightsOf(input);
  if (out.length === 0 || (back && back.length === 0)) {
    throw new ToolError("No flight leaves on one of the dates, so nothing was opened. Tell the visitor and suggest another date.");
  }
  const picked = [out.find((f) => f.time === text(input.outbound_flight)), back?.find((f) => f.time === text(input.return_flight))].slice(0, back ? 2 : 1);
  const given = [text(input.outbound_flight), back && text(input.return_flight)].filter(Boolean);
  if (given.length > 0 && (given.length < picked.length || picked.some((f) => !f))) {
    throw new ToolError("Give the departure time of a flight from find_flights for every leg of the trip (both or none), as the flights leave on those dates.");
  }
  if (step === "plan" && given.length === 0) throw new ToolError("The flights are required.");
  const legs = given.length > 0 ? picked.map((f) => ({ time: f!.time, aircraftId: null, seating: null })) : [];
  go(state, (step === "results" ? flightResultsUrl : flightPlanUrl)(search, legs));
  return `Opened ${step === "results" ? "the flight results page" : "the plan step"}${picked.every(Boolean) && given.length > 0 ? ` with ${picked.map((f) => flightLine(f!)).join(" and ")}` : ""}.`;
}

// Bokningen på sidan besökaren är på, charter eller flyg, när alla resor är valda: det plan, klasser och tillägg
// behöver. Verktygen för dem är desamma för båda (TRIP-036); det som skiljer sitter här.
type Booking = {
  travellers: number;
  fleet: FleetAircraft[];
  // Planen för varje resa (en för en enkel flygresa) och resorna med plan, klasser och tillägg när alla har en
  plans: PlanChoice[];
  legs: BookingLeg[] | null;
  // Flygens öl får sättas: åldern kontrolleras av formuläret, som tar bort ölen för den som är under 18 (TRIP-036-R4)
  beer: boolean;
  list: () => string;
  text: () => string;
  url: (step: "plan" | "travellers" | "payment", plans: PlanChoice[]) => string;
};

const TRIP_ORDER = ["Outbound", "Return"];
const PLAN_TRAILER = (travellers: number) => `Give the numbers per class so that they add up to ${travellers} travellers. The prices are per person for the trip.`;

function charterBooking(data: CharterData): Booking {
  const trips = [data.outbound!, data.home!];
  const { destination, search, choice } = data;
  const url = { plan: planUrl, travellers: travellersUrl, payment: paymentUrl };
  return {
    travellers: search.travellers,
    fleet: data.fleet,
    plans: choice.plans,
    legs: data.legs,
    beer: false,
    list: () => [...trips.map((trip, i) => `${TRIP_ORDER[i]} trip ${trip.id}:\n${aircraftText(data.fleet, trip.price, search.travellers)}`), PLAN_TRAILER(search.travellers)].join("\n"),
    text: () => tripText(data),
    url: (step, plans) => url[step](destination.id, search, { ...choice, plans }),
  };
}

function flightBooking(data: FlightData): Booking {
  const { search, flights, fleet } = data;
  const url = { plan: flightPlanUrl, travellers: bookingUrl, payment: flightPaymentUrl };
  return {
    travellers: search.travellers,
    fleet,
    plans: data.plans,
    legs: data.legs,
    beer: true,
    list: () => [...flights.map((f, i) => `${TRIP_ORDER[i]} flight ${f!.time}:\n${flightAircraftText(fleet, f!, search.travellers)}`), PLAN_TRAILER(search.travellers)].join("\n"),
    text: () => flightText(data),
    url: (step, plans) => url[step](search, chosenLegs({ flights, plans })!),
  };
}

// Bokningen på sidan, eller null när sidan inte är en resa eller inte alla resor är valda
function bookingOf(info: PageInfo): Booking | null {
  if (info.kind === "trip" && info.data.outbound && info.data.home) return charterBooking(info.data);
  if (info.kind === "flight" && chosenLegs(info.data)) return flightBooking(info.data);
  return null;
}

const notChosen = (state: AgentState) =>
  new ToolError(`The visitor has not chosen ${isFlightUrl(state.url) ? "the flights" : "both trips"} on this page. Open the plan step with ${isFlightUrl(state.url) ? "show_flight_plan" : "show_plan"} first.`);

async function chosenPage(state: AgentState) {
  const booking = bookingOf(await readPage(state.url, new Date()));
  if (!booking) throw notChosen(state);
  return booking;
}

// Planen och klasserna ska vara klara för alla resor innan tillägg eller Resenärer (TRIP-039-R6)
async function readyPage(state: AgentState) {
  const booking = await chosenPage(state);
  if (!booking.legs) throw new ToolError("Aircraft and classes are not set for both trips. Use list_aircraft and set_plan first.");
  return { booking, legs: booking.legs };
}

async function listAircraft(state: AgentState) {
  return (await chosenPage(state)).list();
}

async function setPlan(input: Record<string, unknown>, state: AgentState) {
  const booking = await chosenPage(state);
  const index = ["outbound", "return"].indexOf(String(input.trip));
  if (index < 0 || index >= booking.plans.length) throw new ToolError(`trip must be ${booking.plans.length > 1 ? "outbound or return" : "outbound (it is a one-way trip)"}.`);
  const checked = checkPlan(booking.fleet, booking.travellers, input.aircraft_id, input.classes);
  if ("problem" in checked) throw new ToolError(checked.problem);
  const plans = booking.plans.with(index, checked.plan);
  delete state.actions.addons; // klasserna ändras: tilläggen som valts hör till de gamla
  go(state, booking.url("plan", plans));
  return `Set the plan for the ${input.trip} trip: ${planText(checked.plan, booking.fleet)}. ${plans.some((p) => p.aircraftId === null || p.seating === null) ? "The other trip still needs its plan." : "Every trip has a plan."}`;
}

async function listAddons(state: AgentState) {
  const { legs } = await readyPage(state);
  return legs
    .map((leg) => {
      const rows = leg.aircraft.classes
        .filter((c) => (leg.seating[c.id] ?? 0) > 0)
        .map((c) => `  ${c.name}: ${(leg.addons[c.id] ?? []).map((a) => `${a.name} ${formatPrice(a.price)} per piece${isBeer(a) ? " (from 18)" : ""}`).join(", ") || "none"}`);
      return `${leg.of} (${leg.aircraft.name}):\n${rows.join("\n")}`;
    })
    .join("\n");
}

// Tilläggen skrivs till formuläret som resenärernas klasser och tillägg per resa; sidan behåller dem så länge resorna, planen och antalen är desamma
async function setAddons(input: Record<string, unknown>, state: AgentState) {
  const { booking, legs } = await readyPage(state);
  const wanted = (Array.isArray(input.addons) ? input.addons : []).map((a) => ({ name: fold(String(a?.name ?? "")), count: Number(a?.count) }));
  if (wanted.some((a) => !Number.isInteger(a.count) || a.count < 0 || a.count > MAX_ADDONS)) throw new ToolError(`Give each add-on a count from 0 to ${MAX_ADDONS}.`);
  const sold = (name: string, only?: (addon: AddonOption) => boolean) => legs.some((leg) => Object.values(leg.addons).some((list) => list.some((a) => fold(a.name) === name && (only?.(a) ?? true))));
  const unknown = wanted.filter((w) => !sold(w.name));
  if (unknown.length > 0) throw new ToolError(`No such add-on in the chosen classes: ${unknown.map((u) => u.name).join(", ")}. Check with list_addons.`);
  if (!booking.beer && wanted.some((w) => w.count > 0 && sold(w.name, isBeer))) throw new ToolError("Beer has an age rule: the visitor chooses it in the form. Leave it out.");
  const passengers = Array.from({ length: booking.travellers }, (_, p) =>
    fitPassengerLegs(undefined, [], legs, p).map((passengerLeg, i) => ({
      ...passengerLeg,
      addons: Object.fromEntries(
        wanted.flatMap((w) => (legs[i].addons[passengerLeg.classId] ?? []).filter((a) => fold(a.name) === w.name && w.count > 0).map((a) => [a.id, w.count])),
      ),
    })),
  );
  state.actions.addons = { legKeys: legs.map((leg) => leg.key), passengers };
  const beer = booking.beer && wanted.some((w) => w.count > 0 && sold(w.name, isBeer));
  return `Add-ons put in the form for every traveller: ${wanted.filter((w) => w.count > 0).map((w) => `${w.count} ${w.name}`).join(", ") || "none"}. An add-on that does not exist in a traveller's class on a trip is left out there.${beer ? " Beer is for adults only: the form removes it from a traveller under 18. Warn the visitor; do not ask for ages." : ""}`;
}

async function showTravellers(state: AgentState) {
  const { booking } = await readyPage(state);
  go(state, booking.url("travellers", booking.plans));
  return `Opened the Resenärer page.\n${booking.text()}`;
}

async function showPayment(state: AgentState) {
  const { booking } = await readyPage(state);
  if (!state.valid) throw new ToolError("The traveller form is not valid yet. Tell the visitor to fill it in on the Resenärer page.");
  go(state, booking.url("payment", booking.plans));
  return `Opened the payment page.\n${booking.text()}`;
}

function setExtras(input: Record<string, unknown>, state: AgentState) {
  if (isFlightUrl(state.url)) throw new ToolError("Ordinary flights have no extras, only add-ons per class. Use set_addons.");
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

// Bokningen som den ser ut på sidan besökaren är på, med priset från databasen (R8). Totalen räknas som sidans:
// platserna och tilläggen med seatsTotal, Dåliga nerver och för charter extrasen. Tilläggen är de Agneta satte nu,
// annars de som följde med frågan (TRIP-044-R2); gäller de en annan plan räknas bara klasserna.
async function summary(state: AgentState) {
  const booking = bookingOf(await readPage(state.url, new Date()));
  if (!booking) throw new ToolError("Nothing to summarise yet: the visitor has not chosen an outbound and a return trip.");
  if (!booking.legs) throw new ToolError("Aircraft and classes are not set for both trips yet. Use list_aircraft and set_plan.");
  const flight = isFlightUrl(state.url);
  const rows = flight ? [] : extraRows(state.extras, booking.travellers);
  const chosen = state.actions.addons ?? state.choice;
  const passengers = Array.from({ length: booking.travellers }, (_, p) => ({ legs: fitPassengerLegs(chosen?.passengers[p], chosen?.legKeys ?? [], booking.legs!, p) }));
  // Dåliga nerver är inget tillägg: de kommer alltid ur kontexten, också när Agneta satte tilläggen nu
  const nerves = flight ? Math.min(state.nerves ?? 0, booking.travellers) * booking.legs.length * NERVES_PRICE : 0;
  const total = seatsTotal(booking.legs, passengers) + nerves + rows.reduce((sum, e) => sum + e.sum, 0);
  return [
    booking.text(),
    ...(flight ? [] : [`Extras: ${rows.map((e) => `${e.name} (${formatPrice(e.sum)})`).join(", ") || "none"}`]),
    `Payment method: ${PAYMENTS.find((p) => p.value === state.payment)?.label ?? "not chosen"}`,
    `Total price: ${formatPrice(total)} (seats, add-ons${flight ? ", Dåliga nerver" : " and extras"}: the same total as the page)`,
    `The traveller form is ${state.valid ? "valid" : "not valid (not filled in or wrong)"}.`,
  ].join("\n");
}

// Öppnar Min bokning (TRIP-037-R1). Bokningen slås aldrig upp här: besökaren skriver numret och namnet på sidan.
function showMyBooking(state: AgentState) {
  if (isMyBookingUrl(state.url)) return "The visitor is already on Min bokning.";
  go(state, MY_BOOKING_PATH);
  return "Opened Min bokning. The visitor types the booking number and the contact's last name in the page's fields and presses Visa min bokning. A lost number cannot be found without it.";
}

// Kryssar det besökaren vill avboka, bland delarna i utdraget som skickades med frågan (TRIP-037-R5). Det som inte går att
// avboka kryssas inte, och inget avbokas här: det gör sidans knapp. Chatten kontrollerar kryssen en gång till mot bokningen.
function tickCancellation(input: Record<string, unknown>, state: AgentState) {
  const extract = isMyBookingUrl(state.url) ? state.booking : undefined;
  if (!extract) throw new ToolError("No booking is found on the page. Tell the visitor to type the booking number and the last name in the page's fields and press Visa min bokning. You cannot look it up.");
  const wanted = Array.isArray(input.ids) ? input.ids.filter(Number.isInteger) : [];
  const parts = allParts(extract);
  const ticked = parts.filter((p) => wanted.includes(p.id) && !whyNot(p, p.group));
  const refused = parts.filter((p) => wanted.includes(p.id) && whyNot(p, p.group)).map((p) => `${p.group.label}: ${p.label} is not ticked (${whyNot(p, p.group)})`);
  const unknown = wanted.filter((id) => !parts.some((p) => p.id === id));
  if (ticked.length > 0 || wanted.length === 0) state.actions.tick = ticked.map((p) => p.id);
  const sum = ticked.reduce((total, p) => total + p.amount, 0);
  return [
    ticked.length > 0 ? `Ticked on the page: ${ticked.map((p) => `${p.label} (${p.group.label})`).join("; ")}.` : "Nothing was ticked and the boxes the visitor had ticked are unchanged.",
    ...(ticked.length > 0 ? [`A win would refund ${formatPrice(sum)}, a loss nothing. Nothing is cancelled until the visitor presses Avboka and answers Ja, avboka.`] : []),
    ...refused,
    ...(unknown.length > 0 ? [`No part has the id ${unknown.join(", ")}: use ids from the <page> block.`] : []),
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
    case "show_plan":
      return showTrip(args, state, "plan");
    case "find_airports":
      return findAirportsTool(args);
    case "find_flights":
      return findFlightsTool(args);
    case "show_flights":
      return showFlights(args, state, "results");
    case "show_flight_plan":
      return showFlights(args, state, "plan");
    case "list_aircraft":
      return listAircraft(state);
    case "set_plan":
      return setPlan(args, state);
    case "list_addons":
      return listAddons(state);
    case "set_addons":
      return setAddons(args, state);
    case "show_travellers":
      return showTravellers(state);
    case "show_payment":
      return showPayment(state);
    case "set_extras":
      return setExtras(args, state);
    case "set_payment":
      return setPayment(args, state);
    case "show_my_booking":
      return showMyBooking(state);
    case "tick_cancellation":
      return tickCancellation(args, state);
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
    ...(actions.addons ? [{ type: "addons" as const, ...actions.addons }] : []),
    ...(actions.tick ? [{ type: "tick" as const, ids: actions.tick }] : []),
    ...(actions.goto ? [{ type: "goto" as const, url: actions.goto }] : []),
  ];
}
