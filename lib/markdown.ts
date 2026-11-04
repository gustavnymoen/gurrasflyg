// Resmålens texter är Markdown med bara stycken, punktlistor och **fet text**.
// De tolkas här till delar som sidan visar som vanlig text, aldrig som HTML
// (TRIP-013), så att inget i texten kan bli kod på sidan.

export type Block = { type: "paragraph"; text: string } | { type: "list"; items: string[] };

export function parseBlocks(markdown: string): Block[] {
  const blocks: Block[] = [];
  for (const line of markdown.split("\n").map((l) => l.trim()).filter(Boolean)) {
    const item = line.match(/^- (.*)$/);
    const last = blocks.at(-1);
    if (!item) blocks.push({ type: "paragraph", text: line });
    else if (last?.type === "list") last.items.push(item[1]);
    else blocks.push({ type: "list", items: [item[1]] });
  }
  return blocks;
}

// En rad som delar av vanlig text, fet text och länkar. Bara länkar till ett resmåls sida
// (/charter/<id>) blir länkar; all annan text, också andra länkar, förblir vanlig text (TRIP-032-R2).
export type Inline = { text: string; bold: boolean; href?: string };

const INLINE = /\*\*(.+?)\*\*|\[([^\]]+)\]\((\/charter\/[a-z0-9-]+)\)/g;

export function parseInline(text: string): Inline[] {
  const parts: Inline[] = [];
  let from = 0;
  for (const m of text.matchAll(INLINE)) {
    if (m.index > from) parts.push({ text: text.slice(from, m.index), bold: false });
    parts.push(m[1] !== undefined ? { text: m[1], bold: true } : { text: m[2], bold: false, href: m[3] });
    from = m.index + m[0].length;
  }
  if (from < text.length) parts.push({ text: text.slice(from), bold: false });
  return parts;
}

// Ett svar från Agneta: som Markdown ovan, men en punkt kan ha underpunkter (indragen rad)
export type AnswerBlock = { type: "paragraph"; text: string } | { type: "list"; items: { text: string; sub: string[] }[] };

export function parseAnswer(markdown: string): AnswerBlock[] {
  const blocks: AnswerBlock[] = [];
  for (const line of markdown.split("\n").filter((l) => l.trim() !== "")) {
    const item = line.match(/^(\s*)[-*] (.*)$/);
    const last = blocks.at(-1);
    if (!item) blocks.push({ type: "paragraph", text: line.trim() });
    else if (last?.type !== "list") blocks.push({ type: "list", items: [{ text: item[2], sub: [] }] });
    else if (item[1] !== "") last.items.at(-1)!.sub.push(item[2]);
    else last.items.push({ text: item[2], sub: [] });
  }
  return blocks;
}
