import { useState } from "react"
import { useReveal } from "../hooks/useReveal"
import { PersonAvatar } from "./Artwork"

export default function CtaBanner() {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [ref, visible] = useReveal()

  const handleSubmit = (event) => {
    event.preventDefault()
    setSubmitted(true)
  }

  return (
    <section aria-labelledby="cta-heading" className="bg-paper-50 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div
          ref={ref}
          className={`relative isolate flex flex-col overflow-hidden rounded-3xl bg-gradient-to-br from-ink-950 via-ink-900 to-accent-dark shadow-xl transition-all duration-700 ease-out-smooth sm:min-h-[26rem] sm:flex-row ${
            visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          <div
            className="pointer-events-none absolute -top-24 -right-24 size-96 rounded-full bg-accent/25 blur-3xl"
            aria-hidden="true"
          />

          <div className="relative z-10 flex flex-1 flex-col justify-center gap-4 p-8 sm:p-12">
            <h2 id="cta-heading" className="font-serif text-3xl leading-tight text-paper-100 sm:text-4xl">
              You deserve to
              <br />
              feel your best.
            </h2>
            <p className="max-w-sm text-paper-100/70">
              Enter your email and a member of our care team will help you schedule your free consultation.
            </p>

            {submitted ? (
              <p className="mt-1 inline-block max-w-sm rounded-full bg-paper-50/10 px-5 py-3 text-sm font-medium text-accent">
                Thanks — we'll be in touch shortly.
              </p>
            ) : (
              <form onSubmit={handleSubmit} className="mt-1 flex max-w-sm flex-col gap-3">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Email"
                  aria-label="Email address"
                  className="w-full rounded-full border border-transparent bg-paper-50 px-5 py-3 text-ink-950 placeholder:text-ink-950/40 focus:border-accent focus:ring-2 focus:ring-accent focus:outline-none"
                />
                <button
                  type="submit"
                  className="w-full rounded-full bg-accent px-6 py-3 text-sm font-semibold text-ink-950 transition-[transform,background-color] duration-200 ease-out-smooth hover:scale-[1.02] hover:bg-accent-dark"
                >
                  Schedule my free consultation
                </button>
              </form>
            )}

            <p className="max-w-sm text-xs text-paper-100/40">
              By requesting a consultation, I agree to the{" "}
              <a href="#terms" className="underline underline-offset-2 hover:text-paper-100">
                Terms &amp; Conditions
              </a>
              , and acknowledge the{" "}
              <a href="#privacy" className="underline underline-offset-2 hover:text-paper-100">
                Privacy Policy
              </a>
              .
            </p>
          </div>

          <div className="relative hidden flex-1 sm:block" aria-hidden="true">
            <PersonAvatar className="absolute inset-0 h-full w-full" tone="#1789a3" />
          </div>
        </div>
      </div>
    </section>
  )
}
