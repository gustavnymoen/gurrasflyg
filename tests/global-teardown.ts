import { chromium, type FullConfig } from "@playwright/test";

// Runs once after all tests. Tests delete what they create, but a test that
// fails halfway leaves its data behind. This removes everything named "E2E …"
// through the admin page, so the live site stays clean.
export default async function globalTeardown(config: FullConfig) {
  const baseURL = config.projects[0].use.baseURL;
  if (!process.env.ADMIN_PASSWORD || !baseURL) return;

  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({ baseURL });
    await page.goto("/admin/login");
    await page.getByLabel("Lösenord").fill(process.env.ADMIN_PASSWORD);
    await page.getByRole("button", { name: "Logga in" }).click();
    await page.waitForURL(/\/admin$/);
    await page.getByRole("button", { name: "Lägg till plan" }).waitFor();

    // Aircraft first, since they use classes and add-ons
    for (const pattern of [/^Ta bort (E2E Plan.*)$/, /^Ta bort omdöme från E2E/, /^Ta bort E2E/]) {
      const buttons = page.getByRole("button", { name: pattern });
      while ((await buttons.count()) > 0) {
        const label = (await buttons.first().getAttribute("aria-label"))!;
        await buttons.first().click();
        const dialog = page.getByRole("alertdialog");
        await dialog.getByRole("button", { name: "Ja" }).click();
        await page.getByRole("button", { name: label, exact: true }).waitFor({ state: "detached" });
        console.log(`Removed leftover test data: ${label}`);
      }
    }
  } finally {
    await browser.close();
  }
}
