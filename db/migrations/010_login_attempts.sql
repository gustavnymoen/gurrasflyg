-- Antal inloggningsförsök per IP-adress, så att lösenordet inte går att gissa
-- med många försök i snabb följd (TECH-017). Räknaren ligger i databasen
-- eftersom varje förfrågan på Vercel kan köras i en ny funktion.
CREATE TABLE login_attempts (
  ip             TEXT PRIMARY KEY,
  attempts       INTEGER NOT NULL,   -- försök sedan senaste utgångna fönstret
  last_failed_at INTEGER NOT NULL    -- millisekunder sedan 1970
);
