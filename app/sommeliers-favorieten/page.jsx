import Link from "next/link";
import { TrendingUp } from "lucide-react";
import { getListingsWithWines, getRestaurants } from "@/lib/data";
import { SURFACE, BORDER, GOLD, TEXT, TEXT_MUTED, WINE_RED } from "@/lib/helpers";
import { ColorDot } from "@/components/UI";

export const revalidate = 3600;

export default async function RankingPage() {
  const [listings, restaurants] = await Promise.all([getListingsWithWines(), getRestaurants()]);
  const restaurantById = Object.fromEntries(restaurants.map((r) => [r.id, r]));

  const byWine = {};
  for (const l of listings) {
    byWine[l.wine.id] = byWine[l.wine.id] || { wine: l.wine, listings: [] };
    byWine[l.wine.id].listings.push(l);
  }
  const ranked = Object.values(byWine)
    .map((x) => ({ ...x, count: new Set(x.listings.map((l) => l.restaurant_id)).size }))
    .sort((a, b) => b.count - a.count || a.wine.producer.localeCompare(b.wine.producer, "nl"));
  const max = ranked[0]?.count || 1;

  return (
    <div className="max-w-3xl mx-auto px-5 pb-24">
      <div className="pt-10 pb-6">
        <div className="flex items-center gap-2 mb-1" style={{ color: GOLD }}>
          <TrendingUp size={16} />
          <span className="text-xs tracking-[0.2em] uppercase" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>Sommeliers' favorieten</span>
        </div>
        <h1 className="italic text-3xl" style={{ fontFamily: "'Fraunces', serif", color: TEXT }}>
          Waar sommeliers het over eens zijn
        </h1>
        <p className="text-sm mt-1" style={{ color: TEXT_MUTED }}>
          Wijnen die door meerdere sommeliers onafhankelijk van elkaar zijn gekozen.
        </p>
      </div>

      <div className="flex flex-col gap-1">
        {ranked.map(({ wine, count, listings: ls }, i) => (
          <Link key={wine.id} href={`/wines/${wine.id}`} className="text-left p-4 rounded-xl relative overflow-hidden block" style={{ background: SURFACE, border: `1px solid ${BORDER}` }}>
            <div className="absolute inset-y-0 left-0 opacity-[0.14]" style={{ width: `${(count / max) * 100}%`, background: WINE_RED }} />
            <div className="relative flex items-center gap-4">
              <span className="text-xs w-6 text-center shrink-0" style={{ color: TEXT_MUTED, fontFamily: "'IBM Plex Mono', monospace" }}>{i + 1}</span>
              <ColorDot color={wine.color} />
              <div className="flex-1 min-w-0">
                <div className="italic text-[16px]" style={{ fontFamily: "'Fraunces', serif", color: TEXT }}>
                  {wine.producer} {wine.cuvee && <span style={{ color: TEXT_MUTED }}>— {wine.cuvee}</span>}
                </div>
                <div className="text-xs" style={{ color: TEXT_MUTED }}>
                  {ls.map((l) => restaurantById[l.restaurant_id]?.name).join(" · ")}
                </div>
              </div>
              <div className="text-lg tabular-nums shrink-0" style={{ fontFamily: "'IBM Plex Mono', monospace", color: count > 1 ? GOLD : TEXT_MUTED }}>{count}×</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
