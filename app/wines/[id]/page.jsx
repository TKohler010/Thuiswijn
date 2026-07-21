import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Grape, MapPin } from "lucide-react";
import { getWineWithListings } from "@/lib/data";
import { BG, BORDER, GOLD, TEXT, TEXT_MUTED, COLOR_MAP, money, wineSearcherUrl } from "@/lib/helpers";
import { ColorDot, StarRow } from "@/components/UI";
import HomePriceBadge from "@/components/HomePriceBadge";

export const revalidate = 3600;
export const dynamic = "force-dynamic";

export default async function WineDetailPage({ params }) {
  const { wine, listings } = await getWineWithListings(params.id);

  return (
    <div className="max-w-2xl mx-auto px-5 pb-24">
      <Link href="/wines" className="flex items-center gap-1.5 text-sm pt-8 pb-6" style={{ color: TEXT_MUTED }}>
        <ArrowLeft size={14} /> Alle wijnen
      </Link>

      <div className="flex items-center gap-2 mb-2">
        <ColorDot color={wine.color} />
        <span className="text-xs uppercase tracking-wide" style={{ color: TEXT_MUTED, fontFamily: "'IBM Plex Mono', monospace" }}>
          {COLOR_MAP[wine.color]?.label}
        </span>
      </div>
      <h1 className="italic text-4xl leading-tight" style={{ fontFamily: "'Fraunces', serif", color: TEXT }}>
        {wine.producer}
      </h1>
      {wine.cuvee && (
        <div className="text-xl mt-1" style={{ color: GOLD, fontFamily: "'Fraunces', serif", fontStyle: "italic" }}>
          {wine.cuvee}
        </div>
      )}
      <div className="text-sm mt-3 space-y-1" style={{ color: TEXT_MUTED }}>
        <div><Grape size={12} className="inline mr-1.5" />{wine.grape}</div>
        <div><MapPin size={12} className="inline mr-1.5" />{wine.region}, {wine.country}</div>
      </div>

      <div className="mt-8 mb-3 text-xs tracking-[0.2em] uppercase" style={{ color: TEXT_MUTED, fontFamily: "'IBM Plex Mono', monospace" }}>
        Op de kaart bij {listings.length} {listings.length === 1 ? "restaurant" : "restaurants"}
      </div>
      <div className="flex flex-col gap-2">
        {listings.map((l) => (
          <Link key={l.id} href={`/restaurants/${l.restaurant.id}`} className="block p-4 rounded-xl" style={{ background: BG, border: `1px solid ${BORDER}` }}>
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <StarRow n={l.restaurant.michelin_stars} />
                  <span className="italic" style={{ fontFamily: "'Fraunces', serif", color: TEXT }}>{l.restaurant.name}</span>
                </div>
                <div className="text-xs mt-0.5" style={{ color: TEXT_MUTED }}>{l.restaurant.city} · jaargang {l.vintage}</div>
              </div>
              <div className="text-right">
                <div style={{ fontFamily: "'IBM Plex Mono', monospace", color: TEXT }}>{money(l.price_bottle_eur)}</div>
                {l.price_confidence === "approx" && <div className="text-[10px]" style={{ color: "#D9A441" }}>te verifiëren</div>}
              </div>
            </div>
          </Link>
        ))}
      </div>

      <HomePriceBadge wineId={wine.id} />

      <div className="mt-4 p-4 rounded-xl" style={{ background: BG, border: `1px solid ${BORDER}` }}>
        <div className="text-xs leading-relaxed mb-3" style={{ color: TEXT_MUTED }}>
          Deze wijn thuis? Zoek 'm bij internationale wijnhandelaren — let op: de jaargang
          die je online vindt wijkt vaak af van die op de restaurantkaart hierboven.
        </div>
        <a
          href={wineSearcherUrl(wine)}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs"
          style={{ background: "rgba(201,162,39,0.12)", color: GOLD, fontFamily: "'IBM Plex Mono', monospace" }}
        >
          Zoek {wine.producer} online
          <ArrowUpRight size={13} />
        </a>
      </div>
    </div>
  );
}
