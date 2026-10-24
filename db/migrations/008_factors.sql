-- Prisfaktor per klass och pris- och tidsfaktor per plan (TRIP-011).
-- Faktorerna lagras i procent, som heltal: 120 = 1,20. Då blir priset
-- avgångens pris × planets procent × klassens procent / 10 000, utan
-- avrundningsfel från decimaltal.

-- Klassens prisfaktor, 1,00–10,00 (TRIP-011-R6)
ALTER TABLE classes ADD COLUMN price_percent INTEGER NOT NULL DEFAULT 100 CHECK (price_percent BETWEEN 100 AND 1000);
UPDATE classes SET price_percent = 150 WHERE name = 'Business';
UPDATE classes SET price_percent = 250 WHERE name = 'Första klass';

-- Planets prisfaktor, 1,00–10,00, och tidsfaktor, mer än 0 och högst 10,00 (TRIP-011-R8)
ALTER TABLE aircraft ADD COLUMN price_percent INTEGER NOT NULL DEFAULT 100 CHECK (price_percent BETWEEN 100 AND 1000);
ALTER TABLE aircraft ADD COLUMN time_percent INTEGER NOT NULL DEFAULT 100 CHECK (time_percent BETWEEN 1 AND 1000);
-- Ett luftskepp är långsamt, ett rymdskepp och ett stridsflygplan snabba och dyra
UPDATE aircraft SET price_percent = 120, time_percent = 400 WHERE name = 'Hindenburg';
UPDATE aircraft SET price_percent = 300, time_percent = 30 WHERE name = 'Millenium Falcon';
UPDATE aircraft SET price_percent = 800, time_percent = 40 WHERE name = 'F35';
