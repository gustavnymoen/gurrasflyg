import { beforeAll, expect, test, vi } from "vitest";
import { queryUnitDb } from "../db/test-db";
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
  expect(prompt).toContain("You are Agneta Spydenius");
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
