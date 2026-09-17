import { useEffect, useRef } from "react"
import { createPortal } from "react-dom"
import { Link } from "react-router-dom"
import { ActivityArt, CareShieldArt, MealPlateArt } from "./Artwork"
import { ChevronRightIcon, CloseIcon, PersonIcon } from "./icons"

const exploreLinks = [
  { label: "Home", to: "/" },
  { label: "Weight Loss Programs", href: "/#programs" },
  { label: "Membership Pricing", href: "/#pricing" },
  { label: "About Us", to: "/about" },
  { label: "Contact Us", to: "/contact" },
  { label: "FAQs", to: "/faq" },
]

const topPrograms = [
  { label: "Nutrition Coaching", href: "/#programs", art: <MealPlateArt className="size-16" /> },
  { label: "Exercise Plans", href: "/#programs", art: <ActivityArt className="h-10 w-24" /> },
  { label: "Medical Support", href: "/#programs", art: <CareShieldArt className="h-16" /> },
]

export default function MobileMenu({ open, onClose, onAccountClick }) {
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
    <div className={`fixed inset-0 z-50 ${open ? "" : "pointer-events-none"}`} inert={!open}>
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
        aria-hidden={!open}
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
                onAccountClick?.()
              }}
            >
              <PersonIcon className="size-6" />
            </button>
            <button ref={closeButtonRef} type="button" onClick={onClose} aria-label="Close menu">
              <CloseIcon className="size-6" />
            </button>
          </div>
        </div>

        <div className="px-6">
          <p className="text-xs font-semibold tracking-widest text-ink-950/40 uppercase">Explore</p>
          <ul className="mt-2 divide-y divide-ink-950/10">
            {exploreLinks.map((item) => {
              const LinkTag = item.to ? Link : "a"
              const linkProps = item.to ? { to: item.to } : { href: item.href }
              return (
                <li key={item.label}>
                  <LinkTag
                    {...linkProps}
                    onClick={onClose}
                    className="group flex items-center justify-between rounded-xl px-2 py-4 -mx-2 text-lg font-medium text-ink-950 transition-colors duration-200 ease-out-smooth hover:bg-paper-100"
                  >
                    {item.label}
                    <ChevronRightIcon className="size-5 text-ink-950/50 transition-transform duration-300 ease-out-smooth group-hover:translate-x-1" />
                  </LinkTag>
                </li>
              )
            })}
          </ul>
        </div>

        <div className="mt-2 border-t border-ink-950/10 px-6 py-6">
          <p className="text-xs font-semibold tracking-widest text-ink-950/40 uppercase">What's included</p>
          <ul className="no-scrollbar mt-4 flex gap-3 overflow-x-auto pb-2">
            {topPrograms.map((item) => (
              <li key={item.label} className="w-28 shrink-0">
                <a
                  href={item.href}
                  onClick={onClose}
                  className="flex flex-col items-center gap-2 rounded-2xl bg-paper-100 px-3 py-4 text-center transition-transform duration-300 ease-out-smooth hover:-translate-y-1"
                >
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
