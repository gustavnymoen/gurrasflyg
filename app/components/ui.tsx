// Gemensamma byggstenar och stilar så att alla sidor ser likadana ut

const fieldBase =
  "rounded-lg border-2 border-wine bg-neutral-900 placeholder:text-neutral-500 outline-none focus:border-wine-light";

const fieldHeights = { large: "h-14 px-4", small: "h-11 px-4", tiny: "h-9 px-3" };

// Stil för ett fält med given höjd och bredd. Bredd och höjd får inte läggas
// till i efterhand (t.ex. `${smallInputClass} w-24`), då krockar de med w-full.
export function fieldClass(size: keyof typeof fieldHeights, width = "w-full") {
  return `${fieldHeights[size]} ${width} ${fieldBase}`;
}

// Stora fält (startsidan) och mindre fält (admin), i full bredd
export const inputClass = fieldClass("large");
export const smallInputClass = fieldClass("small");
export const textareaClass = `min-h-20 w-full px-4 py-2 ${fieldBase}`;

// Döljer pilarna upp/ner i sifferfält
export const noSpinnerClass =
  "[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none";

export const primaryButtonClass =
  "h-11 rounded-lg bg-wine px-5 font-medium text-white transition-colors hover:bg-wine-light disabled:cursor-not-allowed disabled:opacity-50";
export const secondaryButtonClass =
  "h-11 rounded-lg border-2 border-wine px-5 font-medium transition-colors hover:bg-wine/20 disabled:cursor-not-allowed disabled:opacity-50";

// Ruta med vinröd kant och skugga som får innehållet att "poppa" ut från bakgrunden
export const cardClass =
  "rounded-2xl border border-wine/50 bg-[#1f1f23] p-6 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9),0_0_45px_-12px_rgba(176,40,79,0.55)]";

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
  onClick,
  children,
}: {
  label: string;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-wine text-xl leading-none transition-colors hover:bg-wine disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent"
    >
      {children}
    </button>
  );
}

// Felmeddelande eller bekräftelse
export function Alert({ kind, children }: { kind: "error" | "success"; children: React.ReactNode }) {
  const style =
    kind === "error"
      ? "border-wine bg-wine/20 text-wine-light"
      : "border-emerald-700/70 bg-emerald-900/20 text-emerald-300";
  return (
    <p role={kind === "error" ? "alert" : "status"} className={`rounded-lg border-2 px-4 py-3 font-medium ${style}`}>
      {children}
    </p>
  );
}
