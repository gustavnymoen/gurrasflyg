// Gemensamma byggstenar och stilar så att alla sidor ser likadana ut

const fieldBase =
  "rounded-lg border-2 border-wine bg-neutral-900 placeholder:text-neutral-500 outline-none focus:border-wine-light";

// large: startsidan, small: inloggning m.m., compact: adminsidan
const fieldHeights = { large: "h-14 px-4", small: "h-11 px-4", compact: "h-8 px-2.5 text-sm" };

// Stil för ett fält med given höjd och bredd. Bredd och höjd får inte läggas
// till i efterhand (t.ex. `${smallInputClass} w-24`), då krockar de med w-full.
export function fieldClass(size: keyof typeof fieldHeights, width = "w-full") {
  return `${fieldHeights[size]} ${width} ${fieldBase}`;
}

// Stora fält (startsidan) och mindre fält (admin), i full bredd
export const inputClass = fieldClass("large");
export const smallInputClass = fieldClass("small");

// Kompakta varianter för adminsidan
export const compactInputClass = fieldClass("compact");
export const compactTextareaClass = `min-h-16 w-full px-2.5 py-1.5 text-sm ${fieldBase}`;

// Döljer pilarna upp/ner i sifferfält
export const noSpinnerClass =
  "[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none";

export const primaryButtonClass =
  "h-11 rounded-lg bg-wine px-5 font-medium text-white transition-colors hover:bg-wine-light disabled:cursor-not-allowed disabled:opacity-50";
export const secondaryButtonClass =
  "h-11 rounded-lg border-2 border-wine px-5 font-medium transition-colors hover:bg-wine/20 disabled:cursor-not-allowed disabled:opacity-50";
export const compactPrimaryButtonClass =
  "h-8 rounded-md bg-wine px-3 text-sm font-medium text-white transition-colors hover:bg-wine-light disabled:cursor-not-allowed disabled:opacity-50";
export const compactSecondaryButtonClass =
  "h-8 rounded-md border border-wine px-3 text-sm font-medium transition-colors hover:bg-wine/20 disabled:cursor-not-allowed disabled:opacity-50";

// Ruta med vinröd kant och skugga som får innehållet att "poppa" ut från bakgrunden
const cardLook =
  "border border-wine/50 bg-[#1f1f23] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_45px_-12px_rgba(176,40,79,0.55)]";
export const cardClass = `rounded-2xl p-6 ${cardLook}`;
export const compactCardClass = `rounded-xl p-4 ${cardLook}`;

export function Card({
  title,
  className = "",
  children,
}: {
  title?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section className={`${cardClass} ${className}`}>
      {title && <h2 className="mb-4 text-xl font-semibold text-wine-light">{title}</h2>}
      {children}
    </section>
  );
}

// Rund + / − knapp
export function RoundButton({
  label,
  disabled = false,
  compact = false,
  onClick,
  children,
}: {
  label: string;
  disabled?: boolean;
  compact?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  const size = compact ? "h-7 w-7 border text-base" : "h-9 w-9 border-2 text-xl";
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
      className={`flex ${size} shrink-0 items-center justify-center rounded-full border-wine leading-none transition-colors hover:bg-wine disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent`}
    >
      {children}
    </button>
  );
}

// Felmeddelande eller bekräftelse
export function Alert({
  kind,
  compact = false,
  children,
}: {
  kind: "error" | "success";
  compact?: boolean;
  children: React.ReactNode;
}) {
  const style =
    kind === "error"
      ? "border-wine bg-wine/20 text-wine-light"
      : "border-emerald-700/70 bg-emerald-900/20 text-emerald-300";
  const size = compact ? "rounded-md border px-3 py-1.5 text-xs" : "rounded-lg border-2 px-4 py-3";
  return (
    <p role={kind === "error" ? "alert" : "status"} className={`${size} font-medium ${style}`}>
      {children}
    </p>
  );
}
