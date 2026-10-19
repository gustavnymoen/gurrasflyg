import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { isValidSessionToken, SESSION_COOKIE } from "./session";

export async function isAdmin() {
  const cookieStore = await cookies();
  return isValidSessionToken(cookieStore.get(SESSION_COOKIE)?.value);
}

// För sidor: skicka till inloggningen om man inte är inloggad
export async function requireAdminPage() {
  if (!(await isAdmin())) redirect("/admin/login");
}
