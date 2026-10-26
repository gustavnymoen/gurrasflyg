-- Avbokningar (TRIP-023): en rad per avbokning, med utfallet av lotteriet och
-- beloppet. De avbokade delarna ligger kvar och pekar på avbokningen, så att
-- bokningen går att visa med sin historia. Bara tillägg: befintliga bokningar
-- och deras totaler ändras inte.

-- Flygbokning: en avbokning gäller ett eller flera säten (en plats på ett flyg)
CREATE TABLE booking_cancellations (
  id           INTEGER PRIMARY KEY,
  booking_id   INTEGER NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  -- Skapas av webbläsaren för varje bekräftelse, så att två klick blir en avbokning
  request_id   TEXT NOT NULL UNIQUE,
  won          INTEGER NOT NULL CHECK (won IN (0, 1)),   -- 1 = lotteriet vanns och pengarna betalas tillbaka
  amount       INTEGER NOT NULL CHECK (amount >= 0),     -- värdet av det som avbokades
  refunded     INTEGER NOT NULL CHECK (refunded >= 0),   -- amount vid vinst, annars 0
  cancelled_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE booking_seats ADD COLUMN cancellation_id INTEGER REFERENCES booking_cancellations(id) ON DELETE SET NULL;

-- Charterbokning: en avbokning gäller en eller flera resenärer, på både ut- och hemresan
CREATE TABLE charter_booking_cancellations (
  id           INTEGER PRIMARY KEY,
  booking_id   INTEGER NOT NULL REFERENCES charter_bookings(id) ON DELETE CASCADE,
  request_id   TEXT NOT NULL UNIQUE,
  won          INTEGER NOT NULL CHECK (won IN (0, 1)),
  amount       INTEGER NOT NULL CHECK (amount >= 0),
  refunded     INTEGER NOT NULL CHECK (refunded >= 0),
  cancelled_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE charter_booking_passengers
  ADD COLUMN cancellation_id INTEGER REFERENCES charter_booking_cancellations(id) ON DELETE SET NULL;
