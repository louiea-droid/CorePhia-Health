import { Helmet } from "react-helmet-async"
import Breakthrough from "../components/Breakthrough"
import Hero from "../components/Hero"
import PricingSection from "../components/PricingSection"
import ProgramGrid from "../components/ProgramGrid"
import ScienceSection from "../components/ScienceSection"
import TeamSection from "../components/TeamSection"

export default function Home() {
  return (
    <>
      <Helmet>
        <title>Corephia — Personalized Weight Loss Programs</title>
        <meta
          name="description"
          content="Corephia builds personalized weight loss programs around real nutrition coaching, structured exercise, and physician-guided medical support when appropriate. Start your program today."
        />
        <link rel="canonical" href="https://www.corephia.com/" />
      </Helmet>
      <Hero />
      <Breakthrough />
      <ProgramGrid />
      <PricingSection />
      <ScienceSection />
      <TeamSection />
    </>
  )
}
