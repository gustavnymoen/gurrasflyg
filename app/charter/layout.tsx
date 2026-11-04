import Chat from "../components/Chat";

// Chatten med Agneta finns på alla sidor under /charter (TRIP-017-R7)
export default function CharterLayout({ children }: LayoutProps<"/charter">) {
  return (
    <>
      {children}
      <Chat />
    </>
  );
}
