import { motion } from 'framer-motion'
import { ServiceIcon, Clock } from '../ServiceIcons'
import { useBookingCart } from '../../context/BookingCartContext'

export default function ServiceCard({ item, onLearnMore }) {
  const { state, addItem, removeItem } = useBookingCart()
  const inCart = state.cart.has(item.id)

  return (
    <motion.div
      layout
      className={`rounded-2xl border p-5 flex flex-col gap-3.5 transition-all duration-300 ${
        inCart
          ? 'border-mauve shadow-[0_0_0_3px_rgba(178,163,181,0.16)]'
          : 'border-stone hover:border-mauve/40 hover:shadow-card hover:-translate-y-0.5'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full border border-mauve/25 flex items-center justify-center flex-shrink-0 text-mauve">
          <ServiceIcon name={item.icon} />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-heading text-base text-ink leading-snug">{item.name}</h4>
          {item.desc && <p className="font-body text-sm text-warm mt-0.5 leading-tight">{item.desc}</p>}
        </div>
      </div>

      <div className="flex items-center gap-3 font-body text-sm text-frost">
        {item.duration && (
          <span className="flex items-center gap-1.5 whitespace-nowrap">
            <Clock className="w-3.5 h-3.5" />
            {item.duration}
          </span>
        )}
        <span className="font-heading text-mauve-deep font-semibold ml-auto tabular-nums whitespace-nowrap">
          {item.price}
        </span>
      </div>

      <div className="flex items-center gap-3 mt-1">
        {item.details && (
          <button
            type="button"
            onClick={() => onLearnMore(item)}
            className="font-body text-[10px] tracking-widest uppercase text-mauve/70 hover:text-mauve border-b border-mauve/30 hover:border-mauve transition-colors duration-200 whitespace-nowrap"
          >
            Více info
          </button>
        )}
        <button
          type="button"
          onClick={() => (inCart ? removeItem(item.id) : addItem(item.id))}
          aria-pressed={inCart}
          className={`ml-auto font-body text-xs tracking-widest2 uppercase px-4 py-2 min-h-[48px] rounded-full border transition-all duration-300 whitespace-nowrap ${
            inCart
              ? 'bg-mauve border-mauve text-white'
              : 'border-mauve text-mauve-deep hover:bg-mauve hover:text-white'
          }`}
        >
          {inCart ? '✓ Přidáno' : '+ Přidat'}
        </button>
      </div>
    </motion.div>
  )
}
