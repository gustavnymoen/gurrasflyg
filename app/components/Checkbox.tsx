// Kryssruta i designens stil: själva <input> ritas om (appearance-none), så att
// den fortfarande går att klicka på, tabba till och läsa upp som vanligt
export default function Checkbox({
  label,
  checked,
  onChange,
  className = "",
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
}) {
  return (
    <label
      className={`inline-flex cursor-pointer items-center gap-2.5 text-[15px] text-ink-muted has-checked:text-ink ${className}`}
    >
      <span className="relative grid place-items-center">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border-[1.5px] border-line-strong transition-colors duration-160 checked:border-accent checked:bg-accent"
        />
        <svg
          viewBox="0 0 12 12"
          aria-hidden="true"
          className="pointer-events-none absolute hidden h-3 w-3 fill-none stroke-on-accent stroke-2 peer-checked:block"
        >
          <path d="M2.5 6.5l2.5 2.5 4.5-5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      {label}
    </label>
  );
}
