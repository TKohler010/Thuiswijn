export const BG = "#12201A";
export const SURFACE = "#1B2B22";
export const SURFACE_HOVER = "#22352A";
export const BORDER = "rgba(201,162,39,0.16)";
export const TEXT = "#EEE7D6";
export const TEXT_MUTED = "#94A79A";
export const GOLD = "#C9A227";
export const WINE_RED = "#A5384C";

export const COLOR_MAP = {
  rood: { dot: "#A5384C", label: "Rood" },
  wit: { dot: "#D8C36B", label: "Wit" },
  rose: { dot: "#D98A9A", label: "Rosé" },
  mousserend: { dot: "#E4C97A", label: "Mousserend" },
  zoet: { dot: "#B5651D", label: "Zoet & versterkt" },
};

export function money(n) {
  if (n == null) return "—";
  return "€ " + Number(n).toLocaleString("nl-NL");
}

// Bouwt een werkende Wine-Searcher zoeklink voor producent + cuvée.
// Geen exacte jaargang (gebruikt "-" = alle jaargangen), want de fles op de
// restaurantkaart is zelden exact dezelfde jaargang als wat online te koop is.
export function wineSearcherUrl(wine) {
  const query = [wine.producer, wine.cuvee].filter(Boolean).join(" ").trim();
  const encoded = encodeURIComponent(query).replace(/%20/g, "+");
  return `https://www.wine-searcher.com/find/${encoded}/-/europe/eur`;
}

export function uniqueSorted(arr) {
  return [...new Set(arr)].sort((a, b) => a.localeCompare(b, "nl"));
}

// "Pauillac, Bordeaux" -> "Bordeaux" (bredere regio, voor filtering)
export function broadRegion(region) {
  if (!region) return "";
  const parts = region.split(",").map((p) => p.trim());
  return parts[parts.length - 1];
}

// "Cabernet Sauvignon e.a." -> "Cabernet Sauvignon" (hoofddruif, voor filtering)
export function primaryGrape(grape) {
  if (!grape) return "";
  return grape.split(",")[0].replace(/\s*e\.a\.?$/i, "").trim();
}

// Voor het bronkaartje op de restaurantpagina: PDF of website, plus nette hostnaam.
export function sourceInfo(url) {
  if (!url) return null;
  let hostname = url;
  try {
    hostname = new URL(url).hostname.replace(/^www\./, "");
  } catch {}
  const isPdf = url.toLowerCase().includes(".pdf");
  return { isPdf, hostname, label: isPdf ? "PDF" : "Website" };
}
