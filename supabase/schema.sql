-- =========================================================
-- Thuiswijn. — wijnkaarten-database schema (POC)
-- Doel: uitvoeren in een gratis Supabase-project (SQL editor)
-- =========================================================

create table restaurants (
  id            text primary key,           -- korte slug, bv. 'librije'
  name          text not null,
  city          text not null,
  michelin_stars smallint default 0,
  tagline       text,
  sommeliers    text,                        -- comma-separated namen
  website_url   text,
  wine_list_url text,                        -- bron van de wijnkaart
  created_at    timestamptz default now()
);

-- Een 'wine' is producent + cuvée + druif + regio: NIET vintage-specifiek.
-- Reden: dezelfde wijn (bv. 'Cristal') staat vaak met wisselende jaargangen
-- op meerdere wijnkaarten. Ranking ("meest voorkomende wijn") telt op dit niveau.
create table wines (
  id          text primary key,             -- slug, bv. 'roederer-cristal'
  producer    text not null,
  cuvee       text,                          -- specifieke naam binnen het domein
  grape       text,                          -- druif(en), vrije tekst ("Chardonnay/Pinot Noir")
  region      text,
  country     text not null,
  color       text not null check (color in ('rood','wit','rose','mousserend','zoet')),
  created_at  timestamptz default now()
);

-- Koppeltabel: welk restaurant voert welke wijn, in welke jaargang en voor welke prijs.
create table restaurant_wines (
  id                 bigint generated always as identity primary key,
  restaurant_id      text not null references restaurants(id) on delete cascade,
  wine_id            text not null references wines(id) on delete cascade,
  vintage            text,                   -- 'NV' voor non-vintage (o.a. champagne)
  price_bottle_eur   numeric(8,2),
  price_glass_eur    numeric(8,2),
  price_confidence   text default 'verified' check (price_confidence in ('verified','approx')),
  -- verified = rechtstreeks van restaurant-PDF/website
  -- approx   = geparsed uit foto/OCR-bron, nog te bevestigen met het restaurant
  source_url         text,
  last_seen_at       timestamptz default now(),
  unique (restaurant_id, wine_id, vintage)
);

-- Toekomstige fase: webshopprijzen koppelen aan wines (niet aan restaurant_wines,
-- want een webshopprijs geldt los van welk restaurant de wijn serveert).
create table webshop_prices (
  id           bigint generated always as identity primary key,
  wine_id      text not null references wines(id) on delete cascade,
  vintage      text,
  shop_name    text not null,               -- bv. 'Wijnvoordeel', 'Millesima'
  price_eur    numeric(8,2) not null,
  product_url  text,
  checked_at   timestamptz default now()
);

-- Handige indexen voor de filters op de wines-overzichtspagina
create index idx_wines_color   on wines(color);
create index idx_wines_country on wines(country);
create index idx_wines_region  on wines(region);
create index idx_rw_restaurant on restaurant_wines(restaurant_id);
create index idx_rw_wine       on restaurant_wines(wine_id);

-- Voorbeeldquery voor de ranking-pagina: meest voorkomende wijn over alle kaarten
-- select w.producer, w.cuvee, count(distinct rw.restaurant_id) as restaurant_count
-- from wines w join restaurant_wines rw on rw.wine_id = w.id
-- group by w.id order by restaurant_count desc;
