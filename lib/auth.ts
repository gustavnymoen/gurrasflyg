import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { isValidSessionToken, SESSION_COOKIE } from "./session";

export async function isAdmin() {
  const cookieStore = await cookies();
  // Kontrollen jämför cookiens utgångstid med klockan (Date.now()). Det får
  // inte ske när Next förrenderar sidan, så vänta på en riktig förfrågan först.
  await connection();
  return isValidSessionToken(cookieStore.get(SESSION_COOKIE)?.value);
}

// För sidor: skicka till inloggningen om man inte är inloggad
export async function requireAdminPage() {
  if (!(await isAdmin())) redirect("/admin/login");
}
