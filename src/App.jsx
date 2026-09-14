import { useEffect } from "react"
import { Route, Routes, useLocation, useNavigationType } from "react-router-dom"
import Footer from "./components/Footer"
import Header from "./components/Header"
import PatientIntakeForm from "./components/PatientIntakeForm"
import About from "./pages/About"
import Contact from "./pages/Contact"
import Home from "./pages/Home"

function ScrollManager() {
  const { pathname, hash } = useLocation()
  const navigationType = useNavigationType()

  useEffect(() => {
    // On a deep link the browser resolves the hash before React has rendered the
    // target, so it never scrolls. Do it here instead, once the section exists.
    if (hash) {
      document.querySelector(hash)?.scrollIntoView({ behavior: "instant" })
      return
    }
    if (navigationType === "POP") return
    window.scrollTo({ top: 0, behavior: "instant" })
  }, [pathname, hash, navigationType])

  return null
}

function App() {
  return (
    <div className="bg-paper-50">
      <ScrollManager />
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/intake" element={<PatientIntakeForm />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
