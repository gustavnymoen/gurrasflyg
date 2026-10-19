import "server-only";
import type { Transaction } from "@libsql/client";
import { connection } from "next/server";
import { all, constraintKind, get, run, withTransaction } from "./db";

// inUse = något annat i databasen pekar på raden, så den kan inte tas bort
export type CabinClass = { id: number; name: string; inUse: boolean };
export type Addon = { id: number; name: string; description: string; price: number; inUse: boolean };
export type Aircraft = {
  id: number;
  name: string;
  inUse: boolean;
  routeCount: number; // antal rutter som flygs med planet
  classes: {
    classId: number;
    className: string;
    capacity: number;
    addons: { id: number; name: string; price: number }[];
  }[];
};

// Det som skickas från formuläret när ett plan skapas eller ändras
export type AircraftInput = {
  name: string;
  classes: { classId: number; capacity: number }[];
  addons: { addonId: number; classId: number }[];
};

export type AddonInput = { name: string; description: string; priceKr: number };

// Fel som beror på vad admin matat in och som kan visas på sidan
export class AdminError extends Error {}

// SQL som avgör om en klass/addon används. Kontrolleras uttryckligen innan
// borttagning, så att spärren fungerar även om databasen inte själv
// kontrollerar REFERENCES.
const CLASS_IN_USE = `
  EXISTS (SELECT 1 FROM aircraft_capacity WHERE class_id = c.id)
  OR EXISTS (SELECT 1 FROM flight_prices WHERE class_id = c.id)
  OR EXISTS (SELECT 1 FROM booking_flights WHERE class_id = c.id)`;
const ADDON_IN_USE = `
  EXISTS (SELECT 1 FROM aircraft_class_addons WHERE addon_id = a.id)
  OR EXISTS (SELECT 1 FROM booking_flight_addons WHERE addon_id = a.id)`;

// ---------------------------------------------------------------- Läsa

export async function listClasses(): Promise<CabinClass[]> {
  await connection();
  const rows = await all<Omit<CabinClass, "inUse"> & { inUse: number }>(
    `SELECT c.id, c.name, ${CLASS_IN_USE} AS inUse FROM classes c ORDER BY c.id`,
  );
  return rows.map((r) => ({ ...r, inUse: r.inUse === 1 }));
}

export async function listAddons(): Promise<Addon[]> {
  await connection();
  const rows = await all<Omit<Addon, "inUse"> & { inUse: number }>(
    `SELECT a.id, a.name, a.description, a.price, ${ADDON_IN_USE} AS inUse
     FROM addons a ORDER BY a.name`,
  );
  return rows.map((r) => ({ ...r, inUse: r.inUse === 1 }));
}

// Alla plan med klasser och addons per klass
export async function listAircraft(): Promise<Aircraft[]> {
  await connection();
  const [aircraft, classes, addons] = await Promise.all([
    all<{ id: number; name: string; inUse: number; routeCount: number }>(
      `SELECT a.id, a.name,
         EXISTS (SELECT 1 FROM flights WHERE aircraft_id = a.id) AS inUse,
         (SELECT COUNT(*) FROM routes WHERE aircraft_id = a.id) AS routeCount
       FROM aircraft a ORDER BY a.name`,
    ),
    all<{ aircraftId: number; classId: number; className: string; capacity: number }>(
      `SELECT ac.aircraft_id AS aircraftId, ac.class_id AS classId, c.name AS className, ac.capacity
       FROM aircraft_capacity ac JOIN classes c ON c.id = ac.class_id
       ORDER BY c.id`,
    ),
    all<{ aircraftId: number; classId: number; id: number; name: string; price: number }>(
      `SELECT aca.aircraft_id AS aircraftId, aca.class_id AS classId, a.id, a.name, a.price
       FROM aircraft_class_addons aca JOIN addons a ON a.id = aca.addon_id
       ORDER BY a.name`,
    ),
  ]);

  return aircraft.map((a) => ({
    id: a.id,
    name: a.name,
    inUse: a.inUse === 1,
    routeCount: a.routeCount,
    classes: classes
      .filter((c) => c.aircraftId === a.id)
      .map(({ classId, className, capacity }) => ({
        classId,
        className,
        capacity,
        addons: addons
          .filter((x) => x.aircraftId === a.id && x.classId === classId)
          .map(({ id, name, price }) => ({ id, name, price })),
      })),
  }));
}

// ---------------------------------------------------------------- Klasser

export async function createClass(name: string) {
  const clean = requireText(name, "Klassen måste ha ett namn.");
  await translateErrors(run("INSERT INTO classes (name) VALUES (?)", [clean]), {
    unique: `Klassen "${clean}" finns redan.`,
  });
}

export async function updateClass(id: number, name: string) {
  const clean = requireText(name, "Klassen måste ha ett namn.");
  const result = await translateErrors(
    run("UPDATE classes SET name = ? WHERE id = ?", [clean, id]),
    { unique: `Klassen "${clean}" finns redan.` },
  );
  if (result.changes === 0) throw new AdminError("Klassen finns inte längre.");
}

export async function deleteClass(id: number) {
  await withTransaction(async (tx) => {
    const row = await get<{ inUse: number }>(
      `SELECT ${CLASS_IN_USE} AS inUse FROM classes c WHERE c.id = ?`,
      [id],
      tx,
    );
    if (row?.inUse === 1) {
      throw new AdminError("Du kan ej ta bort klassen, den används av ett plan eller en flight.");
    }
    await run("DELETE FROM classes WHERE id = ?", [id], tx);
  });
}

// ---------------------------------------------------------------- Addons

export async function createAddon(addon: AddonInput) {
  const { name, description, price } = validateAddon(addon);
  await translateErrors(
    run("INSERT INTO addons (name, description, price) VALUES (?, ?, ?)", [name, description, price]),
    { unique: `Addon "${name}" finns redan.` },
  );
}

export async function updateAddon(id: number, addon: AddonInput) {
  const { name, description, price } = validateAddon(addon);
  const result = await translateErrors(
    run("UPDATE addons SET name = ?, description = ?, price = ? WHERE id = ?", [
      name,
      description,
      price,
      id,
    ]),
    { unique: `Addon "${name}" finns redan.` },
  );
  if (result.changes === 0) throw new AdminError("Addonen finns inte längre.");
}

export async function deleteAddon(id: number) {
  await withTransaction(async (tx) => {
    const row = await get<{ inUse: number }>(
      `SELECT ${ADDON_IN_USE} AS inUse FROM addons a WHERE a.id = ?`,
      [id],
      tx,
    );
    if (row?.inUse === 1) {
      throw new AdminError("Du kan ej ta bort addonen, den används av ett plan eller en bokning.");
    }
    await run("DELETE FROM addons WHERE id = ?", [id], tx);
  });
}

// ---------------------------------------------------------------- Plan

// Sparar planets klasser och addons. Används både när planet skapas och ändras.
async function saveAircraftContents(tx: Transaction, aircraftId: number, input: AircraftInput) {
  // Kontrollera att valda klasser och addons finns (i stället för att lita på REFERENCES)
  const classIds = new Set(
    (await all<{ id: number }>("SELECT id FROM classes", [], tx)).map((r) => r.id),
  );
  const addonIds = new Set(
    (await all<{ id: number }>("SELECT id FROM addons", [], tx)).map((r) => r.id),
  );
  if (input.classes.some((c) => !classIds.has(c.classId))) {
    throw new AdminError("En vald klass finns inte längre.");
  }
  if (input.addons.some((a) => !addonIds.has(a.addonId))) {
    throw new AdminError("En vald addon finns inte längre.");
  }

  for (const c of input.classes) {
    await run(
      `INSERT INTO aircraft_capacity (aircraft_id, class_id, capacity) VALUES (?, ?, ?)
       ON CONFLICT (aircraft_id, class_id) DO UPDATE SET capacity = excluded.capacity`,
      [aircraftId, c.classId, c.capacity],
      tx,
    );
  }
  for (const a of input.addons) {
    await run(
      "INSERT INTO aircraft_class_addons (aircraft_id, class_id, addon_id) VALUES (?, ?, ?)",
      [aircraftId, a.classId, a.addonId],
      tx,
    );
  }
}

// Antingen sparas hela planet eller ingenting
export async function createAircraft(input: AircraftInput) {
  const clean = validateAircraft(input);
  await withTransaction(async (tx) => {
    const { lastId } = await translateErrors(
      run("INSERT INTO aircraft (name) VALUES (?)", [clean.name], tx),
      { unique: `Det finns redan ett plan som heter "${clean.name}".` },
    );
    await saveAircraftContents(tx, lastId, clean);
  });
}

export async function updateAircraft(id: number, input: AircraftInput) {
  const clean = validateAircraft(input);
  await withTransaction(async (tx) => {
    const result = await translateErrors(
      run("UPDATE aircraft SET name = ? WHERE id = ?", [clean.name, id], tx),
      { unique: `Det finns redan ett plan som heter "${clean.name}".` },
    );
    if (result.changes === 0) throw new AdminError("Planet finns inte längre.");

    // Klasser som tas bort får inte användas av planets flighter, och
    // kapaciteten får inte bli lägre än antalet redan bokade platser
    const existing = await all<{ classId: number; name: string }>(
      `SELECT ac.class_id AS classId, c.name FROM aircraft_capacity ac
       JOIN classes c ON c.id = ac.class_id WHERE ac.aircraft_id = ?`,
      [id],
      tx,
    );
    for (const old of existing) {
      const kept = clean.classes.find((c) => c.classId === old.classId);
      if (!kept) {
        const used = await get(
          `SELECT 1 FROM flight_prices fp JOIN flights f ON f.id = fp.flight_id
           WHERE f.aircraft_id = ? AND fp.class_id = ?`,
          [id, old.classId],
          tx,
        );
        if (used) {
          throw new AdminError(`${old.name} används av planets flighter och kan inte tas bort.`);
        }
        continue;
      }
      const row = await get<{ booked: number }>(
        `SELECT COALESCE(MAX(n), 0) AS booked FROM (
           SELECT COUNT(*) AS n FROM booking_flights bf JOIN flights f ON f.id = bf.flight_id
           WHERE f.aircraft_id = ? AND bf.class_id = ? GROUP BY bf.flight_id
         )`,
        [id, old.classId],
        tx,
      );
      const booked = row?.booked ?? 0;
      if (kept.capacity < booked) {
        throw new AdminError(`${old.name} har redan ${booked} bokade platser på en flight.`);
      }
    }

    // Byt ut addons och klasser mot det som skickats in
    await run("DELETE FROM aircraft_class_addons WHERE aircraft_id = ?", [id], tx);
    await run(
      `DELETE FROM aircraft_capacity WHERE aircraft_id = ?
       AND class_id NOT IN (SELECT value FROM json_each(?))`,
      [id, JSON.stringify(clean.classes.map((c) => c.classId))],
      tx,
    );
    await saveAircraftContents(tx, id, clean);
  });
}

export async function deleteAircraft(id: number) {
  await withTransaction(async (tx) => {
    if (await get("SELECT 1 FROM flights WHERE aircraft_id = ?", [id], tx)) {
      throw new AdminError("Du kan ej ta bort planet, det används av flighter.");
    }
    // Rutterna blir utan plan (gör vi själva i stället för att lita på ON DELETE SET NULL)
    await run("UPDATE routes SET aircraft_id = NULL WHERE aircraft_id = ?", [id], tx);
    await run("DELETE FROM aircraft_class_addons WHERE aircraft_id = ?", [id], tx);
    await run("DELETE FROM aircraft_capacity WHERE aircraft_id = ?", [id], tx);
    await run("DELETE FROM aircraft WHERE id = ?", [id], tx);
  });
}

// ---------------------------------------------------------------- Rutter

export async function getRouteStats() {
  await connection();
  const row = await get<{ total: number; assigned: number }>(
    "SELECT COUNT(*) AS total, COUNT(aircraft_id) AS assigned FROM routes",
  );
  return row ?? { total: 0, assigned: 0 };
}

// Ger varje rutt ett slumpat plan. Tidigare tilldelningar skrivs över.
export async function assignAircraftToRoutes() {
  await withTransaction(async (tx) => {
    const aircraftIds = (await all<{ id: number }>("SELECT id FROM aircraft", [], tx)).map(
      (r) => r.id,
    );
    if (aircraftIds.length === 0) {
      throw new AdminError("Det finns inga plan att tilldela. Lägg till ett plan först.");
    }
    const routeIds = (await all<{ id: number }>("SELECT id FROM routes", [], tx)).map((r) => r.id);
    // Alla uppdateringar i ett anrop (snabbare mot Turso än 200 separata anrop)
    await tx.batch(
      routeIds.map((routeId) => ({
        sql: "UPDATE routes SET aircraft_id = ? WHERE id = ?",
        args: [aircraftIds[Math.floor(Math.random() * aircraftIds.length)], routeId],
      })),
    );
  });
}

// ---------------------------------------------------------------- Kontroller

function validateAircraft(input: AircraftInput): AircraftInput {
  const name = requireText(input.name, "Planet måste ha ett namn.");
  if (input.classes.length === 0) {
    throw new AdminError("Planet måste ha minst en klass.");
  }
  const classIds = input.classes.map((c) => c.classId);
  if (new Set(classIds).size !== classIds.length) {
    throw new AdminError("Samma klass finns flera gånger på planet.");
  }
  for (const c of input.classes) {
    if (!Number.isInteger(c.capacity) || c.capacity <= 0) {
      throw new AdminError("Antal platser måste vara ett heltal större än 0.");
    }
  }
  for (const a of input.addons) {
    if (!classIds.includes(a.classId)) {
      throw new AdminError("Varje addon måste kopplas till en av planets klasser.");
    }
  }
  const addonKeys = input.addons.map((a) => `${a.addonId}-${a.classId}`);
  if (new Set(addonKeys).size !== addonKeys.length) {
    throw new AdminError("Samma addon finns flera gånger i samma klass.");
  }
  return { ...input, name };
}

function validateAddon(addon: AddonInput) {
  const name = requireText(addon.name, "Addon måste ha ett namn.");
  const description = requireText(addon.description, "Addon måste ha en beskrivning.");
  if (!Number.isFinite(addon.priceKr) || addon.priceKr < 0) {
    throw new AdminError("Priset måste vara 0 kr eller mer.");
  }
  return { name, description, price: Math.round(addon.priceKr * 100) };
}

function requireText(value: string, message: string) {
  const clean = value.trim();
  if (clean === "") throw new AdminError(message);
  return clean;
}

// Gör om databasfel (t.ex. namn som redan finns) till meddelanden för admin
async function translateErrors<T>(
  promise: Promise<T>,
  messages: { unique?: string; foreignKey?: string },
): Promise<T> {
  try {
    return await promise;
  } catch (e) {
    const kind = constraintKind(e);
    if (kind && messages[kind]) throw new AdminError(messages[kind]);
    throw e;
  }
}
