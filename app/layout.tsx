import type { Metadata } from "next";
import { Bricolage_Grotesque } from "next/font/google";
import Link from "next/link";
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
      <body className="min-h-full flex flex-col">
        {children}
        <footer className="mt-auto border-t border-line px-4 py-6">
          <div className="mx-auto flex max-w-5xl items-center justify-between text-small text-ink-muted">
            <span>© Gurras Flyg</span>
            <nav className="flex gap-6">
              <Link href="/" className="hover:text-ink">
                Start
              </Link>
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
