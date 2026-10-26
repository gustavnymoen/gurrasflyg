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

// En rad som delar av vanlig och fet text
export type Inline = { text: string; bold: boolean };

export function parseInline(text: string): Inline[] {
  return text
    .split(/\*\*(.+?)\*\*/)
    .map((part, i) => ({ text: part, bold: i % 2 === 1 }))
    .filter((part) => part.text !== "");
}
