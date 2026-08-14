import { supabase } from "./supabaseClient";

// ---------------------------------------------------------------------------
// Paginatie-helper.
//
// Supabase kapt resultaten stilzwijgend af: op de server-side "Max Rows"
// instelling, en op elke expliciete .range(). Geen error, geen waarschuwing —
// de rijen zijn er gewoon niet. Dat is eerder misgegaan: met een vaste
// .range(0, 4999) én .order("vintage") vielen de rijen boven de 5.000 af, en
// omdat vintage een TEKSTkolom is sorteren "NV"-waarden achteraan. Resultaat:
// precies de non-vintage champagnes verdwenen uit de ranking.
//
// Daarom: altijd pagineren, en altijd sorteren op "id". Die is uniek — bij een
// niet-unieke sorteerkolom kunnen rijen tussen pagina's dubbel voorkomen of
// overgeslagen worden.
//
// buildQuery is een FUNCTIE die telkens een verse query teruggeeft; een
// Supabase query-builder kun je niet hergebruiken.
// ---------------------------------------------------------------------------
const PAGE_SIZE = 1000;
const MAX_PAGES = 100; // veiligheidsrem: 100.000 rijen, ruim boven elke realistische stand

async function fetchAllPages(buildQuery) {
  const all = [];

  for (let page = 0; page < MAX_PAGES; page++) {
    const from = page * PAGE_SIZE;
    const { data, error } = await buildQuery()
      .order("id", { ascending: true })
      .range(from, from + PAGE_SIZE - 1);

    if (error) throw error;
    if (!data || data.length === 0) break;

    all.push(...data);

    // Niet-volle pagina betekent: dit was de laatste.
    if (data.length < PAGE_SIZE) break;
  }

  return all;
}

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
// Dit is de kern-query van de site: alle filtering gebeurt client-side omdat
// de dataset klein genoeg is (duizenden, geen miljoenen rijen).
export async function getListingsWithWines() {
  return fetchAllPages(() =>
    supabase.from("restaurant_wines").select("*, wine:wines(*)")
  );
}

export async function getListingsForRestaurant(restaurantId) {
  return fetchAllPages(() =>
    supabase
      .from("restaurant_wines")
      .select("*, wine:wines(*)")
      .eq("restaurant_id", restaurantId)
  );
}

export async function getWineWithListings(wineId) {
  const { data: wine, error: wErr } = await supabase.from("wines").select("*").eq("id", wineId).single();
  if (wErr) throw wErr;

  const listings = await fetchAllPages(() =>
    supabase
      .from("restaurant_wines")
      .select("*, restaurant:restaurants(*)")
      .eq("wine_id", wineId)
  );

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

// ---------------------------------------------------------------------------
// Thuisprijzen.
//
// Vervangt de hardcoded lib/homePrices.js. Eén wijn heeft er hooguit een
// handvol rijen (één per winkel), dus paginatie is hier niet nodig.
// Goedkoopste eerst; rijen zonder exacte prijs (legacy buckets uit
// homePrices.js) achteraan.
//
// Faalt bewust zacht: als de home_prices-tabel nog niet bestaat, of de query
// klapt om een andere reden, valt de badge stil terug op "nog niet onderzocht"
// in plaats van de hele wijnpagina te laten crashen.
// ---------------------------------------------------------------------------
export async function getHomePricesForWine(wineId) {
  const { data, error } = await supabase
    .from("home_prices")
    .select("*")
    .eq("wine_id", wineId)
    .order("price_eur", { ascending: true, nullsFirst: false });

  if (error) {
    console.warn(`[home_prices] kon prijzen voor "${wineId}" niet ophalen:`, error.message);
    return [];
  }

  return data ?? [];
}
