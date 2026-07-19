import Navbar    from './components/Navbar'
import Hero      from './components/Hero'
import Highlights from './components/Highlights'
import Team      from './components/Team'
import Gallery   from './components/Gallery'
import Instagram from './components/Instagram'
import Contact   from './components/Contact'
import Footer    from './components/Footer'
import BookingSection from './components/booking/BookingSection'
import { BookingCartProvider } from './context/BookingCartContext'

export default function App() {
  return (
    <BookingCartProvider>
      <Navbar />
      <main>
        <Hero />
        <Highlights />
        <BookingSection />
        <Team />
        <Gallery />
        <Instagram />
        <Contact />
      </main>
      <Footer />
    </BookingCartProvider>
  )
}
