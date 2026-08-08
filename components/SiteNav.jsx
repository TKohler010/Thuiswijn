"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { BORDER, SURFACE, TEXT_MUTED } from "@/lib/helpers";

const LINKS = [
  { href: "/", label: "Restaurants" },
  { href: "/wines", label: "Wijnen" },
  { href: "/sommeliers-favorieten", label: "Sommeliers' favorieten" },
];

export default function SiteNav() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function onClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  return (
    <>
      {/* Desktop: alle links zichtbaar, ongewijzigd */}
      <nav className="hidden sm:flex gap-1">
        {LINKS.map((l) => (
          <NavLink key={l.href} href={l.href}>
            {l.label}
          </NavLink>
        ))}
      </nav>

      {/* Mobiel: alleen Sommeliers' favorieten + dropdown voor de rest */}
      <div className="flex sm:hidden items-center gap-1">
        <NavLink href="/sommeliers-favorieten">Sommeliers' favorieten</NavLink>
        <div className="relative" ref={ref}>
          <button
            onClick={() => setOpen((o) => !o)}
            aria-label="Meer opties"
            className="p-2 rounded-full"
            style={{ color: TEXT_MUTED }}
          >
            <Menu size={18} />
          </button>
          {open && (
            <div
              className="absolute right-0 mt-2 py-1.5 rounded-xl min-w-[160px] z-50"
              style={{ background: SURFACE, border: `1px solid ${BORDER}` }}
            >
              {LINKS.filter((l) => l.href !== "/sommeliers-favorieten").map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block px-4 py-2 text-sm"
                  style={{ color: TEXT_MUTED, fontFamily: "'IBM Plex Mono', monospace" }}
                >
                  {l.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function NavLink({ href, children }) {
  return (
    <Link
      href={href}
      className="px-3 py-1.5 rounded-full text-sm whitespace-nowrap"
      style={{ color: TEXT_MUTED, fontFamily: "'IBM Plex Mono', monospace" }}
    >
      {children}
    </Link>
  );
}
