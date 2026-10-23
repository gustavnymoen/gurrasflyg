// Inloggningscookie för admin.
//
// Cookien innehåller när inloggningen går ut plus en signatur (HMAC) gjord
// med ADMIN_SESSION_SECRET. Utan nyckeln går det inte att förfalska en
// giltig cookie. Används både av proxy.ts och av servern.
//
// Inloggningen gäller tills webbläsaren stängs, dock max SESSION_HOURS timmar.

import { createHash, createHmac, timingSafeEqual } from "node:crypto";

export const SESSION_COOKIE = "gurrasflyg_admin";
export const SESSION_HOURS = 8;
// Byts versionen blir alla gamla inloggningar ogiltiga
const VERSION = "v2";

function secret() {
  const value = process.env.ADMIN_SESSION_SECRET;
  if (!value) throw new Error("ADMIN_SESSION_SECRET saknas i .env.local");
  return value;
}

function sign(expires: string) {
  return createHmac("sha256", secret()).update(`${VERSION}.${expires}`).digest("hex");
}

// "1761500000000.a1b2c3..."  (utgångstid i millisekunder . signatur)
export function createSessionToken() {
  const expires = String(Date.now() + SESSION_HOURS * 60 * 60 * 1000);
  return `${expires}.${sign(expires)}`;
}

export function isValidSessionToken(token: string | undefined) {
  if (!token) return false;
  const [expires, signature] = token.split(".");
  if (!expires || !signature || Number(expires) < Date.now()) return false;
  return safeEqual(signature, sign(expires));
}

// Jämför två strängar på konstant tid, så att svarstiden inte avslöjar
// hur många tecken som stämde
export function safeEqual(a: string, b: string) {
  const [x, y] = [Buffer.from(a), Buffer.from(b)];
  return x.length === y.length && timingSafeEqual(x, y);
}

// Lösenordet jämförs som hashar av samma längd, så att svarstiden inte heller
// avslöjar hur långt det rätta lösenordet är
export function passwordMatches(password: string, expected: string) {
  const hash = (text: string) => createHash("sha256").update(text).digest();
  return timingSafeEqual(hash(password), hash(expected));
}
