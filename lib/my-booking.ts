import "server-only";
import { randomInt } from "node:crypto";
import { PAYMENTS } from "./booking-rules";
import {
  type BookedFlight,
  type BookedSeat,
  bookingKind,
  type CharterBooking,
  type Cancellation,
  canCancel,
  type FlightBooking,
  type MyBooking,
  normalizeBookingNumber,
  sameLastName,
  seatAmount,
  travellerAmount,
  winsLottery,
} from "./cancel-rules";
import { readTimetables } from "./charter";
import { makeTrip, TRIP_NAMES } from "./charter-rules";
import { all, constraintKind, type Executor, get, run, withTransaction } from "./db";
import { arrival, flightMinutes, instant } from "./fare-rules";
import { clearLoginAttempts, registerLoginAttempt } from "./login-limit";
import { LEG_NAMES } from "./trip";

// Det besökaren skriver för att hitta sin bokning (R2)
export type Credentials = { bookingNumber: string; lastName: string };

export const NOT_FOUND = "Vi hittar ingen bokning med de uppgifterna.";

// Fel som beror på vad besökaren valt eller på att något ändrats sedan dess,
// och som kan visas för besökaren (R12)
export class CancelError extends Error {}

// Svaret på ett uppslag eller en avbokning: bokningen, att adressen är låst
// (R3), att uppgifterna inte stämmer (R2), eller vad som gick fel (R12)
export type Outcome<T> = T | { locked: { minutesLeft: number } } | { notFound: true } | { error: string };

// Gissningar räknas per adress, skilt från inloggningen i admin. Nyckeln
// börjar med "uppslag:" och kan därför aldrig vara samma som en IP-adress.
const limitKey = (ip: string) => `uppslag:${ip}`;

// Hittar bokningen (id och sort) som har numret och kontaktpersonens efternamn.
// Numret och efternamnet ger samma svar, null, när något av dem inte stämmer (R2).
type Found = { kind: "flight" | "charter"; id: number };

async function findBooking({ bookingNumber, lastName }: Credentials, ex?: Executor): Promise<Found | null> {
  const number = normalizeBookingNumber(typeof bookingNumber === "string" ? bookingNumber : "");
  const kind = bookingKind(number);
  if (!kind || typeof lastName !== "string") return null;
  const table = kind === "flight" ? "bookings" : "charter_bookings";
  const row = await get<{ id: number; lastName: string }>(
    `SELECT id, last_name AS lastName FROM ${table} WHERE booking_number = ?`, // nosemgrep: semgrep.sql-built-from-text
    [number],
    ex,
  );
  return row !== undefined && sameLastName(row.lastName, lastName) ? { kind, id: row.id } : null;
}

// Räknar försöket och säger om adressen är låst (R3). Som inloggningen i admin räknas försöket
// innan uppgifterna kontrolleras, så att många försök på en gång inte slinker förbi gränsen.
async function checkCredentials(
  ip: string,
  credentials: Credentials,
  now: Date,
): Promise<{ found: Found } | { locked: { minutesLeft: number } } | { notFound: true }> {
  const locked = await registerLoginAttempt(limitKey(ip), now.getTime());
  if (locked) return { locked };
  const found = await findBooking(credentials);
  if (!found) return { notFound: true };
  await clearLoginAttempts(limitKey(ip));
  return { found };
}

// Slår upp en bokning på bokningsnummer och efternamn (R2, R3)
export async function lookUpBooking(ip: string, credentials: Credentials, now = new Date()): Promise<Outcome<{ booking: MyBooking }>> {
  const checked = await checkCredentials(ip, credentials, now);
  if (!("found" in checked)) return checked;
  return { booking: await readBooking(checked.found, now) };
}

const readBooking = ({ kind, id }: Found, now: Date, ex?: Executor) =>
  kind === "flight" ? readFlightBooking(id, now, ex) : readCharterBooking(id, now, ex);

// ---------------------------------------------------------------- Läsa en bokning

const stockholmTime = new Intl.DateTimeFormat("sv-SE", {
  timeZone: "Europe/Stockholm",
  day: "numeric",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
});

type CancellationRow = { id: number; at: string; won: number; amount: number; refunded: number };

// Avbokningarna med tiden i svensk tid ("26 okt 14:30"); databasen har UTC
const toCancellations = (rows: CancellationRow[]): Cancellation[] =>
  rows.map((r) => ({
    ...r,
    won: r.won === 1,
    at: stockholmTime.format(new Date(`${r.at.replace(" ", "T")}Z`)),
  }));

const paymentLabel = (payment: string) => PAYMENTS.find((p) => p.value === payment)?.label ?? "";

type Header = {
  bookingNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  payment: string;
  total: number;
};

const contactOf = (h: Header) => ({
  firstName: h.firstName,
  lastName: h.lastName,
  email: h.email,
  phone: h.phone,
  address: h.address,
});

// Hela flygbokningen som den visas: flyg med platser, tillägg och avbokningar. Räknas från
// databasen varje gång, så att "för sent" och "avbokad" alltid stämmer (R4, R6, R8).
export async function readFlightBooking(id: number, now: Date, ex?: Executor): Promise<FlightBooking> {
  // Efter varandra, inte samtidigt: en transaktion kör en fråga i taget
  const header = (await get<Header>(
    `SELECT booking_number AS bookingNumber, first_name AS firstName, last_name AS lastName, email, phone, address, payment, total
     FROM bookings WHERE id = ?`,
    [id],
    ex,
  ))!;
  const passengers = await all<{ id: number; firstName: string; lastName: string; age: number }>(
    "SELECT id, first_name AS firstName, last_name AS lastName, age FROM booking_passengers WHERE booking_id = ? ORDER BY position",
    [id],
    ex,
  );
  const flights = await all<{
    id: number;
    position: number;
    date: string;
    time: string;
    routeMinutes: number;
    timePercent: number;
    aircraft: string;
    fromIata: string;
    fromCity: string;
    fromTimezone: string;
    toIata: string;
    toCity: string;
    toTimezone: string;
  }>(
    `SELECT bf.id, bf.position, bf.date, bf.departure_time AS time, r.duration_minutes AS routeMinutes,
            a.time_percent AS timePercent, a.name AS aircraft,
            f.iata AS fromIata, f.city AS fromCity, f.timezone AS fromTimezone,
            t.iata AS toIata, t.city AS toCity, t.timezone AS toTimezone
     FROM booking_flights bf
     JOIN routes r ON r.id = bf.route_id
     JOIN airports f ON f.id = r.from_airport_id
     JOIN airports t ON t.id = r.to_airport_id
     JOIN aircraft a ON a.id = bf.aircraft_id
     WHERE bf.booking_id = ?
     ORDER BY bf.position`,
    [id],
    ex,
  );
  const seats = await all<{
    id: number;
    flightId: number;
    passengerId: number;
    className: string;
    price: number;
    cancellationId: number | null;
  }>(
    `SELECT s.id, s.booking_flight_id AS flightId, s.passenger_id AS passengerId, c.name AS className,
            s.price, s.cancellation_id AS cancellationId
     FROM booking_seats s
     JOIN booking_flights bf ON bf.id = s.booking_flight_id
     JOIN booking_passengers p ON p.id = s.passenger_id
     JOIN classes c ON c.id = s.class_id
     WHERE bf.booking_id = ?
     ORDER BY p.position`,
    [id],
    ex,
  );
  const addons = await all<{ seatId: number; name: string; count: number; price: number }>(
    `SELECT ba.booking_seat_id AS seatId, ba.name, ba.count, ba.price
     FROM booking_addons ba
     JOIN booking_seats s ON s.id = ba.booking_seat_id
     JOIN booking_flights bf ON bf.id = s.booking_flight_id
     WHERE bf.booking_id = ?
     ORDER BY ba.id`,
    [id],
    ex,
  );
  const cancellations = await all<CancellationRow>(
    "SELECT id, cancelled_at AS at, won, amount, refunded FROM booking_cancellations WHERE booking_id = ? ORDER BY id",
    [id],
    ex,
  );

  const seatsOf = (flightId: number): BookedSeat[] =>
    seats
      .filter((s) => s.flightId === flightId)
      .map((s) => ({
        id: s.id,
        passengerId: s.passengerId,
        className: s.className,
        price: s.price,
        addons: addons.filter((a) => a.seatId === s.id).map(({ name, count, price }) => ({ name, count, price })),
        cancelled: s.cancellationId !== null,
      }));
  const booked = flights.map((f): BookedFlight => {
    const from = { iata: f.fromIata, city: f.fromCity, timezone: f.fromTimezone };
    const to = { iata: f.toIata, city: f.toCity, timezone: f.toTimezone };
    const minutes = flightMinutes(f.routeMinutes, f.timePercent);
    return {
      id: f.id,
      title: LEG_NAMES[f.position].title,
      of: LEG_NAMES[f.position].of,
      date: f.date,
      time: f.time,
      from,
      to,
      aircraft: f.aircraft,
      minutes,
      arrival: arrival({ date: f.date, time: f.time, from, to }, minutes),
      late: !canCancel(instant(f.date, f.time, f.fromTimezone), now),
      seats: seatsOf(f.id),
    };
  });
  return {
    kind: "flight",
    bookingNumber: header.bookingNumber,
    contact: contactOf(header),
    payment: paymentLabel(header.payment),
    total: header.total,
    cancellations: toCancellations(cancellations),
    passengers: passengers.map((p) => ({ id: p.id, name: `${p.firstName} ${p.lastName}`, age: p.age })),
    flights: booked,
  };
}

// Hela charterbokningen som den visas (R5, R7, R8)
export async function readCharterBooking(id: number, now: Date, ex?: Executor): Promise<CharterBooking> {
  const header = (await get<Header & { destination: string }>(
    `SELECT b.booking_number AS bookingNumber, b.first_name AS firstName, b.last_name AS lastName, b.email, b.phone,
            b.address, b.payment, b.total, d.title AS destination
     FROM charter_bookings b JOIN destinations d ON d.id = b.destination_id
     WHERE b.id = ?`,
    [id],
    ex,
  ))!;
  const passengers = await all<{ id: number; firstName: string; lastName: string; age: number; cancellationId: number | null }>(
    `SELECT id, first_name AS firstName, last_name AS lastName, age, cancellation_id AS cancellationId
     FROM charter_booking_passengers WHERE booking_id = ? ORDER BY position`,
    [id],
    ex,
  );
  const tripRows = await all<{ timetableId: string; date: string; price: number; from: string; to: string }>(
    `SELECT bt.timetable_id AS timetableId, bt.date, bt.price, t.from_airport AS "from", t.to_airport AS "to"
     FROM charter_booking_trips bt JOIN charter_timetables t ON t.id = bt.timetable_id
     WHERE bt.booking_id = ? ORDER BY bt.position`,
    [id],
    ex,
  );
  const extras = await all<{ name: string; price: number }>(
    "SELECT name, price FROM charter_booking_extras WHERE booking_id = ? ORDER BY id",
    [id],
    ex,
  );
  const cancellations = await all<CancellationRow>(
    "SELECT id, cancelled_at AS at, won, amount, refunded FROM charter_booking_cancellations WHERE booking_id = ? ORDER BY id",
    [id],
    ex,
  );

  // Resan som den gick när den bokades: tidtabellens tider, men priset som bokades
  const trips = [];
  for (const [position, row] of tripRows.entries()) {
    const timetable = (await readTimetables(row.from, row.to, ex)).find((t) => t.id === row.timetableId)!;
    trips.push({ title: TRIP_NAMES[position].title, trip: { ...makeTrip(timetable, row.date), price: row.price } });
  }
  const perPerson = travellerAmount(
    trips.map((t) => t.trip.price),
    extras.map((e) => e.price),
  );
  return {
    kind: "charter",
    bookingNumber: header.bookingNumber,
    contact: contactOf(header),
    payment: paymentLabel(header.payment),
    total: header.total,
    cancellations: toCancellations(cancellations),
    destination: header.destination,
    trips,
    // Bokningen bedöms efter när utresan avgår (R8)
    late: !canCancel(trips[0].trip.departsAt, now),
    passengers: passengers.map((p) => ({
      id: p.id,
      name: `${p.firstName} ${p.lastName}`,
      age: p.age,
      amount: perPerson,
      cancelled: p.cancellationId !== null,
    })),
    extras,
  };
}

// ---------------------------------------------------------------- Avboka

// Det som skickas när besökaren bekräftar: uppgifterna, ett id för bekräftelsen
// och vilka delar som kryssats (platser eller resenärer). Inget belopp och inget
// utfall: servern räknar och drar själv (R10, R12).
export type CancelRequest = Credentials & { requestId: string; ids: number[] };

export type Cancelled = { booking: MyBooking; won: boolean; amount: number };

const MAX_IDS = 200;

// En slumpsiffra från 0 till under 1, ur operativsystemets slumptal
const secureRandom = () => randomInt(1_000_000) / 1_000_000;

// Avbokar de kryssade delarna och drar lotteriet, i en enda transaktion (R10, R12).
// Allt kontrolleras mot databasen: att numret och efternamnet stämmer, att delarna hör
// till bokningen och inte redan är avbokade, och 24-timmarsregeln. Samma requestId igen (två klick) ger
// den avbokning som redan finns.
export async function cancelParts(
  ip: string,
  request: CancelRequest,
  now = new Date(),
  random: () => number = secureRandom,
): Promise<Outcome<Cancelled>> {
  const checked = await checkCredentials(ip, request, now);
  if (!("found" in checked)) return checked;
  const { kind, id } = checked.found;
  const { requestId, ids } = request;
  const valid =
    typeof requestId === "string" &&
    requestId.length > 0 &&
    requestId.length <= 64 &&
    Array.isArray(ids) &&
    ids.length > 0 &&
    ids.length <= MAX_IDS &&
    ids.every((part) => Number.isInteger(part) && part > 0) &&
    new Set(ids).size === ids.length;
  if (!valid) return { error: NOTHING_CHOSEN };

  try {
    return await withTransaction(async (tx) => {
      const table = kind === "flight" ? "booking_cancellations" : "charter_booking_cancellations";
      const existing = await get<{ won: number; amount: number }>(
        `SELECT won, amount FROM ${table} WHERE request_id = ? AND booking_id = ?`, // nosemgrep: semgrep.sql-built-from-text
        [requestId, id],
        tx,
      );
      if (existing) {
        return { booking: await readBooking(checked.found, now, tx), won: existing.won === 1, amount: existing.amount };
      }
      const amount = kind === "flight" ? await flightAmount(id, ids, now, tx) : await charterAmount(id, ids, now, tx);
      const won = winsLottery(random());
      const { lastId } = await run(
        `INSERT INTO ${table} (booking_id, request_id, won, amount, refunded) VALUES (?, ?, ?, ?, ?)`, // nosemgrep: semgrep.sql-built-from-text
        [id, requestId, won ? 1 : 0, amount, won ? amount : 0],
        tx,
      );
      if (kind === "flight") {
        await run(
          "UPDATE booking_seats SET cancellation_id = ? WHERE id IN (SELECT value FROM json_each(?))",
          [lastId, JSON.stringify(ids)],
          tx,
        );
      } else {
        await run(
          "UPDATE charter_booking_passengers SET cancellation_id = ? WHERE id IN (SELECT value FROM json_each(?))",
          [lastId, JSON.stringify(ids)],
          tx,
        );
      }
      return { booking: await readBooking(checked.found, now, tx), won, amount };
    });
  } catch (e) {
    if (e instanceof CancelError) return { error: e.message };
    // Ett id som redan hör till en annan bokning
    if (constraintKind(e) === "unique") return { error: NOT_ALLOWED };
    throw e;
  }
}

const NOTHING_CHOSEN = "Välj vad du vill avboka.";
const NOT_ALLOWED = "Det du valde går inte att avboka. Ladda om sidan och försök igen.";

// Värdet av platserna, om alla hör till bokningen, inte är avbokade och flygen inte är för sent (R6, R8, R12)
async function flightAmount(bookingId: number, ids: number[], now: Date, tx: Executor) {
  const booking = await readFlightBooking(bookingId, now, tx);
  const seats = new Map(booking.flights.flatMap((f) => f.seats.map((s) => [s.id, { seat: s, late: f.late }] as const)));
  let amount = 0;
  for (const id of ids) {
    const part = seats.get(id);
    if (!part || part.seat.cancelled || part.late) throw new CancelError(NOT_ALLOWED);
    amount += seatAmount(part.seat);
  }
  return amount;
}

// Värdet av resenärerna, om alla hör till bokningen, inte är avbokade och utresan inte är för sent (R7, R8, R12)
async function charterAmount(bookingId: number, ids: number[], now: Date, tx: Executor) {
  const booking = await readCharterBooking(bookingId, now, tx);
  if (booking.late) throw new CancelError(NOT_ALLOWED);
  let amount = 0;
  for (const id of ids) {
    const passenger = booking.passengers.find((p) => p.id === id);
    if (!passenger || passenger.cancelled) throw new CancelError(NOT_ALLOWED);
    amount += passenger.amount;
  }
  return amount;
}
