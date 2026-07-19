import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useBookingCart } from '../../context/BookingCartContext'
import { pluralizeSluzba } from '../../utils/cartCalculations'
import CartBody from './CartBody'

export default function CartSheet() {
  const [expanded, setExpanded] = useState(false)
  const { cartCount, priceEstimate } = useBookingCart()
  const reduceMotion = useReducedMotion()

  if (cartCount === 0) return null

  function handleDragEnd(_event, info) {
    if (expanded && (info.offset.y > 80 || info.velocity.y > 400)) {
      setExpanded(false)
    } else if (!expanded && (info.offset.y < -40 || info.velocity.y < -400)) {
      setExpanded(true)
    }
  }

  return (
    <>
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setExpanded(false)}
            className="fixed inset-0 bg-ink/50 z-40 lg:hidden"
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      <motion.div
        layout
        drag={reduceMotion ? false : 'y'}
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
        transition={{ duration: reduceMotion ? 0.01 : 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-white border-t border-stone rounded-t-3xl shadow-lift px-5 pt-4 overflow-hidden touch-none"
        style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}
      >
        <span
          aria-hidden="true"
          className="block w-10 h-1 rounded-full bg-stone mx-auto mb-3"
        />
        <button
          type="button"
          onClick={() => setExpanded((e) => !e)}
          aria-expanded={expanded}
          aria-label="Zobrazit obsah rezervace"
          className="w-full flex items-center justify-between min-h-[48px]"
        >
          <span className="font-body text-sm text-ink">
            {cartCount} {pluralizeSluzba(cartCount)}
          </span>
          <span className="flex items-center gap-3">
            <span className="font-heading text-mauve-deep font-semibold">{priceEstimate?.label}</span>
            <span aria-hidden="true" className={`text-mauve transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`}>▲</span>
          </span>
        </button>

        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'min(60vh, 480px)', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: reduceMotion ? 0.01 : 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="overflow-hidden touch-auto"
            >
              <div className="pt-4 h-[min(60vh,480px)] overflow-y-auto">
                <CartBody />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  )
}
