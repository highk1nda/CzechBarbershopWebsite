import { team } from '../../data/team'

export default function StylistPills({ value, onChange }) {
  return (
    <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Preferovaný specialista">
      <button
        type="button"
        role="radio"
        aria-checked={value === ''}
        onClick={() => onChange('')}
        className={`px-4 py-2 rounded-full border font-body text-sm transition-all duration-200 min-h-[44px] ${
          value === '' ? 'bg-mauve border-mauve text-white' : 'border-stone text-charcoal hover:border-mauve/50'
        }`}
      >
        Bez preference
      </button>
      {team.map((member) => (
        <button
          key={member.name}
          type="button"
          role="radio"
          aria-checked={value === member.name}
          onClick={() => onChange(member.name)}
          className={`px-4 py-2 rounded-full border font-body text-sm transition-all duration-200 min-h-[44px] ${
            value === member.name
              ? 'bg-mauve border-mauve text-white'
              : 'border-stone text-charcoal hover:border-mauve/50'
          }`}
        >
          {member.name}
        </button>
      ))}
    </div>
  )
}
