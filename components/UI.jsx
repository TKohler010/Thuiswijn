"use client";
import { Star, X } from "lucide-react";
import { BG, BORDER, GOLD, TEXT, TEXT_MUTED, COLOR_MAP } from "@/lib/helpers";

export function StarRow({ n }) {
  return (
    <span className="inline-flex gap-0.5 align-middle">
      {Array.from({ length: n }).map((_, i) => (
        <Star key={i} size={12} fill={GOLD} color={GOLD} />
      ))}
    </span>
  );
}

export function ColorDot({ color }) {
  const c = COLOR_MAP[color] || { dot: TEXT_MUTED };
  return <span className="inline-block w-2.5 h-2.5 rounded-full shrink-0" style={{ background: c.dot }} />;
}

export function Select({ label, value, onChange, options }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-[10px] tracking-[0.15em] uppercase" style={{ color: TEXT_MUTED, fontFamily: "'IBM Plex Mono', monospace" }}>
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="text-sm rounded-lg px-2.5 py-2 outline-none"
        style={{ background: BG, border: `1px solid ${BORDER}`, color: value === "all" ? TEXT_MUTED : TEXT }}
      >
        <option value="all">Alles</option>
        {options.map((o) => {
          const opt = typeof o === "string" ? { value: o, label: o } : o;
          return (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          );
        })}
      </select>
    </label>
  );
}

export function FilterChip({ children, onClear }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 pl-3 pr-2 py-1 rounded-full text-xs"
      style={{ background: "rgba(201,162,39,0.12)", color: GOLD, fontFamily: "'IBM Plex Mono', monospace" }}
    >
      {children}
      <button onClick={onClear} className="opacity-70 hover:opacity-100">
        <X size={11} />
      </button>
    </span>
  );
}
