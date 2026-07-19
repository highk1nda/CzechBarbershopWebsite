import { useRef } from 'react'
import { team } from '../../data/team'

const OPTIONS = ['', ...team.map((m) => m.name)]

export default function StylistPills({ value, onChange }) {
  const refs = useRef([])
  const selectedIndex = Math.max(OPTIONS.indexOf(value), 0)

  function handleKeyDown(e, index) {
    let nextIndex = null
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') nextIndex = (index + 1) % OPTIONS.length
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') nextIndex = (index - 1 + OPTIONS.length) % OPTIONS.length
    else if (e.key === 'Home') nextIndex = 0
    else if (e.key === 'End') nextIndex = OPTIONS.length - 1
    if (nextIndex !== null) {
      e.preventDefault()
      onChange(OPTIONS[nextIndex])
      refs.current[nextIndex]?.focus()
    }
  }

  return (
    <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Preferovaný specialista">
      {OPTIONS.map((name, i) => (
        <button
          key={name || 'none'}
          ref={(el) => (refs.current[i] = el)}
          type="button"
          role="radio"
          aria-checked={value === name}
          tabIndex={i === selectedIndex ? 0 : -1}
          onClick={() => onChange(name)}
          onKeyDown={(e) => handleKeyDown(e, i)}
          className={`px-4 py-2 rounded-full border font-body text-sm transition-all duration-200 min-h-[48px] ${
            value === name ? 'bg-mauve border-mauve text-white' : 'border-stone text-charcoal hover:border-mauve/50'
          }`}
        >
          {name || 'Bez preference'}
        </button>
      ))}
    </div>
  )
}
