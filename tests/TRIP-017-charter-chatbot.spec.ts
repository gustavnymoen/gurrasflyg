import { expect, test, type Page } from "@playwright/test";
import { expectNoA11yViolations, agnetaGreeted } from "./helpers";

// Chatten med Agneta (TRIP-017; panelen, bubblorna och det sparade samtalet är TRIP-032). Alla prov kör med låtsasklienten (LLM_MOCK=1 i
// scripts/test-server.mjs), så inget prov kostar kursens tak. En fråga med "FEL" gör
// att låtsasklienten misslyckas. Mot en riktig sajt (npm test) provas bara det som inte skickar en fråga.

// Chatten är en panel på en bred skärm och en dialog på en smal (TRIP-032-R4). Provens bredd är bred,
// så den är en panel utom i de prov som säger annat. Hälsningen är redan gjord (agnetaGreeted),
// så att ingen väntar på inkopplingen.
const openButton = (page: Page) => page.getByRole("button", { name: "Fråga Agneta" });
const panel = (page: Page) => page.getByRole("region", { name: "Agneta" });
const dialog = (page: Page) => page.getByRole("dialog", { name: "Agneta Spydenius" });
const field = (page: Page) => panel(page).getByLabel("Din fråga");

test.beforeEach(({ page }) => agnetaGreeted(page));

async function ask(page: Page, question: string) {
  await field(page).fill(question);
  await panel(page).getByRole("button", { name: "Skicka" }).click();
}

test("TRIP-017-R7 the button is on the start page and every charter page, and on no other page", async ({ page }) => {
  for (const path of ["/", "/charter", "/charter/teufelsberg"]) {
    await page.goto(path);
    await expect(openButton(page), path).toBeVisible();
  }
  for (const path of ["/flyg", "/min-bokning", "/admin/login"]) {
    await page.goto(path);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(openButton(page), path).toHaveCount(0);
  }
});

test("TRIP-017-R7 R8 R9 the chat: ask and wait, answers in order, kept when closed, a blank question and an error", async ({
  page,
}) => {
  const sent: string[] = [];
  let release!: () => void;
  const gate = new Promise<void>((resolve) => (release = resolve));
  let holdFirst = true;
  await page.route("**/api/chat", async (route) => {
    sent.push(route.request().postData() ?? "");
    if (holdFirst) {
      holdFirst = false;
      await gate;
    }
    await route.continue();
  });

  await page.goto("/charter");
  await openButton(page).click();
  // R9: focus goes to the field when the chat opens
  await expect(field(page)).toBeFocused();
  await expect(panel(page)).toContainText("Skriv inga personuppgifter");

  // R7: a blank question sends nothing
  await panel(page).getByRole("button", { name: "Skicka" }).click();
  await field(page).fill("   ");
  await field(page).press("Enter");
  expect(sent).toHaveLength(0);

  // R7: the question appears, the field is emptied and the waiting text shows (announced by the log, R9)
  await ask(page, "Vad kostar Teufelsberg?");
  const log = panel(page).getByRole("log", { name: "Samtalet" });
  await expect(log).toContainText("Vad kostar Teufelsberg?");
  await expect(field(page)).toHaveValue("");
  await expect(log.getByText("Agneta tänker …")).toBeVisible();
  release();
  await expect(log).toContainText("Svar från Agneta på: Vad kostar Teufelsberg?");
  await expect(log.getByText("Agneta tänker …")).toHaveCount(0);

  // R7: Enter sends, and the second question follows with the first two messages (the history)
  await field(page).fill("Och hur tar jag mig dit?");
  await field(page).press("Enter");
  await expect(log).toContainText("Svar från Agneta på: Och hur tar jag mig dit?");
  expect(JSON.parse(sent[1]).messages.map((m: { role: string }) => m.role)).toEqual(["user", "assistant", "user"]);

  // R8: an error shows Agneta's message, nothing from the API, and the conversation is kept
  await ask(page, "FEL");
  await expect(log).toContainText("Nu krånglar det här");
  await expect(log).not.toContainText(/50\d|error|LLM_API_KEY/i);
  await expect(log).toContainText("Och hur tar jag mig dit?");
  // The failed question is not sent again, and the visitor can ask again
  await ask(page, "Tredje frågan");
  await expect(log).toContainText("Svar från Agneta på: Tredje frågan");
  expect(JSON.parse(sent.at(-1)!).messages.map((m: { content: string }) => m.content)).not.toContain("FEL");

  // R7: closed and opened again, the conversation is still there; R9: focus goes back to the button
  await panel(page).getByRole("button", { name: "Minimera chatten" }).click();
  await expect(panel(page)).toBeHidden();
  await expect(openButton(page)).toBeFocused();
  await openButton(page).click();
  await expect(log).toContainText("Svar från Agneta på: Tredje frågan");

  // R9: Escape closes it too
  await page.keyboard.press("Escape");
  await expect(panel(page)).toBeHidden();
  await expect(openButton(page)).toBeFocused();
});

test("TRIP-017-R8 R9 the field stops at 500 characters and shows what is left; the chat fits 320 px and has no axe violations", async ({
  page,
}) => {
  await page.goto("/");
  await openButton(page).click();
  await expect(panel(page).getByText("tecken kvar")).toHaveCount(0);
  await field(page).pressSequentially("x".repeat(501));
  await expect(field(page)).toHaveValue("x".repeat(500));
  await expect(panel(page).getByText("0 tecken kvar")).toBeVisible();

  // R9: no violations on the start page, and on a charter page below
  await expectNoA11yViolations(page);
  await page.setViewportSize({ width: 320, height: 640 });
  const box = (await dialog(page).boundingBox())!;
  expect(box.x).toBeGreaterThanOrEqual(0);
  expect(box.x + box.width).toBeLessThanOrEqual(320);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await expect(dialog(page).getByRole("button", { name: "Skicka" })).toBeInViewport();

  // The chat stays open from page to page (TRIP-032-R5), now as a dialog
  await page.goto("/charter/teufelsberg");
  await expect(dialog(page)).toBeVisible();
  await expectNoA11yViolations(page);
});

test("TRIP-017-R9 the keyboard alone opens the chat, asks, reads and closes it, with focus back on the button", async ({
  page,
}) => {
  await page.goto("/charter");
  await openButton(page).focus();
  await page.keyboard.press("Enter");
  await expect(field(page)).toBeFocused();
  await page.keyboard.type("Hur bokar jag?");
  await page.keyboard.press("Enter");
  await expect(panel(page)).toContainText("Svar från Agneta på: Hur bokar jag?");
  await page.keyboard.press("Escape");
  await expect(openButton(page)).toBeFocused();
});

test("TRIP-017-R8 the route answers 400 to a question of 501 characters, an empty one and a conversation of the wrong shape", async ({
  request,
}) => {
  const post = (messages: unknown) => request.post("/api/chat", { data: { messages } });
  expect((await post([{ role: "user", content: "x".repeat(501) }])).status()).toBe(400);
  expect((await post([{ role: "user", content: " " }])).status()).toBe(400);
  expect((await post([{ role: "assistant", content: "Hej" }])).status()).toBe(400);
  expect((await post([])).status()).toBe(400);
  expect((await request.post("/api/chat", { data: "inte json" })).status()).toBe(400);
});

test("TRIP-017-R7 @smoke the button is on the start page and /charter, and opens the chat with its field", async ({
  page,
}) => {
  for (const path of ["/", "/charter"]) {
    await page.goto(path);
    await openButton(page).click();
    await expect(field(page)).toBeFocused();
    await panel(page).getByRole("button", { name: "Minimera chatten" }).click();
  }
});
