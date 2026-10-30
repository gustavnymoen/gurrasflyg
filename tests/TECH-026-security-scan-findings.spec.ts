import { expect, type Page, test } from "@playwright/test";
import { runsLocally } from "./helpers";
import { removeSeed, seedFlightBooking } from "./my-booking-data";
import { inTestDb } from "./plan";

// The rules are unit tests (lib/my-booking.test.ts, lib/search-text.test.ts). Here the pages and
// routes use them, and the headers are read from the running server. The lookup test writes a
// booking and counters to the test database, so it runs only against the local test server.

const CSP =
  "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'";

// Collects what the browser refuses because of the policy, from before the page's own scripts run
async function collectViolations(page: Page) {
  await page.addInitScript(() => {
    const seen: string[] = [];
    (window as unknown as { violations: string[] }).violations = seen;
    document.addEventListener("securitypolicyviolation", (e) => seen.push(`${e.violatedDirective} ${e.blockedURI}`));
  });
  return () => page.evaluate(() => (window as unknown as { violations: string[] }).violations);
}

test("TECH-026-R1 a right lookup between wrong guesses does not stop the lock", async ({ browser }) => {
  test.skip(!runsLocally, "Writes to the test database: only against the local test server");
  const seed = await seedFlightBooking();
  const ip = `203.0.113.${(Date.now() + 50) % 250}`;
  const context = await browser.newContext({ extraHTTPHeaders: { "x-forwarded-for": ip } });
  try {
    const page = await context.newPage();
    const lookUp = async (lastName: string) => {
      await page.goto("/min-bokning");
      await page.getByLabel("Bokningsnummer").fill(seed.number);
      await page.getByLabel("Efternamn").fill(lastName);
      await page.getByRole("button", { name: "Visa min bokning" }).click();
    };
    for (let i = 0; i < 4; i++) {
      await lookUp("Fel");
      await expect(page.getByText("Vi hittar ingen bokning med de uppgifterna.")).toBeVisible();
    }
    await lookUp(seed.lastName);
    await expect(page.getByRole("heading", { name: "Din bokning" })).toBeVisible();
    await lookUp("Fel");
    await expect(page.getByText(/^För många försök\. Försök igen om (14|15) minuter\.$/)).toBeVisible();
  } finally {
    await context.close();
    await inTestDb((db) => db.execute({ sql: "DELETE FROM login_attempts WHERE ip = ?", args: [`uppslag:${ip}`] }));
    await removeSeed(seed);
  }
});

test("TECH-026-R2 a search text of 1 000 characters to /api/airports gives a normal list", async ({ request }) => {
  const response = await request.get(`/api/airports?q=${"a".repeat(1000)}`);
  expect(response.status()).toBe(200);
  expect(Array.isArray(await response.json())).toBe(true);
});

test("TECH-026-R3 every page and API response carries the three headers, and the main pages load without a blocked resource", async ({
  page,
  request,
}) => {
  for (const response of [await request.get("/"), await request.get("/api/destinations")]) {
    const headers = response.headers();
    expect(headers["content-security-policy"], response.url()).toBe(CSP);
    expect(headers["permissions-policy"], response.url()).toBe("camera=(), microphone=(), geolocation=()");
    expect(headers["strict-transport-security"], response.url()).toBe("max-age=63072000; includeSubDomains");
  }

  const violations = await collectViolations(page);
  const consoleErrors: string[] = [];
  page.on("console", (m) => m.type() === "error" && consoleErrors.push(m.text()));
  for (const path of ["/", "/charter", "/min-bokning", "/admin/login"]) {
    await page.goto(path);
    await page.waitForLoadState("networkidle");
    expect(await violations(), path).toEqual([]);
  }
  expect(consoleErrors.filter((e) => /Content Security Policy/i.test(e))).toEqual([]);

  // Known limit: an inline script is allowed ('unsafe-inline'), a script from another origin is not
  const result = await page.evaluate(
    () =>
      new Promise<{ inline: boolean; blocked: string }>((resolve) => {
        const w = window as unknown as { ran?: boolean; violations: string[] };
        const inline = document.createElement("script");
        inline.textContent = "window.ran = true";
        document.head.append(inline);
        document.addEventListener("securitypolicyviolation", (e) => resolve({ inline: w.ran === true, blocked: e.blockedURI }), { once: true });
        const external = document.createElement("script");
        external.src = "https://example.com/x.js";
        document.head.append(external);
      }),
  );
  expect(result).toEqual({ inline: true, blocked: "https://example.com/x.js" });
});
