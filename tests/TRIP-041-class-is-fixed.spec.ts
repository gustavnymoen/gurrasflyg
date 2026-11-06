import { expect, type Locator } from "@playwright/test";
import { expectNoA11yViolations, runsLocally } from "./helpers";
import {
  chooseAircraft,
  done,
  fillAll,
  folded,
  openBooking,
  openCharterBooking,
  passenger,
  place,
  test,
} from "./plan";

// The class is chosen once, in the plan step, and only shown on Resenärer (TRIP-041). The rules behind it
// (the classes in order, what a changed plan removes, the server's check) are unit tests in
// lib/booking-rules.test.ts and lib/agent.test.ts.

const legGroup = (card: Locator, leg: "Utresa" | "Hemresa") => card.getByRole("group", { name: leg });
const addonRow = (card: Locator, name: string) => legGroup(card, "Utresa").getByRole("listitem").filter({ hasText: name });

test.describe("with the tests' own aircraft", () => {
  test.skip(!process.env.ADMIN_PASSWORD, "ADMIN_PASSWORD is not set");

  test("TRIP-041-R1 R2 the class is shown as text with no choice, add-ons stay, and a changed plan removes them with a message while the rest of the form stays", async ({
    page,
    fleet,
  }) => {
    await openBooking(page, fleet.large, { [fleet.luxury]: 1 });
    await fillAll(page, 1);
    const card = passenger(page, 1);

    // R1: the class is text, with no field to change it, and a link back to the plan step
    await expect(legGroup(card, "Utresa").getByText(/^Klass:/)).toContainText(fleet.luxury);
    await expect(page.getByLabel("Klass", { exact: true })).toHaveCount(0);
    await expect(page.getByRole("combobox", { name: "Klass" })).toHaveCount(0);
    await expect(page.getByRole("link", { name: "Ändra plan och klasser" })).toBeVisible();
    await expectNoA11yViolations(page);

    // The add-ons are chosen as before, and stay after a reload
    await addonRow(card, fleet.meal).getByRole("button", { name: `Fler ${fleet.meal}` }).click();
    await page.reload();
    await expect(addonRow(card, fleet.meal).locator("[aria-live]")).toHaveText(`1 ${fleet.meal}`);

    // R2: back to the plan step and another aircraft; the page tells what was removed and keeps the rest
    await page.getByRole("link", { name: "Ändra plan och klasser" }).click();
    await expect(page.getByRole("heading", { name: "Välj plan och klass", level: 1 })).toBeVisible();
    // After a reload every done flight is folded
    await page.reload();
    await folded(page, "utresan").click();
    await chooseAircraft(page, "utresan", fleet.fast);
    await place(page, "utresan", fleet.base, 1);
    await done(page, "utresan");

    const removed = page.getByRole("status").filter({ hasText: "Dessa tillägg togs bort" });
    await expect(legGroup(card, "Utresa").getByText(/^Klass:/)).toContainText(fleet.base);
    await expect(removed).toContainText(`Passagerare 1, utresan: ${fleet.meal}`);
    await expect(legGroup(card, "Utresa").getByText("Inga tillägg i den här klassen.")).toBeVisible();
    await expect(card.getByLabel("Förnamn")).toHaveValue("E2E Resenär 1");
    await expect(page.getByRole("region", { name: "Kontaktperson" }).getByLabel("E-post")).toHaveValue("anna@exempel.se");
    await expectNoA11yViolations(page);
  });
});

// Agneta on the charter passengers page (R4): the scripted agent of lib/chat-mock.ts
test.describe("Agneta", () => {
  test.skip(!runsLocally, "the fake agent is only in the local test server");
  test("TRIP-041-R4 asked for another class on Resenärer she sends the visitor back to the plan step", async ({ page, fleet }) => {
    await page.context().setExtraHTTPHeaders({ "x-forwarded-for": `10.41.${Math.floor(Math.random() * 250)}.${Math.floor(Math.random() * 250)}` });
    await page.addInitScript(() => {
      if (sessionStorage.getItem("agneta-chat")) return;
      const greeting = { role: "assistant", content: "Vad vill du?!" };
      sessionStorage.setItem("agneta-chat", JSON.stringify({ open: true, agent: true, entries: [greeting] }));
    });
    await openCharterBooking(page, fleet.large, { [fleet.base]: 2 });
    await expect(page.getByLabel("Klass", { exact: true })).toHaveCount(0);

    const field = page.getByLabel("Din fråga");
    await field.fill("ANNANKLASS antal=2");
    await field.press("Enter");
    await expect(page).toHaveURL(/\/plan\?.*&ut-plan=\d+&ut-klasser=[^&]+&hem-plan=\d+&hem-klasser=[^&]+$/);
    await expect(page.getByRole("region", { name: "Agneta" })).toContainText("Klassen går inte att byta på Resenärer");
  });
});
