import { expect, test } from "@playwright/test";

// Prov för TECH-011-R4, tas bort: ett test som faller ska ge rött jobb och sparad rapport
test("TECH-011-R4 a failing test makes the job red", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Det här står inte på sidan");
});
