import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Reveal } from './Reveal'
import { ServiceIcon, Clock } from './ServiceIcons'
import { SERVICES } from '../data/services'
import FloatingFlower from './FloatingFlower'
import flowers1Img   from '../../assets/flowers/flowers1.png'
import flower3Img    from '../../assets/flower3.png'

function ServiceRow({ item, index, hasDuration }) {
  return (
    <motion.li
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94], delay: index * 0.04 }}
      className="flex items-center gap-4 py-4 border-b border-stone/60 last:border-0 group hover:bg-parchment/60 -mx-4 px-4 rounded transition-colors duration-200"
    >
      {/* Icon */}
      <div className="w-10 h-10 rounded-full border border-mauve/25 flex items-center justify-center flex-shrink-0 text-mauve group-hover:border-mauve/60 group-hover:bg-mauve/6 transition-all duration-300">
        <ServiceIcon name={item.icon} />
      </div>

      {/* Name + desc */}
      <div className="flex-1 min-w-0">
        <p className="text-ink font-medium leading-snug">{item.name}</p>
        {item.desc && (
          <p className="text-sm text-warm mt-0.5 leading-tight">{item.desc}</p>
        )}
      </div>

      {/* Duration (men's tab) */}
      {hasDuration && (
        <div className="hidden sm:flex items-center gap-1.5 text-frost flex-shrink-0">
          <Clock className="w-3.5 h-3.5" />
          <span className="text-sm whitespace-nowrap">{item.duration ?? '—'}</span>
        </div>
      )}

      {/* Price */}
      <div className="flex-shrink-0 text-right">
        <span className="font-heading text-mauve-deep font-semibold whitespace-nowrap tabular-nums">
          {item.price}
        </span>
      </div>
    </motion.li>
  )
}

function CategoryBlock({ category, globalIndex, hasDuration }) {
  return (
    <div className="mb-2">
      {/* Category header */}
      <div className="flex items-center gap-3 mb-1 mt-6 first:mt-0">
        <span className="font-body text-xs tracking-widest3 uppercase text-mauve">{category.title}</span>
        <span className="flex-1 h-px bg-stone/70" />
      </div>

      <ul>
        {category.items.map((item, i) => (
          <ServiceRow
            key={item.name + i}
            item={item}
            index={globalIndex + i}
            hasDuration={hasDuration}
          />
        ))}
      </ul>
    </div>
  )
}

export default function Services() {
  const [activeTab, setActiveTab] = useState(SERVICES[0].id)
  const active = SERVICES.find(s => s.id === activeTab)
  const hasDuration = active.categories.some(c => c.items.some(i => i.duration))

  // flat count for stagger offset
  let rowOffset = 0

  return (
    <section id="services" className="section-padding bg-ivory relative overflow-hidden">

      {/* Flower decorations */}
      <FloatingFlower
        src={flowers1Img}
        style={{ top: '-30px', right: '-40px', width: '300px', opacity: 0.10 }}
        amplitude={12}
        duration={10}
        delay={0.5}
      />
      <FloatingFlower
        src={flower3Img}
        style={{ bottom: '-50px', left: '-40px', width: '240px', opacity: 0.09, transform: 'rotate(20deg)' }}
        amplitude={9}
        duration={12}
        delay={1.5}
      />

      <div className="max-w-5xl mx-auto px-6 lg:px-10 relative z-10">

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">
          <Reveal>
            <p className="font-body text-xs tracking-widest3 uppercase text-mauve mb-3">Ceník služeb</p>
            <AnimatePresence mode="wait">
              <motion.h2
                key={active.heading}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35 }}
                className="font-heading text-4xl lg:text-5xl text-ink"
              >
                {active.heading}
              </motion.h2>
            </AnimatePresence>
          </Reveal>
          <Reveal delay={0.12}>
            <a href="#booking"
              className="inline-block bg-mauve text-white font-body text-sm tracking-widest2 uppercase px-7 py-3 hover:bg-mauve-deep transition-colors duration-300 self-start lg:self-auto">
              Rezervovat termín
            </a>
          </Reveal>
        </div>

        {/* Tabs */}
        <Reveal>
          <div className="flex flex-wrap gap-2 mb-10">
            {SERVICES.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`font-body text-sm tracking-widest uppercase px-5 py-2.5 border transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'border-mauve bg-mauve text-white'
                    : 'border-stone text-charcoal hover:border-mauve/50 hover:text-ink'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </Reveal>

        {/* Service list */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="bg-white border border-stone shadow-soft px-4 sm:px-8 py-6"
          >
            {active.categories.map((category) => {
              const offset = rowOffset
              rowOffset += category.items.length
              return (
                <CategoryBlock
                  key={category.title}
                  category={category}
                  globalIndex={offset}
                  hasDuration={hasDuration}
                />
              )
            })}

            {active.note && (
              <p className="font-body text-sm text-frost italic mt-4 pt-4 border-t border-stone/60">
                {active.note}
              </p>
            )}
          </motion.div>
        </AnimatePresence>

      </div>
    </section>
  )
}
