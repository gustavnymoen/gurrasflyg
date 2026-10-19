import "server-only";
import Database from "better-sqlite3";
import { connection } from "next/server";
import { db } from "./db";

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

// ---------------------------------------------------------------- Läsa

export async function listClasses(): Promise<CabinClass[]> {
  await connection();
  const rows = db
    .prepare(
      `SELECT c.id, c.name,
         EXISTS (SELECT 1 FROM aircraft_capacity WHERE class_id = c.id)
         OR EXISTS (SELECT 1 FROM flight_prices WHERE class_id = c.id)
         OR EXISTS (SELECT 1 FROM booking_flights WHERE class_id = c.id) AS inUse
       FROM classes c ORDER BY c.id`,
    )
    .all() as (Omit<CabinClass, "inUse"> & { inUse: number })[];
  return rows.map((r) => ({ ...r, inUse: r.inUse === 1 }));
}

export async function listAddons(): Promise<Addon[]> {
  await connection();
  const rows = db
    .prepare(
      `SELECT a.id, a.name, a.description, a.price,
         EXISTS (SELECT 1 FROM aircraft_class_addons WHERE addon_id = a.id)
         OR EXISTS (SELECT 1 FROM booking_flight_addons WHERE addon_id = a.id) AS inUse
       FROM addons a ORDER BY a.name`,
    )
    .all() as (Omit<Addon, "inUse"> & { inUse: number })[];
  return rows.map((r) => ({ ...r, inUse: r.inUse === 1 }));
}

// Alla plan med klasser och addons per klass
export async function listAircraft(): Promise<Aircraft[]> {
  await connection();
  const aircraft = db
    .prepare(
      `SELECT a.id, a.name,
         EXISTS (SELECT 1 FROM flights WHERE aircraft_id = a.id) AS inUse,
         (SELECT COUNT(*) FROM routes WHERE aircraft_id = a.id) AS routeCount
       FROM aircraft a ORDER BY a.name`,
    )
    .all() as { id: number; name: string; inUse: number; routeCount: number }[];
  const classes = db
    .prepare(
      `SELECT ac.aircraft_id AS aircraftId, ac.class_id AS classId, c.name AS className, ac.capacity
       FROM aircraft_capacity ac JOIN classes c ON c.id = ac.class_id
       ORDER BY c.id`,
    )
    .all() as { aircraftId: number; classId: number; className: string; capacity: number }[];
  const addons = db
    .prepare(
      `SELECT aca.aircraft_id AS aircraftId, aca.class_id AS classId, a.id, a.name, a.price
       FROM aircraft_class_addons aca JOIN addons a ON a.id = aca.addon_id
       ORDER BY a.name`,
    )
    .all() as { aircraftId: number; classId: number; id: number; name: string; price: number }[];

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

export function createClass(name: string) {
  const clean = requireText(name, "Klassen måste ha ett namn.");
  translateErrors(() => db.prepare("INSERT INTO classes (name) VALUES (?)").run(clean), {
    unique: `Klassen "${clean}" finns redan.`,
  });
}

export function updateClass(id: number, name: string) {
  const clean = requireText(name, "Klassen måste ha ett namn.");
  const result = translateErrors(
    () => db.prepare("UPDATE classes SET name = ? WHERE id = ?").run(clean, id),
    { unique: `Klassen "${clean}" finns redan.` },
  );
  if (result.changes === 0) throw new AdminError("Klassen finns inte längre.");
}

export function deleteClass(id: number) {
  translateErrors(() => db.prepare("DELETE FROM classes WHERE id = ?").run(id), {
    foreignKey: "Du kan ej ta bort klassen, den används av ett plan eller en flight.",
  });
}

// ---------------------------------------------------------------- Addons

export function createAddon(addon: AddonInput) {
  const { name, description, price } = validateAddon(addon);
  translateErrors(
    () =>
      db
        .prepare("INSERT INTO addons (name, description, price) VALUES (?, ?, ?)")
        .run(name, description, price),
    { unique: `Addon "${name}" finns redan.` },
  );
}

export function updateAddon(id: number, addon: AddonInput) {
  const { name, description, price } = validateAddon(addon);
  const result = translateErrors(
    () =>
      db
        .prepare("UPDATE addons SET name = ?, description = ?, price = ? WHERE id = ?")
        .run(name, description, price, id),
    { unique: `Addon "${name}" finns redan.` },
  );
  if (result.changes === 0) throw new AdminError("Addonen finns inte längre.");
}

export function deleteAddon(id: number) {
  translateErrors(() => db.prepare("DELETE FROM addons WHERE id = ?").run(id), {
    foreignKey: "Du kan ej ta bort addonen, den används av ett plan eller en bokning.",
  });
}

// ---------------------------------------------------------------- Plan

const insertCapacity = db.prepare(`
  INSERT INTO aircraft_capacity (aircraft_id, class_id, capacity) VALUES (?, ?, ?)
  ON CONFLICT (aircraft_id, class_id) DO UPDATE SET capacity = excluded.capacity
`);
const insertClassAddon = db.prepare(
  "INSERT INTO aircraft_class_addons (aircraft_id, class_id, addon_id) VALUES (?, ?, ?)",
);

// Sparar planets klasser och addons. Används både när planet skapas och ändras.
function saveAircraftContents(aircraftId: number | bigint, input: AircraftInput) {
  for (const c of input.classes) {
    translateErrors(() => insertCapacity.run(aircraftId, c.classId, c.capacity), {
      foreignKey: "En vald klass finns inte längre.",
    });
  }
  for (const a of input.addons) {
    translateErrors(() => insertClassAddon.run(aircraftId, a.classId, a.addonId), {
      foreignKey: "En vald addon finns inte längre.",
    });
  }
}

// Transaktioner: antingen sparas hela planet eller ingenting
const createAircraftTx = db.transaction((input: AircraftInput) => {
  const clean = validateAircraft(input);
  const aircraftId = translateErrors(
    () => db.prepare("INSERT INTO aircraft (name) VALUES (?)").run(clean.name).lastInsertRowid,
    { unique: `Det finns redan ett plan som heter "${clean.name}".` },
  );
  saveAircraftContents(aircraftId, clean);
});

const updateAircraftTx = db.transaction((id: number, input: AircraftInput) => {
  const clean = validateAircraft(input);
  const result = translateErrors(
    () => db.prepare("UPDATE aircraft SET name = ? WHERE id = ?").run(clean.name, id),
    { unique: `Det finns redan ett plan som heter "${clean.name}".` },
  );
  if (result.changes === 0) throw new AdminError("Planet finns inte längre.");

  // Klasser som tas bort får inte användas av planets flighter, och
  // kapaciteten får inte bli lägre än antalet redan bokade platser
  const existing = db
    .prepare(
      `SELECT ac.class_id AS classId, c.name FROM aircraft_capacity ac
       JOIN classes c ON c.id = ac.class_id WHERE ac.aircraft_id = ?`,
    )
    .all(id) as { classId: number; name: string }[];
  for (const old of existing) {
    const kept = clean.classes.find((c) => c.classId === old.classId);
    if (!kept) {
      const used = db
        .prepare(
          `SELECT 1 FROM flight_prices fp JOIN flights f ON f.id = fp.flight_id
           WHERE f.aircraft_id = ? AND fp.class_id = ?`,
        )
        .get(id, old.classId);
      if (used) {
        throw new AdminError(`${old.name} används av planets flighter och kan inte tas bort.`);
      }
      continue;
    }
    const { booked } = db
      .prepare(
        `SELECT COALESCE(MAX(n), 0) AS booked FROM (
           SELECT COUNT(*) AS n FROM booking_flights bf JOIN flights f ON f.id = bf.flight_id
           WHERE f.aircraft_id = ? AND bf.class_id = ? GROUP BY bf.flight_id
         )`,
      )
      .get(id, old.classId) as { booked: number };
    if (kept.capacity < booked) {
      throw new AdminError(`${old.name} har redan ${booked} bokade platser på en flight.`);
    }
  }

  // Byt ut addons och klasser mot det som skickats in
  db.prepare("DELETE FROM aircraft_class_addons WHERE aircraft_id = ?").run(id);
  const keepIds = clean.classes.map((c) => c.classId);
  db.prepare(
    `DELETE FROM aircraft_capacity WHERE aircraft_id = ?
     AND class_id NOT IN (SELECT value FROM json_each(?))`,
  ).run(id, JSON.stringify(keepIds));
  saveAircraftContents(id, clean);
});

const deleteAircraftTx = db.transaction((id: number) => {
  if (db.prepare("SELECT 1 FROM flights WHERE aircraft_id = ?").get(id)) {
    throw new AdminError("Du kan ej ta bort planet, det används av flighter.");
  }
  db.prepare("DELETE FROM aircraft_class_addons WHERE aircraft_id = ?").run(id);
  db.prepare("DELETE FROM aircraft_capacity WHERE aircraft_id = ?").run(id);
  db.prepare("DELETE FROM aircraft WHERE id = ?").run(id);
});

export function createAircraft(input: AircraftInput) {
  createAircraftTx.immediate(input);
}

export function updateAircraft(id: number, input: AircraftInput) {
  updateAircraftTx.immediate(id, input);
}

export function deleteAircraft(id: number) {
  deleteAircraftTx.immediate(id);
}

// ---------------------------------------------------------------- Rutter

export async function getRouteStats() {
  await connection();
  return db
    .prepare("SELECT COUNT(*) AS total, COUNT(aircraft_id) AS assigned FROM routes")
    .get() as { total: number; assigned: number };
}

// Ger varje rutt ett slumpat plan. Tidigare tilldelningar skrivs över.
const assignAircraftTx = db.transaction(() => {
  const aircraftIds = db.prepare("SELECT id FROM aircraft").pluck().all() as number[];
  if (aircraftIds.length === 0) {
    throw new AdminError("Det finns inga plan att tilldela. Lägg till ett plan först.");
  }
  const routeIds = db.prepare("SELECT id FROM routes").pluck().all() as number[];
  const update = db.prepare("UPDATE routes SET aircraft_id = ? WHERE id = ?");
  for (const routeId of routeIds) {
    update.run(aircraftIds[Math.floor(Math.random() * aircraftIds.length)], routeId);
  }
});

export function assignAircraftToRoutes() {
  assignAircraftTx.immediate();
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

// Gör om SQLite:s felkoder till meddelanden som går att visa för admin
function translateErrors<T>(fn: () => T, messages: { unique?: string; foreignKey?: string }): T {
  try {
    return fn();
  } catch (e) {
    if (e instanceof Database.SqliteError) {
      const isUnique =
        e.code === "SQLITE_CONSTRAINT_UNIQUE" || e.code === "SQLITE_CONSTRAINT_PRIMARYKEY";
      if (isUnique && messages.unique) throw new AdminError(messages.unique);
      if (e.code === "SQLITE_CONSTRAINT_FOREIGNKEY" && messages.foreignKey) {
        throw new AdminError(messages.foreignKey);
      }
    }
    throw e;
  }
}
