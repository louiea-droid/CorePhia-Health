import { useEffect, useRef } from "react"
import { createPortal } from "react-dom"
import { PenArt, TabletArt } from "./Artwork"
import { CartIcon, ChevronRightIcon, CloseIcon, PersonIcon } from "./icons"

const exploreLinks = [
  { label: "Weight Loss", href: "#glp1-lineup" },
  { label: "Labs", href: "#health-check" },
  { label: "Sexual Health", href: "#sex" },
  { label: "Testosterone", href: "#testosterone" },
  { label: "Hair Regrowth", href: "#hair" },
  { label: "Mental Health", href: "#top" },
  { label: "Skin", href: "#top" },
  { label: "Everyday Health", href: "#top" },
]

const topTreatments = [
  { label: "Weight Loss", href: "#glp1-lineup", art: <TabletArt className="size-16" label="co" /> },
  { label: "Semaglutide Pen", href: "#glp1-lineup", art: <PenArt className="h-16" dose="7.2 mg" /> },
  { label: "Testosterone", href: "#testosterone", art: <TabletArt className="size-16" label="t" /> },
  { label: "Hair Regrowth", href: "#hair", art: <TabletArt className="size-16" label="rx" /> },
]

export default function MobileMenu({ open, onClose, onLoginClick }) {
  const closeButtonRef = useRef(null)
  const panelRef = useRef(null)

  useEffect(() => {
    if (!open) return

    closeButtonRef.current?.focus()
    document.body.style.overflow = "hidden"

    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose()
    }
    document.addEventListener("keydown", onKeyDown)

    return () => {
      document.body.style.overflow = ""
      document.removeEventListener("keydown", onKeyDown)
    }
  }, [open, onClose])

  return createPortal(
    <div className={`fixed inset-0 z-50 ${open ? "" : "pointer-events-none"}`}>
      <div
        onClick={onClose}
        aria-hidden="true"
        className={`absolute inset-0 bg-ink-950/60 transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0"
        }`}
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        className={`absolute top-0 right-0 flex h-full w-full max-w-sm flex-col overflow-y-auto rounded-l-3xl bg-paper-50 shadow-2xl transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-6 pt-6 pb-4">
          <h2 className="font-serif text-2xl text-ink-950">Menu</h2>
          <div className="flex items-center gap-4 text-ink-950">
            <button
              type="button"
              aria-label="Account"
              onClick={() => {
                onClose()
                onLoginClick?.()
              }}
            >
              <PersonIcon className="size-6" />
            </button>
            <a href="#cart" aria-label="Cart">
              <CartIcon className="size-6" />
            </a>
            <button ref={closeButtonRef} type="button" onClick={onClose} aria-label="Close menu">
              <CloseIcon className="size-6" />
            </button>
          </div>
        </div>

        <div className="px-6">
          <p className="text-xs font-semibold tracking-widest text-ink-950/40 uppercase">Explore</p>
          <ul className="mt-2 divide-y divide-ink-950/10">
            {exploreLinks.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  onClick={onClose}
                  className="group flex items-center justify-between rounded-xl px-2 py-4 -mx-2 text-lg font-medium text-ink-950 transition-colors duration-200 ease-out-smooth hover:bg-paper-100"
                >
                  {item.label}
                  <ChevronRightIcon className="size-5 text-ink-950/50 transition-transform duration-300 ease-out-smooth group-hover:translate-x-1" />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-2 border-t border-ink-950/10 px-6 py-6">
          <p className="text-xs font-semibold tracking-widest text-ink-950/40 uppercase">Top Treatments</p>
          <ul className="no-scrollbar mt-4 flex gap-3 overflow-x-auto pb-2">
            {topTreatments.map((item) => (
              <li key={item.label} className="w-28 shrink-0">
                <a
                  href={item.href}
                  onClick={onClose}
                  className="flex flex-col items-center gap-2 rounded-2xl bg-paper-100 px-3 py-4 text-center transition-transform duration-300 ease-out-smooth hover:-translate-y-1"
                >
                  <span className="rounded-full bg-accent px-2 py-0.5 text-[10px] font-bold text-ink-950">Rx</span>
                  {item.art}
                  <span className="text-xs font-medium text-ink-950">{item.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>,
    document.body,
  )
}
