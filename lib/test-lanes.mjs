// Banorna för npm run test:local (TECH-030): testerna delas mellan några banor
// som körs samtidigt, och varje bana har en egen sajt (port) och en egen
// testdatabas, så att testerna inte ser varandras flygplan, bokningar och
// gränser. Används av playwright.config.ts, scripts/test-server.mjs och
// tests/plan.ts.
import path from "node:path";
import { localDataDir } from "./local-db.mjs";

// Antal banor. Fler banor ger kortare tid tills datorn är fullt belastad
export const testLanes = Number(process.env.TEST_LANES ?? 4);

// Port 3100 svarar när alla banors sajter är redo (Playwright väntar på den).
// Banorna har portarna 3200 och uppåt, långt från 3000-3101 som andra projekts
// utvecklingsservrar brukar ta
export const GATE_PORT = 3100;
export const lanePort = (lane) => 3200 + lane;

// Banans egen testdatabas. Byggs om från grunden vid varje testkörning, så
// testerna rör aldrig den riktiga lokala databasen.
export const testDbFileFor = (lane) => path.join(localDataDir, `test-${lane}.db`);
