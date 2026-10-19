// Skapar och uppdaterar SQLite-databasen.
//
//   node scripts/db-setup.mjs          skapar databasen om den saknas och kör nya migreringar
//   node scripts/db-setup.mjs --reset  sparar en kopia i db/backups/, raderar och bygger om
//
// En ny databas byggs från db/schema.sql och db/seed.sql. Därefter körs
// filerna i db/migrations/ i nummerordning. Varje migrering körs bara en
// gång per databas (det noteras i tabellen schema_migrations), så befintlig
// data ligger kvar när nya tabeller eller rader läggs till.

import Database from "better-sqlite3";
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync } from "node:fs";
import path from "node:path";

const dbDir = path.join(import.meta.dirname, "..", "db");
const dbFile = path.join(dbDir, "gurrasflyg.db");
const migrationsDir = path.join(dbDir, "migrations");
const reset = process.argv.includes("--reset");

// Säkerhetskopia, t.ex. db/backups/gurrasflyg-2026-10-19T18-40-00.db.
// Vill du återställa: stoppa servern och kopiera filen till db/gurrasflyg.db.
async function backup(db) {
  const backupDir = path.join(dbDir, "backups");
  mkdirSync(backupDir, { recursive: true });
  const stamp = new Date().toLocaleString("sv-SE").replace(" ", "T").replace(/:/g, "-");
  const backupFile = path.join(backupDir, `gurrasflyg-${stamp}.db`);
  await db.backup(backupFile);
  console.log(`Säkerhetskopia: ${path.relative(process.cwd(), backupFile)}`);
}

const existed = existsSync(dbFile);

if (existed && reset) {
  const old = new Database(dbFile);
  await backup(old);
  old.close();
  // Ta även bort WAL-filerna som SQLite skapar bredvid databasen
  for (const suffix of ["", "-wal", "-shm"]) {
    rmSync(dbFile + suffix, { force: true });
  }
}

const isNew = !existed || reset;
const db = new Database(dbFile);
db.pragma("foreign_keys = ON");
db.pragma("journal_mode = WAL");

if (isNew) {
  db.exec(readFileSync(path.join(dbDir, "schema.sql"), "utf8"));
  db.exec(readFileSync(path.join(dbDir, "seed.sql"), "utf8"));
}

// ---- Migreringar
db.exec(`CREATE TABLE IF NOT EXISTS schema_migrations (
  name       TEXT PRIMARY KEY,
  applied_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
)`);
const applied = new Set(db.prepare("SELECT name FROM schema_migrations").pluck().all());
const pending = readdirSync(migrationsDir)
  .filter((f) => f.endsWith(".sql") && !applied.has(f))
  .sort();

// Kopia av befintlig data innan den ändras
if (pending.length > 0 && !isNew) await backup(db);

for (const file of pending) {
  // Hela migreringen eller inget: går något fel ändras ingenting
  db.transaction(() => {
    db.exec(readFileSync(path.join(migrationsDir, file), "utf8"));
    db.prepare("INSERT INTO schema_migrations (name) VALUES (?)").run(file);
  })();
  console.log(`Migrering körd: ${file}`);
}

if (isNew || pending.length > 0) {
  const count = (table) => db.prepare(`SELECT COUNT(*) FROM ${table}`).pluck().get();
  console.log(
    `Databas ${isNew ? "skapad" : "uppdaterad"}: ${path.relative(process.cwd(), dbFile)} ` +
      `(${count("airports")} flygplatser, ${count("routes")} rutter)`,
  );
}
db.close();
