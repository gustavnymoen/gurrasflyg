import { beforeAll, expect, test, vi } from "vitest";
import { openUnitDb, queryUnitDb } from "../db/test-db";
import { formatPrice } from "./format";
import { unitTestDbFile } from "./local-db.mjs";

// Läser enhetstesternas databas (vitest.global-setup.mjs), aldrig din egen.
vi.mock("next/server", () => ({ connection: async () => {} }));
process.env.TURSO_DATABASE_URL = `file:${unitTestDbFile}`;
let prompt: string;
let build: typeof import("./chat-prompt").buildSystemPrompt;

beforeAll(async () => {
  ({ buildSystemPrompt: build } = await import("./chat-prompt"));
  prompt = await build();
});

test("TRIP-017-R1 building the prompt twice gives the same text", async () => {
  expect(await build()).toBe(prompt);
});

test("TRIP-017-R1 every destination is in the prompt in id order", async () => {
  const rows = await queryUnitDb<{ id: string; title: string }>("SELECT id, title FROM destinations ORDER BY id");
  expect(rows).toHaveLength(96);
  const positions = rows.map((r) => prompt.indexOf(`<destination id="${r.id}">`));
  expect(positions).toEqual(positions.toSorted((x, y) => x - y));
  expect(positions.every((p) => p >= 0)).toBe(true);
  for (const r of rows) expect(prompt).toContain(`Title: ${r.title}\n`);
});

test("TRIP-017-R1 a destination shows the airport and the price its page shows, and its timetables", () => {
  // Teufelsberg: Berlin BER, tur och retur; priset är billigaste ut plus billigaste hem
  const section = prompt.slice(prompt.indexOf('<destination id="teufelsberg">'), prompt.indexOf("</destination>", prompt.indexOf('<destination id="teufelsberg">')));
  expect(section).toContain("Flights: you fly to Berlin Brandenburg Airport (BER); round trip from 780");
  expect(section).toContain("- ARN to BER: Mon");
  expect(section).toContain("- BER to ARN:");
  expect(section).toContain("SK1122");
});

test("TRIP-017-R1 a destination with no flights says so", async () => {
  const [none] = await queryUnitDb<{ id: string }>(
    `SELECT d.id FROM destinations d WHERE NOT EXISTS (
       SELECT 1 FROM charter_timetables t WHERE t.to_airport IN (d.nearest_airport, d.gateway_airport))
     ORDER BY d.id LIMIT 1`,
  );
  const start = prompt.indexOf(`<destination id="${none.id}">`);
  expect(prompt.slice(start, prompt.indexOf("</destination>", start))).toContain("Flights: Inga flyg dit just nu");
});

test("TRIP-017-R1 R3 the instructions and the booking text are in it, and nothing that changes per request", () => {
  expect(prompt).toContain("You are Agneta");
  expect(prompt).toContain("# How to book a charter trip");
  expect(prompt).toContain("CH-");
  expect(prompt).toContain("Min bokning");
  expect(prompt).not.toContain("/images/"); // inga fotokrediteringar
  expect(prompt).not.toMatch(/today is|current date|\b20\d\d-\d\d-\d\dT/i);
});

test("TRIP-017-R1 the prompt follows a change in the database", async () => {
  await queryUnitDb("UPDATE destination_pages SET overview = overview || ' ZZ-CHANGED-ZZ' WHERE destination_id = 'teufelsberg'");
  try {
    expect(await build()).toContain("ZZ-CHANGED-ZZ");
  } finally {
    await queryUnitDb("UPDATE destination_pages SET overview = REPLACE(overview, ' ZZ-CHANGED-ZZ', '') WHERE destination_id = 'teufelsberg'");
  }
});

test("TRIP-032-R1 the Voice section has the tone rules", () => {
  const voice = prompt.slice(prompt.indexOf("# Voice"), prompt.indexOf("# How to book"));
  expect(voice).toContain("Never start an answer by repeating the visitor's question");
  expect(voice).toContain("Do not insist that a destination is bad");
  expect(voice).toContain("At most one such trait per answer");
});

test("TRIP-032-R2 every destination has its page path, and the format rules are in the instructions", async () => {
  const rows = await queryUnitDb<{ id: string }>("SELECT id FROM destinations ORDER BY id");
  for (const r of rows) expect(prompt).toContain(`Page: /charter/${r.id}\n`);
  expect(prompt).toContain("[Title](/charter/id)");
  expect(prompt).toContain("always write the destination's name in full");
});

test("TRIP-033-R3 the Voice section says the tone is there from the first answer", () => {
  const voice = prompt.slice(prompt.indexOf("# Voice"), prompt.indexOf("# How to book"));
  expect(voice).toContain("The tone is there from your very first answer");
});

test("TRIP-033-R5 R7 the format rules say link on every page and one bullet with one sub-bullet per destination", () => {
  expect(prompt).toContain("on every page and in every answer, give its page as a link");
  expect(prompt).toContain("one bullet per destination");
  expect(prompt).toContain("exactly one sub-bullet");
  expect(prompt).toContain('the airport and the price "from" per person');
  expect(prompt).toContain("never a list that stops after the first");
});

test("TRIP-044-R1 ordinary flights are not declined: she can search and book them with the button, and never guesses a departure, a time or a price", () => {
  expect(prompt).not.toContain("and nothing else");
  expect(prompt).not.toContain("is pointed to the tab Flyg");
  expect(prompt).toContain("Ordinary flights are not declined");
  expect(prompt).toContain("never guess them, but that you can search and book it for them, and end with the [[HELP]] line");
  expect(prompt).toContain("the knowledge has nothing about ordinary flights");
  expect(prompt).toContain("you never invent what a search would give");
});

test("TRIP-035-R4 the surname is only in the header: not in the prompt", () => {
  expect(prompt).not.toMatch(/Karenelius|Spydenius/);
});

test("TRIP-035-R5 the voice is ruder but keeps the rules: always help, no swearing, no insults, facts as in the knowledge", () => {
  const voice = prompt.slice(prompt.indexOf("# Voice"), prompt.indexOf("# How to book"));
  expect(voice).toContain("rude, grudging and dry");
  expect(voice).toContain("never insult the visitor as a person and you never swear");
  expect(voice).toContain("You always help");
  expect(voice).toContain("prices, dates, refusals and facts are exactly as in the knowledge");
  expect(voice).toContain("nothing is paid and no price, booking or fact changes");
});

test("TRIP-035-R6 she writes the whole list best match first, and ends the whole list with [[ALL]] only when asked for the rest", () => {
  expect(prompt).toContain("write the whole list in your first answer, the best match first");
  expect(prompt).toContain("never shorten the list yourself");
  expect(prompt).toContain("a last line of exactly [[ALL]]");
  expect(prompt).toContain("Never add that line to any other answer");
});

// TRIP-045: plan, klasser och tillägg. Testet lägger till ett eget plan och tar bort det efteråt.
const PLANE = "Prompt Plan";

async function withPlane<T>(check: (prompt: string) => Promise<T> | T, priceFactor = 130) {
  const db = openUnitDb();
  let aircraftId = 0;
  let addonId = 0;
  try {
    const business = Number((await db.execute("SELECT id FROM classes WHERE name = 'Business'")).rows[0].id);
    aircraftId = Number((await db.execute({ sql: "INSERT INTO aircraft (name, price_percent, time_percent) VALUES (?, ?, 400)", args: [PLANE, priceFactor] })).lastInsertRowid);
    addonId = Number((await db.execute("INSERT INTO addons (name, description, price) VALUES ('Prompt Öl', 'Kall', 77)")).lastInsertRowid);
    await db.execute({ sql: "INSERT INTO aircraft_capacity (aircraft_id, class_id, capacity) VALUES (?, ?, 6)", args: [aircraftId, business] });
    await db.execute({ sql: "INSERT INTO aircraft_capacity (aircraft_id, class_id, capacity) VALUES (?, (SELECT id FROM classes WHERE name = 'Ekonomi'), 12)", args: [aircraftId] });
    await db.execute({ sql: "INSERT INTO aircraft_class_addons (aircraft_id, class_id, addon_id) VALUES (?, ?, ?)", args: [aircraftId, business, addonId] });
    return await check(await build());
  } finally {
    await db.execute({ sql: "DELETE FROM aircraft_class_addons WHERE aircraft_id = ?", args: [aircraftId] });
    await db.execute({ sql: "DELETE FROM aircraft_capacity WHERE aircraft_id = ?", args: [aircraftId] });
    await db.execute({ sql: "DELETE FROM aircraft WHERE id = ?", args: [aircraftId] });
    await db.execute({ sql: "DELETE FROM addons WHERE id = ?", args: [addonId] });
    db.close();
  }
}

test("TRIP-045-R1 every destination has its continent", async () => {
  const rows = await queryUnitDb<{ id: string; continent: string }>("SELECT id, continent FROM destinations ORDER BY id");
  for (const r of rows) {
    const start = prompt.indexOf(`<destination id="${r.id}">`);
    expect(prompt.slice(start, prompt.indexOf("</destination>", start))).toContain(`Continent: ${r.continent}\n`);
  }
});

test("TRIP-045-R2 R3 R4 an aircraft is in the text with its factors, its classes with seats and the add-ons it offers", async () => {
  await withPlane((text) => {
    expect(text).toContain(`- ${PLANE}: price factor 1,30, time factor 4,00\n  - Ekonomi: 12 seats, class price factor 1,00; add-ons: none\n  - Business: 6 seats, class price factor 1,50; add-ons: Prompt Öl (${formatPrice(77)}, Kall)`);
    expect(text).toContain("In a charter trip the time factor is not used");
    expect(text).toContain("up to 10 of each")
    expect(text).toContain("per traveller and per flight (in charter, per trip)");
    expect(text).toContain("A beer cannot be chosen when the traveller is under 18");
    expect(text).toContain(`Dåliga nerver costs ${formatPrice(1000)} per traveller and flight`);
  });
});

test("TRIP-045-R4 the extras for a charter trip are in the booking text with their prices", () => {
  expect(prompt).toContain(`Dryckespaket XXXL (${formatPrice(4000)})`);
});

test("TRIP-045-R5 the text follows a changed factor, and is the same again after it is changed back", async () => {
  const before = await build();
  const changed = await withPlane((text) => text, 130);
  const other = await withPlane((text) => text, 170);
  expect(changed).toContain("price factor 1,30");
  expect(other).toContain("price factor 1,70");
  expect(other).not.toContain("price factor 1,30");
  expect(await build()).toBe(before);
  expect(before).not.toContain(PLANE);
});

test("TRIP-045-R6 the instructions say to use only this data and never to price a route from the factors", () => {
  expect(prompt).toContain("A continent, an aircraft, a class or an add-on that is not there does not exist for us");
  expect(prompt).toContain("Never give the price or the flight time of a route from the factors");
});
