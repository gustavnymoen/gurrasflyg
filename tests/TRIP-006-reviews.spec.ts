import { expect, test, type Page } from "@playwright/test";
import { deleteWithConfirmation, requireAdminPassword, reviewForm, signIn, uniqueName, writeReview } from "./helpers";

// Tests that need a known review create one with a unique name and delete it
// again, so they can also run against the live site.

const carousel = (page: Page) => page.getByRole("region", { name: "Omdömen" });
const focused = (page: Page) => carousel(page).locator('article[aria-hidden="false"]');

// The cards glide for half a second; wait until they stand still before
// clicking or swiping on them, like a person would
const cardsAtRest = (page: Page) =>
  page.waitForFunction(() => document.getAnimations().length === 0);

// A drag with the pointer from right to left across the card in focus
async function swipeLeft(page: Page) {
  const box = (await carousel(page).boundingBox())!;
  const [x, y] = [box.x + box.width / 2, box.y + box.height / 2];
  await page.mouse.move(x + 60, y);
  await page.mouse.down();
  await page.mouse.move(x - 60, y, { steps: 5 });
  await page.mouse.up();
}

// The first (newest) review in the admin list
const firstReviewRow = (page: Page) =>
  page.getByRole("row").filter({ has: page.getByRole("button", { name: /^Ta bort omdöme från/ }) }).first();

test.describe("start page", () => {
  test("TRIP-006-R1 the card in focus shows stars, title, text and name", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "Vad våra resenärer säger" })).toBeVisible();
    const card = focused(page);
    await expect(card).toHaveCount(1);
    await expect(card.getByRole("img", { name: /^[1-5] av 5 stjärnor$/ })).toBeVisible();
    await expect(card.getByRole("heading")).not.toBeEmpty();
    await expect(card.getByText(/^– /)).toBeVisible();
  });

  test("TRIP-006-R2 arrows, keys and clicks move the cards round", async ({ page }) => {
    await page.goto("/");
    await expect(focused(page)).toHaveCount(1); // the carousel is streamed in after the page
    const cards = carousel(page).locator("article");
    const count = await cards.count();
    test.skip(count < 3, "needs at least three reviews");
    // Cards out of focus are hidden from screen readers, so read the h3 directly
    const title = (i: number) => cards.nth(i).locator("h3").textContent();
    const [first, second, last] = [await title(0), await title(1), await title(count - 1)];
    const focusedTitle = focused(page).getByRole("heading");

    await expect(focusedTitle).toHaveText(first!);
    await page.getByRole("button", { name: "Nästa omdöme" }).click();
    await expect(focusedTitle).toHaveText(second!);
    await page.getByRole("button", { name: "Föregående omdöme" }).click();
    await expect(focusedTitle).toHaveText(first!);

    // Round: before the newest comes the oldest
    await page.getByRole("button", { name: "Föregående omdöme" }).click();
    await expect(focusedTitle).toHaveText(last!);

    await carousel(page).focus();
    await page.keyboard.press("ArrowRight");
    await expect(focusedTitle).toHaveText(first!);

    // The card to the right of the focused one
    await cardsAtRest(page);
    await cards.nth(1).click({ force: true });
    await expect(focusedTitle).toHaveText(second!);

    // Swipe right to left (a drag with the pointer) moves exactly one card; it
    // must not also count as a click on the card it ends on
    await cardsAtRest(page);
    await swipeLeft(page);
    await expect(focusedTitle).toHaveText((await title(2))!);
  });

});

test.describe("admin", () => {
  test.beforeEach(async ({ page }) => {
    requireAdminPassword();
    await signIn(page);
  });

  test("TRIP-006-R3 form has name, stars, title and text with a counter", async ({ page }) => {
    const form = reviewForm(page);
    const fields = form.locator("input, textarea, [role=radiogroup]");
    await expect(fields.nth(0)).toHaveAccessibleName("Namn på personen");
    await expect(fields.nth(1)).toHaveAccessibleName("Betyg");
    await expect(fields.nth(2)).toHaveAccessibleName("Rubrik");
    await expect(fields.nth(3)).toHaveAccessibleName("Text");
    // The limit is 145 characters since TRIP-021-R4
    await expect(form.getByText("0/145")).toBeVisible();

    await form.getByLabel("Text").fill("x".repeat(200));
    await expect(form.getByLabel("Text")).toHaveValue("x".repeat(145));
    await expect(form.getByText("145/145")).toBeVisible();
  });

  test("TRIP-006-R4 every field is required", async ({ page }) => {
    const form = reviewForm(page);
    const save = form.getByRole("button", { name: "Spara omdöme" });
    await save.click();
    await expect(form.getByText("Välj antal stjärnor.")).toBeVisible();

    await form.getByRole("radio", { name: "4 stjärnor" }).click();
    await save.click();
    await expect(form.getByText("Omdömet måste ha en rubrik.")).toBeVisible();

    await form.getByLabel("Rubrik").fill("Rubrik");
    await save.click();
    await expect(form.getByText("Ange vem som lämnat omdömet.")).toBeVisible();

    await form.getByLabel("Namn på personen").fill("Namn");
    await save.click();
    await expect(form.getByText("Skriv en text till omdömet.")).toBeVisible();
  });

  test("TRIP-006-R5 and R6 a saved review is listed and shown first, and can be deleted", async ({ page }) => {
    // A short prefix: names are at most 20 characters (TRIP-021-R4)
    const author = uniqueName("R");
    const title = "Bästa resan någonsin";
    await writeReview(page, { author, rating: 5, title, body: "Mjuk landning och god kaffe." });

    const form = reviewForm(page);
    await expect(form.getByText("Omdömet sparades.")).toBeVisible();
    await expect(form.getByLabel("Namn på personen")).toHaveValue("");
    await expect(form.getByLabel("Rubrik")).toHaveValue("");
    await expect(firstReviewRow(page).getByRole("cell").first()).toHaveText(author);
    const row = page.getByRole("row").filter({ hasText: author });
    await expect(row.getByRole("img", { name: "5 av 5 stjärnor" })).toBeVisible();

    await page.goto("/");
    await expect(focused(page).getByText(`– ${author}`)).toBeVisible();
    await expect(focused(page).getByRole("heading")).toHaveText(title);

    await page.goto("/admin");
    await page.getByRole("button", { name: `Ta bort omdöme från ${author}` }).click();
    await page.getByRole("alertdialog").getByRole("button", { name: "Nej" }).click();
    await expect(row).toBeVisible();
    await deleteWithConfirmation(page, `Ta bort omdöme från ${author}`);
    await expect(row).toHaveCount(0);

    await page.goto("/");
    await expect(carousel(page).getByText(`– ${author}`)).toHaveCount(0);
  });
});
