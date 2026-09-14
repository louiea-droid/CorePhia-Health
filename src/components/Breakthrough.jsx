import { useReveal } from "../hooks/useReveal"
import { ActivityArt, MealPlateArt, TabletArt } from "./Artwork"

const pillars = [
  { label: "Nutrition", art: <MealPlateArt className="size-28 sm:size-36" /> },
  { label: "Exercise", art: <ActivityArt className="h-16 w-40 sm:h-20 sm:w-48" /> },
  { label: "Medical support", art: <TabletArt className="size-28 sm:size-36" label="co" /> },
]

export default function Breakthrough() {
  const [ref, visible] = useReveal()

  return (
    <section
      aria-labelledby="breakthrough-heading"
      data-header-theme="dark"
      className="relative overflow-hidden bg-ink-950"
    >
      <div className="absolute inset-0 bg-gradient-to-tr from-ink-950 via-ink-800 to-brand" />
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 size-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/20 blur-3xl"
        aria-hidden="true"
      />

      <div
        ref={ref}
        className={`relative mx-auto flex max-w-7xl flex-col items-center px-4 py-20 text-center transition-all duration-700 ease-out-smooth sm:px-6 sm:py-24 ${
          visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
        }`}
      >
        <h2 id="breakthrough-heading" className="font-serif text-4xl leading-tight text-paper-100 sm:text-6xl">
          Your weight loss,
          <br />
          <span className="text-accent">done the right way</span>
        </h2>
        <p className="mt-5 max-w-xl text-paper-100/70">
          A personalized program built on real nutrition, structured exercise, and medical support when you need it.
        </p>

        <div className="mt-14 grid w-full max-w-2xl gap-6 sm:grid-cols-3">
          {pillars.map((pillar, index) => (
            <div
              key={pillar.label}
              style={{ transitionDelay: visible ? `${index * 120}ms` : "0ms" }}
              className={`animate-float flex flex-col items-center gap-4 transition-all duration-700 ease-out-smooth ${
                visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
              }`}
            >
              <span className="flex h-28 items-center justify-center sm:h-36">{pillar.art}</span>
              <span className="text-sm font-semibold tracking-wide text-paper-100 uppercase">{pillar.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
