import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Reveal } from './Reveal'
import { ServiceIcon, Clock } from './ServiceIcons'
import { SERVICES } from '../data/services'
import FloatingFlower from './FloatingFlower'

const flowers1Img = '/assets/flowers/flowers1.png'
const flower3Img  = '/assets/flower3.png'

// ─── Service detail modal ────────────────────────────────────────────────────

function ServiceModal({ item, onClose }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22 }}
      onClick={onClose}
      className="fixed inset-0 bg-ink/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6"
    >
      <motion.div
        initial={{ opacity: 0, y: 28, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.97 }}
        transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        onClick={e => e.stopPropagation()}
        className="bg-ivory w-full max-w-lg shadow-lift relative overflow-y-auto max-h-[92vh]"
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-5 text-frost hover:text-ink text-3xl font-light transition-colors leading-none z-10"
          aria-label="Zavřít"
        >
          ×
        </button>

        <div className="p-7 sm:p-10">
          {/* Header */}
          <p className="font-body text-[10px] tracking-widest3 uppercase text-mauve mb-3">Detail služby</p>
          <h3 className="font-heading text-2xl sm:text-3xl text-ink mb-2 pr-8">{item.name}</h3>
          <span className="mauve-rule block mb-6" />

          {/* Description */}
          <p className="font-body text-base text-charcoal leading-relaxed mb-6">
            {item.details.text}
          </p>

          {/* Photos */}
          {item.details.photos?.length > 0 && (
            <div className={`grid gap-2 mb-6 ${item.details.photos.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
              {item.details.photos.slice(0, 2).map((src, i) => (
                <div key={i} className="aspect-[4/3] overflow-hidden">
                  <img src={src} alt="" loading="lazy" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}

          {/* Meta */}
          <div className="border-t border-stone pt-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-body text-[10px] tracking-widest uppercase text-mauve">Cena</span>
              <span className="font-heading text-mauve-deep font-semibold tabular-nums">{item.price}</span>
            </div>
            {item.duration && (
              <div className="flex items-center justify-between">
                <span className="font-body text-[10px] tracking-widest uppercase text-mauve">Délka</span>
                <span className="font-body text-sm text-charcoal">{item.duration}</span>
              </div>
            )}
            <div className="flex items-start justify-between gap-4">
              <span className="font-body text-[10px] tracking-widest uppercase text-mauve flex-shrink-0 mt-0.5">Specialista</span>
              <span className="font-body text-sm text-charcoal text-right">{item.workers.join(', ')}</span>
            </div>
          </div>

          {/* CTA */}
          <a
            href="#booking"
            onClick={onClose}
            className="mt-6 block text-center bg-mauve text-white font-body text-xs tracking-widest2 uppercase px-8 py-3.5 hover:bg-mauve-deep transition-colors duration-300"
          >
            Rezervovat termín
          </a>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── Service row ─────────────────────────────────────────────────────────────

function ServiceRow({ item, index, hasDuration, onExpand }) {
  const hasDetails = Boolean(item.details)

  return (
    <motion.li
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94], delay: index * 0.04 }}
      onClick={hasDetails ? () => onExpand(item) : undefined}
      className={`flex items-center gap-4 py-4 border-b border-stone/60 last:border-0 group -mx-4 px-4 rounded transition-colors duration-200 ${
        hasDetails
          ? 'cursor-pointer hover:bg-parchment/80'
          : 'hover:bg-parchment/60'
      }`}
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

      {/* Details affordance — only shown when details exist */}
      {hasDetails && (
        <span className="flex-shrink-0 font-body text-[10px] tracking-widest uppercase text-mauve/60 border-b border-mauve/30 group-hover:text-mauve group-hover:border-mauve transition-colors duration-200 whitespace-nowrap">
          Více info
        </span>
      )}
    </motion.li>
  )
}

// ─── Category block ───────────────────────────────────────────────────────────

function CategoryBlock({ category, globalIndex, hasDuration, onExpand }) {
  return (
    <div className="mb-2">
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
            onExpand={onExpand}
          />
        ))}
      </ul>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function Services() {
  const [activeTab,  setActiveTab]  = useState(SERVICES[0].id)
  const [detailItem, setDetailItem] = useState(null)
  const active      = SERVICES.find(s => s.id === activeTab)
  const hasDuration = active.categories.some(c => c.items.some(i => i.duration))

  function handleTabChange(id) {
    setActiveTab(id)
    setDetailItem(null)
  }

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
                onClick={() => handleTabChange(tab.id)}
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
                  onExpand={setDetailItem}
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

      {/* Detail modal */}
      <AnimatePresence>
        {detailItem && (
          <ServiceModal item={detailItem} onClose={() => setDetailItem(null)} />
        )}
      </AnimatePresence>

    </section>
  )
}
