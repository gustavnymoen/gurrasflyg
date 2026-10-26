import { expect, type Locator, type Page } from "@playwright/test";
import { expectNoA11yViolations, openResults } from "./helpers";
import { fillPassenger, openBooking, openPlan, searchUrl, test } from "./plan";

// isInFlow() itself (which paths are a flow) is a unit test, lib/flow.test.ts.
// The header with Avbryt, the wordmark and the footer's Start are the same on
// every flow page, so Avbryt on /flyg/boka/betala is covered by that test and
// by the other flow pages.

const tab = (page: Page, name: "Flyg" | "Charter") => page.getByRole("tab", { name });
const flightForm = (page: Page) => page.getByRole("combobox", { name: "Från" });
const charterLink = (page: Page) => page.getByRole("link", { name: "Utforska charterresor" });
const dialog = (page: Page) => page.getByRole("dialog", { name: "Är du säker?" });
const avbryt = (page: Page) => page.getByRole("banner").getByRole("button", { name: "Avbryt" });
const wordmark = (page: Page) => page.getByRole("banner").getByRole("button", { name: "Gurras Flyg" });
const footerStart = (page: Page) => page.getByRole("contentinfo").getByRole("button", { name: "Start" });
const stored = (page: Page) =>
  page.evaluate(() => [sessionStorage.getItem("gurrasflyg-bokning"), sessionStorage.getItem("gurrasflyg-bokad")]);

test.describe("start page tabs", () => {
  test("TRIP-018-R1 @smoke the start page has the tabs Flyg and Charter, with Flyg selected and the flight form shown", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(page.getByRole("tablist")).toBeVisible();
    await expect(tab(page, "Flyg")).toHaveAttribute("aria-selected", "true");
    await expect(tab(page, "Charter")).toHaveAttribute("aria-selected", "false");
    await expect(flightForm(page)).toBeVisible();
    await expect(charterLink(page)).toBeHidden();
  });

  test("TRIP-018-R1 choosing Charter shows the text and the link and hides the form, and Flyg shows the form again", async ({
    page,
  }) => {
    await page.goto("/");
    await tab(page, "Charter").click();
    await expect(tab(page, "Charter")).toHaveAttribute("aria-selected", "true");
    await expect(charterLink(page)).toHaveAttribute("href", "/charter");
    await expect(page.getByRole("tabpanel")).toContainText("Charterresor till");
    await expect(flightForm(page)).toBeHidden();
    await expectNoA11yViolations(page);

    await tab(page, "Flyg").click();
    await expect(flightForm(page)).toBeVisible();
    await expect(charterLink(page)).toBeHidden();
    await expectNoA11yViolations(page);
  });

  test("TRIP-018-R1 the arrow keys move between the tabs, and Tab goes to the panel", async ({ page }) => {
    await page.goto("/");
    await tab(page, "Flyg").focus();
    await page.keyboard.press("ArrowRight");
    await expect(tab(page, "Charter")).toBeFocused();
    await expect(tab(page, "Charter")).toHaveAttribute("aria-selected", "true");
    await expect(charterLink(page)).toBeVisible();
    await page.keyboard.press("ArrowRight");
    await expect(tab(page, "Flyg")).toBeFocused();
    await page.keyboard.press("ArrowLeft");
    await expect(tab(page, "Charter")).toBeFocused();
    await page.keyboard.press("Home");
    await expect(tab(page, "Flyg")).toBeFocused();
    await page.keyboard.press("End");
    await expect(tab(page, "Charter")).toBeFocused();
    // Only the selected tab is in the tab order
    await expect(tab(page, "Flyg")).toHaveAttribute("tabindex", "-1");
    await page.keyboard.press("Tab");
    await expect(charterLink(page)).toBeFocused();
  });

  test("TRIP-018-R1 the flight search still works, and what was typed stays when switching tabs", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("combobox", { name: "Från" }).fill("Arl");
    await tab(page, "Charter").click();
    await tab(page, "Flyg").click();
    await expect(page.getByRole("combobox", { name: "Från" })).toHaveValue("Arl");

    await page.getByRole("button", { name: "Sök" }).click();
    await expect(page.getByText("Välj var du vill flyga från.")).toBeVisible();
  });

  test("TRIP-018-R1 the Charter link opens /charter, which has the heading Charter", async ({ page }) => {
    await page.goto("/");
    await tab(page, "Charter").click();
    await charterLink(page).click();
    await expect(page).toHaveURL(/\/charter$/);
    await expect(page.getByRole("heading", { level: 1, name: "Charter" })).toBeVisible();
  });

  test("TRIP-018-R3 @smoke /charter loads with its heading", async ({ page }) => {
    await page.goto("/charter");
    await expect(page.getByRole("heading", { level: 1, name: "Charter" })).toBeVisible();
  });
});

test.describe("one area at a time", () => {
  test("TRIP-018-R2 /charter has no link into /flyg, and its link to the start page asks first", async ({ page }) => {
    await page.goto("/charter");
    await expect(page.locator('a[href^="/flyg"]')).toHaveCount(0);
    await expect(page.locator('a[href="/"]')).toHaveCount(0);
    await expect(avbryt(page)).toBeVisible();
    await expect(wordmark(page)).toBeVisible();
    await expect(footerStart(page)).toBeVisible();
    await expect(page.getByRole("contentinfo").getByRole("link", { name: "Admin" })).toBeVisible();
  });

  test("TRIP-018-R2 the results page has no link to /charter or the start page", async ({ page }) => {
    await openResults(page, searchUrl(1, false));
    await expect(page.locator('a[href^="/charter"]')).toHaveCount(0);
    await expect(page.locator('a[href="/"]')).toHaveCount(0);
    await expect(page.getByRole("tab")).toHaveCount(0);
    await expect(avbryt(page)).toBeVisible();
  });

  test("TRIP-018-R2 the plan page has no link to /charter or the start page", async ({ page }) => {
    await openPlan(page, 1);
    await expect(page.locator('a[href^="/charter"]')).toHaveCount(0);
    await expect(page.locator('a[href="/"]')).toHaveCount(0);
    await expect(avbryt(page)).toBeVisible();
  });

  test("TRIP-018-R2 the link out of an incomplete address asks before going to the start page", async ({ page }) => {
    await page.goto("/flyg/plan");
    await expect(page.locator('a[href="/"]')).toHaveCount(0);
    await page.getByRole("main").getByRole("button", { name: "Till sökningen" }).click();
    await expect(dialog(page)).toBeVisible();
    await dialog(page).getByRole("button", { name: "Ja, avbryt" }).click();
    await expect(page).toHaveURL(/\/$/);
  });

  test("TRIP-018-R2 the start page and the summary of a made booking link to each other normally", async ({ page }) => {
    await page.goto("/flyg/bokad");
    await expect(avbryt(page)).toHaveCount(0);
    await expect(page.getByRole("banner").getByRole("link", { name: "Gurras Flyg" })).toHaveAttribute("href", "/");
    await page.goto("/");
    await expect(avbryt(page)).toHaveCount(0);
  });
});

// A flow page opened in each way, with something chosen
const flows: { name: string; open: (page: Page) => Promise<void> }[] = [
  { name: "results", open: (page) => openResults(page, searchUrl(1, false)) },
  {
    name: "plan",
    open: async (page) => {
      await openPlan(page, 1);
    },
  },
  { name: "charter", open: (page) => page.goto("/charter").then(() => undefined) },
];

test.describe("abort the flow", () => {
  for (const flow of flows) {
    test(`TRIP-018-R3 on ${flow.name}: Avbryt asks, Ja, avbryt clears the booking and goes to the start page`, async ({
      page,
    }) => {
      await flow.open(page);
      await page.evaluate(() => {
        sessionStorage.setItem("gurrasflyg-bokning", "{}");
        sessionStorage.setItem("gurrasflyg-bokad", "{}");
      });
      await avbryt(page).click();
      await expect(dialog(page)).toBeVisible();
      await expect(dialog(page)).toContainText("kastas bort");
      await dialog(page).getByRole("button", { name: "Ja, avbryt" }).click();

      await expect(page).toHaveURL(/\/$/);
      await expect(tab(page, "Flyg")).toBeVisible();
      expect(await stored(page)).toEqual([null, null]);
      await expect(dialog(page)).toHaveCount(0);
      await expect(avbryt(page)).toHaveCount(0);
    });
  }

  test("TRIP-018-R3 Nej, fortsätt, Escape and a click outside keep the page and its choices", async ({ page }) => {
    await openPlan(page, 1);
    await page.evaluate(() => sessionStorage.setItem("gurrasflyg-bokning", "{}"));
    const url = page.url();

    await avbryt(page).click();
    await dialog(page).getByRole("button", { name: "Nej, fortsätt" }).click();
    await expect(dialog(page)).toHaveCount(0);

    await avbryt(page).click();
    await expect(dialog(page)).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(dialog(page)).toHaveCount(0);

    await avbryt(page).click();
    await expect(dialog(page)).toBeVisible();
    await page.mouse.click(5, 5);
    await expect(dialog(page)).toHaveCount(0);

    expect(page.url()).toBe(url);
    await expect(page.getByRole("heading", { name: "Plan för utresan" })).toBeVisible();
    expect((await stored(page))[0]).toBe("{}");
  });

  test("TRIP-018-R3 the wordmark and the footer's Start open the same question", async ({ page }) => {
    await page.goto("/charter");
    for (const opener of [wordmark(page), footerStart(page)]) {
      await opener.click();
      await expect(dialog(page)).toBeVisible();
      await dialog(page).getByRole("button", { name: "Nej, fortsätt" }).click();
      await expect(page).toHaveURL(/\/charter$/);
    }
    await wordmark(page).click();
    await dialog(page).getByRole("button", { name: "Ja, avbryt" }).click();
    await expect(page).toHaveURL(/\/$/);
  });

  test("TRIP-018-R3 on the booking page Ja, avbryt removes what was filled in", async ({ page, fleet }) => {
    await openBooking(page, fleet.large, { [fleet.base]: 1 });
    await fillPassenger(page, 1, "E2E Resenär 1");
    expect((await stored(page))[0]).toContain("E2E Resenär 1");

    await avbryt(page).click();
    await dialog(page).getByRole("button", { name: "Ja, avbryt" }).click();
    await expect(page).toHaveURL(/\/$/);
    expect(await stored(page)).toEqual([null, null]);
  });
});

test.describe("the dialog", () => {
  const focusIsInside = (page: Page, box: Locator) =>
    box.evaluate((el) => el.contains(document.activeElement));

  test("TRIP-018-R4 is a modal with a heading, moves focus in and keeps it there, and returns it", async ({ page }) => {
    await page.goto("/charter");
    await avbryt(page).click();
    await expect(dialog(page)).toHaveAttribute("aria-modal", "true");
    await expect(dialog(page).getByRole("heading", { name: "Är du säker?" })).toBeVisible();
    // Focus starts on the safe choice
    await expect(dialog(page).getByRole("button", { name: "Nej, fortsätt" })).toBeFocused();
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press("Tab");
      expect(await focusIsInside(page, dialog(page))).toBe(true);
    }
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press("Shift+Tab");
      expect(await focusIsInside(page, dialog(page))).toBe(true);
    }

    await page.keyboard.press("Escape");
    await expect(dialog(page)).toHaveCount(0);
    await expect(avbryt(page)).toBeFocused();

    await wordmark(page).click();
    await dialog(page).getByRole("button", { name: "Nej, fortsätt" }).click();
    await expect(wordmark(page)).toBeFocused();
  });

  test("TRIP-018-R4 axe finds no violations with the dialog open on /charter and on the plan page", async ({ page }) => {
    await page.goto("/charter");
    await avbryt(page).click();
    await expect(dialog(page)).toBeVisible();
    await expectNoA11yViolations(page);

    await openPlan(page, 1);
    await avbryt(page).click();
    await expect(dialog(page)).toBeVisible();
    await expectNoA11yViolations(page);
  });

  test.describe("on a phone", () => {
    test.use({ viewport: { width: 320, height: 640 } });

    test("TRIP-018-R4 fits without scrolling sideways", async ({ page }) => {
      await page.goto("/charter");
      await avbryt(page).click();
      await expect(dialog(page)).toBeVisible();
      const box = await dialog(page).boundingBox();
      expect(box!.x).toBeGreaterThanOrEqual(0);
      expect(box!.x + box!.width).toBeLessThanOrEqual(320);
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
    });
  });
});
