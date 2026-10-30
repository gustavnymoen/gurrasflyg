import type { NextConfig } from "next";
import { PHASE_DEVELOPMENT_SERVER } from "next/constants";

// TECH-026-R3: 'unsafe-inline' för script och style behövs för Nexts egna inline-skript och
// stilar. En strikt policy med nonce kräver att varje sida renderas dynamiskt, vilket inte går
// med cacheComponents (wiki/system/security-headers.md). I utvecklingsläget behöver Reacts
// felsökning dessutom 'unsafe-eval'.
const contentSecurityPolicy = (dev: boolean) =>
  [
    "default-src 'self'",
    `script-src 'self' 'unsafe-inline'${dev ? " 'unsafe-eval'" : ""}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob:",
    "font-src 'self'",
    "connect-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
  ].join("; ");

const nextConfig = (phase: string): NextConfig => ({
  // Testservern (scripts/test-server.mjs) bygger i en egen mapp
  distDir: process.env.NEXT_DIST_DIR || ".next",
  experimental: {
    agentFeedback: true,
  },
  cacheComponents: true,
  partialPrefetching: true,
  // TECH-013: sidan får inte visas i en ram på en annan sida (clickjacking),
  // filtyper gissas inte, och adressen skickas inte vidare till andra sajter.
  // TECH-026: kamera, mikrofon och plats är avstängda, webbläsaren använder bara https
  // i två år, och sidan får bara hämta det den själv äger
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Content-Security-Policy", value: contentSecurityPolicy(phase === PHASE_DEVELOPMENT_SERVER) },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
});

export default nextConfig;
