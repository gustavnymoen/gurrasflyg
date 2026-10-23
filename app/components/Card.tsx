// Kort som "poppar" ut från bakgrunden: samma kant som fälten och djup
// skugga med ett svagt vinrött sken (DESIGN.md)

const look = "border border-line-strong bg-surface shadow-card";
// default: startsidan och inloggningen, compact: adminsidan, flush: utan
// marginal, när innehållet fyller kortet (flygkorten, där hela kortet är en knapp)
const sizes = { default: "rounded-card p-6", compact: "rounded-card-compact p-4", flush: "rounded-card-compact" };

// Det som svävar ovanför sidan: förslagslistor och dialoger
export const floatClass = "border border-line bg-surface-float shadow-float";
// Ett kort som svävar, t.ex. en dialog
export const floatingCardClass = `${sizes.default} ${floatClass}`;

export default function Card({
  size = "default",
  className = "",
  children,
}: {
  size?: keyof typeof sizes;
  className?: string;
  children: React.ReactNode;
}) {
  return <section className={`${sizes[size]} ${look} ${className}`}>{children}</section>;
}
