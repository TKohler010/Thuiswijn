"use client";
import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { BORDER, SURFACE, GOLD, TEXT, TEXT_MUTED, COLOR_MAP, uniqueSorted, broadRegion, primaryGrape } from "@/lib/helpers";
import { Select, FilterChip } from "@/components/UI";
import WineTag from "@/components/WineTag";

const EMPTY_FILTERS = { color: "all", country: "all", region: "all", grape: "all", restaurant: "all" };

export default function WinesBrowser({ listings, restaurants }) {
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

  const rows = useMemo(() => {
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
    return [...ls].sort((a, b) => a.wine.producer.localeCompare(b.wine.producer, "nl"));
  }, [listings, search, filters]);

  const activeEntries = Object.entries(filters).filter(([, v]) => v !== "all");
  const filterLabels = { color: "Kleur", country: "Land", region: "Regio", grape: "Druif", restaurant: "Restaurant" };
  const chipLabel = (key, value) =>
    key === "color" ? COLOR_MAP[value].label : key === "restaurant" ? restaurantById[value].name : value;

  return (
    <>
      <p className="text-sm mt-1 mb-5" style={{ color: TEXT_MUTED }}>
        {rows.length} van {listings.length} vermeldingen
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
        </div>
      )}

      <div className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${BORDER}` }}>
        {rows.length === 0 && (
          <div className="p-8 text-center text-sm" style={{ color: TEXT_MUTED }}>
            Geen wijnen gevonden met deze filters.
          </div>
        )}
        {rows.map((l) => (
          <WineTag key={l.wine.id + l.restaurant_id + l.vintage} listing={l} restaurantName={restaurantById[l.restaurant_id]?.name} />
        ))}
      </div>
    </>
  );
}
