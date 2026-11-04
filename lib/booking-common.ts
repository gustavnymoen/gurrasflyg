import "server-only";
import { randomInt } from "node:crypto";
import type { Transaction } from "@libsql/client";
import { get } from "./db";

// Fel som beror på vad besökaren valt eller på att något ändrats sedan dess,
// och som kan visas för besökaren
export class BookingError extends Error {}

export const INVALID = "Bokningen gick inte att spara. Gå tillbaka till Resenärer och kontrollera uppgifterna.";

// Tabellerna i den här filen kommer bara från anropen i lib/bookings.ts och
// lib/charter-bookings.ts, aldrig från en besökare.
type BookingTable = "bookings" | "charter_bookings";

// Sex tecken, utan lätt förväxlade tecken som 0/O och 1/I
export function randomBookingCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from({ length: 6 }, () => chars[randomInt(chars.length)]).join("");
}

// Ett bokningsnummer som inte finns i tabellen. prefix skiljer charternumren från flygens.
export async function newBookingNumber(tx: Transaction, table: BookingTable, prefix = "") {
  for (;;) {
    const number = `${prefix}${randomBookingCode()}`;
    if (!(await get(`SELECT 1 FROM ${table} WHERE booking_number = ?`, [number], tx))) return number; // nosemgrep: semgrep.sql-built-from-text
  }
}

// Den bokning som redan sparats för samma request_id (två tryck på Betala)
export function findBookingByRequestId(tx: Transaction, table: BookingTable, requestId: unknown) {
  return get<{ bookingNumber: string }>(
    `SELECT booking_number AS bookingNumber FROM ${table} WHERE request_id = ?`, // nosemgrep: semgrep.sql-built-from-text
    [typeof requestId === "string" ? requestId : ""],
    tx,
  );
}

// Vad en server action visar när bokningen kastade ett fel: besökarens fel som
// de är, allt annat loggas och visas som ett allmänt fel
export function bookingFailure(e: unknown) {
  if (e instanceof BookingError) return { ok: false, error: e.message } as const;
  console.error(e);
  return { ok: false, error: "Något gick fel, försök igen." } as const;
}
