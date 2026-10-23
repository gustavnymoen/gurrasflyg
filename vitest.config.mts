import path from "node:path";
import { defineConfig } from "vitest/config";

// Enhetstester (TECH-015): *.test.ts bredvid koden eller datan de testar.
// Webbläsartesterna i tests/ körs av Playwright, inte här.
export default defineConfig({
  resolve: {
    alias: { "@": path.resolve(import.meta.dirname) },
  },
  test: {
    include: ["**/*.test.ts"],
    exclude: ["node_modules/**", ".next/**", ".next-test/**", "tests/**"],
    environment: "node",
    // Bygger en färsk databas för datakontrollerna, aldrig din egen
    globalSetup: ["./vitest.global-setup.mjs"],
  },
});
