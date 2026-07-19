import { useEffect, useRef, useState } from 'react'
import { Reveal } from '../Reveal'
import FloatingFlower from '../FloatingFlower'
import { useBookingCart } from '../../context/BookingCartContext'
import { pluralizeSluzba } from '../../utils/cartCalculations'
import ProgressSteps from './ProgressSteps'
import StepTransition from './StepTransition'
import CartPanel from './CartPanel'
import CartSheet from './CartSheet'
import StepServices from './steps/StepServices'
import StepAppointment from './steps/StepAppointment'
import StepDetails from './steps/StepDetails'
import StepConfirmation from './steps/StepConfirmation'

const flowers1Img = '/assets/flowers/flowers1.png'
const flower3Img = '/assets/flower3.png'

const STEP_COMPONENTS = {
  1: StepServices,
  2: StepAppointment,
  3: StepDetails,
  4: StepConfirmation,
}

const STEP_LABELS = { 1: 'Služby', 2: 'Termín', 3: 'Údaje', 4: 'Potvrzení' }

export default function BookingSection() {
  const { state, cartCount } = useBookingCart()
  const StepComponent = STEP_COMPONENTS[state.step]

  const [liveMessage, setLiveMessage] = useState('')
  const isFirstStepRender = useRef(true)
  const prevCartCount = useRef(cartCount)

  useEffect(() => {
    if (isFirstStepRender.current) {
      isFirstStepRender.current = false
      return
    }
    setLiveMessage(`Krok ${state.step}: ${STEP_LABELS[state.step]}`)
  }, [state.step])

  useEffect(() => {
    if (cartCount !== prevCartCount.current) {
      prevCartCount.current = cartCount
      setLiveMessage(`Rezervace: ${cartCount} ${pluralizeSluzba(cartCount)}`)
    }
  }, [cartCount])

  return (
    <section id="services" className="section-padding bg-ivory relative overflow-hidden">
      <div aria-live="polite" className="sr-only">{liveMessage}</div>
      <FloatingFlower
        src={flowers1Img}
        style={{ top: '-30px', right: '-40px', width: '300px', opacity: 0.10 }}
        amplitude={12}
        duration={10}
        delay={0.5}
      />
      <FloatingFlower
        src={flower3Img}
        style={{ bottom: '-50px', left: '-40px', width: '240px', opacity: 0.09, transform: 'rotate(20deg)' }}
        amplitude={9}
        duration={12}
        delay={1.5}
      />

      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 relative z-10">
        <Reveal>
          <p className="font-body text-xs tracking-widest3 uppercase text-mauve mb-3">Rezervace online</p>
          <h2 className="font-heading text-4xl lg:text-5xl text-ink mb-4">Rezervujte si termín</h2>
          <p className="font-body text-base text-charcoal max-w-xl mb-9">
            Vyberte jednu nebo více služeb a sestavte si svou rezervaci.
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <ProgressSteps />
        </Reveal>

        <div className={`grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_360px] gap-8 lg:gap-10 mt-10 ${cartCount > 0 ? 'pb-28 lg:pb-0' : ''}`}>
          <div className="min-w-0">
            <StepTransition id={state.step}>
              <StepComponent />
            </StepTransition>
          </div>
          <div className="hidden lg:block">
            <CartPanel />
          </div>
        </div>
      </div>

      <CartSheet />
    </section>
  )
}
