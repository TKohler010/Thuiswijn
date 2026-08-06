import { TrendingUp } from "lucide-react";
import { getListingsWithWines, getRestaurants } from "@/lib/data";
import { GOLD, TEXT, TEXT_MUTED } from "@/lib/helpers";
import RankingBrowser from "@/components/RankingBrowser";

export const revalidate = 3600;
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store"; // voorkomt dat Vercel's Data Cache Supabase-responses vasthoudt

export default async function RankingPage() {
  const [listings, restaurants] = await Promise.all([getListingsWithWines(), getRestaurants()]);

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

      <RankingBrowser listings={listings} restaurants={restaurants} />
    </div>
  );
}
