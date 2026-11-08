import Chat from "../components/Chat";

// Chatten med Agneta finns också på Min bokning (TRIP-037-R1)
export default function MyBookingLayout({ children }: LayoutProps<"/min-bokning">) {
  return (
    <>
      {children}
      <Chat />
    </>
  );
}
