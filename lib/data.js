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

async function fetchAllPages(buildQuery) {
  const PAGE = 1000;
  let all = [];
  for (let from = 0; ; from += PAGE) {
    const { data, error } = await buildQuery().order("id").range(from, from + PAGE - 1);
    if (error) throw error;
    all = all.concat(data);
    if (data.length < PAGE) break;
  }
  return all;
}

export async function getListingsWithWines() {
  return fetchAllPages(() =>
    supabase.from("restaurant_wines").select("*, wine:wines(*)")
  );
}

export async function getListingsForRestaurant(restaurantId) {
  return fetchAllPages(() =>
    supabase.from("restaurant_wines").select("*, wine:wines(*)").eq("restaurant_id", restaurantId)
  );
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
