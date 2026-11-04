import { expect, test } from "vitest";
import { parseAnswer, parseBlocks, parseInline } from "./markdown";

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

test("TRIP-032-R2 a link to a destination page is a link, and any other link or HTML stays plain text", () => {
  expect(parseInline("Se [Teufelsberg](/charter/teufelsberg) nu")).toEqual([
    { text: "Se ", bold: false },
    { text: "Teufelsberg", bold: false, href: "/charter/teufelsberg" },
    { text: " nu", bold: false },
  ]);
  for (const text of ["[x](https://example.com)", "[x](//example.com)", "[x](javascript:alert(1))", "[x](/admin)", "<a href='/charter/a'>x</a>"]) {
    expect(parseInline(text), text).toEqual([{ text, bold: false }]);
  }
});

test("TRIP-032-R2 an answer has paragraphs, a list with sub-lists, and bold text", () => {
  expect(parseAnswer("Tre förslag:\n- **Berlin**\n  - flyger till BER\n  - från 780 kr\n- Prag\n\nSlut.")).toEqual([
    { type: "paragraph", text: "Tre förslag:" },
    {
      type: "list",
      items: [
        { text: "**Berlin**", sub: ["flyger till BER", "från 780 kr"] },
        { text: "Prag", sub: [] },
      ],
    },
    { type: "paragraph", text: "Slut." },
  ]);
});
