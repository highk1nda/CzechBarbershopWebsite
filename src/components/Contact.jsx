import { Reveal } from './Reveal'
import qrCode from '../../assets/qr code.png'

const hours = [
  { day: 'Pondělí – Pátek', time: '9:00 – 19:00', closed: false },
  { day: 'Sobota',           time: '9:00 – 16:00', closed: false },
  { day: 'Neděle',           time: 'Zavřeno',       closed: true  },
]

function Icon({ path, viewBox = '0 0 24 24' }) {
  return (
    <svg viewBox={viewBox} fill="none" stroke="currentColor" strokeWidth="1.5"
      strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 mt-0.5 flex-shrink-0 text-mauve">
      {path}
    </svg>
  )
}

export default function Contact() {
  return (
    <section id="contact" className="section-padding bg-parchment border-t border-stone">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">

        <Reveal className="mb-12">
          <p className="font-body text-xs tracking-widest3 uppercase text-mauve mb-3">Přijďte za námi</p>
          <h2 className="font-heading text-4xl lg:text-5xl text-ink">
            Kde nás <em className="text-mauve not-italic">najdete</em>
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Contact info */}
          <Reveal dir="left">
            <div className="bg-white border border-stone shadow-soft p-10 h-full space-y-7">

              <div className="flex items-start gap-3.5">
                <Icon path={<><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></>} />
                <p className="font-body text-base text-charcoal leading-relaxed">
                  Na Bělidle 840/22<br />Praha 5, 150 00
                </p>
              </div>

              <div className="flex items-start gap-3.5">
                <Icon path={<><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></>} />
                <a href="mailto:info@maisonbeauty.cz"
                  className="font-body text-base text-charcoal hover:text-mauve transition-colors">
                  info@maisonbeauty.cz
                </a>
              </div>

              <div className="flex items-start gap-3.5">
                <Icon path={<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 12 19.79 19.79 0 0 1 1.07 3.4 2 2 0 0 1 3.05 1.22h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 21 16.92z"/>} />
                <a href="tel:+420000000000"
                  className="font-body text-base text-charcoal hover:text-mauve transition-colors">
                  +420 000 000 000
                </a>
              </div>

              <div className="pt-6 border-t border-stone">
                <p className="font-body text-xs tracking-widest2 uppercase text-mauve mb-4">Otevírací doba</p>
                <div className="space-y-2">
                  {hours.map(h => (
                    <div key={h.day} className="flex justify-between font-body text-base">
                      <span className="text-warm">{h.day}</span>
                      <span className={h.closed ? 'text-frost' : 'text-charcoal'}>{h.time}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-stone flex items-center gap-5">
                <img src={qrCode} alt="QR kód – MAISON beauty" className="w-20 h-20 object-contain flex-shrink-0" />
                <div>
                  <p className="font-body text-xs tracking-widest2 uppercase text-mauve mb-1">Naskenujte QR kód</p>
                  <p className="font-body text-sm text-charcoal leading-relaxed">Rychlý přístup k naší stránce na telefonu.</p>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Map */}
          <Reveal dir="right">
            <div className="border border-stone overflow-hidden min-h-[360px] h-full">
              <iframe
                src="https://maps.google.com/maps?q=Na+B%C4%9Blid%C5%82e+840%2F22%2C+150+00+Praha+5%2C+Czech+Republic&output=embed&hl=cs&z=16"
                className="w-full h-full min-h-[360px] border-0"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="MAISON beauty — mapa"
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
