import { TIME_SLOTS } from '../../utils/dateRules'

export default function TimePills({ value, onChange }) {
  return (
    <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Čas">
      {TIME_SLOTS.map((slot) => (
        <button
          key={slot}
          type="button"
          role="radio"
          aria-checked={value === slot}
          onClick={() => onChange(slot)}
          className={`px-4 py-2 rounded-full border font-body text-sm transition-all duration-200 min-h-[44px] ${
            value === slot
              ? 'bg-mauve border-mauve text-white'
              : 'border-stone text-charcoal hover:border-mauve/50'
          }`}
        >
          {slot}
        </button>
      ))}
    </div>
  )
}
