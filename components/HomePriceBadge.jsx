import { BG, BORDER, GOLD, TEXT_MUTED } from "@/lib/helpers";
import { homePrices } from "@/lib/homePrices";

export default function HomePriceBadge({ wineId }) {
  const info = homePrices[wineId];
  if (!info) return null; // nog niet onderzocht — het generieke Wine-Searcher-blok eronder doet dan het werk

  return (
    <div className="mt-7">
      <div className="text-xs tracking-[0.2em] uppercase mb-2" style={{ color: TEXT_MUTED, fontFamily: "'IBM Plex Mono', monospace" }}>
        Richtprijs thuis
      </div>

      {info.status === "found" && (
        <>
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm"
            style={{ background: "rgba(201,162,39,0.12)", border: `1px solid ${GOLD}`, color: GOLD, fontFamily: "'IBM Plex Mono', monospace" }}
          >
            {info.bucket}
          </div>
          <div className="mt-2 text-xs" style={{ color: TEXT_MUTED }}>
            {info.url ? (
              <a href={info.url} target="_blank" rel="noopener noreferrer" style={{ color: TEXT_MUTED, textDecoration: "underline" }}>
                Bekijk bij {info.shop}
              </a>
            ) : (
              <>Gevonden bij {info.shop}</>
            )}
          </div>
        </>
      )}

      {info.status === "request" && (
        <>
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm"
            style={{ background: "transparent", border: `1px solid ${BORDER}`, color: TEXT_MUTED, fontFamily: "'IBM Plex Mono', monospace" }}
          >
            Prijs op aanvraag
          </div>
          <div className="mt-2 text-xs" style={{ color: TEXT_MUTED }}>
            Wel op voorraad bij{" "}
            {info.url ? (
              <a href={info.url} target="_blank" rel="noopener noreferrer" style={{ color: TEXT_MUTED, textDecoration: "underline" }}>
                {info.shop}
              </a>
            ) : (
              info.shop
            )}
            , maar zonder publieke prijs — vaak een teken van een schaarse, gealloceerde wijn.
          </div>
        </>
      )}

      {info.status === "unavailable" && (
        <div className="p-3.5 rounded-xl text-xs leading-relaxed" style={{ border: `1px dashed ${BORDER}`, color: TEXT_MUTED }}>
          Prijs niet beschikbaar bij bekende NL-wijnhandelaren — vaak een teken dat een wijn allocatie-gebonden is.
        </div>
      )}
    </div>
  );
}
