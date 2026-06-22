import { Reveal } from './Reveal'

const items = [
  { icon: '✦', label: 'Profesionální tým',  desc: 'Zkušení kadeřníci a specialisté péče o krásu'        },
  { icon: '◇', label: 'Prémiové produkty',  desc: 'Pouze ověřené značky pro vaše vlasy a pleť'           },
  { icon: '◈', label: 'Snadná rezervace',   desc: 'Online i telefonicky, v čase, který vám vyhovuje'     },
]

export default function Highlights() {
  return (
    <section className="bg-parchment border-y border-stone py-12">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">
        {items.map((it, i) => (
          <Reveal key={it.label} delay={i * 0.08} className="h-full">
            <div className="flex items-start gap-5 px-7 py-8 bg-mauve group hover:bg-mauve-deep transition-colors duration-300 h-full">
              <span className="text-white/70 text-base mt-0.5 flex-shrink-0 transition-transform duration-500 group-hover:scale-110">
                {it.icon}
              </span>
              <div>
                <p className="font-heading text-white text-base mb-1.5">{it.label}</p>
                <p className="font-body text-sm text-white/75 leading-relaxed">{it.desc}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
