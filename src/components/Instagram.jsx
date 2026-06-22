import { Reveal } from './Reveal'
import instagramSvg from '../../assets/svg/instagram-svgrepo-com.svg'

const IG_URL = 'https://www.instagram.com/maisonbeauty_cz/'
const photos = [
  { src: '/assets/inside2.jpeg',            alt: 'Interiér salonu'  },
  { src: '/assets/inside3_mirror.jpeg',     alt: 'Zrcadla v salonu' },
  { src: '/assets/inside4_barbershop.jpeg', alt: 'Pracovní místa'   },
  { src: '/assets/photo-inside.jpeg',       alt: 'Foto ze salonu'   },
  { src: '/assets/outside2.jpeg',           alt: 'Exteriér salonu'  },
  { src: '/assets/front_doors.jpeg',        alt: 'Vchodové dveře'   },
]

function IgIcon({ size = 16 }) {
  return (
    <img src={instagramSvg} alt="" aria-hidden="true"
      width={size} height={size}
      style={{ filter: 'brightness(0) invert(72%) sepia(9%) saturate(494%) hue-rotate(247deg) brightness(0.98) contrast(0.92)' }}
    />
  )
}

export default function Instagram() {
  return (
    <section className="section-padding bg-parchment border-t border-stone">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">

        {/* Header */}
        <Reveal className="flex flex-col items-center text-center mb-12">
          <a href={IG_URL} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 text-mauve hover:text-mauve-deep transition-colors duration-300 mb-4">
            <IgIcon size={14} />
            <span className="font-body text-xs tracking-widest3 uppercase">@maisonbeauty_cz</span>
          </a>
          <h2 className="font-heading text-4xl lg:text-5xl text-ink mb-3">
            Sledujte nás <em className="text-mauve not-italic">na Instagramu</em>
          </h2>
          <p className="font-body text-base text-charcoal max-w-sm leading-relaxed">
            Každodenní inspirace, novinky a zákulisí salonu.
          </p>

          {/* Profile stats */}
          <a href={IG_URL} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-8 mt-6 pt-6 border-t border-stone/60 hover:opacity-75 transition-opacity duration-300 cursor-pointer">
            <div className="text-center">
              <p className="font-heading text-2xl text-ink">55</p>
              <p className="font-body text-xs tracking-widest2 uppercase text-warm mt-0.5">Příspěvků</p>
            </div>
            <div className="w-px h-8 bg-stone" />
            <div className="text-center">
              <p className="font-heading text-2xl text-ink">2 400<span className="text-mauve">+</span></p>
              <p className="font-body text-xs tracking-widest2 uppercase text-warm mt-0.5">Sledujících</p>
            </div>
            <div className="w-px h-8 bg-stone" />
            <div className="text-center">
              <p className="font-heading text-2xl text-ink">217</p>
              <p className="font-body text-xs tracking-widest2 uppercase text-warm mt-0.5">Sleduje</p>
            </div>
          </a>
        </Reveal>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-10">
          {photos.map((photo, i) => (
            <Reveal key={photo.src} delay={i * 0.055}>
              <a href={IG_URL} target="_blank" rel="noopener noreferrer"
                className="block aspect-square overflow-hidden relative group">
                <img src={photo.src} alt={photo.alt} loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-mauve/0 group-hover:bg-mauve/20 transition-colors duration-400 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white">
                    <IgIcon size={20} />
                  </div>
                </div>
              </a>
            </Reveal>
          ))}
        </div>

        {/* Follow button */}
        <Reveal className="text-center">
          <a href={IG_URL} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 border border-mauve/40 text-mauve-deep font-body text-xs tracking-widest2 uppercase px-8 py-3.5 hover:border-mauve hover:bg-mauve/6 transition-all duration-300">
            <IgIcon size={13} />
            Sledovat na Instagramu
          </a>
        </Reveal>
      </div>
    </section>
  )
}
