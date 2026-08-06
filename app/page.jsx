import Link from "next/link";
import { TrendingUp } from "lucide-react";
import { getRestaurants, getListingsWithWines } from "@/lib/data";
import { GOLD, BORDER, TEXT, TEXT_MUTED } from "@/lib/helpers";
import RestaurantsBrowser from "@/components/RestaurantsBrowser";

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

      <RestaurantsBrowser restaurants={restaurants} countByRestaurant={countByRestaurant} />
    </div>
  );
}
