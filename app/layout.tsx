import type { Metadata } from "next";
import { Bricolage_Grotesque } from "next/font/google";
import Link from "next/link";
import { Suspense } from "react";
import { AbortButton, StartLink } from "./components/AbortFlow";
import PhotoCredit from "./components/PhotoCredit";
import Wordmark from "./components/Wordmark";
import "./globals.css";

// Ett typsnitt för hela sajten. Variabeln används av --font-display och
// --font-body i globals.css. "opsz" gör att stora rubriker får tätare former.
const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  axes: ["opsz"],
});

export const metadata: Metadata = {
  title: "Gurras Flyg",
  description: "Boka flyg hos Gurras Flyg",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="sv" className={`${bricolage.variable} h-full antialiased`}>
      {/* isolate: startsidans foto kan ligga bakom sidhuvudet (-z-10) men framför bakgrunden */}
      <body className="relative isolate flex min-h-full flex-col">
        <header className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-4 pt-5 md:pt-7">
          {/* Delarna som läser adressen byggs om för en sida med dynamisk adress, t.ex. /charter/<id>:
              de ligger i egna Suspense så att resten av sidan kan visas direkt */}
          <Suspense>
            <Wordmark />
          </Suspense>
          <Suspense>
            <AbortButton />
          </Suspense>
        </header>
        {children}
        <footer className="mt-auto border-t border-line px-4 py-6">
          <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-x-6 gap-y-2 text-small text-ink-muted">
            <span>© Gurras Flyg</span>
            <Suspense>
              <PhotoCredit />
            </Suspense>
            <nav className="flex gap-6">
              <Suspense>
                <StartLink className="hover:text-ink">Start</StartLink>
              </Suspense>
              <Link href="/admin" className="hover:text-ink">
                Admin
              </Link>
            </nav>
          </div>
        </footer>
      </body>
    </html>
  );
}
