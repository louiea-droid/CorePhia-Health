import Breakthrough from "./components/Breakthrough"
import CtaBanner from "./components/CtaBanner"
import Footer from "./components/Footer"
import Header from "./components/Header"
import Hero from "./components/Hero"
import PricingSection from "./components/PricingSection"
import ProductGrid from "./components/ProductGrid"
import ScienceSection from "./components/ScienceSection"
import TeamSection from "./components/TeamSection"

function App() {
  return (
    <div className="bg-paper-50">
      <Header />
      <main>
        <Hero />
        <Breakthrough />
        <ProductGrid />
        <PricingSection />
        <ScienceSection />
        <TeamSection />
      </main>
      <CtaBanner />
      <Footer />
    </div>
  )
}

export default App
