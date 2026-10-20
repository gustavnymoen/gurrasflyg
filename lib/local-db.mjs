// Var den lokala databasen och dess säkerhetskopior ligger.
//
// Databasen ligger utanför OneDrive, i ~/Ai Projekt/gurrasflyg-data/. OneDrive
// synkar filer medan de används och kan då flytta eller tömma SQLites
// hjälpfiler (-wal, -shm), och då går databasen sönder.
//
// Säkerhetskopiorna ligger däremot i projektets db/backups/, som OneDrive
// synkar till molnet. En kopia är en färdig fil som inte ändras, så den går
// bra att synka. Kraschar datorn finns kopiorna kvar i OneDrive.
//
// Används av lib/db.ts och skripten i scripts/.
import os from "node:os";
import path from "node:path";

export const localDataDir = path.join(os.homedir(), "Ai Projekt", "gurrasflyg-data");
export const localDbFile = path.join(localDataDir, "gurrasflyg.db");
// Relativt projektmappen (npm-skripten och Next körs alltid därifrån)
export const backupDir = path.join(process.cwd(), "db", "backups");

// Testernas egen databas (npm run test:local). Byggs om från grunden vid
// varje testkörning, så testerna rör aldrig den riktiga lokala databasen.
export const testDbFile = path.join(localDataDir, "test.db");
