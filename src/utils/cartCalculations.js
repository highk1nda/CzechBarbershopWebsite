function parsePrice(priceStr) {
  if (!priceStr || priceStr.includes('[')) return { unknown: true }
  const openEnded = /^od\s/i.test(priceStr.trim())
  const numbers = (priceStr.match(/\d[\d\s]*\d|\d/g) || []).map(n => parseInt(n.replace(/\s/g, ''), 10))
  if (numbers.length === 0) return { unknown: true }
  return { unknown: false, min: Math.min(...numbers), max: Math.max(...numbers), openEnded }
}

function parseDuration(durationStr) {
  if (!durationStr) return null
  const str = durationStr.trim()
  const upTo = /^do\s/i.test(str)
  const unit = str.includes('hod') ? 'hod' : 'min'
  const numbers = (str.match(/\d+/g) || []).map(Number)
  if (numbers.length === 0) return null
  const minutes = numbers.map(n => (unit === 'hod' ? n * 60 : n))
  return { min: Math.min(...minutes), max: Math.max(...minutes), upTo }
}

function formatPriceRange(min, max, openEnded) {
  const fmt = (n) => n.toLocaleString('cs-CZ')
  if (openEnded) return `od ${fmt(min)} Kč`
  if (min === max) return `${fmt(min)} Kč`
  return `${fmt(min)}–${fmt(max)} Kč`
}

function formatMinutes(mins) {
  if (mins < 60) return `${mins} min`
  const h = Math.floor(mins / 60)
  const rest = mins % 60
  return rest === 0 ? `${h} hod` : `${h} hod ${rest} min`
}

function formatDurationRange(min, max, upTo) {
  if (upTo) return `do ${formatMinutes(max)}`
  if (min === max) return formatMinutes(min)
  return `${formatMinutes(min)}–${formatMinutes(max)}`
}

export function aggregateCart(items) {
  if (items.length === 0) return { price: null, duration: null }

  let priceUnknown = false
  let priceOpenEnded = false
  let priceMin = 0
  let priceMax = 0

  let durationUnknown = false
  let durationUpTo = false
  let durationMin = 0
  let durationMax = 0

  for (const item of items) {
    const p = parsePrice(item.price)
    if (p.unknown) {
      priceUnknown = true
    } else {
      priceMin += p.min
      priceMax += p.max
      if (p.openEnded) priceOpenEnded = true
    }

    const d = parseDuration(item.duration)
    if (!d) {
      durationUnknown = true
    } else {
      durationMin += d.min
      durationMax += d.max
      if (d.upTo) durationUpTo = true
    }
  }

  return {
    price: {
      label: priceUnknown ? 'Cena bude upřesněna' : formatPriceRange(priceMin, priceMax, priceOpenEnded),
    },
    duration: {
      label: durationUnknown ? 'Přesnou dobu upřesníme při potvrzení' : formatDurationRange(durationMin, durationMax, durationUpTo),
    },
  }
}

export function pluralizeSluzba(n) {
  if (n === 1) return 'službu'
  if (n >= 2 && n <= 4) return 'služby'
  return 'služeb'
}
