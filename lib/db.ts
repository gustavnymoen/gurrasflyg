import "server-only";
import Database from "better-sqlite3";
import path from "node:path";
import { connection } from "next/server";

// En enda anslutning som delas av hela appen.
// Databasen skapas med: npm run db:reset
export const db = new Database(path.join(process.cwd(), "db", "gurrasflyg.db"));
// Måste slås på för varje anslutning, annars kontrollerar SQLite inte REFERENCES
db.pragma("foreign_keys = ON");
db.pragma("journal_mode = WAL");

// % och _ betyder något speciellt i LIKE, så de måste "escapas".
// Används tillsammans med ESCAPE '\' i SQL-frågan.
export function escapeLike(text: string) {
  return text.replace(/[\\%_]/g, (c) => "\\" + c);
}

export type Airport = {
  id: number;
  name: string;
  iata: string;
  country: string;
  timezone: string;
};

export async function getAirports(): Promise<Airport[]> {
  // Säger åt Next att läsa från databasen när sidan efterfrågas,
  // inte en gång vid bygget (se node_modules/next/dist/docs, connection.md)
  await connection();
  return db
    .prepare("SELECT id, name, iata, country, timezone FROM airports ORDER BY name")
    .all() as Airport[];
}

// Flygplatser vars namn (eller IATA-kod) innehåller söktexten.
// De som börjar med söktexten hamnar först.
export async function searchAirports(query: string, limit = 5): Promise<Airport[]> {
  await connection();
  const escaped = escapeLike(query);
  return db
    .prepare(
      `SELECT id, name, iata, country, timezone FROM airports
       WHERE name LIKE @contains ESCAPE '\\' OR iata LIKE @contains ESCAPE '\\'
       ORDER BY name LIKE @startsWith ESCAPE '\\' DESC, name
       LIMIT @limit`,
    )
    .all({ contains: `%${escaped}%`, startsWith: `${escaped}%`, limit }) as Airport[];
}

export async function getAvailableSeats(flightId: number, classId: number) {
  await connection();
  const row = db
    .prepare("SELECT available FROM available_seats WHERE flight_id = ? AND class_id = ?")
    .get(flightId, classId) as { available: number } | undefined;
  // Ingen rad = planet har inte den klassen
  return row?.available ?? 0;
}
