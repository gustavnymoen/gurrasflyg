-- Plan och klasser i charter (TRIP-039): varje resa i en bokning får ett plan, och varje
-- resenär en plats med klass och pris på varje resa, med tillägg som på flygen.
-- Bara tillägg: befintliga rader ändras inte. Bokningar från före den här migreringen har
-- inget plan och inga platser (aircraft_id är NULL), och behåller sitt pris och sin visning.

ALTER TABLE charter_booking_trips ADD COLUMN aircraft_id INTEGER REFERENCES aircraft(id);

-- En resenärs plats på en resa: klassen och priset för den
-- (avgångens pris × planets och klassens prisfaktor)
CREATE TABLE charter_booking_seats (
  id              INTEGER PRIMARY KEY,
  booking_trip_id INTEGER NOT NULL REFERENCES charter_booking_trips(id) ON DELETE CASCADE,
  passenger_id    INTEGER NOT NULL REFERENCES charter_booking_passengers(id) ON DELETE CASCADE,
  class_id        INTEGER NOT NULL REFERENCES classes(id),
  price           INTEGER NOT NULL CHECK (price >= 0),
  UNIQUE (booking_trip_id, passenger_id)
);

-- Tillägg på en plats: antal och pris per styck när det bokades
CREATE TABLE charter_booking_addons (
  id              INTEGER PRIMARY KEY,
  booking_seat_id INTEGER NOT NULL REFERENCES charter_booking_seats(id) ON DELETE CASCADE,
  addon_id        INTEGER REFERENCES addons(id),
  name            TEXT NOT NULL,
  count           INTEGER NOT NULL CHECK (count BETWEEN 1 AND 10),
  price           INTEGER NOT NULL CHECK (price >= 0)
);
