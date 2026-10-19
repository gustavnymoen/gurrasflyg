import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Gurras Flyg",
  description: "Boka flyg hos Gurras Flyg",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="sv"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        {children}
        <footer className="mt-auto border-t border-wine/30 px-4 py-6">
          <div className="mx-auto flex max-w-5xl items-center justify-between text-sm text-neutral-500">
            <span>© Gurras Flyg</span>
            <nav className="flex gap-6">
              <Link href="/" className="hover:text-wine-light">
                Start
              </Link>
              <Link href="/admin" className="hover:text-wine-light">
                Admin
              </Link>
            </nav>
          </div>
        </footer>
      </body>
    </html>
  );
}
