import { afterAll, beforeAll, expect, test, vi } from "vitest";
import { openUnitDb, queryUnitDb } from "../db/test-db";
import { unitTestDbFile } from "./local-db.mjs";
import { MAX_AUTHOR_LENGTH, MAX_REVIEW_LENGTH, MAX_TITLE_LENGTH } from "./review-rules";

// connection() i lib/reviews.ts finns bara i en förfrågan till sajten
vi.mock("next/server", () => ({ connection: async () => {} }));

// Sparar omdömen i enhetstesternas egen databas, aldrig i din. lib/db.ts läser
// adressen när den importeras, så modulerna importeras först när den är satt.
process.env.TURSO_DATABASE_URL = `file:${unitTestDbFile}`;
let reviews: typeof import("./reviews");
let AdminError: typeof import("./admin").AdminError;

// Testets omdömen har titeln "unit" så att de går att städa bort
const valid = { rating: 4, title: "unit", author: "Unit Test", body: "Bra resa." };
const countUnit = async () =>
  Number((await queryUnitDb<{ n: number }>("SELECT COUNT(*) AS n FROM reviews WHERE title LIKE 'unit%'"))[0].n);
const create = (over: Record<string, unknown>) => reviews.createReview({ ...valid, ...over } as never);

beforeAll(async () => {
  reviews = await import("./reviews");
  ({ AdminError } = await import("./admin"));
});

afterAll(async () => {
  const db = openUnitDb();
  try {
    await db.execute("DELETE FROM reviews WHERE title LIKE 'unit%'");
  } finally {
    db.close();
  }
});

test("TECH-029-R3 a rating that is not an integer from 1 to 5 is refused and nothing is saved", async () => {
  for (const rating of [0, 6, 2.5, "x"]) {
    await expect(create({ rating })).rejects.toThrow(new AdminError("Välj mellan 1 och 5 stjärnor."));
  }
  expect(await countUnit()).toBe(0);
});

test("TECH-029-R3 an empty, blank or non-text title, author or text is refused", async () => {
  const cases = [
    ["title", "Omdömet måste ha en rubrik."],
    ["author", "Ange vem som lämnat omdömet."],
    ["body", "Skriv en text till omdömet."],
  ] as const;
  for (const [field, message] of cases) {
    for (const value of ["", "   ", 5, null, undefined]) {
      await expect(create({ [field]: value })).rejects.toThrow(new AdminError(message));
    }
  }
  expect(await countUnit()).toBe(0);
});

test("TECH-029-R3 a value one character over its limit is refused, exactly at the limit it is saved", async () => {
  const over = [
    ["author", MAX_AUTHOR_LENGTH],
    ["title", MAX_TITLE_LENGTH],
    ["body", MAX_REVIEW_LENGTH],
  ] as const;
  for (const [field, max] of over) {
    // Titeln måste börja på "unit" för städningen
    const text = (n: number) => (field === "title" ? "unit" + "x".repeat(n - 4) : "x".repeat(n));
    await expect(create({ [field]: text(max + 1) })).rejects.toThrow(AdminError);
    await create({ [field]: text(max) });
  }
  expect(await countUnit()).toBe(3);
});

test("TECH-029-R3 a valid review is saved trimmed, listed newest first and can be deleted", async () => {
  await create({ title: "  unit first  ", author: "  Unit A  ", body: "  Text  " });
  await create({ title: "unit second" });
  const mine = (await reviews.listReviews()).filter((r) => r.title.startsWith("unit "));
  expect(mine.map((r) => r.title)).toEqual(["unit second", "unit first"]);
  expect(mine[1]).toMatchObject({ rating: 4, author: "Unit A", body: "Text" });
  await reviews.deleteReview(mine[0].id);
  const left = (await reviews.listReviews()).filter((r) => r.title.startsWith("unit "));
  expect(left.map((r) => r.title)).toEqual(["unit first"]);
});
