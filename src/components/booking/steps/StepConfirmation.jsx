import { motion } from 'framer-motion'
import { useBookingCart } from '../../../context/BookingCartContext'

export default function StepConfirmation() {
  const { cartItems, reset } = useBookingCart()

  return (
    <div className="rounded-3xl border border-stone bg-white shadow-soft p-8 sm:p-12 text-center">
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="w-16 h-16 rounded-full bg-mauve/10 flex items-center justify-center mx-auto mb-6"
      >
        <span className="text-3xl text-mauve" aria-hidden="true">✓</span>
      </motion.div>

      <p className="font-body text-xs tracking-widest3 uppercase text-mauve mb-3">Rezervace online</p>
      <h3 className="font-heading text-3xl sm:text-4xl text-ink mb-4">
        Potvrzení <em className="text-mauve not-italic">odesláno</em>
      </h3>
      <span className="mauve-rule mx-auto block mb-6" />
      <p className="font-body text-base text-charcoal leading-relaxed max-w-sm mx-auto mb-8">
        Děkujeme! Brzy vás kontaktujeme pro potvrzení termínu.
      </p>

      {cartItems.length > 0 && (
        <ul className="max-w-sm mx-auto text-left space-y-1.5 mb-8 border-t border-stone pt-5">
          {cartItems.map((item) => (
            <li key={item.id} className="flex justify-between gap-4 font-body text-sm text-charcoal">
              <span>{item.name}</span>
              <span className="text-mauve-deep font-semibold flex-shrink-0">{item.price}</span>
            </li>
          ))}
        </ul>
      )}

      <div className="flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="border border-stone text-warm font-body text-xs tracking-widest2 uppercase px-8 py-3.5 rounded-full hover:border-mauve hover:text-mauve transition-all duration-300"
        >
          Nová rezervace
        </button>
        <a
          href="#hero"
          onClick={reset}
          className="bg-mauve text-white font-body text-xs tracking-widest2 uppercase px-8 py-3.5 rounded-full hover:bg-mauve-deep transition-all duration-300 inline-block"
        >
          Zpět na hlavní stránku
        </a>
      </div>
    </div>
  )
}
