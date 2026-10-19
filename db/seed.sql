-- Testdata. Körs efter schema.sql av scripts/db-setup.mjs.
-- Alla priser i ören.

INSERT INTO airports (iata, name, country, timezone) VALUES
  ('ARN', 'Stockholm Arlanda',        'Sverige',        'Europe/Stockholm'),
  ('BMA', 'Stockholm Bromma',         'Sverige',        'Europe/Stockholm'),
  ('GOT', 'Göteborg Landvetter',      'Sverige',        'Europe/Stockholm'),
  ('MMX', 'Malmö Airport',            'Sverige',        'Europe/Stockholm'),
  ('LLA', 'Luleå Airport',            'Sverige',        'Europe/Stockholm'),
  ('VBY', 'Visby Airport',            'Sverige',        'Europe/Stockholm'),
  ('OSL', 'Oslo Gardermoen',          'Norge',          'Europe/Oslo'),
  ('CPH', 'Köpenhamn Kastrup',        'Danmark',        'Europe/Copenhagen'),
  ('HEL', 'Helsingfors-Vanda',        'Finland',        'Europe/Helsinki'),
  ('LHR', 'London Heathrow',          'Storbritannien', 'Europe/London'),
  ('CDG', 'Paris Charles de Gaulle',  'Frankrike',      'Europe/Paris'),
  ('AMS', 'Amsterdam Schiphol',       'Nederländerna',  'Europe/Amsterdam'),
  ('FRA', 'Frankfurt am Main',        'Tyskland',       'Europe/Berlin'),
  ('BCN', 'Barcelona El Prat',        'Spanien',        'Europe/Madrid'),
  ('FCO', 'Rom Fiumicino',            'Italien',        'Europe/Rome'),
  ('JFK', 'New York John F. Kennedy', 'USA',            'America/New_York');

INSERT INTO classes (name) VALUES
  ('Ekonomi'),
  ('Business'),
  ('Första klass');

-- Plan och addons läggs in via adminsidan (/admin).
-- Flighter saknas tills vidare eftersom de kräver plan.
