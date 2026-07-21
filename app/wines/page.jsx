import { getListingsWithWines, getRestaurants } from "@/lib/data";
import { TEXT } from "@/lib/helpers";
import WinesBrowser from "@/components/WinesBrowser";

export const revalidate = 3600;
export const dynamic = "force-dynamic";

export default async function WinesPage() {
  const [listings, restaurants] = await Promise.all([getListingsWithWines(), getRestaurants()]);

  return (
    <div className="max-w-4xl mx-auto px-5 pb-24">
      <div className="pt-10 pb-1">
        <h1 className="italic text-3xl" style={{ fontFamily: "'Fraunces', serif", color: TEXT }}>
          Alle wijnen
        </h1>
      </div>
      <WinesBrowser listings={listings} restaurants={restaurants} />
    </div>
  );
}
