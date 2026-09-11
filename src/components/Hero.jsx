import { useIntro } from "../hooks/useIntro"
import { PenArt, TabletArt } from "./Artwork"
import {
  ChevronRightIcon,
  ClipboardCheckIcon,
  DropIcon,
  HairIcon,
  HeartPulseIcon,
  LeafIcon,
  PersonIcon,
  StethoscopeIcon,
} from "./icons"

const quickLinks = [
  { label: "Have better sex", highlight: null, icon: HeartPulseIcon, href: "#sex" },
  { label: "Regrow hair", highlight: null, icon: HairIcon, href: "#hair" },
  { label: "Boost", highlight: "testosterone", icon: DropIcon, href: "#testosterone" },
  { label: "Get a", highlight: "health check", icon: ClipboardCheckIcon, href: "#health-check" },
]

const trustPoints = [
  { label: "Physician Guided", icon: StethoscopeIcon },
  { label: "Evidence Based", icon: ClipboardCheckIcon },
  { label: "Personalized Care", icon: PersonIcon },
  { label: "Sustainable Results", icon: LeafIcon },
]

export default function Hero() {
  const headlineIn = useIntro(350)
  const subheadIn = useIntro(520)
  const trustIn = useIntro(650)
  const cardsIn = useIntro(780)
  const quickLinksIn = useIntro(950)

  return (
    <section id="top" aria-labelledby="hero-heading" className="mx-auto max-w-7xl px-4 pt-10 pb-6 sm:px-6">
      <h1
        id="hero-heading"
        className={`font-serif text-5xl leading-[1.05] text-ink-950 transition-all duration-1000 ease-out-smooth sm:text-6xl ${
          headlineIn ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
        }`}
      >
        Real results.
        <br />
        <span className="text-accent-dark">Lasting confidence.</span>
      </h1>
      <p
        className={`mt-4 max-w-md text-lg text-ink-950/60 transition-all duration-1000 ease-out-smooth ${
          subheadIn ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
        }`}
      >
        Medical weight loss, personalized for you.
      </p>

      <ul
        className={`mt-6 flex flex-wrap gap-x-6 gap-y-3 transition-all duration-1000 ease-out-smooth ${
          trustIn ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
        }`}
      >
        {trustPoints.map(({ label, icon: Icon }) => (
          <li key={label} className="flex items-center gap-2 text-sm font-medium text-ink-950/70">
            <Icon className="size-5 text-accent-dark" />
            {label}
          </li>
        ))}
      </ul>

      <div
        className={`mt-8 grid gap-4 transition-all duration-1000 ease-out-smooth sm:grid-cols-2 ${
          cardsIn ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
        }`}
      >
        <a
          href="#glp1-lineup"
          className="group relative isolate flex min-h-64 flex-col justify-between overflow-hidden rounded-3xl bg-gradient-to-br from-ink-900 via-ink-800 to-accent-dark p-7 text-paper-100 shadow-lg transition-[transform,box-shadow] duration-300 ease-out-smooth hover:-translate-y-1 hover:shadow-2xl"
        >
          <div>
            <p className="font-serif text-2xl leading-snug">
              Start your
              <br />
              <span className="text-accent">weight loss today</span>
            </p>
          </div>

          <div
            className={`pointer-events-none absolute -right-6 top-1/2 flex w-40 -translate-y-1/2 rotate-[18deg] items-center justify-center opacity-95 transition-all duration-1000 ease-out-smooth group-hover:rotate-[12deg] group-hover:scale-105 ${
              cardsIn ? "scale-100" : "scale-110"
            }`}
          >
            <PenArt className="h-56 drop-shadow-2xl" dose="7.2 mg" />
            <TabletArt className="absolute left-2 top-6 size-24 drop-shadow-xl" label="co" />
          </div>

          <div className="relative z-10 flex items-center justify-between text-sm font-medium">
            <span>Find your Rx match</span>
            <ChevronRightIcon className="size-5 transition-transform duration-300 ease-out-smooth group-hover:translate-x-1.5" />
          </div>
        </a>

        <a
          href="#glp1-lineup"
          className="group relative isolate flex min-h-64 flex-col justify-between overflow-hidden rounded-3xl bg-gradient-to-br from-brand-dark via-brand to-accent p-7 text-ink-950 shadow-lg transition-[transform,box-shadow] duration-300 ease-out-smooth hover:-translate-y-1 hover:shadow-2xl"
        >
          <div>
            <p className="font-serif text-2xl leading-snug text-paper-50">
              See how much
              <br />
              weight you can lose
            </p>
          </div>

          <svg
            viewBox="0 0 300 140"
            className="pointer-events-none absolute inset-x-0 bottom-14 h-24 w-full opacity-90"
            aria-hidden="true"
            preserveAspectRatio="none"
          >
            <path
              d="M0 20 C 60 10, 90 90, 150 100 S 260 40, 300 10"
              fill="none"
              stroke="#0d1a3d"
              strokeOpacity="0.35"
              strokeWidth="2"
              strokeDasharray="1 10"
              strokeLinecap="round"
            />
            <circle cx="0" cy="20" r="4" fill="#0d1a3d" />
            <circle cx="300" cy="10" r="4" fill="#0d1a3d" />
          </svg>

          <div className="relative z-10 flex items-center justify-between text-sm font-medium text-paper-50">
            <span>↓ Lose up to 25%*</span>
            <ChevronRightIcon className="size-5 transition-transform duration-300 ease-out-smooth group-hover:translate-x-1.5" />
          </div>
        </a>
      </div>

      <ul
        className={`mt-4 grid gap-3 transition-all duration-1000 ease-out-smooth sm:grid-cols-2 lg:grid-cols-4 ${
          quickLinksIn ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
        }`}
      >
        {quickLinks.map(({ label, highlight, icon: Icon, href }) => (
          <li key={label}>
            <a
              href={href}
              className="group flex items-center justify-between gap-3 rounded-2xl bg-paper-100 py-4 pr-4 pl-5 transition-colors duration-200 ease-out-smooth hover:bg-paper-200/70"
            >
              <span className="text-base text-ink-950">
                {label} {highlight && <span className="text-brand-dark">{highlight}</span>}
              </span>
              <span className="flex shrink-0 items-center gap-2">
                <span className="flex size-11 items-center justify-center rounded-xl bg-paper-200/70 transition-transform duration-300 ease-out-smooth group-hover:scale-110">
                  <Icon className="size-6 text-ink-800" />
                </span>
                <ChevronRightIcon className="size-4 text-ink-950/60 transition-transform duration-300 ease-out-smooth group-hover:translate-x-1" />
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}
