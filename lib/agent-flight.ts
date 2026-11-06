import "server-only";
import { type BookingLeg, bookingLegs } from "./booking-rules";
import { bookableRange, dateError, fromDateString } from "./dates";
import { aircraftOptions, classOptions, type FleetAircraft } from "./fare-rules";
import { findFlights, getAirportPair, listFleet, readAddons } from "./flights";
import { type Flight, localNow } from "./flight-rules";
import { formatDuration, formatPrice } from "./format";
import { type Params, parseSearch, type Search } from "./search";
import { checkChoice, LEG_NAMES, type LegChoice, parsePlan, type PlanChoice } from "./trip";

// Flygen i agentläget (TRIP-036): sidan under /flyg läst med flygflödets egna regler, på samma sätt som
// readCharter läser charterns. Adressen litar ingen på: flygen och planen kontrolleras mot databasen.

// Datumen räknas i Sverige, som sajtens datumväljare gör
const HOME_TIMEZONE = "Europe/Stockholm";

export type FlightData = {
  search: Search;
  // Flygen på sökningens datum; back är null för en enkel resa
  out: Flight[];
  back: Flight[] | null;
  // De valda flygen, ett för en enkel resa och två för tur och retur (undefined = inte valt än), och planen för var och ett,
  // kontrollerad mot planen och resenärerna
  flights: (Flight | undefined)[];
  plans: PlanChoice[];
  fleet: FleetAircraft[];
  // Flygen med plan, klasser och tillägg, när alla flyg är valda och alla resenärer har en klass på varje
  legs: BookingLeg[] | null;
};

const NO_PLAN: PlanChoice = { aircraftId: null, seating: null };

export async function readFlight(params: Params, now: Date): Promise<FlightData | null> {
  const search = parseSearch(params);
  const [airports, fleet] = search ? await Promise.all([getAirportPair(search.from, search.to), listFleet()]) : [];
  if (!search || !airports || !fleet) return null;
  const [out, back] = await Promise.all([
    findFlights(search.from, search.to, search.outbound, search.travellers, fleet, now),
    search.return ? findFlights(search.to, search.from, search.return, search.travellers, fleet, now) : null,
  ]);
  const time = (name: string) => (typeof params[name] === "string" ? params[name] : undefined);
  const flights = [out.find((f) => f.time === time("ut")), back?.find((f) => f.time === time("hem"))].slice(0, back ? 2 : 1);
  const plans = flights.map((f, i) => (f ? checkChoice(parsePlan(params, LEG_NAMES[i].key), fleet, search.travellers) : NO_PLAN));
  const data = { search, out, back, flights, plans, fleet };
  const choices = chosenLegs(data);
  const ids = plans.flatMap((plan) => (plan.aircraftId === null ? [] : [plan.aircraftId]));
  const legs = choices ? bookingLegs(search, choices, flights.map((f) => f!.price), fleet, await readAddons(ids)) : null;
  return { ...data, legs };
}

// Flygen med de valda tiderna och planen, för att bygga nästa adress; null om något flyg inte är valt
export function chosenLegs({ flights, plans }: Pick<FlightData, "flights" | "plans">): LegChoice[] | null {
  return flights.every((f) => f !== undefined) ? flights.map((f, i) => ({ time: f!.time, ...plans[i] })) : null;
}

// Datumen går att boka (samma regler som sökformuläret), annars en text till modellen
export function flightDatesProblem(search: Search, now: Date) {
  const range = bookableRange(fromDateString(localNow(HOME_TIMEZONE, now).date));
  return dateError(search.outbound, range) ?? (search.return ? dateError(search.return, range, search.outbound) : null);
}

// Ett flyg på en rad, med det sidan visar: dag, tid, rutt och priset "från" per person
export const flightLine = (f: Flight) =>
  `${f.time}: ${f.number}, ${f.date} ${f.time} ${f.from.iata} ${f.from.city} to ${f.to.iata} ${f.to.city}, from ${formatPrice(f.fromPrice)} per person`;

// Planen med plats för alla resenärer på ett flyg: flygtid, ankomst, pris per klass och jämförelsen med de andra
// (aircraftOptions och classOptions, som planeringssidan). Billigast först.
export function flightAircraftText(fleet: FleetAircraft[], flight: Flight, travellers: number) {
  const rows = aircraftOptions(fleet, flight, travellers).map((o) => {
    const arrives = `${o.arrival.time}${o.arrival.days > 0 ? ` (+${o.arrival.days} day)` : ""}`;
    const classes = classOptions(o.aircraft, flight.price).map(
      ({ cabinClass: c, price, priceDiff }) => `class ${c.id} ${c.name} (room for ${c.capacity}) ${formatPrice(price)} per person${priceDiff > 0 ? ` (+${formatPrice(priceDiff)} on the cheapest class)` : ""}`,
    );
    const notes = [o.cheapest && "cheapest", o.fastest && "fastest", !o.cheapest && `+${formatPrice(o.priceDiff)} on the cheapest aircraft`, !o.fastest && `+${formatDuration(o.timeDiff)} on the fastest`].filter(Boolean);
    return `- aircraft ${o.aircraft.id} ${o.aircraft.name}: flight time ${formatDuration(o.minutes)}, lands ${arrives} local time; ${classes.join("; ")}; ${notes.join(", ")}`;
  });
  return rows.length > 0 ? rows.join("\n") : "- none: no aircraft seats this many travellers";
}
