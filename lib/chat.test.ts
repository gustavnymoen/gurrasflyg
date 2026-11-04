import { afterEach, expect, test, vi } from "vitest";
import { unitTestDbFile } from "./local-db.mjs";

vi.mock("next/server", () => ({ connection: async () => {} }));
process.env.TURSO_DATABASE_URL = `file:${unitTestDbFile}`;
const { askAgneta, MAX_TOKENS, mockClient, MODEL } = await import("./chat");
const { buildSystemPrompt } = await import("./chat-prompt");
const { CHAT_LIMIT } = await import("./flow-limits");
const { MINUTE_MS, registerAttempt } = await import("./rate-limit");

const usage = { input_tokens: 5, output_tokens: 7, cache_read_input_tokens: 3, cache_creation_input_tokens: 0 };
const reply = (content: unknown[], stop_reason = "end_turn") => ({ content, stop_reason, usage });
const clientOf = (answer: unknown) => {
  const create = vi.fn(async () => answer);
  return { client: { messages: { create } } as never, create };
};
const question = [{ role: "user" as const, content: "Vad kostar Teufelsberg?" }];

afterEach(() => {
  vi.restoreAllMocks();
  delete process.env.LLM_MOCK;
});

test("TRIP-017-R6 the request has the model, the system prompt, cache_control, max_tokens 1000 and the messages", async () => {
  const { client, create } = clientOf(reply([{ type: "text", text: "Dyrt." }]));
  expect(await askAgneta(question, client)).toBe("Dyrt.");
  expect(MODEL).toBe("claude-sonnet-5-5");
  expect(create).toHaveBeenCalledWith({
    model: "claude-sonnet-5-5",
    max_tokens: 1000,
    cache_control: { type: "ephemeral" },
    system: await buildSystemPrompt(),
    messages: question,
  });
  expect(MAX_TOKENS).toBe(1000);
});

test("TRIP-017-R6 the usage of every response is logged, and the key never", async () => {
  process.env.LLM_API_KEY = "sk-secret-test-key";
  const log = vi.spyOn(console, "log").mockImplementation(() => {});
  await askAgneta(question, clientOf(reply([{ type: "text", text: "Hm." }])).client);
  expect(log).toHaveBeenCalledWith("chat usage", JSON.stringify(usage));
  expect(JSON.stringify(log.mock.calls)).not.toContain("sk-secret-test-key");
  delete process.env.LLM_API_KEY;
});

test("TRIP-017-R6 LLM_MOCK=1 uses the fake client: the answer comes back and no request leaves the server", async () => {
  process.env.LLM_MOCK = "1";
  vi.spyOn(console, "log").mockImplementation(() => {});
  const fetchSpy = vi.spyOn(globalThis, "fetch");
  expect(await askAgneta(question)).toContain("Vad kostar Teufelsberg?");
  expect(fetchSpy).not.toHaveBeenCalled();
});

test("TRIP-017-R8 the fake client fails on a question with FEL, so the error state can be tried", async () => {
  await expect(mockClient.messages.create({ messages: [{ role: "user", content: "FEL" }] } as never)).rejects.toThrow();
});

test("TRIP-017-R8 a refusal or an answer with nothing gives null, an answer cut off at the limit is shown as far as it goes", async () => {
  vi.spyOn(console, "log").mockImplementation(() => {});
  expect(await askAgneta(question, clientOf(reply([], "refusal")).client)).toBeNull();
  expect(await askAgneta(question, clientOf(reply([{ type: "text", text: "  " }])).client)).toBeNull();
  expect(await askAgneta(question, clientOf(reply([{ type: "text", text: "Avbru" }], "max_tokens")).client)).toBe("Avbru");
});

test("TRIP-033-R4 an answer that stopped at the limit is cut at the last whole bullet and the event is logged", async () => {
  const log = vi.spyOn(console, "log").mockImplementation(() => {});
  const text = "- [A](/charter/a): Ett.\n  - ARN, från 100 kr per person\n- [B](/charter/b";
  expect(await askAgneta(question, clientOf(reply([{ type: "text", text }], "max_tokens")).client)).toBe("- [A](/charter/a): Ett.\n  - ARN, från 100 kr per person");
  expect(log).toHaveBeenCalledWith("chat cut at the token limit", JSON.stringify(usage));
  expect(await askAgneta(question, clientOf(reply([{ type: "text", text }])).client)).toBe(text); // inte kapad: oförändrad
});

test("TRIP-017-R8 an API failure is thrown to the route", async () => {
  const failing = { messages: { create: vi.fn(async () => Promise.reject(new Error("boom"))) } } as never;
  await expect(askAgneta(question, failing)).rejects.toThrow("boom");
});

test("TRIP-017-R8 the 10 first questions within 5 minutes are counted, the 11th is locked", async () => {
  expect(CHAT_LIMIT).toEqual({ max: 10, windowMs: 5 * MINUTE_MS, fixedWindow: true });
  const now = 1_800_000_000_000;
  for (let i = 0; i < 10; i++) expect(await registerAttempt("api:chat:9.9.9.9", CHAT_LIMIT, now + i * 1000)).toBeNull();
  const locked = await registerAttempt("api:chat:9.9.9.9", CHAT_LIMIT, now + 10_000);
  expect(locked?.msLeft).toBeGreaterThan(0);
  expect(await registerAttempt("api:chat:9.9.9.9", CHAT_LIMIT, now + CHAT_LIMIT.windowMs)).toBeNull();
});
