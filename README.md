# Thuiswijn. — wijnkaarten-POC

## Stap 1 — Database vullen (als je dit nog niet deed)
1. Open je project in [supabase.com](https://supabase.com) → **SQL Editor**
2. Plak en run `supabase/schema.sql`
3. Plak en run `supabase/seed_data.sql`
4. Check: Table Editor moet nu 3 restaurants, 59 wines, 64 restaurant_wines tonen

## Stap 2 — Code naar GitHub
1. Ga naar [github.com/new](https://github.com/new), maak een **nieuwe, lege repository** (bv. `kelder`) — geen README/gitignore aanvinken
2. Open de repository-pagina → knop **"uploading an existing file"**
3. Sleep de hele inhoud van deze map (niet de map zelf, de bestanden erin) naar het upload-vlak. Chrome/Edge behouden de mapstructuur (app/, components/, lib/) automatisch
4. Commit

## Stap 3 — Vercel koppelen
1. Ga naar [vercel.com/new](https://vercel.com/new)
2. Kies **Import** bij de `kelder`-repo (die je net aanmaakte)
3. Vercel herkent Next.js automatisch — niets aanpassen bij "Build settings"
4. Bij **Environment Variables**, voeg toe (waarden uit Supabase: Project Settings → API):
   - `NEXT_PUBLIC_SUPABASE_URL` → jouw Project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` → jouw **anon public** key (niet de service_role key!)
5. Klik **Deploy**

Na ~1 minuut heb je een live URL. Werkt er iets niet? Kopieer de foutmelding van het Vercel build-log hierheen, dan los ik 'm gericht op.

## Lokaal draaien (optioneel, alleen als je zelf wil testen voor je pusht)
```
npm install
cp .env.local.example .env.local   # vul de twee waarden in
npm run dev
```

## Structuur
- `app/` — pagina's (Next.js App Router): home, restaurant-detail, wijnenoverzicht, wijndetail, ranking
- `components/` — gedeelde UI (filterpaneel, wijnkaart-rij)
- `lib/` — Supabase-client, databasequeries, helpers (kleuren, regio/druif-normalisatie)
- `supabase/` — het SQL-schema en de seed-data die je al in Supabase hebt draaien
