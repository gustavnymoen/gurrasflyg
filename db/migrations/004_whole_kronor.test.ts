import { readFileSync } from "node:fs";
import { createClient } from "@libsql/client";
import { expect, test } from "vitest";

// Runs the migration on a database in memory, so it never touches a real one.

const readSql = (file: string) => readFileSync(`db/${file}`, "utf8");

test("TECH-005-R2 the migration converts öre to the nearest whole krona", async () => {
  const db = createClient({ url: ":memory:" });
  try {
    await db.executeMultiple(readSql("schema.sql"));
    await db.execute(`INSERT INTO addons (name, description, price) VALUES
      ('Bagage', '', 24900), ('Halv', '', 1250), ('Under halv', '', 1249), ('Gratis', '', 0)`);
    await db.executeMultiple(readSql("migrations/004_whole_kronor.sql"));

    const rows = await db.execute("SELECT name, price FROM addons ORDER BY id");
    expect(rows.rows.map((r) => [r.name, r.price])).toEqual([
      ["Bagage", 249],
      ["Halv", 13],
      ["Under halv", 12],
      ["Gratis", 0],
    ]);
  } finally {
    db.close();
  }
});
