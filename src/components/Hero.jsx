import { motion } from 'framer-motion'

const stagger = {
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.25 } },
}
const item = {
  hidden:  { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] } },
}

export default function Hero() {
  return (
    <section id="hero" className="min-h-screen grid lg:grid-cols-2 pt-16">

      {/* Left — text */}
      <div className="flex flex-col justify-center px-6 lg:pl-16 xl:pl-24 py-20 lg:py-0 order-2 lg:order-1">
        <motion.div variants={stagger} initial="hidden" animate="visible" className="max-w-lg">

          <motion.p variants={item}
            className="font-body text-xs tracking-widest3 uppercase text-mauve mb-7">
            Praha · Kadeřnictví & Kosmetika
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
            Kde krása a péče splývají v jedno — váš prostor, kde se cítíte dobře.
          </motion.p>

          <motion.div variants={item} className="flex flex-wrap gap-3">
            <a href="#booking"
              className="bg-mauve text-white font-body text-xs tracking-widest2 uppercase px-8 py-3.5 hover:bg-mauve-deep transition-colors duration-300">
              Rezervovat termín
            </a>
            <a href="#services"
              className="border border-stone text-charcoal font-body text-xs tracking-widest2 uppercase px-8 py-3.5 hover:border-mauve hover:text-mauve transition-all duration-300">
              Naše služby
            </a>
          </motion.div>
        </motion.div>
      </div>

      {/* Right — photo */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, ease: 'easeOut', delay: 0.1 }}
        className="relative order-1 lg:order-2 h-[55vw] lg:h-auto min-h-[380px]"
      >
        <img
          src="/assets/outside30degreeangle.jpeg"
          alt="MAISON beauty salon"
          className="w-full h-full object-cover object-center"
          loading="eager"
        />
        {/* Subtle warm vignette on left edge to blend with ivory */}
        <div className="absolute inset-0 lg:bg-gradient-to-r lg:from-ivory/40 lg:via-transparent lg:to-transparent" />
      </motion.div>

    </section>
  )
}
