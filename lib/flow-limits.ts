import "server-only";
import { clientIp, LOCAL_IP } from "./client-ip";
import { type Limit, MINUTE_MS, minutesLeft, registerAttempt, tooManyMessage } from "./rate-limit";

// Gränserna för det som vem som helst kan anropa (TECH-025). En förfrågan
// utan x-forwarded-for kommer inte via Vercel utan från en lokal körning,
// och begränsas inte: testerna bokar många gånger från samma adress.
// Räknas på Vercel bakom en annan proxy måste både detta och clientIp() ses över.
export const BOOKING_LIMIT: Limit = { max: 10, windowMs: 15 * MINUTE_MS, fixedWindow: true };
export const API_LIMIT: Limit = { max: 60, windowMs: MINUTE_MS, fixedWindow: true };

// Räknar ett tryck på Betala (R1) och ger felet att visa om adressen är låst, annars null
export async function bookingLimitError() {
  const ip = await clientIp();
  if (ip === LOCAL_IP) return null;
  const locked = await registerAttempt(`bokning:${ip}`, BOOKING_LIMIT);
  return locked && tooManyMessage(minutesLeft(locked.msLeft));
}

// Räknar ett anrop av API-routen (R3) och ger svaret 429 om adressen är låst, annars null
export async function apiLimitResponse(route: string) {
  const ip = await clientIp();
  if (ip === LOCAL_IP) return null;
  const locked = await registerAttempt(`api:${route}:${ip}`, API_LIMIT);
  if (!locked) return null;
  const seconds = Math.ceil(locked.msLeft / 1000);
  return Response.json(
    { error: `För många anrop. Försök igen om ${seconds} ${seconds === 1 ? "sekund" : "sekunder"}.` },
    { status: 429, headers: { "Retry-After": String(seconds) } },
  );
}
