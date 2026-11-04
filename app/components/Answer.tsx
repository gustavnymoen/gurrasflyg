import Link from "next/link";
import { parseAnswer, parseInline } from "@/lib/markdown";

// Agnetas svar: stycken, listor med underlistor och fet text som vanlig text, och länkar bara
// inom sajten (lib/markdown.ts). Aldrig HTML (TRIP-032-R2).
export default function Answer({ text }: { text: string }) {
  return (
    <div className="flex flex-col gap-2">
      {parseAnswer(text).map((block, i) =>
        block.type === "paragraph" ? (
          <p key={i}>
            <Inline text={block.text} />
          </p>
        ) : (
          <ul key={i} className="flex list-disc flex-col gap-1 pl-5">
            {block.items.map((item, j) => (
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
        ),
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
