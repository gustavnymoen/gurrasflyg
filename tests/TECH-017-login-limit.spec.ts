import { expect, test } from "@playwright/test";
import { expectNoA11yViolations, runsLocally } from "./helpers";
import { inTestDb } from "./plan";

// The rules (counting, the window, clearing, the minutes) are unit tests in
// lib/login-limit.test.ts. Here the sign-in page shows the lock. The test
// uses an address of its own (x-forwarded-for) with five attempts already
// in the test database, so no other test is locked out and nothing waits.

test.skip(!process.env.ADMIN_PASSWORD || !runsLocally, "Writes to the test database: only against the local test server");

test("TECH-017-R2 R3 a locked address is refused even with the right password and told how long to wait", async ({
  browser,
}) => {
  const ip = `203.0.113.${Date.now() % 250}`;
  await inTestDb((db) =>
    db.execute({ sql: "INSERT INTO login_attempts (ip, attempts, last_failed_at) VALUES (?, 5, ?)", args: [ip, Date.now()] }),
  );
  const context = await browser.newContext({ extraHTTPHeaders: { "x-forwarded-for": ip } });
  try {
    const page = await context.newPage();
    await page.goto("/admin/login");
    await page.getByLabel("Lösenord").fill(process.env.ADMIN_PASSWORD ?? "");
    await page.getByRole("button", { name: "Logga in" }).click();
    await expect(page.getByText(/^För många försök\. Försök igen om (14|15) minuter\.$/)).toBeVisible();
    await expect(page).toHaveURL(/\/admin\/login$/);
    await expectNoA11yViolations(page);
  } finally {
    await context.close();
    await inTestDb((db) => db.execute({ sql: "DELETE FROM login_attempts WHERE ip = ?", args: [ip] }));
  }
});
