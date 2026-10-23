import { expect, test } from "@playwright/test";
import { chooseAirport, typeAirport } from "./helpers";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("TRIP-001-R1 start page shows the search form", async ({ page }) => {
  // Heading and text from TRIP-020-R2; the name "Gurras Flyg" is in the wordmark
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Vi ordnar det ingen annan kan");
  await expect(page.getByText("Ditt livs flygresa, till städer och till platser andra flygbolag glömt bort.")).toBeVisible();
  await expect(page.getByPlaceholder("Varifrån?")).toBeVisible();
  await expect(page.getByPlaceholder("Vart vill du?")).toBeVisible();
  // The date group (Utresa and Hemresa) is checked by TRIP-009-R1
  await expect(page.getByRole("group", { name: "Datum" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Fler resenärer" })).toBeVisible();
});

test("TRIP-001-R2 suggests at most 5 airports matching name or IATA code", async ({ page }) => {
  let list = await typeAirport(page, "Från", "lon");
  await expect(list.getByRole("option", { name: /London Heathrow/ })).toBeVisible();
  expect(await list.getByRole("option").count()).toBeLessThanOrEqual(5);

  list = await typeAirport(page, "Från", "arn");
  await expect(list.getByRole("option", { name: /Stockholm Arlanda/ })).toBeVisible();

  list = await typeAirport(page, "Från", "a");
  await expect(list.getByRole("option").first()).toBeVisible();
  expect(await list.getByRole("option").count()).toBeLessThanOrEqual(5);
});

test("TRIP-001-R3 says when no airport matches", async ({ page }) => {
  const list = await typeAirport(page, "Till", "zzzz");
  await expect(list).toContainText("Inga flygplatser matchar");
});

test("TRIP-001-R4 airport can be chosen with mouse or keyboard", async ({ page }) => {
  await chooseAirport(page, "Från", "lon", "London Heathrow");
  await expect(page.getByRole("combobox", { name: "Från" })).toHaveValue("London Heathrow (LHR)");
  await expect(page.getByRole("listbox")).toBeHidden();

  const to = page.getByRole("combobox", { name: "Till" });
  const list = await typeAirport(page, "Till", "lon");
  const options = list.getByRole("option");
  await expect(options.nth(1)).toBeVisible();
  await expect(options.nth(0)).toHaveAttribute("aria-selected", "true");
  await to.press("ArrowDown");
  await expect(options.nth(1)).toHaveAttribute("aria-selected", "true");
  await to.press("ArrowUp");
  await expect(options.nth(0)).toHaveAttribute("aria-selected", "true");

  // Wait for the new suggestions: Enter while the old list is still shown
  // chooses from the old list (noted in verification.md)
  await typeAirport(page, "Till", "arlanda");
  await expect(list.getByRole("option")).toHaveCount(1);
  await to.press("Enter");
  await expect(to).toHaveValue("Stockholm Arlanda (ARN)");

  await typeAirport(page, "Till", "lon");
  await to.press("Escape");
  await expect(page.getByRole("listbox")).toBeHidden();
});

test("TRIP-001-R5 same airport in both fields shows an error under the last chosen", async ({ page }) => {
  const message = page.getByText("Ajja bajja, du måste flyga någonstans!");

  await chooseAirport(page, "Från", "arn", "Stockholm Arlanda");
  await chooseAirport(page, "Till", "arn", "Stockholm Arlanda");
  await expect(page.locator("#to-error")).toHaveText("Ajja bajja, du måste flyga någonstans!");
  await expect(page.getByRole("combobox", { name: "Till" })).toHaveAttribute("aria-invalid", "true");

  await chooseAirport(page, "Från", "lon", "London Heathrow");
  await expect(message).toBeHidden();

  await chooseAirport(page, "Från", "arn", "Stockholm Arlanda");
  await expect(page.locator("#from-error")).toHaveText("Ajja bajja, du måste flyga någonstans!");
  await expect(page.locator("#to-error")).toBeHidden();
});

test("TRIP-001-R8 number of travellers is between 1 and 10", async ({ page }) => {
  const fewer = page.getByRole("button", { name: "Färre resenärer" });
  const more = page.getByRole("button", { name: "Fler resenärer" });
  const count = page.locator(".tabular-nums");
  await expect(count).toHaveText("1");
  await expect(fewer).toBeDisabled();

  for (let i = 0; i < 9; i++) await more.click();
  await expect(more).toBeDisabled();
  await expect(fewer).toBeEnabled();
  await expect(count).toHaveText("10");

  await fewer.click();
  await expect(more).toBeEnabled();
});

test("TRIP-001-R10 airport endpoint returns at most 5 matches", async ({ request }) => {
  const response = await request.get("/api/airports?q=lon");
  expect(response.status()).toBe(200);
  const airports = await response.json();
  expect(airports.length).toBeGreaterThan(0);
  expect(airports.length).toBeLessThanOrEqual(5);
  for (const airport of airports) {
    expect(Object.keys(airport).sort()).toEqual(["country", "iata", "id", "name", "timezone"]);
  }

  const empty = await request.get("/api/airports?q=");
  expect(await empty.json()).toEqual([]);
});
