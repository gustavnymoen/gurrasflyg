import { afterEach, beforeEach, expect, test, vi } from "vitest";
import { createSessionToken, isValidSessionToken, passwordMatches, safeEqual, SESSION_HOURS } from "./session";

// Inloggningscookien är det enda som skyddar admin, så varje sätt att få den
// att gälla fel ska ha ett test som går sönder om det händer (TECH-028-R2 F1).
const HOUR = 60 * 60 * 1000;

beforeEach(() => {
  vi.stubEnv("ADMIN_SESSION_SECRET", "test-secret");
  vi.useFakeTimers();
  vi.setSystemTime(new Date("2026-11-03T12:00:00Z"));
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllEnvs();
});

test("TECH-028-R2 F1 a fresh token is valid and an expired one with a correct signature is not", () => {
  const token = createSessionToken();
  expect(isValidSessionToken(token)).toBe(true);
  vi.advanceTimersByTime(SESSION_HOURS * HOUR - 1000);
  expect(isValidSessionToken(token)).toBe(true);
  vi.advanceTimersByTime(2000);
  expect(isValidSessionToken(token)).toBe(false);
});

test("TECH-028-R2 F1 a token whose expiry was changed is refused", () => {
  const [expires, signature] = createSessionToken().split(".");
  expect(isValidSessionToken(`${Number(expires) + HOUR}.${signature}`)).toBe(false);
});

test("TECH-028-R2 F1 a token signed with another secret is refused", () => {
  const token = createSessionToken();
  vi.stubEnv("ADMIN_SESSION_SECRET", "another-secret");
  expect(isValidSessionToken(token)).toBe(false);
});

test("TECH-028-R2 F1 missing or malformed tokens are refused", () => {
  const [expires, signature] = createSessionToken().split(".");
  for (const token of [undefined, "", "abc", `${expires}.`, `.${signature}`, `${expires}.${signature}x`, `${expires}.${"0".repeat(64)}`, `x.${signature}`]) {
    expect(isValidSessionToken(token)).toBe(false);
  }
});

test("TECH-028-R2 F1 without a secret no token is created or accepted", () => {
  vi.stubEnv("ADMIN_SESSION_SECRET", "");
  expect(() => createSessionToken()).toThrow();
  expect(() => isValidSessionToken(`${Date.now() + HOUR}.a`)).toThrow();
});

test("TECH-028-R2 F1 passwordMatches and safeEqual compare the whole value", () => {
  expect(passwordMatches("hemligt", "hemligt")).toBe(true);
  expect(passwordMatches("hemligt", "hemligt ")).toBe(false);
  expect(passwordMatches("", "hemligt")).toBe(false);
  expect(safeEqual("abc", "abc")).toBe(true);
  expect(safeEqual("abc", "abd")).toBe(false);
  expect(safeEqual("abc", "abcd")).toBe(false);
});
