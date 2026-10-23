// Heltal som en administratör skrivit in, t.ex. antal platser eller ett pris.
// Ligger utan server-only så att både formulären och servern kan använda det.

// "1 290" -> 1290. Mellanslag räknas inte; allt annat än siffror ger null.
export function parseWholeNumber(text: string): number | null {
  const digits = text.replace(/\s/g, "");
  return /^\d+$/.test(digits) ? Number(digits) : null;
}

// En faktor som admin skrivit in, t.ex. "1,50", i procent som heltal (150).
// Decimalkomma och högst två decimaler; allt annat ger null (TRIP-011-R6, R8).
export function parseFactor(text: string): number | null {
  const match = /^(\d{1,2})(?:,(\d{1,2}))?$/.exec(text.trim());
  if (!match) return null;
  return Number(match[1]) * 100 + Number((match[2] ?? "").padEnd(2, "0"));
}

// Procent -> faktor med två decimaler: 150 -> "1,50"
export function formatFactor(percent: number) {
  return `${Math.floor(percent / 100)},${String(percent % 100).padStart(2, "0")}`;
}

// Prisfaktorn för en klass eller ett plan är 1,00–10,00, tidsfaktorn för ett
// plan mer än 0 och högst 10,00 (TRIP-011-R6, R8). Samma kontroll i
// formuläret och på servern, och databasen har samma gränser.
export const MAX_FACTOR_PERCENT = 1000;
export const PRICE_FACTOR_ERROR = "Prisfaktorn måste vara ett tal från 1 till 10 med högst två decimaler, t.ex. 1,50.";
export const TIME_FACTOR_ERROR = "Tidsfaktorn måste vara ett tal större än 0 och högst 10 med högst två decimaler, t.ex. 0,50.";

export function parsePriceFactor(text: string) {
  const percent = parseFactor(text);
  return percent !== null && percent >= 100 && percent <= MAX_FACTOR_PERCENT ? percent : null;
}

export function parseTimeFactor(text: string) {
  const percent = parseFactor(text);
  return percent !== null && percent > 0 && percent <= MAX_FACTOR_PERCENT ? percent : null;
}
