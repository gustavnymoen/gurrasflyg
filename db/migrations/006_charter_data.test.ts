import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { expect, test } from "vitest";
import destinations from "../../data/destinations.json";
import { openUnitDb, queryUnitDb } from "../test-db";

// The charter data the migration imports, read from the unit tests' own
// database (built by vitest.global-setup.mjs).

const byId = (a: { id: string }, b: { id: string }) => (a.id < b.id ? -1 : 1);

test("TRIP-007-R1 the charter airports are imported, apart from the airline's", async () => {
  const airports = await queryUnitDb<Record<string, unknown>>("SELECT * FROM charter_airports");
  expect(airports).toHaveLength(136);
  expect(airports.find((a) => a.iata === "WDH")).toMatchObject({
    name: "Hosea Kutako International Airport",
    city: "Windhoek",
    country: "NA",
    country_name: "Namibia",
    timezone: "Africa/Windhoek",
  });

  // The airline's own airports: still the 51 from TRIP-005, none of the charter-only ones
  const own = await queryUnitDb<{ iata: string }>("SELECT iata FROM airports");
  expect(own).toHaveLength(51);
  expect(own.map((a) => a.iata)).not.toContain("WDH");
});

test("TRIP-007-R2 the destinations have the values of the course data", async () => {
  const rows = await queryUnitDb<Record<string, unknown>>("SELECT * FROM destinations ORDER BY id");
  expect(rows).toHaveLength(96);
  const course = [...destinations].sort(byId);
  for (const [i, d] of course.entries()) {
    expect(rows[i]).toMatchObject({
      id: d.id,
      title: d.title,
      description: d.description,
      continent: d.continent,
      country: d.country,
      country_name: d.country_name,
      region: d.region,
      locality: d.locality,
      category: d.category,
      access: d.access,
      nearest_airport: d.nearest_airport.iata,
      nearest_distance_km: d.nearest_airport.distance_km,
      gateway_airport: d.gateway_airport?.iata ?? null,
      status_checked: d.status_checked,
      path: d.path,
    });
  }

  const list = async (table: string, column: string, id: string) =>
    (
      await queryUnitDb<{ value: string }>(
        `SELECT ${column} AS value FROM ${table} WHERE destination_id = ? ORDER BY position`,
        [id],
      )
    ).map((r) => r.value);
  expect(await list("destination_aliases", "alias", "teufelsberg")).toEqual(["Field Station Berlin"]);
  expect(await list("destination_tags", "tag", "teufelsberg")).toEqual(["cold-war", "berlin", "street-art", "viewpoint"]);
  expect(rows.find((d) => d.id === "teufelsberg")).toMatchObject({
    nearest_airport: "BER",
    nearest_distance_km: 35,
    gateway_airport: null,
  });
  expect(rows.find((d) => d.id === "denniston")).toMatchObject({ nearest_airport: "WSZ", gateway_airport: "CHC" });

  // The source of the access status is only on the pages, not in destinations.json
  expect(rows.find((d) => d.id === "spreepark")).toMatchObject({
    status_checked: "2026-10-13",
    status_source: "https://www.the-berliner.com/english-news-berlin/spreepark-set-to-reopen-in-spring-2027/",
  });
  expect(rows.find((d) => d.id === "teufelsberg")).toMatchObject({ status_checked: null, status_source: null });
  expect(rows.filter((d) => d.status_source !== null)).toHaveLength(24);
});

test("TRIP-007-R3 each destination has its page text, without headings", async () => {
  const pages = await queryUnitDb<{ destination_id: string; overview: string; getting_there: string; visiting: string }>(
    "SELECT * FROM destination_pages",
  );
  expect(pages).toHaveLength(96);
  for (const page of pages) {
    for (const text of [page.overview, page.getting_there, page.visiting]) {
      expect(text.length).toBeGreaterThan(0);
      expect(text).not.toMatch(/^#|^---$/m);
    }
  }

  const teufelsberg = pages.find((p) => p.destination_id === "teufelsberg");
  expect(teufelsberg?.overview).toMatch(/^Teufelsberg is an artificial hill in Berlin's Grunewald forest/);
  expect(teufelsberg?.getting_there).toContain("- **Train and walk:**");
  expect(teufelsberg?.getting_there).toContain("- **Car or taxi:**");
});

test("TRIP-007-R4 95 photos with their credits, the files stay in public/images", async () => {
  const photos = await queryUnitDb<Record<string, string | null>>("SELECT * FROM destination_photos");
  expect(photos).toHaveLength(95);
  for (const photo of photos) {
    expect(photo.author).toBeTruthy();
    expect(photo.license).toBeTruthy();
    expect(photo.source).toBeTruthy();
    expect(existsSync(`public${photo.src}`)).toBe(true);
  }
  expect(photos.find((p) => p.destination_id === "project-riese-osowka")).toBeUndefined();
  expect(photos.find((p) => p.destination_id === "denniston")).toMatchObject({
    src: "/images/denniston.jpg",
    author: "Mike Dickison",
    license: "CC BY 4.0",
  });
});

test("TRIP-007-R5 the timetables are imported as they are", async () => {
  const [{ count }] = await queryUnitDb<{ count: number }>("SELECT COUNT(*) AS count FROM charter_timetables");
  expect(count).toBe(500);

  const legs = (column: "flight_number" | "airport", table: string, id: string) =>
    queryUnitDb<{ value: string }>(`SELECT ${column} AS value FROM ${table} WHERE timetable_id = ? ORDER BY position`, [
      id,
    ]).then((rows) => rows.map((r) => r.value));
  const flights = (id: string) => legs("flight_number", "charter_timetable_flights", id);
  const stops = (id: string) => legs("airport", "charter_timetable_stops", id);
  const WEEK = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const days = (id: string) =>
    queryUnitDb<{ weekday: string }>("SELECT weekday FROM charter_timetable_days WHERE timetable_id = ?", [id]).then(
      (rows) => rows.map((r) => r.weekday).sort((a, b) => WEEK.indexOf(a) - WEEK.indexOf(b)),
    );

  const [ew488] = await queryUnitDb("SELECT * FROM charter_timetables WHERE id = 'ARN-BER-EW488'");
  expect(ew488).toMatchObject({
    airline: "Eurowings",
    from_airport: "ARN",
    to_airport: "BER",
    valid_from: "2026-11-01",
    valid_to: "2027-04-30",
    departs: "07:00",
    arrives: "08:40",
    arrival_day: 0,
    duration_minutes: 100,
  });
  expect(await flights("ARN-BER-EW488")).toEqual(["EW488"]);
  expect(await stops("ARN-BER-EW488")).toEqual([]);
  expect(await days("ARN-BER-EW488")).toEqual(["Mon", "Tue", "Wed", "Thu", "Fri"]);

  expect(await flights("ARN-WDH-LH1570")).toEqual(["LH1570", "4Y653"]);
  expect(await stops("ARN-WDH-LH1570")).toEqual(["FRA"]);
  expect(await days("ARN-WDH-LH1570")).toEqual(["Mon", "Wed", "Fri", "Sun"]);

  // The example in wiki/system/data-flights.md: ARN to BER on Monday 2027-01-11, by departure time
  const monday = await queryUnitDb<{ id: string }>(
    `SELECT t.id FROM charter_timetables t JOIN charter_timetable_days d ON d.timetable_id = t.id
     WHERE t.from_airport = 'ARN' AND t.to_airport = 'BER' AND d.weekday = 'Mon'
       AND :date BETWEEN t.valid_from AND t.valid_to
     ORDER BY t.departs`,
    { date: "2027-01-11" },
  );
  expect(monday.map((t) => t.id)).toEqual(["ARN-BER-SK1122", "ARN-BER-EW488", "ARN-BER-SK2291", "ARN-BER-DY6077"]);
});

test("TRIP-007-R6 prices are whole kronor, euros times 10", async () => {
  const price = async (id: string) =>
    (await queryUnitDb<{ price: number }>("SELECT price FROM charter_timetables WHERE id = ?", [id]))[0].price;
  expect(await price("ARN-BER-EW488")).toBe(1290);
  expect(await price("ARN-WDH-LH1570")).toBe(6290);

  const [range] = await queryUnitDb<{ low: number; high: number }>(
    "SELECT MIN(price) AS low, MAX(price) AS high FROM charter_timetables",
  );
  expect(range).toEqual({ low: 390, high: 11790 });

  const columns = await queryUnitDb<{ name: string }>("SELECT name FROM pragma_table_info('charter_timetables')");
  expect(columns.map((c) => c.name)).not.toContain("price_eur");
});

test("TRIP-007-R7 the tables reject data that doesn't hold together", async () => {
  // Its own connection with foreign keys on, as the site has. Everything is rolled back.
  const db = openUnitDb();
  await db.execute("PRAGMA foreign_keys = ON");
  const tx = await db.transaction("write");
  const insertTimetable = (id: string, to: string, validFrom = "2027-01-01", validTo = "2027-01-31", price = 100) =>
    tx.execute({
      sql: `INSERT INTO charter_timetables
              (id, airline, from_airport, to_airport, valid_from, valid_to, departs, arrives, arrival_day, duration_minutes, price)
            VALUES (?, 'E2E', 'ARN', ?, ?, ?, '07:00', '08:40', 0, 100, ?)`,
      args: [id, to, validFrom, validTo, price],
    });
  try {
    await expect(insertTimetable("E2E-1", "XXX")).rejects.toThrow(/FOREIGN KEY/);
    await expect(insertTimetable("E2E-2", "ARN")).rejects.toThrow(/CHECK/);
    await expect(insertTimetable("E2E-3", "BER", "2027-02-01", "2027-01-01")).rejects.toThrow(/CHECK/);
    await expect(insertTimetable("E2E-4", "BER", undefined, undefined, -1)).rejects.toThrow(/CHECK/);

    const addDay = (weekday: string) =>
      tx.execute({ sql: "INSERT INTO charter_timetable_days (timetable_id, weekday) VALUES ('ARN-BER-EW488', ?)", args: [weekday] });
    await expect(addDay("Mon")).rejects.toThrow(/UNIQUE/);
    await expect(addDay("Xyz")).rejects.toThrow(/CHECK/);

    await expect(
      tx.execute("INSERT INTO destinations (id, title) VALUES ('e2e-place', 'E2E')"),
    ).rejects.toThrow(/NOT NULL/);
  } finally {
    await tx.rollback();
    db.close();
  }
});

test("TRIP-007-R8 generating the charter data again gives the same migration", () => {
  const output = execFileSync("node", ["scripts/generate-charter-data.mjs"], { encoding: "utf8" });
  expect(output).toBe(readFileSync("db/migrations/006_charter_data.sql", "utf8"));
});

test("TRIP-007-R8 the course files are unchanged", () => {
  const changes = execFileSync("git", ["status", "--porcelain", "--", "data", "knowledge", "public/images"], {
    encoding: "utf8",
  });
  expect(changes).toBe("");
});
