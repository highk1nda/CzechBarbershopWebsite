/**
 * ================================================================
 *  MAISON beauty — SPRÁVA SLUŽEB / SERVICES CONFIGURATION
 * ================================================================
 *
 *  JAK PŘIDAT NOVOU SLUŽBU (How to add a new service item):
 *  1. Najděte správnou kategorii níže (např. "Střihy & Styling")
 *  2. Přidejte nový řádek do pole items[]:
 *       { name: "Název služby", price: "000 Kč" }
 *  3. Uložte soubor — změna se projeví okamžitě na webu
 *
 *  JAK PŘIDAT NOVOU KATEGORII (How to add a new category):
 *  1. Zkopírujte celý blok { icon, title, items } včetně závorek
 *  2. Vložte ho na konec pole categories daného tabu (před poslední ] )
 *  3. Upravte icon, title a items
 *
 *  JAK PŘIDAT NOVÝ TAB (How to add a new service tab):
 *  1. Zkopírujte celý blok { tabId, tabLabel, note, categories }
 *  2. Vložte ho na konec hlavního pole window.SERVICES (před poslední ] )
 *  3. Upravte tabId (unikátní ID bez mezer), tabLabel (zobrazený název) a categories
 *
 *  CENY (Prices): Pište libovolný text:
 *    "700 Kč", "800–1 500 Kč", "od 2 000 Kč", "dle dohody"
 *
 * ================================================================
 */

window.SERVICES = [
  {
    tabId: "women",
    tabLabel: "Dámské kadeřnictví",
    note: "Ceny se mohou lišit podle délky a hustoty vlasů.",
    categories: [
      {
        icon: "✂️",
        title: "Střihy & Styling",
        items: [
          { name: "Dámský střih (mytí, foukaná, styling)", price: "800–1 500 Kč" },
          { name: "Společenský účes",                      price: "od 2 000 Kč"  },
          { name: "Vlny",                                   price: "od 1 000 Kč"  },
        ]
      },
      {
        icon: "🎨",
        title: "Barvení",
        items: [
          { name: "Barva",              price: "1 200–1 700 Kč" },
          { name: "Airtouch",           price: "2 800–4 800 Kč" },
          { name: "Mikromelír",         price: "2 600–4 600 Kč" },
          { name: "Balayage",           price: "2 200–4 200 Kč" },
          { name: "Stahování barvy",    price: "800–1 100 Kč"   },
          { name: "Přeliv",             price: "700–1 100 Kč"   },
        ]
      },
      {
        icon: "✨",
        title: "Péče & Ošetření",
        items: [
          { name: "Čištění vlasů (hloubkové čištění a péče)", price: "700–1 800 Kč"   },
          { name: "Curling (trvalá)",                          price: "1 200–2 200 Kč" },
          { name: "Regenerační kúra",                          price: "600–1 200 Kč"   },
          { name: "Botox, keratin",                            price: "1 500–3 200 Kč" },
        ]
      }
    ]
  },
  {
    tabId: "men",
    tabLabel: "Pánské & dětské",
    note: "Ceny se mohou lišit podle délky a hustoty vlasů.",
    categories: [
      {
        icon: "💈",
        title: "Pánské střihy",
        items: [
          { name: "Pánský střih – Fade (mytí, střih, styling)",    price: "700 Kč · 1 hod"  },
          { name: "Pánský střih – Klasika (mytí, střih, styling)", price: "600 Kč · 1 hod"  },
          { name: "Curli – trvalá",                                 price: "800 Kč · 2 hod"  },
          { name: "Melír nebo odbarvení",                           price: "1 000 Kč · 2 hod"},
          { name: "Úprava vousů (holení a styling)",                price: "200 Kč · 30 min" },
        ]
      },
      {
        icon: "⭐",
        title: "Dětské střihy",
        items: [
          { name: "Dětský střih (do 10 let)", price: "300 Kč · 30 min" },
        ]
      }
    ]
  },
  {
    tabId: "skincare",
    tabLabel: "Kosmetika & Nehty",
    note: "Kontaktujte nás pro aktuální ceník a více informací.",
    categories: [
      {
        icon: "🌿",
        title: "Kosmetická péče",
        items: [
          { name: "[Název služby — doplní salon]", price: "[Cena]" },
          { name: "[Název služby — doplní salon]", price: "[Cena]" },
        ]
      },
      {
        icon: "💅",
        title: "Manikúra & Nehty",
        items: [
          { name: "[Název služby — doplní salon]", price: "[Cena]" },
          { name: "[Název služby — doplní salon]", price: "[Cena]" },
        ]
      }
    ]
  }
];
