// Fel eller bekräftelse: färgad text utan ruta. Fel läses upp direkt av
// skärmläsare (alert), bekräftelser när det passar (status).
export default function Message({
  kind,
  id,
  className = "",
  children,
}: {
  kind: "error" | "success";
  id?: string;
  className?: string;
  children: React.ReactNode;
}) {
  const color = kind === "error" ? "text-danger" : "text-success";
  return (
    <p id={id} role={kind === "error" ? "alert" : "status"} className={`text-small font-medium ${color} ${className}`}>
      {children}
    </p>
  );
}
