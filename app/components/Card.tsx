// Kort som "poppar" ut från bakgrunden: tunn mässingstonad kant och djup
// skugga med ett svagt vinrött sken (DESIGN.md)

const look = "border border-edge bg-surface shadow-card";
export const cardClass = `rounded-card p-6 ${look}`;
export const compactCardClass = `rounded-card-compact p-4 ${look}`;

export default function Card({ className = "", children }: { className?: string; children: React.ReactNode }) {
  return <section className={`${cardClass} ${className}`}>{children}</section>;
}
