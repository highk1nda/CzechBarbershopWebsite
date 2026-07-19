import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'

export default function AccordionSection({ title, isOpen, onToggle, children }) {
  const reduceMotion = useReducedMotion()

  return (
    <div className="border-b border-stone/70 last:border-0">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="w-full flex items-center justify-between py-5 text-left min-h-[48px]"
      >
        <span className="font-heading text-lg text-ink">{title}</span>
        <span
          aria-hidden="true"
          className={`text-mauve text-xl leading-none font-light transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`}
        >
          +
        </span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: reduceMotion ? 0.01 : 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="overflow-hidden"
          >
            <div className="pb-6">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
