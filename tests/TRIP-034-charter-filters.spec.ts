import { expect, test, type Page } from "@playwright/test";
import { expectNoA11yViolations, filterButton, filterOption, filterPanel, toggleFilterOption } from "./helpers";

// Styled multi-choice charter filters (TRIP-034). The rules (any-of within a filter,
// all-of between, the address, no dead choices) are unit tests in
// lib/destinations.test.ts; these tests show the control and the page using them.
// Nothing is written, so they also run against the live site.
// The look is checked in tests/TECH-018-design.spec.ts.

const heading = (page: Page, text: string | RegExp) => page.getByRole("heading", { name: text, exact: typeof text === "string" });
// "47 destinationer" -> 47
const resultCount = async (page: Page) =>
  Number((await page.getByRole("heading", { level: 2, name: /^\d+ destination(er)?$/ }).innerText()).match(/\d+/)![0]);

test("TRIP-034-R1 R5 a filter is a button with its name and choice, the panel opens with the keyboard and closes with Escape, a click outside or another filter", async ({
  page,
}) => {
  await page.goto("/charter");
  await page.waitForLoadState("networkidle"); // hydrated, so the click finds a working button
  // R1: no choice reads "Alla"
  const region = filterButton(page, "Världsdel");
  await expect(region).toHaveText("Världsdel: Alla");
  await expect(region).toHaveAttribute("aria-expanded", "false");
  await expectNoA11yViolations(page);

  // R1: Enter opens, each option shows its name and count, Tab moves to the checkboxes
  await region.focus();
  await page.keyboard.press("Enter");
  await expect(region).toHaveAttribute("aria-expanded", "true");
  await expect(filterOption(page, "Världsdel", "Europa")).toHaveAccessibleName("Europa (47)");
  await page.keyboard.press("Tab");
  await expect(filterPanel(page, "Världsdel").getByRole("checkbox").first()).toBeFocused();
  await expectNoA11yViolations(page);

  // R1: Escape closes the panel and focus goes back to the button
  await page.keyboard.press("Escape");
  await expect(region).toHaveAttribute("aria-expanded", "false");
  await expect(region).toBeFocused();
  await expect(filterPanel(page, "Världsdel")).toHaveCount(0);

  // R1: Space opens too, a click outside closes
  await page.keyboard.press("Space");
  await expect(filterPanel(page, "Världsdel")).toBeVisible();
  await heading(page, "Charter").click(); // the panel covers the list below
  await expect(filterPanel(page, "Världsdel")).toHaveCount(0);

  // R1: opening another filter closes the first
  await region.click();
  await filterButton(page, "Land").click();
  await expect(filterPanel(page, "Land")).toBeVisible();
  await expect(filterPanel(page, "Världsdel")).toHaveCount(0);

  // R1: one choice names it, more count them; R5: the button says it is expanded
  await toggleFilterOption(page, "Land", "Tyskland");
  await expect(filterButton(page, "Land")).toHaveText("Land: Tyskland");
  await toggleFilterOption(page, "Land", "Japan");
  await expect(filterButton(page, "Land")).toHaveText("Land: 2 valda");
  await expect(filterButton(page, "Land")).toHaveAttribute("aria-expanded", "true");
  await expectNoA11yViolations(page);
});

test("TRIP-034-R2 R3 R5 several choices give either-or within a filter, the address and back button follow, and focus stays on the checkbox", async ({
  page,
}) => {
  await page.goto("/charter");
  await page.waitForLoadState("networkidle");
  await toggleFilterOption(page, "Världsdel", "Europa");
  await expect(heading(page, "47 destinationer")).toBeVisible();
  const europe = 47;
  await expect(filterOption(page, "Världsdel", "Europa")).toBeFocused(); // R5: focus stays

  await toggleFilterOption(page, "Världsdel", "Asien");
  await expect(page).toHaveURL(/varldsdel=Europe&varldsdel=Asia$/);
  await expect(filterButton(page, "Världsdel")).toHaveText("Världsdel: 2 valda");
  // R2: either continent; the status announces the new number (TRIP-013-R9)
  const both = await resultCount(page);
  expect(both).toBeGreaterThan(europe);
  await expect(page.getByRole("status")).toHaveText(`${both} destinationer matchar`);

  // R2: between filters it is all-of, so only industrial sites in the continents
  await toggleFilterOption(page, "Kategori", "Industriplats");
  await expect(filterButton(page, "Kategori")).toHaveText("Kategori: Industriplats");
  const industrial = await resultCount(page);
  expect(industrial).toBeLessThan(both);
  expect(industrial).toBeGreaterThan(0);
  await expect(page.getByRole("heading", { level: 3 })).toHaveCount(industrial);

  // R3: reload keeps every choice; back steps back through them
  await page.reload();
  expect(await resultCount(page)).toBe(industrial);
  await expect(filterButton(page, "Världsdel")).toHaveText("Världsdel: 2 valda");
  await expect(filterButton(page, "Kategori")).toHaveText("Kategori: Industriplats");
  await page.goBack();
  await expect(filterButton(page, "Kategori")).toHaveText("Kategori: Alla");
  expect(await resultCount(page)).toBe(both);
});

test("TRIP-034-R2 R3 unchecking the last choice makes the filter Alla again, and an old link with one value works", async ({ page }) => {
  await page.goto("/charter?land=DE");
  await expect(filterButton(page, "Land")).toHaveText("Land: Tyskland");
  await page.waitForLoadState("networkidle");
  const german = await resultCount(page);
  await toggleFilterOption(page, "Land", "Tyskland");
  await expect(filterButton(page, "Land")).toHaveText("Land: Alla");
  await expect(heading(page, "96 destinationer")).toBeVisible();
  expect(german).toBeLessThan(96);

  // R3: a value no destination has is ignored, the others still count
  await page.goto("/charter?land=XX&land=DE&varldsdel=Atlantis");
  await expect(filterButton(page, "Land")).toHaveText("Land: Tyskland");
  await expect(filterButton(page, "Världsdel")).toHaveText("Världsdel: Alla");
  expect(await resultCount(page)).toBe(german);
});

test("TRIP-034-R3 the link back from a destination page carries all the choices", async ({ page }) => {
  await page.goto("/charter?varldsdel=Europe&varldsdel=Asia&tillgang=Open");
  const first = page.getByRole("heading", { level: 3 }).first();
  await first.locator("xpath=ancestor::section").getByRole("link").click();
  await expect(page.getByRole("link", { name: "← Tillbaka till listan" })).toHaveAttribute(
    "href",
    "/charter?varldsdel=Europe&varldsdel=Asia&tillgang=Open",
  );
  await page.getByRole("link", { name: "← Tillbaka till listan" }).click();
  await expect(filterButton(page, "Världsdel")).toHaveText("Världsdel: 2 valda");
  await expect(filterButton(page, "Tillträde")).toHaveText("Tillträde: Öppen");
});

test("TRIP-034-R4 a panel lists no option without hits except chosen ones, and a continent change unchecks the countries outside it", async ({
  page,
}) => {
  await page.goto("/charter?tillgang=Open&varldsdel=Antarctica");
  await page.waitForLoadState("networkidle");
  for (const label of ["Världsdel", "Land", "Tillträde", "Kategori"] as const) {
    await filterButton(page, label).click();
    const options = filterPanel(page, label).getByRole("checkbox");
    for (const option of await options.all()) {
      const name = await option.evaluate((el) => (el as HTMLInputElement).labels![0].textContent!);
      const checked = await option.isChecked();
      expect(checked || !name.endsWith("(0)"), `${label}: ${name}`).toBe(true);
    }
    await filterButton(page, label).click();
  }

  // A chosen option the other filters have emptied stays, checked, so it can be removed
  await page.goto("/charter?varldsdel=Antarctica&land=DE");
  await filterButton(page, "Land").click();
  await expect(filterOption(page, "Land", "Tyskland")).toBeChecked();
  await expect(filterOption(page, "Land", "Tyskland")).toHaveAccessibleName("Tyskland (0)");
  await expect(page.getByText("Inga destinationer matchar.")).toBeVisible();

  // Unchecking Asien drops Japan, keeps Tyskland and the other filters
  await page.goto("/charter?varldsdel=Europe&varldsdel=Asia&land=DE&land=JP&tillgang=Open");
  await page.waitForLoadState("networkidle");
  await toggleFilterOption(page, "Världsdel", "Asien");
  await expect(page).toHaveURL(/\?varldsdel=Europe&land=DE&tillgang=Open$/);
  await expect(filterButton(page, "Land")).toHaveText("Land: Tyskland");
  await expect(filterButton(page, "Tillträde")).toHaveText("Tillträde: Öppen");
});
