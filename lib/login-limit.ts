import "server-only";
import { all, run } from "./db";

// Gräns för inloggningsförsök per IP-adress (TECH-017)
export const MAX_FAILED_LOGINS = 5;
export const LOGIN_WINDOW_MS = 15 * 60 * 1000;

// Räknar ett försök (som inte tagits bort av ett rätt lösenord) från adressen och säger om det är låst, annars null.
// Försöket räknas innan lösenordet kontrolleras, i ett enda anrop, så att
// många försök på en gång inte kan slinka förbi gränsen. Ett lyckat försök
// tar bort räknaren (clearLoginAttempts). Är adressen låst räknas inte fler
// försök, så låset förlängs inte av att någon fortsätter. Fönstret räknas
// från senaste försöket som kontrollerades; är det utgånget börjar räknaren om.
export async function registerLoginAttempt(ip: string, now = Date.now()): Promise<{ minutesLeft: number } | null> {
  // Gamla rader tas bort här, så att tabellen inte växer utan slut
  await run("DELETE FROM login_attempts WHERE last_failed_at <= ?", [now - LOGIN_WINDOW_MS]);
  const [row] = await all<{ attempts: number; lastFailedAt: number }>(
    `INSERT INTO login_attempts (ip, attempts, last_failed_at) VALUES (?, 1, ?)
     ON CONFLICT (ip) DO UPDATE SET
       attempts = attempts + 1,
       last_failed_at = CASE WHEN attempts >= ? THEN last_failed_at ELSE excluded.last_failed_at END
     RETURNING attempts, last_failed_at AS lastFailedAt`,
    [ip, now, MAX_FAILED_LOGINS],
  );
  if (row.attempts <= MAX_FAILED_LOGINS) return null;
  return { minutesLeft: Math.max(1, Math.ceil((row.lastFailedAt + LOGIN_WINDOW_MS - now) / 60000)) };
}

// Rätt lösenord: adressens räknare nollställs
export async function clearLoginAttempts(ip: string) {
  await run("DELETE FROM login_attempts WHERE ip = ?", [ip]);
}
