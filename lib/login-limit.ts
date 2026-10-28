import "server-only";
import { clearAttempts, type Limit, minutesLeft, MINUTE_MS, registerAttempt } from "./rate-limit";

// Gräns för inloggningsförsök per IP-adress (TECH-017)
export const MAX_FAILED_LOGINS = 5;
export const LOGIN_WINDOW_MS = 15 * MINUTE_MS;

const LOGIN_LIMIT: Limit = { max: MAX_FAILED_LOGINS, windowMs: LOGIN_WINDOW_MS };

// Räknar ett försök (som inte tagits bort av ett rätt lösenord) från adressen och säger om det är låst, annars null.
export async function registerLoginAttempt(ip: string, now = Date.now()): Promise<{ minutesLeft: number } | null> {
  const locked = await registerAttempt(ip, LOGIN_LIMIT, now);
  return locked && { minutesLeft: minutesLeft(locked.msLeft) };
}

// Rätt lösenord: adressens räknare nollställs
export const clearLoginAttempts = clearAttempts;
