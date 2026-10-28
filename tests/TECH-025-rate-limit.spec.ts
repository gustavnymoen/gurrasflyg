import { expect, test } from "@playwright/test";
import { travellersUrl } from "../lib/charter-rules";
import { charterTripDays, expectNoA11yViolations, runsLocally } from "./helpers";
import { fillAll, inTestDb } from "./plan";

// The rules (the numbers, the window, the cleanup, the length of the address) are unit tests in
// lib/rate-limit.test.ts and app/flyg/boka/actions.test.ts. Here the pages use them. Each test
// uses an address of its own (x-forwarded-for) with the limit already reached in the test
// database, so no other test is locked out and nothing waits. A request without x-forwarded-for,
// as in the rest of the suite, is not limited.

test.skip(!runsLocally, "Writes to the test database: only against the local test server");

const address = (last: number) => `203.0.113.${last}`;
const lockKey = (key: string) =>
  inTestDb((db) =>
    db.execute({ sql: "INSERT INTO login_attempts (ip, attempts, last_failed_at) VALUES (?, 99, ?) ON CONFLICT (ip) DO UPDATE SET attempts = 99, last_failed_at = excluded.last_failed_at", args: [key, Date.now()] }),
  );
const unlock = (keys: string[]) =>
  inTestDb((db) => db.execute({ sql: `DELETE FROM login_attempts WHERE ip IN (${keys.map(() => "?").join(",")})`, args: keys }));

test("TECH-025-R1 a locked address that presses Betala is told how long to wait, and no booking is saved", async ({ browser }) => {
  const ip = address(Date.now() % 100);
  const email = "e2e-limit@exempel.se";
  const { monday, saturday } = charterTripDays();
  const choice = { out: "ARN-BER-SK1122", back: "BER-ARN-SK1123" };
  await lockKey(`bokning:${ip}`);
  const context = await browser.newContext({ extraHTTPHeaders: { "x-forwarded-for": ip } });
  try {
    const page = await context.newPage();
    await page.goto(travellersUrl("teufelsberg", { from: "ARN", outbound: monday, return: saturday, travellers: 1 }, choice));
    await fillAll(page, 1, email);
    await page.getByRole("button", { name: "Till betalning" }).click();
    await page.getByRole("radio", { name: "Cash till piloten" }).check();
    await page.getByRole("button", { name: "Betala", exact: true }).click();
    await expect(page.getByRole("main").getByRole("alert").filter({ hasText: /^För många försök\. Försök igen om (14|15) minuter\.$/ })).toBeVisible();
    await expect(page).not.toHaveURL(/\/charter\/bokad$/);
    await expectNoA11yViolations(page);
    const saved = await inTestDb((db) => db.execute({ sql: "SELECT id FROM charter_bookings WHERE email = ?", args: [email] }));
    expect(saved.rows).toHaveLength(0);
  } finally {
    await context.close();
    await unlock([`bokning:${ip}`]);
  }
});

test("TECH-025-R3 a locked address gets 429 with Retry-After from a limited route, and the other routes still answer", async ({ browser }) => {
  const ip = address(100 + (Date.now() % 100));
  const keys = [`api:airports:${ip}`, `api:destinations:${ip}`];
  await Promise.all(keys.map(lockKey));
  const context = await browser.newContext({ extraHTTPHeaders: { "x-forwarded-for": ip } });
  try {
    for (const url of ["/api/airports?q=lon", "/api/destinations"]) {
      const limited = await context.request.get(url);
      expect(limited.status(), url).toBe(429);
      expect(Number(limited.headers()["retry-after"]), url).toBeGreaterThan(0);
      expect((await limited.json()).error).toMatch(/^För många anrop\. Försök igen om \d+ sekunder?\.$/);
    }
    // Not affected: a route of its own count, and a request from another address
    expect((await context.request.get("/api/destination-search?q=teufel")).status()).toBe(200);
    const other = await browser.newContext({ extraHTTPHeaders: { "x-forwarded-for": address(250) } });
    expect((await other.request.get("/api/airports?q=lon")).status()).toBe(200);
    await other.close();
  } finally {
    await context.close();
    await unlock([...keys, `api:destination-search:${ip}`, `api:airports:${address(250)}`]);
  }
});
