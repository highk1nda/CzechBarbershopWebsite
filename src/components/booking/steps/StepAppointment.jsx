import { useBookingCart } from '../../../context/BookingCartContext'
import { isBlockedDate } from '../../../utils/dateRules'
import DatePicker from '../DatePicker'
import TimePills from '../TimePills'
import StylistPills from '../StylistPills'
import { FloatingTextarea } from '../FloatingInput'

export default function StepAppointment() {
  const { state, setAppointmentField, setDateError, prevStep, nextStep } = useBookingCart()
  const { date, time, stylist, notes } = state.appointment

  function handleDateChange(val) {
    const blocked = isBlockedDate(val)
    if (blocked === 'weekend') {
      setDateError('Pracujeme pouze Po–Pá. Zvolte pracovní den.')
      return
    }
    if (blocked === 'holiday') {
      setDateError('Tento den je státní svátek. Zvolte jiný termín.')
      return
    }
    setDateError('')
    setAppointmentField('date', val)
  }

  const canContinue = Boolean(date) && Boolean(time)

  return (
    <div className="rounded-3xl border border-stone bg-white shadow-soft p-6 sm:p-8">
      <h3 className="font-heading text-2xl text-ink mb-1">Vyberte termín</h3>
      <p className="font-body text-sm text-warm mb-6">Zvolte datum, čas a volitelně preferovaného specialistu.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <p className="font-body text-[10px] tracking-widest uppercase text-mauve mb-2">Datum *</p>
          <DatePicker value={date} onChange={handleDateChange} />
          {state.dateError && <p className="font-body text-xs text-mauve-deep mt-2">{state.dateError}</p>}
        </div>
        <div>
          <p className="font-body text-[10px] tracking-widest uppercase text-mauve mb-2">Čas *</p>
          <TimePills value={time} onChange={(v) => setAppointmentField('time', v)} />
        </div>
      </div>

      <div className="mb-6">
        <p className="font-body text-[10px] tracking-widest uppercase text-mauve mb-2">Preferovaný specialista (volitelné)</p>
        <StylistPills value={stylist} onChange={(v) => setAppointmentField('stylist', v)} />
      </div>

      <div className="mb-8">
        <FloatingTextarea label="Poznámka (volitelné)" value={notes} onChange={(v) => setAppointmentField('notes', v)} />
      </div>

      {!canContinue && (
        <p className="font-body text-xs text-stone mb-4">Zadejte datum a čas.</p>
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
