import { useRef } from 'react'

// Assumes a date is already selected — StepAppointment only renders this once
// `slots` (candidate start times for that day) have been computed.
export default function TimePills({ value, onChange, slots, availableSet, loading, error, onRetry }) {
  const refs = useRef([])
  const selectedIndex = Math.max(slots.indexOf(value), 0)

  function isAvailable(slot) {
    return !loading && !error && availableSet.has(slot)
  }

  function selectSlot(slot) {
    if (!isAvailable(slot)) return
    onChange(slot)
  }

  function handleKeyDown(e, index) {
    let nextIndex = null
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') nextIndex = (index + 1) % slots.length
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') nextIndex = (index - 1 + slots.length) % slots.length
    else if (e.key === 'Home') nextIndex = 0
    else if (e.key === 'End') nextIndex = slots.length - 1
    if (nextIndex !== null) {
      e.preventDefault()
      refs.current[nextIndex]?.focus()
      selectSlot(slots[nextIndex])
    }
  }

  if (error) {
    return (
      <p className="font-body text-sm text-mauve-deep">
        Nepodařilo se načíst dostupné termíny.{' '}
        <button type="button" onClick={onRetry} className="underline hover:text-mauve-deep/80">
          Zkusit znovu
        </button>
      </p>
    )
  }

  if (!loading && slots.length === 0) {
    return <p className="font-body text-sm text-warm">Pro tento den nejsou volné žádné termíny. Zvolte prosím jiné datum.</p>
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Čas">
        {slots.map((slot, i) => {
          const available = isAvailable(slot)
          return (
            <button
              key={slot}
              ref={(el) => (refs.current[i] = el)}
              type="button"
              role="radio"
              aria-checked={value === slot}
              disabled={!available}
              tabIndex={i === selectedIndex ? 0 : -1}
              onClick={() => selectSlot(slot)}
              onKeyDown={(e) => handleKeyDown(e, i)}
              className={`px-4 py-2 rounded-full border font-body text-sm transition-all duration-200 min-h-[48px] ${
                value === slot
                  ? 'bg-mauve border-mauve text-white'
                  : available
                  ? 'border-stone text-charcoal hover:border-mauve/50'
                  : 'border-stone text-stone/70 cursor-not-allowed'
              }`}
            >
              {slot}
            </button>
          )
        })}
      </div>
      {loading && <p className="font-body text-xs text-frost mt-2">Načítáme dostupné časy…</p>}
    </div>
  )
}
