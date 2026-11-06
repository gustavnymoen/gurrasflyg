import { expect, type Page } from "@playwright/test";
import { expectNoA11yViolations, runsLocally } from "./helpers";
import { fillAll, inTestDb, openCharterBooking, test } from "./plan";

// The agent follows the booking's own steps (TRIP-038): Resenärer for the details, the payment page for the
// payment method and the check, and the button last. The rules are unit tests in lib/agent.test.ts; here the
// chat and the pages use them, with the fake agent (LLM_MOCK=1, see lib/chat-mock.ts), so it only runs locally.

test.skip(!runsLocally, "the fake agent is only in the local test server");

// An address of its own, so that the questions do not count with the other tests' (10 in 5 minutes)
test.beforeEach(({ context }) =>
  context.setExtraHTTPHeaders({ "x-forwarded-for": `10.38.${Math.floor(Math.random() * 250)}.${Math.floor(Math.random() * 250)}` }),
);

const panel = (page: Page) => page.getByRole("region", { name: "Agneta" });
const bookButton = (page: Page) => panel(page).getByRole("button", { name: "Boka och betala" });
const cash = (page: Page) => page.getByRole("radio", { name: "Cash till piloten" });

async function ask(page: Page, question: string) {
  await page.getByLabel("Din fråga").fill(question);
  await page.getByLabel("Din fråga").press("Enter");
}

// The chat open and the agent mode on, as if Hjälp mig was pressed earlier
async function agentOn(page: Page) {
  await page.addInitScript(() => {
    if (sessionStorage.getItem("agneta-chat")) return;
    sessionStorage.setItem("agneta-chat", JSON.stringify({ open: true, agent: true, entries: [{ role: "assistant", content: "Vad vill du?!" }] }));
  });
}

test("TRIP-038-R1 R2 from a filled-in Resenärer page she opens the payment page, the payment method is set and shown there, and the button comes there and not before", async ({ page, fleet }) => {
  const email = "agent-betalsida@exempel.se";
  try {
    await agentOn(page);
    await openCharterBooking(page, fleet.large, { [fleet.base]: 2 });
    await fillAll(page, 2, email);

    // Resenärer: the extras are asked here; the answer to a question about the button gives none
    await ask(page, "BOKA");
    await expect(panel(page)).toContainText("Tryck på knappen, om du måste.");
    await expect(bookButton(page)).toHaveCount(0);
    await expectNoA11yViolations(page);

    // The valid form takes her to the payment page, with the same trips; no payment method is set yet
    await ask(page, "BETALSIDAN");
    await expect(page).toHaveURL(/\/boka\/betala\?/);
    await expect(page.getByRole("heading", { name: "Betala", level: 1 })).toBeVisible();
    await expect(cash(page)).not.toBeChecked();
    await expect(bookButton(page)).toHaveCount(0);

    // The payment method is set with set_payment and shown; then, with the check, the button
    await ask(page, "BETALSATT");
    await expect(cash(page)).toBeChecked();
    await ask(page, "BOKA");
    await expect(bookButton(page)).toBeVisible();
    await expectNoA11yViolations(page);

    // No press, no booking
    expect(await inTestDb(async (db) => (await db.execute({ sql: "SELECT id FROM charter_bookings WHERE email = ?", args: [email] })).rows.length)).toBe(0);
  } finally {
    await inTestDb((db) => db.execute({ sql: "DELETE FROM charter_bookings WHERE email = ?", args: [email] }));
  }
});

test("TRIP-038-R2 on Resenärer there is no button, even with a valid form and a payment method", async ({ page, fleet }) => {
  await agentOn(page);
  await openCharterBooking(page, fleet.large, { [fleet.base]: 2 });
  await fillAll(page, 2);
  await ask(page, "BETALSATT");
  await expect.poll(() => page.evaluate(() => JSON.parse(sessionStorage.getItem("gurrasflyg-charter")!).payment)).toBe("cash");
  await ask(page, "BOKA");
  await expect(panel(page)).toContainText("Tryck på knappen, om du måste.");
  await expect(page).toHaveURL(/\/boka\?/);
  await expect(bookButton(page)).toHaveCount(0);
});

test("TRIP-038-R1 she does not open the payment page before the form is valid", async ({ page, fleet }) => {
  await agentOn(page);
  await openCharterBooking(page, fleet.large, { [fleet.base]: 2 });
  await ask(page, "BETALSIDAN");
  await expect(panel(page)).toContainText("not valid");
  await expect(page).toHaveURL(/\/boka\?/);
});
