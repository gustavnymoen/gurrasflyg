// Startar sajterna för npm run test:local. Playwright kör det här skriptet
// (se playwright.config.ts) och väntar tills port 3100 svarar.
//
// - Testerna delas mellan banor som körs samtidigt (lib/test-lanes.mjs,
//   TECH-030). Varje bana har en egen sajt på en egen port och en egen
//   testdatabas, ~/Ai Projekt/gurrasflyg-data/test-<bana>.db, som raderas och
//   byggs om från schema, seed och migreringar varje gång. Testerna börjar
//   alltså alltid från samma läge och rör aldrig din vanliga databas.
// - Port 3100 är bara en signal: den svarar när alla banors sajter är redo.
// - Sajten byggs en gång och körs som i produktion (next build + next start),
//   men i mappen .next-test så att en dev-server som redan är igång inte störs.
// - På CI byggs sajten i ett eget steg: `node scripts/test-server.mjs --build-only`,
//   och testerna startar servern med TEST_SERVER_PREBUILT=1, som hoppar över
//   bygget. Lokalt byggs den nya koden vid varje körning, så en gammal build
//   kan aldrig testas av misstag.

import { spawn, spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import { createServer } from "node:http";
import { mkdirSync, rmSync } from "node:fs";
import { localDataDir } from "../lib/local-db.mjs";
import { GATE_PORT, lanePort, testDbFileFor, testLanes } from "../lib/test-lanes.mjs";

const lanes = Array.from({ length: testLanes }, (_, lane) => lane);

// Samma miljö för alla banor utom databasen
const laneEnv = (lane) => ({
  ...process.env,
  TURSO_DATABASE_URL: `file:${testDbFileFor(lane)}`,
  TURSO_AUTH_TOKEN: "",
  NEXT_DIST_DIR: ".next-test",
  // Agneta svarar med en låtsasklient: inga prov kostar kursens tak (TRIP-017)
  LLM_MOCK: "1",
});

function runOrExit(command, args, env) {
  const result = spawnSync(command, args, { env, stdio: "inherit" });
  if (result.status !== 0) process.exit(result.status ?? 1);
}

mkdirSync(localDataDir, { recursive: true });
for (const lane of lanes) {
  for (const suffix of ["", "-wal", "-shm"]) rmSync(testDbFileFor(lane) + suffix, { force: true });
  runOrExit("node", ["scripts/db-setup.mjs"], laneEnv(lane));
}
if (process.env.TEST_SERVER_PREBUILT !== "1") runOrExit("npm", ["run", "build"], laneEnv(0));
if (process.argv.includes("--build-only")) process.exit(0);

// Next direkt med node, inte via npx: stängs npx ner lever sajten annars kvar och håller porten
const nextBin = createRequire(import.meta.url).resolve("next/dist/bin/next");
const servers = lanes.map((lane) =>
  spawn(process.execPath, [nextBin, "start", "-p", String(lanePort(lane))], { env: laneEnv(lane), stdio: "inherit" }),
);
let stopping = false;
const stopAll = (code) => {
  stopping = true;
  for (const server of servers) server.kill();
  process.exit(code);
};
servers.forEach((server, lane) =>
  server.on("exit", (code, signal) => {
    if (stopping) return;
    console.error(`The test site of lane ${lane} stopped (code ${code}, signal ${signal})`);
    stopAll(code ?? 1);
  }),
);
for (const signal of ["SIGINT", "SIGTERM"]) process.on(signal, () => stopAll(0));

// Väntar tills varje bana svarar, och öppnar sedan port 3100
async function answers(port) {
  while (true) {
    try {
      await fetch(`http://localhost:${port}/`);
      return;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 200));
    }
  }
}
await Promise.all(lanes.map((lane) => answers(lanePort(lane))));
createServer((_request, response) => response.end("ready")).listen(GATE_PORT);
