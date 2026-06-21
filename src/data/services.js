export const SERVICES = [
  {
    id: 'women',
    label: 'Dámské kadeřnictví',
    note: 'Ceny se mohou lišit podle délky a hustoty vlasů.',
    categories: [
      {
        icon: '✂',
        title: 'Střihy & Styling',
        items: [
          { name: 'Dámský střih (mytí, foukaná, styling)', price: '800–1 500 Kč' },
          { name: 'Společenský účes',                      price: 'od 2 000 Kč'  },
          { name: 'Vlny',                                   price: 'od 1 000 Kč'  },
        ],
      },
      {
        icon: '◈',
        title: 'Barvení',
        items: [
          { name: 'Barva',           price: '1 200–1 700 Kč' },
          { name: 'Airtouch',        price: '2 800–4 800 Kč' },
          { name: 'Mikromelír',      price: '2 600–4 600 Kč' },
          { name: 'Balayage',        price: '2 200–4 200 Kč' },
          { name: 'Stahování barvy', price: '800–1 100 Kč'   },
          { name: 'Přeliv',          price: '700–1 100 Kč'   },
        ],
      },
      {
        icon: '◇',
        title: 'Péče & Ošetření',
        items: [
          { name: 'Čištění vlasů (hloubkové čištění a péče)', price: '700–1 800 Kč'   },
          { name: 'Curling (trvalá)',                          price: '1 200–2 200 Kč' },
          { name: 'Regenerační kúra',                          price: '600–1 200 Kč'   },
          { name: 'Botox, keratin',                            price: '1 500–3 200 Kč' },
        ],
      },
    ],
  },
  {
    id: 'men',
    label: 'Pánské & dětské',
    note: 'Ceny se mohou lišit podle délky a hustoty vlasů.',
    categories: [
      {
        icon: '⌁',
        title: 'Pánské střihy',
        items: [
          { name: 'Fade (mytí, střih, styling)',   price: '700 Kč · 1 hod'   },
          { name: 'Klasika (mytí, střih, styling)', price: '600 Kč · 1 hod'  },
          { name: 'Curli – trvalá',                 price: '800 Kč · 2 hod'  },
          { name: 'Melír nebo odbarvení',            price: '1 000 Kč · 2 hod'},
          { name: 'Úprava vousů',                   price: '200 Kč · 30 min' },
        ],
      },
      {
        icon: '✦',
        title: 'Dětské střihy',
        items: [
          { name: 'Dětský střih (do 10 let)', price: '300 Kč · 30 min' },
        ],
      },
    ],
  },
  {
    id: 'skincare',
    label: 'Kosmetika & Nehty',
    note: 'Kontaktujte nás pro aktuální ceník.',
    categories: [
      {
        icon: '✿',
        title: 'Kosmetická péče',
        items: [
          { name: '[Název služby — doplní salon]', price: '[Cena]' },
          { name: '[Název služby — doplní salon]', price: '[Cena]' },
        ],
      },
      {
        icon: '◈',
        title: 'Manikúra & Nehty',
        items: [
          { name: '[Název služby — doplní salon]', price: '[Cena]' },
          { name: '[Název služby — doplní salon]', price: '[Cena]' },
        ],
      },
    ],
  },
]
