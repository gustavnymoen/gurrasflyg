import "server-only";
import { randomInt } from "node:crypto";
import type { Transaction } from "@libsql/client";
import { get, run, withTransaction } from "./db";

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

/** Skapar en bokning och returnerar bokningsnumret. Kastar BookingError vid ogiltigt val. */
export async function createBooking(booking: NewBooking): Promise<string> {
  if (booking.passengers.length === 0) {
    throw new BookingError("Bokningen måste ha minst en passagerare.");
  }
  if (booking.flights.length === 0) {
    throw new BookingError("Bokningen måste ha minst en flight.");
  }

  // Allt i transaktionen lyckas eller inget alls sparas. Transaktionen låser
  // databasen för skrivning direkt, så två samtidiga bokningar inte båda kan
  // se samma lediga plats och därmed överboka.
  return withTransaction(async (tx) => {
    // 1. Kontrollera alla flighter och lediga platser innan något sparas
    const flights = [];
    for (const { flightId, classId } of booking.flights) {
      const flight = await get<{ aircraft_id: number }>(
        "SELECT aircraft_id FROM flights WHERE id = ?",
        [flightId],
        tx,
      );
      if (!flight) {
        throw new BookingError(`Flight ${flightId} finns inte.`);
      }
      const price = await get<{ price: number }>(
        "SELECT price FROM flight_prices WHERE flight_id = ? AND class_id = ?",
        [flightId, classId],
        tx,
      );
      if (!price) {
        throw new BookingError(`Flight ${flightId} har ingen sådan klass.`);
      }
      const seats = await get<{ available: number }>(
        "SELECT available FROM available_seats WHERE flight_id = ? AND class_id = ?",
        [flightId, classId],
        tx,
      );
      if ((seats?.available ?? 0) < booking.passengers.length) {
        throw new BookingError(
          `Det finns bara ${seats?.available ?? 0} lediga platser kvar i vald klass på flight ${flightId}.`,
        );
      }
      flights.push({ flightId, classId, aircraftId: flight.aircraft_id, price: price.price });
    }

    // 2. Spara kontakt och bokning
    const { contact } = booking;
    const { lastId: contactId } = await run(
      "INSERT INTO contacts (name, address, phone, email) VALUES (?, ?, ?, ?)",
      [contact.name, contact.address, contact.phone, contact.email],
      tx,
    );
    const bookingNumber = await newBookingNumber(tx);
    const { lastId: bookingId } = await run(
      "INSERT INTO bookings (booking_number, contact_id) VALUES (?, ?)",
      [bookingNumber, contactId],
      tx,
    );

    // 3. En rad per passagerare och flight, plus valda tillägg
    for (const passenger of booking.passengers) {
      for (const addon of passenger.addons ?? []) {
        if (!flights.some((f) => f.flightId === addon.flightId)) {
          throw new BookingError(`Tillägg valt för flight ${addon.flightId} som inte ingår i bokningen.`);
        }
      }
      const { lastId: passengerId } = await run(
        "INSERT INTO passengers (name) VALUES (?)",
        [passenger.name],
        tx,
      );

      for (const flight of flights) {
        const { lastId: bookingFlightId } = await run(
          `INSERT INTO booking_flights (booking_id, flight_id, passenger_id, class_id, price)
           VALUES (?, ?, ?, ?, ?)`,
          [bookingId, flight.flightId, passengerId, flight.classId, flight.price],
          tx,
        );

        const addonIds = (passenger.addons ?? [])
          .filter((a) => a.flightId === flight.flightId)
          .map((a) => a.addonId);
        for (const addonId of new Set(addonIds)) {
          // Addonen måste finnas i den klassen på flightens plan
          const addon = await get<{ price: number }>(
            `SELECT a.price FROM addons a
             JOIN aircraft_class_addons aca ON aca.addon_id = a.id
             WHERE a.id = ? AND aca.aircraft_id = ? AND aca.class_id = ?`,
            [addonId, flight.aircraftId, flight.classId],
            tx,
          );
          if (!addon) {
            throw new BookingError(
              `Tillägg ${addonId} går inte att välja i vald klass på flight ${flight.flightId}.`,
            );
          }
          await run(
            "INSERT INTO booking_flight_addons (booking_flight_id, addon_id, price) VALUES (?, ?, ?)",
            [bookingFlightId, addonId, addon.price],
            tx,
          );
        }
      }
    }

    return bookingNumber;
  });
}

// Sex tecken, utan lätt förväxlade tecken som 0/O och 1/I
async function newBookingNumber(tx: Transaction) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  for (;;) {
    const number = Array.from({ length: 6 }, () => chars[randomInt(chars.length)]).join("");
    if (!(await get("SELECT 1 FROM bookings WHERE booking_number = ?", [number], tx))) {
      return number;
    }
  }
}
