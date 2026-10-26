import { ACCESS_NAMES, CATEGORY_NAMES, swedishName } from "@/lib/destination-names";

// Varje kategori och varje tillträde har en egen dämpad färg (TRIP-013-R5).
// Tonen (hue, grader på färgcirkeln) styr både bakgrund och text i taggen, se
// "tag" i globals.css. Betydelsen står alltid också i texten.
const HUES: Record<string, number> = {
  "Ghost town or village": 300,
  "Industrial site": 60,
  "Military or Cold War site": 150,
  "Abandoned resort or hotel": 20,
  "Hospital or sanatorium": 200,
  Prison: 260,
  "Monument or memorial": 100,
  "Disused railway": 40,
  "Amusement park or Olympic site": 340,
  "Wreck or film set": 230,
  Underground: 120,
  "Castle or mansion": 0,
  "Abandoned public building": 80,
  Open: 170,
  "Guided tour": 215,
  "Open on set days": 55,
  "Exterior only": 285,
  Closed: 10,
};

export default function DestinationTag({ kind, value }: { kind: "category" | "access"; value: string }) {
  const names = kind === "category" ? CATEGORY_NAMES : ACCESS_NAMES;
  return (
    <span className="tag rounded-md px-2 py-0.5 text-xs font-semibold" style={{ "--hue": HUES[value] ?? 0 } as React.CSSProperties}>
      {swedishName(names, value)}
    </span>
  );
}
