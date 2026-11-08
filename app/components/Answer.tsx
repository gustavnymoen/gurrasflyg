"use client";

import Link from "next/link";
import { useState } from "react";
import { foldList, parseAnswer, parseInline } from "@/lib/markdown";
import Button from "./Button";

// Agnetas svar: stycken, listor med underlistor och fet text som vanlig text, och länkar bara
// inom sajten (lib/markdown.ts). Aldrig HTML (TRIP-032-R2). En lista med fler än tre punkter viker
// resten bakom "Visa mer", om inte svaret redan är hela listan (whole, TRIP-035-R6).
export default function Answer({ text, whole = false }: { text: string; whole?: boolean }) {
  return (
    <div className="flex flex-col gap-2">
      {parseAnswer(text).map((block, i) =>
        block.type === "paragraph" ? (
          <p key={i}>
            <Inline text={block.text} />
          </p>
        ) : (
          <List key={i} items={block.items} whole={whole} />
        ),
      )}
    </div>
  );
}

function List({ items, whole }: { items: { text: string; sub: string[] }[]; whole: boolean }) {
  const [open, setOpen] = useState(false);
  const { shown, folded } = foldList(items, whole || open);
  return (
    <div className="flex flex-col gap-2">
      <ul className="flex list-disc flex-col gap-1 pl-5">
        {shown.map((item, j) => (
          <li key={j}>
            <Inline text={item.text} />
            {item.sub.length > 0 && (
              <ul className="mt-1 flex list-[circle] flex-col gap-1 pl-5">
                {item.sub.map((sub, k) => (
                  <li key={k}>
                    <Inline text={sub} />
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
      {/* open: knappen ska vara kvar efter uppvikningen, då folded är 0 */}
      {!whole && (folded > 0 || open) && (
        <Button size="compact" variant="secondary" className="self-start" aria-expanded={open} onClick={() => setOpen(!open)}>
          {open ? "Visa mindre" : "Visa mer"}
        </Button>
      )}
    </div>
  );
}

function Inline({ text }: { text: string }) {
  return parseInline(text).map((part, i) => {
    const content = part.bold ? <strong className="font-bold">{part.text}</strong> : part.text;
    return part.href ? (
      <Link key={i} href={part.href} className="underline underline-offset-2">
        {content}
      </Link>
    ) : (
      <span key={i}>{content}</span>
    );
  });
}
