import { expect, test, type Page } from "@playwright/test";
import { daysFromToday, expectNoA11yViolations, openResults } from "./helpers";

// fillInDelay() itself is a unit test (lib/flight-rules.test.ts). The routes
// have 5–7 departures a day, so R2's cap at the tenth card is tested there.

// The cards move in, so these tests ask for motion (the tests default to reduced motion)
test.use({ reducedMotion: "no-preference" });

const roundTrip = `/flyg?fran=ARN&till=LHR&utresa=${daysFromToday(1)}&hemresa=${daysFromToday(7)}&resenarer=1`;

const cards = (page: Page) => page.getByRole("listitem").filter({ has: page.getByRole("button", { name: /^\d\d:\d\d / }) });
const firstButton = (page: Page) => page.getByRole("button", { name: /^\d\d:\d\d / }).first();

// The animation of each card as the style gives it: its name and when it starts.
// Read from the style, not from the running animations, since a finished
// animation is no longer running and the check would depend on timing.
const animations = (page: Page) =>
  cards(page).evaluateAll((items) =>
    items.map((item) => {
      const { animationName, animationDelay } = getComputedStyle(item);
      return { name: animationName, delay: parseFloat(animationDelay) * 1000 };
    }),
  );

// Waits until every card is in place, so the next check does not depend on timing
const animationsDone = (page: Page) =>
  cards(page).evaluateAll((items) => Promise.all(items.flatMap((item) => item.getAnimations().map((a) => a.finished))));

async function expectNoAnimation(page: Page) {
  for (const animation of await animations(page)) expect(animation.name).toBe("none");
}

async function expectFillIn(page: Page) {
  const shown = await animations(page);
  expect(shown.length).toBeGreaterThan(1);
  shown.forEach((animation, i) => expect(animation).toEqual({ name: "fill-in", delay: i * 60 }));
}

test("TRIP-025-R1 the cards of the outbound and the return list fill in one after another", async ({ page }) => {
  await openResults(page, roundTrip);
  await expectFillIn(page);

  await firstButton(page).click();
  await page.getByRole("button", { name: "Välj" }).click();
  await expect(page.getByRole("heading", { level: 2, name: /^Hemresa/ })).toBeVisible();
  await expectFillIn(page);
});

test("TRIP-025-R2 a card can be chosen with the keyboard while the cards fill in", async ({ page }) => {
  await openResults(page, roundTrip);
  await firstButton(page).focus();
  await page.keyboard.press("Enter");
  await page.getByRole("button", { name: "Välj" }).focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("heading", { level: 2, name: /^Hemresa/ })).toBeVisible();
});

test("TRIP-025-R3 changing the sorting does not start the animation again", async ({ page }) => {
  await openResults(page, roundTrip);
  await animationsDone(page);
  await page.getByText("Pris", { exact: true }).click();
  await expectNoAnimation(page);
  await page.getByText("Avgångstid", { exact: true }).click();
  await expectNoAnimation(page);
});

test("TRIP-025-R1 the finished list has no accessibility violations", async ({ page }) => {
  await openResults(page, roundTrip);
  await animationsDone(page);
  await expectNoA11yViolations(page);
});

test.describe("with reduced motion", () => {
  test.use({ reducedMotion: "reduce" });

  test("TRIP-025-R4 the cards appear at once, without animation", async ({ page }) => {
    await openResults(page, roundTrip);
    await expectNoAnimation(page);
    await expect(cards(page).first()).toHaveCSS("opacity", "1");
    await expect(cards(page).last()).toHaveCSS("opacity", "1");
  });
});
