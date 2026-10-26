import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Charter – Gurras Flyg",
};

// Charter (TRIP-018-R3). Sidan finns så att fliken på startsidan har dit att
// länka; innehållet kommer med TRIP-013 och TRIP-014.
export default function CharterPage() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-4 pt-8 pb-16 md:pt-12">
      <h1 className="text-title-phone font-bold">Charter</h1>
    </main>
  );
}
