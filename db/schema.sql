-- Databasens struktur. Körs av scripts/db-setup.mjs.
-- Ändra här och kör sedan: npm run db:reset
--
-- Alla priser lagras som hela kronor (499 = 499 kr).
-- Lediga platser lagras inte utan räknas fram, se vyn available_seats längst ner.

-- Flygplats
CREATE TABLE airports (
  id       INTEGER PRIMARY KEY,
  name     TEXT NOT NULL,
  iata     TEXT NOT NULL UNIQUE,   -- förkortning, t.ex. ARN
  country  TEXT NOT NULL,
  timezone TEXT NOT NULL           -- t.ex. Europe/Stockholm
);

-- Plan
CREATE TABLE aircraft (
  id   INTEGER PRIMARY KEY,
  name TEXT NOT NULL COLLATE NOCASE UNIQUE
);

-- Klass
CREATE TABLE classes (
  id   INTEGER PRIMARY KEY,
  name TEXT NOT NULL COLLATE NOCASE UNIQUE
);

-- Kapacitet-plan: hur många platser ett plan har i varje klass
CREATE TABLE aircraft_capacity (
  aircraft_id INTEGER NOT NULL REFERENCES aircraft(id),
  class_id    INTEGER NOT NULL REFERENCES classes(id),
  capacity    INTEGER NOT NULL CHECK (capacity > 0),
  PRIMARY KEY (aircraft_id, class_id)
);

-- Flight
CREATE TABLE flights (
  id                INTEGER PRIMARY KEY,
  from_airport_id   INTEGER NOT NULL REFERENCES airports(id),
  to_airport_id     INTEGER NOT NULL REFERENCES airports(id),
  departure         TEXT NOT NULL,     -- ISO, lokal tid för avgångsflygplatsen: 2026-11-03T14:30
  duration_minutes  INTEGER NOT NULL CHECK (duration_minutes > 0),
  aircraft_id       INTEGER NOT NULL REFERENCES aircraft(id),
  CHECK (from_airport_id <> to_airport_id)
);
CREATE INDEX flights_search ON flights (from_airport_id, to_airport_id, departure);

-- Flight-pris
CREATE TABLE flight_prices (
  flight_id INTEGER NOT NULL REFERENCES flights(id),
  class_id  INTEGER NOT NULL REFERENCES classes(id),
  price     INTEGER NOT NULL CHECK (price >= 0),
  PRIMARY KEY (flight_id, class_id)
);

-- Addon
CREATE TABLE addons (
  id          INTEGER PRIMARY KEY,
  name        TEXT NOT NULL COLLATE NOCASE UNIQUE,
  description TEXT NOT NULL,
  price       INTEGER NOT NULL CHECK (price >= 0)
);

-- Addon-plan-klass: vilka tillägg som går att välja i vilken klass på vilket plan.
-- Klassen måste finnas på planet (därav referensen till aircraft_capacity).
CREATE TABLE aircraft_class_addons (
  aircraft_id INTEGER NOT NULL,
  class_id    INTEGER NOT NULL,
  addon_id    INTEGER NOT NULL REFERENCES addons(id),
  PRIMARY KEY (aircraft_id, class_id, addon_id),
  FOREIGN KEY (aircraft_id, class_id) REFERENCES aircraft_capacity(aircraft_id, class_id)
);

-- Kontakt
CREATE TABLE contacts (
  id      INTEGER PRIMARY KEY,
  name    TEXT NOT NULL,
  address TEXT NOT NULL,
  phone   TEXT NOT NULL,
  email   TEXT NOT NULL
);

-- Passagerare
CREATE TABLE passengers (
  id   INTEGER PRIMARY KEY,
  name TEXT NOT NULL
);

-- Bokning
CREATE TABLE bookings (
  id             INTEGER PRIMARY KEY,
  booking_number TEXT NOT NULL UNIQUE,
  contact_id     INTEGER NOT NULL REFERENCES contacts(id)
);

-- Bokning-flight: en rad per passagerare och flight
CREATE TABLE booking_flights (
  id           INTEGER PRIMARY KEY,
  booking_id   INTEGER NOT NULL REFERENCES bookings(id),
  flight_id    INTEGER NOT NULL REFERENCES flights(id),
  passenger_id INTEGER NOT NULL REFERENCES passengers(id),
  class_id     INTEGER NOT NULL REFERENCES classes(id),
  price        INTEGER NOT NULL CHECK (price >= 0),  -- kopieras in vid bokningstillfället
  UNIQUE (flight_id, passenger_id)
);
CREATE INDEX booking_flights_seats ON booking_flights (flight_id, class_id);

-- Bokning-flight-addon
CREATE TABLE booking_flight_addons (
  booking_flight_id INTEGER NOT NULL REFERENCES booking_flights(id),
  addon_id          INTEGER NOT NULL REFERENCES addons(id),
  price             INTEGER NOT NULL CHECK (price >= 0),  -- kopieras in vid bokningstillfället
  PRIMARY KEY (booking_flight_id, addon_id)
);

-- Lediga platser per flight och klass:
-- planets kapacitet i klassen minus antal bokade rader i booking_flights.
CREATE VIEW available_seats AS
SELECT
  f.id                                   AS flight_id,
  ac.class_id                            AS class_id,
  ac.capacity                            AS capacity,
  ac.capacity - (
    SELECT COUNT(*) FROM booking_flights bf
    WHERE bf.flight_id = f.id AND bf.class_id = ac.class_id
  )                                      AS available
FROM flights f
JOIN aircraft_capacity ac ON ac.aircraft_id = f.aircraft_id;
