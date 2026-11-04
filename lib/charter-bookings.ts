import "server-only";
import type { Transaction } from "@libsql/client";
import { BookingError, findBookingByRequestId, INVALID, newBookingNumber } from "./booking-common";
import { paymentProblems } from "./booking-rules";
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

// Sparar bokningen och returnerar bokningsnumret och resorna den gäller (R8).
// Allt kontrolleras och alla priser räknas här, i transaktionen, från
// databasen. Samma request_id igen (två tryck på Betala) ger den bokning som
// redan finns.
export async function createCharterBooking(request: CharterRequest, now = new Date()) {
  const { destination, search, choice, form } = request;
  return withTransaction(async (tx) => {
    const existing = await findBookingByRequestId(tx, "charter_bookings", form?.requestId);

    const data = await readCharter(destination, search, choice, now, tx);
    if (!data?.outbound || !data.home || data.choice.out !== choice.out || data.choice.back !== choice.back) {
      throw new CharterBookingError(CHANGED);
    }
    const trips = [data.outbound, data.home];
    const valid =
      fitsCharterForm(form, search.travellers) &&
      extrasProblem(form) === null &&
      Object.keys({ ...charterProblems(form), ...paymentProblems(form) }).length === 0;
    if (!valid) throw new CharterBookingError(INVALID);
    if (existing) return { bookingNumber: existing.bookingNumber, trips };

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
        charterTotal(
          trips.map((t) => t.price),
          form.extras,
          search.travellers,
        ),
      ],
      tx,
    );
    for (const [position, p] of form.passengers.entries()) {
      await run(
        "INSERT INTO charter_booking_passengers (booking_id, position, first_name, last_name, age) VALUES (?, ?, ?, ?, ?)",
        [bookingId, position, p.firstName.trim(), p.lastName.trim(), Number(p.age)],
        tx,
      );
    }
    await saveTrips(tx, bookingId, trips);
    for (const code of form.extras) {
      // Koden är kontrollerad av extrasProblem, så tillägget finns
      const extra = extraByCode(code)!;
      await run(
        "INSERT INTO charter_booking_extras (booking_id, code, name, price) VALUES (?, ?, ?, ?)",
        [bookingId, extra.code, extra.name, extra.price],
        tx,
      );
    }
    return { bookingNumber, trips };
  });
}

async function saveTrips(tx: Transaction, bookingId: number, trips: CharterTrip[]) {
  for (const [position, trip] of trips.entries()) {
    await run(
      "INSERT INTO charter_booking_trips (booking_id, position, timetable_id, date, price) VALUES (?, ?, ?, ?, ?)",
      [bookingId, position, trip.id, trip.date, trip.price],
      tx,
    );
  }
}
