// Regler för att välja plan och klasser (TRIP-011), gemensamma för webbläsaren och servern.
// Faktorerna är procent som heltal: 120 = 1,20 (db/migrations/008_factors.sql).

import { type Flight, localNow } from "./flight-rules";

export type FleetClass = { id: number; name: string; capacity: number; pricePercent: number };

// Ett plan med sina klasser, billigaste klassen först
export type FleetAircraft = {
  id: number;
  name: string;
  pricePercent: number;
  timePercent: number;
  classes: FleetClass[];
};

// Antal resenärer per klass: { klassens id: antal }
export type Seating = Record<number, number>;

// Priset per person i en klass på ett plan, i hela kronor (R4)
export const fare = (price: number, aircraftPercent: number, classPercent: number) =>
  Math.round((price * aircraftPercent * classPercent) / 10_000);

// Flygtiden med ett plan, i hela minuter och minst 1 (R7)
export const flightMinutes = (routeMinutes: number, timePercent: number) =>
  Math.max(1, Math.round((routeMinutes * timePercent) / 100));

export const totalSeats = (aircraft: FleetAircraft) => aircraft.classes.reduce((sum, c) => sum + c.capacity, 0);

// Planet går att välja om alla resenärer får plats; andra bokningar spelar ingen roll (R2)
export const canSeat = (aircraft: FleetAircraft, travellers: number) => totalSeats(aircraft) >= travellers;

const cheapestClass = (aircraft: FleetAircraft) =>
  aircraft.classes.reduce((a, b) => (b.pricePercent < a.pricePercent ? b : a));

// Det som behövs av ett flyg för att räkna pris och tid med ett plan: avgången
// (lokal tid på avgångsflygplatsen), avgångens pris per person och ruttens
// flygtid, och flygplatsernas tidszoner. Ett Flight duger.
export type Leg = Pick<Flight, "date" | "time" | "price" | "routeMinutes"> & {
  from: { timezone: string };
  to: { timezone: string };
};

// Ankomsten i lokal tid på ankomstflygplatsen, och hur många dagar efter
// avgångsdagen den är (1 = "+1")
export function arrival(leg: Omit<Leg, "price" | "routeMinutes">, minutes: number) {
  const departs = instant(leg.date, leg.time, leg.from.timezone);
  const lands = localNow(leg.to.timezone, new Date(departs + minutes * 60_000));
  const days = Math.round((Date.parse(lands.date) - Date.parse(leg.date)) / 86_400_000);
  return { time: lands.time, days };
}

// Tidpunkten (millisekunder, UTC) för en lokal tid i en tidszon. Första
// gissningen läser tiden som UTC; skillnaden mot den lokala tiden där är
// tidszonens förskjutning. Två varv, så att sommartid räknas rätt.
function instant(date: string, time: string, timeZone: string) {
  const asUtc = Date.parse(`${date}T${time}:00Z`);
  const offset = (ms: number) => {
    const local = localNow(timeZone, new Date(ms));
    return Date.parse(`${local.date}T${local.time}:00Z`) - ms;
  };
  return asUtc - offset(asUtc - offset(asUtc));
}

export type AircraftOption = {
  aircraft: FleetAircraft;
  selectable: boolean;
  // Per person i planets billigaste klass
  price: number;
  minutes: number;
  arrival: { time: string; days: number };
  // Skillnaden mot det billigaste och det snabbaste planet som går att välja
  priceDiff: number;
  timeDiff: number;
  cheapest: boolean;
  fastest: boolean;
};

// Planen för ett flyg (R2, R7): de som går att välja först, billigast först
export function aircraftOptions(fleet: FleetAircraft[], leg: Leg, travellers: number): AircraftOption[] {
  const options = fleet.map((aircraft) => {
    const minutes = flightMinutes(leg.routeMinutes, aircraft.timePercent);
    return {
      aircraft,
      selectable: canSeat(aircraft, travellers),
      price: fare(leg.price, aircraft.pricePercent, cheapestClass(aircraft).pricePercent),
      minutes,
      arrival: arrival(leg, minutes),
    };
  });
  const selectable = options.filter((o) => o.selectable);
  const lowestPrice = Math.min(...selectable.map((o) => o.price));
  const shortest = Math.min(...selectable.map((o) => o.minutes));
  return options
    .map((o) => ({
      ...o,
      // Ett plan som inte går att välja jämförs inte (och finns inget att välja är minimum Infinity)
      priceDiff: o.selectable ? o.price - lowestPrice : 0,
      timeDiff: o.selectable ? o.minutes - shortest : 0,
      cheapest: o.selectable && o.price === lowestPrice,
      fastest: o.selectable && o.minutes === shortest,
    }))
    .toSorted(
      (a, b) =>
        Number(b.selectable) - Number(a.selectable) ||
        a.price - b.price ||
        a.aircraft.name.localeCompare(b.aircraft.name, "sv"),
    );
}

// Klasserna på ett plan med pris per person och skillnaden mot den billigaste (R3)
export function classOptions(aircraft: FleetAircraft, price: number) {
  const prices = aircraft.classes.map((c) => fare(price, aircraft.pricePercent, c.pricePercent));
  const lowest = Math.min(...prices);
  return aircraft.classes.map((c, i) => ({ cabinClass: c, price: prices[i], priceDiff: prices[i] - lowest }));
}

// Från början sitter alla i den billigaste klassen som har plats för alla,
// eller ingen om ingen klass har det (R3)
export function defaultSeating(aircraft: FleetAircraft, travellers: number): Seating {
  const fits = aircraft.classes.filter((c) => c.capacity >= travellers);
  if (fits.length === 0) return {};
  return { [cheapestClass({ ...aircraft, classes: fits }).id]: travellers };
}

export const placed = (seating: Seating) => Object.values(seating).reduce((sum, n) => sum + n, 0);

// Går det att lägga till en resenär i klassen? Inte fler än platserna, och
// inte fler än resenärerna sammanlagt (R3)
export const canAdd = (cabinClass: FleetClass, seating: Seating, travellers: number) =>
  (seating[cabinClass.id] ?? 0) < cabinClass.capacity && placed(seating) < travellers;

// Vad besökaren behöver göra när antalen inte går ihop, eller null (R3)
export function seatingProblem(seating: Seating, travellers: number) {
  const missing = travellers - placed(seating);
  if (missing > 0) {
    return missing === 1
      ? "1 resenär har ingen klass. Lägg till den i en klass."
      : `${missing} resenärer har ingen klass. Lägg till dem i en klass.`;
  }
  if (missing < 0) return "Det är fler resenärer i klasserna än i sökningen. Ta bort några.";
  return null;
}

// Är antalen per klass möjliga på planet? Klasser som planet inte har, för
// många i en klass eller fler än resenärerna räknas inte (t.ex. en ändrad adress).
export function validSeating(aircraft: FleetAircraft, seating: Seating, travellers: number) {
  const ids = Object.keys(seating).map(Number);
  return (
    placed(seating) <= travellers &&
    ids.every((id) => {
      const c = aircraft.classes.find((x) => x.id === id);
      return c !== undefined && Number.isInteger(seating[id]) && seating[id] >= 0 && seating[id] <= c.capacity;
    })
  );
}

// Priset för ett flyg: varje klass pris gånger antalet i den (R4)
export function legTotal(aircraft: FleetAircraft, price: number, seating: Seating) {
  return classOptions(aircraft, price).reduce((sum, o) => sum + o.price * (seating[o.cabinClass.id] ?? 0), 0);
}

// Det lägsta priset per person bland planen som har plats för alla, i
// planets billigaste klass: "från"-priset i sökresultaten (R9). null om
// inget plan har plats.
export function cheapestFare(fleet: FleetAircraft[], travellers: number, price: number): number | null {
  const fares = fleet
    .filter((a) => canSeat(a, travellers))
    .map((a) => fare(price, a.pricePercent, cheapestClass(a).pricePercent));
  return fares.length > 0 ? Math.min(...fares) : null;
}
