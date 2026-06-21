import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Reveal } from './Reveal'

const photos = [
  { src: '/assets/inside3_mirror.jpeg',     alt: 'Zrcadla v salonu',  span: 'col-span-2 row-span-2' },
  { src: '/assets/inside4_barbershop.jpeg', alt: 'Pracovní místa',    span: '' },
  { src: '/assets/photo-inside.jpeg',       alt: 'Interiér salonu',   span: '' },
  { src: '/assets/front_doors.jpeg',        alt: 'Vchodové dveře',    span: '' },
  { src: '/assets/outside2.jpeg',           alt: 'Exteriér salonu',   span: '' },
  { src: '/assets/outside.jpeg',            alt: 'Salon zvenčí',      span: '' },
]

export default function Gallery() {
  const [lightbox, setLightbox] = useState(null)

  return (
    <section id="gallery" className="section-padding bg-ivory border-t border-stone">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <Reveal>
            <p className="font-body text-xs tracking-widest3 uppercase text-mauve mb-3">Prostory</p>
            <h2 className="font-heading text-4xl lg:text-5xl text-ink">Galerie</h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="font-body text-base text-charcoal max-w-xs leading-relaxed">
              Nahlédněte do světa MAISON beauty.
            </p>
          </Reveal>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 auto-rows-[200px]">
          {photos.map((photo, i) => (
            <Reveal key={photo.src} delay={i * 0.05}
              className={`${photo.span} overflow-hidden cursor-pointer group`}>
              <div
                className="w-full h-full overflow-hidden relative"
                onClick={() => setLightbox(photo)}
              >
                <img src={photo.src} alt={photo.alt} loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/15 transition-colors duration-500 flex items-center justify-center">
                  <span className="text-white text-2xl font-light opacity-0 group-hover:opacity-100 transition-opacity duration-400">
                    ↗
                  </span>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setLightbox(null)}
            className="fixed inset-0 z-50 bg-ink/80 backdrop-blur-sm flex items-center justify-center p-6 cursor-pointer"
          >
            <motion.img
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
              src={lightbox.src}
              alt={lightbox.alt}
              className="max-w-full max-h-[88vh] object-contain shadow-lift"
            />
            <button onClick={() => setLightbox(null)}
              className="absolute top-5 right-7 text-white/70 hover:text-white text-3xl font-light transition-colors">
              ×
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
