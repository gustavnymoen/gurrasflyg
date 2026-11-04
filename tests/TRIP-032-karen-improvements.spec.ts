import { expect, test, type Page } from "@playwright/test";
import { GREETING } from "../lib/chat-rules";
import { expectNoA11yViolations, agnetaGreeted } from "./helpers";

// Agneta: panelen, bubblorna, det sparade samtalet och inkopplingen (TRIP-032). Alla prov kör med
// låtsasklienten (LLM_MOCK=1), så inget kostar kursens tak. Utom de som provar själva
// inkopplingen börjar de med en hälsning som redan är gjord (agnetaGreeted).

const openButton = (page: Page) => page.getByRole("button", { name: "Fråga Agneta" });
const panel = (page: Page) => page.getByRole("region", { name: "Agneta" });
const dialog = (page: Page) => page.getByRole("dialog", { name: "Agneta Spydenius" });
const field = (page: Page) => page.getByLabel("Din fråga");
const connecting = (page: Page) => page.getByRole("status").filter({ hasText: "Kopplar in Agneta …" });

async function ask(page: Page, question: string) {
  await field(page).fill(question);
  await field(page).press("Enter");
}


test("TRIP-032-R7 a new session shows the connecting view for 2 to 3 seconds, then the header and a greeting that is not sent", async ({
  page,
}) => {
  const sent: string[] = [];
  await page.route("**/api/chat", (route) => {
    sent.push(route.request().postData() ?? "");
    return route.continue();
  });
  // The clock stands still until the test moves it, so the 2 to 3 seconds are not counted in real time
  await page.clock.install({ time: 0 });
  await page.clock.pauseAt(1000);
  await page.goto("/");
  await openButton(page).click();
  await expect(connecting(page)).toBeVisible();
  await expect(panel(page).getByRole("heading")).toHaveText("Agneta");
  await expect(panel(page).locator("img")).toHaveCount(0);

  // Not before 2 seconds, and there by 3
  await page.clock.runFor(1900);
  await expect(connecting(page)).toBeVisible();
  await page.clock.runFor(1200);
  await expect(connecting(page)).toHaveCount(0);

  // R7: avatar and name in the header, and the greeting (TRIP-033-R2: only "Vad vill du?!")
  await expect(panel(page).getByRole("heading", { name: "Agneta Spydenius" })).toBeVisible();
  await expect(panel(page).locator("img")).toBeVisible();
  const greeting = (await panel(page).getByRole("log").textContent())!.replace(/^Agneta: /, "");
  expect(greeting).toBe(GREETING);
  // Focus moves to the field when the view that had it is gone
  await expect(field(page)).toBeFocused();

  // R7: the question goes without the greeting (the route needs a question first)
  await ask(page, "Vad kostar Teufelsberg?");
  await expect(panel(page)).toContainText("Svar från Agneta på: Vad kostar Teufelsberg?");
  expect(JSON.parse(sent[0]).messages).toEqual([{ role: "user", content: "Vad kostar Teufelsberg?" }]);

  // R7 R5: closed and opened again, and after a reload, there is no connecting view and no new greeting
  await panel(page).getByRole("button", { name: "Minimera chatten" }).click();
  await openButton(page).click();
  await expect(connecting(page)).toHaveCount(0);
  await page.reload();
  await expect(panel(page)).toBeVisible();
  await expect(connecting(page)).toHaveCount(0);
  await expect(panel(page).getByRole("log")).toContainText(greeting);
  await expect(panel(page).getByRole("log")).toContainText("Svar från Agneta på: Vad kostar Teufelsberg?");
});

test("TRIP-032-R7 R6 the connecting view has no axe violations, and its spinner turns, and stands still for a visitor who prefers reduced motion", async ({
  page,
}) => {
  await page.goto("/");
  const spinner = () => connecting(page).locator("span");
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await openButton(page).click();
  // axe needs the page's timers, so the clock runs; it is done well within the 2 seconds
  await expect(spinner()).toHaveCSS("animation-name", "spin");
  await expectNoA11yViolations(page);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(spinner()).toHaveCSS("animation-name", "none");
});

test("TRIP-032-R3 R2 bubbles: questions right, answers left, a header with avatar, name and two buttons; lists, bold and site links in answers", async ({
  page,
}) => {
  await agnetaGreeted(page);
  const reply = [
    "Här är två förslag:",
    "- **Teufelsberg** ([Teufelsberg](/charter/teufelsberg))",
    "  - flyger till BER",
    "  - från 780 kr",
    "- Prag, se [vår sida](https://example.com/prag) och [hem](//example.com) <b>fet</b>",
  ].join("\n");
  await page.route("**/api/chat", (route) => route.fulfill({ json: { reply } }));
  await page.goto("/charter");
  await openButton(page).click();

  // R3: the header
  const header = panel(page).getByRole("heading").locator("../..");
  await expect(header.locator("img")).toHaveAttribute("alt", "");
  await expect(panel(page).getByRole("heading")).toHaveText("Agneta Spydenius");
  await expect(header.getByRole("button")).toHaveText(["", ""]);
  await expect(header.getByRole("button", { name: "Minimera chatten" })).toBeVisible();
  await expect(header.getByRole("button", { name: "Stäng chatten" })).toBeVisible();

  // R3: in order, the visitor's to the right and Agneta's to the left
  await ask(page, "Vad finns det?");
  const log = panel(page).getByRole("log");
  const bubbles = log.locator("> div");
  await expect(bubbles.nth(2).locator("strong")).toBeVisible(); // not the waiting bubble
  await expect(bubbles).toHaveCount(3);
  const [greeting, mine, answer] = await Promise.all([0, 1, 2].map((i) => bubbles.nth(i).boundingBox()));
  expect(greeting!.y).toBeLessThan(mine!.y);
  expect(mine!.y).toBeLessThan(answer!.y);
  expect(mine!.x).toBeGreaterThan(greeting!.x);
  expect(answer!.x).toBe(greeting!.x);

  // R2: a list with a nested list, bold text and a link inside the site; nothing else is a link or markup
  const answerBubble = bubbles.nth(2);
  await expect(answerBubble.locator("ul > li > ul > li")).toHaveText(["flyger till BER", "från 780 kr"]);
  await expect(answerBubble.locator("strong")).toHaveText("Teufelsberg");
  await expect(answerBubble.getByRole("link")).toHaveCount(1);
  await expect(answerBubble.getByRole("link")).toHaveAttribute("href", "/charter/teufelsberg");
  await expect(answerBubble).toContainText("[vår sida](https://example.com/prag)");
  await expect(answerBubble).toContainText("<b>fet</b>");
  await expect(answerBubble.locator("b")).toHaveCount(0);
  await expectNoA11yViolations(page);

  await answerBubble.getByRole("link").click();
  await expect(page).toHaveURL(/\/charter\/teufelsberg$/);
  await expect(panel(page)).toBeVisible();
});

test("TRIP-032-R4 R5 the panel pushes the page aside, stays open with its conversation from page to page, minimises, closes and stays closed", async ({
  page,
}) => {
  await agnetaGreeted(page);
  await page.goto("/charter");
  const mainRight = async () => (await page.locator("main").boundingBox())!.x + (await page.locator("main").boundingBox())!.width;
  const widthBefore = await mainRight();
  await openButton(page).click();

  // R4: on the right, 22 rem wide at this window width, full height, and the page is not covered
  const box = (await panel(page).boundingBox())!;
  const viewport = page.viewportSize()!;
  expect(box.width).toBe(416); // TRIP-033-R6: 26 rem
  expect(box.x + box.width).toBe(viewport.width);
  expect(box.height).toBe(viewport.height);
  expect(await mainRight()).toBeLessThanOrEqual(box.x);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await expect(openButton(page)).toHaveCount(0);
  await expectNoA11yViolations(page);

  // R4 R5: still open with the same conversation on another page, and after a reload
  await ask(page, "Hur bokar jag?");
  await expect(panel(page)).toContainText("Svar från Agneta på: Hur bokar jag?");
  await page.goto("/");
  await expect(panel(page)).toContainText("Svar från Agneta på: Hur bokar jag?");
  await page.reload();
  await expect(panel(page)).toContainText("Svar från Agneta på: Hur bokar jag?");

  // R4: minimised, only the button is left and the page has its full width; the button brings the panel back
  await panel(page).getByRole("button", { name: "Minimera chatten" }).click();
  await expect(panel(page)).toHaveCount(0);
  await expect(openButton(page)).toBeFocused();
  await page.goto("/charter");
  expect(await mainRight()).toBe(widthBefore);
  await openButton(page).click();
  await expect(panel(page)).toContainText("Svar från Agneta på: Hur bokar jag?");

  // R4: Stäng asks first; "Nej" keeps the chat as it was
  await panel(page).getByRole("button", { name: "Stäng chatten" }).click();
  const sure = page.getByRole("dialog", { name: "Är du säker?" });
  await expect(sure).toBeVisible();
  await expect(sure.getByRole("button", { name: "Nej, behåll" })).toBeFocused();
  await expectNoA11yViolations(page);
  await sure.getByRole("button", { name: "Nej, behåll" }).click();
  await expect(sure).toBeHidden();
  await expect(panel(page)).toContainText("Svar från Agneta på: Hur bokar jag?");

  // R4: "Ja" closes the chat and clears it: it stays closed, and the next opening is a new chat
  await panel(page).getByRole("button", { name: "Stäng chatten" }).click();
  await sure.getByRole("button", { name: "Ja, stäng och rensa" }).click();
  await expect(panel(page)).toHaveCount(0);
  await expect(openButton(page)).toBeFocused();
  await page.goto("/charter/teufelsberg");
  await expect(openButton(page)).toBeVisible();
  await expect(panel(page)).toHaveCount(0);
  await openButton(page).click();
  await expect(connecting(page)).toBeVisible();
});

test("TRIP-032-R4 an answer that arrives after Stäng and Ja does not land in the new chat", async ({ page }) => {
  await agnetaGreeted(page);
  let release!: () => void;
  const gate = new Promise<void>((resolve) => (release = resolve));
  await page.route("**/api/chat", async (route) => {
    await gate;
    await route.continue();
  });
  await page.goto("/");
  await openButton(page).click();
  await ask(page, "Långsam fråga");
  await expect(panel(page)).toContainText("Agneta tänker …");
  await panel(page).getByRole("button", { name: "Stäng chatten" }).click();
  await page.getByRole("button", { name: "Ja, stäng och rensa" }).click();
  await openButton(page).click();
  const answered = page.waitForResponse("**/api/chat");
  release();
  await answered;
  await expect(connecting(page)).toBeVisible();
  const saved = await page.evaluate(() => JSON.parse(sessionStorage.getItem("agneta-chat")!));
  expect(saved.entries).toEqual([]);
});

test("TRIP-032-R5 a new tab starts with a closed and empty chat, and damaged data in the session storage breaks nothing", async ({
  page,
}) => {
  await agnetaGreeted(page, true);
  await page.goto("/");
  await expect(panel(page)).toBeVisible();

  const other = await page.context().newPage();
  await other.goto("/");
  await expect(openButton(other)).toBeVisible();
  await expect(panel(other)).toHaveCount(0);
  await other.close();

  const damaged = await page.context().newPage();
  const errors: string[] = [];
  damaged.on("pageerror", (error) => errors.push(error.message));
  await damaged.addInitScript(() => sessionStorage.setItem("agneta-chat", '{"open":true,"entries":[{"role":"bot"}'));
  await damaged.goto("/");
  await expect(openButton(damaged)).toBeVisible();
  await openButton(damaged).click();
  await expect(connecting(damaged)).toBeVisible();
  expect(errors).toEqual([]);
});

test("TRIP-032-R6 the keyboard opens, uses, minimises and closes the panel, which is not modal", async ({ page }) => {
  await agnetaGreeted(page);
  await page.goto("/charter");
  await openButton(page).focus();
  await page.keyboard.press("Enter");
  await expect(field(page)).toBeFocused();
  await page.keyboard.type("Hur bokar jag?");
  await page.keyboard.press("Enter");
  await expect(panel(page)).toContainText("Svar från Agneta på: Hur bokar jag?");

  // No trap: shift+Tab from the panel's first control goes on to the page
  await field(page).focus();
  const inside = () => page.evaluate(() => !!document.activeElement?.closest("section[aria-label=Agneta]"));
  for (let i = 0; i < 6 && (await inside()); i++) await page.keyboard.press("Shift+Tab");
  expect(await inside()).toBe(false);

  // Escape minimises the panel, and focus goes to the button
  await field(page).focus();
  await page.keyboard.press("Escape");
  await expect(panel(page)).toHaveCount(0);
  await expect(openButton(page)).toBeFocused();
});

test.describe("on a phone", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("TRIP-032-R4 R6 the chat is a dialog that fills the width, keeps focus inside, and Escape closes it", async ({
    page,
  }) => {
    await agnetaGreeted(page);
    await page.goto("/");
    await openButton(page).click();
    await expect(dialog(page)).toBeVisible();
    await expect(panel(page)).toHaveCount(0);
    await expect(field(page)).toBeFocused();
    const box = (await dialog(page).boundingBox())!;
    expect(box.width).toBeGreaterThanOrEqual(390 - 32);
    await expectNoA11yViolations(page);

    // Tab goes round inside the dialog: Skicka, the header buttons, the log, the field
    await page.keyboard.press("Tab");
    await expect(dialog(page).getByRole("button", { name: "Skicka" })).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(dialog(page).getByRole("button", { name: "Minimera chatten" })).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(dialog(page).getByRole("button", { name: "Stäng chatten" })).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(dialog(page).getByRole("log")).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(field(page)).toBeFocused();

    await page.keyboard.press("Escape");
    await expect(dialog(page)).toBeHidden();
    await expect(openButton(page)).toBeFocused();

    // R4: Stäng asks above the chat dialog; "Nej" goes back to it, "Ja" clears it
    await openButton(page).click();
    await dialog(page).getByRole("button", { name: "Stäng chatten" }).click();
    const sure = page.getByRole("dialog", { name: "Är du säker?" });
    await sure.getByRole("button", { name: "Nej, behåll" }).click();
    await expect(dialog(page)).toBeVisible();
    await dialog(page).getByRole("button", { name: "Stäng chatten" }).click();
    await sure.getByRole("button", { name: "Ja, stäng och rensa" }).click();
    await expect(dialog(page)).toBeHidden();
    await expect(openButton(page)).toBeFocused();
  });
});

test("TRIP-032-R4 @smoke the button shows Agneta's portrait, and opens the panel on a wide screen", async ({ page }) => {
  await page.goto("/charter");
  await expect(openButton(page).locator("img")).toBeVisible();
  await openButton(page).click();
  await expect(panel(page)).toBeVisible();
});
