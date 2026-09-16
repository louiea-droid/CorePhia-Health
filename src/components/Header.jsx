import { Suspense, lazy, useEffect, useRef, useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useIntro } from "../hooks/useIntro"
import { hasPatientSessionHint, onPatientSessionHintChange } from "../lib/patientSessionHint"
import { ArrowRightIcon, CloseIcon, MenuIcon } from "./icons"
import MobileMenu from "./MobileMenu"

// Lazy, and only mounted once someone actually opens it (see loginTouched
// below) — otherwise every visitor to the public site would download the
// Firebase Auth SDK this pulls in, the same reason AdminApp is lazy.
const LoginPanel = lazy(() => import("./LoginPanel"))

const PROMO_DISMISSED_KEY = "corephia-promo-dismissed"

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [loginOpen, setLoginOpen] = useState(false)
  const [loginTouched, setLoginTouched] = useState(false)
  const [patientSignedIn, setPatientSignedIn] = useState(() => hasPatientSessionHint())
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
  const navigate = useNavigate()
  const barIn = useIntro(0)
  const navIn = useIntro(150)

  useEffect(() => onPatientSessionHintChange(setPatientSignedIn), [])

  const openLogin = () => {
    setLoginTouched(true)
    setLoginOpen(true)
  }

  // Shared by the header's account control and the mobile menu's account
  // icon: a signed-in patient goes straight to their account, everyone else
  // gets the login panel.
  const handleAccountClick = () => {
    if (patientSignedIn) navigate("/account")
    else openLogin()
  }

  const dismissPromo = () => {
    setPromoDismissed(true)
    try {
      localStorage.setItem(PROMO_DISMISSED_KEY, "1")
    } catch {
      /* private browsing / storage disabled */
    }
  }

  // Collapsing to grid-rows-[0fr] still leaves the outer bar's own pt-5
  // painted (padding, not height, so it doesn't collapse) as a thin blue
  // strip above the header. The header still overlaps it a little (-mt-2
  // below, vs. -mt-4 when shown) so its rounded corners keep tucking into
  // the strip the same way they do when the message is showing — but less
  // than before, so most of the strip's height stays clear of the header's
  // own hit-testing box and this stays reliably clickable. Rather than let
  // it sit as a dead sliver, it doubles as the way back: click it once
  // dismissed and the message returns.
  const restorePromo = () => {
    setPromoDismissed(false)
    try {
      localStorage.removeItem(PROMO_DISMISSED_KEY)
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
          {...(promoDismissed
            ? {
                onClick: restorePromo,
                onKeyDown: (event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault()
                    restorePromo()
                  }
                },
                role: "button",
                tabIndex: 0,
                "aria-label": "Show announcement",
              }
            : {})}
          className={`grid overflow-hidden bg-accent text-sm text-ink-950 transition-[grid-template-rows,padding-top] duration-500 ease-out-smooth ${
            promoDismissed ? "cursor-pointer grid-rows-[0fr] pt-5" : "grid-rows-[1fr] pt-0"
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
        } ${dark ? "bg-ink-950/90" : "bg-paper-50/95"} ${promoDismissed ? "-mt-2" : "-mt-4"} ${
          scrolled ? "rounded-t-none" : "rounded-t-2xl"
        }`}
      >
        <nav
          className="mx-auto flex max-w-7xl items-center justify-between py-4 pr-2 pl-2 sm:pr-4 sm:pl-4"
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
              src="/cp-health.webp"
              alt="CorePhia Health"
              className={`h-12 w-auto transition-[filter] duration-500 ease-out-smooth sm:h-14 ${
                dark ? "brightness-0 invert" : ""
              }`}
            />
          </Link>

          <div className="flex items-center gap-2 sm:gap-4">
            <Link
              to="/intake"
              className={`group relative isolate inline-flex items-center overflow-hidden rounded-full px-4 py-2 text-sm font-semibold outline-2 -outline-offset-1 transition-[transform,color,outline-color,box-shadow] duration-700 ease-out-smooth hover:scale-105 sm:px-5 ${
                dark
                  ? "text-paper-100 outline-paper-100/50 hover:text-ink-950 hover:outline-accent hover:shadow-xl hover:shadow-accent/30"
                  : "text-ink-950 outline-ink-950/70 hover:text-ink-950 hover:outline-accent hover:shadow-[0_0_32px_6px] hover:shadow-accent/50"
              }`}
            >
              {/* Outlined by default; a skewed panel wipes in from the left on
                  hover to fill it solid, rather than the shine-sweep this
                  replaced. Same mechanic as the reference snippet (an
                  absolutely-positioned ::before skewed and widened on hover),
                  reimplemented as a sibling span in the site's own tokens and
                  pill shape rather than the source's teal/5px-radius look,
                  which would have clashed with every other button on the site.
                  The text/outline/shadow transition above shares this same
                  700ms duration rather than Tailwind's shorter default — they
                  used to drift out of sync, so the text flipped white before
                  the fill caught up to it, showing pale text on a still-light
                  background for part of the hover. */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 left-[-10%] -z-10 w-0 -skew-x-12 bg-accent transition-[width] duration-700 ease-out-smooth group-hover:w-[220%]"
              />
              Get started
            </Link>
            {patientSignedIn ? (
              <Link
                to="/account"
                className={`hidden text-sm font-medium underline-offset-4 transition-colors duration-200 ease-out-smooth hover:underline sm:inline-block ${
                  dark ? "text-paper-100/80 hover:text-paper-100" : "text-ink-950/70 hover:text-ink-950"
                }`}
              >
                My account
              </Link>
            ) : (
              <button
                type="button"
                aria-haspopup="dialog"
                aria-expanded={loginOpen}
                onClick={openLogin}
                className={`hidden text-sm font-medium underline-offset-4 transition-colors duration-200 ease-out-smooth hover:underline sm:inline-block ${
                  dark ? "text-paper-100/80 hover:text-paper-100" : "text-ink-950/70 hover:text-ink-950"
                }`}
              >
                Log in
              </button>
            )}
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

        <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} onAccountClick={handleAccountClick} />
      </header>

      {loginTouched && (
        <Suspense fallback={null}>
          <LoginPanel open={loginOpen} onClose={() => setLoginOpen(false)} />
        </Suspense>
      )}
    </>
  )
}
