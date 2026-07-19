export default function FilterChips({ services, activeCategory, onSelect }) {
  const ALL_CATEGORY_TITLES = services.flatMap((tab) => tab.categories.map((cat) => cat.title))

  return (
    <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1" role="group" aria-label="Rychlé filtry kategorií">
      {ALL_CATEGORY_TITLES.map((title) => (
        <button
          key={title}
          type="button"
          onClick={() => onSelect(title)}
          aria-pressed={activeCategory === title}
          className={`flex-shrink-0 px-4 py-2 rounded-full border font-body text-xs tracking-wide uppercase whitespace-nowrap transition-all duration-200 min-h-[48px] ${
            activeCategory === title
              ? 'bg-mauve border-mauve text-white'
              : 'border-stone text-charcoal hover:border-mauve/50'
          }`}
        >
          {title}
        </button>
      ))}
    </div>
  )
}
