import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import FloatingFlower from './FloatingFlower'

const flowerImg   = '/assets/flower.png'
const flowers1Img = '/assets/flowers/flowers1.png'

const stagger = {
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.25 } },
}
const item = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] } },
}

function JustOpenedX() {
  const { t } = useTranslation()
  // Long enough that the -50% loop point is never visibly reached mid-screen
  const TICKER = t('hero.ticker').repeat(16)

  return (
    <div
      className="absolute inset-x-0 pointer-events-none"
      style={{ top: '11%', height: '22%', zIndex: 10 }}
    >
      {/* Single wrapper rotated 25deg — tilts the whole X */}
      <div style={{
        position: 'absolute',
        inset: 0,
        transform: 'rotate(25deg)',
        transformOrigin: 'center center',
      }}>

        {/* Horizontal band */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '-25%',
          width: '150%',
          height: 36,
          transform: 'translateY(-50%)',
          background: '#b2a3b5',
          overflow: 'hidden',
          borderRadius: 4,
        }}>
          <motion.div
            animate={{ x: ['0%', '-50%'] }}
            transition={{ duration: 150, ease: 'linear', repeat: Infinity }}
            style={{ display: 'flex', alignItems: 'center', height: '100%', width: 'max-content' }}
          >
            <span style={{
              color: 'white',
              fontSize: '11px',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
              userSelect: 'none',
              fontFamily: 'inherit',
            }}>
              {TICKER}{TICKER}
            </span>
          </motion.div>
        </div>

        {/* Second band — rotated 30° relative to wrapper, intersects at 30° */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '-80%',
          width: '260%',
          height: 36,
          transform: 'translateY(-50%) rotate(-30deg)',
          background: '#7a6b7d',
          overflow: 'hidden',
          borderRadius: 4,
        }}>
          <motion.div
            initial={{ x: '0%' }}
            animate={{ x: ['0%', '-50%'] }}
            transition={{ duration: 70, ease: 'linear', repeat: Infinity }}
            style={{ display: 'flex', alignItems: 'center', height: '100%', width: 'max-content' }}
          >
            <span style={{
              color: 'white',
              fontSize: '11px',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
              userSelect: 'none',
              fontFamily: 'inherit',
            }}>
              {TICKER}{TICKER}
            </span>
          </motion.div>
        </div>

      </div>
    </div>
  )
}

export default function Hero() {
  const { t } = useTranslation()

  return (
    <section id="hero" className="min-h-screen grid lg:grid-cols-2 pt-16">

      {/* Left — text (overflow-hidden clips X bands at column edge) */}
      <div className="relative overflow-hidden flex flex-col justify-center px-6 lg:pl-16 xl:pl-24 py-20 lg:py-0 order-2 lg:order-1">
        <JustOpenedX />

        {/* Lotus flower — bottom-right corner, behind all content */}
        <FloatingFlower
          src={flowerImg}
          style={{ bottom: '-60px', right: '-50px', width: '380px', opacity: 0.16, zIndex: 0 }}
          amplitude={14}
          duration={9}
          delay={0.3}
        />
        {/* Small flower peeking top-left */}
        <FloatingFlower
          src={flowerImg}
          style={{ top: '-80px', left: '-60px', width: '220px', opacity: 0.09, zIndex: 0, transform: 'rotate(160deg) scaleX(-1)' }}
          amplitude={8}
          duration={11}
          delay={2}
        />

        <motion.div variants={stagger} initial="hidden" animate="visible" className="max-w-lg relative z-10">

          <motion.p variants={item}
            className="font-body text-xs tracking-widest3 uppercase text-mauve mb-7">
            {t('hero.eyebrow')}
          </motion.p>

          <motion.h1 variants={item}
            className="font-heading text-5xl sm:text-6xl xl:text-7xl text-ink leading-[1.05] mb-6">
            MAISON
            <br />
            <em className="text-mauve not-italic">beauty</em>
          </motion.h1>

          <motion.span variants={item} className="mauve-rule mb-8 block" />

          <motion.p variants={item}
            className="font-body text-base text-charcoal leading-relaxed max-w-xs mb-10">
            {t('hero.tagline')}
          </motion.p>

          <motion.div variants={item} className="flex flex-wrap gap-3">
            <a href="#services"
              className="bg-mauve text-white font-body text-xs tracking-widest2 uppercase px-8 py-3.5 hover:bg-mauve-deep transition-colors duration-300">
              {t('hero.ctaBook')}
            </a>
            <a href="#services"
              className="border border-stone text-charcoal font-body text-xs tracking-widest2 uppercase px-8 py-3.5 hover:border-mauve hover:text-mauve transition-all duration-300">
              {t('hero.ctaServices')}
            </a>
          </motion.div>
        </motion.div>
      </div>

      {/* Right — photo */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, ease: 'easeOut', delay: 0.1 }}
        className="relative overflow-hidden order-1 lg:order-2 h-[55vw] lg:h-auto min-h-[380px]"
      >
        <img
          src="/assets/outside30degreeangle2.jpeg"
          alt="MAISON beauty salon"
          className="w-full h-full object-cover object-center"
          loading="eager"
        />
        <div className="absolute inset-0 lg:bg-gradient-to-r lg:from-ivory/40 lg:via-transparent lg:to-transparent" />

        {/* Anemone flowers overlay — bottom-left of the photo */}
        <FloatingFlower
          src={flowers1Img}
          style={{ bottom: '-10px', left: '0px', width: '260px', opacity: 0.18, zIndex: 2, mixBlendMode: 'multiply' }}
          amplitude={10}
          duration={10}
          delay={1}
        />
      </motion.div>

    </section>
  )
}
