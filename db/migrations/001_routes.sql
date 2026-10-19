-- Rutter och deras dagliga avgångstider.
-- Planet sätts med knappen "Tilldela plan" på adminsidan.

CREATE TABLE routes (
  id               INTEGER PRIMARY KEY,
  from_airport_id  INTEGER NOT NULL REFERENCES airports(id),
  to_airport_id    INTEGER NOT NULL REFERENCES airports(id),
  duration_minutes INTEGER NOT NULL CHECK (duration_minutes > 0),
  -- Tas planet bort blir rutten utan plan i stället för att stoppa borttagningen
  aircraft_id      INTEGER REFERENCES aircraft(id) ON DELETE SET NULL,
  UNIQUE (from_airport_id, to_airport_id),
  CHECK (from_airport_id <> to_airport_id)
);

-- Avgångstid varje dag, lokal tid för avgångsflygplatsen, t.ex. 14:30
CREATE TABLE route_departures (
  route_id       INTEGER NOT NULL REFERENCES routes(id) ON DELETE CASCADE,
  departure_time TEXT NOT NULL CHECK (departure_time GLOB '[0-2][0-9]:[0-5][0-9]'),
  PRIMARY KEY (route_id, departure_time)
);
