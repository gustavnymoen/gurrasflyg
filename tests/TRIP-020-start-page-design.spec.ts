import { expect, test, type Locator, type Page } from "@playwright/test";
import {
  BRASS,
  CARD_SHADOW,
  css,
  expectNoA11yViolations,
  requireAdminPassword,
  signIn,
} from "./helpers";

const wordmark = (page: Page) => page.getByRole("banner").getByRole("link", { name: "Gurras Flyg" });
// The plane and its contrail inside the wordmark's ring
const plane = (page: Page) => wordmark(page).locator("svg");
const trail = (page: Page) => wordmark(page).locator("span[aria-hidden]");

const carousel = (page: Page) => page.getByRole("region", { name: "Omdömen" });
const focusedReview = (page: Page) => carousel(page).locator('article[aria-hidden="false"]');

async function expectWordmarkLinksHome(page: Page) {
  await expect(wordmark(page)).toBeVisible();
  await expect(wordmark(page)).toHaveAttribute("href", "/");
}

// True when the page is wider than the window, so that it scrolls sideways
const scrollsSideways = (page: Page) =>
  page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);

const top = async (locator: Locator) => (await locator.boundingBox())!.y;

test("TRIP-020-R1 the header with the wordmark is on the start page and the sign-in page", async ({ page }) => {
  for (const path of ["/", "/admin/login"]) {
    await page.goto(path);
    await expectWordmarkLinksHome(page);
  }
  await wordmark(page).click();
  await expect(page).toHaveURL(/\/$/);
});

test("TRIP-020-R1 the header with the wordmark is on the admin page", async ({ page }) => {
  requireAdminPassword();
  await signIn(page);
  await expectWordmarkLinksHome(page);
});

// Records the name of every CSS animation that starts on the page, from the
// first moment, since the wordmark's take-off is removed once it has played
async function recordAnimations(page: Page) {
  await page.addInitScript(() => {
    const started: string[] = [];
    (window as unknown as { started: string[] }).started = started;
    document.addEventListener("animationstart", (e) => started.push(e.animationName), true);
  });
  return () => page.evaluate(() => (window as unknown as { started: string[] }).started);
}

test("TRIP-020-R1 the plane takes off into the ring when the page loads", async ({ page }) => {
  const started = await recordAnimations(page);
  await page.goto("/");
  await expect.poll(started).toEqual(expect.arrayContaining(["takeoff", "trail"]));

  // With the pointer over the wordmark, the plane makes a small hop
  await wordmark(page).hover();
  await expect.poll(started).toContain("hop");
});

test("TRIP-020-R1 the wordmark follows --font-display", async ({ page }) => {
  await page.goto("/");
  await page.addStyleTag({ content: ":root { --font-display: monospace !important; }" });
  await expect(wordmark(page)).toHaveCSS("font-family", "monospace");
});

test("TRIP-020-R2 the start page shows the heading, the text, the search form and the reviews in that order", async ({
  page,
}) => {
  await page.goto("/");
  const h1 = page.getByRole("heading", { level: 1 });
  await expect(h1).toHaveText("Vi ordnar det ingen annan kan");
  const text = page.getByText("Ditt livs flygresa, till städer och till platser andra flygbolag glömt bort.");
  const form = page.getByRole("combobox", { name: "Från" });
  const reviews = page.getByRole("heading", { name: "Vad våra resenärer säger" });
  await expect(reviews).toBeVisible();

  const order = [await top(h1), await top(text), await top(form), await top(reviews)];
  expect(order).toEqual([...order].sort((a, b) => a - b));
  // No colour gradient on the heading any more
  expect(await css(h1, "background-image")).toBe("none");
});

test("TRIP-020-R3 the photo is behind the heading, and the credit with both links is in the footer", async ({ page }) => {
  await page.goto("/");
  const photo = page.locator('img[src*="skymning"]');
  await expect(photo).toBeVisible();
  await expect(photo).toHaveAttribute("fetchpriority", "high");
  const photoBox = (await photo.boundingBox())!;
  const h1Box = (await page.getByRole("heading", { level: 1 }).boundingBox())!;
  expect(photoBox.y).toBeLessThanOrEqual(h1Box.y);
  expect(photoBox.y + photoBox.height).toBeGreaterThan(h1Box.y + h1Box.height);

  const footer = page.getByRole("contentinfo");
  await expect(footer).toContainText("Foto: Bill Abbott, CC BY-SA 2.0, via Wikimedia Commons");
  await expect(footer.getByRole("link", { name: "CC BY-SA 2.0" })).toHaveAttribute(
    "href",
    "https://creativecommons.org/licenses/by-sa/2.0",
  );
  await expect(footer.getByRole("link", { name: "Wikimedia Commons" })).toHaveAttribute(
    "href",
    /^https:\/\/commons\.wikimedia\.org\/wiki\/File:Boeing_757_climbing_after_the_sunset/,
  );
});

test("TRIP-020-R3 the credit is only on the start page", async ({ page }) => {
  await page.goto("/admin/login");
  await expect(page.getByRole("contentinfo")).not.toContainText("Bill Abbott");
});

// The border is checked by TRIP-022-R2
test("TRIP-020-R4 the card in focus is at most 15 × 12 rem, with the card shadow and the name in brass", async ({
  page,
}) => {
  await page.goto("/");
  const card = focusedReview(page);
  await expect(card).toHaveCount(1);
  const box = (await card.boundingBox())!;
  expect(box.width).toBeLessThanOrEqual(15 * 16);
  expect(box.height).toBeLessThanOrEqual(12 * 16);
  expect(await css(card, "box-shadow")).toContain(CARD_SHADOW);
  await expect(card.getByText(/^– /)).toHaveCSS("color", BRASS);
});

test("TRIP-020-R5 without reduced motion the carousel slides", async ({ page }) => {
  await page.goto("/");
  expect(await css(focusedReview(page), "transition-property")).toContain("transform");
});

test.describe("with reduced motion", () => {
  test.use({ reducedMotion: "reduce" });

  test("TRIP-020-R1 and R5 the wordmark doesn't move", async ({ page }) => {
    const started = await recordAnimations(page);
    await page.goto("/");
    await expect(plane(page)).toHaveCSS("animation-name", "none");
    await expect(trail(page)).toHaveCSS("animation-name", "none");
    await wordmark(page).hover();
    await expect(plane(page).locator("xpath=..")).toHaveCSS("animation-name", "none");
    expect(await started()).toEqual([]);
  });

  test("TRIP-020-R5 the carousel changes card without sliding", async ({ page }) => {
    await page.goto("/");
    await expect(focusedReview(page)).toHaveCount(1);
    const first = await focusedReview(page).locator("h3").textContent();
    await page.getByRole("button", { name: "Nästa omdöme" }).click();
    await expect(focusedReview(page).locator("h3")).not.toHaveText(first!);
    expect(await css(focusedReview(page), "transition-property")).not.toContain("transform");
  });
});

test.describe("on a phone", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("TRIP-020-R6 the start page and the sign-in page don't scroll sideways", async ({ page }) => {
    for (const path of ["/", "/admin/login"]) {
      await page.goto(path);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      expect(await scrollsSideways(page)).toBe(false);
    }
  });

  test("TRIP-020-R6 the admin page doesn't scroll sideways", async ({ page }) => {
    requireAdminPassword();
    await signIn(page);
    await expect(page.getByRole("button", { name: "Lägg till plan" })).toBeVisible();
    expect(await scrollsSideways(page)).toBe(false);
  });

  // The date group and Resenärer on a phone changed with TRIP-009 and are checked by TRIP-009-R1
  test("TRIP-020-R6 Från and Till are full width, one above the other", async ({ page }) => {
    await page.goto("/");
    const box = async (label: string) => (await page.getByText(label, { exact: true }).locator("xpath=..").boundingBox())!;
    const [from, to] = [await box("Från"), await box("Till")];
    expect(to.width).toBeCloseTo(from.width, 0);
    expect(to.x).toBeCloseTo(from.x, 0);
    expect(to.y).toBeGreaterThan(from.y);
  });

  test("TRIP-020 accessibility: axe finds no violations on the start page on a phone", async ({ page }) => {
    await page.goto("/");
    await expect(focusedReview(page)).toHaveCount(1);
    await expectNoA11yViolations(page);
  });
});

test("TRIP-020 accessibility: axe finds no violations on the start page with the photo", async ({ page }) => {
  await page.goto("/");
  await expect(focusedReview(page)).toHaveCount(1);
  await expectNoA11yViolations(page);
});
