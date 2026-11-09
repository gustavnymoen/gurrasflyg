import { chromium, type Browser, type FullConfig, type FullProject } from "@playwright/test";

// Runs once after all tests. Tests delete what they create, but a test that
// fails halfway leaves its data behind. This removes everything named "E2E …"
// through the admin page, so the live site stays clean. Locally every lane
// has its own site (TECH-030), so each one is cleaned.
export default async function globalTeardown(config: FullConfig) {
  if (!process.env.ADMIN_PASSWORD) return;

  const browser = await chromium.launch();
  try {
    for (const { use } of config.projects) {
      if (use.baseURL) await removeLeftovers(browser, use);
    }
  } finally {
    await browser.close();
  }
}

async function removeLeftovers(browser: Browser, { baseURL, extraHTTPHeaders }: FullProject["use"]) {
  const page = await browser.newPage({ baseURL, extraHTTPHeaders });
  try {
    await page.goto("/admin/login");
    await page.getByLabel("Lösenord").fill(process.env.ADMIN_PASSWORD ?? "");
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
    await page.close();
  }
}
