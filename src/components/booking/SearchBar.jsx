export default function SearchBar({ value, onChange }) {
  return (
    <div className="relative">
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-frost" aria-hidden="true">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="7" />
          <path d="m21 21-4.35-4.35" />
        </svg>
      </span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Hledat službu…"
        aria-label="Hledat službu"
        className="w-full border border-stone rounded-full bg-white font-body text-sm text-ink pl-11 pr-10 py-3 focus:outline-none focus:border-mauve transition-colors placeholder:text-stone/70"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          aria-label="Vymazat hledání"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-frost hover:text-mauve-deep transition-colors text-lg leading-none w-6 h-6 flex items-center justify-center"
        >
          ×
        </button>
      )}
    </div>
  )
}
