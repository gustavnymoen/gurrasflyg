// Kopierar klasser, addons, plan (med klasser och addons) och omdömen från
// den lokala databasen till produktion (Turso). Tänkt för projektets början,
// för att fylla produktion med bra data.
//
//   npm run copy-to-prod           visar vad som skulle kopieras (ändrar inget)
//   npm run copy-to-prod -- --go   kopierar på riktigt
//
// Regler:
// - Det som redan finns i produktion (samma namn, oavsett stora/små
//   bokstäver) kopieras inte igen. Omdömen jämförs på namn, rubrik och text.
// - Inget i produktion tas bort eller ändras, det läggs bara till.
// - Plan som redan finns i produktion får de klasser och addons som saknas.
//   Skiljer sig antalet platser behålls produktionens värde (skrivs ut).
// - Allt sker i en transaktion: går något fel ändras ingenting.
//
// Turso-uppgifterna läses från .env.turso.

import { createClient } from "@libsql/client";
import path from "node:path";

const go = process.argv.includes("--go");
const url = process.env.TURSO_DATABASE_URL;
if (!url || url.startsWith("file:")) {
  console.error("TURSO_DATABASE_URL saknas. Lägg Turso-uppgifterna i .env.turso.");
  process.exit(1);
}

const local = createClient({ url: `file:${path.join(import.meta.dirname, "..", "db", "gurrasflyg.db")}` });
const prod = createClient({ url, authToken: process.env.TURSO_AUTH_TOKEN });

const rows = async (db, sql) => (await db.execute(sql)).rows;
const nameKey = (name) => String(name).toLowerCase();

// ---- Läs det som finns lokalt
const L = {
  classes: await rows(local, "SELECT id, name FROM classes ORDER BY id"),
  addons: await rows(local, "SELECT id, name, description, price FROM addons ORDER BY id"),
  aircraft: await rows(local, "SELECT id, name FROM aircraft ORDER BY id"),
  capacity: await rows(local, "SELECT aircraft_id, class_id, capacity FROM aircraft_capacity"),
  classAddons: await rows(local, "SELECT aircraft_id, class_id, addon_id FROM aircraft_class_addons"),
  reviews: await rows(local, "SELECT rating, title, author, body, created_at FROM reviews ORDER BY id"),
};

const plan = []; // det som läggs till, för utskrift
const notes = []; // skillnader som lämnas orörda

// Allt körs i en skrivtransaktion. Utan --go rullas den tillbaka på slutet,
// så provkörningen visar exakt vad som skulle hända.
const tx = await prod.transaction("write");
try {
  const prodRows = async (sql, args = []) => (await tx.execute({ sql, args })).rows;
  const insert = async (sql, args) => Number((await tx.execute({ sql, args })).lastInsertRowid);

  // ---- Klasser: lokalt id -> id i produktion
  const classId = new Map();
  const prodClasses = new Map((await prodRows("SELECT id, name FROM classes")).map((r) => [nameKey(r.name), r.id]));
  for (const c of L.classes) {
    let id = prodClasses.get(nameKey(c.name));
    if (id === undefined) {
      id = await insert("INSERT INTO classes (name) VALUES (?)", [c.name]);
      plan.push(`Ny klass: ${c.name}`);
    }
    classId.set(c.id, id);
  }

  // ---- Addons
  const addonId = new Map();
  const prodAddons = new Map((await prodRows("SELECT id, name FROM addons")).map((r) => [nameKey(r.name), r.id]));
  for (const a of L.addons) {
    let id = prodAddons.get(nameKey(a.name));
    if (id === undefined) {
      id = await insert("INSERT INTO addons (name, description, price) VALUES (?, ?, ?)", [
        a.name,
        a.description,
        a.price,
      ]);
      plan.push(`Ny addon: ${a.name}`);
    }
    addonId.set(a.id, id);
  }

  // ---- Plan med klasser och addons
  const prodAircraft = new Map((await prodRows("SELECT id, name FROM aircraft")).map((r) => [nameKey(r.name), r.id]));
  for (const a of L.aircraft) {
    let id = prodAircraft.get(nameKey(a.name));
    const isNew = id === undefined;
    if (isNew) {
      id = await insert("INSERT INTO aircraft (name) VALUES (?)", [a.name]);
      plan.push(`Nytt plan: ${a.name}`);
    }

    const prodCapacity = new Map(
      (await prodRows("SELECT class_id, capacity FROM aircraft_capacity WHERE aircraft_id = ?", [id])).map(
        (r) => [r.class_id, r.capacity],
      ),
    );
    for (const c of L.capacity.filter((c) => c.aircraft_id === a.id)) {
      const pc = classId.get(c.class_id);
      const className = L.classes.find((x) => x.id === c.class_id).name;
      if (!prodCapacity.has(pc)) {
        await tx.execute({
          sql: "INSERT INTO aircraft_capacity (aircraft_id, class_id, capacity) VALUES (?, ?, ?)",
          args: [id, pc, c.capacity],
        });
        if (!isNew) plan.push(`  ${a.name}: ny klass ${className} (${c.capacity} platser)`);
        prodCapacity.set(pc, c.capacity);
      } else if (prodCapacity.get(pc) !== c.capacity) {
        notes.push(
          `${a.name}: ${className} har ${prodCapacity.get(pc)} platser i produktion, ` +
            `${c.capacity} lokalt (produktionens värde behålls)`,
        );
      }
    }

    const prodClassAddons = new Set(
      (await prodRows("SELECT class_id, addon_id FROM aircraft_class_addons WHERE aircraft_id = ?", [id])).map(
        (r) => `${r.class_id}-${r.addon_id}`,
      ),
    );
    for (const x of L.classAddons.filter((x) => x.aircraft_id === a.id)) {
      const pc = classId.get(x.class_id);
      const pa = addonId.get(x.addon_id);
      if (prodClassAddons.has(`${pc}-${pa}`)) continue;
      await tx.execute({
        sql: "INSERT INTO aircraft_class_addons (aircraft_id, class_id, addon_id) VALUES (?, ?, ?)",
        args: [id, pc, pa],
      });
      if (!isNew) {
        const addonName = L.addons.find((y) => y.id === x.addon_id).name;
        const className = L.classes.find((y) => y.id === x.class_id).name;
        plan.push(`  ${a.name}: ny addon ${addonName} i ${className}`);
      }
    }
    if (isNew) {
      const classes = L.capacity.filter((c) => c.aircraft_id === a.id).length;
      const addons = L.classAddons.filter((x) => x.aircraft_id === a.id).length;
      plan.push(`  med ${classes} klasser och ${addons} addons`);
    }
  }

  // ---- Omdömen
  const reviewKey = (r) => `${r.author}\n${r.title}\n${r.body}`;
  const prodReviews = new Set(
    (await prodRows("SELECT author, title, body FROM reviews")).map(reviewKey),
  );
  for (const r of L.reviews) {
    if (prodReviews.has(reviewKey(r))) continue;
    await tx.execute({
      sql: "INSERT INTO reviews (rating, title, author, body, created_at) VALUES (?, ?, ?, ?, ?)",
      args: [r.rating, r.title, r.author, r.body, r.created_at],
    });
    plan.push(`Nytt omdöme: ${r.rating}★ ${r.author}: ${r.title}`);
  }

  if (go) await tx.commit();
  else await tx.rollback();
} catch (e) {
  await tx.rollback();
  throw e;
} finally {
  tx.close();
}

console.log(plan.length === 0 ? "Allt finns redan i produktion." : plan.join("\n"));
if (notes.length > 0) console.log("\nObs:\n" + notes.map((n) => `  ${n}`).join("\n"));
if (plan.length > 0) {
  console.log(go ? "\nKlart, kopierat till produktion." : "\nProvkörning, inget ändrat. Kör med --go för att kopiera.");
}
