import { motion } from 'framer-motion'

export default function FloatingFlower({ src, className = '', style = {}, amplitude = 10, duration = 7, delay = 0 }) {
  return (
    <motion.img
      src={src}
      aria-hidden="true"
      draggable={false}
      animate={{ y: [0, -amplitude, 0] }}
      transition={{ duration, repeat: Infinity, ease: 'easeInOut', delay }}
      className={`pointer-events-none select-none absolute ${className}`}
      style={style}
    />
  )
}
