import Navbar    from './components/Navbar'
import Hero      from './components/Hero'
import Highlights from './components/Highlights'
import Services  from './components/Services'
import Team      from './components/Team'
import Gallery   from './components/Gallery'
import Instagram from './components/Instagram'
import Booking   from './components/Booking'
import Contact   from './components/Contact'
import Footer    from './components/Footer'

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Highlights />
        <Services />
        <Team />
        <Gallery />
        <Instagram />
        <Booking />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
