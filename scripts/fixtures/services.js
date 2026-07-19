export const SERVICES = [
  {
    id: 'women',
    label: 'Dámské',
    heading: 'Dámské kadeřnictví',
    description: 'Střihy, barvení a péče šité na míru vašim vlasům.',
    icon: '💇‍♀️',
    note: 'Ceny se mohou lišit podle délky a hustoty vlasů.',
    categories: [
      {
        title: 'Střihy & Styling',
        items: [
          {
            id: 'damsky-strih', icon: 'scissors', name: 'Dámský střih', desc: 'mytí, foukaná, styling', price: '800–1 500 Kč', workers: ['Kocka'],
            details: {
              text: 'Kompletní dámský střih zahrnuje mytí, profesionální střih přizpůsobený tvaru obličeje a typu vlasů, foukanou a závěrečný styling. Výsledkem je upravený, přirozený vzhled, který vám vydrží celé týdny.',
              photos: ['/assets/inside3_mirror.jpeg'],
            },
          },
          {
            id: 'spolecensky-uces', icon: 'crown', name: 'Společenský účes', desc: null, price: 'od 2 000 Kč', workers: ['Kocka'],
            details: {
              text: 'Slavnostní nebo večerní účes pro speciální příležitosti — svatby, plesy, galavečery. Tvoříme přesně podle vašich přání, s ohledem na váš outfit a celkový styl. Doporučujeme konzultaci předem.',
              photos: [],
            },
          },
          {
            id: 'vlny', icon: 'waves', name: 'Vlny', desc: null, price: 'od 1 000 Kč', workers: ['Kocka'],
            details: {
              text: 'Vytvoříme elegantní nebo přirozené vlny pomocí profesionálního vybavení. Ideální pro denní nošení i zvláštní příležitosti. Délka výsledku závisí na typu a délce vlasů.',
              photos: [],
            },
          },
        ],
      },
      {
        title: 'Barvení',
        items: [
          {
            id: 'barva', icon: 'brush', name: 'Barva', desc: null, price: '1 200–1 700 Kč', workers: ['Kocka', 'Maria'],
            details: {
              text: 'Jednolité přebarvení nebo korekce barvy vlasů. Používáme prémiové profesionální barvy šetrné k vlasům, které zajistí syté, trvanlivé výsledky a nádherný lesk.',
              photos: [],
            },
          },
          {
            id: 'airtouch', icon: 'sparkle', name: 'Airtouch', desc: null, price: '2 800–4 800 Kč', workers: ['Kocka', 'Maria'],
            details: {
              text: 'Moderní technika zesvětlení, při níž foukačem přirozeně odstraníme krátké vlasy a barvíme jen ty delší. Výsledkem je neuvěřitelně jemný, přirozený přechod od kořínků ke špičkám, který roste krásně.',
              photos: ['/assets/inside3_mirror.jpeg', '/assets/inside4_barbershop.jpeg'],
            },
          },
          {
            id: 'mikromelir', icon: 'dots', name: 'Mikromelír', desc: null, price: '2 600–4 600 Kč', workers: ['Kocka', 'Maria'],
            details: {
              text: 'Ruční technika nanášení barvy pomocí fólie po tenkých pramenech. Vytváří přirozený, osvěžující efekt jako od slunce — bez ostrých přechodů. Ideální pro jemné rozsvícení celé barvy.',
              photos: [],
            },
          },
          {
            id: 'balayage', icon: 'wand', name: 'Balayage', desc: null, price: '2 200–4 200 Kč', workers: ['Kocka', 'Maria'],
            details: {
              text: 'Francouzská technika volného nanášení zesvětlovače rukou, bez fólie. Výsledkem je sluncem políbený efekt s přirozenými přechody. Roste krásně a nevyžaduje časté opravy — ideální pro zaneprázdněné klientky.',
              photos: ['/assets/inside2.jpeg'],
            },
          },
          {
            id: 'stahovani-barvy', icon: 'flask', name: 'Stahování barvy', desc: null, price: '800–1 100 Kč', workers: ['Kocka', 'Maria'],
            details: {
              text: 'Bezpečné odstranění přebarvení nebo nežádoucího barevného nádechu. Šetrný postup s minimálním poškozením vlasů, který je ideální přípravou před novým barvením nebo výraznou změnou barvy.',
              photos: [],
            },
          },
          {
            id: 'preliv', icon: 'drop', name: 'Přeliv', desc: null, price: '700–1 100 Kč', workers: ['Kocka', 'Maria'],
            details: {
              text: 'Tonování vlasů bez amoniaku — sjednotí barvu, dodá lesk nebo jemně zakryje šedivé vlasy. Ošetření je šetrné a výsledek vydrží 4–6 týdnů.',
              photos: [],
            },
          },
        ],
      },
      {
        title: 'Péče & Ošetření',
        items: [
          {
            id: 'cisteni-vlasu', icon: 'drop', name: 'Čištění vlasů', desc: 'hloubkové čištění a péče', price: '700–1 800 Kč', workers: ['Kocka'],
            details: {
              text: 'Hloubkové čistění vlasové pokožky a vlasů od usazenin, přebytečného mazu a stylingových produktů. Obnovíme rovnováhu pokožky a připravíme vlasy na další péči nebo barvení.',
              photos: [],
            },
          },
          {
            id: 'curling-trvala', icon: 'curl', name: 'Curling (trvalá)', desc: null, price: '1 200–2 200 Kč', workers: ['Kocka'],
            details: {
              text: 'Trvalá ondulace pro trvale vlnité nebo kudrnaté vlasy. Používáme šetrné přípravky s minimálním poškozením struktury vlasů. Výsledek vydrží 3–6 měsíců v závislosti na péči o vlasy.',
              photos: [],
            },
          },
          {
            id: 'regeneracni-kura', icon: 'leaf', name: 'Regenerační kúra', desc: null, price: '600–1 200 Kč', workers: ['Kocka'],
            details: {
              text: 'Intenzivní ošetření pro suché, poškozené nebo chemicky ošetřené vlasy. Obnovíme vlákno vlasů zevnitř — vlasy získají zpět lesk, měkkost a snadnou rozčesatelnost.',
              photos: [],
            },
          },
          {
            id: 'botox-keratin', icon: 'drop', name: 'Botox, keratin', desc: null, price: '1 500–3 200 Kč', workers: ['Kocka'],
            details: {
              text: 'Hloubková rekonstrukce vlasů pomocí botoxu nebo keratinu. Vyhlazuje, zklidňuje a regeneruje — ideální pro poškozené, krepaté nebo chemicky ošetřené vlasy. Výsledek vydrží 3–5 měsíců.',
              photos: [],
            },
          },
        ],
      },
    ],
  },
  {
    id: 'men',
    label: 'Pánské & dětské',
    heading: 'Pánské a dětské střihy',
    description: 'Střihy pro muže i děti v příjemné atmosféře.',
    icon: '✂️',
    note: 'Ceny se mohou lišit podle délky a hustoty vlasů.',
    categories: [
      {
        title: 'Pánské střihy',
        items: [
          {
            id: 'panska-fade', icon: 'head', name: 'Pánský střih – Fade', desc: 'mytí, střih, styling', duration: '1 hod', price: '700 Kč', workers: ['Maks'],
            details: {
              text: 'Gradace boků a zátylku s plynulým přechodem od kůže nahoru. Střih je přizpůsoben tvaru hlavy a osobnímu stylu klienta. Zahrnuje mytí, profesionální střih a lehký styling.',
              photos: ['/assets/inside4_barbershop.jpeg'],
            },
          },
          {
            id: 'panska-klasika', icon: 'head', name: 'Pánský střih – Klasika', desc: 'mytí, střih, styling', duration: '1 hod', price: '600 Kč', workers: ['Maks'],
            details: {
              text: 'Nadčasový pánský střih nůžkami nebo strojkem bez gradace. Zahrnuje mytí, střih přizpůsobený tvaru hlavy a styling. Výsledek je čistý, upravený a konzervativní.',
              photos: [],
            },
          },
          {
            id: 'panska-curli', icon: 'headcurl', name: 'Curli (trvalá)', desc: 'pánská trvalá', duration: '2 hod', price: '800 Kč', workers: ['Maks'],
            details: {
              text: 'Pánská trvalá ondulace pro přirozené nebo výrazné vlny a kudrliny. Vhodná pro střední až delší vlasy. Výsledek vydrží 3–5 měsíců.',
              photos: [],
            },
          },
          {
            id: 'melir-odbarveni', icon: 'wand', name: 'Melír nebo odbarvení', desc: 'pánské barvení', duration: '2 hod', price: '1 000 Kč', workers: ['Maks'],
            details: {
              text: 'Pánské zesvětlení nebo melír pro přirozený, sluncem políbený efekt. Vhodné pro všechny délky vlasů. Výsledek je diskrétní a přirozený — nikdo nepozná.',
              photos: [],
            },
          },
          {
            id: 'uprava-vousu', icon: 'beard', name: 'Úprava vousů', desc: 'holení a styling', duration: '30 min', price: '200 Kč', workers: ['Maks'],
            details: {
              text: 'Profesionální úprava a tvarování vousů. Zahrnuje nastříhání do požadovaného tvaru, precizní úpravu obrysů a závěrečné ošetření. Vousy budou vypadat upraveně a stylově.',
              photos: [],
            },
          },
        ],
      },
      {
        title: 'Dětské střihy',
        items: [
          {
            id: 'detsky-strih', icon: 'child', name: 'Dětský střih', desc: 'pro děti do 10 let', duration: '30 min', price: '300 Kč', workers: ['Maks'],
            details: {
              text: 'Příjemný a rychlý střih pro děti do 10 let. Klidná, přátelská atmosféra a trpělivý přístup — ideální pro první i pravidelné návštěvy. Snažíme se, aby byl zážitek co nejpříjemnější.',
              photos: [],
            },
          },
        ],
      },
    ],
  },
  {
    id: 'skincare',
    label: 'Kosmetika & Nehty',
    heading: 'Kosmetika & Péče o nehty',
    description: 'Kosmetologie, permanentní make-up a péče o nehty.',
    icon: '✨',
    note: 'Ceník manikúry a nehtové modeláže vám ráda upřesní Sonya — kontaktujte nás pro aktuální ceny.',
    categories: [
      {
        title: 'Kosmetologie',
        items: [
          {
            id: 'kombinovane-cisteni-pleti', icon: 'drop', name: 'Kombinované čištění pleti', desc: 'dle stavu pleti', duration: '70–80 min', price: '1 500 Kč', workers: ['Siruy'],
            details: {
              text: 'Procedura zahrnuje:',
              steps: [
                'odlíčení a čištění pleti',
                'tonizaci',
                'peeling',
                'jemnou masáž obličeje',
                'ultrazvukové čištění',
                'lokální manuální čištění pomocí Uno lžičky',
                'peeling dle typu pleti',
                'závěrečnou tonizaci',
                'masku dle typu pleti',
                'aplikaci závěrečného krému a SPF ochrany',
              ],
              photos: [],
            },
          },
          {
            id: 'ultrazvukove-cisteni-pleti', icon: 'drop', name: 'Ultrazvukové čištění pleti', desc: null, duration: '60 min', price: '1 200 Kč', workers: ['Siruy'],
            details: {
              text: 'Součástí procedury je:',
              steps: [
                'odlíčení a čištění pleti',
                'tonizace',
                'peeling',
                'ultrazvukové čištění',
                'maska dle typu pleti',
                'aplikace závěrečného krému a SPF ochrany',
              ],
              photos: [],
            },
          },
        ],
      },
      {
        title: 'Barvení obočí a řas',
        items: [
          { id: 'barveni-obo-doplnek', icon: 'brush', name: 'Barvení obočí a řas – doplněk', desc: 'jako doplněk ke kosmetickému ošetření', price: '500 Kč', workers: ['Siruy'] },
          { id: 'barveni-obo-samostatne', icon: 'brush', name: 'Barvení obočí a řas – samostatně', desc: 'bez kosmetického ošetření', price: '1 000 Kč', workers: ['Siruy'] },
        ],
      },
      {
        title: 'Permanentní make-up',
        items: [
          { id: 'pmu-obo', icon: 'sparkle', name: 'Permanentní make-up obočí', desc: null, duration: 'do 2 hod', price: '3 500 Kč', workers: ['Siruy'] },
          { id: 'pmu-rty', icon: 'sparkle', name: 'Permanentní make-up rtů', desc: null, duration: 'do 2 hod', price: '3 500 Kč', workers: ['Siruy'] },
          { id: 'mezirasova-linka', icon: 'sparkle', name: 'Meziřasová linka', desc: 'mezřasová technika', duration: 'do 2 hod', price: '3 000 Kč', workers: ['Siruy'] },
        ],
      },
      {
        title: 'Manikúra & Nehty',
        items: [
          { id: 'manikura-1', icon: 'nail', name: '[Název služby]', desc: 'doplní salon', price: '[Cena]', workers: ['Sonya'] },
          { id: 'manikura-2', icon: 'nail', name: '[Název služby]', desc: 'doplní salon', price: '[Cena]', workers: ['Sonya'] },
        ],
      },
    ],
  },
]

export const ALL_ITEMS = SERVICES.flatMap(tab =>
  tab.categories.flatMap(cat =>
    cat.items.map(item => ({ ...item, tabId: tab.id, tabLabel: tab.label, categoryTitle: cat.title }))
  )
)

export const ITEMS_BY_ID = Object.fromEntries(ALL_ITEMS.map(item => [item.id, item]))

if (import.meta.env?.DEV) {
  const ids = ALL_ITEMS.map(i => i.id)
  const dupes = ids.filter((id, i) => ids.indexOf(id) !== i)
  if (dupes.length) console.error('Duplicate service ids in services.js:', dupes)
}
