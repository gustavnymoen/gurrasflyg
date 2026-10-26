import type { SortBy } from "@/lib/flight-rules";

// Sortering på avgångstid eller pris (R7): två radioknappar som ser ut som en knappgrupp
export default function SortChoice({ value, onChange }: { value: SortBy; onChange: (sortBy: SortBy) => void }) {
  const options: { value: SortBy; label: string }[] = [
    { value: "time", label: "Avgångstid" },
    { value: "price", label: "Pris" },
  ];
  return (
    <fieldset className="flex items-center gap-3">
      <legend className="float-left mr-3 text-small text-ink-muted">Sortera på</legend>
      <div className="flex rounded-pill border-[1.5px] border-line-strong p-1">
        {options.map((o) => (
          <label
            key={o.value}
            className={`cursor-pointer rounded-pill px-3.5 py-1.5 text-sm font-bold transition-colors duration-160 has-focus-visible:outline-2 has-focus-visible:outline-offset-1 has-focus-visible:outline-accent-strong ${
              value === o.value ? "bg-accent text-on-accent" : "text-ink-muted hover:text-ink"
            }`}
          >
            <input
              type="radio"
              name="sort"
              value={o.value}
              checked={value === o.value}
              onChange={() => onChange(o.value)}
              className="sr-only"
            />
            {o.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
