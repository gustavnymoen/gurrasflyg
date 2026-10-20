import { expect, test } from "@playwright/test";
import { requireAdminPassword, signIn } from "./helpers";

test("TRIP-002-R1 admin requires sign-in", async ({ page }) => {
  await page.goto("/admin");
  await expect(page).toHaveURL(/\/admin\/login$/);
  await expect(page.getByRole("heading", { name: "Admin" })).toBeVisible();
  await expect(page.getByLabel("Lösenord")).toBeVisible();
  await expect(page.getByRole("button", { name: "Logga in" })).toBeVisible();
});

test("TRIP-002-R2 wrong password shows an error", async ({ page }) => {
  await page.goto("/admin/login");
  await page.getByLabel("Lösenord").fill("definitely-not-the-password");
  await page.getByRole("button", { name: "Logga in" }).click();
  await expect(page.getByText("Fel lösenord.")).toBeVisible();
  await expect(page).toHaveURL(/\/admin\/login$/);
});

test("TRIP-002-R3 right password signs in", async ({ page }) => {
  requireAdminPassword();
  await signIn(page);
  await page.goto("/admin/login");
  await expect(page).toHaveURL(/\/admin$/);
});

test("TRIP-002-R4 sign-in is an HTTP-only session cookie", async ({ page, context }) => {
  requireAdminPassword();
  await signIn(page);
  const cookie = (await context.cookies()).find((c) => c.name === "gurrasflyg_admin");
  expect(cookie).toBeDefined();
  expect(cookie!.httpOnly).toBe(true);
  expect(cookie!.expires).toBe(-1); // no expiry date: deleted when the browser closes
});

test("TRIP-002-R5 forged sign-in is rejected", async ({ page, context, baseURL }) => {
  const expires = String(Date.now() + 60 * 60 * 1000);
  await context.addCookies([
    { name: "gurrasflyg_admin", value: `${expires}.${"0".repeat(64)}`, url: baseURL! },
  ]);
  await page.goto("/admin");
  await expect(page).toHaveURL(/\/admin\/login$/);
});

test("TRIP-002-R6 sign out", async ({ page }) => {
  requireAdminPassword();
  await signIn(page);
  await page.getByRole("button", { name: "Logga ut" }).click();
  await expect(page).toHaveURL(/\/admin\/login$/);
  await page.goto("/admin");
  await expect(page).toHaveURL(/\/admin\/login$/);
});
