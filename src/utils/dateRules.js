// Fixed Czech public holidays as MM-DD
const CZ_HOLIDAYS = ['01-01', '05-01', '05-08', '07-05', '07-06', '09-28', '10-28', '11-17', '12-24', '12-25', '12-26']

// Gauss algorithm — returns Easter Sunday date
function easterSunday(year) {
  const a = year % 19, b = Math.floor(year / 100), c = year % 100
  const d = Math.floor(b / 4), e = b % 4, f = Math.floor((b + 8) / 25)
  const g = Math.floor((b - f + 1) / 3)
  const h = (19 * a + b - d - g + 15) % 30
  const i = Math.floor(c / 4), k = c % 4
  const l = (32 + 2 * e + 2 * i - h - k) % 7
  const m = Math.floor((a + 11 * h + 22 * l) / 451)
  const month = Math.floor((h + l - 7 * m + 114) / 31)
  const day = ((h + l - 7 * m + 114) % 31) + 1
  return new Date(year, month - 1, day)
}

export function isBlockedDate(dateStr, settings = {}) {
  if (!dateStr) return false
  const d = new Date(dateStr + 'T12:00:00')
  const dow = d.getDay()
  if (dow === 0 && settings.booking_sunday_closed !== 'false') return 'closed'
  if (dow === 6 && settings.booking_saturday_closed !== 'false') return 'closed'
  const mmdd = dateStr.slice(5)
  if (CZ_HOLIDAYS.includes(mmdd)) return 'holiday'
  const easter = easterSunday(d.getFullYear())
  const monday = new Date(easter)
  monday.setDate(monday.getDate() + 1)
  const easterMmdd = `${String(monday.getMonth() + 1).padStart(2, '0')}-${String(monday.getDate()).padStart(2, '0')}`
  if (mmdd === easterMmdd) return 'holiday'
  return false
}

export function formatDateDisplay(dateStr) {
  if (!dateStr) return ''
  try {
    return new Intl.DateTimeFormat('cs-CZ', { dateStyle: 'long' }).format(new Date(dateStr + 'T12:00:00'))
  } catch {
    return dateStr
  }
}

export function todayString() {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
}

export function nowTimeString() {
  const now = new Date()
  return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
}
