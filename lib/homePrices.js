// Fase 2: bekende thuisprijzen bij Nederlandse wijnhandelaren.
// status: "found" (bucket + winkel), "request" (prijs op aanvraag), "unavailable" (nergens gevonden)
// Handmatig onderzocht en bijgewerkt — geen live koppeling, dus periodiek herijken.
export const homePrices = {
  "cantemerle": { status: "found", bucket: "€ 20 – 30", shop: "Colaris", url: "https://www.colaris.nl/chateau-cantemerle-haut-medoc-5e-grand-cru-classe" },
  "sociandomallet": { status: "found", bucket: "€ 30 – 50", shop: "Colaris" },
  "remelluri-blanco": { status: "found", bucket: "€ 50 – 75", shop: "Siersma Wijnadvies" },
  "dom-perignon": { status: "found", bucket: "€ 200 – 250", shop: "Gall & Gall", url: "https://www.gall.nl/mousserende-wijn/champagne/dom-perignon/" },
  "fonseca-vintage": { status: "found", bucket: "€ 100 – 150", shop: "Gall & Gall", url: "https://www.gall.nl/fonseca-vintage-rood-75cl-126977.html" },
  "ornellaia-serrenuove": { status: "found", bucket: "€ 30 – 50", shop: "Voordeelwijnen", url: "https://www.voordeelwijnen.nl/le-serre-nuove-dell-ornellaia" },
  "mouton-rothschild": { status: "found", bucket: "€ 500+", shop: "Gall & Gall", url: "https://www.gall.nl/ch%C3%A2teau-mouton-rothschild-rood-75cl-156930.html" },
  "lafite-rothschild": { status: "found", bucket: "€ 500+", shop: "Gall & Gall", url: "https://www.gall.nl/ch%C3%A2teau-lafite-rothschild-rood-75cl-126101.html" },
  "leovillebarton-saintjulien": { status: "found", bucket: "€ 100 – 150", shop: "Gall & Gall", url: "https://www.gall.nl/ch%C3%A2teau-leoville-barton-rood-75cl-133299.html" },
  "latour-pauillac": { status: "found", bucket: "€ 500+", shop: "Gall & Gall", url: "https://www.gall.nl/ch%C3%A2teau-latour-rood-75cl-157147.html" },
  "sassicaia": { status: "request", shop: "Okhuysen", url: "https://www.okhuysen.nl/wijn/item/Sassicaia__Bolgheri_Sassicaia_87925/" },
  "krug-gc": { status: "found", bucket: "€ 200 – 250", shop: "Gall & Gall", url: "https://www.gall.nl/krug-grande-cuvee-edition-173-wit-75cl-109169.html" },
};
