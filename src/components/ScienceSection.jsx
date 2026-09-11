import { PenArt, TabletArt } from "./Artwork"
import { useReveal } from "../hooks/useReveal"

function DoseGauge({ dose = "7.2 mg", active }) {
  const ticks = Array.from({ length: 13 })
  const cx = 100
  const cy = 88
  const rInner = 62
  const rOuter = 82

  const trackPath = Array.from({ length: 49 })
    .map((_, i) => {
      const angle = 180 - (i / 48) * 180
      const rad = (angle * Math.PI) / 180
      const x = cx + rOuter * Math.cos(rad)
      const y = cy - rOuter * Math.sin(rad)
      return `${i === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`
    })
    .join(" ")

  return (
    <div className="relative flex flex-col items-center">
      <svg viewBox="0 0 200 100" className="w-44" aria-hidden="true">
        <path d={trackPath} fill="none" stroke="#24365f" strokeWidth="1.5" strokeOpacity="0.6" />
        {ticks.map((_, i) => {
          const angle = 180 - (i / (ticks.length - 1)) * 180
          const rad = (angle * Math.PI) / 180
          const x1 = cx + rInner * Math.cos(rad)
          const y1 = cy - rInner * Math.sin(rad)
          const x2 = cx + rOuter * Math.cos(rad)
          const y2 = cy - rOuter * Math.sin(rad)
          const isMid = i === Math.floor(ticks.length / 2)
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={isMid ? "#f4a94a" : "#2a3f66"}
              strokeWidth={isMid ? 3 : 1.5}
              strokeLinecap="round"
              style={
                active
                  ? { animation: `tick-fade 0.4s ease-out ${0.4 + i * 0.04}s both` }
                  : { opacity: 0 }
              }
            />
          )
        })}
        <circle cx={cx} cy={cy} r="3.5" fill="#f4a94a" />
      </svg>
      <p className="mt-1 text-sm font-medium text-paper-100">{dose}</p>
    </div>
  )
}

export default function ScienceSection() {
  const [absorptionRef, absorptionVisible] = useReveal()
  const [doseRef, doseVisible] = useReveal()

  return (
    <section
      aria-labelledby="science-heading"
      data-header-theme="dark"
      className="bg-ink-950 pb-20 sm:pb-28"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <h2 id="science-heading" className="sr-only">
          How Corephia's weight loss treatments work
        </h2>

        <div className="grid gap-4 lg:grid-cols-2">
          <div
            ref={absorptionRef}
            className={`flex flex-col gap-6 rounded-3xl bg-ink-800 p-6 transition-all duration-700 ease-out-smooth sm:p-8 ${
              absorptionVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <p className="font-serif text-2xl leading-tight text-paper-100 sm:text-3xl">
                The perfect
                <br />
                <span className="text-accent">absorption boost</span>
              </p>
              <a
                href="#science"
                className="shrink-0 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-ink-950 transition-[transform,background-color] duration-200 ease-out-smooth hover:scale-105 hover:bg-accent-dark"
              >
                See the science
              </a>
            </div>

            <div className="flex flex-1 flex-col items-center justify-center gap-6 sm:flex-row sm:gap-8">
              <p
                className={`max-w-32 text-sm text-paper-100/70 transition-all delay-150 duration-700 ease-out-smooth sm:text-right ${
                  absorptionVisible ? "translate-x-0 opacity-100" : "-translate-x-4 opacity-0"
                }`}
              >
                Activates <span className="text-paper-100">GLP-1 receptors in the brain</span>
              </p>
              <TabletArt
                className={`size-28 shrink-0 transition-all delay-300 duration-700 ease-out-smooth ${
                  absorptionVisible ? "scale-100 animate-sphere-drift opacity-100" : "scale-75 opacity-0"
                }`}
                label="co"
              />
              <p
                className={`max-w-32 text-sm text-paper-100/70 transition-all delay-[450ms] duration-700 ease-out-smooth ${
                  absorptionVisible ? "translate-x-0 opacity-100" : "translate-x-4 opacity-0"
                }`}
              >
                Enhances <span className="text-paper-100">GLP-1 absorption in the stomach</span>
              </p>
            </div>
          </div>

          <div
            ref={doseRef}
            className={`flex flex-col items-center rounded-3xl bg-ink-800 p-6 text-center transition-all duration-700 ease-out-smooth sm:p-8 ${
              doseVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
          >
            <span className="animate-soft-pulse rounded-full border border-accent/40 px-3 py-1 text-xs font-semibold text-accent">
              New high dose
            </span>
            <p className="mt-3 font-serif text-2xl leading-tight text-paper-100 sm:text-3xl">
              Lose up to 25% body weight*
            </p>

            <PenArt className="animate-float mt-4 h-32 drop-shadow-xl" dose="7.2 mg" />
            <div className="mt-1">
              <DoseGauge dose="7.2 mg" active={doseVisible} />
            </div>

            <a
              href="#glp1-lineup"
              className="mt-4 rounded-full bg-accent px-6 py-2.5 text-sm font-semibold text-ink-950 transition-[transform,background-color] duration-200 ease-out-smooth hover:scale-105 hover:bg-accent-dark"
            >
              Explore semaglutide pen
            </a>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-paper-100/40">
          *Based on clinical trial results for the highest dose. Individual results vary.
        </p>
      </div>
    </section>
  )
}
