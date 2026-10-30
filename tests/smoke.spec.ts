import { expect, test } from "@playwright/test";

test("SMOKE-1 home page loads", async ({ page }) => {
  const response = await page.goto("/");
  expect(response?.ok()).toBe(true);
  await expect(page).toHaveTitle(/Gurras Flyg/);
  // TECH-026-R3: the security headers; Vercel may add "; preload" to the HSTS value
  const headers = response!.headers();
  expect(headers["content-security-policy"]).toContain("default-src 'self'");
  expect(headers["permissions-policy"]).toBe("camera=(), microphone=(), geolocation=()");
  expect(headers["strict-transport-security"]).toContain("max-age=63072000; includeSubDomains");
});

test("SMOKE-2 backend answers", async ({ request }) => {
  const response = await request.get("/api/destinations");
  expect(response.ok()).toBe(true);
});
