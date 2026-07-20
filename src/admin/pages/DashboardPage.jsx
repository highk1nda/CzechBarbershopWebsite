import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useContent } from '../../context/ContentContext'
import { supabase } from '../../lib/supabaseClient'

export default function DashboardPage() {
  const { team, ALL_ITEMS, SERVICES, loading } = useContent()
  const [newReservationsCount, setNewReservationsCount] = useState(null)

  useEffect(() => {
    supabase
      .from('reservations')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'new')
      .then(({ count }) => setNewReservationsCount(count ?? 0))
  }, [])

  const cards = [
    { to: '/admin/reservations', label: 'Rezervace', count: newReservationsCount, sub: 'čeká na schválení' },
    { to: '/admin/services', label: 'Služby', count: ALL_ITEMS.length, sub: `v ${SERVICES.length} kategoriích` },
    { to: '/admin/team', label: 'Tým', count: team.length, sub: 'členů týmu' },
    { to: '/admin/content', label: 'Texty webu', count: null, sub: 'Upravit texty a kontakt' },
  ]

  return (
    <div>
      <h1 className="font-heading text-3xl text-ink mb-8">Přehled</h1>
      {loading ? (
        <p className="font-body text-sm text-warm">Načítání…</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {cards.map((card) => (
            <Link
              key={card.to}
              to={card.to}
              className="bg-white border border-stone shadow-soft p-6 hover:border-mauve/50 hover:shadow-card transition-all duration-200"
            >
              <p className="font-body text-xs tracking-widest uppercase text-mauve mb-2">{card.label}</p>
              {card.count !== null && <p className="font-heading text-3xl text-ink mb-1">{card.count}</p>}
              <p className="font-body text-sm text-warm">{card.sub}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
