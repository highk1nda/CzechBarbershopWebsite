import { AnimatePresence, motion } from 'framer-motion'
import { useBookingCart } from '../../context/BookingCartContext'
import { pluralizeSluzba } from '../../utils/cartCalculations'
import AddOnsSuggestions from './AddOnsSuggestions'

export default function CartBody() {
  const { state, cartItems, cartCount, priceEstimate, durationEstimate, removeItem, nextStep } = useBookingCart()

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 mb-1">
        <span aria-hidden="true" className="text-lg">👜</span>
        <h3 className="font-heading text-lg text-ink">Moje rezervace</h3>
      </div>
      <p className="font-body text-xs text-frost mb-5">
        {cartCount === 0 ? 'Zatím nic nevybráno' : `Vybráno ${cartCount} ${pluralizeSluzba(cartCount)}`}
      </p>

      {cartCount === 0 ? (
        <p className="font-body text-sm text-warm leading-relaxed">
          Vyberte služby vlevo a přidejte je do rezervace tlačítkem „+ Přidat“.
        </p>
      ) : (
        <ul className="space-y-3 mb-5 overflow-y-auto flex-1 -mx-1 px-1">
          <AnimatePresence initial={false}>
            {cartItems.map((item) => (
              <motion.li
                key={item.id}
                layout
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="flex items-center justify-between gap-3 pb-3 border-b border-stone/60 last:border-0"
              >
                <div className="min-w-0">
                  <p className="font-body text-sm text-ink truncate">{item.name}</p>
                  <p className="font-body text-xs text-mauve-deep font-semibold">{item.price}</p>
                </div>
                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  aria-label={`Odebrat ${item.name}`}
                  className="text-frost hover:text-mauve-deep transition-colors text-xl leading-none flex-shrink-0 w-6 h-6 flex items-center justify-center"
                >
                  ×
                </button>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}

      {cartCount > 0 && state.step === 1 && <AddOnsSuggestions />}

      {cartCount > 0 && (
        <div className="border-t border-stone pt-4 space-y-2 mb-5">
          <div className="flex justify-between font-body text-sm">
            <span className="text-warm">Odhad délky</span>
            <span className="text-ink text-right">{durationEstimate.label}</span>
          </div>
          <div className="flex justify-between font-body text-sm">
            <span className="text-warm">Odhad ceny</span>
            <span className="text-mauve-deep font-semibold text-right">{priceEstimate.label}</span>
          </div>
        </div>
      )}

      {state.step === 1 && (
        <button
          type="button"
          onClick={nextStep}
          disabled={cartCount === 0}
          className="mt-auto bg-mauve text-white font-body text-sm tracking-widest2 uppercase px-6 py-3.5 rounded-full hover:bg-mauve-deep transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Pokračovat →
        </button>
      )}
    </div>
  )
}
