import { readFileSync } from "node:fs";
import { createClient } from "@libsql/client";
import { expect, test } from "vitest";
import { queryUnitDb } from "../test-db";

// The classes' factors are read from the unit tests' own database (built by
// vitest.global-setup.mjs from schema, seed and all migrations). It has no
// aircraft, since they are added in admin, so the aircraft are checked by
// running the migration on a database in memory with the real aircraft's names.

const readSql = (file: string) => readFileSync(`db/${file}`, "utf8");

test("TRIP-011-R6 the classes start with their price factors", async () => {
  const classes = await queryUnitDb<{ name: string; price_percent: number }>(
    "SELECT name, price_percent FROM classes ORDER BY id",
  );
  expect(classes.map((c) => [c.name, c.price_percent])).toEqual([
    ["Ekonomi", 100],
    ["Business", 150],
    ["Första klass", 250],
  ]);
});

test("TRIP-011-R8 the aircraft start with their price and time factors", async () => {
  const db = createClient({ url: ":memory:" });
  try {
    await db.executeMultiple(readSql("schema.sql"));
    await db.execute(`INSERT INTO aircraft (name) VALUES
      ('Hindenburg'), ('Millenium Falcon'), ('F35'), ('test plan')`);
    await db.execute("INSERT INTO classes (name) VALUES ('Svärmorsluckan')");
    await db.executeMultiple(readSql("migrations/008_factors.sql"));

    const aircraft = await db.execute("SELECT name, price_percent, time_percent FROM aircraft ORDER BY id");
    expect(aircraft.rows.map((r) => [r.name, r.price_percent, r.time_percent])).toEqual([
      ["Hindenburg", 120, 400],
      ["Millenium Falcon", 300, 30],
      ["F35", 800, 40],
      ["test plan", 100, 100],
    ]);
    const other = await db.execute("SELECT price_percent FROM classes WHERE name = 'Svärmorsluckan'");
    expect(other.rows[0].price_percent).toBe(100);
  } finally {
    db.close();
  }
});

test("TRIP-011-R6 the database refuses factors outside their limits", async () => {
  const db = createClient({ url: ":memory:" });
  try {
    await db.executeMultiple(readSql("schema.sql"));
    await db.executeMultiple(readSql("migrations/008_factors.sql"));
    for (const sql of [
      "INSERT INTO classes (name, price_percent) VALUES ('Billig', 90)",
      "INSERT INTO classes (name, price_percent) VALUES ('Lyxig', 1001)",
      "INSERT INTO aircraft (name, time_percent) VALUES ('Stilla', 0)",
      "INSERT INTO aircraft (name, time_percent) VALUES ('Snigel', 1001)",
      "INSERT INTO aircraft (name, price_percent) VALUES ('Guld', 1001)",
    ]) {
      await expect(db.execute(sql), sql).rejects.toThrow(/CHECK/);
    }
  } finally {
    db.close();
  }
});
