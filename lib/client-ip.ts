import "server-only";
import { headers } from "next/headers";

// Adressen när förfrågan inte kommer via Vercel (lokal körning och testserver)
export const LOCAL_IP = "local";

// Besökarens IP-adress. Vercel skriver själv x-forwarded-for med den riktiga
// adressen; lokalt saknas den och alla räknas som "local".
export async function clientIp() {
  const forwarded = (await headers()).get("x-forwarded-for");
  return forwarded?.split(",")[0].trim().slice(0, 45) || LOCAL_IP;
}
