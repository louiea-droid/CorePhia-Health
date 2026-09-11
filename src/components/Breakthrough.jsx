import { useReveal } from "../hooks/useReveal"
import { PenArt, TabletArt } from "./Artwork"

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
        className={`relative mx-auto flex max-w-7xl flex-col items-center px-4 py-24 text-center transition-all duration-700 ease-out-smooth sm:px-6 sm:py-32 ${
          visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
        }`}
      >
        <h2 id="breakthrough-heading" className="font-serif text-4xl leading-tight text-paper-100 sm:text-6xl">
          Your weight loss
          <br />
          <span className="text-accent">breakthrough is here</span>
        </h2>

        <div className="relative mt-16 flex h-72 w-full max-w-md items-center justify-center sm:h-96">
          <PenArt className="animate-float h-full drop-shadow-2xl" dose="7.2 mg" />
          <TabletArt className="absolute -right-4 top-6 size-28 rotate-6 drop-shadow-2xl sm:size-36" label="co" />
          <span className="absolute bottom-8 left-0 -rotate-6 rounded-md bg-accent px-3 py-1 text-xs font-bold tracking-wide text-ink-950 sm:text-sm">
            NEW HIGH DOSE
          </span>
        </div>
      </div>
    </section>
  )
}
