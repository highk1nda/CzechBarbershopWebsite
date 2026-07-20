import { useBookingCart } from '../../../context/BookingCartContext'
import { useContent } from '../../../context/ContentContext'
import { formatDateDisplay } from '../../../utils/dateRules'
import { FloatingInput, FloatingTextarea } from '../FloatingInput'

const SUBMIT_ERROR_MESSAGES = {
  slot_taken: 'Tento termín právě obsadil jiný zákazník. Vyberte prosím jiný čas.',
  no_specialist_available: 'V tuto chvíli nemáme volného specialistu pro zvolený termín. Zkuste prosím jiný čas nebo den.',
  outside_business_hours: 'Zvolený čas je mimo otevírací dobu. Vyberte prosím jiný termín.',
  time_in_past: 'Zvolený čas už uplynul. Vyberte prosím jiný termín.',
  date_in_past: 'Zvolené datum už uplynulo. Vyberte prosím jiný termín.',
  specialist_unavailable: 'Zvolený specialista již není dostupný. Zkuste to prosím bez preference nebo s jiným specialistou.',
}
const SUBMIT_ERRORS_NEEDING_NEW_TIME = new Set([
  'slot_taken',
  'no_specialist_available',
  'outside_business_hours',
  'time_in_past',
  'date_in_past',
  'specialist_unavailable',
])

function ReviewPhase() {
  const { state, cartItems, priceEstimate, durationEstimate, setDetailsPhase, submitBooking, canSubmit, goToStep } = useBookingCart()
  const { team } = useContent()
  const { name, email, phone } = state.details
  const stylistName = team.find((m) => m.id === state.appointment.stylist)?.name

  return (
    <div className="rounded-3xl border border-stone bg-white shadow-soft p-6 sm:p-8">
      <h3 className="font-heading text-2xl text-ink mb-1">Shrnutí rezervace</h3>
      <p className="font-body text-sm text-warm mb-6">Zkontrolujte prosím údaje před odesláním.</p>

      <div className="space-y-4 mb-6">
        <div>
          <p className="font-body text-[10px] tracking-widest uppercase text-mauve mb-1.5">Služby</p>
          <ul className="space-y-1">
            {cartItems.map((item) => (
              <li key={item.id} className="flex justify-between gap-4 font-body text-sm text-charcoal">
                <span>{item.name}</span>
                <span className="text-mauve-deep font-semibold flex-shrink-0">{item.price}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="grid grid-cols-2 gap-4 border-t border-stone pt-4">
          <div>
            <p className="font-body text-[10px] tracking-widest uppercase text-mauve mb-1">Odhad délky</p>
            <p className="font-body text-sm text-ink">{durationEstimate.label}</p>
          </div>
          <div>
            <p className="font-body text-[10px] tracking-widest uppercase text-mauve mb-1">Odhad ceny</p>
            <p className="font-body text-sm text-mauve-deep font-semibold">{priceEstimate.label}</p>
          </div>
          <div>
            <p className="font-body text-[10px] tracking-widest uppercase text-mauve mb-1">Datum</p>
            <p className="font-body text-sm text-ink">{formatDateDisplay(state.appointment.date)}</p>
          </div>
          <div>
            <p className="font-body text-[10px] tracking-widest uppercase text-mauve mb-1">Čas</p>
            <p className="font-body text-sm text-ink">{state.appointment.time}</p>
          </div>
          {stylistName && (
            <div>
              <p className="font-body text-[10px] tracking-widest uppercase text-mauve mb-1">Specialista</p>
              <p className="font-body text-sm text-ink">{stylistName}</p>
            </div>
          )}
        </div>

        <div className="border-t border-stone pt-4">
          <p className="font-body text-[10px] tracking-widest uppercase text-mauve mb-1">Kontakt</p>
          <p className="font-body text-sm text-ink">{name}</p>
          <p className="font-body text-sm text-charcoal">{[email, phone].filter(Boolean).join(' · ')}</p>
        </div>
      </div>

      {state.status === 'error' && (
        <div className="mb-4">
          <p className="font-body text-sm text-red-500">
            {SUBMIT_ERROR_MESSAGES[state.submitError] || 'Něco se pokazilo. Zkuste to znovu nebo nás kontaktujte přímo.'}
          </p>
          {SUBMIT_ERRORS_NEEDING_NEW_TIME.has(state.submitError) && (
            <button
              type="button"
              onClick={() => goToStep(2)}
              className="font-body text-xs text-mauve underline hover:text-mauve-deep mt-2"
            >
              Vybrat jiný termín
            </button>
          )}
        </div>
      )}

      <div className="flex justify-between">
        <button
          type="button"
          onClick={() => setDetailsPhase('form')}
          className="border border-stone text-warm font-body text-xs tracking-widest2 uppercase px-6 py-3 rounded-full hover:border-mauve hover:text-mauve transition-all duration-300"
        >
          Zpět
        </button>
        <button
          type="button"
          onClick={submitBooking}
          disabled={!canSubmit}
          className="bg-mauve text-white font-body text-xs tracking-widest2 uppercase px-6 py-3 rounded-full hover:bg-mauve-deep transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {state.status === 'sending' ? 'Odesílám…' : 'Potvrdit rezervaci'}
        </button>
      </div>
    </div>
  )
}

function FormPhase() {
  const { state, setDetailsField, setDetailsPhase, prevStep } = useBookingCart()
  const { name, email, phone, message } = state.details
  const formValid = name.trim().length > 0 && (email.trim().length > 0 || phone.trim().length > 0)

  return (
    <div className="rounded-3xl border border-stone bg-white shadow-soft p-6 sm:p-8">
      <h3 className="font-heading text-2xl text-ink mb-1">Vaše údaje</h3>
      <p className="font-body text-sm text-warm mb-6">Jméno a alespoň jeden kontakt (email nebo telefon).</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <FloatingInput label="Jméno *" value={name} onChange={(v) => setDetailsField('name', v)} required />
        <FloatingInput label="Email" type="email" value={email} onChange={(v) => setDetailsField('email', v)} />
      </div>
      <div className="mb-4 sm:w-1/2 sm:pr-2">
        <FloatingInput label="Telefon" type="tel" value={phone} onChange={(v) => setDetailsField('phone', v)} />
      </div>
      <div className="mb-6">
        <FloatingTextarea label="Zpráva (volitelné)" value={message} onChange={(v) => setDetailsField('message', v)} />
      </div>

      {!formValid && (
        <p className="font-body text-xs text-stone mb-4">
          {!name.trim() ? 'Zadejte své jméno.' : 'Zadejte email nebo telefon.'}
        </p>
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
          onClick={() => setDetailsPhase('review')}
          disabled={!formValid}
          className="bg-mauve text-white font-body text-xs tracking-widest2 uppercase px-6 py-3 rounded-full hover:bg-mauve-deep transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Zkontrolovat rezervaci →
        </button>
      </div>
    </div>
  )
}

export default function StepDetails() {
  const { state } = useBookingCart()
  return state.detailsPhase === 'review' ? <ReviewPhase /> : <FormPhase />
}
