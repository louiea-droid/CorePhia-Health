import { useEffect, useRef, useState } from "react"
import { useIntro } from "../hooks/useIntro"
import { ArrowRightIcon, MenuIcon } from "./icons"
import LoginPanel from "./LoginPanel"
import MobileMenu from "./MobileMenu"

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [loginOpen, setLoginOpen] = useState(false)
  const [dark, setDark] = useState(false)
  const headerRef = useRef(null)
  const barIn = useIntro(0)
  const navIn = useIntro(150)

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
        className={`bg-accent text-sm text-ink-950 transition-all duration-1000 ease-out-smooth ${
          barIn ? "translate-y-0 opacity-100" : "-translate-y-3 opacity-0"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-4 py-4 text-center">
          <span>The GLP-1 pill is here.</span>
          <a
            href="#glp1-lineup"
            className="inline-flex items-center gap-1 rounded-full bg-ink-950/90 px-3 py-1 font-semibold text-paper-100 transition-colors duration-200 ease-out-smooth hover:bg-ink-950"
          >
            Check it out
            <ArrowRightIcon className="size-3.5" />
          </a>
        </div>
      </div>

      <header
        ref={headerRef}
        className={`sticky top-0 z-40 -mt-2 rounded-t-[2rem] shadow-[0_-1px_0_rgba(16,32,43,0.05)] backdrop-blur transition-[transform,opacity,background-color] duration-500 ease-out-smooth ${
          navIn ? "translate-y-0 opacity-100" : "-translate-y-3 opacity-0"
        } ${dark ? "bg-ink-950/90" : "bg-paper-50/95"}`}
      >
        <nav
          className="mx-auto flex max-w-7xl items-center justify-between py-4 pr-4 pl-6 sm:pr-6 sm:pl-8"
          aria-label="Primary"
        >
          <a
            href="#top"
            className="shrink-0"
            onClick={(event) => {
              event.preventDefault()
              window.scrollTo({ top: 0, behavior: "smooth" })
            }}
          >
            <img
              src="/cp-health.png"
              alt="CorePhia Health"
              className={`h-12 w-auto transition-[filter] duration-500 ease-out-smooth sm:h-14 ${
                dark ? "brightness-0 invert" : ""
              }`}
            />
          </a>

          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-haspopup="dialog"
              aria-expanded={loginOpen}
              onClick={() => setLoginOpen(true)}
              className={`rounded-full border px-5 py-2 text-sm font-medium transition-colors duration-200 ease-out-smooth ${
                dark
                  ? "border-paper-100/20 text-paper-100 hover:border-paper-100/40 hover:bg-paper-100/10"
                  : "border-ink-950/15 text-ink-950 hover:border-ink-950/40 hover:bg-ink-950/5"
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
