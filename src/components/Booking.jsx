import { Reveal } from './Reveal'

export default function Booking() {
  return (
    <section id="booking" className="section-padding bg-ivory border-t border-stone">
      <div className="max-w-3xl mx-auto px-6 lg:px-10 text-center">

        <Reveal>
          <p className="font-body text-xs tracking-widest3 uppercase text-mauve mb-5">Rezervace online</p>
          <h2 className="font-heading text-4xl lg:text-5xl text-ink mb-4">
            Vaše krása,{' '}
            <em className="text-mauve not-italic">váš čas</em>
          </h2>
          <span className="mauve-rule mx-auto block mb-7" />
          <p className="font-body text-base text-charcoal leading-relaxed max-w-sm mx-auto mb-10">
            Jednoduše, rychle, online — vyberte si službu a čas, který vám vyhovuje.
          </p>

          {/* Fresha placeholder */}
          <div className="border border-stone bg-parchment/60 px-10 py-12 mb-8">
            <p className="font-body text-xs text-frost mb-1 tracking-wide">Rezervační systém</p>
            <p className="font-body text-xs text-stone">
              {/* Client instruction — remove after Fresha embed is inserted */}
              Vložte Fresha widget: Nastavení → Widget pro rezervace → zkopírujte kód sem
            </p>
          </div>

          <a href="#contact"
            className="inline-block border border-stone text-warm font-body text-xs tracking-widest2 uppercase px-8 py-3.5 hover:border-mauve hover:text-mauve transition-all duration-300">
            Nebo nás kontaktujte
          </a>
        </Reveal>
      </div>
    </section>
  )
}
