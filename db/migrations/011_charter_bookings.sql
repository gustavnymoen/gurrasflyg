-- Charterbokningar (TRIP-014): tur och retur till ett resmål, med resenärer och
-- tillägg för hela bokningen. Egna tabeller: charter har varken plan, klasser
-- eller flygets tillägg, och bokningsnumret har prefixet CH- så att det inte
-- går att förväxla med en flygbokning.

-- Bokning: kontaktpersonen, betalsättet och priset för hela resan
CREATE TABLE charter_bookings (
  id             INTEGER PRIMARY KEY,
  booking_number TEXT NOT NULL UNIQUE CHECK (booking_number GLOB 'CH-[A-HJ-NP-Z2-9][A-HJ-NP-Z2-9][A-HJ-NP-Z2-9][A-HJ-NP-Z2-9][A-HJ-NP-Z2-9][A-HJ-NP-Z2-9]'),
  -- Skapas av webbläsaren för varje bokning, så att två tryck på Betala blir en bokning
  request_id     TEXT NOT NULL UNIQUE,
  destination_id TEXT NOT NULL REFERENCES destinations(id),
  first_name     TEXT NOT NULL,
  last_name      TEXT NOT NULL,
  email          TEXT NOT NULL,
  phone          TEXT NOT NULL,
  address        TEXT NOT NULL,
  payment        TEXT NOT NULL CHECK (payment IN ('cash', 'collect')),
  total          INTEGER NOT NULL CHECK (total >= 0),
  created_at     TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Resenärer i en bokning, i ordning (Passagerare 1, 2 …)
CREATE TABLE charter_booking_passengers (
  id         INTEGER PRIMARY KEY,
  booking_id INTEGER NOT NULL REFERENCES charter_bookings(id) ON DELETE CASCADE,
  position   INTEGER NOT NULL CHECK (position >= 0),
  first_name TEXT NOT NULL,
  last_name  TEXT NOT NULL,
  age        INTEGER NOT NULL CHECK (age BETWEEN 1 AND 120),
  UNIQUE (booking_id, position)
);

-- Utresan (0) och hemresan (1): tidtabellen, dagen och priset per person när den bokades
CREATE TABLE charter_booking_trips (
  id           INTEGER PRIMARY KEY,
  booking_id   INTEGER NOT NULL REFERENCES charter_bookings(id) ON DELETE CASCADE,
  position     INTEGER NOT NULL CHECK (position IN (0, 1)),
  timetable_id TEXT NOT NULL REFERENCES charter_timetables(id),
  date         TEXT NOT NULL CHECK (date GLOB '[0-9][0-9][0-9][0-9]-[0-1][0-9]-[0-3][0-9]'),
  price        INTEGER NOT NULL CHECK (price >= 0),
  UNIQUE (booking_id, position)
);

-- Tilläggen för hela bokningen: namn och pris per person när de bokades
-- (tilläggen är definierade i koden, lib/charter-rules.ts, inte i databasen)
CREATE TABLE charter_booking_extras (
  id         INTEGER PRIMARY KEY,
  booking_id INTEGER NOT NULL REFERENCES charter_bookings(id) ON DELETE CASCADE,
  code       TEXT NOT NULL,
  name       TEXT NOT NULL,
  price      INTEGER NOT NULL CHECK (price >= 0),
  UNIQUE (booking_id, code)
);
