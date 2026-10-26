import { expect, test } from "vitest";
import { parseBlocks, parseInline } from "./markdown";

test("TRIP-013-R7 a text is split into paragraphs and lists", () => {
  expect(parseBlocks("First.\n- one\n- two\n\nLast.")).toEqual([
    { type: "paragraph", text: "First." },
    { type: "list", items: ["one", "two"] },
    { type: "paragraph", text: "Last." },
  ]);
});

test("TRIP-013-R7 bold text is marked and nothing is turned into HTML", () => {
  expect(parseInline("**Train:** from <b>BER</b>")).toEqual([
    { text: "Train:", bold: true },
    { text: " from <b>BER</b>", bold: false },
  ]);
});
