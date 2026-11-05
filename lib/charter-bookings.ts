import "server-only";
import type { Transaction } from "@libsql/client";
import { BookingError, findBookingByRequestId, INVALID, newBookingNumber } from "./booking-common";
import { type BookingLeg, chosenAddons, paymentProblems, seatPrice } from "./booking-rules";
import { type CharterData, readCharter } from "./charter";
import {
  type CharterChoice,
  type CharterForm,
  type CharterSearch,
  type CharterTrip,
  charterProblems,
  charterTotal,
  extraByCode,
  extrasProblem,
  fitsCharterForm,
} from "./charter-rules";
import { run, withTransaction } from "./db";

// Det som skickas när besökaren trycker Betala: resmålet, sökningen och valen
// från adressen och formuläret. Inget av det är kontrollerat än.
export type CharterRequest = {
  destination: CharterData["destination"];
  search: CharterSearch;
  choice: CharterChoice;
  form: CharterForm;
};

// Fel som beror på vad besökaren valt eller på att något ändrats sedan dess,
// och som kan visas för besökaren
export class CharterBookingError extends BookingError {}

export const CHANGED = "Något i resan har ändrats sedan du valde den. Gå tillbaka till Resa och välj igen.";

// Sparar bokningen och returnerar bokningsnumret, resorna och planen med klasserna den gäller (R8, TRIP-039-R5).
// Allt kontrolleras och alla priser räknas här, i transaktionen, från
// databasen: ett plan som inte finns eller är för litet, klasser som inte går ihop och
// ett pris från webbläsaren som avviker godtas inte. Samma request_id igen (två tryck på
// Betala) ger den bokning som redan finns.
export async function createCharterBooking(request: CharterRequest, now = new Date()) {
  const { destination, search, choice, form } = request;
  return withTransaction(async (tx) => {
    const existing = await findBookingByRequestId(tx, "charter_bookings", form?.requestId);

    const data = await readCharter(destination, search, choice, now, tx);
    const { legs } = data ?? {};
    if (!data?.outbound || !data.home || !legs || data.choice.out !== choice.out || data.choice.back !== choice.back) {
      throw new CharterBookingError(CHANGED);
    }
    const trips = [data.outbound, data.home];
    const valid =
      fitsCharterForm(form, legs, search.travellers) &&
      extrasProblem(form) === null &&
      Object.keys({ ...charterProblems(form, legs), ...paymentProblems(form) }).length === 0;
    if (!valid) throw new CharterBookingError(INVALID);
    if (existing) return { bookingNumber: existing.bookingNumber, trips, legs };

    const bookingNumber = await newBookingNumber(tx, "charter_bookings", "CH-");
    const { contact } = form;
    const { lastId: bookingId } = await run(
      `INSERT INTO charter_bookings
         (booking_number, request_id, destination_id, first_name, last_name, email, phone, address, payment, total)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        bookingNumber,
        form.requestId,
        destination.id,
        contact.firstName.trim(),
        contact.lastName.trim(),
        contact.email.trim(),
        contact.phone.trim(),
        contact.address.trim(),
        form.payment,
        charterTotal(legs, form),
      ],
      tx,
    );
    const passengerIds = [];
    for (const [position, p] of form.passengers.entries()) {
      const { lastId } = await run(
        "INSERT INTO charter_booking_passengers (booking_id, position, first_name, last_name, age) VALUES (?, ?, ?, ?, ?)",
        [bookingId, position, p.firstName.trim(), p.lastName.trim(), Number(p.age)],
        tx,
      );
      passengerIds.push(lastId);
    }
    await saveTrips(tx, bookingId, trips, legs, form, passengerIds);
    for (const code of form.extras) {
      // Koden är kontrollerad av extrasProblem, så tillägget finns
      const extra = extraByCode(code)!;
      await run(
        "INSERT INTO charter_booking_extras (booking_id, code, name, price) VALUES (?, ?, ?, ?)",
        [bookingId, extra.code, extra.name, extra.price],
        tx,
      );
    }
    return { bookingNumber, trips, legs };
  });
}

// Resorna med planet, och varje resenärs plats och tillägg på dem. Platsens pris är avgångens pris
// gånger planets och klassens faktor; tilläggens pris per styck som när de bokades.
async function saveTrips(
  tx: Transaction,
  bookingId: number,
  trips: CharterTrip[],
  legs: BookingLeg[],
  form: CharterForm,
  passengerIds: number[],
) {
  for (const [position, trip] of trips.entries()) {
    const leg = legs[position];
    const { lastId: tripId } = await run(
      "INSERT INTO charter_booking_trips (booking_id, position, timetable_id, date, price, aircraft_id) VALUES (?, ?, ?, ?, ?, ?)",
      [bookingId, position, trip.id, trip.date, trip.price, leg.aircraft.id],
      tx,
    );
    for (const [p, passenger] of form.passengers.entries()) {
      const passengerLeg = passenger.legs[position];
      const { lastId: seatId } = await run(
        "INSERT INTO charter_booking_seats (booking_trip_id, passenger_id, class_id, price) VALUES (?, ?, ?, ?)",
        [tripId, passengerIds[p], passengerLeg.classId, seatPrice(leg, passengerLeg.classId)],
        tx,
      );
      for (const { addon, count } of chosenAddons(leg, passengerLeg)) {
        await run(
          "INSERT INTO charter_booking_addons (booking_seat_id, addon_id, name, count, price) VALUES (?, ?, ?, ?, ?)",
          [seatId, addon.id, addon.name, count, addon.price],
          tx,
        );
      }
    }
  }
}
