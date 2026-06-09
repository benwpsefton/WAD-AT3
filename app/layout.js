import Link from "next/link";

import "./globals.css";
import LogoutButton from "./components/LogoutButton";

const navigation_links = [
  { href: "/", label: "Home" },
  { href: "/users", label: "Users" },
  { href: "/projects", label: "Projects" },
  { href: "/nasa-api", label: "NASA API" },
  { href: "/about", label: "About" },
];

export const metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  ),
  title: "API Integrated Next.js App",
  description: "A Next.js frontend for users, projects, and NASA API pages.",
  openGraph: {
    title: "MyJamJar NextJS Projects App",
    description: "A Next.js frontend for users, projects, and NASA API pages.",
    images: [
      {
        url: "/logo.png",
        width: 800,
        height: 600,
        alt: "App Logo",
      },
    ],
    siteName: "MyJamJar Next.js App",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen text-slate-950 antialiased">
        <header className="sticky top-0 z-20 border-b border-white/50 bg-white/70 backdrop-blur-xl">
          <div className="page-shell flex flex-wrap items-center justify-between gap-4 py-4 md:flex-nowrap md:gap-8">
            <Link href="/" className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-600 text-sm font-bold text-white shadow-lg shadow-teal-950/15">
                AT3
              </span>
              <span>
                <span className="block text-xs font-semibold uppercase tracking-[0.2em] text-teal-700">
                  NMTAFE Project
                </span>
                <span className="block text-lg font-semibold text-slate-950">
                  Next.js Frontend
                </span>
              </span>
            </Link>
            <nav
              className="flex flex-1 flex-wrap items-center justify-end gap-2"
              aria-label="Primary"
            >
              <div className="flex flex-wrap items-center gap-1 border-l border-slate-200 pl-4 md:gap-2 md:pl-6">
                {navigation_links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-950"
                  >
                    {link.label}
                  </Link>
                ))}
                <LogoutButton></LogoutButton>
              </div>
            </nav>
          </div>
        </header>

        <main className="page-shell py-10 md:py-14">{children}</main>

        <footer className="border-t border-slate-200/70 bg-white/60 backdrop-blur-xl">
          <div className="page-shell py-6 text-center text-sm text-slate-500">
            © 2026 <strong className="text-slate-700">AT3 Next.js App</strong>.
          </div>
        </footer>
      </body>
    </html>
  );
}
