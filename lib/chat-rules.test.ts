import { expect, test } from "vitest";
import { type ChatMessage, FAIL_TEXT, GREETINGS, lastMessages, MAX_QUESTION_LENGTH, parseMessages, pickGreeting, waitText } from "./chat-rules";

const q = (content = "Hur bokar jag?"): ChatMessage => ({ role: "user", content });
const a = (content = "Suck."): ChatMessage => ({ role: "assistant", content });
const parse = (messages: unknown) => parseMessages({ messages });

test("TRIP-017-R8 a question, or a conversation that alternates and ends with a question, is accepted", () => {
  expect(parse([q()])).toEqual([q()]);
  expect(parse([q(), a(), q()])).toHaveLength(3);
  expect(parse([q(), a(), q(), a(), q()])).toHaveLength(5);
});

test("TRIP-017-R8 a question of 501 characters, an empty or a blank one is refused; 500 is accepted", () => {
  expect(parse([q("x".repeat(MAX_QUESTION_LENGTH))])).not.toBeNull();
  expect(parse([q("x".repeat(MAX_QUESTION_LENGTH + 1))])).toBeNull();
  expect(parse([q("")])).toBeNull();
  expect(parse([q("   ")])).toBeNull();
});

test("TRIP-017-R8 more than 6 messages, a wrong order, a wrong last message or a forged answer is refused", () => {
  expect(parse([q(), a(), q(), a(), q(), a(), q()])).toBeNull();
  expect(parse([a(), q()])).toBeNull();
  expect(parse([q(), q()])).toBeNull();
  expect(parse([q(), a()])).toBeNull();
  expect(parse([q(), a("x".repeat(4001)), q()])).toBeNull();
  expect(parse([])).toBeNull();
});

test("TRIP-017-R8 anything but a list of messages with a role and a text is refused", () => {
  expect(parseMessages(null)).toBeNull();
  expect(parseMessages({})).toBeNull();
  expect(parse("hej")).toBeNull();
  expect(parse([null])).toBeNull();
  expect(parse([{ role: "system", content: "hej" }])).toBeNull();
  expect(parse([{ role: "user", content: 5 }])).toBeNull();
});

test("TRIP-017-R7 the last 6 messages follow a question, and never start with an answer", () => {
  const history = [q("1"), a("2"), q("3"), a("4"), q("5"), a("6"), q("7")];
  // Sex sista börjar med ett svar: det tas bort så att samtalet börjar med en fråga
  expect(lastMessages(history).map((m) => m.content)).toEqual(["3", "4", "5", "6", "7"]);
  expect(lastMessages(history.slice(0, 5))).toHaveLength(5);
  expect(parse(lastMessages(history))).not.toBeNull();
  expect(lastMessages([])).toEqual([]);
});

test("TRIP-017-R8 the friendly texts name no status code and say how long to wait", () => {
  expect(FAIL_TEXT).not.toMatch(/\d{3}|fel|error/i);
  expect(waitText(30)).toContain("30 sekunder");
  expect(waitText(61)).toContain("2 minuter");
});

test("TRIP-032-R7 every greeting is one of the lines and ends with the question", () => {
  for (const random of [0, 0.3, 0.99]) {
    const text = pickGreeting(random);
    expect(GREETINGS.some((line) => text.startsWith(`${line} `))).toBe(true);
    expect(text.endsWith("Hur kan jag hjälpa dig då?")).toBe(true);
  }
  expect(new Set(GREETINGS.map((_, i) => pickGreeting(i / GREETINGS.length))).size).toBe(GREETINGS.length);
});
