"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { clearLoginAttempts, registerLoginAttempt } from "@/lib/login-limit";
import { createSessionToken, passwordMatches, SESSION_COOKIE } from "@/lib/session";

export type LoginState = { error: string | null };

const WRONG_PASSWORD_DELAY_MS = 1000;

// Besökarens IP-adress. Vercel skriver själv x-forwarded-for med den riktiga
// adressen; lokalt saknas den och alla räknas som "local".
async function clientIp() {
  const forwarded = (await headers()).get("x-forwarded-for");
  return forwarded?.split(",")[0].trim().slice(0, 45) || "local";
}

export async function loginAction(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) {
    // Vad som saknas visas bara lokalt; besökare på riktiga sidan ser inga namn på inställningar
    if (process.env.NODE_ENV !== "production") {
      return { error: "Inget lösenord är satt. Lägg till ADMIN_PASSWORD i .env.local." };
    }
    console.error("ADMIN_PASSWORD saknas");
    return { error: "Inloggningen fungerar inte just nu." };
  }
  const ip = await clientIp();
  const locked = await registerLoginAttempt(ip);
  if (locked) {
    const { minutesLeft } = locked;
    return { error: `För många försök. Försök igen om ${minutesLeft} ${minutesLeft === 1 ? "minut" : "minuter"}.` };
  }
  const password = String(formData.get("password") ?? "");
  if (!passwordMatches(password, expected)) {
    // En sekunds väntan gör det långsamt att gissa lösenordet
    await new Promise((resolve) => setTimeout(resolve, WRONG_PASSWORD_DELAY_MS));
    return { error: "Fel lösenord." };
  }
  await clearLoginAttempts(ip);

  // Ingen utgångstid på cookien = webbläsaren raderar den när den stängs.
  // Själva inloggningen slutar dessutom gälla efter några timmar (se lib/session.ts).
  (await cookies()).set(SESSION_COOKIE, createSessionToken(), {
    httpOnly: true, // går inte att läsa från JavaScript i webbläsaren
    secure: process.env.NODE_ENV === "production", // bara över https på riktiga sidan
    sameSite: "lax",
    path: "/",
  });
  redirect("/admin");
}

export async function logoutAction() {
  (await cookies()).delete(SESSION_COOKIE);
  redirect("/admin/login");
}
