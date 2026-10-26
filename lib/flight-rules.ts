// Regler för sökresultaten (TRIP-010), gemensamma för webbläsaren och servern.

export type FlightAirport = { iata: string; name: string; city: string; country: string; timezone: string };

// En avgång av en rutt på ett datum. Tiden är lokal tid på avgångsflygplatsen.
// price är avgångens pris per person i hela kronor, fromPrice det billigaste
// priset med plan och klass, som visas i resultaten (TRIP-011-R9). Ruttens
// flygtid visas inte förrän ett plan valts (TRIP-011-R7).
export type Flight = {
  id: string;
  number: string;
  date: string;
  time: string;
  price: number;
  fromPrice: number;
  routeMinutes: number;
  from: FlightAirport;
  to: FlightAirport;
};

export type SortBy = "time" | "price";

// Den simulerade sökningen tar 1–4 sekunder (R3). random är ett tal 0–1, t.ex. Math.random().
export const searchDelay = (random: number) => 1000 + Math.round(random * 3000);

// Avgångskorten fylls på uppifrån: kort nummer index (0 för det översta)
// startar 60 ms efter kortet före, men bara de tio första fördröjs, så hela
// animationen tar högst ca 0,8 s hur långa listan än är (TRIP-025-R1, R2)
export const fillInDelay = (index: number) => Math.min(index, 9) * 60;

// Flygnumret, t.ex. "GF 2013": ruttens id och avgångens nummer under dagen (1, 2 …)
export const flightNumber = (routeId: number, position: number) => `GF ${routeId * 10 + position}`;

// Priset för alla resenärer
export const totalPrice = (price: number, travellers: number) => price * travellers;

// Datum och klockslag just nu i en tidszon: { date: "2026-11-13", time: "14:05" }
export function localNow(timeZone: string, now: Date) {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-CA", {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    })
      .formatToParts(now)
      .map((p) => [p.type, p.value]),
  );
  return { date: `${parts.year}-${parts.month}-${parts.day}`, time: `${parts.hour}:${parts.minute}` };
}

// Har avgången redan gått? now är lokal tid på avgångsflygplatsen (localNow).
export function hasLeft(flight: Pick<Flight, "date" | "time">, now: { date: string; time: string }) {
  return flight.date < now.date || (flight.date === now.date && flight.time <= now.time);
}

// Tidigast först, eller billigast först (samma pris: tidigast först)
export function sortFlights(flights: Flight[], by: SortBy) {
  return flights.toSorted((a, b) => (by === "price" && a.fromPrice - b.fromPrice) || a.time.localeCompare(b.time));
}
