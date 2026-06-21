import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const links = [
  { href: '#services',  label: 'Služby'    },
  { href: '#team',      label: 'Tým'       },
  { href: '#gallery',   label: 'Galerie'   },
  { href: '#booking',   label: 'Rezervace' },
  { href: '#contact',   label: 'Kontakt'   },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <motion.header
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-ivory/95 backdrop-blur-sm border-b border-stone shadow-soft'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-10 flex items-center justify-between h-16 lg:h-18">

          <a href="#hero"
            className="font-heading text-xl text-ink tracking-wide hover:text-mauve transition-colors duration-300">
            MAISON <span className="text-mauve italic">beauty</span>
          </a>

          {/* Desktop links */}
          <nav className="hidden lg:flex items-center gap-9">
            {links.map(l => (
              <a key={l.href} href={l.href}
                className="font-body text-sm tracking-widest2 uppercase text-charcoal hover:text-ink transition-colors duration-300 relative group">
                {l.label}
                <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-mauve transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </nav>

          <a href="#booking"
            className="hidden lg:inline-block font-body text-sm tracking-widest2 uppercase text-mauve-deep border border-mauve/40 px-5 py-2.5 hover:border-mauve hover:bg-mauve/8 transition-all duration-300">
            Rezervovat
          </a>

          {/* Hamburger */}
          <button
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Menu"
            className="lg:hidden p-2 flex flex-col gap-1.5"
          >
            <span className={`block w-6 h-px bg-ink transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block w-4 h-px bg-ink transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-6 h-px bg-ink transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>
      </motion.header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="fixed inset-0 z-40 bg-ivory flex flex-col items-center justify-center gap-8 lg:hidden"
          >
            {links.map((l, i) => (
              <motion.a
                key={l.href} href={l.href}
                onClick={() => setMenuOpen(false)}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 + i * 0.055 }}
                className="font-heading text-3xl text-ink hover:text-mauve transition-colors"
              >
                {l.label}
              </motion.a>
            ))}
            <a href="#booking" onClick={() => setMenuOpen(false)}
              className="mt-4 border border-mauve/40 text-mauve-deep font-body text-xs tracking-widest2 uppercase px-8 py-3 hover:bg-mauve/8 transition-all">
              Rezervovat
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
