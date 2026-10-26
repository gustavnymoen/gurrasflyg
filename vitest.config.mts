import path from "node:path";
import { defineConfig } from "vitest/config";

// Enhetstester (TECH-015): *.test.ts bredvid koden eller datan de testar.
// Webbläsartesterna i tests/ körs av Playwright, inte här.
export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname),
      // server-only stoppar import utanför servern; i enhetstesterna av
      // serverkoden (lib/bookings.test.ts) är det en tom modul
      "server-only": path.resolve(import.meta.dirname, "node_modules/server-only/empty.js"),
    },
  },
  test: {
    include: ["**/*.test.ts"],
    // .claude/ kan ha andra sessioners worktrees, med egna node_modules
    exclude: ["node_modules/**", ".next/**", ".next-test/**", "tests/**", ".claude/**"],
    environment: "node",
    // Bygger en färsk databas för datakontrollerna, aldrig din egen
    globalSetup: ["./vitest.global-setup.mjs"],
    // En fil i taget: flera tester skriver till samma databas (t.ex.
    // lib/bookings.test.ts och db/migrations/006_charter_data.test.ts), och
    // två skrivande transaktioner samtidigt ger "database is locked"
    fileParallelism: false,
  },
});
