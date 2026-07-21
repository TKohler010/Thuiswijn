"use client";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { BORDER, GOLD, SURFACE_HOVER, TEXT, TEXT_MUTED, COLOR_MAP, money } from "@/lib/helpers";

// listing: rij uit restaurant_wines, met genest .wine object
// restaurantName: optioneel, toon je als je meerdere restaurants door elkaar laat zien
export default function WineTag({ listing, restaurantName }) {
  const wine = listing.wine;
  const c = COLOR_MAP[wine.color] || {};
  return (
    <Link
      href={`/wines/${wine.id}`}
      className="w-full text-left flex items-center gap-4 py-3.5 px-4 group transition-colors"
      style={{ borderBottom: `1px solid ${BORDER}` }}
      onMouseEnter={(e) => (e.currentTarget.style.background = SURFACE_HOVER)}
      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
    >
      <span className="w-1 self-stretch rounded-full shrink-0" style={{ background: c.dot }} />
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2 flex-wrap">
          <span className="italic text-[17px] leading-tight" style={{ fontFamily: "'Fraunces', serif", color: TEXT }}>
            {wine.producer}
          </span>
          {wine.cuvee && (
            <span className="text-[15px]" style={{ color: TEXT_MUTED }}>
              {wine.cuvee}
            </span>
          )}
        </div>
        <div className="text-xs mt-0.5" style={{ color: TEXT_MUTED }}>
          {wine.region} · {wine.country} · {wine.grape}
          {restaurantName && (
            <>
              {" "}
              · <span style={{ color: GOLD }}>{restaurantName}</span>
            </>
          )}
        </div>
      </div>
      <div className="text-right shrink-0">
        <div className="text-[15px] tabular-nums" style={{ fontFamily: "'IBM Plex Mono', monospace", color: TEXT }}>
          {money(listing.price_bottle_eur)}
        </div>
        <div className="text-[11px]" style={{ color: TEXT_MUTED }}>
          {listing.vintage}
          {listing.price_confidence === "approx" && <span style={{ color: "#D9A441" }}> · te verifiëren</span>}
        </div>
      </div>
      <ChevronRight size={16} className="opacity-0 group-hover:opacity-60 transition-opacity shrink-0" color={TEXT_MUTED} />
    </Link>
  );
}
