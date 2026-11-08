import { expect, type Page, type Route } from "@playwright/test";
import { bookedText, CHANGED_TEXT } from "../lib/agent-rules";
import { createAddon, createAircraft, deleteWithConfirmation, expectNoA11yViolations, runsLocally, signIn } from "./helpers";
import { countBookings, deleteBookings, fillAll, IN_A_WEEK, openBooking, passenger, test, TOMORROW } from "./plan";

// Agneta books flights (TRIP-036). The rules (the tools, the flights she is told, the action checks, the offer
// of the button) are unit tests in lib/agent.test.ts and lib/agent-rules.test.ts; here the chat and the flight
// pages use them, with the fake agent (LLM_MOCK=1, see lib/chat-mock.ts), so it only runs locally. The real
// model is tried by hand (specs/TRIP-036-flight-agent/verification.md).
test.skip(!runsLocally, "the fake agent is only in the local test server");

// Each test has an address of its own, so that its questions do not count with the other tests' (10 in 5 minutes)
const address = () => `10.36.${Math.floor(Math.random() * 250)}.${Math.floor(Math.random() * 250)}`;
test.beforeEach(({ context }) => context.setExtraHTTPHeaders({ "x-forwarded-for": address() }));

// The words the fake agent reads: the search ARN to LHR, tomorrow and in a week, two travellers
const words = `fran=ARN till=LHR ut=${TOMORROW} hem=${IN_A_WEEK} antal=2`;
const search = `fran=ARN&till=LHR&utresa=${TOMORROW}&hemresa=${IN_A_WEEK}&resenarer=2`;

const panel = (page: Page) => page.getByRole("region", { name: "Agneta" });
const field = (page: Page) => page.getByLabel("Din fråga");
const bookButton = (page: Page) => panel(page).getByRole("button", { name: "Boka och betala" });

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

// The agent mode turned on in a page that is already open (the page keeps its address and its form)
async function agentOnNow(page: Page) {
  await page.evaluate(() => sessionStorage.setItem("agneta-chat", JSON.stringify({ open: true, agent: true, entries: [{ role: "assistant", content: "Vad vill du?!" }] })));
  await page.reload();
  await expect(panel(page)).toBeVisible();
}

// What the chat sends to /api/chat, one body per question
function recordQuestions(page: Page) {
  const bodies: { agent?: Record<string, unknown> }[] = [];
  void page.route("**/api/chat", (route) => {
    bodies.push(JSON.parse(route.request().postData() ?? "{}"));
    return route.continue();
  });
  return bodies;
}

// The shortcut done: the search in one sentence, and she stands on Resenärer with both flights, the aircraft and the classes
async function shortcut(page: Page) {
  await page.goto("/flyg");
  await ask(page, `FLYGVAG ${words}`);
  await expect(page).toHaveURL(/\/flyg\/boka\?.*&ut=\d\d%3A\d\d&ut-plan=\d+&ut-klasser=[^&]+&hem=\d\d%3A\d\d&hem-plan=\d+&hem-klasser=[^&]+$/);
  await expect(page.getByRole("heading", { name: "Resenärer", level: 1 })).toBeVisible();
}

test("TRIP-036-R1 the chat is on every flight page, and the conversation and the mode follow the visitor from charter to the flights; the page is pushed aside", async ({ page }) => {
  for (const path of ["/flyg", "/flyg/plan", "/flyg/boka", "/flyg/boka/betala", "/flyg/bokad"]) {
    await page.goto(path);
    await expect(page.getByRole("button", { name: "Fråga Agneta" }), path).toBeVisible();
  }

  await agentOn(page);
  await page.goto("/charter");
  await ask(page, "Hej från charter");
  await expect(panel(page)).toContainText("Svar från Agneta på: Hej från charter");
  await page.goto(`/flyg?${search}`);
  await expect(panel(page)).toContainText("Svar från Agneta på: Hej från charter");
  await expect(panel(page).getByText("Agneta hjälper dig", { exact: true })).toBeVisible();

  // The panel takes its own room: the page ends where the panel begins
  await expect(page.locator("html")).toHaveAttribute("data-agneta-panel", "");
  const [main, chat] = [await page.getByRole("main").boundingBox(), await panel(page).boundingBox()];
  expect(main!.x + main!.width).toBeLessThanOrEqual(chat!.x + 1);
  await expectNoA11yViolations(page);
});

test("TRIP-036-R2 she searches and opens the results, with the departures chosen when they are agreed; no flight on the date, and a page the visitor changed meanwhile", async ({ page }) => {
  await agentOn(page);
  const bodies = recordQuestions(page);
  await page.goto("/flyg");

  // The prices and times she tells are the page's own: from find_flights, which opens nothing
  await ask(page, `FLYGSOK ${words}`);
  await expect(panel(page)).toContainText(`Outbound flights ARN to LHR on ${TOMORROW}`);
  await expect(page).toHaveURL(/\/flyg$/);

  // A search without departures chosen, then with them
  await ask(page, `FLYGUTVAL ${words}`);
  await expect(page).toHaveURL(`/flyg?${search}`);
  await expect(page.getByRole("heading", { name: "Utresa Stockholm – London" })).toBeVisible();
  await ask(page, `FLYGUTVAL ${words} utflyg=08:20 hemflyg=06:45`);
  await expect(page).toHaveURL(`/flyg?${search}&ut=08%3A20&hem=06%3A45`);
  const trip = page.getByRole("heading", { name: "Din resa" });
  await expect(trip).toBeVisible({ timeout: 15_000 });
  await expect(page.getByRole("main")).toContainText("08:20 ARN Stockholm – LHR London");
  await expect(page.getByRole("main")).toContainText("06:45 LHR London – ARN Stockholm");
  await expectNoA11yViolations(page);

  // Dates that cannot be booked: nothing opens and she says so
  await ask(page, "FLYGUTVAL fran=ARN till=LHR ut=2020-01-01 hem=2020-01-05 antal=2");
  await expect(panel(page)).toContainText("Those dates cannot be booked");
  await expect(page).toHaveURL(`/flyg?${search}&ut=08%3A20&hem=06%3A45`);

  // The visitor changes the search while she is thinking: the answer is dropped, the next question carries the new address
  let release = () => {};
  const gate = new Promise<void>((resolve) => (release = resolve));
  const hold = async (route: Route) => {
    await gate;
    await route.fallback();
  };
  await page.route("**/api/chat", hold);
  await ask(page, `FLYGUTVAL ${words}`);
  await expect(panel(page)).toContainText("Agneta tänker …");
  await page.getByRole("button", { name: "Fler resenärer" }).click();
  await page.getByRole("button", { name: "Sök", exact: true }).click();
  await expect(page).toHaveURL(/resenarer=3$/);
  release();
  await expect(panel(page)).toContainText(CHANGED_TEXT);
  await expect(page).toHaveURL(/resenarer=3$/);
  await page.unroute("**/api/chat", hold);
  await ask(page, "Och nu?");
  await expect(panel(page)).toContainText("Svar från Agneta på: Och nu?");
  expect(bodies.at(-1)!.agent).toMatchObject({ url: expect.stringContaining("resenarer=3") });
});

test("TRIP-036-R2 R3 the shortcut goes from one sentence through the plan step to Resenärer with the departures, the aircraft and the classes in the address", async ({ page, fleet }) => {
  void fleet; // the tests' own aircraft must exist
  await agentOn(page);
  await shortcut(page);
  await expect(panel(page)).toContainText("Jag tog de första och billigaste planen");
  // Resenärer shows the aircraft she chose, from the address
  await expect(page.getByRole("main")).toContainText(fleet.large);
  await expectNoA11yViolations(page);
});

test("TRIP-036-R3 on the plan step she lists the aircraft and sets one for each flight; what the page would refuse is refused, she says what, and the address stays", async ({ page, fleet }) => {
  void fleet;
  await agentOn(page);
  await page.goto(`/flyg/plan?${search}&ut=08%3A20&hem=06%3A45`);
  await ask(page, "FORSTORA antal=2");
  await expect(panel(page)).toContainText(/has room for \d+, not 99/);
  await ask(page, "OGILTIGT");
  await expect(panel(page)).toContainText("No such aircraft among those that seat 2 travellers");
  await expect(page).not.toHaveURL(/ut-plan/);

  await ask(page, "PLAN antal=2");
  await expect(page).toHaveURL(/\/plan\?.*&ut-plan=\d+&ut-klasser=[^&]+&hem=06%3A45&hem-plan=\d+&hem-klasser=[^&]+$/);
  // The page follows the address as when the visitor chooses by hand: opened again, both flights are done
  await page.reload();
  await expect(page.getByRole("button", { name: /^Klart för utresan/ })).toBeVisible();
  await expect(page.getByRole("button", { name: /^Klart för hemresan/ })).toBeVisible();
  await expectNoA11yViolations(page);
});

test("TRIP-036-R4 the add-ons she sets are in the form of every traveller on both flights, the visitor can change them, and she lists what can be bought", async ({ page, fleet }) => {
  await openBooking(page, fleet.large, { [fleet.base]: 2 }, true);
  await agentOnNow(page);
  await ask(page, "TILLAGGSLISTA");
  await expect(panel(page)).toContainText("utresan (");
  await ask(page, `KLASSTILLAGG namn=${fleet.meal} antal=2`);
  for (const n of [1, 2]) {
    for (const leg of ["Utresa", "Hemresa"]) {
      const group = passenger(page, n).getByRole("group", { name: leg });
      await expect(group.getByRole("button", { name: `Fler ${fleet.meal}` }).locator("xpath=..").locator("[aria-live]")).toHaveText(/^2 /);
    }
  }
  // Changing one is the visitor's own: it stays
  const meal = passenger(page, 1).getByRole("group", { name: "Utresa" }).getByRole("button", { name: `Färre ${fleet.meal}` });
  await meal.click();
  await expect(meal.locator("xpath=..").locator("[aria-live]")).toHaveText(/^1 /);
  await expect(page.getByRole("status").filter({ hasText: "Dessa tillägg togs bort" })).toHaveCount(0);
  await expectNoA11yViolations(page);
});

test.describe("beer", () => {
  // The rule is for the add-on named Öl, and add-on names are unique: a deployed site's own Öl would stop the test from creating one
  test.skip(!process.env.ADMIN_PASSWORD, "Creates the add-on Öl: needs the admin password");

  test("TRIP-036-R4 she sets the beer without asking for ages, says it is for adults, and the form removes it from a traveller under 18", async ({ page, fleet }) => {
    const aircraft = "E2E Plan Flygöl";
    await signIn(page);
    await createAddon(page, "Öl", "100", "En kall");
    await createAircraft(page, aircraft, [{ name: fleet.base, seats: 10 }], [{ name: "Öl", className: fleet.base }]);
    try {
      await openBooking(page, aircraft, { [fleet.base]: 1 }, true);
      await agentOnNow(page);
      await ask(page, "KLASSTILLAGG namn=Öl antal=1");
      await expect(panel(page)).toContainText("for adults only");
      const card = passenger(page, 1);
      const beer = card.getByRole("group", { name: "Utresa" }).getByRole("listitem").filter({ hasText: "En kall" });
      await card.getByLabel("Ålder").selectOption("40");
      await expect(beer.locator("[aria-live]")).toHaveText("1 Öl");
      await card.getByLabel("Ålder").selectOption("16");
      await expect(beer.locator("[aria-live]")).toHaveText("0 Öl");
      await expect(card.getByRole("status")).toHaveText("Ölen togs bort eftersom passageraren är under 18 år.");
      await expectNoA11yViolations(page);
    } finally {
      await page.goto("/admin");
      await deleteWithConfirmation(page, `Ta bort ${aircraft}`);
      await deleteWithConfirmation(page, "Ta bort Öl");
    }
  });
});

test("TRIP-036-R5 R6 nothing personal reaches the model; no button until the form is valid and the payment page has a payment method; a failing booking shows the message; two presses give one booking and the chat says the number", async ({ page, fleet }) => {
  void fleet;
  const email = "flygagent@exempel.se";
  const bodies = recordQuestions(page);
  try {
    await agentOn(page);
    await shortcut(page);

    // R5: the form is not valid, so she does not open the payment page and no button is offered
    await ask(page, "BOKA");
    await expect(panel(page)).toContainText("Tryck på knappen, om du måste.");
    await expect(bookButton(page)).toHaveCount(0);
    await ask(page, "BETALSIDAN");
    await expect(panel(page)).toContainText("not valid");
    await expect(page).toHaveURL(/\/flyg\/boka\?/);
    expect(bodies.at(-1)!.agent).toMatchObject({ valid: false, payment: null });

    // The visitor fills in the form themselves; the payment page and the method come first, then the button, not on Resenärer
    await fillAll(page, 2, email);
    await ask(page, "BOKA");
    await expect(panel(page).getByText("Tryck på knappen, om du måste.")).toHaveCount(2); // the answer is in before the button is looked for
    await expect(bookButton(page)).toHaveCount(0);
    await ask(page, "BETALSIDAN");
    await expect(page).toHaveURL(/\/flyg\/boka\/betala\?/);
    await ask(page, "BETALSATT");
    await expect(page.getByRole("radio", { name: /Cash till piloten/ })).toBeChecked();
    await ask(page, "BOKA");
    await expect(bookButton(page)).toBeVisible();
    expect(bodies.at(-1)!.agent).toEqual({ url: new URL(page.url()).pathname + new URL(page.url()).search, extras: [], payment: "cash", valid: true, choice: expect.anything(), nerves: 0 }); // TRIP-044: classes and add-ons, no names
    expect(JSON.stringify(bodies)).not.toMatch(/E2E Resenär|Anna|Storgatan|flygagent@exempel/);
    await expectNoA11yViolations(page);

    // R6: no press, no booking; a booking the server refuses shows its message under the button
    expect(await countBookings(email)).toBe(0);
    await page.route("**/flyg/boka/betala**", async (route) => {
      if (!route.request().headers()["next-action"]) return route.fallback();
      await route.fulfill({ status: 200, contentType: "text/x-component", body: '0:{"a":"$@1","f":"","b":"x"}\n1:{"ok":false,"error":"Resan har ändrats."}\n' });
    });
    await bookButton(page).click();
    await expect(panel(page).getByRole("alert")).toHaveText("Resan har ändrats.");
    await expect(page).toHaveURL(/\/flyg\/boka\/betala\?/);
    expect(await countBookings(email)).toBe(0);
    await page.unroute("**/flyg/boka/betala**");

    // Two quick presses give one booking, and the chat says the number the page shows
    await bookButton(page).click({ clickCount: 2 });
    await expect(page).toHaveURL(/\/flyg\/bokad$/);
    const number = (await page.getByText(/^Bokningsnummer/).textContent())!.match(/[A-HJ-NP-Z2-9]{6}$/)![0];
    await expect(panel(page)).toContainText(bookedText(number));
    expect(await countBookings(email)).toBe(1);
    await expectNoA11yViolations(page);
  } finally {
    await deleteBookings(email);
  }
});
