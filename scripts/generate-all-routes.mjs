// Ger varje par av flygplatser en rutt åt båda hållen med minst 5 avgångar om
// dagen, och varje avgång ett pris (TRIP-010-R10, R11). Skriver ut SQL:
//
//   node scripts/generate-all-routes.mjs > db/migrations/007_all_routes.sql
//
// Bygger vidare på rutterna i 002_routes_data.sql (från generate-routes.mjs):
// de behåller flygtid och avgångar och får fler avgångar om de har färre än 5.
// Slumpen har ett fast frö, så samma körning ger alltid samma resultat.

import { airports, distanceKm, flightMinutes, formatTime, generateRoutes, q, seededRandom } from "./generate-routes.mjs";

const SEED = 2010;
const MIN_DEPARTURES = 5;
const MAX_DEPARTURES = 7;
// Avgångar mellan 06:00 och 21:30, var 5:e minut
const FIRST = 6 * 60;
const LAST = 21 * 60 + 30;
// Minsta tid mellan en ny avgång på en befintlig rutt och rutens andra avgångar
const ADDED_GAP = 60;

// Staden varje flygplats ligger i (eller närmast), som visas på flygkorten (TRIP-010-R5)
const CITIES = {
  ARN: "Stockholm", BMA: "Stockholm", GOT: "Göteborg", MMX: "Malmö", LLA: "Luleå", VBY: "Visby",
  UME: "Umeå", OSD: "Östersund", KRN: "Kiruna", OSL: "Oslo", BGO: "Bergen", TRD: "Trondheim",
  CPH: "Köpenhamn", AAL: "Aalborg", HEL: "Helsingfors", KEF: "Reykjavik", TLL: "Tallinn", RIX: "Riga",
  LHR: "London", MAN: "Manchester", EDI: "Edinburgh", DUB: "Dublin", CDG: "Paris", NCE: "Nice",
  AMS: "Amsterdam", BRU: "Bryssel", FRA: "Frankfurt", MUC: "München", BER: "Berlin", ZRH: "Zürich",
  VIE: "Wien", PRG: "Prag", WAW: "Warszawa", BCN: "Barcelona", MAD: "Madrid", AGP: "Málaga",
  PMI: "Palma", LPA: "Las Palmas", LIS: "Lissabon", FCO: "Rom", MXP: "Milano", ATH: "Aten",
  IST: "Istanbul", DXB: "Dubai", BKK: "Bangkok", JFK: "New York", EWR: "Newark", ORD: "Chicago",
  MIA: "Miami", LAX: "Los Angeles", YYZ: "Toronto",
};

// Prisets fördelning: ca 80 % 150–5 000 kr, 10 % 5 000–100 000 kr, 10 % 100 000–1 000 000 kr
const PRICE_BANDS = [
  { share: 0.8, min: 150, max: 5_000 },
  { share: 0.1, min: 5_000, max: 100_000 },
  { share: 0.1, min: 100_000, max: 1_000_000 },
];

const { random, randomInt } = seededRandom(SEED);

// Ett pris i hela kronor, avrundat till tiotal
function price() {
  let r = random();
  const band = PRICE_BANDS.find((b) => (r -= b.share) < 0) ?? PRICE_BANDS.at(-1);
  return Math.round((band.min + random() * (band.max - band.min)) / 10) * 10;
}

const toMinutes = (time) => {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
};

// En ny ruttens avgångar, spridda över dagen: dagen delas i lika delar och
// varje avgång slumpas i mitten av sin del, så att två avgångar aldrig ligger tätt
function spreadTimes(count) {
  const part = (LAST - FIRST) / count;
  return Array.from({ length: count }, (_, i) => {
    const start = FIRST + i * part;
    return formatTime(randomInt(Math.ceil((start + part * 0.2) / 5), Math.floor((start + part * 0.8) / 5)) * 5);
  });
}

// Fler avgångar på en befintlig rutt tills den har `count`, minst `gap` minuter från de andra
function addTimes(existing, count, gap) {
  const minutes = existing.map(toMinutes);
  const added = [];
  for (let tries = 0; minutes.length < count; tries++) {
    if (tries > 10_000) throw new Error("Hittar inga fler avgångstider");
    const m = randomInt(FIRST / 5, LAST / 5) * 5;
    if (minutes.every((t) => Math.abs(t - m) >= gap)) {
      minutes.push(m);
      added.push(m);
    }
  }
  return added.sort((x, y) => x - y).map(formatTime);
}

const existing = generateRoutes();
const byPair = new Map(existing.map((r) => [`${r.from}-${r.to}`, r]));

const lines = [
  "-- GENERERAD av scripts/generate-all-routes.mjs, ändra inte för hand.",
  "-- Rutter mellan alla par av flygplatser, minst 5 avgångar om dagen och ett pris per avgång (TRIP-010).",
  "",
  "-- Rutterna har inget plan längre; resenären väljer plan (TRIP-011)",
  "ALTER TABLE routes DROP COLUMN aircraft_id;",
  "",
  "-- Pris per person i hela kronor, samma varje dag",
  "ALTER TABLE route_departures ADD COLUMN price INTEGER CHECK (price BETWEEN 150 AND 1000000);",
  "",
  "-- Staden flygplatsen ligger i",
  "ALTER TABLE airports ADD COLUMN city TEXT;",
  ...airports.map((a) => {
    if (!CITIES[a[0]]) throw new Error(`Staden saknas för ${a[0]}`);
    return `UPDATE airports SET city = ${q(CITIES[a[0]])} WHERE iata = ${q(a[0])};`;
  }),
  "",
  "-- Befintliga rutter: pris på avgångarna, och fler avgångar upp till 5",
];

const departureValues = (id, times) => times.map((t) => `(${id}, ${q(t)}, ${price()})`).join(", ");

for (const r of existing) {
  const cases = r.times.map((t) => `WHEN ${q(t)} THEN ${price()}`).join(" ");
  lines.push(`UPDATE route_departures SET price = CASE departure_time ${cases} END WHERE route_id = ${r.id};`);
  const added = addTimes(r.times, MIN_DEPARTURES, ADDED_GAP);
  if (added.length > 0) {
    lines.push(
      `INSERT INTO route_departures (route_id, departure_time, price) VALUES ${departureValues(r.id, added)};`,
    );
  }
}

lines.push("", "-- Nya rutter: från, till, flygtid (min) och avstånd (km, bara som kommentar)");

let id = existing.length;
for (const a of airports) {
  for (const b of airports) {
    if (a === b || byPair.has(`${a[0]}-${b[0]}`)) continue;
    id++;
    const km = distanceKm(a, b);
    lines.push(
      `INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) ` +
        `SELECT ${id}, f.id, t.id, ${flightMinutes(km)} FROM airports f, airports t ` +
        `WHERE f.iata = ${q(a[0])} AND t.iata = ${q(b[0])}; -- ${Math.round(km)} km`,
    );
    const times = spreadTimes(randomInt(MIN_DEPARTURES, MAX_DEPARTURES));
    lines.push(`INSERT INTO route_departures (route_id, departure_time, price) VALUES ${departureValues(id, times)};`);
  }
}

console.log(lines.join("\n"));
