import { supabase } from "./supabaseClient";

export async function getRestaurants() {
  const { data, error } = await supabase.from("restaurants").select("*").order("name");
  if (error) throw error;
  return data;
}

export async function getRestaurant(id) {
  const { data, error } = await supabase.from("restaurants").select("*").eq("id", id).single();
  if (error) throw error;
  return data;
}

// Alle vermeldingen (restaurant_wines) met de bijbehorende wijn erin genest.
// Dit is de kern-query van de site: één call, alle filtering gebeurt client-side
// omdat de dataset klein genoeg is (honderden, geen miljoenen rijen).
export async function getListingsWithWines() {
  const { data, error } = await supabase
    .from("restaurant_wines")
    .select("*, wine:wines(*)")
    .order("vintage")
    // Expliciete range i.p.v. vertrouwen op Supabase's standaard "Max Rows" (1000).
    // Verhoog dit getal gerust mee als de kaart verder groeit; check ook
    // Project Settings > API > Max Rows in Supabase, die moet er minstens
    // even hoog boven zitten.
    .range(0, 4999);
  if (error) throw error;
  return data;
}

export async function getListingsForRestaurant(restaurantId) {
  const { data, error } = await supabase
    .from("restaurant_wines")
    .select("*, wine:wines(*)")
    .eq("restaurant_id", restaurantId);
  if (error) throw error;
  return data;
}

export async function getWineWithListings(wineId) {
  const { data: wine, error: wErr } = await supabase.from("wines").select("*").eq("id", wineId).single();
  if (wErr) throw wErr;
  const { data: listings, error: lErr } = await supabase
    .from("restaurant_wines")
    .select("*, restaurant:restaurants(*)")
    .eq("wine_id", wineId);
  if (lErr) throw lErr;
  return { wine, listings };
}

export async function countListingsByRestaurant(restaurantId) {
  const { count, error } = await supabase
    .from("restaurant_wines")
    .select("*", { count: "exact", head: true })
    .eq("restaurant_id", restaurantId);
  if (error) throw error;
  return count ?? 0;
}
