export const SERVICES = [
  {
    id: 'women',
    label: 'Dámské',
    heading: 'Dámské kadeřnictví',
    note: 'Ceny se mohou lišit podle délky a hustoty vlasů.',
    categories: [
      {
        title: 'Střihy & Styling',
        items: [
          { icon: 'scissors', name: 'Dámský střih',      desc: 'mytí, foukaná, styling',  price: '800–1 500 Kč',  workers: ['Kocka'] },
          { icon: 'crown',    name: 'Společenský účes',  desc: null,                       price: 'od 2 000 Kč',   workers: ['Kocka'] },
          { icon: 'waves',    name: 'Vlny',               desc: null,                       price: 'od 1 000 Kč',   workers: ['Kocka'] },
        ],
      },
      {
        title: 'Barvení',
        items: [
          { icon: 'brush',    name: 'Barva',              desc: null,                  price: '1 200–1 700 Kč', workers: ['Kocka', 'Maria'] },
          { icon: 'sparkle',  name: 'Airtouch',           desc: null,                  price: '2 800–4 800 Kč', workers: ['Kocka', 'Maria'] },
          { icon: 'dots',     name: 'Mikromelír',         desc: null,                  price: '2 600–4 600 Kč', workers: ['Kocka', 'Maria'] },
          { icon: 'wand',     name: 'Balayage',           desc: null,                  price: '2 200–4 200 Kč', workers: ['Kocka', 'Maria'] },
          { icon: 'flask',    name: 'Stahování barvy',    desc: null,                  price: '800–1 100 Kč',   workers: ['Kocka', 'Maria'] },
          { icon: 'drop',     name: 'Přeliv',             desc: null,                  price: '700–1 100 Kč',   workers: ['Kocka', 'Maria'] },
        ],
      },
      {
        title: 'Péče & Ošetření',
        items: [
          { icon: 'drop',     name: 'Čištění vlasů',      desc: 'hloubkové čištění a péče', price: '700–1 800 Kč',   workers: ['Kocka'] },
          { icon: 'curl',     name: 'Curling (trvalá)',    desc: null,                        price: '1 200–2 200 Kč', workers: ['Kocka'] },
          { icon: 'leaf',     name: 'Regenerační kúra',   desc: null,                        price: '600–1 200 Kč',   workers: ['Kocka'] },
          { icon: 'drop',     name: 'Botox, keratin',     desc: null,                        price: '1 500–3 200 Kč', workers: ['Kocka'] },
        ],
      },
    ],
  },
  {
    id: 'men',
    label: 'Pánské & dětské',
    heading: 'Pánské a dětské střihy',
    note: 'Ceny se mohou lišit podle délky a hustoty vlasů.',
    categories: [
      {
        title: 'Pánské střihy',
        items: [
          { icon: 'head',     name: 'Pánský střih – Fade',    desc: 'mytí, střih, styling', duration: '1 hod',   price: '700 Kč',   workers: ['Maks'] },
          { icon: 'head',     name: 'Pánský střih – Klasika', desc: 'mytí, střih, styling', duration: '1 hod',   price: '600 Kč',   workers: ['Maks'] },
          { icon: 'headcurl', name: 'Curli (trvalá)',          desc: 'pánská trvalá',         duration: '2 hod',   price: '800 Kč',   workers: ['Maks'] },
          { icon: 'wand',     name: 'Melír nebo odbarvení',   desc: 'pánské barvení',        duration: '2 hod',  price: '1 000 Kč',  workers: ['Maks'] },
          { icon: 'beard',    name: 'Úprava vousů',           desc: 'holení a styling',      duration: '30 min',  price: '200 Kč',   workers: ['Maks'] },
        ],
      },
      {
        title: 'Dětské střihy',
        items: [
          { icon: 'child',    name: 'Dětský střih',           desc: 'pro děti do 10 let',    duration: '30 min',  price: '300 Kč',   workers: ['Maks'] },
        ],
      },
    ],
  },
  {
    id: 'skincare',
    label: 'Kosmetika & Nehty',
    heading: 'Kosmetika & Péče o nehty',
    note: 'Kontaktujte nás pro aktuální ceník.',
    categories: [
      {
        title: 'Kosmetická péče',
        items: [
          { icon: 'flower', name: '[Název služby]', desc: 'doplní salon', price: '[Cena]', workers: ['Siruy'] },
          { icon: 'flower', name: '[Název služby]', desc: 'doplní salon', price: '[Cena]', workers: ['Siruy'] },
        ],
      },
      {
        title: 'Manikúra & Nehty',
        items: [
          { icon: 'nail', name: '[Název služby]', desc: 'doplní salon', price: '[Cena]', workers: ['Sonya'] },
          { icon: 'nail', name: '[Název služby]', desc: 'doplní salon', price: '[Cena]', workers: ['Sonya'] },
        ],
      },
    ],
  },
]
