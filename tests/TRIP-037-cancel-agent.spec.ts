import { expect, type Page, test } from "@playwright/test";
import { agnetaGreeted, expectNoA11yViolations, runsLocally } from "./helpers";
import { farBack, inHours, removeSeed, type Seed, seedCharterBooking, seedFlightBooking } from "./my-booking-data";
import { inTestDb } from "./plan";

// Agneta helps with a booking on Min bokning (TRIP-037). The rules (the extract, what may be ticked, what the
// model is told and never given) are unit tests in lib/cancel-extract.test.ts and lib/agent.test.ts; here the
// chat and the page use them, with the fake agent (LLM_MOCK=1, see lib/chat-mock.ts), so it only runs locally.
// The bookings are written straight into the test database and removed. The real model is tried by hand
// (specs/TRIP-037-cancel-agent/verification.md).
test.skip(!runsLocally, "the fake agent and the test database are only in the local test server");

// An address of its own for each test: the chat allows 10 questions in 5 minutes and the lookup locks after 5 wrong ones
let ip = "";
test.beforeEach(({ context }) => {
  ip = `10.37.${Math.floor(Math.random() * 250)}.${Math.floor(Math.random() * 250)}`;
  return context.setExtraHTTPHeaders({ "x-forwarded-for": ip });
});
let seeds: Seed[] = [];
test.afterEach(async () => {
  for (const seed of seeds) await removeSeed(seed);
  seeds = [];
  await inTestDb((db) => db.execute({ sql: "DELETE FROM login_attempts WHERE ip = ?", args: [`uppslag:${ip}`] }));
});

const panel = (page: Page) => page.getByRole("region", { name: "Agneta" });
const field = (page: Page) => page.getByLabel("Din fråga");
const card = (page: Page, name: string) => page.getByRole("region", { name, exact: true });
const status = (page: Page) => page.getByRole("status").filter({ hasText: /Agneta kryssade|Agneta tog bort/ });

async function ask(page: Page, question: string) {
  await field(page).fill(question);
  await field(page).press("Enter");
}

// The chat open and the agent mode on, as if Hjälp mig was pressed earlier
async function agentOn(page: Page) {
  await page.addInitScript(() => {
    if (sessionStorage.getItem("agneta-chat")) return;
    const greeting = { role: "assistant", content: "Vad vill du?!" };
    sessionStorage.setItem("agneta-chat", JSON.stringify({ open: true, agent: true, entries: [greeting] }));
  });
}

// What the chat sends to /api/chat, one body per question
function recordQuestions(page: Page) {
  const bodies: { agent?: { url: string; booking?: unknown } }[] = [];
  void page.route("**/api/chat", (route) => {
    bodies.push(JSON.parse(route.request().postData() ?? "{}"));
    return route.continue();
  });
  return bodies;
}

// The server actions the page calls (the lookup and the cancelling): the chat must never cause one
function countActions(page: Page) {
  const seen = { count: 0 };
  page.on("request", (request) => {
    if (request.method() === "POST" && request.headers()["next-action"]) seen.count++;
  });
  return seen;
}

async function lookUp(page: Page, seed: Pick<Seed, "number" | "lastName">) {
  await page.getByLabel("Bokningsnummer").fill(seed.number);
  await page.getByLabel("Efternamn").fill(seed.lastName);
  await page.getByRole("button", { name: "Visa min bokning" }).click();
  await expect(page.getByRole("heading", { name: "Din bokning" })).toBeVisible();
}

// Nothing of the booking that is personal may be in what the chat sends
function expectNothingPersonal(sent: unknown, seed: Seed, names: string[]) {
  const text = JSON.stringify(sent);
  for (const secret of [seed.number, seed.lastName, seed.email, "Cecilia", "Testsson", ...names]) expect(text, secret).not.toContain(secret);
}

test("TRIP-037-R1 R6 the chat is on Min bokning, Hjälp mig is offered there, and the mode and the conversation follow the visitor from another page", async ({ page }) => {
  // The plain chat on Min bokning: a request for help gives the button, and the mode starts
  await agnetaGreeted(page);
  await page.goto("/min-bokning");
  await page.getByRole("button", { name: "Fråga Agneta" }).click();
  await expect(panel(page)).toBeVisible();
  await expectNoA11yViolations(page);
  await ask(page, "kan du hjälpa mig, hjälp mig med min bokning");
  await panel(page).getByRole("button", { name: "Hjälp mig" }).click();
  await expect(panel(page).getByText("Agneta hjälper dig", { exact: true })).toBeVisible();

  // From another page the fake agent opens Min bokning, in the same conversation
  await page.goto("/charter");
  await expect(panel(page)).toBeVisible();
  await expect(panel(page).getByText("Agneta hjälper dig", { exact: true })).toBeVisible();
  await ask(page, "MINBOKNING");
  await expect(page).toHaveURL(/\/min-bokning$/);
  await expect(panel(page).getByText(/Det blev så här: Opened Min bokning/)).toBeVisible();
  await expect(panel(page).getByText("Agneta hjälper dig", { exact: true })).toBeVisible();
  await expect(page.getByLabel("Bokningsnummer")).toHaveValue("");
});

test("TRIP-037-R2 a number and a last name typed in the chat are not used: no lookup is made, the fields stay empty and no booking is sent", async ({ page }) => {
  await agentOn(page);
  const bodies = recordQuestions(page);
  const actions = countActions(page);
  await page.goto("/min-bokning");
  await ask(page, "UPPGIFTER mitt bokningsnummer är K7M2QX och jag heter Efternamnsson");
  await expect(panel(page).getByText("Numret och efternamnet skriver du i fälten på sidan.")).toBeVisible();
  await expect(page.getByLabel("Bokningsnummer")).toHaveValue("");
  await expect(page.getByLabel("Efternamn")).toHaveValue("");
  await expect(page.getByRole("heading", { name: "Din bokning" })).toHaveCount(0);
  expect(actions.count).toBe(0);
  // No booking on the page: no extract with the question
  expect(bodies.at(-1)!.agent).toEqual({ url: "/min-bokning", extras: [], payment: null, valid: false });
  await expectNoA11yViolations(page);
});

test("TRIP-037-R4 R5 R6 the extract is sent only after a lookup and has nothing personal; she ticks a flight, then one traveller, and nothing is cancelled", async ({ page }) => {
  const seed = await seedFlightBooking();
  seeds.push(seed);
  await agentOn(page);
  const bodies = recordQuestions(page);
  await page.goto("/min-bokning");

  // Before a lookup there is no extract
  await ask(page, "Hej");
  await expect(panel(page).getByText("Svar från Agneta på: Hej")).toBeVisible();
  expect(bodies.at(-1)!.agent?.booking).toBeUndefined();

  await lookUp(page, seed);
  const actions = countActions(page);
  const out = card(page, "Utresa");
  const back = card(page, "Hemresa");

  // "Avboka utresan": exactly the boxes of that flight, with what a win would refund
  await field(page).fill("KRYSSA del=utresan");
  await field(page).press("Enter");
  await expect(out.getByRole("checkbox", { name: "Avboka utresan" })).toBeChecked();
  await expect(out.getByRole("checkbox", { name: /Anna Testsson/ })).toBeChecked();
  await expect(out.getByRole("checkbox", { name: /Bo Testsson/ })).toBeChecked();
  await expect(back.getByRole("checkbox", { name: /Anna Testsson/ })).not.toBeChecked();
  await expect(card(page, "Avboka")).toContainText(/Vinner du får du .*2\s240\skr.* tillbaka/);
  await expect(panel(page).getByText(/Ticked on the page: Resenär 1, Ekonomi \(utresan ARN-LHR/)).toBeVisible();

  // R4: the extract: parts by number, class and amount, and nothing personal
  const sent = bodies.at(-1)!.agent!.booking as { kind: string; groups: { parts: { label: string }[] }[] };
  expect(sent.kind).toBe("flight");
  expect(sent.groups[0].parts.map((p) => p.label)).toEqual(["Resenär 1, Ekonomi", "Resenär 2, Ekonomi"]);
  expectNothingPersonal(bodies.at(-1), seed, ["Anna"]);
  expectNothingPersonal(bodies.at(-1)!.agent, seed, ["Anna"]);

  // R6: announced, and focus stays in the chat
  await expect(status(page)).toContainText("Agneta kryssade: Utresa: Anna Testsson, Utresa: Bo Testsson");
  await expect(field(page)).toBeFocused();
  await expectNoA11yViolations(page);

  // "Avboka resenär 2" replaces the ticks: that traveller on both flights, and the question carries what was ticked
  await field(page).fill("KRYSSA del=2");
  await field(page).press("Enter");
  await expect(out.getByRole("checkbox", { name: /Bo Testsson/ })).toBeChecked();
  await expect(back.getByRole("checkbox", { name: /Bo Testsson/ })).toBeChecked();
  await expect(out.getByRole("checkbox", { name: /Anna Testsson/ })).not.toBeChecked();
  await expect(out.getByRole("checkbox", { name: "Avboka utresan" })).not.toBeChecked();
  expect((bodies.at(-1)!.agent!.booking as { ticked: number[] }).ticked).toHaveLength(2);
  await expect(card(page, "Avboka")).toContainText(/Vinner du får du .*2\s040\skr.* tillbaka/); // 1 240 kr out (with the meals) and 800 kr back

  // The visitor unticks on the page and she goes on from that: the next question has the new ticks
  await back.getByRole("checkbox", { name: /Bo Testsson/ }).uncheck();
  await ask(page, "Vad är kryssat?");
  await expect(panel(page).getByText("Svar från Agneta på: Vad är kryssat?")).toBeVisible();
  expect((bodies.at(-1)!.agent!.booking as { ticked: number[] }).ticked).toHaveLength(1);

  // Nothing is cancelled by the chat: no server action since the lookup, and the page's own button asks first
  expect(actions.count).toBe(0);
  await expect(page.getByText("Avbokningar", { exact: true })).toHaveCount(0);
  await page.getByRole("button", { name: "Avboka", exact: true }).click();
  const dialog = page.getByRole("alertdialog", { name: "Är du säker?" });
  await expect(dialog).toBeVisible();
  await expectNoA11yViolations(page);
  await dialog.getByRole("button", { name: "Nej" }).click();
  await expect(dialog).toBeHidden();
  expect(actions.count).toBe(0);
  await expect(page.getByText("Avbokningar", { exact: true })).toHaveCount(0);
});

test("TRIP-037-R5 a flight that is too late is not ticked, and she says why", async ({ page }) => {
  // The outbound flight leaves in 10 hours; the return is far enough away
  const seed = await seedFlightBooking(inHours(10), farBack);
  seeds.push(seed);
  await agentOn(page);
  await page.goto("/min-bokning");
  await lookUp(page, seed);
  const out = card(page, "Utresa");
  const back = card(page, "Hemresa");

  await ask(page, "KRYSSA del=utresan");
  await expect(panel(page).getByText("Nothing was ticked and the boxes the visitor had ticked are unchanged.")).toBeVisible();
  await expect(out.getByRole("checkbox", { name: /Anna Testsson/ })).not.toBeChecked();
  await expect(out.getByText("Det är för sent att avboka")).toBeVisible();
  await expect(status(page)).toHaveCount(0);

  // The return can be ticked
  await ask(page, "KRYSSA del=hemresan");
  await expect(back.getByRole("checkbox", { name: "Avboka hemresan" })).toBeChecked();
  await expect(out.getByRole("checkbox", { name: "Avboka utresan" })).not.toBeChecked();
  await expectNoA11yViolations(page);
});

test("TRIP-037-R4 R5 a charter booking: the extract has the travellers by number, and she ticks one traveller and then the whole trip", async ({ page }) => {
  const seed = await seedCharterBooking();
  seeds.push(seed);
  await agentOn(page);
  const bodies = recordQuestions(page);
  await page.goto("/min-bokning");
  await lookUp(page, seed);
  const travellers = card(page, "Resenärer");

  await ask(page, "KRYSSA del=1");
  await expect(travellers.getByRole("checkbox", { name: /Anna Testsson/ })).toBeChecked();
  await expect(travellers.getByRole("checkbox", { name: /Bo Testsson/ })).not.toBeChecked();
  await expect(travellers.getByRole("checkbox", { name: "Avboka hela resan" })).not.toBeChecked();
  await expect(card(page, "Avboka")).toContainText(/Vinner du får du .*8\s500\skr.* tillbaka/);

  await ask(page, "KRYSSA del=resan");
  await expect(travellers.getByRole("checkbox", { name: "Avboka hela resan" })).toBeChecked();
  await expect(travellers.getByRole("checkbox", { name: /Bo Testsson/ })).toBeChecked();
  await expectNoA11yViolations(page);

  const sent = bodies.at(-1)!.agent!.booking as { kind: string; groups: { label: string; parts: { label: string; amount: number }[] }[] };
  expect(sent.kind).toBe("charter");
  expect(sent.groups[0].label).toMatch(/^resan till .+: Utresa [A-Z]{3}-[A-Z]{3} \d{4}-\d\d-\d\d \d\d:\d\d, Hemresa/);
  expect(sent.groups[0].parts).toEqual([
    { id: expect.any(Number), label: "Resenär 1", amount: 8500, cancelled: false },
    { id: expect.any(Number), label: "Resenär 2", amount: 8500, cancelled: false },
  ]);
  expectNothingPersonal(sent, seed, ["Anna"]);
});
