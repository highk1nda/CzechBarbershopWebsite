// Structured business-hours + slot/qualification helpers, driven by the
// booking_* keys in site_settings — single source of truth shared by
// Contact.jsx (display) and the booking flow (slot generation), replacing
// the old hardcoded window in dateRules.js.

export function getDaySchedule(dateStr, settings) {
  if (!dateStr) return { closed: true, open: null, close: null }
  const dow = new Date(dateStr + 'T12:00:00').getDay()
  if (dow === 0) return { closed: settings.booking_sunday_closed !== 'false', open: null, close: null }
  if (dow === 6) {
    return {
      closed: settings.booking_saturday_closed === 'true',
      open: settings.booking_saturday_open ?? null,
      close: settings.booking_saturday_close ?? null,
    }
  }
  return { closed: false, open: settings.booking_weekday_open ?? null, close: settings.booking_weekday_close ?? null }
}

export function formatHoursRange(open, close) {
  return open && close ? `${open} – ${close}` : ''
}

function toMinutes(hhmm) {
  const [h, m] = hhmm.split(':').map(Number)
  return h * 60 + m
}

function toHHMM(mins) {
  return `${String(Math.floor(mins / 60)).padStart(2, '0')}:${String(mins % 60).padStart(2, '0')}`
}

export function addMinutesToTime(hhmm, minutes) {
  return toHHMM(toMinutes(hhmm) + minutes)
}

// Half-open interval overlap — used by the admin edit page's live conflict
// warning (the public flow uses computeAvailableSlots instead).
export function doTimesOverlap(aStart, aEnd, bStart, bEnd) {
  return toMinutes(aStart) < toMinutes(bEnd) && toMinutes(aEnd) > toMinutes(bStart)
}

// Pure — candidate start times such that start + duration fits before close.
export function generateSlotStarts(open, close, durationMinutes, stepMinutes = 30) {
  if (!open || !close || !durationMinutes) return []
  const openM = toMinutes(open)
  const closeM = toMinutes(close)
  const slots = []
  for (let t = openM; t + durationMinutes <= closeM; t += stepMinutes) slots.push(toHHMM(t))
  return slots
}

// Team members qualified for EVERY item in the cart (intersection of
// item.workerIds). Empty array means "nobody does the whole combination" —
// callers fall back to "any active member" per the auto-assign design.
export function computeQualifiedTeamMemberIds(cartItems, team) {
  if (cartItems.length === 0) return team.map((m) => m.id)
  const sets = cartItems.map((item) => new Set(item.workerIds ?? []))
  return team.map((m) => m.id).filter((id) => sets.every((s) => s.has(id)))
}

function isSlotFreeForMember(memberId, start, durationMinutes, bookedRanges) {
  const startM = toMinutes(start)
  const endM = startM + durationMinutes
  return (bookedRanges[memberId] ?? []).every((r) => {
    const rStart = toMinutes(r.starts_at.slice(0, 5))
    const rEnd = toMinutes(r.ends_at.slice(0, 5))
    return endM <= rStart || startM >= rEnd
  })
}

// candidateSlots come from generateSlotStarts(). Returns the subset that's
// actually bookable given who's free (selectedStylistId narrows to one
// person; otherwise checks the qualified pool, falling back to all active),
// and — when the selected date is today — excludes slots already in the past.
export function computeAvailableSlots({
  candidateSlots,
  durationMinutes,
  bookedRanges,
  selectedStylistId,
  qualifiedIds,
  allActiveIds,
  todayFloorTime,
}) {
  const pool = selectedStylistId ? [selectedStylistId] : qualifiedIds.length > 0 ? qualifiedIds : allActiveIds
  const floorM = todayFloorTime ? toMinutes(todayFloorTime) : null
  return new Set(
    candidateSlots.filter((start) => {
      if (floorM !== null && toMinutes(start) < floorM) return false
      return pool.some((id) => isSlotFreeForMember(id, start, durationMinutes, bookedRanges))
    })
  )
}
