import { expect, test } from "vitest";
import { EMPTY_CHAT, parseSaved } from "./chat-saved";

test("TRIP-032-R5 a saved conversation is read back as it was written", () => {
  const saved = {
    open: true,
    entries: [
      { role: "assistant", content: "Hej." },
      { role: "user", content: "Fråga", failed: true },
      { role: "assistant", content: "Krångel", notice: true },
    ],
  };
  expect(parseSaved(JSON.stringify(saved))).toEqual(saved);
});

test("TRIP-032-R5 nothing saved, damaged or old data gives an empty chat", () => {
  for (const raw of [null, "", "inte json", "null", "[]", '{"open":"ja","entries":[]}', '{"open":true,"entries":"x"}', '{"open":true,"entries":[{"role":"bot","content":"x"}]}', '{"open":true,"entries":[{"role":"user","content":5}]}', '{"open":true,"entries":[null]}']) {
    expect(parseSaved(raw), String(raw)).toEqual(EMPTY_CHAT);
  }
});

test("TRIP-032-R5 only known fields are kept", () => {
  const raw = JSON.stringify({ open: false, entries: [{ role: "user", content: "x", html: "<b>", failed: "yes" }] });
  expect(parseSaved(raw)).toEqual({ open: false, entries: [{ role: "user", content: "x" }] });
});
