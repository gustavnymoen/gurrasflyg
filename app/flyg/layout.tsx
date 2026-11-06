import Chat from "../components/Chat";

// Chatten med Agneta finns på alla sidor under /flyg (TRIP-036-R1), som under /charter
export default function FlightLayout({ children }: LayoutProps<"/flyg">) {
  return (
    <>
      {children}
      <Chat />
    </>
  );
}
