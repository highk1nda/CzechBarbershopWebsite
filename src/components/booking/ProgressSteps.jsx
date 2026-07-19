import { useBookingCart } from '../../context/BookingCartContext'

const STEPS = [
  { n: 1, label: 'Služby' },
  { n: 2, label: 'Termín' },
  { n: 3, label: 'Údaje' },
  { n: 4, label: 'Potvrzení' },
]

export default function ProgressSteps() {
  const { state } = useBookingCart()

  return (
    <ol className="flex items-center" aria-label="Postup rezervace">
      {STEPS.map((s, i) => (
        <li key={s.n} className="flex items-center flex-1 last:flex-none">
          <div className="flex items-center gap-2.5">
            <span
              aria-current={state.step === s.n ? 'step' : undefined}
              className={`flex items-center justify-center w-8 h-8 rounded-full border font-body text-xs flex-shrink-0 transition-colors duration-300 ${
                state.step === s.n
                  ? 'bg-mauve border-mauve text-white'
                  : state.step > s.n
                  ? 'bg-mauve/15 border-mauve/40 text-mauve-deep'
                  : 'border-stone text-frost'
              }`}
            >
              {state.step > s.n ? '✓' : s.n}
            </span>
            <span
              className={`hidden sm:inline font-body text-xs tracking-widest uppercase whitespace-nowrap ${
                state.step === s.n ? 'text-ink' : 'text-frost'
              }`}
            >
              {s.label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <span
              aria-hidden="true"
              className={`flex-1 h-px mx-3 sm:mx-4 transition-colors duration-300 ${
                state.step > s.n ? 'bg-mauve/50' : 'bg-stone'
              }`}
            />
          )}
        </li>
      ))}
    </ol>
  )
}
