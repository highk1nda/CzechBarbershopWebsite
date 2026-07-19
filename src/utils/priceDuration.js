// Shared by: cart aggregation (src/utils/cartCalculations.js), the admin
// service form's live price/duration preview, and the one-time migration
// script (scripts/migrate-to-supabase.mjs) — kept in one place so all three
// agree on the same parsing/formatting rules.

// Converts a legacy free-text price string (e.g. "800–1 500 Kč", "od 2 000 Kč",
// "[Cena]") into structured values. Used only by the migration script to seed
// the new numeric columns from the old data file — the live app never parses
// price strings once migrated.
export function parsePrice(priceStr) {
  if (!priceStr || priceStr.includes('[')) return { unknown: true }
  const openEnded = /^od\s/i.test(priceStr.trim())
  const numbers = (priceStr.match(/\d[\d\s]*\d|\d/g) || []).map(n => parseInt(n.replace(/\s/g, ''), 10))
  if (numbers.length === 0) return { unknown: true }
  return { unknown: false, min: Math.min(...numbers), max: Math.max(...numbers), openEnded }
}

// Converts a legacy free-text duration string (e.g. "1 hod", "30 min", "do 2 hod")
// into structured minutes. Migration-script-only, see parsePrice above.
export function parseDuration(durationStr) {
  if (!durationStr) return null
  const str = durationStr.trim()
  const upTo = /^do\s/i.test(str)
  const unit = str.includes('hod') ? 'hod' : 'min'
  const numbers = (str.match(/\d+/g) || []).map(Number)
  if (numbers.length === 0) return null
  const minutes = numbers.map(n => (unit === 'hod' ? n * 60 : n))
  return { min: Math.min(...minutes), max: Math.max(...minutes), upTo }
}

export function formatPriceRange(min, max, openEnded) {
  if (min == null) return 'Cena bude upřesněna'
  const fmt = (n) => n.toLocaleString('cs-CZ')
  if (openEnded) return `od ${fmt(min)} Kč`
  if (max == null || min === max) return `${fmt(min)} Kč`
  return `${fmt(min)}–${fmt(max)} Kč`
}

export function formatMinutes(mins) {
  if (mins < 60) return `${mins} min`
  const h = Math.floor(mins / 60)
  const rest = mins % 60
  return rest === 0 ? `${h} hod` : `${h} hod ${rest} min`
}

export function formatDurationRange(min, max, upTo) {
  if (min == null) return null
  if (upTo) return `do ${formatMinutes(max ?? min)}`
  if (max == null || min === max) return formatMinutes(min)
  return `${formatMinutes(min)}–${formatMinutes(max)}`
}

// Convenience wrappers over the structured `services` table columns —
// what ContentContext and the admin form's live preview call directly.
export function formatItemPrice({ price_unknown, price_min, price_max, price_open_ended }) {
  if (price_unknown || price_min == null) return 'Cena bude upřesněna'
  return formatPriceRange(price_min, price_max, price_open_ended)
}

export function formatItemDuration({ duration_min_minutes, duration_max_minutes, duration_up_to }) {
  if (duration_min_minutes == null) return null
  return formatDurationRange(duration_min_minutes, duration_max_minutes, duration_up_to)
}
