import Link from "next/link";
import { MapPin, TrendingUp } from "lucide-react";
import { getRestaurants, getListingsWithWines } from "@/lib/data";
import { GOLD, SURFACE, BORDER, TEXT, TEXT_MUTED } from "@/lib/helpers";
import { StarRow } from "@/components/UI";

export const revalidate = 3600; // ververs deze pagina elk uur met verse data
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store"; // voorkomt dat Vercel's Data Cache Supabase-responses vasthoudt

export default async function HomePage() {
  const [restaurants, listings] = await Promise.all([getRestaurants(), getListingsWithWines()]);
  const countByRestaurant = Object.fromEntries(
    restaurants.map((r) => [r.id, listings.filter((l) => l.restaurant_id === r.id).length])
  );

  return (
    <div className="max-w-5xl mx-auto px-5 pb-24">
      <section className="pt-14 pb-12">
        <div className="text-xs tracking-[0.2em] uppercase mb-4" style={{ color: GOLD, fontFamily: "'IBM Plex Mono', monospace" }}>
          Een verzameling wijnkaarten van Nederlandse sterrenzaken
        </div>
        <h1 className="text-[2.6rem] sm:text-[3.4rem] leading-[1.05] italic" style={{ fontFamily: "'Fraunces', serif", color: TEXT }}>
          Drink thuis wat je
          <br />
          bij de besten proeft.
        </h1>
        <p className="mt-5 max-w-xl text-[17px] leading-relaxed" style={{ color: TEXT_MUTED }}>
          Elke fles hier is met eigen ogen op een échte wijnkaart gezien. Blader per restaurant,
          filter op druif of regio, en ontdek welke flessen keer op keer door sommeliers gekozen worden.
        </p>
        <div className="flex flex-wrap gap-3 mt-8">
          <Link href="/wines" className="px-5 py-2.5 rounded-full text-sm font-medium" style={{ background: GOLD, color: "#12201A", fontFamily: "'IBM Plex Mono', monospace" }}>
            Bekijk alle wijnen
          </Link>
          <Link href="/sommeliers-favorieten" className="px-5 py-2.5 rounded-full text-sm border flex items-center gap-2" style={{ borderColor: BORDER, color: TEXT, fontFamily: "'IBM Plex Mono', monospace" }}>
            <TrendingUp size={14} /> Sommeliers' favorieten
          </Link>
        </div>
      </section>

      <div className="text-xs tracking-[0.2em] uppercase mb-4" style={{ color: TEXT_MUTED, fontFamily: "'IBM Plex Mono', monospace" }}>
        Restaurants — {restaurants.length}
      </div>
      <div className="grid sm:grid-cols-3 gap-4">
        {restaurants.map((r) => (
          <Link
            key={r.id}
            href={`/restaurants/${r.id}`}
            className="text-left p-5 rounded-2xl transition-transform hover:-translate-y-0.5 block"
            style={{ background: SURFACE, border: `1px solid ${BORDER}` }}
          >
            <div className="flex items-center justify-between mb-3">
              <StarRow n={r.michelin_stars} />
              <span className="text-[11px]" style={{ color: TEXT_MUTED, fontFamily: "'IBM Plex Mono', monospace" }}>
                {countByRestaurant[r.id] ?? 0} wijnen
              </span>
            </div>
            <div className="italic text-xl" style={{ fontFamily: "'Fraunces', serif", color: TEXT }}>
              {r.name}
            </div>
            <div className="text-xs mt-1 flex items-center gap-1" style={{ color: GOLD }}>
              <MapPin size={11} /> {r.city}
            </div>
            <p className="text-sm mt-3 leading-snug" style={{ color: TEXT_MUTED }}>
              {r.tagline}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
