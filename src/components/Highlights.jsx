import { Reveal } from './Reveal'

const items = [
  { icon: '✦', label: 'Profesionální tým',  desc: 'Zkušení kadeřníci a specialisté péče o krásu'        },
  { icon: '◇', label: 'Prémiové produkty',  desc: 'Pouze ověřené značky pro vaše vlasy a pleť'           },
  { icon: '◈', label: 'Snadná rezervace',   desc: 'Online i telefonicky, v čase, který vám vyhovuje'     },
]

export default function Highlights() {
  return (
    <section className="bg-parchment border-y border-stone">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-stone">
        {items.map((it, i) => (
          <Reveal key={it.label} delay={i * 0.08}>
            <div className="flex items-start gap-5 px-6 py-10 md:px-10 md:py-12 group">
              <span className="text-mauve text-base mt-0.5 flex-shrink-0 transition-transform duration-500 group-hover:scale-110">
                {it.icon}
              </span>
              <div>
                <p className="font-heading text-ink text-base mb-1.5">{it.label}</p>
                <p className="font-body text-base text-charcoal leading-relaxed">{it.desc}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
