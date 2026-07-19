import { motion, useReducedMotion } from 'framer-motion'

export default function CheckmarkMorph() {
  const reduceMotion = useReducedMotion()

  return (
    <motion.div
      initial={{ scale: 0.6, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: reduceMotion ? 0.01 : 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="w-16 h-16 rounded-full bg-mauve/10 flex items-center justify-center mx-auto mb-6"
    >
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <motion.circle
          cx="16"
          cy="16"
          r="14"
          stroke="#b2a3b5"
          strokeWidth="1.5"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: reduceMotion ? 0.01 : 0.5, ease: 'easeInOut' }}
        />
        <motion.path
          d="M9 16.5l4.5 4.5L23 11"
          stroke="#7a6b7d"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: reduceMotion ? 0.01 : 0.4, delay: reduceMotion ? 0 : 0.45, ease: 'easeOut' }}
        />
      </svg>
    </motion.div>
  )
}
