import { expect, type Page } from "@playwright/test";
import { expectNoA11yViolations, runsLocally } from "./helpers";
import { amount, openBooking, openCharterBooking, passenger, test } from "./plan";

// Agneta's total is the page's (TRIP-044-R2). The calculation is a unit test in lib/agent.test.ts; here the
// chat sends the form's non-personal part and the page and her summary are compared, with the fake agent
// (LLM_MOCK=1, lib/chat-mock.ts), so it only runs locally.
test.skip(!runsLocally, "the fake agent is only in the local test server");

const address = () => `10.44.${Math.floor(Math.random() * 250)}.${Math.floor(Math.random() * 250)}`;
test.beforeEach(({ context }) => context.setExtraHTTPHeaders({ "x-forwarded-for": address() }));

const panel = (page: Page) => page.getByRole("region", { name: "Agneta" });

async function agentOnNow(page: Page) {
  await page.evaluate(() => sessionStorage.setItem("agneta-chat", JSON.stringify({ open: true, agent: true, entries: [{ role: "assistant", content: "Vad vill du?!" }] })));
  await page.reload();
  await expect(panel(page)).toBeVisible();
}

// The total of the page (only the visible one: earlier steps stay in the page, hidden) and the one in her summary
const pageTotal = async (page: Page) =>
  amount(await page.getByText(/^Totalt för resan, \d+ resenärer?$/).filter({ visible: true }).locator("xpath=following-sibling::*[1]").textContent());

async function agnetaTotal(page: Page) {
  await page.getByLabel("Din fråga").fill("SAMMANFATTA");
  await page.getByLabel("Din fråga").press("Enter");
  const line = panel(page).getByText(/^Total price: /);
  await expect(line).toBeVisible();
  return amount((await line.textContent())!.replace("Total price: ", ""));
}

const more = (page: Page, n: number, leg: "Utresa" | "Hemresa", name: string) =>
  passenger(page, n).getByRole("group", { name: leg }).getByRole("button", { name: `Fler ${name}` });

test("TRIP-044-R2 the flight total in her summary is the page's, with add-ons chosen in the form and Dåliga nerver", async ({ page, fleet }) => {
  await openBooking(page, fleet.large, { [fleet.base]: 2 }, true);
  await more(page, 1, "Utresa", fleet.meal).click();
  await more(page, 2, "Hemresa", fleet.meal).click();
  await more(page, 2, "Hemresa", fleet.meal).click();
  await passenger(page, 2).getByRole("checkbox", { name: "Dåliga nerver" }).check();
  await agentOnNow(page);
  const expected = await pageTotal(page);
  expect(await agnetaTotal(page)).toBe(expected);
  await expectNoA11yViolations(page);
});

test("TRIP-044-R2 the charter total in her summary is the page's, with add-ons chosen in the form and the extras", async ({ page, fleet }) => {
  await openCharterBooking(page, fleet.large, { [fleet.base]: 2 });
  await more(page, 1, "Utresa", fleet.meal).click();
  await more(page, 2, "Hemresa", fleet.meal).click();
  await page.getByRole("checkbox", { name: "Bear Grylls Experience" }).check();
  await agentOnNow(page);
  const expected = await pageTotal(page);
  expect(await agnetaTotal(page)).toBe(expected);
  await expectNoA11yViolations(page);
});
