import { useEffect, useRef, useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { useIntro } from "../hooks/useIntro"
import { ArrowRightIcon, CloseIcon, MenuIcon } from "./icons"
import LoginPanel from "./LoginPanel"
import MobileMenu from "./MobileMenu"

const PROMO_DISMISSED_KEY = "corephia-promo-dismissed"

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [loginOpen, setLoginOpen] = useState(false)
  const [dark, setDark] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [promoDismissed, setPromoDismissed] = useState(() => {
    try {
      return localStorage.getItem(PROMO_DISMISSED_KEY) === "1"
    } catch {
      return false
    }
  })
  const headerRef = useRef(null)
  const location = useLocation()
  const barIn = useIntro(0)
  const navIn = useIntro(150)

  const dismissPromo = () => {
    setPromoDismissed(true)
    try {
      localStorage.setItem(PROMO_DISMISSED_KEY, "1")
    } catch {
      /* private browsing / storage disabled */
    }
  }

  useEffect(() => {
    let frame = null

    const updateTheme = () => {
      frame = null
      const header = headerRef.current
      if (!header) return
      const y = header.getBoundingClientRect().bottom + 1
      const el = document.elementFromPoint(window.innerWidth / 2, y)
      const themed = el?.closest("[data-header-theme]")
      setDark(themed?.getAttribute("data-header-theme") === "dark")
      setScrolled(window.scrollY > 4)
    }

    const onScroll = () => {
      if (frame == null) frame = requestAnimationFrame(updateTheme)
    }

    updateTheme()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
      if (frame != null) cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <>
      <div
        className={`transition-[transform,opacity] duration-1000 ease-out-smooth ${
          barIn ? "translate-y-0 opacity-100" : "-translate-y-3 opacity-0"
        }`}
      >
        <div
          className={`grid overflow-hidden bg-accent text-sm text-ink-950 transition-[grid-template-rows,padding-top] duration-500 ease-out-smooth ${
            promoDismissed ? "grid-rows-[0fr] pt-8" : "grid-rows-[1fr] pt-0"
          }`}
        >
          <div
            inert={promoDismissed || undefined}
            className={`min-h-0 transition-opacity duration-300 ease-out-smooth ${
              promoDismissed ? "opacity-0" : "opacity-100"
            }`}
          >
            {/* pb exceeds pt by exactly the header's -mt-4 (16px) overlap.
                The header slides up over this bar's bottom edge, so padding
                that's symmetric in the DOM leaves the text looking high in
                the strip that's actually visible — the extra bottom padding
                is what the header then covers.

                Three columns rather than one centered row so the close
                button can sit in the corner without dragging the message
                off-centre; `content-center` on the message keeps its lines
                centred as a group once they wrap at narrow widths, which
                plain `items-center` does not do. */}
            <div className="mx-auto grid max-w-7xl grid-cols-[1fr_auto_1fr] items-center gap-2 px-4 pt-2 pb-6 text-center sm:px-6">
              <span aria-hidden="true" />

              <p className="flex flex-wrap content-center items-center justify-center gap-x-2.5 gap-y-1 font-medium tracking-[0.01em] text-ink-950/90">
                Real weight loss programs, built around you.
                <a
                  href="/#programs"
                  className="group inline-flex shrink-0 items-center gap-1.5 font-semibold text-ink-950 underline decoration-ink-950/35 decoration-1 underline-offset-4 transition-colors duration-200 ease-out-smooth hover:decoration-ink-950"
                >
                  See how it works
                  <ArrowRightIcon className="size-3.5 transition-transform duration-200 ease-out-smooth group-hover:translate-x-0.5" />
                </a>
              </p>

              <button
                type="button"
                aria-label="Dismiss announcement"
                onClick={dismissPromo}
                className="justify-self-end rounded-full p-1.5 text-ink-950/55 transition-colors duration-200 ease-out-smooth hover:bg-ink-950/10 hover:text-ink-950"
              >
                <CloseIcon className="size-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <header
        ref={headerRef}
        className={`sticky top-0 z-40 shadow-[0_-1px_0_rgba(16,32,43,0.05)] backdrop-blur transition-[transform,opacity,background-color,margin-top,border-radius] duration-500 ease-out-smooth ${
          navIn ? "translate-y-0 opacity-100" : "-translate-y-3 opacity-0"
        } ${dark ? "bg-ink-950/90" : "bg-paper-50/95"} ${promoDismissed ? "-mt-6" : "-mt-4"} ${
          scrolled ? "rounded-t-none" : "rounded-t-2xl"
        }`}
      >
        <nav
          className="mx-auto flex max-w-7xl items-center justify-between py-4 pr-4 pl-6 sm:pr-6 sm:pl-8"
          aria-label="Primary"
        >
          <Link
            to="/"
            className="shrink-0"
            onClick={(event) => {
              if (location.pathname === "/") {
                event.preventDefault()
                window.scrollTo({ top: 0, behavior: "smooth" })
              }
            }}
          >
            <img
              src="/cp-health.png"
              alt="CorePhia Health"
              className={`h-12 w-auto transition-[filter] duration-500 ease-out-smooth sm:h-14 ${
                dark ? "brightness-0 invert" : ""
              }`}
            />
          </Link>

          <div className="flex items-center gap-2 sm:gap-4">
            <Link
              to="/intake"
              className={`group relative isolate overflow-hidden rounded-full px-4 py-2 text-sm font-semibold transition-[transform,background-color,color,box-shadow] duration-300 ease-out-smooth hover:scale-105 hover:shadow-xl hover:shadow-accent-dark/25 sm:px-5 ${
                dark
                  ? "bg-accent text-ink-950 hover:bg-accent-dark hover:text-paper-50"
                  : "bg-ink-950 text-paper-50 hover:bg-ink-900"
              }`}
            >
              {/* Diagonal shine sweeping across on hover — a subtle "premium
                  button" highlight layered on top of the existing solid-fill
                  look, rather than replacing it with the reference snippet's
                  outline style, which would look inconsistent with every
                  other button on the site. Tinted with the site's own accent
                  blue against the navy button, and a soft paper highlight
                  against the light-blue button, rather than a generic white
                  sweep — so it reads as on-brand, not off-the-shelf. */}
              <span
                aria-hidden="true"
                className={`pointer-events-none absolute inset-0 -translate-x-full skew-x-12 bg-gradient-to-r from-transparent to-transparent transition-transform duration-700 ease-out-smooth group-hover:translate-x-full ${
                  dark ? "via-paper-50/50" : "via-accent/60"
                }`}
              />
              <span className="relative z-10">Get started</span>
            </Link>
            <button
              type="button"
              aria-haspopup="dialog"
              aria-expanded={loginOpen}
              onClick={() => setLoginOpen(true)}
              className={`hidden text-sm font-medium underline-offset-4 transition-colors duration-200 ease-out-smooth hover:underline sm:inline-block ${
                dark ? "text-paper-100/80 hover:text-paper-100" : "text-ink-950/70 hover:text-ink-950"
              }`}
            >
              Log in
            </button>
            <button
              type="button"
              aria-label="Open menu"
              aria-haspopup="dialog"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen(true)}
              className={`rounded-full border p-2 transition-colors duration-200 ease-out-smooth ${
                dark
                  ? "border-paper-100/20 text-paper-100 hover:border-paper-100/40 hover:bg-paper-100/10"
                  : "border-ink-950/15 text-ink-950 hover:border-ink-950/40 hover:bg-ink-950/5"
              }`}
            >
              <MenuIcon className="size-5" />
            </button>
          </div>
        </nav>

        <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} onLoginClick={() => setLoginOpen(true)} />
      </header>

      <LoginPanel open={loginOpen} onClose={() => setLoginOpen(false)} />
    </>
  )
}
