import { Link } from "react-router-dom"
import { useReveal } from "../hooks/useReveal"
import { ActivityArt, CareShieldArt, MealPlateArt } from "./Artwork"

export default function CtaBanner() {
  const [ref, visible] = useReveal()

  return (
    <section aria-labelledby="cta-heading" className="bg-paper-50 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div
          ref={ref}
          className={`relative isolate flex flex-col overflow-hidden rounded-3xl bg-gradient-to-br from-ink-950 via-ink-900 to-accent-dark shadow-xl transition-all duration-700 ease-out-smooth sm:min-h-72 sm:flex-row ${
            visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          <div
            className="pointer-events-none absolute -top-24 -right-24 size-96 rounded-full bg-accent/25 blur-3xl"
            aria-hidden="true"
          />

          <div className="relative z-10 flex flex-1 flex-col justify-center gap-4 p-8 sm:p-12">
            <h2 id="cta-heading" className="font-serif text-3xl leading-tight text-paper-100 sm:text-4xl">
              You deserve to
              <br />
              feel your best.
            </h2>
            <p className="max-w-sm text-paper-100/70">
              Complete your intake and your provider will have the full picture before your first visit. Not
              ready yet? Ask us anything first.
            </p>

            <div className="mt-1 flex flex-wrap gap-3">
              <Link
                to="/intake"
                className="rounded-full bg-accent px-6 py-3 text-sm font-semibold text-ink-950 transition-[transform,background-color] duration-200 ease-out-smooth hover:scale-[1.02] hover:bg-accent-dark"
              >
                Start your intake
              </Link>
              <Link
                to="/contact"
                className="rounded-full border border-paper-100/25 px-6 py-3 text-sm font-semibold text-paper-100 transition-colors duration-200 ease-out-smooth hover:bg-paper-100/10"
              >
                Contact us
              </Link>
            </div>
          </div>

          <div className="relative hidden flex-1 items-center justify-center gap-6 sm:flex" aria-hidden="true">
            <MealPlateArt className="size-24 -rotate-6 opacity-90 drop-shadow-xl" />
            <CareShieldArt className="h-36 drop-shadow-2xl" />
            <ActivityArt className="h-14 w-32 rotate-6 opacity-90 drop-shadow-xl" />
          </div>
        </div>
      </div>
    </section>
  )
}
