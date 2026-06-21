import { Reveal } from './Reveal'

const team = [
  { name: '[Jméno]',  role: 'Kadeřnice & Koloristka',       photo: '/assets/papuha.jpeg' },
  { name: '[Jméno]',  role: 'Nehtová umělkyně',             photo: null },
  { name: '[Jméno]',  role: 'Specialistka na řasy & obočí', photo: null },
]

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
  return (
    <section id="team" className="section-padding bg-parchment border-t border-stone">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <Reveal>
            <p className="font-body text-xs tracking-widest3 uppercase text-mauve mb-3">Lidé za MAISON</p>
            <h2 className="font-heading text-4xl lg:text-5xl text-ink">
              Náš <em className="text-mauve not-italic">tým</em>
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="font-body text-base text-charcoal max-w-xs leading-relaxed">
              Odborníci, kteří se starají o vaši krásu s vášní a zkušeností.
            </p>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {team.map((member, i) => (
            <Reveal key={i} delay={i * 0.09}>
              <div className="bg-white border border-stone shadow-soft hover:shadow-card hover:-translate-y-1 transition-all duration-500 group">
                {/* Photo */}
                <div className="aspect-[4/5] overflow-hidden">
                  {member.photo
                    ? <img src={member.photo} alt={member.name}
                        className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105" />
                    : <Placeholder />}
                </div>
                {/* Info */}
                <div className="px-6 py-5 border-t border-stone flex items-start justify-between gap-3">
                  <div>
                    <p className="font-heading text-ink text-lg">{member.name}</p>
                    <p className="font-body text-sm tracking-wide uppercase text-mauve mt-1">{member.role}</p>
                  </div>
                  <a href="#booking"
                    className="flex-shrink-0 border border-stone text-warm font-body text-xs tracking-widest uppercase px-3.5 py-1.5 hover:border-mauve hover:text-mauve transition-all duration-300 mt-0.5">
                    Objednat
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
