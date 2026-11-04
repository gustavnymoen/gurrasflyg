import { expect, test, type Page } from "@playwright/test";
import { expectNoA11yViolations } from "./helpers";

// Chatten med Agneta (TRIP-017). Alla prov kör med låtsasklienten (LLM_MOCK=1 i
// scripts/test-server.mjs), så inget prov kostar kursens tak. En fråga med "FEL" gör
// att låtsasklienten misslyckas. Mot en riktig sajt (npm test) provas bara det som inte skickar en fråga.

const openButton = (page: Page) => page.getByRole("button", { name: "Fråga Agneta" });
const dialog = (page: Page) => page.getByRole("dialog", { name: "Fråga Agneta" });
const field = (page: Page) => dialog(page).getByLabel("Din fråga");

async function ask(page: Page, question: string) {
  await field(page).fill(question);
  await dialog(page).getByRole("button", { name: "Skicka" }).click();
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

test("TRIP-017-R7 R8 R9 the chat: ask and wait, answers in order, kept when closed, cleared by a reload, a blank question and an error", async ({
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
  await expect(dialog(page)).toContainText("Skriv inga personuppgifter");

  // R7: a blank question sends nothing
  await dialog(page).getByRole("button", { name: "Skicka" }).click();
  await field(page).fill("   ");
  await field(page).press("Enter");
  expect(sent).toHaveLength(0);

  // R7: the question appears, the field is emptied and the waiting text shows (announced by the log, R9)
  await ask(page, "Vad kostar Teufelsberg?");
  const log = dialog(page).getByRole("log", { name: "Samtalet" });
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
  await dialog(page).getByRole("button", { name: "Stäng" }).click();
  await expect(dialog(page)).toBeHidden();
  await expect(openButton(page)).toBeFocused();
  await openButton(page).click();
  await expect(log).toContainText("Svar från Agneta på: Tredje frågan");

  // R9: Escape closes it too, and a reload starts over
  await page.keyboard.press("Escape");
  await expect(dialog(page)).toBeHidden();
  await expect(openButton(page)).toBeFocused();
  await page.reload();
  await openButton(page).click();
  await expect(log).not.toContainText("Svar från Agneta");
});

test("TRIP-017-R8 R9 the field stops at 500 characters and shows what is left; the chat fits 320 px and has no axe violations", async ({
  page,
}) => {
  await page.goto("/");
  await openButton(page).click();
  await expect(dialog(page).getByText("tecken kvar")).toHaveCount(0);
  await field(page).pressSequentially("x".repeat(501));
  await expect(field(page)).toHaveValue("x".repeat(500));
  await expect(dialog(page).getByText("0 tecken kvar")).toBeVisible();

  // R9: no violations on the start page, and on a charter page below
  await expectNoA11yViolations(page);
  await page.setViewportSize({ width: 320, height: 640 });
  const box = (await dialog(page).boundingBox())!;
  expect(box.x).toBeGreaterThanOrEqual(0);
  expect(box.x + box.width).toBeLessThanOrEqual(320);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await expect(dialog(page).getByRole("button", { name: "Skicka" })).toBeInViewport();

  await page.goto("/charter/teufelsberg");
  await openButton(page).click();
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
  await expect(dialog(page)).toContainText("Svar från Agneta på: Hur bokar jag?");
  // Tab goes round inside the chat: the log (it scrolls, so it can be reached), field, Stäng, Skicka, and back
  await page.keyboard.press("Tab");
  await expect(dialog(page).getByRole("button", { name: "Stäng" })).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(dialog(page).getByRole("button", { name: "Skicka" })).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(dialog(page).getByRole("log")).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(field(page)).toBeFocused();
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
    await dialog(page).getByRole("button", { name: "Stäng" }).click();
  }
});
