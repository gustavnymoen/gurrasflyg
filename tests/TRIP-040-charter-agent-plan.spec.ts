import { expect, type Page } from "@playwright/test";
import { charterTripDays, expectNoA11yViolations, runsLocally } from "./helpers";
import { fillAll, openCharterBooking, openCharterPlan, passenger, test } from "./plan";

// What Agneta does on the plan step of charter (TRIP-040): the rules of the tools, the actions and the page text
// are unit tests in lib/agent.test.ts and lib/agent-rules.test.ts; here the scripted agent (the fake model of
// lib/chat-mock.ts) is tried in the browser, with the tests' own aircraft (tests/plan.ts).
test.skip(!runsLocally, "the fake agent is only in the local test server");

const { monday, saturday } = charterTripDays();
const dates = `ut=${monday} hem=${saturday}`;

// Each test has an address of its own, so that its questions do not count with the other tests' (10 in 5 minutes)
const address = () => `10.40.${Math.floor(Math.random() * 250)}.${Math.floor(Math.random() * 250)}`;
test.beforeEach(({ context }) => context.setExtraHTTPHeaders({ "x-forwarded-for": address() }));

const panel = (page: Page) => page.getByRole("region", { name: "Agneta" });
const field = (page: Page) => page.getByLabel("Din fråga");

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

test("TRIP-040-R3 destination, dates and travellers in one sentence go through the plan step to Resenärer with both trips, aircraft and classes", async ({ page, fleet }) => {
  void fleet; // the tests' own aircraft must exist
  await agentOn(page);
  await page.goto("/charter/teufelsberg");
  await ask(page, `GENVAG id=teufelsberg fran=ARN ${dates} antal=2`);
  await expect(page).toHaveURL(
    new RegExp(`/charter/teufelsberg/boka\\?fran=ARN&utresa=${monday}&hemresa=${saturday}&resenarer=2&ut=ARN-BER-[\\w]+&hem=BER-ARN-[\\w]+&ut-plan=\\d+&ut-klasser=[^&]+&hem-plan=\\d+&hem-klasser=[^&]+$`),
  );
  await expect(page.getByRole("heading", { name: "Resenärer", level: 1 })).toBeVisible();
  await expect(panel(page)).toContainText("Jag tog de första och billigaste planen");
  await expectNoA11yViolations(page);
});

test("TRIP-040-R1 R2 on the plan step she lists the aircraft and sets one for each trip; the page shows what was chosen", async ({ page, fleet }) => {
  void fleet;
  await agentOn(page);
  await openCharterPlan(page);
  await ask(page, "PLAN antal=2");
  await expect(page).toHaveURL(/\/plan\?.*&ut-plan=\d+&ut-klasser=[^&]+&hem-plan=\d+&hem-klasser=[^&]+$/);
  // Din resa shows the aircraft and the numbers per class for both trips (the cheapest aircraft, both travellers in the first class)
  await expect(page.getByText(/^E2E Plan .+ · E2E Bas .+: 2$/)).toHaveCount(2);
  await expectNoA11yViolations(page);
});

test("TRIP-040-R2 an aircraft that does not exist or a class with too many travellers is refused, she says what, and the address stays", async ({ page, fleet }) => {
  void fleet;
  await agentOn(page);
  await openCharterPlan(page);
  const before = page.url();
  await ask(page, "OGILTIGT");
  await expect(panel(page)).toContainText("No such aircraft among those that seat 2 travellers");
  await ask(page, "FORSTORA antal=2");
  await expect(panel(page)).toContainText(/has room for \d+, not 99/);
  expect(page.url()).toBe(before);
  await expectNoA11yViolations(page);
});

test("TRIP-040-R4 the add-ons she sets are in the form of every traveller on both trips, and the page shows them", async ({ page, fleet }) => {
  await agentOn(page);
  await openCharterBooking(page, fleet.large, { [fleet.base]: 2 });
  await ask(page, `KLASSTILLAGG namn=${fleet.meal} antal=2`);
  for (const n of [1, 2]) {
    for (const leg of ["Utresa", "Hemresa"]) {
      const group = passenger(page, n).getByRole("group", { name: leg });
      await expect(group.getByRole("button", { name: `Fler ${fleet.meal}` }).locator("xpath=..").locator("[aria-live]")).toHaveText(/^2 /);
    }
  }
  await expect(page.getByRole("status").filter({ hasText: "Dessa tillägg togs bort" })).toHaveCount(0);
  await fillAll(page, 2);
  await expectNoA11yViolations(page);
});
