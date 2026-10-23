import { expect, test, type Page } from "@playwright/test";
import {
  ACCENT_STRONG,
  createAddon,
  createAircraft,
  createClass,
  deleteWithConfirmation,
  expectNoA11yViolations,
  requireAdminPassword,
  reviewForm,
  signIn,
  tableSection,
  uniqueName,
  writeReview,
} from "./helpers";

// TRIP-021-R1 checks with axe only the states no other feature's test checks:
// the start page, the date error and a wrong password are in TRIP-008, the
// start page with the photo and on a phone in TRIP-020, the admin page with
// its cards, the aircraft form, a dialog and an error message in TRIP-019.

test("TRIP-021-R1 axe finds no violations with the airport suggestions open", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("combobox", { name: "Från" }).fill("lon");
  await expect(page.getByRole("listbox").getByRole("option").first()).toBeVisible();
  await expectNoA11yViolations(page);
});

test("TRIP-021-R3 the review carousel shows the focus ring when it gets keyboard focus", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("checkbox", { name: "Boka returresa" }).focus();
  await page.keyboard.press("Tab");
  const carousel = page.getByRole("region", { name: "Omdömen" });
  await expect(carousel).toBeFocused();
  await expect(carousel).toHaveCSS("outline-style", "solid");
  await expect(carousel).toHaveCSS("outline-width", "2px");
  await expect(carousel).toHaveCSS("outline-color", ACCENT_STRONG);
});

test.describe("admin", () => {
  test.beforeEach(async ({ page }) => {
    requireAdminPassword();
    await signIn(page);
  });

  test("TRIP-021-R1 axe finds no violations on the admin page with an aircraft and its class unfolded", async ({
    page,
  }) => {
    const name = uniqueName("Plan");
    await createAircraft(page, name, [{ name: "Ekonomi", seats: 100 }]);

    await page.getByRole("button", { name: `Visa ${name}`, exact: true }).click();
    await page.getByRole("button", { name: "Visa Ekonomi" }).click();
    await expect(page.getByText("Inga addons i den här klassen.")).toBeVisible();
    await expectNoA11yViolations(page);

    await deleteWithConfirmation(page, `Ta bort ${name}`);
  });

  test("TRIP-021-R3 every field in the admin forms has a visible label", async ({ page }) => {
    const expectVisibleLabels = async (form: ReturnType<Page["locator"]>) => {
      const fields = form.locator("input, select, textarea");
      for (let i = 0; i < (await fields.count()); i++) {
        // The field's name comes from a visible <label for>, not only from aria-label
        const label = form.locator(`label[for="${await fields.nth(i).getAttribute("id")}"]`);
        await expect(label).toBeVisible();
        await expect(fields.nth(i)).toHaveAccessibleName((await label.textContent())!);
      }
    };
    await expectVisibleLabels(reviewForm(page));

    // The add-on picker in the aircraft form needs an add-on to choose
    const addon = uniqueName("Addon");
    await createAddon(page, addon, "0", "Test");
    await page.getByRole("button", { name: "Lägg till plan" }).click();
    // An add-on is chosen per class, so the aircraft needs a class first
    await page.getByRole("button", { name: "Lägg till klass" }).click();
    await page.getByLabel("Klass att lägga till").selectOption({ label: "Ekonomi" });
    await page.getByLabel("Antal platser", { exact: true }).fill("10");
    await page.getByRole("button", { name: "Lägg till klass" }).click();
    await page.getByRole("button", { name: "Lägg till klass" }).click();
    await page.getByRole("button", { name: "Lägg till addon" }).click();
    await expectVisibleLabels(page.locator("form").filter({ has: page.getByLabel("Planets namn") }));
    await page.reload(); // discards the aircraft form

    for (const heading of ["Klasser", "Addons"] as const) {
      const table = tableSection(page, heading);
      await table.getByRole("button", { name: "Lägg till", exact: true }).click();
      await expectVisibleLabels(table.locator("form"));
      await table.getByRole("button", { name: "Avbryt" }).click();
    }
    await deleteWithConfirmation(page, `Ta bort ${addon}`);
  });

  test("TRIP-021-R3 a dialog keeps focus inside, closes with Escape and gives focus back", async ({ page }) => {
    const name = uniqueName("Klass");
    await createClass(page, name);
    const trash = page.getByRole("button", { name: `Ta bort ${name}`, exact: true });

    await trash.focus();
    await page.keyboard.press("Enter");
    const dialog = page.getByRole("alertdialog");
    await expect(dialog.getByRole("button", { name: "Nej" })).toBeFocused();
    // Tab goes round the dialog's buttons and the browser's own controls (then
    // the page reports body as focused), never to the page behind it
    for (let i = 0; i < 4; i++) {
      await page.keyboard.press("Tab");
      expect(await dialog.evaluate((d) => d.contains(document.activeElement) || document.activeElement === document.body)).toBe(true);
    }
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(trash).toBeFocused();

    await deleteWithConfirmation(page, `Ta bort ${name}`);
  });

  test("TRIP-021-R4 the review form takes at most 20 characters of name and 25 of title", async ({ page }) => {
    const form = reviewForm(page);
    await form.getByLabel("Namn på personen").fill("n".repeat(30));
    await expect(form.getByLabel("Namn på personen")).toHaveValue("n".repeat(20));
    await form.getByLabel("Rubrik").fill("r".repeat(40));
    await expect(form.getByLabel("Rubrik")).toHaveValue("r".repeat(25));
    // The text's limit, 145, is checked by TRIP-006-R3
  });

  test("TRIP-021-R4 spaces before and after the name, title and text are not saved", async ({ page }) => {
    const author = uniqueName("R");
    // uniqueName("R") is at most 17 characters, so the spaces keep within the name's 20
    await writeReview(page, { author: ` ${author} `, rating: 3, title: "  Trimmad ", body: " Text med mellanslag  " });
    await expect(reviewForm(page).getByText("Omdömet sparades.")).toBeVisible();

    await page.goto("/");
    const card = page.locator('article[aria-hidden="false"]');
    // textContent, since toHaveText ignores spaces before and after
    expect(await card.locator("h3").textContent()).toBe("Trimmad");
    expect(await card.locator("p").first().textContent()).toBe("Text med mellanslag");
    expect(await card.locator("p").last().textContent()).toBe(`– ${author}`);

    await page.goto("/admin");
    await deleteWithConfirmation(page, `Ta bort omdöme från ${author}`);
  });

  test("TRIP-021-R4 a review of the longest allowed length fits the card, also with larger text spacing", async ({
    page,
  }) => {
    const author = uniqueName("R").padEnd(20, "x");
    const title = "Fick skjuta en lada igen!";
    const body =
      "Fick skjuta en lada efter vägen, kan varmt rekommendera F35 som färdmedel. Dock väldigt skakigt och bullrigt, fick heller inte plats med bagaget!";
    expect([author.length, title.length, body.length]).toEqual([20, 25, 145]);
    await writeReview(page, { author, rating: 2, title, body });
    await expect(reviewForm(page).getByText("Omdömet sparades.")).toBeVisible();

    await page.goto("/");
    const card = page.locator('article[aria-hidden="false"]');
    await expect(card.locator("h3")).toHaveText(title);
    // The whole text, without "…", and the card keeps its normal height (12 rem)
    expect(await card.locator("p").first().textContent()).toBe(body);
    await expect(card).toHaveCSS("height", "192px");
    expect(await clippedIn(card)).toEqual([]);

    // WCAG 1.4.12: line height 1.5, paragraph spacing 2, letter spacing 0.12, word spacing 0.16
    await page.addStyleTag({
      content:
        "* { line-height: 1.5 !important; letter-spacing: 0.12em !important; word-spacing: 0.16em !important; } p { margin-bottom: 2em !important; }",
    });
    expect(await clippedIn(card)).toEqual([]);

    await page.goto("/admin");
    await deleteWithConfirmation(page, `Ta bort omdöme från ${author}`);
  });
});

// Text in the card that is cut off: an element whose content is taller or
// wider than itself, or that reaches outside the card
function clippedIn(card: ReturnType<Page["locator"]>) {
  return card.evaluate((article) => {
    const box = article.getBoundingClientRect();
    return [...article.querySelectorAll("h3, p")]
      .filter((e) => {
        const r = e.getBoundingClientRect();
        return e.scrollHeight > e.clientHeight + 1 || e.scrollWidth > e.clientWidth + 1 || r.bottom > box.bottom;
      })
      .map((e) => e.textContent);
  });
}

test.describe("on a narrow phone", () => {
  test.use({ viewport: { width: 320, height: 640 } });

  test("TRIP-021-R3 at 320 px the admin page doesn't scroll sideways, the aircraft table scrolls in its card", async ({
    page,
  }) => {
    requireAdminPassword();
    await signIn(page);
    const name = uniqueName("Plan");
    await createAircraft(page, name, [{ name: "Ekonomi", seats: 100 }]);

    expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(0);
    await page.getByRole("button", { name: `Ta bort ${name}`, exact: true }).scrollIntoViewIfNeeded();
    await expect(page.getByRole("button", { name: `Ta bort ${name}`, exact: true })).toBeInViewport();

    await deleteWithConfirmation(page, `Ta bort ${name}`);
  });
});
