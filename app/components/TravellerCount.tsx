import { MAX_TRAVELLERS, MIN_TRAVELLERS } from "@/lib/search";
import Field from "./Field";
import RoundButton from "./RoundButton";

// Antal resenärer med Färre och Fler, i sökformulären för flyg och charter
export default function TravellerCount({
  value,
  onChange,
  className,
}: {
  value: number;
  onChange: (value: number) => void;
  className?: string;
}) {
  return (
    // Etiketten syns i rutan; gruppens namn säger vad siffran är
    <Field label="Resenärer" className={className}>
      <div role="group" aria-label="Antal resenärer">
        <span className="tabular-nums">{value}</span>
        {/* Knapparna mitt i rutans höjd, till höger om etikett och siffra */}
        <div className="absolute inset-y-0 right-3 flex items-center gap-2">
          <RoundButton label="Färre resenärer" disabled={value <= MIN_TRAVELLERS} onClick={() => onChange(value - 1)}>
            −
          </RoundButton>
          <RoundButton label="Fler resenärer" disabled={value >= MAX_TRAVELLERS} onClick={() => onChange(value + 1)}>
            +
          </RoundButton>
        </div>
      </div>
    </Field>
  );
}
