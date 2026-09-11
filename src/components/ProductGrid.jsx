import { useReveal } from "../hooks/useReveal"
import { PenArt, TabletArt } from "./Artwork"
import { BadgeCheckIcon } from "./icons"

function FdaSeal() {
  return (
    <span
      className="absolute top-4 right-4 flex size-14 items-center justify-center rounded-full border border-dashed border-paper-50/70 text-center text-[6px] leading-tight font-semibold tracking-wide text-paper-50 uppercase"
      aria-label="FDA approved for weight loss"
    >
      <BadgeCheckIcon className="absolute size-6 opacity-25" />
      <span className="relative px-1.5">FDA approved</span>
    </span>
  )
}

function Badge({ children, tone = "new" }) {
  const tones = {
    new: "bg-accent text-ink-950",
    dose: "bg-paper-50 text-ink-950",
  }
  return (
    <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${tones[tone]}`}>{children}</span>
  )
}

function ProductCard({ product, index }) {
  const [ref, visible] = useReveal()

  return (
    <li
      ref={ref}
      style={{ transitionDelay: visible ? `${index * 90}ms` : "0ms" }}
      className={`transition-all duration-700 ease-out-smooth ${
        visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      }`}
    >
      <article className="group relative flex h-full min-h-80 flex-col justify-between overflow-hidden rounded-3xl bg-gradient-to-b from-brand to-brand-dark p-6 shadow-lg transition-[transform,box-shadow] duration-300 ease-out-smooth hover:-translate-y-1.5 hover:shadow-2xl">
        {product.fda && <FdaSeal />}
        {product.badges.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {product.badges.map((b) => (
              <Badge key={b.label} tone={b.tone}>
                {b.label}
              </Badge>
            ))}
          </div>
        )}

        <div
          className="flex flex-1 items-center justify-center py-6 transition-transform duration-300 ease-out-smooth group-hover:scale-110"
          aria-hidden="true"
        >
          {product.art}
        </div>

        <div>
          <p className="text-lg font-medium text-ink-950">{product.name}</p>
          <p className="mt-1 text-sm text-ink-950/70">
            From {product.price}/mo<sup>&dagger;</sup>
          </p>
          <p className="text-sm text-ink-950/70">{product.molecule}</p>
        </div>
      </article>
    </li>
  )
}

const products = [
  {
    name: "Semaglutide Tablet",
    molecule: "Semaglutide",
    price: "$149",
    badges: [],
    fda: true,
    art: <TabletArt className="size-28" label="co" />,
  },
  {
    name: "Tirzepatide Auto-Injector",
    molecule: "Tirzepatide",
    price: "$299",
    badges: [],
    fda: true,
    art: <PenArt className="h-40" dose="10 mg" accent="#8fd3c7" />,
  },
  {
    name: "Daily Oral GLP-1",
    molecule: "Orforglipron-class",
    price: "$149",
    badges: [{ label: "New", tone: "new" }],
    fda: false,
    art: <TabletArt className="size-28" label="rx" />,
  },
  {
    name: "Semaglutide Auto-Injector",
    molecule: "Semaglutide",
    price: "$199",
    badges: [
      { label: "New", tone: "new" },
      { label: "High dose option", tone: "dose" },
    ],
    fda: false,
    art: <PenArt className="h-40" dose="7.2 mg" />,
  },
]

export default function ProductGrid() {
  const [headingRef, headingVisible] = useReveal()

  return (
    <section
      id="glp1-lineup"
      aria-labelledby="lineup-heading"
      data-header-theme="dark"
      className="bg-ink-950 py-20 sm:py-28"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <h2
          ref={headingRef}
          id="lineup-heading"
          className={`font-serif text-3xl text-paper-100 transition-all duration-700 ease-out-smooth sm:text-4xl ${
            headingVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
        >
          Access our wide GLP-1 lineup
        </h2>

        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((p, index) => (
            <ProductCard key={p.name} product={p} index={index} />
          ))}
        </ul>

        <p className="mt-8 max-w-3xl text-center text-xs text-paper-100/50 sm:mx-auto">
          &dagger;Price includes medication only, if prescribed. An active Corephia Weight Loss Membership is
          required ($39 for the first month, auto-renews at $149/month thereafter). Membership is billed separately
          and does not include or guarantee a prescription.{" "}
          <a href="#pricing-details" className="underline underline-offset-2 hover:text-paper-100">
            Read more
          </a>
        </p>
      </div>
    </section>
  )
}
