import { motion } from 'framer-motion'

const variants = {
  hidden: (dir) => ({
    opacity: 0,
    y:  dir === 'up'    ? 24 : 0,
    x:  dir === 'left'  ? -24 : dir === 'right' ? 24 : 0,
  }),
  visible: { opacity: 1, y: 0, x: 0 },
}

export function Reveal({ children, dir = 'up', delay = 0, className = '' }) {
  return (
    <motion.div
      className={className}
      custom={dir}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-48px' }}
      transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94], delay }}
    >
      {children}
    </motion.div>
  )
}
