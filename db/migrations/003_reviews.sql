-- Omdömen som visas i karusellen på startsidan. Skapas och tas bort på adminsidan.

CREATE TABLE reviews (
  id         INTEGER PRIMARY KEY,
  rating     INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),  -- antal stjärnor
  title      TEXT NOT NULL,
  author     TEXT NOT NULL,                                     -- den som lämnat omdömet
  body       TEXT NOT NULL CHECK (length(body) <= 255),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Tre påhittade testomdömen
INSERT INTO reviews (rating, title, author, body) VALUES
  (5, 'Bästa flygresan i mitt liv!', 'Margareta Ek',
   'Personalen var otroligt trevlig, kaffet var varmt och vi landade tio minuter före tidtabell. Gurras Flyg har fått en kund för livet!'),
  (1, 'Aldrig mer!', 'Bengt Grävling',
   'Min väska åkte till Luleå medan jag landade i Barcelona. Kundtjänst lät mig vänta i 47 minuter och sa sedan "ajja bajja". Jag går hellre.'),
  (3, 'Helt okej, inget mer', 'Sven Svensson',
   'Planet gick i tid och sätena var bekväma, men smörgåsen ombord kostade 89 kr och smakade papp. Jag flyger nog igen, men tar med egen matsäck.');
