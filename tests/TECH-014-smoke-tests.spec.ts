import { expect, test } from "@playwright/test";

// Smoke tests: a few fast checks that a deployed site works, run against the
// preview and production after every deploy (npm run test:smoke). They only
// read: no sign-in, no secrets, no data written. Each has "@smoke" in its name.

test("TECH-014-R2 @smoke the start page loads with its heading and search form", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.getByRole("combobox", { name: "Från" })).toBeVisible();
  await expect(page.getByRole("combobox", { name: "Till" })).toBeVisible();
});

test("TECH-014-R2 @smoke the reviews are shown on the start page", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("region", { name: "Omdömen" }).locator("article").first()).toBeVisible();
});

test("TECH-014-R2 @smoke the airport search answers with airports", async ({ request }) => {
  const response = await request.get("/api/airports?q=sto");
  expect(response.ok()).toBe(true);
  const airports: { iata: string }[] = await response.json();
  expect(airports.map((a) => a.iata)).toContain("ARN");
});

test("TECH-014-R2 @smoke admin sends a visitor without sign-in to the sign-in page", async ({ page }) => {
  await page.goto("/admin");
  await expect(page).toHaveURL(/\/admin\/login$/);
  await expect(page.getByLabel("Lösenord")).toBeVisible();
});

test("TECH-014-R2 @smoke the charter data answers with destinations", async ({ request }) => {
  const response = await request.get("/api/destinations");
  expect(response.ok()).toBe(true);
  const destinations: unknown[] = await response.json();
  expect(destinations.length).toBeGreaterThan(0);
});
