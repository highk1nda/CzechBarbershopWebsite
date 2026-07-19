import { useEffect, useId, useRef } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { useBookingCart } from '../../context/BookingCartContext'

export default function ServiceDetailModal({ item, onClose }) {
  const { state, addItem, removeItem } = useBookingCart()
  const inCart = state.cart.has(item.id)
  const reduceMotion = useReducedMotion()
  const titleId = useId()
  const closeButtonRef = useRef(null)

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    closeButtonRef.current?.focus()
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduceMotion ? 0.01 : 0.22 }}
      onClick={onClose}
      className="fixed inset-0 bg-ink/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6"
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 28, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.97 }}
        transition={{ duration: reduceMotion ? 0.01 : 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        onClick={(e) => e.stopPropagation()}
        className="bg-ivory w-full max-w-lg rounded-3xl shadow-lift relative overflow-y-auto max-h-[92vh]"
      >
        <button
          ref={closeButtonRef}
          onClick={onClose}
          className="absolute top-4 right-5 text-frost hover:text-ink text-3xl font-light transition-colors leading-none z-10 w-11 h-11 flex items-center justify-center"
          aria-label="Zavřít"
        >
          ×
        </button>

        <div className="p-7 sm:p-10">
          <p className="font-body text-[10px] tracking-widest3 uppercase text-mauve mb-3">Detail služby</p>
          <h3 id={titleId} className="font-heading text-2xl sm:text-3xl text-ink mb-2 pr-8">{item.name}</h3>
          <span className="mauve-rule block mb-6" />

          {item.details.text && (
            <p className={`font-body text-base text-charcoal leading-relaxed ${item.details.steps?.length ? 'mb-3' : 'mb-6'}`}>
              {item.details.text}
            </p>
          )}

          {item.details.steps?.length > 0 && (
            <ul className="mb-6 space-y-2">
              {item.details.steps.map((step, i) => (
                <li key={i} className="flex items-start gap-2.5 font-body text-base text-charcoal leading-relaxed">
                  <span className="mt-2.5 w-1 h-1 rounded-full bg-mauve flex-shrink-0" aria-hidden="true" />
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          )}

          {item.details.photos?.length > 0 && (
            <div className={`grid gap-2 mb-6 ${item.details.photos.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
              {item.details.photos.slice(0, 2).map((src, i) => (
                <div key={i} className="aspect-[4/3] overflow-hidden rounded-xl">
                  <img src={src} alt="" loading="lazy" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}

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

          <button
            type="button"
            onClick={() => (inCart ? removeItem(item.id) : addItem(item.id))}
            className={`mt-6 w-full text-center font-body text-xs tracking-widest2 uppercase px-8 py-3.5 rounded-full transition-colors duration-300 ${
              inCart ? 'bg-mauve-deep text-white' : 'bg-mauve text-white hover:bg-mauve-deep'
            }`}
          >
            {inCart ? '✓ Přidáno do rezervace' : 'Přidat do rezervace'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}
