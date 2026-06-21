import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Reveal } from './Reveal'
import { SERVICES } from '../data/services'

function ServiceCard({ category, delay }) {
  return (
    <Reveal delay={delay}>
      <div className="bg-white border border-stone rounded-sm shadow-soft hover:shadow-card hover:-translate-y-1 transition-all duration-500">
        {/* Header */}
        <div className="px-6 pt-7 pb-5 border-b border-stone flex items-center gap-3.5">
          <span className="text-mauve text-base">{category.icon}</span>
          <h3 className="font-heading text-ink text-lg">{category.title}</h3>
        </div>

        {/* Items */}
        <ul className="px-6 py-5 space-y-0">
          {category.items.map((item, i) => (
            <li key={item.name}
              className={`flex justify-between items-baseline gap-4 py-2.5 font-body text-sm ${
                i < category.items.length - 1 ? 'border-b border-stone/50' : ''
              }`}>
              <span className="text-ink leading-snug text-base">{item.name}</span>
              <span className="text-mauve-deep font-semibold whitespace-nowrap flex-shrink-0 tabular-nums text-base">
                {item.price}
              </span>
            </li>
          ))}
        </ul>

        {/* Book CTA */}
        <div className="px-6 pb-6">
          <a href="#booking"
            className="inline-block font-body text-xs tracking-widest2 uppercase text-mauve-deep border border-mauve/30 px-5 py-2 hover:border-mauve hover:bg-mauve/6 transition-all duration-300">
            Rezervovat
          </a>
        </div>
      </div>
    </Reveal>
  )
}

export default function Services() {
  const [activeTab, setActiveTab] = useState(SERVICES[0].id)
  const active = SERVICES.find(s => s.id === activeTab)

  return (
    <section id="services" className="section-padding bg-ivory">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">

        {/* Section header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">
          <Reveal>
            <p className="font-body text-xs tracking-widest3 uppercase text-mauve mb-3">Ceník služeb</p>
            <h2 className="font-heading text-4xl lg:text-5xl text-ink">
              Naše <em className="text-mauve not-italic">služby</em>
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="font-body text-base text-charcoal max-w-xs leading-relaxed">Vytvořeno pro vás, s péčí a láskou.</p>
          </Reveal>
        </div>

        {/* Tab bar */}
        <Reveal>
          <div className="flex flex-wrap gap-2 mb-10">
            {SERVICES.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`font-body text-xs tracking-widest2 uppercase px-5 py-2.5 border transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'border-mauve bg-mauve text-white'
                    : 'border-stone text-warm hover:border-mauve/50 hover:text-ink'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </Reveal>

        {/* Cards */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {active.categories.map((cat, i) => (
              <ServiceCard key={cat.title} category={cat} delay={i * 0.06} />
            ))}
          </motion.div>
        </AnimatePresence>

        {active.note && (
          <p className="font-body text-xs text-frost mt-5 italic">{active.note}</p>
        )}

        {/* Bottom CTA */}
        <div className="mt-14 pt-10 border-t border-stone text-center">
          <a href="#booking"
            className="inline-block bg-mauve text-white font-body text-xs tracking-widest2 uppercase px-10 py-3.5 hover:bg-mauve-deep transition-colors duration-300">
            Rezervovat termín
          </a>
        </div>
      </div>
    </section>
  )
}
