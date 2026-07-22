import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  // Duidelijke foutmelding i.p.v. een cryptische Supabase-error verderop.
  console.warn(
    "Supabase env vars ontbreken. Zet NEXT_PUBLIC_SUPABASE_URL en NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local (lokaal) of in Vercel > Settings > Environment Variables."
  );
}

export const supabase = createClient(url, anonKey, {
  global: {
    // Belt-and-suspenders: forceert ook op fetch-niveau dat Next.js/Vercel
    // deze requests nooit cachet, los van de route-instellingen per pagina.
    fetch: (input, init) => fetch(input, { ...init, cache: "no-store" }),
  },
});
