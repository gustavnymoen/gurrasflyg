import { expect, test, type Page } from "@playwright/test";
import { animationsDone, expectNoA11yViolations } from "./helpers";

// The browser's clock is fixed to Wednesday 21 October 2026, so the
// bookable days are 21 October 2026 to 21 April 2027. The window is wide
// (1280 px), so the calendar shows two months.
const TODAY = new Date(2026, 9, 21, 12);

const outboundField = (page: Page) => page.getByRole("combobox", { name: "Utresa" });
const returnField = (page: Page) => page.getByRole("combobox", { name: "Hemresa" });
const calendar = (page: Page) => page.getByRole("dialog", { name: "Välj datum" });
// A day in the calendar, by its full name, e.g. "fredag 13 november 2026"
const day = (page: Page, name: string) => calendar(page).getByRole("button", { name, exact: true });
const summary = (page: Page) => calendar(page).locator("p").last();
const dateMessage = (page: Page, text: string) => page.getByRole("alert").filter({ hasText: text });

// Chooses 13 and 20 November in the calendar
async function chooseNovemberWeek(page: Page) {
  await outboundField(page).click();
  await day(page, "fredag 13 november 2026").click();
  await day(page, "fredag 20 november 2026").click();
  await expect(calendar(page)).toBeHidden();
}

async function typeDate(page: Page, field: "Utresa" | "Hemresa", text: string) {
  const input = field === "Utresa" ? outboundField(page) : returnField(page);
  await input.fill(text);
  await input.press("Enter");
}

test.describe("in the browser", () => {
  test.beforeEach(async ({ page }) => {
    await page.clock.setFixedTime(TODAY);
    await page.goto("/");
  });

  test("TRIP-009-R1 the group Datum has the fields Utresa and Hemresa, and the calendar is closed", async ({ page }) => {
    const group = page.getByRole("group", { name: "Datum" });
    await expect(group.getByRole("combobox", { name: "Utresa" })).toHaveAttribute("placeholder", "dd/mm");
    await expect(group.getByRole("combobox", { name: "Hemresa" })).toHaveAttribute("placeholder", "dd/mm");
    await expect(calendar(page)).toBeHidden();
  });

  test("TRIP-009-R2 clicking Utresa opens the calendar and keeps focus in the field", async ({ page }) => {
    await outboundField(page).click();
    await expect(calendar(page)).toBeVisible();
    await expect(outboundField(page)).toBeFocused();
    await expect(calendar(page).getByText("Välj utresa")).toBeVisible();
  });

  test("TRIP-009-R2 Arrow down moves focus to today in the calendar", async ({ page }) => {
    await outboundField(page).press("ArrowDown");
    await expect(day(page, "onsdag 21 oktober 2026")).toBeFocused();
  });

  test("TRIP-009-R3 and R4 two months from this month, only today to the last bookable day can be chosen", async ({ page }) => {
    await outboundField(page).click();
    await expect(calendar(page).getByText("oktober 2026", { exact: true })).toBeVisible();
    await expect(calendar(page).getByText("november 2026", { exact: true })).toBeVisible();
    await expect(calendar(page).getByRole("button", { name: "Föregående månad" })).toBeDisabled();
    await expect(day(page, "tisdag 20 oktober 2026")).toHaveAttribute("aria-disabled", "true");
    await expect(day(page, "onsdag 21 oktober 2026")).not.toHaveAttribute("aria-disabled");

    const next = calendar(page).getByRole("button", { name: "Nästa månad" });
    // October and November shown; five months later March and April
    for (let i = 0; i < 5; i++) await next.click();
    await expect(next).toBeDisabled();
    await expect(calendar(page).getByRole("grid").last()).toHaveAccessibleName("april 2027");
    await expect(day(page, "onsdag 21 april 2027")).not.toHaveAttribute("aria-disabled");
    await expect(day(page, "torsdag 22 april 2027")).toHaveAttribute("aria-disabled", "true");
  });

  test("TRIP-009-R5 Tur och retur is on from the start, and the checkbox is gone", async ({ page }) => {
    await expect(page.getByRole("checkbox")).toHaveCount(0);
    await outboundField(page).click();
    await expect(calendar(page).getByRole("switch", { name: "Tur och retur" })).toBeChecked();
  });

  test("TRIP-009-R5 turning Tur och retur off hides Hemresa and keeps the outbound date", async ({ page }) => {
    await chooseNovemberWeek(page);
    await outboundField(page).click();
    const roundTrip = calendar(page).getByRole("switch", { name: "Tur och retur" });
    await roundTrip.click();
    await expect(returnField(page)).toBeHidden();
    await expect(outboundField(page)).toHaveValue("13/11");
    await expect(calendar(page).getByText("Välj datum")).toBeVisible();
    // One date to choose, so one month also on a wide screen, and no summary
    await expect(calendar(page).getByRole("grid")).toHaveCount(1);
    await expect(calendar(page).getByText(/^Utresa/)).toHaveCount(0);

    await roundTrip.click();
    await expect(returnField(page)).toHaveValue("");
  });

  test("TRIP-009-R6 choosing the outbound and return day, and changing the return day", async ({ page }) => {
    await outboundField(page).click();
    await day(page, "fredag 13 november 2026").click();
    await expect(returnField(page)).toBeFocused();
    await expect(calendar(page).getByText("Välj hemresa")).toBeVisible();
    await day(page, "fredag 20 november 2026").click();
    await expect(calendar(page)).toBeHidden();
    await expect(outboundField(page)).toHaveValue("13/11");
    await expect(returnField(page)).toHaveValue("20/11");

    await returnField(page).click();
    // The chosen days are marked as chosen, the days between are the range
    await expect(calendar(page).getByRole("gridcell", { selected: true })).toHaveText(["13", "20"]);
    await day(page, "fredag 27 november 2026").click();
    await expect(returnField(page)).toHaveValue("27/11");
    await expect(outboundField(page)).toHaveValue("13/11");
  });

  test("TRIP-009-R6 with Tur och retur off, choosing a day closes the calendar", async ({ page }) => {
    await outboundField(page).click();
    await calendar(page).getByRole("switch", { name: "Tur och retur" }).click();
    // One-way shows one month (R3): October, so on to November
    await calendar(page).getByRole("button", { name: "Nästa månad" }).click();
    await day(page, "fredag 13 november 2026").click();
    await expect(calendar(page)).toBeHidden();
    await expect(outboundField(page)).toHaveValue("13/11");
  });

  test("TRIP-009-R7 the return day is from the outbound day up to two months after it", async ({ page }) => {
    await outboundField(page).click();
    await day(page, "fredag 13 november 2026").click();
    await expect(day(page, "torsdag 12 november 2026")).toHaveAttribute("aria-disabled", "true");
    await expect(day(page, "fredag 13 november 2026")).not.toHaveAttribute("aria-disabled");

    const next = calendar(page).getByRole("button", { name: "Nästa månad" });
    await next.click();
    await next.click();
    await expect(day(page, "onsdag 13 januari 2027")).not.toHaveAttribute("aria-disabled");
    await expect(day(page, "torsdag 14 januari 2027")).toHaveAttribute("aria-disabled", "true");

    // A day trip: back on the outbound day
    await calendar(page).getByRole("button", { name: "Föregående månad" }).click();
    await calendar(page).getByRole("button", { name: "Föregående månad" }).click();
    await day(page, "fredag 13 november 2026").click();
    await expect(returnField(page)).toHaveValue("13/11");
  });

  test("TRIP-009-R7 a return day that no longer fits the new outbound day is removed", async ({ page }) => {
    await chooseNovemberWeek(page);
    await typeDate(page, "Utresa", "25/11");
    await expect(outboundField(page)).toHaveValue("25/11");
    await expect(returnField(page)).toHaveValue("");
  });

  // The formats and the year are unit tests of parseDate and formatShort in
  // lib/dates.test.ts; here only that the page reads a date on Enter and Tab.
  test("TRIP-009-R8 a typed date is read on Enter and when leaving the field", async ({ page }) => {
    await typeDate(page, "Utresa", "13/11");
    await expect(returnField(page)).toBeFocused();
    await expect(calendar(page).getByText("Välj hemresa")).toBeVisible();
    await expect(summary(page)).toHaveText("Utresa fre 13 nov · Hemresa –");

    await outboundField(page).fill("2027-01-05");
    await outboundField(page).press("Tab");
    await expect(outboundField(page)).toHaveValue("5/1");
    await expect(summary(page)).toHaveText("Utresa tis 5 jan · Hemresa –");

    // Enter on an unchanged date moves on, as a click on the day would
    await outboundField(page).click();
    await outboundField(page).press("Enter");
    await expect(returnField(page)).toBeFocused();
  });

  // Every message is a unit test of readDate in lib/dates.test.ts; here one for
  // each field, shown under the group, and that a valid date removes it.
  test("TRIP-009-R9 a typed date that can't be used gives a message under the group", async ({ page }) => {
    await typeDate(page, "Utresa", "31/2");
    await expect(dateMessage(page, "Skriv datumet som 13/11 eller 2026-11-13.")).toBeVisible();
    await expect(outboundField(page)).toHaveAttribute("aria-invalid", "true");
    await expect(outboundField(page)).toHaveValue("31/2");

    await typeDate(page, "Utresa", "13/11");
    await expect(page.getByRole("alert").filter({ hasText: /\S/ })).toHaveCount(0);
    await typeDate(page, "Hemresa", "14/1");
    await expect(dateMessage(page, "Hemresan kan vara max 2 månader efter utresan.")).toBeVisible();

    await typeDate(page, "Hemresa", "20/11");
    await expect(page.getByRole("alert").filter({ hasText: /\S/ })).toHaveCount(0);
    await expect(returnField(page)).not.toHaveAttribute("aria-invalid");
  });

  test("TRIP-009-R10 the summary shows the days with weekday and the number of nights", async ({ page }) => {
    await chooseNovemberWeek(page);
    await returnField(page).click();
    await expect(summary(page)).toHaveText("Utresa fre 13 nov · Hemresa fre 20 nov · 7 nätter");

    await day(page, "fredag 13 november 2026").click();
    await outboundField(page).click();
    await expect(summary(page)).toHaveText(/· Dagstur$/);
  });

  test("TRIP-009-R11 Escape closes the calendar and gives focus to the active field", async ({ page }) => {
    await outboundField(page).press("ArrowDown");
    await page.keyboard.press("Escape");
    await expect(calendar(page)).toBeHidden();
    await expect(outboundField(page)).toBeFocused();
  });

  test("TRIP-009-R11 a click outside closes the calendar and keeps the choice", async ({ page }) => {
    await outboundField(page).click();
    await day(page, "fredag 13 november 2026").click();
    await page.getByRole("heading", { level: 1 }).click();
    await expect(calendar(page)).toBeHidden();
    await expect(outboundField(page)).toHaveValue("13/11");
    await expect(returnField(page)).toHaveValue("");
  });

  test("TRIP-009-R12 the keyboard moves between days and months and chooses a day", async ({ page }) => {
    await outboundField(page).press("ArrowDown");
    await page.keyboard.press("PageDown");
    await expect(day(page, "lördag 21 november 2026")).toBeFocused();
    await page.keyboard.press("PageDown");
    // December was not shown; now it is
    await expect(day(page, "måndag 21 december 2026")).toBeFocused();
    await page.keyboard.press("Home");
    await expect(day(page, "måndag 21 december 2026")).toBeFocused();
    await page.keyboard.press("End");
    await expect(day(page, "söndag 27 december 2026")).toBeFocused();

    // Focus doesn't go before today
    await page.keyboard.press("Escape");
    await expect(outboundField(page)).toBeFocused();
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("ArrowUp");
    await expect(day(page, "onsdag 21 oktober 2026")).toBeFocused();

    await page.keyboard.press("ArrowRight");
    await page.keyboard.press("Enter");
    await expect(outboundField(page)).toHaveValue("22/10");
  });

  test("TRIP-009-R12 the month buttons work with the keyboard, and focus stays in the calendar", async ({ page }) => {
    await outboundField(page).press("ArrowDown");
    // From the day back past the switch to Nästa månad (Föregående is disabled)
    await page.keyboard.press("Shift+Tab");
    await page.keyboard.press("Shift+Tab");
    await expect(calendar(page).getByRole("button", { name: "Nästa månad" })).toBeFocused();
    for (let i = 0; i < 5; i++) await page.keyboard.press("Enter");
    // The button is disabled at March and April; focus moves to the first day shown
    await expect(calendar(page).getByRole("button", { name: "Nästa månad" })).toBeDisabled();
    await expect(day(page, "måndag 1 mars 2027")).toBeFocused();
  });

  test("TRIP-009-R12 axe finds no violations with the calendar open, a range chosen and a message", async ({ page }) => {
    // axe measures contrast only once the calendar has faded in
    await outboundField(page).click();
    await animationsDone(calendar(page));
    await expectNoA11yViolations(page);

    await day(page, "fredag 13 november 2026").click();
    await day(page, "fredag 20 november 2026").click();
    await returnField(page).click();
    await expect(calendar(page).getByRole("gridcell", { selected: true })).toHaveCount(2);
    await animationsDone(calendar(page));
    await expectNoA11yViolations(page);

    await typeDate(page, "Hemresa", "12/11");
    await expect(dateMessage(page, "Hemresan kan inte vara före utresan.")).toBeVisible();
    await expectNoA11yViolations(page);
  });

  test.describe("on a phone", () => {
    test.use({ viewport: { width: 390, height: 844 } });

    test("TRIP-009-R1 Utresa and Hemresa are side by side at the full width of the form", async ({ page }) => {
      const form = await page.locator("form").boundingBox();
      // The field's box is the input's parent
      const outbound = await outboundField(page).locator("xpath=..").boundingBox();
      const back = await returnField(page).locator("xpath=..").boundingBox();
      const travellers = await page.getByRole("group", { name: "Antal resenärer" }).boundingBox();
      expect(outbound!.x).toBeCloseTo(form!.x, 0);
      expect(back!.x + back!.width).toBeCloseTo(form!.x + form!.width, 0);
      expect(back!.y).toBeCloseTo(outbound!.y, 0);
      // Resenärer is on the row below
      expect(travellers!.y).toBeGreaterThan(outbound!.y + outbound!.height);
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
    });

    test("TRIP-009-R3 the calendar shows one month", async ({ page }) => {
      await outboundField(page).click();
      await expect(calendar(page).getByRole("grid")).toHaveCount(1);
    });
  });
});
