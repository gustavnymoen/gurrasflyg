import { expect, test } from "@playwright/test";
import { requireAdminPassword, signIn } from "./helpers";

// R2, R4 and R5 are about the GitHub workflows and are checked on GitHub
// (see verification.md). R3's parser is a unit test in lib/numbers.test.ts (TECH-015). The admin test only opens the aircraft form and
// saves nothing.

test("TECH-007-R3 the seats field accepts only whole numbers", async ({ page }) => {
  requireAdminPassword();
  await signIn(page);
  await page.getByRole("button", { name: "Lägg till plan" }).click();
  const f = page.locator("form").filter({ has: page.getByLabel("Planets namn") });
  await f.getByRole("button", { name: "Lägg till klass" }).click();
  await f.getByLabel("Klass att lägga till").selectOption({ label: "Ekonomi" });
  const seats = f.getByLabel("Antal platser", { exact: true });
  const plus = f.getByRole("button", { name: "Lägg till klass" });

  for (const notWhole of ["1e2", "12.0"]) {
    await seats.fill(notWhole);
    await expect(plus, notWhole).toHaveAttribute("aria-disabled", "true");
  }
  await seats.fill("120");
  await plus.click();
  await expect(f.getByText("120 platser")).toBeVisible();

  // Samma regler när antalet ändras
  await f.getByRole("button", { name: "Ändra platser i Ekonomi" }).click();
  const edit = f.getByLabel("Antal platser i Ekonomi");
  const done = f.getByRole("button", { name: "Klar" });
  for (const notWhole of ["1e2", "12.0"]) {
    await edit.fill(notWhole);
    await expect(done, notWhole).toBeDisabled();
  }
  await edit.fill("1 200");
  await done.click();
  await expect(f.getByText("1200 platser")).toBeVisible();

  await f.getByRole("button", { name: "Avbryt", exact: true }).click();
});
