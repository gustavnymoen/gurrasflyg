import { expect, test, type Page } from "@playwright/test";
import { agnetaGreeted, expectNoA11yViolations } from "./helpers";

// Agnetas panel och svar (TRIP-035). Svaren är fasta (routen) eller låtsasklientens (LLM_MOCK=1),
// så inget kostar kursens tak. Utseendet (rullist, bubblornas bredd, bildens storlek) finns i
// tests/TECH-018-design.spec.ts.

const openButton = (page: Page) => page.getByRole("button", { name: "Fråga Agneta" });
const panel = (page: Page) => page.getByRole("region", { name: "Agneta" });
const picture = (page: Page) => panel(page).getByRole("button", { name: "Förstora bilden på Agneta" });

// En egen adress, så att frågorna inte räknas med de andra provens (10 på 5 minuter)
test.use({ extraHTTPHeaders: { "x-forwarded-for": "10.35.0.1" } });
test.beforeEach(({ page }) => agnetaGreeted(page));

const items = (n: number) => Array.from({ length: n }, (_, i) => `- Resmål ${i + 1}\n  - Flygplats ${i + 1}, från ${i + 1}00 kr`).join("\n");

async function askFor(page: Page, reply: object) {
  await page.route("**/api/chat", (route) => route.fulfill({ json: reply }));
  await page.goto("/");
  await openButton(page).click();
  await page.getByLabel("Din fråga").fill("Vilka resmål finns?");
  await page.getByLabel("Din fråga").press("Enter");
  return panel(page).getByRole("log").locator("> div").nth(2);
}

test("TRIP-035-R6 a list of 4 or more shows 3 items and Visa mer unfolds and folds the rest, with its sub-bullets", async ({ page }) => {
  const bubble = await askFor(page, { reply: `Här.\n${items(5)}\nSlut.` });
  await expect(bubble.getByRole("listitem")).toHaveCount(6); // 3 punkter och deras underpunkter
  await expect(bubble).toContainText("Resmål 3");
  await expect(bubble).not.toContainText("Resmål 4"); // vikt: inte heller i tillgänglighetsträdet
  await expect(bubble).toContainText("Slut.");
  await expectNoA11yViolations(page);

  const more = bubble.getByRole("button", { name: "Visa mer" });
  await expect(more).toHaveAttribute("aria-expanded", "false");
  await more.click();
  await expect(bubble).toContainText("Resmål 5");
  await expect(bubble.getByRole("button", { name: "Visa mindre" })).toHaveAttribute("aria-expanded", "true");
  await expectNoA11yViolations(page);
  await bubble.getByRole("button", { name: "Visa mindre" }).click();
  await expect(bubble).not.toContainText("Resmål 4");
});

test("TRIP-035-R6 a list of 3 is never folded", async ({ page }) => {
  const bubble = await askFor(page, { reply: items(3) });
  await expect(bubble).toContainText("Resmål 3");
  await expect(bubble.getByRole("button")).toHaveCount(0);
});

test("TRIP-035-R6 an answer with all: true (the route removed [[ALL]]) is not folded", async ({ page }) => {
  const bubble = await askFor(page, { reply: items(5), all: true });
  await expect(bubble).toContainText("Resmål 5");
  await expect(bubble.getByRole("button")).toHaveCount(0);
});

test("TRIP-035-R6 Visa mer sits beside Hjälp mig, and Hjälp mig works while the list is folded", async ({ page }) => {
  const bubble = await askFor(page, { reply: `Nej.\n${items(4)}`, help: true });
  await expect(bubble.getByRole("button", { name: "Visa mer" })).toBeVisible();
  await bubble.getByRole("button", { name: "Hjälp mig" }).click();
  await expect(panel(page).getByText("Agneta hjälper dig", { exact: true })).toBeVisible();
});

test("TRIP-035-R6 the mock's whole list for a follow-up question is not folded, the first answer is", async ({ page }) => {
  test.skip(!process.env.LLM_MOCK && !!process.env.BASE_URL?.includes("vercel.app"), "needs the mock");
  await page.goto("/");
  await openButton(page).click();
  const log = panel(page).getByRole("log");
  await page.getByLabel("Din fråga").fill("LISTA5");
  await page.getByLabel("Din fråga").press("Enter");
  await expect(log).toContainText("Det var allt.");
  await expect(log).not.toContainText("Oslo");
  await page.getByLabel("Din fråga").fill("FLER");
  await page.getByLabel("Din fråga").press("Enter");
  await expect(log).toContainText("Oslo");
  await expect(log).not.toContainText("[[ALL]]");
});

test("TRIP-035-R3 the picture is a button that grows by click, Enter and Space, pushes the chat down, and shrinks by a second click, Escape or a click outside", async ({ page }) => {
  await page.goto("/");
  await openButton(page).click();
  const button = picture(page);
  const size = async () => (await button.boundingBox())!.width;
  await expect(button).toHaveAttribute("aria-expanded", "false");
  expect(await size()).toBeCloseTo(64, 0);
  const logTop = async () => (await panel(page).getByRole("log").boundingBox())!.y;
  const before = await logTop();

  await button.click();
  await expect(button).toHaveAttribute("aria-expanded", "true");
  await expect.poll(size).toBeCloseTo(128, 0);
  expect(await logTop()).toBeGreaterThan(before);
  await expectNoA11yViolations(page);

  await button.click();
  await expect(button).toHaveAttribute("aria-expanded", "false");
  await button.focus();
  await page.keyboard.press("Enter");
  await expect(button).toHaveAttribute("aria-expanded", "true");
  await page.keyboard.press("Enter");
  await page.keyboard.press("Space");
  await expect(button).toHaveAttribute("aria-expanded", "true");

  // Escape stänger bilden först och chatten först vid nästa tryck
  await page.keyboard.press("Escape");
  await expect(button).toHaveAttribute("aria-expanded", "false");
  await expect(panel(page)).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(panel(page)).toBeHidden();

  await openButton(page).click();
  await button.click();
  await page.getByLabel("Din fråga").click();
  await expect(button).toHaveAttribute("aria-expanded", "false");
});

test("TRIP-035-R3 on touch, with no hover, the picture also grows by a tap", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await openButton(page).click();
  const button = page.getByRole("dialog").getByRole("button", { name: "Förstora bilden på Agneta" });
  await button.click();
  await expect(button).toHaveAttribute("aria-expanded", "true");
  await page.keyboard.press("Escape");
  await expect(button).toHaveAttribute("aria-expanded", "false");
  await expect(page.getByRole("dialog")).toBeVisible();
  await expectNoA11yViolations(page);
});

test("TRIP-035-R4 the header says Agneta Karenelius and nothing else on the page has the surname", async ({ page }) => {
  await page.goto("/");
  await openButton(page).click();
  await expect(panel(page).getByRole("heading")).toHaveText("Agneta Karenelius");
  await expect(panel(page).getByText("Karenelius")).toHaveCount(1);
  await expect(panel(page).getByRole("log")).not.toContainText("Karenelius");
});

test("TRIP-035-R1 with the panel open the page scrolls in its own box (body), also by an anchor, and a new page starts at the top", async ({ page }) => {
  await page.setViewportSize({ width: 1400, height: 700 });
  await page.goto("/charter");
  await openButton(page).click();
  const scroller = page.locator("body");
  const top = () => scroller.evaluate((b) => b.scrollTop);
  expect(await page.evaluate(() => document.documentElement.scrollHeight <= innerHeight)).toBe(true); // fönstret rullar inte
  await scroller.evaluate((b) => b.scrollTo({ top: 600 }));
  await expect.poll(top).toBeGreaterThan(0);
  // Ett ankare i sidan rullar sidans ruta
  await scroller.evaluate((b) => b.scrollTo({ top: 0 }));
  await page.evaluate(() => {
    const last = document.createElement("div");
    last.id = "agneta-sist";
    document.body.append(last);
    location.hash = "agneta-sist";
  });
  await expect.poll(top).toBeGreaterThan(0);
  // En ny sida börjar överst
  await scroller.evaluate((b) => b.scrollTo({ top: 600 }));
  await page.locator("a[href^='/charter/']").first().click();
  await expect(page).toHaveURL(/\/charter\/[^/]+$/);
  await expect.poll(top).toBe(0);
});

test("TRIP-035-R1 the page keeps its place when the panel opens and closes", async ({ page }) => {
  await page.setViewportSize({ width: 1400, height: 700 });
  await page.goto("/charter");
  // Sidan kan växa medan den laddas: rulla tills den står där
  await expect.poll(() => page.evaluate(() => (window.scrollTo(0, 500), window.scrollY))).toBe(500);
  await openButton(page).click();
  await expect.poll(() => page.locator("body").evaluate((b) => b.scrollTop)).toBeGreaterThan(400);
  await page.getByRole("button", { name: "Minimera chatten" }).click();
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(400);
});
