// Läser kursdatan i data/ och knowledge/ och skriver ut den som SQL.
// Används för att skapa db/migrations/006_charter_data.sql (TRIP-007):
//
//   node scripts/generate-charter-data.mjs > db/migrations/006_charter_data.sql
//
// Kursdatan läses bara, den ändras aldrig. Raderna sorteras på ID, så samma
// kursdata alltid ger samma fil. Tabellerna finns i 005_charter.sql, och
// deras regler stoppar migreringen om datan inte håller ihop.

import { readFileSync } from "node:fs";
import path from "node:path";

const root = path.join(import.meta.dirname, "..");
const readJson = (file) => JSON.parse(readFileSync(path.join(root, file), "utf8"));

// Kursens priser är i euro; på sajten är allt hela kronor (1 EUR = 10 kr)
const SEK_PER_EUR = 10;

// Enkel jämförelse, inte localeCompare: den beror på datorns språk, och då kunde filen bli olika
const byId = (key) => (a, b) => (a[key] < b[key] ? -1 : 1);
const airports = readJson("data/airports.json").sort(byId("iata"));
const destinations = readJson("data/destinations.json").sort(byId("id"));
const timetables = readJson("data/flights.json").sort(byId("id"));

// ---- Resmålens sidor: frontmatter, sedan Overview, Getting there och Visiting
const SECTIONS = ["Overview", "Getting there", "Visiting"];

function readPage(destination) {
  const text = readFileSync(path.join(root, destination.path), "utf8");
  const [, frontmatter, body] = text.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/) ?? [];
  if (!frontmatter) throw new Error(`${destination.path}: frontmatter saknas`);

  // status_source finns bara på sidan, inte i destinations.json. Värdet är en JSON-sträng eller null.
  const source = frontmatter.match(/^status_source: (.*)$/m);
  if (!source) throw new Error(`${destination.path}: status_source saknas`);

  // Texten under varje ## -rubrik, utan rubriken
  const parts = body.split(/^## (.+)$/m);
  const headings = parts.filter((_, i) => i % 2 === 1);
  if (headings.join("|") !== SECTIONS.join("|")) {
    throw new Error(`${destination.path}: rubrikerna ska vara ${SECTIONS.join(", ")}`);
  }
  const [overview, gettingThere, visiting] = parts.filter((_, i) => i > 0 && i % 2 === 0).map((s) => s.trim());
  return { statusSource: JSON.parse(source[1]), overview, gettingThere, visiting };
}

function priceInKronor(timetable) {
  if (!Number.isInteger(timetable.price_eur)) throw new Error(`${timetable.id}: priset är inte hela euro`);
  return timetable.price_eur * SEK_PER_EUR;
}

// ---- SQL
const sql = (value) => {
  if (value === undefined) throw new Error("Ett värde saknas i kursdatan");
  if (value === null) return "NULL";
  if (typeof value === "number") return String(value);
  return `'${value.replace(/'/g, "''")}'`;
};

// En INSERT med en rad per värde; ingen sats om listan är tom
function insert(table, columns, rows) {
  if (rows.length === 0) return [];
  return [
    `INSERT INTO ${table} (${columns.join(", ")}) VALUES`,
    rows.map((row) => `  (${row.map(sql).join(", ")})`).join(",\n") + ";",
    "",
  ];
}

// Listan som rader (id, position, värde), position 1, 2 …
const positioned = (items, id, list) => items.flatMap((item) => list(item).map((value, i) => [item[id], i + 1, value]));

const pages = new Map(destinations.map((d) => [d.id, readPage(d)]));
const photos = destinations.filter((d) => d.image !== null);

const lines = [
  "-- GENERERAD av scripts/generate-charter-data.mjs, ändra inte för hand.",
  `-- ${airports.length} flygplatser, ${destinations.length} resmål, ${photos.length} foton, ` +
    `${timetables.length} tidtabeller. Priser i hela kronor (1 EUR = ${SEK_PER_EUR} kr).`,
  "",
  ...insert(
    "charter_airports",
    ["iata", "name", "city", "country", "country_name", "latitude", "longitude", "timezone"],
    airports.map((a) => [a.iata, a.name, a.city, a.country, a.country_name, a.latitude, a.longitude, a.timezone]),
  ),
  ...insert(
    "destinations",
    [
      "id", "title", "description", "continent", "country", "country_name", "region", "locality", "category",
      "access", "nearest_airport", "nearest_distance_km", "gateway_airport", "status_checked", "status_source", "path",
    ],
    destinations.map((d) => [
      d.id, d.title, d.description, d.continent, d.country, d.country_name, d.region, d.locality, d.category,
      d.access, d.nearest_airport.iata, d.nearest_airport.distance_km, d.gateway_airport?.iata ?? null,
      d.status_checked, pages.get(d.id).statusSource, d.path,
    ]),
  ),
  ...insert("destination_aliases", ["destination_id", "position", "alias"], positioned(destinations, "id", (d) => d.aliases)),
  ...insert("destination_tags", ["destination_id", "position", "tag"], positioned(destinations, "id", (d) => d.tags)),
  ...insert(
    "destination_transport",
    ["destination_id", "position", "transport"],
    positioned(destinations, "id", (d) => d.transport),
  ),
  ...insert(
    "destination_pages",
    ["destination_id", "overview", "getting_there", "visiting"],
    destinations.map((d) => {
      const page = pages.get(d.id);
      return [d.id, page.overview, page.gettingThere, page.visiting];
    }),
  ),
  ...insert(
    "destination_photos",
    ["destination_id", "src", "author", "license", "license_url", "source"],
    photos.map((d) => [d.id, d.image.src, d.image.author, d.image.license, d.image.license_url, d.image.source]),
  ),
  ...insert(
    "charter_timetables",
    [
      "id", "airline", "from_airport", "to_airport", "valid_from", "valid_to",
      "departs", "arrives", "arrival_day", "duration_minutes", "price",
    ],
    timetables.map((t) => [
      t.id, t.airline, t.from, t.to, t.valid_from, t.valid_to,
      t.departs, t.arrives, t.arrival_day, t.duration_min, priceInKronor(t),
    ]),
  ),
  ...insert(
    "charter_timetable_days",
    ["timetable_id", "weekday"],
    timetables.flatMap((t) => t.days.map((day) => [t.id, day])),
  ),
  ...insert("charter_timetable_flights", ["timetable_id", "position", "flight_number"], positioned(timetables, "id", (t) => t.flights)),
  ...insert("charter_timetable_stops", ["timetable_id", "position", "airport"], positioned(timetables, "id", (t) => t.via)),
];

console.log(lines.join("\n").trimEnd());
