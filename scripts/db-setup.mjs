// Skapar och uppdaterar databasen.
//
//   node scripts/db-setup.mjs          skapar databasen om den saknas och kör nya migreringar
//   node scripts/db-setup.mjs --reset  (bara lokalt) sparar en kopia i db/backups/, raderar och bygger om
//
// Utan miljövariabler används den lokala filen db/gurrasflyg.db. Är
// TURSO_DATABASE_URL och TURSO_AUTH_TOKEN satta används Turso i stället
// (det sker på Vercel vid varje bygge, och med npm run db:turso).
//
// En ny databas byggs från db/schema.sql och db/seed.sql. Därefter körs
// filerna i db/migrations/ i nummerordning. Varje migrering körs bara en
// gång per databas (det noteras i tabellen schema_migrations), så befintlig
// data ligger kvar när nya tabeller eller rader läggs till.

import { createClient } from "@libsql/client";
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync } from "node:fs";
import path from "node:path";

const dbDir = path.join(import.meta.dirname, "..", "db");
const dbFile = path.join(dbDir, "gurrasflyg.db");
const migrationsDir = path.join(dbDir, "migrations");
const reset = process.argv.includes("--reset");

const remoteUrl = process.env.TURSO_DATABASE_URL;
const where = remoteUrl ? `Turso (${remoteUrl})` : path.relative(process.cwd(), dbFile);
const open = () =>
  createClient({ url: remoteUrl ?? `file:${dbFile}`, authToken: process.env.TURSO_AUTH_TOKEN });

// Säkerhetskopia av den lokala filen, t.ex. db/backups/gurrasflyg-2026-10-19T18-40-00.db.
// Vill du återställa: stoppa servern och kopiera filen till db/gurrasflyg.db.
// (Turso har egen historik och kan återställas i deras webbgränssnitt.)
async function backup(db) {
  if (remoteUrl) return;
  const backupDir = path.join(dbDir, "backups");
  mkdirSync(backupDir, { recursive: true });
  const stamp = new Date().toLocaleString("sv-SE").replace(" ", "T").replace(/:/g, "-");
  const backupFile = path.join(backupDir, `gurrasflyg-${stamp}.db`);
  await db.execute({ sql: "VACUUM INTO ?", args: [backupFile] });
  console.log(`Säkerhetskopia: ${path.relative(process.cwd(), backupFile)}`);
}

if (reset) {
  if (remoteUrl) {
    console.error("--reset är avstängt mot Turso, så att riktig data inte raderas av misstag.");
    process.exit(1);
  }
  if (existsSync(dbFile)) {
    const old = open();
    await backup(old);
    old.close();
    // Ta även bort WAL-filerna som SQLite skapar bredvid databasen
    for (const suffix of ["", "-wal", "-shm"]) {
      rmSync(dbFile + suffix, { force: true });
    }
  }
}

const db = open();
if (!remoteUrl) await db.execute("PRAGMA foreign_keys = ON");

// Ny databas = tabellen airports finns inte än
const isNew =
  (await db.execute("SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = 'airports'"))
    .rows.length === 0;

if (isNew) {
  if (!remoteUrl) await db.execute("PRAGMA journal_mode = WAL");
  await db.executeMultiple(readFileSync(path.join(dbDir, "schema.sql"), "utf8"));
  await db.executeMultiple(readFileSync(path.join(dbDir, "seed.sql"), "utf8"));
}

// ---- Migreringar
await db.execute(`CREATE TABLE IF NOT EXISTS schema_migrations (
  name       TEXT PRIMARY KEY,
  applied_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
)`);
const applied = new Set(
  (await db.execute("SELECT name FROM schema_migrations")).rows.map((r) => r.name),
);
const pending = readdirSync(migrationsDir)
  .filter((f) => f.endsWith(".sql") && !applied.has(f))
  .sort();

// Kopia av befintlig data innan den ändras
if (pending.length > 0 && !isNew) await backup(db);

for (const file of pending) {
  // Hela migreringen eller inget: går något fel ändras ingenting
  const tx = await db.transaction("write");
  try {
    await tx.executeMultiple(readFileSync(path.join(migrationsDir, file), "utf8"));
    await tx.execute({ sql: "INSERT INTO schema_migrations (name) VALUES (?)", args: [file] });
    await tx.commit();
  } catch (e) {
    await tx.rollback();
    throw e;
  }
  console.log(`Migrering körd: ${file}`);
}

if (isNew || pending.length > 0) {
  const count = async (table) =>
    (await db.execute(`SELECT COUNT(*) FROM ${table}`)).rows[0][0];
  console.log(
    `Databas ${isNew ? "skapad" : "uppdaterad"}: ${where} ` +
      `(${await count("airports")} flygplatser, ${await count("routes")} rutter)`,
  );
}
db.close();
