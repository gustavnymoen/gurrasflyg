import "server-only";
import { randomInt } from "node:crypto";
import { db } from "./db";

export type NewBooking = {
  contact: { name: string; address: string; phone: string; email: string };
  // Alla passagerare åker på samma flighter i samma klass
  flights: { flightId: number; classId: number }[];
  passengers: {
    name: string;
    addons?: { flightId: number; addonId: number }[];
  }[];
};

// Fel som beror på vad kunden valt (fullbokat, ogiltigt tillägg osv)
// och som kan visas för användaren.
export class BookingError extends Error {}

const getFlight = db.prepare(
  "SELECT id, aircraft_id FROM flights WHERE id = ?",
);
const getFlightPrice = db.prepare(
  "SELECT price FROM flight_prices WHERE flight_id = ? AND class_id = ?",
);
const getAvailable = db.prepare(
  "SELECT available FROM available_seats WHERE flight_id = ? AND class_id = ?",
);
const getAllowedAddon = db.prepare(`
  SELECT a.price FROM addons a
  JOIN aircraft_class_addons aca ON aca.addon_id = a.id
  WHERE a.id = ? AND aca.aircraft_id = ? AND aca.class_id = ?
`);
const bookingNumberExists = db.prepare(
  "SELECT 1 FROM bookings WHERE booking_number = ?",
);
const insertContact = db.prepare(
  "INSERT INTO contacts (name, address, phone, email) VALUES (?, ?, ?, ?)",
);
const insertPassenger = db.prepare("INSERT INTO passengers (name) VALUES (?)");
const insertBooking = db.prepare(
  "INSERT INTO bookings (booking_number, contact_id) VALUES (?, ?)",
);
const insertBookingFlight = db.prepare(`
  INSERT INTO booking_flights (booking_id, flight_id, passenger_id, class_id, price)
  VALUES (?, ?, ?, ?, ?)
`);
const insertBookingFlightAddon = db.prepare(
  "INSERT INTO booking_flight_addons (booking_flight_id, addon_id, price) VALUES (?, ?, ?)",
);

// Allt i transaktionen lyckas eller inget alls sparas. "immediate" låser
// databasen för skrivning direkt, så två samtidiga bokningar inte båda kan
// se samma lediga plats och därmed överboka.
const createBookingTx = db.transaction((booking: NewBooking): string => {
  if (booking.passengers.length === 0) {
    throw new BookingError("Bokningen måste ha minst en passagerare.");
  }
  if (booking.flights.length === 0) {
    throw new BookingError("Bokningen måste ha minst en flight.");
  }

  // 1. Kontrollera alla flighter och lediga platser innan något sparas
  const flights = booking.flights.map(({ flightId, classId }) => {
    const flight = getFlight.get(flightId) as { id: number; aircraft_id: number } | undefined;
    if (!flight) {
      throw new BookingError(`Flight ${flightId} finns inte.`);
    }
    const price = getFlightPrice.get(flightId, classId) as { price: number } | undefined;
    if (!price) {
      throw new BookingError(`Flight ${flightId} har ingen sådan klass.`);
    }
    const seats = getAvailable.get(flightId, classId) as { available: number };
    if (seats.available < booking.passengers.length) {
      throw new BookingError(
        `Det finns bara ${seats.available} lediga platser kvar i vald klass på flight ${flightId}.`,
      );
    }
    return { flightId, classId, aircraftId: flight.aircraft_id, price: price.price };
  });

  // 2. Spara kontakt och bokning
  const { contact } = booking;
  const contactId = insertContact.run(contact.name, contact.address, contact.phone, contact.email)
    .lastInsertRowid;
  const bookingNumber = newBookingNumber();
  const bookingId = insertBooking.run(bookingNumber, contactId).lastInsertRowid;

  // 3. En rad per passagerare och flight, plus valda tillägg
  for (const passenger of booking.passengers) {
    const passengerId = insertPassenger.run(passenger.name).lastInsertRowid;

    for (const addon of passenger.addons ?? []) {
      if (!flights.some((f) => f.flightId === addon.flightId)) {
        throw new BookingError(`Tillägg valt för flight ${addon.flightId} som inte ingår i bokningen.`);
      }
    }

    for (const flight of flights) {
      const bookingFlightId = insertBookingFlight.run(
        bookingId,
        flight.flightId,
        passengerId,
        flight.classId,
        flight.price,
      ).lastInsertRowid;

      const addonIds = (passenger.addons ?? [])
        .filter((a) => a.flightId === flight.flightId)
        .map((a) => a.addonId);
      for (const addonId of new Set(addonIds)) {
        const addon = getAllowedAddon.get(addonId, flight.aircraftId, flight.classId) as
          | { price: number }
          | undefined;
        if (!addon) {
          throw new BookingError(
            `Tillägg ${addonId} går inte att välja i vald klass på flight ${flight.flightId}.`,
          );
        }
        insertBookingFlightAddon.run(bookingFlightId, addonId, addon.price);
      }
    }
  }

  return bookingNumber;
});

/** Skapar en bokning och returnerar bokningsnumret. Kastar BookingError vid ogiltigt val. */
export function createBooking(booking: NewBooking): string {
  return createBookingTx.immediate(booking);
}

// Sex tecken, utan lätt förväxlade tecken som 0/O och 1/I
function newBookingNumber() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let number: string;
  do {
    number = Array.from({ length: 6 }, () => chars[randomInt(chars.length)]).join("");
  } while (bookingNumberExists.get(number));
  return number;
}
