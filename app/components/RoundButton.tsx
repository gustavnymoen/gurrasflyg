// Rund knapp för + och − (och pilar). En otillgänglig knapp är aria-disabled i
// stället för disabled, så att fokus stannar på den när den blir otillgänglig
// medan den har fokus (TECH-019-R1, WCAG 2.4.3).
export default function RoundButton({
  label,
  disabled = false,
  compact = false,
  onClick,
  className = "",
  children,
}: {
  label: string;
  disabled?: boolean;
  compact?: boolean;
  onClick: () => void;
  className?: string;
  children: React.ReactNode;
}) {
  const size = compact ? "h-7 w-7 text-base" : "h-8.5 w-8.5 text-xl";
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      aria-disabled={disabled ? true : undefined}
      onClick={disabled ? undefined : onClick}
      className={`grid ${size} shrink-0 place-items-center rounded-full border-[1.5px] border-line-strong leading-none transition-[transform,border-color] duration-160 ease-out hover:border-accent-strong active:scale-[0.92] aria-disabled:cursor-not-allowed aria-disabled:opacity-30 aria-disabled:hover:border-line-strong aria-disabled:active:scale-100 ${className}`}
    >
      {children}
    </button>
  );
}
