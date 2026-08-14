import { BG, BORDER, GOLD, TEXT_MUTED } from "@/lib/helpers";
import { getHomePricesForWine } from "@/lib/data";

// Prijsladder voor de weergave. We slaan sinds de home_prices-migratie exacte
// prijzen op, maar tonen bewust nog steeds een range: een thuisprijs schommelt
// en verjaart, en een harde "€ 42" suggereert meer precisie dan we waar kunnen
// maken. Rijen uit de oude homePrices.js hebben alleen een bucket en geen
// exacte prijs; die vallen hieronder terug op price_bucket.
const BUCKET_EDGES = [15, 20, 30, 50, 75, 100, 150, 200, 250, 350, 500];

function priceBucket(eur) {
  const n = Number(eur);
  if (!Number.isFinite(n) || n <= 0) return "";
  if (n < BUCKET_EDGES[0]) return `< € ${BUCKET_EDGES[0]}`;
  for (let i = 0; i < BUCKET_EDGES.length - 1; i++) {
    if (n < BUCKET_EDGES[i + 1]) return `€ ${BUCKET_EDGES[i]} – ${BUCKET_EDGES[i + 1]}`;
  }
  return `€ ${BUCKET_EDGES[BUCKET_EDGES.length - 1]}+`;
}

function label(row) {
  return row.price_eur != null ? priceBucket(row.price_eur) : row.price_bucket || "";
}

// Prijzen verjaren. Na ~9 maanden zeggen we er eerlijk bij hoe oud de check is,
// in plaats van te doen alsof het actueel is.
const STALE_AFTER_MONTHS = 9;

function checkedLongAgo(checkedAt) {
  if (!checkedAt) return null;
  const then = new Date(checkedAt);
  if (Number.isNaN(then.getTime())) return null;
  const months = (Date.now() - then.getTime()) / (1000 * 60 * 60 * 24 * 30.44);
  if (months < STALE_AFTER_MONTHS) return null;
  return then.toLocaleDateString("nl-NL", { month: "long", year: "numeric" });
}

export default async function HomePriceBadge({ wineId }) {
  const rows = await getHomePricesForWine(wineId);
  if (!rows || rows.length === 0) return null; // nog niet onderzocht — het generieke Wine-Searcher-blok eronder doet dan het werk

  // Goedkoopste eerst. Rijen zonder exacte prijs (legacy buckets) achteraan,
  // zodat een echte prijs altijd wint van een grove range.
  const found = rows
    .filter((r) => r.status === "found" && label(r))
    .sort((a, b) => {
      const pa = a.price_eur ?? Infinity;
      const pb = b.price_eur ?? Infinity;
      return pa - pb;
    });

  const best = found[0];
  const otherShops = found.length - 1;
  const request = rows.find((r) => r.status === "request");
  const stale = best ? checkedLongAgo(best.checked_at) : null;

  if (!best && !request) {
    return (
      <div className="mt-7">
        <div className="text-xs tracking-[0.2em] uppercase mb-2" style={{ color: TEXT_MUTED, fontFamily: "'IBM Plex Mono', monospace" }}>
          Richtprijs thuis
        </div>
        <div className="p-3.5 rounded-xl text-xs leading-relaxed" style={{ border: `1px dashed ${BORDER}`, color: TEXT_MUTED }}>
          Prijs niet beschikbaar bij bekende NL-wijnhandelaren — vaak een teken dat een wijn allocatie-gebonden is.
        </div>
      </div>
    );
  }

  return (
    <div className="mt-7">
      <div className="text-xs tracking-[0.2em] uppercase mb-2" style={{ color: TEXT_MUTED, fontFamily: "'IBM Plex Mono', monospace" }}>
        Richtprijs thuis
      </div>

      {best && (
        <>
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm"
            style={{ background: "rgba(201,162,39,0.12)", border: `1px solid ${GOLD}`, color: GOLD, fontFamily: "'IBM Plex Mono', monospace" }}
          >
            {label(best)}
          </div>
          <div className="mt-2 text-xs" style={{ color: TEXT_MUTED }}>
            {best.url ? (
              <a href={best.url} target="_blank" rel="noopener noreferrer" style={{ color: TEXT_MUTED, textDecoration: "underline" }}>
                Bekijk bij {best.shop_name}
              </a>
            ) : (
              <>Gevonden bij {best.shop_name}</>
            )}
            {otherShops > 0 && (
              <> — ook bij {otherShops} {otherShops === 1 ? "andere winkel" : "andere winkels"}</>
            )}
          </div>
          {stale && (
            <div className="mt-1 text-xs" style={{ color: TEXT_MUTED, opacity: 0.75 }}>
              Voor het laatst gecontroleerd in {stale}; de prijs kan gewijzigd zijn.
            </div>
          )}
        </>
      )}

      {!best && request && (
        <>
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm"
            style={{ background: "transparent", border: `1px solid ${BORDER}`, color: TEXT_MUTED, fontFamily: "'IBM Plex Mono', monospace" }}
          >
            Prijs op aanvraag
          </div>
          <div className="mt-2 text-xs" style={{ color: TEXT_MUTED }}>
            Wel op voorraad bij{" "}
            {request.url ? (
              <a href={request.url} target="_blank" rel="noopener noreferrer" style={{ color: TEXT_MUTED, textDecoration: "underline" }}>
                {request.shop_name}
              </a>
            ) : (
              request.shop_name
            )}
            , maar zonder publieke prijs — vaak een teken van een schaarse, gealloceerde wijn.
          </div>
        </>
      )}
    </div>
  );
}
