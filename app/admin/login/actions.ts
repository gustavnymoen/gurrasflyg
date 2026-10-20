"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createSessionToken, safeEqual, SESSION_COOKIE } from "@/lib/session";

export type LoginState = { error: string | null };

export async function loginAction(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) {
    return { error: "Inget lösenord är satt. Lägg till ADMIN_PASSWORD i .env.local." };
  }
  const password = String(formData.get("password") ?? "");
  if (!safeEqual(password, expected)) {
    return { error: "Fel lösenord." };
  }

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
