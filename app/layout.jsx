import "./globals.css";
import Link from "next/link";
import { Wine } from "lucide-react";
import { BG, BORDER, GOLD, TEXT, TEXT_MUTED } from "@/lib/helpers";

export const metadata = {
  title: "Thuiswijn.",
  description: "Wijnkaarten van Nederlandse sterrenrestaurants, doorzoekbaar en vergelijkbaar.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="nl">
      <body style={{ background: BG }}>
        <header className="sticky top-0 z-40 backdrop-blur-sm" style={{ background: "rgba(18,32,26,0.85)", borderBottom: `1px solid ${BORDER}` }}>
          <div className="max-w-5xl mx-auto px-5 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <Wine size={18} color={GOLD} />
              <span className="text-lg tracking-tight" style={{ fontFamily: "'Fraunces', serif", color: TEXT }}>
                THUISWIJN<span style={{ color: GOLD }}>.</span>
              </span>
            </Link>
            <nav className="flex gap-1">
              <NavLink href="/">Restaurants</NavLink>
              <NavLink href="/wines">Wijnen</NavLink>
              <NavLink href="/sommeliers-favorieten">Sommeliers' favorieten</NavLink>
            </nav>
          </div>
        </header>
        {children}
        <footer className="max-w-5xl mx-auto px-5 py-10 text-xs" style={{ color: TEXT_MUTED, borderTop: `1px solid ${BORDER}` }}>
          Data handmatig verzameld en periodiek bijgewerkt vanaf de wijnkaarten van elk restaurant.
        </footer>
      </body>
    </html>
  );
}

function NavLink({ href, children }) {
  return (
    <Link
      href={href}
      className="px-3 py-1.5 rounded-full text-sm"
      style={{ color: TEXT_MUTED, fontFamily: "'IBM Plex Mono', monospace" }}
    >
      {children}
    </Link>
  );
}
