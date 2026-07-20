import { APPLE_STYLE_EMOJI } from '../../utils/appleEmoji'

export default function CategoryCard({ tab, isActive, onClick }) {
  const count = tab.categories.reduce((n, c) => n + c.items.length, 0)
  const appleIcon = APPLE_STYLE_EMOJI[tab.icon]

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={isActive}
      className={`text-left p-6 sm:p-7 rounded-3xl border transition-all duration-300 ${
        isActive
          ? 'border-mauve bg-mauve/6 shadow-card'
          : 'border-stone bg-white hover:border-mauve/40 hover:shadow-card hover:-translate-y-0.5'
      }`}
    >
      {appleIcon
        ? <img src={appleIcon.src} alt={appleIcon.alt} className="h-8 w-8 object-contain" aria-hidden="true" />
        : <span className="text-3xl leading-none" aria-hidden="true">{tab.icon}</span>}
      <h3 className="font-heading text-xl text-ink mt-4 mb-1">{tab.label}</h3>
      <p className="font-body text-[11px] tracking-widest uppercase text-mauve mb-3">{count} služeb</p>
      <p className="font-body text-sm text-charcoal leading-relaxed">{tab.description}</p>
    </button>
  )
}
