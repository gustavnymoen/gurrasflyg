import {
  type BookingLeg,
  type Contact,
  fieldIds,
  isAdult,
  isBeer,
  MAX_ADDONS,
  MAX_AGE,
  MIN_AGE,
  type PassengerLeg,
  type Person,
  QUESTIONS,
  seatPrice,
} from "@/lib/booking-rules";
import { formatPrice } from "@/lib/format";
import Link from "next/link";
import { buttonClass } from "../../components/Button";
import Card from "../../components/Card";
import Checkbox from "../../components/Checkbox";
import Field, { fieldInputClass } from "../../components/Field";
import RoundButton from "../../components/RoundButton";

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

// Säger att klasserna är valda i steget Plan och klass, med länken dit, och vilka tillägg som
// togs bort när besökaren ändrade dem där (TRIP-041-R1, R2, TRIP-039-R8). Flyg och charter har samma ruta.
export function ClassesNote({ removed, planHref }: { removed: string[]; planHref: string }) {
  return (
    <div className="flex flex-col items-start gap-3">
      <p className="text-small text-ink-muted">Klasserna är valda i steget Plan och klass och går inte att ändra här.</p>
      {/* Alltid på sidan, så att skärmläsare läser texten när den kommer; tom tar den ingen plats */}
      <div role="status" className={removed.length > 0 ? "flex flex-col gap-1 text-small font-medium" : "sr-only"}>
        {removed.length > 0 && <p>Dessa tillägg togs bort eftersom klasserna ändrats:</p>}
        {removed.length > 0 && (
          <ul className="list-disc pl-5">
            {removed.map((text) => (
              <li key={text}>{text}</li>
            ))}
          </ul>
        )}
      </div>
      <Link href={planHref} className={buttonClass("secondary")}>
        Ändra plan och klasser
      </Link>
    </div>
  );
}

// En resenärs klass på en resa som text, och tilläggen som går att köpa i den. Klassen är vald i
// steget Plan och klass och går inte att ändra här (TRIP-041-R1, TRIP-039-R8). Flyg och charter har samma grupp.
export function LegFields({
  leg,
  title,
  passengerLeg,
  age,
  onCount,
}: {
  leg: BookingLeg;
  title: string;
  passengerLeg: PassengerLeg;
  age: string;
  onCount: (addonId: number, count: number) => void;
}) {
  const cabinClass = leg.aircraft.classes.find((c) => c.id === passengerLeg.classId);
  return (
    <fieldset className="flex flex-col gap-3 border-t border-line pt-4">
      <legend className="float-left mb-3 w-full font-bold">{title}</legend>
      <p>
        Klass: <strong>{cabinClass?.name}</strong>, {formatPrice(seatPrice(leg, passengerLeg.classId))}
      </p>
      <AddonList leg={leg} passengerLeg={passengerLeg} age={age} onCount={onCount} />
    </fieldset>
  );
}

// Tilläggen som går att köpa i resenärens klass på en resa, med − och + för antalet (TRIP-012-R3).
// Öl bara från 18 år (TRIP-029-R3). Flyg och charter (TRIP-039-R4) har samma lista.
export function AddonList({
  leg,
  passengerLeg,
  age,
  onCount,
}: {
  leg: BookingLeg;
  passengerLeg: PassengerLeg;
  age: string;
  onCount: (addonId: number, count: number) => void;
}) {
  const addons = leg.addons[passengerLeg.classId] ?? [];
  if (addons.length === 0) return <p className="text-small text-ink-muted">Inga tillägg i den här klassen.</p>;
  return (
    <ul aria-label={`Tillägg på ${leg.of}`} className="flex flex-col divide-y divide-line">
      {addons.map((addon) => {
        const count = passengerLeg.addons[addon.id] ?? 0;
        const tooYoung = isBeer(addon) && !isAdult(age);
        return (
          <li key={addon.id} className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 py-3 first:pt-0">
            <div className="flex min-w-0 flex-col gap-0.5">
              <span className="font-bold">{addon.name}</span>
              <span className="text-small text-ink-muted">{addon.description}</span>
              <span className="text-small">{formatPrice(addon.price)} / st</span>
              {tooYoung && <span className="text-small text-ink-muted">Från 18 år</span>}
            </div>
            <div className="flex items-center gap-3">
              <RoundButton label={`Färre ${addon.name}`} disabled={count === 0} onClick={() => onCount(addon.id, count - 1)}>
                −
              </RoundButton>
              {/* Antalet läses upp när det ändras */}
              <span aria-live="polite" className="w-6 text-center text-lg font-bold tabular-nums">
                {count}
                <span className="sr-only"> {addon.name}</span>
              </span>
              <RoundButton
                label={`Fler ${addon.name}`}
                disabled={count >= MAX_ADDONS || tooYoung}
                onClick={() => onCount(addon.id, count + 1)}
              >
                +
              </RoundButton>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
