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
            <div className="relative mx-auto flex max-w-7xl items-center justify-center gap-2 px-10 py-4 text-center sm:px-14">
              <span>Real weight loss programs, built around you.</span>
              <a
                href="/#programs"
                className="inline-flex shrink-0 items-center gap-1 font-semibold text-ink-950 underline underline-offset-4 transition-opacity duration-200 ease-out-smooth hover:opacity-70"
              >
                See how it works
                <ArrowRightIcon className="size-3.5" />
              </a>
              <button
                type="button"
                aria-label="Dismiss announcement"
                onClick={dismissPromo}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-ink-950/60 transition-colors duration-200 ease-out-smooth hover:bg-ink-950/10 hover:text-ink-950 sm:right-6"
              >
                <CloseIcon className="size-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <header
        ref={headerRef}
        className={`sticky top-0 z-40 rounded-t-[2rem] shadow-[0_-1px_0_rgba(16,32,43,0.05)] backdrop-blur transition-[transform,opacity,background-color,margin-top] duration-500 ease-out-smooth ${
          navIn ? "translate-y-0 opacity-100" : "-translate-y-3 opacity-0"
        } ${dark ? "bg-ink-950/90" : "bg-paper-50/95"} ${promoDismissed ? "-mt-6" : "-mt-2"}`}
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
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors duration-200 ease-out-smooth sm:px-5 ${
                dark
                  ? "bg-accent text-ink-950 hover:bg-accent-dark hover:text-paper-50"
                  : "bg-ink-950 text-paper-50 hover:bg-ink-900"
              }`}
            >
              Get started
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
