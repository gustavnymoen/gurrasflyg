// Mäter testsviten för npm run test:time (TECH-011): kör npm run test:local och
// skriver ut antalet tester, testernas sammanlagda tid och de fem
// långsammaste, och markerar det som går över tidsbudgeten i CLAUDE.md.
//
// Tiden är testernas egen tid, utan bygget av testservern, så att den går
// att jämföra mellan körningar.

import { spawnSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const TEST_BUDGET_MS = 5_000;
const SUITE_BUDGET_MS = 180_000;

const dir = mkdtempSync(join(tmpdir(), "test-time-"));
const reportFile = join(dir, "report.json");

// Listan visar förloppet som vanligt, JSON-rapporten ger tiderna
let run, report;
try {
  run = spawnSync("npm", ["run", "test:local", "--", "--reporter=list,json"], {
    env: { ...process.env, PLAYWRIGHT_JSON_OUTPUT_FILE: reportFile },
    stdio: "inherit",
  });
  // Ingen rapport om testservern inte gick att bygga: felet syns redan ovan
  if (existsSync(reportFile)) report = JSON.parse(readFileSync(reportFile, "utf8"));
} finally {
  rmSync(dir, { recursive: true, force: true });
}
if (!report) process.exit(run.status ?? 1);

// Varje test med sin titel och tid, i alla filer och describe-block
function testsIn(suite) {
  const own = suite.specs.flatMap((spec) =>
    spec.tests.map((test) => ({
      title: spec.title,
      file: spec.file,
      skipped: test.status === "skipped",
      ms: test.results.reduce((sum, result) => sum + result.duration, 0),
    })),
  );
  return [...own, ...(suite.suites ?? []).flatMap(testsIn)];
}

const ran = report.suites.flatMap(testsIn).filter((test) => !test.skipped);
const totalMs = ran.reduce((sum, test) => sum + test.ms, 0);
const slowest = [...ran].sort((a, b) => b.ms - a.ms).slice(0, 5);
const overBudget = ran.filter((test) => test.ms > TEST_BUDGET_MS);

const seconds = (ms) => `${(ms / 1000).toFixed(1)} s`;
const mark = (over) => (over ? "  ← över budget" : "");

console.log(`\nTester: ${ran.length} körda, ${report.stats.skipped} överhoppade`);
console.log(`Testernas tid: ${seconds(totalMs)} (budget ${seconds(SUITE_BUDGET_MS)})${mark(totalMs > SUITE_BUDGET_MS)}`);
console.log(`\nDe fem långsammaste (budget ${seconds(TEST_BUDGET_MS)} per test):`);
for (const test of slowest) {
  console.log(`  ${seconds(test.ms).padStart(7)}  ${test.title} (${test.file})${mark(test.ms > TEST_BUDGET_MS)}`);
}
if (overBudget.length > 0) console.log(`\n${overBudget.length} tester över budget`);

process.exit(run.status ?? 1);
