import { defineConfig } from "@playwright/test";

// The tests run against the live site by default, as the course prescribes.
// BASE_URL points them elsewhere: npm run test:local starts a production build
// on port 3100 with its own fresh test database (scripts/test-server.mjs).
const baseURL = process.env.BASE_URL ?? "https://gurrasflyg.vercel.app";
const local = baseURL.startsWith("http://localhost");

// Admin tests sign in with ADMIN_PASSWORD, read from .env.local when it exists
try {
  process.loadEnvFile(".env.local");
} catch {}

export default defineConfig({
  testDir: "./tests",
  reporter: "list",
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
  },
  webServer: local
    ? { command: "node scripts/test-server.mjs", url: baseURL, reuseExistingServer: false, timeout: 300_000 }
    : undefined,
});
