import { FileText, Globe, ArrowUpRight } from "lucide-react";
import { SURFACE, SURFACE_HOVER, BORDER, GOLD, TEXT, TEXT_MUTED, sourceInfo } from "@/lib/helpers";

export default function SourceCard({ url }) {
  const info = sourceInfo(url);
  if (!info) return null;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 p-3.5 rounded-xl mt-5 transition-colors"
      style={{ background: SURFACE, border: `1px solid ${BORDER}` }}
    >
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
        style={{ background: "rgba(201,162,39,0.12)" }}
      >
        {info.isPdf ? <FileText size={18} color={GOLD} /> : <Globe size={18} color={GOLD} />}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm" style={{ color: TEXT }}>
          Bron: originele wijnkaart
        </div>
        <div className="text-xs truncate" style={{ color: TEXT_MUTED }}>
          {info.label} · {info.hostname}
        </div>
      </div>
      <ArrowUpRight size={16} color={TEXT_MUTED} className="shrink-0" />
    </a>
  );
}
