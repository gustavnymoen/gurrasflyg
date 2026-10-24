import Message from "./Message";

// Kryssruta med etikett, och ett eventuellt fel under (TRIP-012). Rutan har
// accentfärgen när den är ikryssad och samma kant som fälten annars.
export default function Checkbox({
  id,
  label,
  checked,
  onChange,
  error = null,
  describedBy,
}: {
  id: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  error?: string | null;
  // Id för en text som beskriver rutan, t.ex. ett tips
  describedBy?: string;
}) {
  const errorId = `${id}-error`;
  const description = [describedBy, error ? errorId : null].filter(Boolean).join(" ") || undefined;
  return (
    <div>
      <div className="flex items-start gap-3">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          aria-invalid={error ? true : undefined}
          aria-describedby={description}
          className={`mt-0.5 h-5 w-5 shrink-0 accent-accent-strong ${error ? "outline-2 outline-danger" : ""}`}
        />
        <label htmlFor={id}>{label}</label>
      </div>
      {error && (
        <Message kind="error" id={errorId} className="mt-1.5 ml-8">
          {error}
        </Message>
      )}
    </div>
  );
}
