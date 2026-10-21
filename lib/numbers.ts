// Heltal som en administratör skrivit in, t.ex. antal platser eller ett pris.
// Ligger utan server-only så att både formulären och servern kan använda det.

// "1 290" -> 1290. Mellanslag räknas inte; allt annat än siffror ger null.
export function parseWholeNumber(text: string): number | null {
  const digits = text.replace(/\s/g, "");
  return /^\d+$/.test(digits) ? Number(digits) : null;
}
