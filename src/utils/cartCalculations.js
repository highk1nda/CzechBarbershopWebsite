import { formatPriceRange, formatDurationRange } from './priceDuration'

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
    if (item.price_unknown || item.price_min == null) {
      priceUnknown = true
    } else {
      priceMin += item.price_min
      priceMax += item.price_max ?? item.price_min
      if (item.price_open_ended) priceOpenEnded = true
    }

    if (item.duration_min_minutes == null) {
      durationUnknown = true
    } else {
      durationMin += item.duration_min_minutes
      durationMax += item.duration_max_minutes ?? item.duration_min_minutes
      if (item.duration_up_to) durationUpTo = true
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
