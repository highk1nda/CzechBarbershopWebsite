const IG_URL = 'https://www.instagram.com/maisonbeauty_cz/'

export default function Footer() {
  return (
    <footer className="border-t border-stone bg-ivory py-10">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 flex flex-col md:flex-row items-center justify-between gap-5">

        <p className="font-heading text-lg text-ink">
          MAISON <em className="text-mauve not-italic">beauty</em>
        </p>

        <div className="flex items-center gap-5">
          <a href={IG_URL} target="_blank" rel="noopener noreferrer"
            aria-label="Instagram" className="text-frost hover:text-mauve transition-colors duration-300">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
            </svg>
          </a>
          <a href="#" target="_blank" rel="noopener noreferrer"
            aria-label="Facebook" className="text-frost hover:text-mauve transition-colors duration-300">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
            </svg>
          </a>
        </div>

        <p className="font-body text-xs text-frost tracking-wide">
          &copy; 2026 MAISON beauty. Všechna práva vyhrazena.
        </p>
      </div>
    </footer>
  )
}
