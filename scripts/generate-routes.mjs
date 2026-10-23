// Slumpar fram flygplatser och rutter och skriver ut dem som SQL.
// Användes för att skapa db/migrations/002_routes_data.sql:
//
//   node scripts/generate-routes.mjs > db/migrations/002_routes_data.sql
//
// Slumpen har ett fast frö, så samma körning ger alltid samma resultat.
// Ändra SEED (eller antal) för att få andra rutter.
//
// Flygplatserna, avståndet och flygtiden exporteras också, och rutterna med
// generateRoutes(), så att scripts/generate-all-routes.mjs kan bygga vidare på
// samma data (TRIP-010).

const SEED = 42;
const ROUTE_PAIRS = 100; // varje par blir två rutter, en åt varje håll
const MIN_DISTANCE_KM = 150; // kortare än så flyger ingen
const LONG_HAUL_KM = 4000; // långdistans bara till/från stora flygplatser

// [IATA, namn, land, tidszon, latitud, longitud]
export const airports = [
  ["ARN", "Stockholm Arlanda", "Sverige", "Europe/Stockholm", 59.65, 17.92],
  ["BMA", "Stockholm Bromma", "Sverige", "Europe/Stockholm", 59.35, 17.94],
  ["GOT", "Göteborg Landvetter", "Sverige", "Europe/Stockholm", 57.67, 12.29],
  ["MMX", "Malmö Airport", "Sverige", "Europe/Stockholm", 55.54, 13.37],
  ["LLA", "Luleå Airport", "Sverige", "Europe/Stockholm", 65.54, 22.12],
  ["VBY", "Visby Airport", "Sverige", "Europe/Stockholm", 57.66, 18.35],
  ["UME", "Umeå Airport", "Sverige", "Europe/Stockholm", 63.79, 20.28],
  ["OSD", "Åre Östersund Airport", "Sverige", "Europe/Stockholm", 63.19, 14.5],
  ["KRN", "Kiruna Airport", "Sverige", "Europe/Stockholm", 67.82, 20.34],
  ["OSL", "Oslo Gardermoen", "Norge", "Europe/Oslo", 60.19, 11.1],
  ["BGO", "Bergen Flesland", "Norge", "Europe/Oslo", 60.29, 5.22],
  ["TRD", "Trondheim Værnes", "Norge", "Europe/Oslo", 63.46, 10.92],
  ["CPH", "Köpenhamn Kastrup", "Danmark", "Europe/Copenhagen", 55.62, 12.65],
  ["AAL", "Aalborg Airport", "Danmark", "Europe/Copenhagen", 57.09, 9.85],
  ["HEL", "Helsingfors-Vanda", "Finland", "Europe/Helsinki", 60.32, 24.96],
  ["KEF", "Reykjavik Keflavík", "Island", "Atlantic/Reykjavik", 63.98, -22.61],
  ["TLL", "Tallinn Airport", "Estland", "Europe/Tallinn", 59.41, 24.83],
  ["RIX", "Riga International", "Lettland", "Europe/Riga", 56.92, 23.97],
  ["LHR", "London Heathrow", "Storbritannien", "Europe/London", 51.47, -0.45],
  ["MAN", "Manchester Airport", "Storbritannien", "Europe/London", 53.35, -2.28],
  ["EDI", "Edinburgh Airport", "Storbritannien", "Europe/London", 55.95, -3.37],
  ["DUB", "Dublin Airport", "Irland", "Europe/Dublin", 53.43, -6.25],
  ["CDG", "Paris Charles de Gaulle", "Frankrike", "Europe/Paris", 49.01, 2.55],
  ["NCE", "Nice Côte d'Azur", "Frankrike", "Europe/Paris", 43.66, 7.22],
  ["AMS", "Amsterdam Schiphol", "Nederländerna", "Europe/Amsterdam", 52.31, 4.76],
  ["BRU", "Bryssel Zaventem", "Belgien", "Europe/Brussels", 50.9, 4.48],
  ["FRA", "Frankfurt am Main", "Tyskland", "Europe/Berlin", 50.03, 8.57],
  ["MUC", "München Franz Josef Strauss", "Tyskland", "Europe/Berlin", 48.35, 11.79],
  ["BER", "Berlin Brandenburg", "Tyskland", "Europe/Berlin", 52.37, 13.5],
  ["ZRH", "Zürich Airport", "Schweiz", "Europe/Zurich", 47.46, 8.55],
  ["VIE", "Wien Schwechat", "Österrike", "Europe/Vienna", 48.11, 16.57],
  ["PRG", "Prag Václav Havel", "Tjeckien", "Europe/Prague", 50.1, 14.26],
  ["WAW", "Warszawa Chopin", "Polen", "Europe/Warsaw", 52.17, 20.97],
  ["BCN", "Barcelona El Prat", "Spanien", "Europe/Madrid", 41.3, 2.08],
  ["MAD", "Madrid Barajas", "Spanien", "Europe/Madrid", 40.49, -3.57],
  ["AGP", "Málaga Airport", "Spanien", "Europe/Madrid", 36.67, -4.5],
  ["PMI", "Palma de Mallorca", "Spanien", "Europe/Madrid", 39.55, 2.74],
  ["LPA", "Gran Canaria Airport", "Spanien", "Atlantic/Canary", 27.93, -15.39],
  ["LIS", "Lissabon Humberto Delgado", "Portugal", "Europe/Lisbon", 38.77, -9.13],
  ["FCO", "Rom Fiumicino", "Italien", "Europe/Rome", 41.8, 12.25],
  ["MXP", "Milano Malpensa", "Italien", "Europe/Rome", 45.63, 8.72],
  ["ATH", "Aten Eleftherios Venizelos", "Grekland", "Europe/Athens", 37.94, 23.94],
  ["IST", "Istanbul Airport", "Turkiet", "Europe/Istanbul", 41.26, 28.74],
  ["DXB", "Dubai International", "Förenade Arabemiraten", "Asia/Dubai", 25.25, 55.36],
  ["BKK", "Bangkok Suvarnabhumi", "Thailand", "Asia/Bangkok", 13.69, 100.75],
  ["JFK", "New York John F. Kennedy", "USA", "America/New_York", 40.64, -73.78],
  ["EWR", "Newark Liberty", "USA", "America/New_York", 40.69, -74.17],
  ["ORD", "Chicago O'Hare", "USA", "America/Chicago", 41.98, -87.9],
  ["MIA", "Miami International", "USA", "America/New_York", 25.79, -80.29],
  ["LAX", "Los Angeles International", "USA", "America/Los_Angeles", 33.94, -118.41],
  ["YYZ", "Toronto Pearson", "Kanada", "America/Toronto", 43.68, -79.63],
];

// Stora flygplatser som får ha långdistans
const hubs = new Set(["ARN", "CPH", "OSL", "HEL", "LHR", "CDG", "AMS", "FRA", "MUC", "MAD", "IST", "DXB", "JFK"]);

// ---- Slump med fast frö (mulberry32). Ger random() och randomInt(min, max).
export function seededRandom(seed) {
  let state = seed;
  const random = () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const randomInt = (min, max) => min + Math.floor(random() * (max - min + 1));
  return { random, randomInt };
}

// ---- Avstånd och flygtid
export function distanceKm(a, b) {
  const rad = (d) => (d * Math.PI) / 180;
  const [lat1, lon1, lat2, lon2] = [a[4], a[5], b[4], b[5]].map(rad);
  const h =
    Math.sin((lat2 - lat1) / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin((lon2 - lon1) / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.sqrt(h));
}

// Ca 800 km/h plus 30 minuter för taxning, start och landning, avrundat till 5 min
export const flightMinutes = (km) => Math.round((km / 800) * 60 / 5) * 5 + 30;

// Minuter efter midnatt -> "HH:MM"
export const formatTime = (m) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;

// Rutterna i 002_routes_data.sql: { id, from, to, km, minutes, times }, sorterade
// på från och till. Samma frö ger alltid samma rutter.
export function generateRoutes() {
  const { random, randomInt } = seededRandom(SEED);

  // ---- Välj flygplatspar
  const isSwedish = (a) => a[2] === "Sverige";
  const candidates = [];
  for (let i = 0; i < airports.length; i++) {
    for (let j = i + 1; j < airports.length; j++) {
      const [a, b] = [airports[i], airports[j]];
      const km = distanceKm(a, b);
      if (km < MIN_DISTANCE_KM) continue;
      if (km > LONG_HAUL_KM && !hubs.has(a[0]) && !hubs.has(b[0])) continue;
      // Gurras Flyg är svenskt: rutter till/från Sverige och stora flygplatser är vanligare
      const weight = 1 + (isSwedish(a) || isSwedish(b) ? 4 : 0) + (hubs.has(a[0]) || hubs.has(b[0]) ? 2 : 0);
      candidates.push({ a, b, km, weight });
    }
  }

  const chosen = [];
  const pick = (c) => {
    chosen.push(c);
    candidates.splice(candidates.indexOf(c), 1);
  };

  // Först: självklara rutter för ett svenskt flygbolag
  const mustHave = [
    ["ARN", "GOT"], ["ARN", "MMX"], ["ARN", "LLA"], ["ARN", "UME"], ["BMA", "VBY"], ["ARN", "CPH"],
    ["ARN", "OSL"], ["ARN", "HEL"], ["ARN", "LHR"], ["ARN", "CDG"], ["ARN", "AMS"], ["ARN", "FRA"],
    ["ARN", "BCN"], ["ARN", "FCO"], ["ARN", "JFK"], ["ARN", "BKK"], ["GOT", "LHR"], ["GOT", "AMS"],
  ];
  for (const [x, y] of mustHave) {
    const c = candidates.find((c) => (c.a[0] === x && c.b[0] === y) || (c.a[0] === y && c.b[0] === x));
    if (!c) throw new Error(`Rutten ${x}-${y} går inte att välja`);
    pick(c);
  }

  // Sedan: varje flygplats får minst en rutt, till närmaste stora flygplats
  for (const airport of airports) {
    if (chosen.some((c) => c.a === airport || c.b === airport)) continue;
    const nearest = candidates
      .filter((c) => (c.a === airport && hubs.has(c.b[0])) || (c.b === airport && hubs.has(c.a[0])))
      .sort((x, y) => x.km - y.km)[0];
    if (nearest) pick(nearest);
  }

  // Sist: fyll på med slumpade par, viktat
  while (chosen.length < ROUTE_PAIRS && candidates.length > 0) {
    const total = candidates.reduce((sum, c) => sum + c.weight, 0);
    let r = random() * total;
    const c = candidates.find((c) => (r -= c.weight) < 0) ?? candidates.at(-1);
    pick(c);
  }

  // ---- Avgångstider: 2–3 per dag mellan 06:00 och 21:30, minst 3 timmar isär
  function departureTimes() {
    const count = randomInt(2, 3);
    const times = [];
    while (times.length < count) {
      const minutes = randomInt(6 * 12, 21 * 12 + 6) * 5; // var 5:e minut
      if (times.every((t) => Math.abs(t - minutes) >= 180)) times.push(minutes);
    }
    return times.sort((x, y) => x - y).map(formatTime);
  }

  const routes = chosen
    .flatMap(({ a, b, km }) => [
      { from: a[0], to: b[0], km },
      { from: b[0], to: a[0], km },
    ])
    .sort((x, y) => x.from.localeCompare(y.from) || x.to.localeCompare(y.to));
  // Avgångstiderna slumpas i rutternas ordning, efter paren
  return routes.map((r, i) => ({ ...r, id: i + 1, minutes: flightMinutes(r.km), times: departureTimes() }));
}

// ---- Skriv ut SQL, när skriptet körs (inte när det importeras)
export const q = (s) => `'${s.replace(/'/g, "''")}'`;

if (import.meta.main) {
  const routes = generateRoutes();
  const lines = [
    "-- GENERERAD av scripts/generate-routes.mjs, ändra inte för hand.",
    `-- ${airports.length} flygplatser, ${routes.length} rutter.`,
    "",
    "-- Flygplatser (de som redan finns hoppas över)",
    "INSERT OR IGNORE INTO airports (iata, name, country, timezone) VALUES",
    airports.map((a) => `  (${q(a[0])}, ${q(a[1])}, ${q(a[2])}, ${q(a[3])})`).join(",\n") + ";",
    "",
    "-- Rutter: från, till, flygtid (min) och avstånd (km, bara som kommentar)",
  ];
  for (const r of routes) {
    lines.push(
      `INSERT INTO routes (id, from_airport_id, to_airport_id, duration_minutes) ` +
        `SELECT ${r.id}, f.id, t.id, ${r.minutes} FROM airports f, airports t ` +
        `WHERE f.iata = ${q(r.from)} AND t.iata = ${q(r.to)}; -- ${Math.round(r.km)} km`,
    );
    lines.push(
      `INSERT INTO route_departures (route_id, departure_time) VALUES ` +
        r.times.map((t) => `(${r.id}, ${q(t)})`).join(", ") +
        ";",
    );
  }
  console.log(lines.join("\n"));
}
