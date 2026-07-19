import { useTranslation } from 'react-i18next'
import { Reveal } from './Reveal'
import { useContent } from '../context/ContentContext'
import { useBookingCart } from '../context/BookingCartContext'

function Placeholder() {
  return (
    <div className="w-full h-full bg-linen flex items-center justify-center">
      <svg width="44" height="44" viewBox="0 0 24 24" fill="none"
        stroke="rgba(178,163,181,0.5)" strokeWidth="1.2">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
      </svg>
    </div>
  )
}

export default function Team() {
  const { t } = useTranslation()
  const { setStylist } = useBookingCart()
  const { team, loading } = useContent()

  return (
    <section id="team" className="section-padding bg-parchment border-t border-stone">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <Reveal>
            <p className="font-body text-xs tracking-widest3 uppercase text-mauve mb-3">{t('team.eyebrow')}</p>
            <h2 className="font-heading text-4xl lg:text-5xl text-ink">
              {t('team.headingPrefix')} <em className="text-mauve not-italic">{t('team.headingHighlight')}</em>
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="font-body text-base text-charcoal max-w-xs leading-relaxed">
              {t('team.subtitle')}
            </p>
          </Reveal>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 items-stretch">
          {loading && team.length === 0 && (
            <p className="col-span-full font-body text-sm text-warm text-center py-8">Načítáme tým…</p>
          )}
          {team.map((member, i) => (
            <Reveal key={member.id} delay={i * 0.09} className="h-full">
              <div className="h-full flex flex-col bg-white border border-stone shadow-soft hover:shadow-card hover:-translate-y-1 transition-all duration-500 group">
                {/* Photo */}
                <div className="aspect-[4/5] overflow-hidden flex-shrink-0">
                  {member.photo
                    ? <img src={member.photo} alt={member.name}
                        className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105" />
                    : <Placeholder />}
                </div>
                {/* Info */}
                <div className="px-3 sm:px-5 py-3 sm:py-4 border-t border-stone flex flex-col gap-2 mt-auto">
                  <div className="min-w-0">
                    <p className="font-heading text-ink text-base sm:text-lg leading-tight">{member.name}</p>
                    <p className="font-body text-[10px] sm:text-xs tracking-wide uppercase text-mauve mt-0.5 leading-tight">{member.role}</p>
                  </div>
                  <a
                    href="#services"
                    onClick={() => setStylist(member.name)}
                    className="self-start border border-stone text-warm font-body text-[10px] sm:text-xs sm:tracking-widest uppercase px-2.5 sm:px-3.5 py-1.5 hover:border-mauve hover:text-mauve transition-all duration-300">
                    {t('team.bookCta')}
                  </a>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
