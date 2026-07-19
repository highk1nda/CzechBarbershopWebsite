import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const NAV_LINKS = [
  { to: '/admin', label: 'Přehled', end: true },
  { to: '/admin/services', label: 'Služby' },
  { to: '/admin/team', label: 'Tým' },
  { to: '/admin/content', label: 'Texty webu' },
]

export default function AdminLayout() {
  const { signOut } = useAuth()

  return (
    <div className="min-h-screen bg-parchment">
      <header className="bg-white border-b border-stone">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between gap-6">
          <div className="flex items-center gap-8">
            <span className="font-heading text-lg text-ink">MAISON <em className="text-mauve not-italic">admin</em></span>
            <nav className="flex items-center gap-5">
              {NAV_LINKS.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.end}
                  className={({ isActive }) =>
                    `font-body text-sm tracking-wide transition-colors ${isActive ? 'text-mauve-deep font-semibold' : 'text-charcoal hover:text-mauve'}`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <a href="/" target="_blank" rel="noreferrer" className="font-body text-xs tracking-wide uppercase text-warm hover:text-mauve transition-colors">
              Zobrazit web ↗
            </a>
            <button
              type="button"
              onClick={() => signOut()}
              className="font-body text-xs tracking-wide uppercase text-warm hover:text-mauve transition-colors"
            >
              Odhlásit se
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <Outlet />
      </main>
    </div>
  )
}
