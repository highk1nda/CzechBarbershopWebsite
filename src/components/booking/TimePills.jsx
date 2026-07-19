import { useRef } from 'react'
import { TIME_SLOTS } from '../../utils/dateRules'

export default function TimePills({ value, onChange }) {
  const refs = useRef([])
  const selectedIndex = Math.max(TIME_SLOTS.indexOf(value), 0)

  function handleKeyDown(e, index) {
    let nextIndex = null
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') nextIndex = (index + 1) % TIME_SLOTS.length
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') nextIndex = (index - 1 + TIME_SLOTS.length) % TIME_SLOTS.length
    else if (e.key === 'Home') nextIndex = 0
    else if (e.key === 'End') nextIndex = TIME_SLOTS.length - 1
    if (nextIndex !== null) {
      e.preventDefault()
      onChange(TIME_SLOTS[nextIndex])
      refs.current[nextIndex]?.focus()
    }
  }

  return (
    <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Čas">
      {TIME_SLOTS.map((slot, i) => (
        <button
          key={slot}
          ref={(el) => (refs.current[i] = el)}
          type="button"
          role="radio"
          aria-checked={value === slot}
          tabIndex={i === selectedIndex ? 0 : -1}
          onClick={() => onChange(slot)}
          onKeyDown={(e) => handleKeyDown(e, i)}
          className={`px-4 py-2 rounded-full border font-body text-sm transition-all duration-200 min-h-[48px] ${
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
