"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { MapPin, Search, X } from "lucide-react";
import { SURFACE, BORDER, GOLD, TEXT, TEXT_MUTED, uniqueSorted } from "@/lib/helpers";
import { Select, FilterChip, StarRow } from "@/components/UI";

const EMPTY_FILTERS = { city: "all", stars: "all" };
const STAR_LABEL = { "0": "Geen ster", "1": "1 ster", "2": "2 sterren", "3": "3 sterren" };

export default function RestaurantsBrowser({ restaurants, countByRestaurant }) {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [panelOpen, setPanelOpen] = useState(false);

  const cities = uniqueSorted(restaurants.map((r) => r.city));
  const starOptions = uniqueSorted(restaurants.map((r) => String(r.michelin_stars)))
    .sort((a, b) => Number(a) - Number(b))
    .map((s) => ({ value: s, label: STAR_LABEL[s] || `${s} sterren` }));

  function setFilter(key, value) {
    setFilters((f) => ({ ...f, [key]: value }));
  }

  const filtered = useMemo(() => {
    let rs = restaurants;
    if (filters.city !== "all") rs = rs.filter((r) => r.city === filters.city);
    if (filters.stars !== "all") rs = rs.filter((r) => String(r.michelin_stars) === filters.stars);
    if (search.trim()) {
      const s = search.toLowerCase();
      rs = rs.filter(
        (r) =>
          r.name.toLowerCase().includes(s) ||
          r.city.toLowerCase().includes(s) ||
          (r.tagline || "").toLowerCase().includes(s)
      );
    }
    return rs;
  }, [restaurants, search, filters]);

  const activeEntries = Object.entries(filters).filter(([, v]) => v !== "all");
  const filterLabels = { city: "Stad", stars: "Sterren" };
  const chipLabel = (key, value) => (key === "stars" ? STAR_LABEL[value] || `${value} sterren` : value);

  return (
    <>
      <div className="flex items-center gap-2 mb-2">
        <div className="flex items-center gap-2 px-3.5 py-2 rounded-full flex-1 min-w-0" style={{ background: SURFACE, border: `1px solid ${BORDER}` }}>
          <Search size={14} color={TEXT_MUTED} className="shrink-0" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Zoek restaurant, stad…"
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
        <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl mb-4" style={{ background: SURFACE, border: `1px solid ${BORDER}` }}>
          <Select label="Stad" value={filters.city} onChange={(v) => setFilter("city", v)} options={cities} />
          <Select label="Sterren" value={filters.stars} onChange={(v) => setFilter("stars", v)} options={starOptions} />
        </div>
      )}

      <div className="text-xs tracking-[0.2em] uppercase mb-4" style={{ color: TEXT_MUTED, fontFamily: "'IBM Plex Mono', monospace" }}>
        Restaurants — {filtered.length}
      </div>

      {filtered.length === 0 && (
        <div className="p-8 text-center text-sm rounded-xl" style={{ background: SURFACE, border: `1px solid ${BORDER}`, color: TEXT_MUTED }}>
          Geen restaurants gevonden met deze filters.
        </div>
      )}

      <div className="grid sm:grid-cols-3 gap-4">
        {filtered.map((r) => (
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
    </>
  );
}
