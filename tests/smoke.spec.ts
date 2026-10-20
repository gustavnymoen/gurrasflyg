import { expect, test } from "@playwright/test";

test("SMOKE-1 home page loads", async ({ page }) => {
  const response = await page.goto("/");
  expect(response?.ok()).toBe(true);
  await expect(page).toHaveTitle(/Gurras Flyg/);
});

test("SMOKE-2 backend answers", async ({ request }) => {
  const response = await request.get("/api/destinations");
  expect(response.ok()).toBe(true);
});
