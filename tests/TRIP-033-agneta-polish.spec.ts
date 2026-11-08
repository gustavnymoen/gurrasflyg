import { expect, test, type Page } from "@playwright/test";
import { expectNoA11yViolations, agnetaGreeted } from "./helpers";

// Agneta polish (TRIP-033). Alla prov kör med låtsasklienten (LLM_MOCK=1) eller ett fast svar
// från routen, så inget kostar kursens tak. Utseendet (färg på pricken, panelens bredd) finns i
// tests/TECH-018-design.spec.ts.

const openButton = (page: Page) => page.getByRole("button", { name: "Fråga Agneta" });
const panel = (page: Page) => page.getByRole("region", { name: "Agneta" });
const field = (page: Page) => page.getByLabel("Din fråga");

async function ask(page: Page, question: string) {
  await field(page).fill(question);
  await field(page).press("Enter");
}

// En egen adress, så att frågan till låtsasklienten inte räknas med de andra provens frågor (10 på 5 minuter)
test.use({ extraHTTPHeaders: { "x-forwarded-for": "10.33.0.1" } });

test.beforeEach(({ page }) => agnetaGreeted(page));

test("TRIP-033-R1 R2 the header has the name, Kundtjänstmedarbetare and a green dot with Live, and the greeting is Vad vill du?!, in the panel and in the dialog", async ({
  page,
}) => {
  await page.goto("/");
  await openButton(page).click();
  const header = panel(page).getByRole("heading").locator("../..");
  await expect(header).toContainText("Agneta Karenelius");
  await expect(header).toContainText("Kundtjänstmedarbetare");
  await expect(header.getByText("Live", { exact: true })).toBeVisible();
  await expect(header.getByTestId("agneta-live-dot")).toBeVisible();
  await expect(panel(page).getByRole("log")).toHaveText("Agneta: Vad vill du?!");
  await expectNoA11yViolations(page);

  await page.setViewportSize({ width: 390, height: 844 });
  const dialog = page.getByRole("dialog", { name: /^Agneta/ });
  await expect(dialog).toContainText("Kundtjänstmedarbetare");
  await expect(dialog.getByText("Live", { exact: true })).toBeVisible();
  await expect(dialog.getByRole("log")).toHaveText("Agneta: Vad vill du?!");
  await expectNoA11yViolations(page);
});

test("TRIP-033-R4 an answer that stopped at the token limit is shown whole: no half link, no raw text from it", async ({ page }) => {
  await page.goto("/");
  await openButton(page).click();
  await ask(page, "KAPAD lista");
  const log = panel(page).getByRole("log");
  await expect(log).toContainText("Spökstation.");
  await expect(log).toContainText("Berlin, från 1 000 kr per person");
  await expect(log).not.toContainText("Beelitz");
  await expect(log).not.toContainText("[");
  await expect(log.getByRole("link")).toHaveCount(1);
  await expectNoA11yViolations(page);
});

test("TRIP-033-R4 R5 R7 an answer on the start page has a link to the destination, a bullet and one sub-bullet each, and a half link in a saved answer is not shown", async ({
  page,
}) => {
  const reply = [
    "- [Teufelsberg](/charter/teufelsberg): Spökstation på en kulle.",
    "  - Berlin Brandenburg (BER), från 780 kr per person",
    "- [Prag](/charter/prag): Dyrt öl.",
    "  - Prag Václav Havel (PRG), från 900 kr per person",
    "Se också [Beelitz-Heil",
  ].join("\n");
  await page.route("**/api/chat", (route) => route.fulfill({ json: { reply } }));
  await page.goto("/");
  await openButton(page).click();
  await ask(page, "Vilka resmål finns?");
  const bubble = panel(page).getByRole("log").locator("> div").nth(2);
  await expect(bubble.getByRole("link")).toHaveText(["Teufelsberg", "Prag"]);
  await expect(bubble.getByRole("link").first()).toHaveAttribute("href", "/charter/teufelsberg");
  await expect(bubble.locator("ul > li > ul > li")).toHaveText([
    "Berlin Brandenburg (BER), från 780 kr per person",
    "Prag Václav Havel (PRG), från 900 kr per person",
  ]);
  await expect(bubble).toContainText("Se också");
  await expect(bubble).not.toContainText("[");

  await bubble.getByRole("link").first().click();
  await expect(page).toHaveURL(/\/charter\/teufelsberg$/);
});
