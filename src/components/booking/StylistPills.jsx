import { useRef, useMemo } from 'react'
import { useContent } from '../../context/ContentContext'

// value/onChange carry a team_member_id ('' = no preference / auto-assign).
// qualifiedIds narrows the visible options to specialists who can perform
// every service currently in the cart (see computeQualifiedTeamMemberIds).
export default function StylistPills({ value, onChange, qualifiedIds }) {
  const { team } = useContent()
  const qualifiedTeam = useMemo(() => team.filter((m) => qualifiedIds.includes(m.id)), [team, qualifiedIds])
  const noSingleMatch = team.length > 0 && qualifiedTeam.length === 0
  const OPTIONS = useMemo(() => [{ id: '', name: 'Bez preference' }, ...qualifiedTeam], [qualifiedTeam])
  const refs = useRef([])
  const selectedIndex = Math.max(OPTIONS.findIndex((o) => o.id === value), 0)

  function handleKeyDown(e, index) {
    let nextIndex = null
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') nextIndex = (index + 1) % OPTIONS.length
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') nextIndex = (index - 1 + OPTIONS.length) % OPTIONS.length
    else if (e.key === 'Home') nextIndex = 0
    else if (e.key === 'End') nextIndex = OPTIONS.length - 1
    if (nextIndex !== null) {
      e.preventDefault()
      onChange(OPTIONS[nextIndex].id)
      refs.current[nextIndex]?.focus()
    }
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Preferovaný specialista">
        {OPTIONS.map((opt, i) => (
          <button
            key={opt.id || 'none'}
            ref={(el) => (refs.current[i] = el)}
            type="button"
            role="radio"
            aria-checked={value === opt.id}
            tabIndex={i === selectedIndex ? 0 : -1}
            onClick={() => onChange(opt.id)}
            onKeyDown={(e) => handleKeyDown(e, i)}
            className={`px-4 py-2 rounded-full border font-body text-sm transition-all duration-200 min-h-[48px] ${
              value === opt.id ? 'bg-mauve border-mauve text-white' : 'border-stone text-charcoal hover:border-mauve/50'
            }`}
          >
            {opt.name}
          </button>
        ))}
      </div>
      {noSingleMatch && (
        <p className="font-body text-xs text-frost mt-2">
          Pro tuto kombinaci služeb nemáme jednoho specialistu — přiřadíme vhodného člena týmu.
        </p>
      )}
    </div>
  )
}
