import { defineConfig } from "@playwright/test";

// The tests run against the live site by default, as the course prescribes.
// BASE_URL points them elsewhere: npm run test:local starts a production build
// on port 3100 with its own fresh test database (scripts/test-server.mjs).
const baseURL = process.env.BASE_URL ?? "https://gurrasflyg.vercel.app";
const local = baseURL.startsWith("http://localhost");

// Preview deployments on Vercel ask for a Vercel sign-in. Preview tests send
// this secret, which lets automated tests past it (TECH-007).
const bypassSecret = process.env.VERCEL_AUTOMATION_BYPASS_SECRET;

// Admin tests sign in with ADMIN_PASSWORD, read from .env.local when it exists
try {
  process.loadEnvFile(".env.local");
} catch {}

export default defineConfig({
  testDir: "./tests",
  // On GitHub, also an HTML report that is saved when tests fail (TECH-001)
  reporter: process.env.CI ? [["list"], ["html", { open: "never" }]] : "list",
  // A forgotten test.only must not make the pipeline skip the other tests
  forbidOnly: !!process.env.CI,
  // Removes leftover "E2E …" test data after the run
  globalTeardown: "./tests/global-teardown.ts",
  // One test at a time: the tests share one database, and some check totals
  workers: 1,
  // The live site answers slower than a local server (network, Turso)
  expect: { timeout: local ? 5_000 : 10_000 },
  use: {
    baseURL,
    browserName: "chromium",
    locale: "sv-SE",
    // The tests don't wait for the site's animations: Playwright waits for a
    // card that is moving into place before it clicks it, about 0,4 s each time
    // (TECH-023). The few tests of the motion itself ask for "no-preference".
    reducedMotion: "reduce",
    // Sent with every request, so no bypass cookie is needed
    extraHTTPHeaders: bypassSecret ? { "x-vercel-protection-bypass": bypassSecret } : undefined,
    // Screenshot of failing tests, for the report. A trace only locally, and
    // only when TRACE=1: recording one for every test costs about a tenth of
    // the run time (TECH-023). It saves every request's headers and typed
    // values, and so the bypass secret and the admin password, which the runs
    // against a deployed site use (TECH-013).
    screenshot: "only-on-failure",
    trace: local && process.env.TRACE === "1" ? "retain-on-failure" : "off",
  },
  webServer: local
    ? { command: "node scripts/test-server.mjs", url: baseURL, reuseExistingServer: false, timeout: 300_000 }
    : undefined,
});
