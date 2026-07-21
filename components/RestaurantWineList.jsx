"use client";
import { useState } from "react";
import { BORDER, TEXT_MUTED, COLOR_MAP } from "@/lib/helpers";
import { Select } from "@/components/UI";
import WineTag from "@/components/WineTag";

export default function RestaurantWineList({ listings }) {
  const [color, setColor] = useState("all");
  const rows = listings
    .filter((l) => color === "all" || l.wine.color === color)
    .sort((a, b) => a.wine.producer.localeCompare(b.wine.producer, "nl"));

  const availableColors = Object.keys(COLOR_MAP).filter((c) => listings.some((l) => l.wine.color === c));

  return (
    <>
      <div className="flex items-end justify-between gap-3 mt-7 mb-2">
        <div className="w-40">
          <Select
            label="Kleur"
            value={color}
            onChange={setColor}
            options={availableColors.map((c) => ({ value: c, label: COLOR_MAP[c].label }))}
          />
        </div>
        <span className="text-xs pb-2" style={{ color: TEXT_MUTED, fontFamily: "'IBM Plex Mono', monospace" }}>
          {rows.length} / {listings.length}
        </span>
      </div>

      <div className="mt-2 rounded-2xl overflow-hidden" style={{ border: `1px solid ${BORDER}` }}>
        {rows.map((l) => (
          <WineTag key={l.wine.id + l.vintage} listing={l} />
        ))}
      </div>
    </>
  );
}
