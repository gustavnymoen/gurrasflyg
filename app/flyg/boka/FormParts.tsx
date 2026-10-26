import {
  type Contact,
  fieldIds,
  MAX_AGE,
  MIN_AGE,
  type Person,
  QUESTIONS,
} from "@/lib/booking-rules";
import Card from "../../components/Card";
import Checkbox from "../../components/Checkbox";
import Field, { fieldInputClass } from "../../components/Field";

// Delarna av formuläret för resenärerna som flygbokningen (TRIP-012) och
// charterbokningen (TRIP-014) har gemensamma: namn och ålder, kontaktpersonen
// och de tre frågorna, med samma fält, kontroller och meddelanden.

// Felet för ett fält (fältets id), eller null
export type ErrorOf = (id: string) => string | null;

// Namn och ålder för resenär nummer index (från 0) (TRIP-012-R2)
export function PersonFields({
  index,
  person,
  error,
  onChange,
}: {
  index: number;
  person: Person;
  error: ErrorOf;
  onChange: (changed: Partial<Person>) => void;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <TextField
        id={fieldIds.firstName(index)}
        label="Förnamn"
        value={person.firstName}
        error={error(fieldIds.firstName(index))}
        onChange={(firstName) => onChange({ firstName })}
      />
      <TextField
        id={fieldIds.lastName(index)}
        label="Efternamn"
        value={person.lastName}
        error={error(fieldIds.lastName(index))}
        onChange={(lastName) => onChange({ lastName })}
      />
      <Field label="Ålder" htmlFor={fieldIds.age(index)} error={error(fieldIds.age(index))}>
        <select
          id={fieldIds.age(index)}
          required
          value={person.age}
          aria-invalid={error(fieldIds.age(index)) ? true : undefined}
          aria-describedby={error(fieldIds.age(index)) ? `${fieldIds.age(index)}-error` : undefined}
          onChange={(e) => onChange({ age: e.target.value })}
          className={fieldInputClass}
        >
          <option value="">Välj</option>
          {Array.from({ length: MAX_AGE - MIN_AGE + 1 }, (_, i) => String(MIN_AGE + i)).map((age) => (
            <option key={age} value={age}>
              {age} år
            </option>
          ))}
        </select>
      </Field>
    </div>
  );
}

// Kontaktpersonen (TRIP-012-R5)
export function ContactCard({
  contact,
  error,
  onChange,
}: {
  contact: Contact;
  error: ErrorOf;
  onChange: (contact: Contact) => void;
}) {
  return (
    <Card labelledBy="kontakt" className="flex flex-col gap-4">
      <h2 id="kontakt" className="text-section font-bold">
        Kontaktperson
      </h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {(
          [
            ["firstName", "Förnamn", "text", "given-name"],
            ["lastName", "Efternamn", "text", "family-name"],
            ["email", "E-post", "email", "email"],
            ["phone", "Telefon", "tel", "tel"],
          ] as const
        ).map(([field, label, type, autoComplete]) => (
          <TextField
            key={field}
            id={fieldIds.contact(field)}
            label={label}
            type={type}
            autoComplete={autoComplete}
            value={contact[field]}
            error={error(fieldIds.contact(field))}
            onChange={(value) => onChange({ ...contact, [field]: value })}
          />
        ))}
        <TextField
          id={fieldIds.contact("address")}
          label="Adress"
          autoComplete="street-address"
          value={contact.address}
          error={error(fieldIds.contact("address"))}
          onChange={(value) => onChange({ ...contact, address: value })}
          className="sm:col-span-2"
        />
      </div>
    </Card>
  );
}

// De tre frågorna som måste kryssas i (TRIP-012-R6)
export function QuestionsCard({
  checks,
  error,
  onChange,
}: {
  checks: boolean[];
  error: ErrorOf;
  onChange: (checks: boolean[]) => void;
}) {
  return (
    <Card labelledBy="fragor" className="flex flex-col gap-4">
      <h2 id="fragor" className="text-section font-bold">
        Tre viktiga frågor
      </h2>
      {QUESTIONS.map((question, i) => (
        <Checkbox
          key={question}
          id={fieldIds.question(i)}
          label={question}
          checked={checks[i] ?? false}
          error={error(fieldIds.question(i))}
          onChange={(checked) => onChange(QUESTIONS.map((_, j) => (j === i ? checked : !!checks[j])))}
        />
      ))}
    </Card>
  );
}

// Ett textfält med etikett och ett eventuellt fel under (R2, R5)
export function TextField({
  id,
  label,
  value,
  error,
  onChange,
  type = "text",
  autoComplete = "off",
  className = "",
}: {
  id: string;
  label: string;
  value: string;
  error: string | null;
  onChange: (value: string) => void;
  type?: "text" | "email" | "tel";
  autoComplete?: string;
  className?: string;
}) {
  return (
    <Field label={label} htmlFor={id} error={error} className={className}>
      <input
        id={id}
        type={type}
        required
        autoComplete={autoComplete}
        value={value}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        onChange={(e) => onChange(e.target.value)}
        className={fieldInputClass}
      />
    </Field>
  );
}
