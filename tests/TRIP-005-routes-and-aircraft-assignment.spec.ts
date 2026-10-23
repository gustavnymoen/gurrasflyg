import { expect, test } from "@playwright/test";
import {
  createAircraft,
  deleteWithConfirmation,
  requireAdminPassword,
  runsLocally,
  signIn,
  uniqueName,
} from "./helpers";

// R1–R5 check the route data and are unit tests in db/migrations/002_routes_data.test.ts
// (TECH-015). R7–R9 replace every route's aircraft, which must not happen on
// the live site, so they run only locally.

test("TRIP-005-R6 admin page shows the assignment status", async ({ page }) => {
  requireAdminPassword();
  await signIn(page);
  await expect(page.getByRole("button", { name: "Tilldela plan" })).toBeVisible();
  await expect(page.getByText(/^\d+ av \d+ rutter har plan$/)).toBeVisible();
});

test.describe("assigning aircraft", () => {
  test.skip(!runsLocally, "would replace the live site's assignments");

  test.beforeEach(async ({ page }) => {
    requireAdminPassword();
    await signIn(page);
  });

  test("TRIP-005-R8 without aircraft nothing can be assigned", async ({ page }) => {
    await expect(page.getByText("Inga plan än.")).toBeVisible();
    await page.getByRole("button", { name: "Tilldela plan" }).click();
    await expect(page.getByText("Det finns inga plan att tilldela. Lägg till ett plan först.")).toBeVisible();
  });

  test("TRIP-005-R7 and R9 assign to every route, and deleting the aircraft clears them", async ({ page }) => {
    const name = uniqueName("Plan");
    await createAircraft(page, name, [{ name: "Ekonomi", seats: 150 }]);

    await page.getByRole("button", { name: "Tilldela plan" }).click();
    await expect(page.getByText("200 av 200 rutter har plan")).toBeVisible();
    const row = page.getByRole("row").filter({ has: page.getByRole("button", { name: `Ta bort ${name}` }) });
    await expect(row.getByRole("cell").nth(4)).toHaveText("200");

    await deleteWithConfirmation(page, `Ta bort ${name}`);
    await page.reload();
    await expect(page.getByText("0 av 200 rutter har plan")).toBeVisible();
  });
});
