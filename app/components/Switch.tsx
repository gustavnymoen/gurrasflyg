// Strömbrytare för ett val som är på eller av, t.ex. "Tur och retur".
// En knapp med role="switch", så att skärmläsare säger "på" eller "av".
export default function Switch({
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
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`inline-flex min-h-6 cursor-pointer items-center gap-2.5 text-[15px] text-ink-muted aria-checked:text-ink ${className}`}
    >
      {label}
      <span
        aria-hidden="true"
        className={`relative h-5 w-9 shrink-0 rounded-pill border-[1.5px] transition-colors duration-160 ${
          checked ? "border-accent bg-accent" : "border-line-strong"
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 h-3 w-3 rounded-full transition-transform duration-160 ease-out ${
            checked ? "translate-x-4 bg-on-accent" : "bg-ink-muted"
          }`}
        />
      </span>
    </button>
  );
}
