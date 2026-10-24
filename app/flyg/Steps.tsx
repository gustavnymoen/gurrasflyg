import Link from "next/link";

// Ett steg: ett tidigare steg kan ha en länk eller en knapp tillbaka dit
export type StepItem = { label: string; href?: string; onClick?: () => void };

// Stegen i en bokning, med det aktuella markerat (TRIP-010-R8, TRIP-011-R10).
// current är det aktuella stegets plats i listan, från 0.
export default function Steps({ steps, current }: { steps: StepItem[]; current: number }) {
  return (
    <ol aria-label="Steg" className="flex flex-wrap gap-x-6 gap-y-2 text-small">
      {steps.map((s, i) => {
        const content = (
          <>
            <span
              aria-hidden="true"
              className={`grid h-6 w-6 place-items-center rounded-full border-[1.5px] tabular-nums ${
                i === current ? "border-accent-strong" : "border-line-strong"
              }`}
            >
              {i + 1}
            </span>
            {s.label}
          </>
        );
        const look = "flex items-center gap-2";
        const back = "rounded-pill underline-offset-4 hover:text-ink hover:underline";
        return (
          <li
            key={s.label}
            aria-current={i === current ? "step" : undefined}
            className={i === current ? "font-bold text-ink" : "text-ink-muted"}
          >
            {i < current && s.href ? (
              <Link href={s.href} className={`${look} ${back}`}>
                {content}
              </Link>
            ) : i < current && s.onClick ? (
              <button type="button" onClick={s.onClick} className={`${look} ${back}`}>
                {content}
              </button>
            ) : (
              <span className={look}>{content}</span>
            )}
          </li>
        );
      })}
    </ol>
  );
}
