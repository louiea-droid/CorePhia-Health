import { useEffect, useRef } from "react"
import { createPortal } from "react-dom"
import { AppleIcon, CheckCircleIcon, CloseIcon, GoogleIcon } from "./icons"

const perks = ["Manage your membership", "Track your progress", "Message your care team"]

export default function LoginPanel({ open, onClose }) {
  const closeButtonRef = useRef(null)

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
        role="dialog"
        aria-modal="true"
        aria-label="Log in"
        aria-hidden={!open}
        className={`absolute top-0 right-0 flex h-full w-full max-w-sm flex-col overflow-y-auto rounded-l-3xl bg-paper-50 shadow-2xl transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="relative flex shrink-0 items-center justify-center px-6 pt-6 pb-2">
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute left-6 flex size-9 items-center justify-center rounded-full bg-paper-50 text-ink-950 shadow-sm ring-1 ring-ink-950/10 transition-colors duration-200 ease-out-smooth hover:bg-paper-100"
          >
            <CloseIcon className="size-4" />
          </button>
          <h2 className="text-base font-semibold text-ink-950">Login</h2>
        </div>

        <div className="px-6 pt-8 pb-8">
          <h2 className="font-serif text-3xl text-ink-950">Welcome back</h2>

          <form className="mt-8 space-y-4" onSubmit={(event) => event.preventDefault()}>
            <input
              type="email"
              placeholder="Email"
              autoComplete="email"
              className="w-full rounded-2xl border border-ink-950/15 bg-paper-50 px-4 py-3.5 text-ink-950 placeholder-ink-950/40 outline-none transition-colors duration-200 ease-out-smooth focus:border-ink-950/40"
            />
            <input
              type="password"
              placeholder="Password"
              autoComplete="current-password"
              className="w-full rounded-2xl border border-ink-950/15 bg-paper-50 px-4 py-3.5 text-ink-950 placeholder-ink-950/40 outline-none transition-colors duration-200 ease-out-smooth focus:border-ink-950/40"
            />

            <div className="text-right">
              <a
                href="#forgot-password"
                className="text-sm font-medium text-ink-700 underline-offset-2 hover:underline"
              >
                Forgot your password?
              </a>
            </div>

            <button
              type="submit"
              className="w-full rounded-full bg-ink-950 py-3.5 text-sm font-semibold text-paper-50 transition-colors duration-200 ease-out-smooth hover:bg-ink-900"
            >
              Log in
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-ink-950/70">
            First time here?{" "}
            <a href="#create-account" className="font-semibold text-ink-950 underline underline-offset-2">
              Create an account
            </a>
          </p>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-ink-950/10" />
            <span className="text-sm text-ink-950/50">or</span>
            <div className="h-px flex-1 bg-ink-950/10" />
          </div>

          <div className="space-y-3">
            <button
              type="button"
              className="flex w-full items-center justify-center gap-2.5 rounded-full border border-ink-950/15 bg-paper-50 py-3 text-sm font-medium text-ink-950 transition-colors duration-200 ease-out-smooth hover:bg-paper-100"
            >
              <GoogleIcon className="size-5" />
              Continue with Google
            </button>
            <button
              type="button"
              className="flex w-full items-center justify-center gap-2.5 rounded-full border border-ink-950/15 bg-paper-50 py-3 text-sm font-medium text-ink-950 transition-colors duration-200 ease-out-smooth hover:bg-paper-100"
            >
              <AppleIcon className="size-5" />
              Continue with Apple
            </button>
          </div>

          <div className="mt-8 rounded-3xl bg-gradient-to-br from-accent/25 via-paper-100 to-brand/20 p-6">
            <h3 className="max-w-[70%] font-serif text-xl leading-snug text-ink-950">
              Get the most out of your care
            </h3>
            <ul className="mt-4 space-y-2.5">
              {perks.map((perk) => (
                <li key={perk} className="flex items-center gap-2 text-sm text-ink-950/80">
                  <CheckCircleIcon className="size-5 shrink-0 text-accent-dark" />
                  {perk}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}
