import Link from "next/link";
import { ArrowLeft, MapPin } from "lucide-react";
import { getRestaurant, getListingsForRestaurant, getRestaurants } from "@/lib/data";
import { GOLD, TEXT, TEXT_MUTED } from "@/lib/helpers";
import { StarRow } from "@/components/UI";
import SourceCard from "@/components/SourceCard";
import RestaurantWineList from "@/components/RestaurantWineList";

export const revalidate = 3600;

export async function generateStaticParams() {
  const restaurants = await getRestaurants();
  return restaurants.map((r) => ({ id: r.id }));
}

export default async function RestaurantPage({ params }) {
  const [restaurant, listings] = await Promise.all([
    getRestaurant(params.id),
    getListingsForRestaurant(params.id),
  ]);

  return (
    <div className="max-w-3xl mx-auto px-5 pb-24">
      <Link href="/" className="flex items-center gap-1.5 text-sm pt-8 pb-6" style={{ color: TEXT_MUTED }}>
        <ArrowLeft size={14} /> Alle restaurants
      </Link>
      <StarRow n={restaurant.michelin_stars} />
      <h1 className="italic text-4xl mt-3" style={{ fontFamily: "'Fraunces', serif", color: TEXT }}>
        {restaurant.name}
      </h1>
      <div className="text-sm mt-1 flex items-center gap-1" style={{ color: GOLD }}>
        <MapPin size={12} /> {restaurant.city} · sommelier(s): {restaurant.sommeliers}
      </div>
      <p className="mt-3 text-[15px]" style={{ color: TEXT_MUTED }}>
        {restaurant.tagline}
      </p>
      <SourceCard url={restaurant.wine_list_url} />

      <RestaurantWineList listings={listings} />
    </div>
  );
}
