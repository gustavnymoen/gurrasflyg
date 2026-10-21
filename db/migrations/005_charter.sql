-- TRIP-007: kursdatan för charter (data/ och knowledge/) i egna tabeller.
-- Flygbokningens tabeller (airports, routes …) ändras inte och refereras inte.
-- Datan fylls i av 006_charter_data.sql, som genereras av scripts/generate-charter-data.mjs.
-- Datum lagras som YYYY-MM-DD och tider som HH:MM, som i kursdatan.

-- Flygplatserna i data/airports.json
CREATE TABLE charter_airports (
  iata         TEXT PRIMARY KEY CHECK (iata GLOB '[A-Z][A-Z][A-Z]'),
  name         TEXT NOT NULL,
  city         TEXT NOT NULL,
  country      TEXT NOT NULL CHECK (country GLOB '[A-Z][A-Z]'),  -- landskod, t.ex. NA
  country_name TEXT NOT NULL,
  latitude     REAL NOT NULL CHECK (latitude BETWEEN -90 AND 90),
  longitude    REAL NOT NULL CHECK (longitude BETWEEN -180 AND 180),
  timezone     TEXT NOT NULL                                     -- t.ex. Africa/Windhoek
);

-- Resmålen i data/destinations.json, t.ex. teufelsberg
CREATE TABLE destinations (
  id                  TEXT PRIMARY KEY,
  title               TEXT NOT NULL,
  description         TEXT NOT NULL,
  continent           TEXT NOT NULL,
  country             TEXT NOT NULL CHECK (country GLOB '[A-Z][A-Z]'),
  country_name        TEXT NOT NULL,
  region              TEXT NOT NULL,
  locality            TEXT NOT NULL,
  category            TEXT NOT NULL,
  access              TEXT NOT NULL,
  nearest_airport     TEXT NOT NULL REFERENCES charter_airports(iata),
  nearest_distance_km INTEGER CHECK (nearest_distance_km >= 0),  -- NULL när enda vägen är en lång båtresa
  gateway_airport     TEXT REFERENCES charter_airports(iata),     -- stor internationell flygplats, eller NULL
  status_checked      TEXT CHECK (status_checked GLOB '[0-9][0-9][0-9][0-9]-[0-1][0-9]-[0-3][0-9]'),
  status_source       TEXT,                                       -- källan för status_checked
  path                TEXT NOT NULL UNIQUE                        -- sidan i knowledge/
);

-- Listorna i ett resmål, i den ordning de har i datan (position 1, 2 …)
CREATE TABLE destination_aliases (
  destination_id TEXT NOT NULL REFERENCES destinations(id),
  position       INTEGER NOT NULL CHECK (position > 0),
  alias          TEXT NOT NULL,
  PRIMARY KEY (destination_id, position),
  UNIQUE (destination_id, alias)
);

CREATE TABLE destination_tags (
  destination_id TEXT NOT NULL REFERENCES destinations(id),
  position       INTEGER NOT NULL CHECK (position > 0),
  tag            TEXT NOT NULL,
  PRIMARY KEY (destination_id, position),
  UNIQUE (destination_id, tag)
);

-- Sätt att ta sig dit, t.ex. train och walk
CREATE TABLE destination_transport (
  destination_id TEXT NOT NULL REFERENCES destinations(id),
  position       INTEGER NOT NULL CHECK (position > 0),
  transport      TEXT NOT NULL,
  PRIMARY KEY (destination_id, position),
  UNIQUE (destination_id, transport)
);

-- Texten på resmålets sida, i Markdown, utan rubriker
CREATE TABLE destination_pages (
  destination_id TEXT PRIMARY KEY REFERENCES destinations(id),
  overview       TEXT NOT NULL,
  getting_there  TEXT NOT NULL,
  visiting       TEXT NOT NULL
);

-- Fotot och dess kreditering. Filen ligger kvar i public/images/.
CREATE TABLE destination_photos (
  destination_id TEXT PRIMARY KEY REFERENCES destinations(id),
  src            TEXT NOT NULL CHECK (src GLOB '/images/*'),
  author         TEXT NOT NULL,
  license        TEXT NOT NULL,
  license_url    TEXT,                                            -- NULL för public domain
  source         TEXT NOT NULL
);

-- Tidtabellerna i data/flights.json, t.ex. ARN-BER-EW488.
-- Tiderna är lokal tid på respektive flygplats. arrives följer inte
-- sommartiden i kursdatan, så ankomsten räknas fram från departs och
-- duration_minutes (se TRIP-007, kort #11).
CREATE TABLE charter_timetables (
  id               TEXT PRIMARY KEY,
  airline          TEXT NOT NULL,
  from_airport     TEXT NOT NULL REFERENCES charter_airports(iata),
  to_airport       TEXT NOT NULL REFERENCES charter_airports(iata),
  valid_from       TEXT NOT NULL CHECK (valid_from GLOB '[0-9][0-9][0-9][0-9]-[0-1][0-9]-[0-3][0-9]'),
  valid_to         TEXT NOT NULL CHECK (valid_to GLOB '[0-9][0-9][0-9][0-9]-[0-1][0-9]-[0-3][0-9]'),
  departs          TEXT NOT NULL CHECK (departs GLOB '[0-2][0-9]:[0-5][0-9]'),
  arrives          TEXT NOT NULL CHECK (arrives GLOB '[0-2][0-9]:[0-5][0-9]'),
  arrival_day      INTEGER NOT NULL CHECK (arrival_day >= 0),     -- dagar efter avgångsdagen
  duration_minutes INTEGER NOT NULL CHECK (duration_minutes > 0),
  price            INTEGER NOT NULL CHECK (price >= 0),           -- hela kronor (EUR × 10)
  CHECK (valid_to >= valid_from),
  CHECK (from_airport <> to_airport)
);

-- Veckodagar tidtabellen flygs
CREATE TABLE charter_timetable_days (
  timetable_id TEXT NOT NULL REFERENCES charter_timetables(id),
  weekday      TEXT NOT NULL CHECK (weekday IN ('Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun')),
  PRIMARY KEY (timetable_id, weekday)
);

-- Flightnumren, ett per delsträcka, i ordning
CREATE TABLE charter_timetable_flights (
  timetable_id  TEXT NOT NULL REFERENCES charter_timetables(id),
  position      INTEGER NOT NULL CHECK (position > 0),
  flight_number TEXT NOT NULL,
  PRIMARY KEY (timetable_id, position)
);

-- Flygplatserna där man byter plan, i ordning
CREATE TABLE charter_timetable_stops (
  timetable_id TEXT NOT NULL REFERENCES charter_timetables(id),
  position     INTEGER NOT NULL CHECK (position > 0),
  airport      TEXT NOT NULL REFERENCES charter_airports(iata),
  PRIMARY KEY (timetable_id, position)
);

-- Sökningar på rutt (från, till) under en period
CREATE INDEX charter_timetables_route ON charter_timetables (from_airport, to_airport);
