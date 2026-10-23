// Fält: nedsänkt yta, kant som syns (3:1), accentkant och ring vid fokus,
// röd kant vid fel (DESIGN.md)
import Message from "./Message";

const look = "rounded-field border-[1.5px] bg-surface-sunk transition-[border-color,box-shadow] duration-160";

// Kantfärgen väljs här, inte genom att lägga en klass ovanpå en annan: två
// border-färger i samma className avgörs av ordningen i CSS:en, inte i texten.
// Klasserna står utskrivna i sin helhet, annars hittar Tailwind dem inte.
// "focus" för ett fristående fält, "within" för rutan i en <Field>.
const borders = {
  focus: {
    normal: "border-line-strong focus:border-accent-strong focus:ring-3 focus:ring-accent-glow",
    error: "border-danger focus:ring-3 focus:ring-accent-glow",
  },
  within: {
    normal: "border-line-strong focus-within:border-accent-strong focus-within:ring-3 focus-within:ring-accent-glow",
    error: "border-danger focus-within:ring-3 focus-within:ring-accent-glow",
  },
  // Rutan ser fokuserad ut fast fokus är någon annanstans, t.ex. i kalendern
  active: {
    normal: "border-accent-strong ring-3 ring-accent-glow",
    error: "border-danger ring-3 ring-accent-glow",
  },
};

function borderLook(error: boolean, focus: keyof typeof borders) {
  return borders[focus][error ? "error" : "normal"];
}

// large: startsidan, small: inloggning m.m., compact: adminsidan
const heights = { large: "h-14.5 px-4 text-[17px]", small: "h-11 px-4", compact: "h-9 px-2.5 text-sm" };
const areaSizes = {
  large: "min-h-24 px-4 py-3 text-[17px]",
  small: "min-h-20 px-4 py-2.5",
  compact: "min-h-16 px-2.5 py-1.5 text-sm",
};

type FieldSize = keyof typeof heights;

// Stil för ett fristående <input> eller <select> med given storlek och bredd.
// Bredden får inte läggas till i efterhand (t.ex. `${fieldClass("small")} w-24`),
// då krockar den med w-full.
export function fieldClass(size: FieldSize, width = "w-full", error = false) {
  return `${heights[size]} ${width} ${look} ${borderLook(error, "focus")} placeholder:text-ink-faint outline-none disabled:opacity-50`;
}

// Stil för ett <textarea>
export function textAreaClass(size: FieldSize, error = false) {
  return `${areaSizes[size]} w-full ${look} ${borderLook(error, "focus")} placeholder:text-ink-faint outline-none`;
}

// Fältet inuti en <Field>: rutan står för kant och fokus
export const fieldInputClass = "w-full bg-transparent outline-none placeholder:text-ink-faint";

// Fält med etiketten liten inne i rutan, ovanför värdet, och ett eventuellt
// fel under. Innehållet är ett eller flera fält med fieldInputClass.
export default function Field({
  label,
  htmlFor,
  error = null,
  className = "",
  children,
}: {
  label: string;
  // Utan htmlFor är etiketten bara text, t.ex. för en grupp knappar
  htmlFor?: string;
  error?: string | null;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <FieldBox label={label} htmlFor={htmlFor} invalid={error !== null}>
        {children}
      </FieldBox>
      {error && htmlFor && (
        <Message kind="error" id={`${htmlFor}-error`} className="mt-1.5">
          {error}
        </Message>
      )}
    </div>
  );
}

// Själva rutan i en <Field>, för fält vars fel visas någon annanstans (datumgruppen).
// Rutan är positionerad, så att en förslagslista kan läggas precis under den.
export function FieldBox({
  label,
  htmlFor,
  invalid = false,
  active = false,
  className = "",
  children,
}: {
  label: string;
  htmlFor?: string;
  invalid?: boolean;
  active?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`relative flex h-14.5 flex-col justify-center px-4 text-[17px] ${look} ${borderLook(invalid, active ? "active" : "within")} ${className}`}
    >
      {htmlFor ? (
        <label htmlFor={htmlFor} className="text-xs leading-tight text-ink-muted">
          {label}
        </label>
      ) : (
        <span aria-hidden="true" className="text-xs leading-tight text-ink-muted">
          {label}
        </span>
      )}
      {children}
    </div>
  );
}
