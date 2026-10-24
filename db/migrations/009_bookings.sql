-- Bokningar av de valda flygen, planen och klasserna (TRIP-012).
--
-- De gamla tabellerna för flighter och bokningar byggde på ett plan per
-- flight och lediga platser. Sedan TRIP-011 flygs rutterna (routes och
-- route_departures) och varje bokning får sitt eget plan, så de används inte
-- längre och ersätts här. Ingen sida har kunnat boka, så de ska vara tomma;
-- finns det ändå något i dem stoppas migreringen, så att inget går förlorat.
CREATE TABLE migration_009_check (n INTEGER NOT NULL CHECK (n = 0));
INSERT INTO migration_009_check
SELECT (SELECT COUNT(*) FROM bookings) + (SELECT COUNT(*) FROM booking_flights) + (SELECT COUNT(*) FROM flights);
DROP TABLE migration_009_check;

DROP VIEW available_seats;
DROP TABLE booking_flight_addons;
DROP TABLE booking_flights;
DROP TABLE bookings;
DROP TABLE passengers;
DROP TABLE contacts;
DROP TABLE flight_prices;
DROP TABLE flights;

-- Bokning: kontaktpersonen, betalsättet och priset för hela resan
CREATE TABLE bookings (
  id             INTEGER PRIMARY KEY,
  booking_number TEXT NOT NULL UNIQUE,           -- sex tecken, t.ex. K7M2QX
  -- Skapas av webbläsaren för varje bokning, så att två tryck på Betala blir en bokning
  request_id     TEXT NOT NULL UNIQUE,
  first_name     TEXT NOT NULL,
  last_name      TEXT NOT NULL,
  email          TEXT NOT NULL,
  phone          TEXT NOT NULL,
  address        TEXT NOT NULL,
  payment        TEXT NOT NULL CHECK (payment IN ('cash', 'collect')),  -- Cash till piloten, Vi hämtar pengarna hos dig
  total          INTEGER NOT NULL CHECK (total >= 0),
  created_at     TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Passagerare i en bokning, i ordning (Passagerare 1, 2 …)
CREATE TABLE booking_passengers (
  id         INTEGER PRIMARY KEY,
  booking_id INTEGER NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  position   INTEGER NOT NULL,
  first_name TEXT NOT NULL,
  last_name  TEXT NOT NULL,
  age        INTEGER NOT NULL CHECK (age BETWEEN 1 AND 120),
  UNIQUE (booking_id, position)
);

-- Ett flyg i en bokning: utresan (0) eller hemresan (1), med datum, avgång,
-- plan och avgångens pris per person när den bokades
CREATE TABLE booking_flights (
  id             INTEGER PRIMARY KEY,
  booking_id     INTEGER NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  position       INTEGER NOT NULL CHECK (position IN (0, 1)),
  route_id       INTEGER NOT NULL REFERENCES routes(id),
  date           TEXT NOT NULL,
  departure_time TEXT NOT NULL,
  aircraft_id    INTEGER NOT NULL REFERENCES aircraft(id),
  price          INTEGER NOT NULL CHECK (price >= 0),
  UNIQUE (booking_id, position)
);

-- En passagerares plats på ett flyg: klassen och priset för den
-- (avgångens pris × planets och klassens prisfaktor)
CREATE TABLE booking_seats (
  id                INTEGER PRIMARY KEY,
  booking_flight_id INTEGER NOT NULL REFERENCES booking_flights(id) ON DELETE CASCADE,
  passenger_id      INTEGER NOT NULL REFERENCES booking_passengers(id) ON DELETE CASCADE,
  class_id          INTEGER NOT NULL REFERENCES classes(id),
  price             INTEGER NOT NULL CHECK (price >= 0),
  UNIQUE (booking_flight_id, passenger_id)
);

-- Tillägg på en plats: antal och pris per styck när det bokades. Dåliga
-- nerver är inget tillägg i admin och har inget addon_id.
CREATE TABLE booking_addons (
  id              INTEGER PRIMARY KEY,
  booking_seat_id INTEGER NOT NULL REFERENCES booking_seats(id) ON DELETE CASCADE,
  addon_id        INTEGER REFERENCES addons(id),
  name            TEXT NOT NULL,
  count           INTEGER NOT NULL CHECK (count BETWEEN 1 AND 10),
  price           INTEGER NOT NULL CHECK (price >= 0)
);
