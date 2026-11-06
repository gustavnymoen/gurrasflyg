// En rad i en lista med uppgifter (<dl>): "Flygnummer  SK1122" (avgångskorten, TRIP-043)
export default function Detail({ term, children }: { term: string; children: React.ReactNode }) {
  return (
    <>
      <dt className="text-ink-muted">{term}</dt>
      <dd>{children}</dd>
    </>
  );
}
