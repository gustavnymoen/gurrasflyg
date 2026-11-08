import { expect, type Page } from "@playwright/test";
import { bookedText, CHANGED_TEXT } from "../lib/agent-rules";
import { agnetaGreeted, charterTripDays, daysFromToday, expectNoA11yViolations, runsLocally } from "./helpers";
import { fillAll, inTestDb, openCharterBooking, test } from "./plan";

// Agneta as an agent (TRIP-030). The rules (action and context checks, the tool-call cap, the tools, the
// offer of the booking button) are unit tests in lib/agent-rules.test.ts and lib/agent.test.ts; here the
// chat and the pages use them. Everything runs with the fake agent (LLM_MOCK=1, see lib/chat-mock.ts), which
// answers by a word in the question, so it only runs locally. The real model is tried by hand
// (specs/TRIP-030-booking-agent/verification.md).

test.skip(!runsLocally, "the fake agent is only in the local test server");

const { monday, saturday } = charterTripDays();
// Since TRIP-039 Resenärer comes after the plan step: the tests that need it plan the TRIP-014 trips
// (ARN-BER-SK1122 06:50 and BER-ARN-SK1123 09:15) with the tests' own aircraft. The shortcut through the plan
// step is tested in TRIP-040-charter-agent-plan.spec.ts.
const dates = `ut=${monday} hem=${saturday}`;

// Each test has an address of its own, so that its questions do not count with the other tests' (10 in 5 minutes)
const address = () => `10.30.${Math.floor(Math.random() * 250)}.${Math.floor(Math.random() * 250)}`;
test.beforeEach(({ context }) => context.setExtraHTTPHeaders({ "x-forwarded-for": address() }));

const panel = (page: Page) => page.getByRole("region", { name: "Agneta" });
const field = (page: Page) => page.getByLabel("Din fråga");
const helpButton = (page: Page) => panel(page).getByRole("button", { name: "Hjälp mig" });
const bookButton = (page: Page) => panel(page).getByRole("button", { name: "Boka och betala" });
const agentBar = (page: Page) => panel(page).getByText("Agneta hjälper dig", { exact: true });

async function ask(page: Page, question: string) {
  await field(page).fill(question);
  await field(page).press("Enter");
}

// The chat open, the greeting made and the agent mode on, as if Hjälp mig was pressed earlier
async function agentOn(page: Page) {
  await page.addInitScript(() => {
    if (sessionStorage.getItem("agneta-chat")) return;
    const greeting = { role: "assistant", content: "Vad vill du?!" };
    sessionStorage.setItem("agneta-chat", JSON.stringify({ open: true, agent: true, entries: [greeting] }));
  });
}

// What the chat sends to /api/chat, one body per question
function recordQuestions(page: Page) {
  const bodies: { messages: { content: string }[]; agent?: Record<string, unknown> }[] = [];
  void page.route("**/api/chat", (route) => {
    bodies.push(JSON.parse(route.request().postData() ?? "{}"));
    return route.continue();
  });
  return bodies;
}

test("TRIP-030-R1 R10 a request for help gets the button Hjälp mig, a plain question none; the button starts the mode, Sluta ends it, and it follows the conversation", async ({
  page,
}) => {
  await agnetaGreeted(page, true);
  const bodies = recordQuestions(page);
  await page.goto("/charter");
  await ask(page, "Vad kostar Teufelsberg?");
  await expect(panel(page)).toContainText("Svar från Agneta på: Vad kostar Teufelsberg?");
  await expect(helpButton(page)).toHaveCount(0);

  await ask(page, "Kan du boka åt mig?");
  await expect(helpButton(page)).toBeVisible();
  await expect(panel(page)).not.toContainText("[[HELP]]");
  await expectNoA11yViolations(page);

  // The button works with the keyboard; pressing it announces the mode, shows the way out and puts focus in the field
  await helpButton(page).focus();
  await page.keyboard.press("Enter");
  await expect(agentBar(page)).toBeVisible();
  await expect(panel(page).getByRole("status").filter({ hasText: "Agneta hjälper dig nu." })).toBeAttached();
  await expect(field(page)).toBeFocused();
  await expect(helpButton(page)).toHaveCount(0);
  await expectNoA11yViolations(page);
  // Plain questions so far carry no agent context; in the mode every question does, with nothing personal in it
  expect(bodies.every((b) => b.agent === undefined)).toBe(true);
  await ask(page, "Vad som helst");
  await expect(panel(page)).toContainText("Svar från Agneta på: Vad som helst");
  expect(bodies.at(-1)!.agent).toEqual({ url: "/charter", extras: [], payment: null, valid: false });

  // The mode is kept in the tab with the conversation
  await page.reload();
  await expect(agentBar(page)).toBeVisible();

  // Sluta goes back to answering only, and focus stays in the field
  await panel(page).getByRole("button", { name: "Sluta" }).click();
  await expect(agentBar(page)).toHaveCount(0);
  await expect(field(page)).toBeFocused();
  await ask(page, "Och nu?");
  await expect(panel(page)).toContainText("Svar från Agneta på: Och nu?");
  expect(bodies.at(-1)!.agent).toBeUndefined();

  // Closing and clearing the chat clears the mode too
  await ask(page, "Hjälp mig igen");
  await helpButton(page).click();
  await expect(agentBar(page)).toBeVisible();
  await panel(page).getByRole("button", { name: "Stäng chatten" }).click();
  await page.getByRole("dialog", { name: "Är du säker?" }).getByRole("button", { name: "Ja, stäng och rensa" }).click();
  await page.reload();
  await expect(agentBar(page)).toHaveCount(0);
});

test("TRIP-030-R10 R1 in the dialog on a small screen the button and the mode work and pass axe", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 800 });
  await agnetaGreeted(page, true);
  await page.goto("/charter");
  const dialog = page.getByRole("dialog", { name: "Agneta Spydenius" });
  await dialog.getByLabel("Din fråga").fill("Hjälp mig att hitta en resa");
  await dialog.getByLabel("Din fråga").press("Enter");
  await dialog.getByRole("button", { name: "Hjälp mig" }).click();
  await expect(dialog.getByText("Agneta hjälper dig", { exact: true })).toBeVisible();
  await expectNoA11yViolations(page);
});

test("TRIP-030-R2 R4 the route answers { reply, actions, book } in the agent mode, and refuses a wrongly shaped context", async ({ request }) => {
  const headers = { "x-forwarded-for": address() };
  const messages = [{ role: "user", content: "LISTA kategori=Prison" }];
  const ok = await request.post("/api/chat", { headers, data: { messages, agent: { url: "/charter", extras: [], payment: null, valid: false } } });
  expect(ok.status()).toBe(200);
  const answer = await ok.json();
  expect(answer.actions).toEqual([{ type: "goto", url: "/charter?kategori=Prison" }]);
  expect(answer.book).toBe(false);

  for (const agent of [{ url: "https://x" }, { url: "/charter", extras: "x", payment: null, valid: false }, "text", null]) {
    expect((await request.post("/api/chat", { headers, data: { messages, agent } })).status(), JSON.stringify(agent)).toBe(400);
  }
  const failed = await request.post("/api/chat", { headers, data: { messages: [{ role: "user", content: "FEL" }], agent: { url: "/", extras: [], payment: null, valid: false } } });
  expect(failed.status()).toBe(502);
  expect(await failed.json()).toEqual({ error: "Agneta kunde inte svara." });
});

test("TRIP-030-R3 \"show me\" opens the list with the filters in the address, the conversation stays, and a failing question shows Agneta's error", async ({ page }) => {
  await agentOn(page);
  await page.goto("/charter");
  await ask(page, "LISTA kategori=Prison varldsdel=Europe");
  await expect(page).toHaveURL(/\/charter\?varldsdel=Europe&kategori=Prison$/);
  await expect(page.getByRole("button", { name: /^Kategori: / })).toContainText("Fängelse");
  // Moving the page keeps the chat open and the conversation
  await expect(panel(page)).toContainText("LISTA kategori=Prison varldsdel=Europe");
  await expect(panel(page)).toContainText("Det blev så här: Opened the list");
  await expectNoA11yViolations(page);

  await ask(page, "FEL");
  await expect(panel(page)).toContainText("Nu krånglar det här.");
  await expect(page).toHaveURL(/\/charter\?varldsdel=Europe&kategori=Prison$/);
});

test("TRIP-030-R3 a page the tools cannot open is not opened: the model gets an error and the page stays", async ({ page }) => {
  await agentOn(page);
  await page.goto("/charter");
  await ask(page, "OTILLATEN");
  await expect(panel(page)).toContainText("No such destination");
  await expect(page).toHaveURL(/\/charter$/);
});

test("TRIP-030-R4 R5 dates that cannot be booked go nowhere: Agneta says so and the page stays", async ({ page }) => {
  await agentOn(page);
  // Dates far ahead (more than six months) cannot be booked
  await page.goto("/charter/teufelsberg");
  const late = daysFromToday(300);
  await ask(page, `GENVAG id=teufelsberg fran=ARN ut=${late} hem=${late} antal=2`);
  await expect(panel(page)).toContainText("Det gick inte: Those dates cannot be booked");
  await expect(page).toHaveURL(/\/charter\/teufelsberg$/);
});

test("TRIP-030-R3 the results page opens with a chosen trip in the address", async ({ page }) => {
  await agentOn(page);
  await page.goto("/charter");
  await ask(page, `RESULTAT id=teufelsberg fran=ARN ${dates} antal=2 utresa=ARN-BER-SK1122`);
  await expect(page).toHaveURL(new RegExp(`/charter/teufelsberg/resor\\?fran=ARN&utresa=${monday}&hemresa=${saturday}&resenarer=2&ut=ARN-BER-SK1122$`));
  await expect(page.getByRole("heading", { name: "Välj din resa", level: 1 })).toBeVisible();
});

test("TRIP-030-R4 what the visitor changed on the page is what the next answer is based on, and an answer that comes too late is dropped", async ({ page }) => {
  await agentOn(page);
  const bodies = recordQuestions(page);
  // The answer is held until the test lets it go
  let release = () => {};
  const gate = new Promise<void>((resolve) => (release = resolve));
  await page.route("**/api/chat", async (route) => {
    await gate;
    await route.fallback();
  });
  await page.goto("/charter");
  await ask(page, "LISTA kategori=Prison");
  await expect(panel(page)).toContainText("Agneta tänker …");
  // The visitor clicks a destination meanwhile
  await page.getByRole("main").getByRole("link", { name: /Teufelsberg/ }).first().click();
  await expect(page).toHaveURL(/\/charter\/teufelsberg$/);
  release();
  await expect(panel(page)).toContainText(CHANGED_TEXT);
  await expect(page).toHaveURL(/\/charter\/teufelsberg$/); // the list was not opened over what they did
  await expectNoA11yViolations(page);

  // The next question carries the page the visitor is on now
  await ask(page, "Och nu?");
  await expect(panel(page)).toContainText("Svar från Agneta på: Och nu?");
  expect(bodies.at(-1)!.agent).toMatchObject({ url: "/charter/teufelsberg" });
});

test("TRIP-030-R6 extras are written to the form and shown; the drinks package is not set with a traveller under 18", async ({ page, fleet }) => {
  await agentOn(page);
  await openCharterBooking(page, fleet.large, { [fleet.base]: 2 });
  await ask(page, "TILLAGG tillagg=ultimate");
  await expect(page.getByRole("checkbox", { name: "Den ultimata upplevelsen" })).toBeChecked();
  await expect(page.getByRole("status").filter({ hasText: "Agneta hjälper dig nu." })).toBeAttached();
  const form = await page.evaluate(() => JSON.parse(sessionStorage.getItem("gurrasflyg-charter")!));
  expect(form.extras).toEqual(["ultimate"]);

  // A traveller of 12: the drinks package is refused
  await page.getByRole("region", { name: "Passagerare 2" }).getByLabel("Ålder").selectOption("12");
  await ask(page, "TILLAGG tillagg=drinks");
  await expect(page.getByRole("checkbox", { name: "Dryckespaket XXXL" })).not.toBeChecked();
  expect(await page.evaluate(() => JSON.parse(sessionStorage.getItem("gurrasflyg-charter")!).extras)).toEqual(["ultimate"]);
});

test("TRIP-030-R7 R8 nothing personal reaches the model; the button comes with a valid form only, books once with the same action as Betala, and the chat says the number", async ({ page, fleet }) => {
  const email = "agent@exempel.se";
  const bodies = recordQuestions(page);
  try {
    await agentOn(page);
    await openCharterBooking(page, fleet.large, { [fleet.base]: 2 });
    await ask(page, "TILLAGG tillagg=ultimate");
    await expect(page.getByRole("checkbox", { name: "Den ultimata upplevelsen" })).toBeChecked();

    // The form is not valid yet: the model says "tryck" but the button is not offered
    await ask(page, "BOKA");
    await expect(panel(page)).toContainText("Tryck på knappen, om du måste.");
    await expect(panel(page)).not.toContainText("[[BOOK]]");
    await expect(bookButton(page)).toHaveCount(0);
    expect(bodies.at(-1)!.agent).toMatchObject({ valid: false, payment: null });

    // The visitor fills in the form themselves; the payment page and the payment method come first (TRIP-038), then the button
    await fillAll(page, 2, email);
    await ask(page, "BETALSIDAN");
    await expect(page).toHaveURL(/\/boka\/betala\?/);
    await ask(page, "BETALSATT");
    await expect(page.getByRole("radio", { name: /Cash till piloten/ })).toBeChecked();
    await ask(page, "BOKA");
    await expect(bookButton(page)).toBeVisible();
    expect(bodies.at(-1)!.agent).toEqual({ url: new URL(page.url()).pathname + new URL(page.url()).search, extras: ["ultimate"], payment: "cash", valid: true, choice: expect.anything() }); // TRIP-044: classes and add-ons, no names
    expect(JSON.stringify(bodies)).not.toMatch(/E2E Resenär|Anna|Storgatan|agent@exempel/);
    await expectNoA11yViolations(page);

    // No press, no booking
    expect(await inTestDb(async (db) => (await db.execute({ sql: "SELECT id FROM charter_bookings WHERE email = ?", args: [email] })).rows.length)).toBe(0);

    // Two quick presses give one booking, and the page shows the summary with the number the chat gives
    await bookButton(page).click({ clickCount: 2 });
    await expect(page).toHaveURL(/\/charter\/bokad$/);
    const number = (await page.getByText(/CH-[A-HJ-NP-Z2-9]{6}/).first().textContent())!.match(/CH-[A-HJ-NP-Z2-9]{6}/)![0];
    await expect(panel(page)).toContainText(bookedText(number));
    expect(await inTestDb(async (db) => (await db.execute({ sql: "SELECT id FROM charter_bookings WHERE email = ?", args: [email] })).rows.length)).toBe(1);
    await expectNoA11yViolations(page);
  } finally {
    await inTestDb((db) => db.execute({ sql: "DELETE FROM charter_bookings WHERE email = ?", args: [email] }));
  }
});

test("TRIP-030-R8 a booking that fails shows the action's message under the button and books nothing", async ({ page, fleet }) => {
  const email = "agent-fail@exempel.se";
  try {
    await agentOn(page);
    await openCharterBooking(page, fleet.large, { [fleet.base]: 2 });
    await ask(page, "TILLAGG tillagg=ultimate");
    await expect(page.getByRole("checkbox", { name: "Den ultimata upplevelsen" })).toBeChecked(); // answer done before the form is touched
    await fillAll(page, 2, email);
    await ask(page, "BETALSIDAN");
    await expect(page).toHaveURL(/\/boka\/betala\?/);
    await ask(page, "BETALSATT");
    await expect(page.getByRole("radio", { name: /Cash till piloten/ })).toBeChecked();
    await ask(page, "BOKA");
    await expect(bookButton(page)).toBeVisible();
    // The server action answers that the trip has changed
    await page.route("**/charter/teufelsberg/boka/betala**", async (route) => {
      if (!route.request().headers()["next-action"]) return route.fallback();
      await route.fulfill({ status: 200, contentType: "text/x-component", body: '0:{"a":"$@1","f":"","b":"x"}\n1:{"ok":false,"error":"Resan har ändrats."}\n' });
    });
    await bookButton(page).click();
    await expect(panel(page).getByRole("alert")).toHaveText("Resan har ändrats.");
    await expect(page).toHaveURL(/\/boka\/betala\?/);
    await expect(bookButton(page)).toBeEnabled();
  } finally {
    await inTestDb((db) => db.execute({ sql: "DELETE FROM charter_bookings WHERE email = ?", args: [email] }));
  }
});

test("TRIP-030-R2 at most 6 tool calls per question: the 7th request has to answer", async ({ page }) => {
  await agentOn(page);
  await page.goto("/charter");
  await ask(page, "SLINGA");
  await expect(panel(page)).toContainText("Nu räcker det. Jag fick göra 6 anrop.");
});
