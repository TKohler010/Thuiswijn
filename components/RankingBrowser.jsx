"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { SURFACE, BORDER, GOLD, TEXT, TEXT_MUTED, WINE_RED, COLOR_MAP, uniqueSorted, broadRegion, primaryGrape } from "@/lib/helpers";
import { Select, FilterChip, ColorDot } from "@/components/UI";

const EMPTY_FILTERS = { color: "all", country: "all", region: "all", grape: "all", restaurant: "all", priceBucket: "all" };

const PRICE_BUCKETS = [
  { value: "lt75", label: "Tot €75", test: (p) => p < 75 },
  { value: "75-150", label: "€75 – 150", test: (p) => p >= 75 && p < 150 },
  { value: "150-300", label: "€150 – 300", test: (p) => p >= 150 && p < 300 },
  { value: "300-600", label: "€300 – 600", test: (p) => p >= 300 && p < 600 },
  { value: "gte600", label: "€600 en hoger", test: (p) => p >= 600 },
];

export default function RankingBrowser({ listings, restaurants }) {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [panelOpen, setPanelOpen] = useState(false);

  const restaurantById = Object.fromEntries(restaurants.map((r) => [r.id, r]));
  const countries = uniqueSorted(listings.map((l) => l.wine.country));
  const regions = uniqueSorted(listings.map((l) => broadRegion(l.wine.region)));
  const grapes = uniqueSorted(listings.map((l) => primaryGrape(l.wine.grape)));

  function setFilter(key, value) {
    setFilters((f) => ({ ...f, [key]: value }));
  }

  const ranked = useMemo(() => {
    let ls = listings;
    if (filters.color !== "all") ls = ls.filter((l) => l.wine.color === filters.color);
    if (filters.country !== "all") ls = ls.filter((l) => l.wine.country === filters.country);
    if (filters.region !== "all") ls = ls.filter((l) => broadRegion(l.wine.region) === filters.region);
    if (filters.grape !== "all") ls = ls.filter((l) => primaryGrape(l.wine.grape) === filters.grape);
    if (filters.restaurant !== "all") ls = ls.filter((l) => l.restaurant_id === filters.restaurant);
    if (search.trim()) {
      const s = search.toLowerCase();
      ls = ls.filter(
        (l) =>
          l.wine.producer.toLowerCase().includes(s) ||
          (l.wine.cuvee || "").toLowerCase().includes(s) ||
          l.wine.region.toLowerCase().includes(s) ||
          l.wine.grape.toLowerCase().includes(s)
      );
    }

    const byWine = {};
    for (const l of ls) {
      byWine[l.wine.id] = byWine[l.wine.id] || { wine: l.wine, listings: [] };
      byWine[l.wine.id].listings.push(l);
    }
    let grouped = Object.values(byWine).map((x) => ({
      ...x,
      count: new Set(x.listings.map((l) => l.restaurant_id)).size,
      minPrice: Math.min(...x.listings.map((l) => l.price_bottle_eur).filter((p) => p != null)),
    }));

    if (filters.priceBucket !== "all") {
      const bucket = PRICE_BUCKETS.find((b) => b.value === filters.priceBucket);
      grouped = grouped.filter((x) => Number.isFinite(x.minPrice) && bucket.test(x.minPrice));
    }

    return grouped.sort((a, b) => b.count - a.count || a.wine.producer.localeCompare(b.wine.producer, "nl"));
  }, [listings, search, filters]);

  const max = ranked[0]?.count || 1;
  const activeEntries = Object.entries(filters).filter(([, v]) => v !== "all");
  const filterLabels = { color: "Kleur", country: "Land", region: "Regio", grape: "Druif", restaurant: "Restaurant", priceBucket: "Prijs" };
  const chipLabel = (key, value) =>
    key === "color"
      ? COLOR_MAP[value].label
      : key === "restaurant"
      ? restaurantById[value]?.name
      : key === "priceBucket"
      ? PRICE_BUCKETS.find((b) => b.value === value)?.label
      : value;

  return (
    <>
      <p className="text-sm mt-1 mb-5" style={{ color: TEXT_MUTED }}>
        {ranked.length} wijnen
      </p>

      <div className="flex items-center gap-2 mb-2">
        <div className="flex items-center gap-2 px-3.5 py-2 rounded-full flex-1 min-w-0" style={{ background: SURFACE, border: `1px solid ${BORDER}` }}>
          <Search size={14} color={TEXT_MUTED} className="shrink-0" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Zoek…"
            className="bg-transparent outline-none flex-1 text-sm min-w-0"
            style={{ color: TEXT }}
          />
          {search && (
            <button onClick={() => setSearch("")} className="shrink-0">
              <X size={13} color={TEXT_MUTED} />
            </button>
          )}
        </div>
        <button
          onClick={() => setPanelOpen((o) => !o)}
          className="shrink-0 px-3.5 py-2 rounded-full text-sm flex items-center gap-1.5"
          style={{
            border: `1px solid ${panelOpen || activeEntries.length ? GOLD : BORDER}`,
            color: panelOpen || activeEntries.length ? GOLD : TEXT_MUTED,
            fontFamily: "'IBM Plex Mono', monospace",
          }}
        >
          Filters
          {activeEntries.length > 0 && (
            <span className="w-4 h-4 rounded-full text-[10px] flex items-center justify-center" style={{ background: GOLD, color: "#12201A" }}>
              {activeEntries.length}
            </span>
          )}
        </button>
      </div>

      {activeEntries.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {activeEntries.map(([key, value]) => (
            <FilterChip key={key} onClear={() => setFilter(key, "all")}>
              {filterLabels[key]}: {chipLabel(key, value)}
            </FilterChip>
          ))}
          <button onClick={() => setFilters(EMPTY_FILTERS)} className="text-xs px-2" style={{ color: TEXT_MUTED, fontFamily: "'IBM Plex Mono', monospace" }}>
            wis alles
          </button>
        </div>
      )}

      {panelOpen && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 rounded-2xl mb-4" style={{ background: SURFACE, border: `1px solid ${BORDER}` }}>
          <Select label="Kleur" value={filters.color} onChange={(v) => setFilter("color", v)} options={Object.keys(COLOR_MAP).map((c) => ({ value: c, label: COLOR_MAP[c].label }))} />
          <Select label="Land" value={filters.country} onChange={(v) => setFilter("country", v)} options={countries} />
          <Select label="Regio" value={filters.region} onChange={(v) => setFilter("region", v)} options={regions} />
          <Select label="Druif" value={filters.grape} onChange={(v) => setFilter("grape", v)} options={grapes} />
          <Select label="Restaurant" value={filters.restaurant} onChange={(v) => setFilter("restaurant", v)} options={restaurants.map((r) => ({ value: r.id, label: r.name }))} />
          <Select label="Prijs" value={filters.priceBucket} onChange={(v) => setFilter("priceBucket", v)} options={PRICE_BUCKETS} />
        </div>
      )}

      <div className="flex flex-col gap-1">
        {ranked.length === 0 && (
          <div className="p-8 text-center text-sm rounded-xl" style={{ background: SURFACE, border: `1px solid ${BORDER}`, color: TEXT_MUTED }}>
            Geen wijnen gevonden met deze filters.
          </div>
        )}
        {ranked.map(({ wine, count, listings: ls, minPrice }, i) => (
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
                  {[...new Set(ls.map((l) => l.restaurant_id))].map((id) => restaurantById[id]?.name).join(" · ")}
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-lg tabular-nums" style={{ fontFamily: "'IBM Plex Mono', monospace", color: count > 1 ? GOLD : TEXT_MUTED }}>{count}×</div>
                {Number.isFinite(minPrice) && (
                  <div className="text-[11px] leading-tight" style={{ color: TEXT_MUTED, fontFamily: "'IBM Plex Mono', monospace" }}>
                    v.a.
                    <br />€{Math.round(minPrice)}
                  </div>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
