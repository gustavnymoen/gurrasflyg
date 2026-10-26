import { expect, test, type Page } from "@playwright/test";
import { expectNoA11yViolations } from "./helpers";

// Destination pages and search (TRIP-013). The rules (matching, counts, prices,
// names) are unit tests in lib/destinations.test.ts; these tests show that the
// pages use them. Nothing is written, so they also run against the live site.
// The look is checked in tests/TECH-018-design.spec.ts.

const search = (page: Page) => page.getByRole("combobox", { name: "Sök resmål" });
const heading = (page: Page, text: string | RegExp) => page.getByRole("heading", { name: text, exact: typeof text === "string" });
const card = (page: Page, title: string) =>
  page.locator("section").filter({ has: page.getByRole("heading", { level: 3, name: title, exact: true }) });
const filter = (page: Page, label: "Världsdel" | "Land" | "Tillträde" | "Kategori") => page.getByLabel(label, { exact: true });
// "47 destinationer" -> 47
const resultCount = async (page: Page) =>
  Number((await page.getByRole("heading", { level: 2, name: /^\d+ destination(er)?$/ }).innerText()).match(/\d+/)![0]);

test("TRIP-013-R1 suggestions find a destination by its other name, and Enter lists every match", async ({ page }) => {
  await page.goto("/charter");
  await search(page).fill("field station");
  const list = page.getByRole("listbox", { name: "Förslag" });
  await expect(list.getByRole("option", { name: /Teufelsberg listening station/ })).toBeVisible();

  await search(page).press("Enter");
  await expect(page).toHaveURL(/\/charter\?sok=field\+station$/);
  await expect(card(page, "Teufelsberg listening station, Tyskland")).toBeVisible();
  // Waits for the list to be filtered: the card was already there before the search
  await expect(page.getByRole("heading", { level: 3 })).toHaveCount(await resultCount(page));
});

test("TRIP-013-R1 case does not matter in a search", async ({ page }) => {
  await page.goto("/charter?sok=BERLIN");
  const count = await resultCount(page);
  expect(count).toBeGreaterThan(0);
  await page.goto("/charter?sok=berlin");
  expect(await resultCount(page)).toBe(count);
});

test("TRIP-013-R1 a suggestion is chosen with the arrow keys and Enter, and the number of suggestions is announced", async ({
  page,
}) => {
  await page.goto("/charter");
  await search(page).fill("teufel");
  await expect(page.getByRole("listbox", { name: "Förslag" })).toBeVisible();
  await expect(page.getByText("1 förslag")).toBeAttached();

  await search(page).press("ArrowDown");
  await search(page).press("Enter");
  await expect(page).toHaveURL(/\/charter\/teufelsberg$/);
  await expect(heading(page, "Teufelsberg listening station, Tyskland")).toBeVisible();
});

test("TRIP-013-R1 a search without a match says so and offers to clear the search and the filters", async ({ page }) => {
  await page.goto("/charter?sok=zzzzqx&varldsdel=Europe");
  await expect(page.getByText("Inga destinationer matchar.")).toBeVisible();
  await page.getByRole("button", { name: "Rensa sökning och filter" }).click();
  await expect(page).toHaveURL(/\/charter$/);
  await expect(heading(page, "96 destinationer")).toBeVisible();
  await expect(search(page)).toHaveValue("");
});

test("TRIP-013-R2 a continent lists its destinations and limits the countries, and the address keeps the state", async ({
  page,
}) => {
  await page.goto("/charter");
  await filter(page, "Världsdel").selectOption("Europe");
  await expect(heading(page, "47 destinationer")).toBeVisible();
  await expect(page).toHaveURL(/varldsdel=Europe/);
  await expect(filter(page, "Land").locator("option", { hasText: "Japan" })).toHaveCount(0);

  await filter(page, "Land").selectOption("DE");
  await filter(page, "Tillträde").selectOption("Open");
  await expect(page).toHaveURL(/varldsdel=Europe&land=DE&tillgang=Open/);
  const count = await resultCount(page);

  await page.reload();
  expect(await resultCount(page)).toBe(count);
  await expect(filter(page, "Land")).toHaveValue("DE");
  await expect(filter(page, "Tillträde")).toHaveValue("Open");

  // Back goes to the state before the last choice
  await page.goBack();
  await expect(filter(page, "Tillträde")).toHaveValue("");
  await expect(filter(page, "Land")).toHaveValue("DE");
});

test("TRIP-013-R2 a choice shows how many destinations it gives, Antarctica leaves the countries unchanged, and an unknown address value is ignored", async ({ page }) => {
  await page.goto("/charter?sok=berlin&varldsdel=Europe");
  const option = filter(page, "Tillträde").locator("option", { hasText: /^Öppen \(\d+\)$/ });
  const shown = Number((await option.innerText()).match(/\((\d+)\)/)![1]);
  await filter(page, "Tillträde").selectOption("Open");
  expect(await resultCount(page)).toBe(shown);
  await page.goto("/charter");
  const before = await filter(page, "Land").locator("option").count();
  await filter(page, "Världsdel").selectOption("Antarctica");
  await expect(heading(page, "2 destinationer")).toBeVisible();
  expect(await filter(page, "Land").locator("option").count()).toBe(before);
  await page.goto("/charter?sok=berlin");
  const count = await resultCount(page);
  await page.goto("/charter?sok=berlin&varldsdel=Atlantis&land=XX&tillgang=Free&kategori=Zoo");
  expect(await resultCount(page)).toBe(count);
  await expect(filter(page, "Världsdel")).toHaveValue("");
});

test("TRIP-013-R2 and TRIP-028-R1 Rensa clears the search and the filters, and there are no start cards", async ({ page }) => {
  await page.goto("/charter?sok=berlin&varldsdel=Europe");
  await page.getByRole("button", { name: "Rensa", exact: true }).click();
  await expect(page).toHaveURL(/\/charter$/);
  await expect(heading(page, "96 destinationer")).toBeVisible();
  await expect(page.getByRole("heading", { level: 2, name: /^(Plats|Aktivitet)/ })).toHaveCount(0);
  await expect(search(page)).toHaveValue("");
  await expect(search(page)).toBeFocused();
});

test("TRIP-013-R5 and TRIP-028-R2 a destination card shows its facts and opens its page, and one without a photo has a plain area", async ({ page }) => {
  await page.goto("/charter");
  const teufelsberg = card(page, "Teufelsberg listening station, Tyskland");
  await expect(teufelsberg.getByText("A Cold War listening station on a hill of wartime rubble in Berlin, now covered in street art.")).toBeVisible();
  await expect(teufelsberg.getByText("Militärt eller kalla kriget")).toBeVisible();
  await expect(teufelsberg.getByText("Öppen", { exact: true })).toBeVisible();
  await expect(teufelsberg.getByText(/^Från 780\s+kr \/ person$/)).toBeVisible();
  await teufelsberg.scrollIntoViewIfNeeded();
  await expect(teufelsberg.locator("img")).toHaveCount(1);

  // TRIP-028-R2: one link, named by the title, and a press anywhere on the card opens the page
  await expect(teufelsberg.getByRole("link")).toHaveCount(1);
  await expect(teufelsberg.getByRole("link", { name: "Teufelsberg listening station, Tyskland" })).toBeVisible();
  // A real mouse press on the photo: it is the link's stretched area that gets it
  const photo = (await teufelsberg.locator("img").boundingBox())!;
  await page.mouse.click(photo.x + 20, photo.y + 20);
  await expect(page).toHaveURL(/\/charter\/teufelsberg$/);
  await page.goto("/charter?sok=osowka");
  const riese = card(page, "Project Riese – Osówka, Polen");
  await expect(riese).toBeVisible();
  await expect(riese.locator("img")).toHaveCount(0);
});

test("TRIP-013-R7 a destination page shows its photo with credits, text sections, facts, airport, ways of getting there, and a gateway or a sea voyage, and an unknown one is a 404", async ({
  page,
  request,
}) => {
  await page.goto("/charter/teufelsberg");
  await expect(heading(page, "Teufelsberg listening station, Tyskland")).toBeVisible();
  for (const section of ["Översikt", "Ta sig dit", "Besöka"]) {
    await expect(heading(page, section)).toBeVisible();
  }

  const credit = page.locator("figure figcaption");
  await expect(page.locator("figure img")).toBeVisible();
  await expect(credit).toContainText("Foto: A.Savin");
  await expect(credit.getByRole("link", { name: "CC BY-SA 3.0" })).toHaveAttribute(
    "href",
    "https://creativecommons.org/licenses/by-sa/3.0",
  );
  await expect(credit.getByRole("link", { name: "bildens källa" })).toHaveAttribute(
    "href",
    /^https:\/\/commons\.wikimedia\.org\//,
  );
  await expect(page.getByRole("link", { name: "Wikipedia" })).toHaveAttribute("href", "https://www.wikipedia.org");

  await expect(page.getByText("Grunewald", { exact: true })).toBeVisible();
  await expect(page.getByText("Field Station Berlin")).toBeVisible();
  await expect(page.getByText("Du flyger till Berlin Brandenburg Airport (BER).")).toBeVisible();
  await expect(page.getByText("35 km från destinationen.")).toBeVisible();
  await expect(page.getByText("Från flygplatsen tar du dig dit med: Tåg, Promenad, Bil, Taxi.")).toBeVisible();
  await expect(
    page.getByText("Texterna är hämtade från vår samarbetspartner Gurras charter AB och är jobbiga att översätta."),
  ).toBeVisible();
  // The text credit is there without a photo too
  await page.goto("/charter/project-riese-osowka");
  await expect(page.locator("figure")).toHaveCount(0);
  await expect(page.getByRole("link", { name: "Wikipedia" })).toBeVisible();

  await page.goto("/charter/grytviken");
  await expect(page.getByText("Nås bara med lång båtresa.")).toBeVisible();

  const destinations: { id: string; gateway_airport: { iata: string; name: string } | null }[] = await (
    await request.get("/api/destinations")
  ).json();
  const gateway = destinations.find((d) => d.gateway_airport)!.gateway_airport!;
  await page.goto(`/charter/${destinations.find((d) => d.gateway_airport)!.id}`);
  await expect(page.getByText(`Du flyger till ${gateway.name} (${gateway.iata}).`)).toBeVisible();
  await expect(page.getByText(/Närmaste flygplats är .*, men dit går inga flyg/)).toBeVisible();

  await page.goto("/charter/does-not-exist");
  await expect(heading(page, "Resmålet finns inte")).toBeVisible();
  await page.getByRole("link", { name: "Till charterresorna" }).click();
  await expect(page).toHaveURL(/\/charter$/);
});

test("TRIP-013-R7 the link back keeps the search and filters", async ({ page }) => {
  await page.goto("/charter?sok=berlin&varldsdel=Europe");
  await card(page, "Teufelsberg listening station, Tyskland").getByRole("link").click();
  await expect(page).toHaveURL(/\/charter\/teufelsberg\?sok=berlin&varldsdel=Europe$/);

  await page.getByRole("link", { name: "← Tillbaka till listan" }).click();
  await expect(page).toHaveURL(/\/charter\?sok=berlin&varldsdel=Europe$/);
  await expect(search(page)).toHaveValue("berlin");
  await expect(filter(page, "Världsdel")).toHaveValue("Europe");
});

const NO_FLIGHTS = "Inga flyg dit just nu, luftrummet är stängt. Du får ta dig dit på egen hand.";

test("TRIP-013-R8 a destination without flights has the notice instead of a price, on its card and its page", async ({
  page,
}) => {
  await page.goto("/charter?sok=chernobyl");
  const chernobyl = card(page, "Chernobyl Exclusion Zone and Pripyat, Ukraina");
  await expect(chernobyl.getByText(NO_FLIGHTS)).toBeVisible();
  await expect(chernobyl.getByText(/Från/)).toHaveCount(0);

  await chernobyl.getByRole("link").click();
  await expect(page.getByRole("alert").filter({ hasText: NO_FLIGHTS })).toBeVisible();
  await expect(page.getByText("Närmaste flygplats är Kyiv Boryspil International Airport (KBP). 170 km från destinationen.")).toBeVisible();
  await expect(page.getByText(/^Från [\d\s]+kr \/ person$/)).toHaveCount(0);
});

test("TRIP-013-R9 /charter has no accessibility violations in any state", async ({ page }) => {
  await page.goto("/charter");
  await expect(page.getByRole("heading", { level: 2, name: /^(Plats|Aktivitet)/ })).toHaveCount(0);
  await expectNoA11yViolations(page);

  await search(page).fill("berlin");
  await expect(page.getByRole("listbox", { name: "Förslag" })).toBeVisible();
  await expectNoA11yViolations(page);

  await page.goto("/charter?sok=berlin&varldsdel=Europe&tillgang=Open");
  await expect(heading(page, /destination/)).toBeVisible();
  await expectNoA11yViolations(page);

  await page.goto("/charter?sok=zzzzqx");
  await expect(page.getByText("Inga destinationer matchar.")).toBeVisible();
  await expectNoA11yViolations(page);

});

test("TRIP-013-R9 the destination pages have no accessibility violations, with and without flights", async ({ page }) => {
  await page.goto("/charter/teufelsberg");
  await expect(heading(page, "Översikt")).toBeVisible();
  await expectNoA11yViolations(page);

  await page.goto("/charter/chernobyl-pripyat");
  await expect(page.getByRole("alert").filter({ hasText: NO_FLIGHTS })).toBeVisible();
  await expectNoA11yViolations(page);
});

test("TRIP-013-R9 a filter keeps focus and the new number of results is announced", async ({ page }) => {
  await page.goto("/charter?sok=berlin");
  await page.waitForLoadState("networkidle"); // hydrated, so the page doesn't rebuild under the focus
  await filter(page, "Världsdel").focus();
  await filter(page, "Världsdel").selectOption("Europe");
  await expect(page).toHaveURL(/varldsdel=Europe/);
  await expect(filter(page, "Världsdel")).toBeFocused();
  const count = await resultCount(page);
  await expect(page.getByRole("status")).toHaveText(`${count} ${count === 1 ? "destination" : "destinationer"} matchar`);
});

test("TRIP-013-R7 @smoke /charter lists destinations and a destination page opens with its photo credit and airport", async ({
  page,
}) => {
  await page.goto("/charter");
  await expect(heading(page, "96 destinationer")).toBeVisible();
  await card(page, "Teufelsberg listening station, Tyskland").getByRole("link").click();
  await expect(page.locator("figure figcaption")).toContainText("Foto: A.Savin");
  await expect(page.getByText("Du flyger till Berlin Brandenburg Airport (BER).")).toBeVisible();
});
