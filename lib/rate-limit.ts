import "server-only";
import { all, run } from "./db";

// Gräns för hur ofta något får göras från en nyckel (oftast en IP-adress), TECH-017 och TECH-025.
// Räknarna ligger i databasen eftersom varje förfrågan på Vercel kan köras i en ny funktion.
// fixedWindow: fönstret räknas från första försöket (Betala och API-routerna: "högst 10 på 15 minuter"),
// annars från det senaste (inloggningen: låset räknas från sista gissningen)
export type Limit = { max: number; windowMs: number; fixedWindow?: boolean };

export const MINUTE_MS = 60 * 1000;

// Inget fönster är längre än så; rader som är äldre är utgångna för alla flöden
export const LONGEST_WINDOW_MS = 15 * MINUTE_MS;

export const minutesLeft = (msLeft: number) => Math.max(1, Math.ceil(msLeft / MINUTE_MS));

export const tooManyMessage = (minutes: number) =>
  `För många försök. Försök igen om ${minutes} ${minutes === 1 ? "minut" : "minuter"}.`;

// Räknar ett försök från nyckeln och säger hur länge den är låst (millisekunder), annars null.
// Försöket räknas innan något kontrolleras, i ett enda anrop, så att
// många försök på en gång inte kan slinka förbi gränsen. Är nyckeln låst
// flyttas inte tiden i last_failed_at (räknaren räknas upp ändå), så
// låset förlängs inte av att någon fortsätter. last_failed_at är tiden för
// senaste försöket som kontrollerades, eller med fixedWindow för det första;
// är fönstret räknat från den utgånget börjar räknaren om.
export async function registerAttempt(key: string, limit: Limit, now = Date.now()): Promise<{ msLeft: number } | null> {
  if (limit.windowMs > LONGEST_WINDOW_MS) throw new Error("Fönstret är längre än LONGEST_WINDOW_MS");
  // Raderna tas bort i ett eget anrop före räkningen: missas det räcker nästa anrop, räkningen själv är ett enda anrop.
  // Gamla rader tas bort här, så att tabellen inte växer utan slut. Nyckelns egen
  // rad rensas efter sitt fönster (med fixedWindow är last_failed_at första försöket, så det är
  // det som får fönstret att börja om), övriga först när de är utgångna för alla.
  await run("DELETE FROM login_attempts WHERE last_failed_at <= ? OR (ip = ? AND last_failed_at <= ?)", [
    now - LONGEST_WINDOW_MS,
    key,
    now - limit.windowMs,
  ]);
  const [row] = await all<{ attempts: number; lastFailedAt: number }>(
    `INSERT INTO login_attempts (ip, attempts, last_failed_at) VALUES (?, 1, ?)
     ON CONFLICT (ip) DO UPDATE SET
       attempts = attempts + 1,
       last_failed_at = CASE WHEN ? OR attempts >= ? THEN last_failed_at ELSE excluded.last_failed_at END
     RETURNING attempts, last_failed_at AS lastFailedAt`,
    [key, now, limit.fixedWindow ? 1 : 0, limit.max],
  );
  if (row.attempts <= limit.max) return null;
  return { msLeft: row.lastFailedAt + limit.windowMs - now };
}

// Nyckelns räknare nollställs
export async function clearAttempts(key: string) {
  await run("DELETE FROM login_attempts WHERE ip = ?", [key]);
}
