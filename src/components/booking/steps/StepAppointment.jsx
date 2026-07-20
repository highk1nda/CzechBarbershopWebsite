import { useCallback, useEffect, useState } from 'react'
import { useBookingCart } from '../../../context/BookingCartContext'
import { useContent } from '../../../context/ContentContext'
import { supabase } from '../../../lib/supabaseClient'
import { isBlockedDate, todayString, nowTimeString } from '../../../utils/dateRules'
import { effectiveDurationMinutes } from '../../../utils/cartCalculations'
import {
  getDaySchedule,
  generateSlotStarts,
  computeQualifiedTeamMemberIds,
  computeAvailableSlots,
} from '../../../utils/availability'
import DatePicker from '../DatePicker'
import TimePills from '../TimePills'
import StylistPills from '../StylistPills'
import { FloatingTextarea } from '../FloatingInput'

export default function StepAppointment() {
  const { state, cartItems, setAppointmentField, setDateError, setStylist, prevStep, nextStep } = useBookingCart()
  const { settings, team, loading: contentLoading } = useContent()
  const { date, time, stylist, notes } = state.appointment

  const [bookedRanges, setBookedRanges] = useState({})
  const [slotsLoading, setSlotsLoading] = useState(false)
  const [slotsError, setSlotsError] = useState(false)

  const fetchBookedRanges = useCallback((forDate) => {
    if (!forDate) return
    let cancelled = false
    setSlotsLoading(true)
    setSlotsError(false)
    supabase
      .rpc('get_booked_ranges', { p_date: forDate })
      .then(({ data, error }) => {
        if (cancelled) return
        if (error) {
          setSlotsError(true)
          setSlotsLoading(false)
          return
        }
        const byMember = {}
        for (const row of data) (byMember[row.team_member_id] ??= []).push(row)
        setBookedRanges(byMember)
        setSlotsLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => fetchBookedRanges(date), [date, fetchBookedRanges])

  function handleDateChange(val) {
    const blocked = isBlockedDate(val, settings)
    if (blocked === 'closed') {
      setDateError('V tento den je zavřeno. Zvolte prosím jiný termín.')
      return
    }
    if (blocked === 'holiday') {
      setDateError('Tento den je státní svátek. Zvolte jiný termín.')
      return
    }
    setDateError('')
    setAppointmentField('date', val)
  }

  const durationMinutes = effectiveDurationMinutes(cartItems)
  const qualifiedIds = computeQualifiedTeamMemberIds(cartItems, team)
  const allActiveIds = team.map((m) => m.id)
  const schedule = getDaySchedule(date, settings)
  const candidateSlots = generateSlotStarts(schedule.open, schedule.close, durationMinutes)
  const availableSet = computeAvailableSlots({
    candidateSlots,
    durationMinutes,
    bookedRanges,
    selectedStylistId: stylist || null,
    qualifiedIds,
    allActiveIds,
    todayFloorTime: date === todayString() ? nowTimeString() : null,
  })

  const canContinue = Boolean(date) && Boolean(time) && availableSet.has(time)

  if (contentLoading) {
    return (
      <div className="rounded-3xl border border-stone bg-white shadow-soft p-6 sm:p-8">
        <p className="font-body text-sm text-warm">Načítání…</p>
      </div>
    )
  }

  return (
    <div className="rounded-3xl border border-stone bg-white shadow-soft p-6 sm:p-8">
      <h3 className="font-heading text-2xl text-ink mb-1">Vyberte termín</h3>
      <p className="font-body text-sm text-warm mb-6">Zvolte datum, čas a volitelně preferovaného specialistu.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <p className="font-body text-[10px] tracking-widest uppercase text-mauve mb-2">Datum *</p>
          <DatePicker value={date} onChange={handleDateChange} settings={settings} />
          {state.dateError && <p className="font-body text-xs text-mauve-deep mt-2">{state.dateError}</p>}
        </div>
        <div>
          <p className="font-body text-[10px] tracking-widest uppercase text-mauve mb-2">Čas *</p>
          {date ? (
            <TimePills
              value={time}
              onChange={(v) => setAppointmentField('time', v)}
              slots={candidateSlots}
              availableSet={availableSet}
              loading={slotsLoading}
              error={slotsError}
              onRetry={() => fetchBookedRanges(date)}
            />
          ) : (
            <p className="font-body text-sm text-warm">Nejprve vyberte datum.</p>
          )}
        </div>
      </div>

      <div className="mb-6">
        <p className="font-body text-[10px] tracking-widest uppercase text-mauve mb-2">Preferovaný specialista (volitelné)</p>
        <StylistPills value={stylist} onChange={setStylist} qualifiedIds={qualifiedIds} />
      </div>

      <div className="mb-8">
        <FloatingTextarea label="Poznámka (volitelné)" value={notes} onChange={(v) => setAppointmentField('notes', v)} />
      </div>

      {!canContinue && (
        <p className="font-body text-xs text-stone mb-4">Zadejte datum a volný čas.</p>
      )}

      <div className="flex justify-between">
        <button
          type="button"
          onClick={prevStep}
          className="border border-stone text-warm font-body text-xs tracking-widest2 uppercase px-6 py-3 rounded-full hover:border-mauve hover:text-mauve transition-all duration-300"
        >
          Zpět
        </button>
        <button
          type="button"
          onClick={nextStep}
          disabled={!canContinue}
          className="bg-mauve text-white font-body text-xs tracking-widest2 uppercase px-6 py-3 rounded-full hover:bg-mauve-deep transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Pokračovat →
        </button>
      </div>
    </div>
  )
}
