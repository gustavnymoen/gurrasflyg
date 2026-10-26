// Regler för Min bokning (TRIP-023), gemensamma för webbläsaren och servern:
// bokningsnumret, 24-timmarsregeln, lotteriet, beloppen och vad som går att
// kryssa. Servern kontrollerar allt igen mot databasen.

import type { Contact } from "./booking-rules";
import type { CharterTrip } from "./charter-rules";

export const MY_BOOKING_PATH = "/min-bokning";

// ---------------------------------------------------------------- Bokningsnumret

// Sex tecken för ett flyg (K7M2QX) och CH- plus sex för en charter (R2)
const FLIGHT_NUMBER = /^[A-Z0-9]{6}$/;
const CHARTER_NUMBER = /^CH-[A-Z0-9]{6}$/;

// Det besökaren skrev, utan mellanrum runt och med stora bokstäver (R2)
export const normalizeBookingNumber = (text: string) => text.trim().toUpperCase();

// Vilken sorts bokning numret kan vara, eller null om det inte har någon av formerna
export function bookingKind(number: string): "flight" | "charter" | null {
  if (CHARTER_NUMBER.test(number)) return "charter";
  return FLIGHT_NUMBER.test(number) ? "flight" : null;
}

// Är efternamnen samma, oavsett stora och små bokstäver och mellanrum runt (R2)?
export const sameLastName = (a: string, b: string) => a.trim().toLocaleLowerCase("sv") === b.trim().toLocaleLowerCase("sv");

// ---------------------------------------------------------------- 24 timmar och lotteriet

export const CANCEL_HOURS = 24;
export const TOO_LATE_TEXT = "Det är för sent att avboka";

// Går det att avboka ett flyg som avgår vid departsAt (millisekunder sedan 1970)?
// Bara när det är mer än 24 timmar kvar; ett som avgår om exakt 24 timmar, eller
// redan har avgått, går inte (R8).
export const canCancel = (departsAt: number, now: Date) => departsAt - now.getTime() > CANCEL_HOURS * 3_600_000;

// Lotteriet: random är ett tal från 0 till under 1, och hälften av dem vinner (R10)
export const winsLottery = (random: number) => random < 0.5;

// ---------------------------------------------------------------- Det som visas

// En avbokning med utfallet av lotteriet (R10, R11). at är tiden som text, redan i svensk tid.
export type Cancellation = { id: number; at: string; won: boolean; amount: number; refunded: number };

type Booking = {
  bookingNumber: string;
  contact: Contact;
  payment: string;
  total: number;
  cancellations: Cancellation[];
};

export type BookedSeat = {
  id: number;
  passengerId: number;
  className: string;
  price: number;
  addons: { name: string; count: number; price: number }[];
  cancelled: boolean;
};

export type BookedFlight = {
  id: number;
  title: string;
  // "utresan" eller "hemresan"
  of: string;
  date: string;
  time: string;
  from: { iata: string; city: string; timezone: string };
  to: { iata: string; city: string; timezone: string };
  aircraft: string;
  minutes: number;
  arrival: { time: string; days: number };
  // Avgår om 24 timmar eller mindre, eller har gått (R8)
  late: boolean;
  seats: BookedSeat[];
};

export type FlightBooking = Booking & {
  kind: "flight";
  passengers: { id: number; name: string; age: number }[];
  flights: BookedFlight[];
};

export type BookedPassenger = { id: number; name: string; age: number; amount: number; cancelled: boolean };

export type CharterBooking = Booking & {
  kind: "charter";
  destination: string;
  trips: { title: string; trip: CharterTrip }[];
  late: boolean;
  passengers: BookedPassenger[];
  extras: { name: string; price: number }[];
};

export type MyBooking = FlightBooking | CharterBooking;

// ---------------------------------------------------------------- Beloppen

// Vad en plats är värd: platsen och dess tillägg (R6)
export const seatAmount = (seat: Pick<BookedSeat, "price" | "addons">) =>
  seat.price + seat.addons.reduce((sum, a) => sum + a.price * a.count, 0);

// Vad en charterresenär är värd: ut- och hemresan och tilläggen, alla per person (R7)
export const travellerAmount = (tripPrices: number[], extraPrices: number[]) =>
  [...tripPrices, ...extraPrices].reduce((sum, price) => sum + price, 0);

export const refundedTotal = (cancellations: Cancellation[]) => cancellations.reduce((sum, c) => sum + c.refunded, 0);

// Det som är kvar att betala: totalen minus det som har betalats tillbaka (R4)
export const leftToPay = (booking: Pick<Booking, "total" | "cancellations">) =>
  booking.total - refundedTotal(booking.cancellations);

// ---------------------------------------------------------------- Kryssrutorna

// Platserna på ett flyg som går att kryssa: inte avbokade, och flyget inte för sent (R6, R8)
export const tickableSeats = (flight: BookedFlight) => (flight.late ? [] : flight.seats.filter((s) => !s.cancelled));

// Alla platser eller resenärer i en grupp, t.ex. ett flyg, är kryssade, några, eller ingen
export function groupState(selected: ReadonlySet<number>, ids: number[]): "all" | "some" | "none" {
  const count = ids.filter((id) => selected.has(id)).length;
  if (count === 0) return "none";
  return count === ids.length ? "all" : "some";
}

// Kryssar en grupp: är alla redan kryssade tas de bort, annars kryssas alla (R6, R7)
export function toggleGroup(selected: ReadonlySet<number>, ids: number[]) {
  const next = new Set(selected);
  const all = ids.every((id) => selected.has(id));
  for (const id of ids) {
    if (all) next.delete(id);
    else next.add(id);
  }
  return next;
}

// Kryssar en ruta
export const toggleOne = (selected: ReadonlySet<number>, id: number) => toggleGroup(selected, [id]);

// Har flyget inga platser kvar att avboka (R6)? Det visas då som avbokat.
export const flightCancelled = (flight: BookedFlight) => flight.seats.every((s) => s.cancelled);

// Är hela bokningen avbokad (R6, R7, R11)?
export const bookingCancelled = (booking: MyBooking) =>
  booking.kind === "flight" ? booking.flights.every(flightCancelled) : booking.passengers.every((p) => p.cancelled);

// Vad som är kryssat och vad det är värt, för beskedet före knappen och för frågan (R9).
// Den som vinner får summan tillbaka; den som förlorar betalar ändå.
export type Selection = { lines: string[]; amount: number };

export function flightSelection(booking: FlightBooking, selected: ReadonlySet<number>): Selection {
  const lines: string[] = [];
  let amount = 0;
  for (const flight of booking.flights) {
    for (const seat of flight.seats.filter((s) => selected.has(s.id))) {
      const passenger = booking.passengers.find((p) => p.id === seat.passengerId);
      lines.push(`${flight.title}: ${passenger?.name ?? ""}`);
      amount += seatAmount(seat);
    }
  }
  return { lines, amount };
}

export function charterSelection(booking: CharterBooking, selected: ReadonlySet<number>): Selection {
  const chosen = booking.passengers.filter((p) => selected.has(p.id));
  return { lines: chosen.map((p) => p.name), amount: chosen.reduce((sum, p) => sum + p.amount, 0) };
}
