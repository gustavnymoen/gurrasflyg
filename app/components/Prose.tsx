import { parseBlocks, parseInline } from "@/lib/markdown";

// En text ur kursdatan: stycken, punktlistor och fet text som vanlig text (lib/markdown.ts)
export default function Prose({ markdown }: { markdown: string }) {
  return (
    <div className="flex max-w-prose flex-col gap-3">
      {parseBlocks(markdown).map((block, i) =>
        block.type === "paragraph" ? (
          <p key={i}>
            <Inline text={block.text} />
          </p>
        ) : (
          <ul key={i} className="flex list-disc flex-col gap-2 pl-5">
            {block.items.map((item) => (
              <li key={item}>
                <Inline text={item} />
              </li>
            ))}
          </ul>
        ),
      )}
    </div>
  );
}

function Inline({ text }: { text: string }) {
  return parseInline(text).map((part, i) =>
    part.bold ? (
      <strong key={i} className="font-bold">
        {part.text}
      </strong>
    ) : (
      part.text
    ),
  );
}
