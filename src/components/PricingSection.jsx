import { Link } from "react-router-dom"
import { useReveal } from "../hooks/useReveal"
import {
  BadgeCheckIcon,
  CrownIcon,
  LeafIcon,
  LockIcon,
  PillBottleIcon,
  ShieldCheckIcon,
  StarIcon,
  TrendingUpIcon,
} from "./icons"

const tiers = [
  {
    name: "Core",
    tagline: "Build the foundation",
    icon: LeafIcon,
    description: "Essential support to kickstart your journey.",
    price: "199",
    popular: false,
    features: [
      "Physician consultation & medical evaluation",
      "Personalized weight loss plan",
      "Prescription medication (if needed)",
      "Regular progress check-ins",
      "24/7 patient support",
    ],
  },
  {
    name: "Core+",
    tagline: "Elevate your results",
    icon: StarIcon,
    description: "Everything in Core, plus enhanced tools and support.",
    price: "249",
    popular: true,
    features: [
      "Everything in Core",
      "Personalized nutrition guidance",
      "Advanced macro/calorie tracking & dietitian discussion (every quarter)",
      "Workout & lifestyle recommendations",
      "Priority support",
      "Monthly progress review with provider",
    ],
  },
  {
    name: "Core Complete",
    tagline: "The complete transformation",
    icon: CrownIcon,
    description: "Our most comprehensive program for maximum and lasting results.",
    price: "349",
    popular: false,
    features: [
      "Everything in Core+",
      "Custom meal planning",
      "Exercise recommendations based on your goal",
      "Advanced lab testing (2x per year)",
      "1:1 certified trainer check-ins",
      "Unlimited provider access",
      "VIP experience",
    ],
  },
]

const trustBadges = [
  { label: "Doctor Led Care", detail: "Expert care from licensed providers.", icon: ShieldCheckIcon },
  {
    label: "Medication When Appropriate",
    detail: "FDA-approved medication, prescribed only when clinically appropriate.",
    icon: PillBottleIcon,
  },
  { label: "Proven Results", detail: "Real people. Real transformations.", icon: TrendingUpIcon },
  { label: "Safe & Confidential", detail: "Your health. Your privacy. Always.", icon: LockIcon },
]

function PricingCard({ tier, index }) {
  const [ref, visible] = useReveal()

  return (
    <li
      ref={ref}
      style={{ transitionDelay: visible ? `${index * 100}ms` : "0ms" }}
      className={`relative transition-all duration-700 ease-out-smooth ${
        visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      }`}
    >
      {tier.popular && (
        <span className="absolute -top-4 left-1/2 z-10 -translate-x-1/2 rounded-full bg-ink-950 px-4 py-1.5 text-xs font-bold tracking-wide text-paper-50 uppercase">
          Most popular
        </span>
      )}

      <article
        className={`flex h-full flex-col rounded-3xl border p-8 shadow-md transition-[transform,box-shadow] duration-300 ease-out-smooth hover:-translate-y-1 hover:shadow-xl ${
          tier.popular
            ? "border-accent-dark bg-gradient-to-b from-paper-100 to-accent/15"
            : "border-ink-950/10 bg-paper-100/60"
        }`}
      >
        <div className="flex justify-center">
          <span className="flex size-12 items-center justify-center rounded-full border border-accent-dark/40 text-accent-dark">
            <tier.icon className="size-6" />
          </span>
        </div>

        <div className="mt-4 text-center">
          <p className="font-serif text-2xl text-ink-950">{tier.name}</p>
          <p className="mt-1 text-xs font-semibold tracking-wide text-accent-dark uppercase">{tier.tagline}</p>
        </div>

        <p className="mt-4 text-center text-sm text-ink-950/60">{tier.description}</p>

        <div className="mt-6 border-t border-ink-950/10 pt-6 text-center">
          <p className="font-serif text-4xl text-ink-950">
            <span className="align-top text-xl">$</span>
            {tier.price}
          </p>
          <p className="text-xs font-semibold tracking-wide text-ink-950/50 uppercase">Per month</p>
        </div>

        <ul className="mt-6 flex-1 space-y-3">
          {tier.features.map((feature) => (
            <li key={feature} className="flex items-start gap-2.5 text-sm text-ink-950/70">
              <BadgeCheckIcon className="mt-0.5 size-5 shrink-0 text-accent-dark" />
              {feature}
            </li>
          ))}
        </ul>

        <Link
          to={`/intake?plan=${encodeURIComponent(tier.name)}`}
          className={`mt-8 block rounded-full px-6 py-3.5 text-center text-sm font-semibold transition-[transform,background-color] duration-200 ease-out-smooth hover:scale-[1.02] ${
            tier.popular
              ? "bg-ink-950 text-paper-50 hover:bg-ink-900"
              : "border border-ink-950/20 text-ink-950 hover:border-ink-950/40 hover:bg-ink-950/5"
          }`}
        >
          Choose {tier.name}
        </Link>
      </article>
    </li>
  )
}

export default function PricingSection() {
  const [headingRef, headingVisible] = useReveal()
  const [badgesRef, badgesVisible] = useReveal()

  return (
    <section
      id="pricing"
      aria-labelledby="pricing-heading"
      className="bg-gradient-to-b from-paper-50 to-paper-100/50 py-16 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 text-center sm:px-6">
        <div
          ref={headingRef}
          className={`transition-all duration-700 ease-out-smooth ${
            headingVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
        >
          <h2 id="pricing-heading" className="font-serif text-4xl leading-tight text-ink-950 sm:text-5xl">
            Choose your <span className="text-accent-dark">membership</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-ink-950/60">
            Every plan pairs you with a licensed provider. Pricing reflects a monthly membership — cancel anytime.
          </p>
        </div>

        <ul className="mt-14 grid gap-6 text-left lg:grid-cols-3">
          {tiers.map((tier, index) => (
            <PricingCard key={tier.name} tier={tier} index={index} />
          ))}
        </ul>

        <ul
          ref={badgesRef}
          className={`mt-12 grid gap-6 rounded-3xl bg-paper-100 p-8 transition-all duration-700 ease-out-smooth sm:grid-cols-2 lg:grid-cols-4 ${
            badgesVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
        >
          {trustBadges.map(({ label, detail, icon: Icon }) => (
            <li key={label} className="flex flex-col items-center gap-2 text-center sm:items-start sm:text-left">
              <Icon className="size-7 text-accent-dark" />
              <p className="font-semibold text-ink-950">{label}</p>
              <p className="text-sm text-ink-950/60">{detail}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
