// Körs innan sidor under /admin visas. Snabb koll av inloggningscookien:
// inte inloggad -> inloggningssidan, redan inloggad -> förbi inloggningen.
// Server actions kontrollerar inloggningen igen, det här är bara första spärren.

import { NextResponse, type NextRequest } from "next/server";
import { isValidSessionToken, SESSION_COOKIE } from "@/lib/session";

export function proxy(request: NextRequest) {
  const loggedIn = isValidSessionToken(request.cookies.get(SESSION_COOKIE)?.value);
  const onLoginPage = request.nextUrl.pathname === "/admin/login";

  if (!loggedIn && !onLoginPage) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }
  if (loggedIn && onLoginPage) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
