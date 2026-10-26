import "server-only";
import { randomInt } from "node:crypto";
import type { Transaction } from "@libsql/client";
import {
  type BookingForm,
  type BookingLeg,
  bookingLegs,
  bookingTotal,
  chosenAddons,
  fitsTrip,
  NERVES,
  NERVES_PRICE,
  paymentProblems,
  seatPrice,
  travellerProblems,
} from "./booking-rules";
import { get, run, withTransaction } from "./db";
import { hasLeft, localNow } from "./flight-rules";
import { readAddons, readFleet } from "./flights";
import type { Search } from "./search";
import type { LegChoice } from "./trip";

// Det som skickas när besökaren trycker Betala: sökningen och valen från
// adressen och formuläret. Inget av det är kontrollerat än.
export type BookingRequest = { search: Search; legs: LegChoice[]; form: BookingForm };

// Fel som beror på vad besökaren valt eller på att något ändrats sedan dess,
// och som kan visas för besökaren
export class BookingError extends Error {}

export const CHANGED =
  "Något i resan har ändrats sedan du valde den. Gå tillbaka till Plan och klass och välj igen.";
const INVALID = "Bokningen gick inte att spara. Gå tillbaka till Resenärer och kontrollera uppgifterna.";

// Sparar bokningen och returnerar bokningsnumret och flygen den gäller (R8).
// Allt kontrolleras och alla priser räknas här, i transaktionen, från
// databasen: ändrar admin något samtidigt sparas antingen hela bokningen med
// det som gällde, eller inget. Samma request_id igen (två tryck på Betala)
// ger den bokning som redan finns.
export async function createBooking(request: BookingRequest, now = new Date()) {
  const { search, legs, form } = request;
  return withTransaction(async (tx) => {
    const existing = await get<{ bookingNumber: string }>(
      "SELECT booking_number AS bookingNumber FROM bookings WHERE request_id = ?",
      [typeof form?.requestId === "string" ? form.requestId : ""],
      tx,
    );

    const departures = [];
    for (const [i, leg] of legs.entries()) departures.push(await readDeparture(search, i, leg.time, now, tx));
    const fleet = await readFleet(tx);
    const addons = await readAddons(
      legs.flatMap((leg) => (leg.aircraftId === null ? [] : [leg.aircraftId])),
      tx,
    );
    const booked =
      departures.every((d) => d !== undefined) &&
      bookingLegs(
        search,
        legs,
        departures.map((d) => d!.price),
        fleet,
        addons,
      );
    if (!booked) throw new BookingError(CHANGED);
    const valid =
      fitsTrip(form, booked, search.travellers) &&
      Object.keys({ ...travellerProblems(form, booked), ...paymentProblems(form) }).length === 0;
    if (!valid) throw new BookingError(INVALID);
    if (existing) return { bookingNumber: existing.bookingNumber, legs: booked };

    const bookingNumber = await newBookingNumber(tx);
    const { contact } = form;
    const { lastId: bookingId } = await run(
      `INSERT INTO bookings (booking_number, request_id, first_name, last_name, email, phone, address, payment, total)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        bookingNumber,
        form.requestId,
        contact.firstName.trim(),
        contact.lastName.trim(),
        contact.email.trim(),
        contact.phone.trim(),
        contact.address.trim(),
        form.payment,
        bookingTotal(form, booked),
      ],
      tx,
    );
    const passengerIds = [];
    for (const [position, p] of form.passengers.entries()) {
      const { lastId } = await run(
        "INSERT INTO booking_passengers (booking_id, position, first_name, last_name, age) VALUES (?, ?, ?, ?, ?)",
        [bookingId, position, p.firstName.trim(), p.lastName.trim(), Number(p.age)],
        tx,
      );
      passengerIds.push(lastId);
    }
    for (const [i, leg] of booked.entries()) {
      await saveLeg(tx, bookingId, i, leg, departures[i]!.routeId, legDate(search, i), legs[i].time, form, passengerIds);
    }
    return { bookingNumber, legs: booked };
  });
}

async function saveLeg(
  tx: Transaction,
  bookingId: number,
  position: number,
  leg: BookingLeg,
  routeId: number,
  date: string,
  time: string,
  form: BookingForm,
  passengerIds: number[],
) {
  const { lastId: flightId } = await run(
    `INSERT INTO booking_flights (booking_id, position, route_id, date, departure_time, aircraft_id, price)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [bookingId, position, routeId, date, time, leg.aircraft.id, leg.price],
    tx,
  );
  for (const [p, passenger] of form.passengers.entries()) {
    const passengerLeg = passenger.legs[position];
    const { lastId: seatId } = await run(
      "INSERT INTO booking_seats (booking_flight_id, passenger_id, class_id, price) VALUES (?, ?, ?, ?)",
      [flightId, passengerIds[p], passengerLeg.classId, seatPrice(leg, passengerLeg.classId)],
      tx,
    );
    // [addon_id, name, count, price]; Dåliga nerver har inget addon_id
    const addons: [number | null, string, number, number][] = chosenAddons(leg, passengerLeg).map(
      ({ addon, count }) => [addon.id, addon.name, count, addon.price],
    );
    if (passenger.nerves) addons.push([null, NERVES, 1, NERVES_PRICE]);
    for (const addon of addons) {
      await run(
        "INSERT INTO booking_addons (booking_seat_id, addon_id, name, count, price) VALUES (?, ?, ?, ?, ?)",
        [seatId, ...addon],
        tx,
      );
    }
  }
}

// Utresan går från sökningens flygplats på utresedagen, hemresan tillbaka på hemresedagen
const legDate = (search: Search, i: number) => (i === 0 ? search.outbound : search.return!);

// En avgång på rutten för ett flyg i sökningen, om den finns och inte har gått
async function readDeparture(search: Search, i: number, time: string, now: Date, tx: Transaction) {
  const [from, to] = i === 0 ? [search.from, search.to] : [search.to, search.from];
  const departure = await get<{ routeId: number; price: number; timezone: string }>(
    `SELECT r.id AS routeId, d.price, f.timezone
     FROM routes r
     JOIN airports f ON f.id = r.from_airport_id
     JOIN airports t ON t.id = r.to_airport_id
     JOIN route_departures d ON d.route_id = r.id
     WHERE f.iata = ? AND t.iata = ? AND d.departure_time = ?`,
    [from, to, time],
    tx,
  );
  if (!departure || (i === 1 && !search.return)) return undefined;
  return hasLeft({ date: legDate(search, i), time }, localNow(departure.timezone, now)) ? undefined : departure;
}

// Sex tecken, utan lätt förväxlade tecken som 0/O och 1/I
export function randomBookingCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from({ length: 6 }, () => chars[randomInt(chars.length)]).join("");
}

async function newBookingNumber(tx: Transaction) {
  for (;;) {
    const number = randomBookingCode();
    if (!(await get("SELECT 1 FROM bookings WHERE booking_number = ?", [number], tx))) {
      return number;
    }
  }
}
