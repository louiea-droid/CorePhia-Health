import { useState } from "react"
import { Helmet } from "react-helmet-async"
import { Link } from "react-router-dom"
import { useReveal } from "../hooks/useReveal"
import { CheckCircleIcon, GlobeIcon, MapPinIcon, PhoneIcon } from "../components/icons"

const INTERESTS = [
  "Starting a weight loss program",
  "Dietitian / nutrition services",
  "Exercise programming",
  "Questions about medication",
  "Billing or membership question",
  "Something else",
]

const inputClass =
  "w-full rounded-2xl border border-ink-950/15 bg-paper-50 px-4 py-3.5 text-ink-950 placeholder-ink-950/40 outline-none transition-colors duration-200 ease-out-smooth focus:border-ink-950/40"

const labelClass = "mb-1.5 block text-sm font-medium text-ink-950/80"

// TODO: replace with real contact details before launch.
const contactDetails = [
  { icon: PhoneIcon, label: "Phone", value: "(000) 123-4567" },
  { icon: GlobeIcon, label: "Email", value: "hello@corephia.com" },
  { icon: MapPinIcon, label: "Location", value: "Tampa, Florida" },
]

export default function Contact() {
  const [submitted, setSubmitted] = useState(false)
  const [ref, visible] = useReveal()

  const handleSubmit = (event) => {
    event.preventDefault()
    // TODO: no destination yet — see submitIntakeRecord() in PatientIntakeForm.jsx.
    setSubmitted(true)
  }

  return (
    <>
      <Helmet>
        <title>Contact Corephia — Tampa Weight Loss Program</title>
        <meta
          name="description"
          content="Get in touch with Corephia's care team in Tampa, Florida. Ask a question or tell us what you're looking for and we'll reach out to get you started."
        />
        <link rel="canonical" href="https://www.corephia.com/contact" />
      </Helmet>

      <section aria-labelledby="contact-heading" className="mx-auto max-w-5xl px-4 pt-16 pb-12 sm:px-6">
        <p className="text-xs font-semibold tracking-widest text-accent-dark uppercase">Contact us</p>
        <h1 id="contact-heading" className="mt-3 font-serif text-4xl leading-tight text-ink-950 sm:text-5xl">
          Let's get you started.
        </h1>
        <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-950/70">
          Tell us a little about what you're looking for and a member of our care team will reach out. If you're
          ready to begin, you can go straight to the full intake form instead.
        </p>

        <div className="mt-12 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
          <div ref={ref} className={`transition-all duration-700 ease-out-smooth ${visible ? "opacity-100" : "opacity-0"}`}>
            {submitted ? (
              <div className="flex flex-col items-start rounded-3xl bg-paper-100 p-8">
                <CheckCircleIcon className="size-12 text-accent-dark" />
                <h2 className="mt-4 font-serif text-2xl text-ink-950">Thanks — we've got it.</h2>
                <p className="mt-2 max-w-md text-ink-950/70">
                  A member of our care team will reach out shortly. If you'd like to save time, you can complete
                  your full intake form now.
                </p>
                <Link
                  to="/intake"
                  className="mt-6 rounded-full bg-ink-950 px-6 py-3 text-sm font-semibold text-paper-50 transition-colors duration-200 ease-out-smooth hover:bg-ink-900"
                >
                  Start your intake
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="grid gap-5 rounded-3xl bg-paper-100/70 p-6 sm:grid-cols-2 sm:p-8">
                <label className="block">
                  <span className={labelClass}>
                    Full name <span className="text-brand-dark">*</span>
                  </span>
                  <input name="name" type="text" required autoComplete="name" className={inputClass} />
                </label>
                <label className="block">
                  <span className={labelClass}>
                    Phone number <span className="text-brand-dark">*</span>
                  </span>
                  <input name="phone" type="tel" required autoComplete="tel" className={inputClass} />
                </label>
                <label className="block sm:col-span-2">
                  <span className={labelClass}>
                    Email address <span className="text-brand-dark">*</span>
                  </span>
                  <input name="email" type="email" required autoComplete="email" className={inputClass} />
                </label>
                <label className="block sm:col-span-2">
                  <span className={labelClass}>
                    What can we help with? <span className="text-brand-dark">*</span>
                  </span>
                  <select name="interest" required defaultValue="" className={inputClass}>
                    <option value="" disabled>
                      Select an option
                    </option>
                    {INTERESTS.map((item) => (
                      <option key={item}>{item}</option>
                    ))}
                  </select>
                </label>
                <label className="block sm:col-span-2">
                  <span className={labelClass}>Anything else we should know?</span>
                  <textarea name="message" rows={4} className={inputClass} />
                </label>

                <div className="sm:col-span-2">
                  <button
                    type="submit"
                    className="w-full rounded-full bg-ink-950 py-4 text-sm font-semibold text-paper-50 transition-colors duration-200 ease-out-smooth hover:bg-ink-900 sm:w-auto sm:px-10"
                  >
                    Send message
                  </button>
                  <p className="mt-4 text-xs text-ink-950/50">
                    This form is not for medical emergencies. If you are experiencing a medical emergency, call
                    911 immediately. Please don't include sensitive medical details here — you'll share those
                    securely in your intake form.
                  </p>
                </div>
              </form>
            )}
          </div>

          <aside className="flex flex-col gap-8">
            <div>
              <h2 className="font-serif text-xl text-ink-950">Reach us directly</h2>
              <ul className="mt-4 space-y-4">
                {contactDetails.map(({ icon: Icon, label, value }) => (
                  <li key={label} className="flex items-start gap-3">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-paper-100 text-accent-dark">
                      <Icon className="size-5" />
                    </span>
                    <span>
                      <span className="block text-xs font-semibold tracking-wide text-ink-950/50 uppercase">
                        {label}
                      </span>
                      <span className="text-ink-950">{value}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-3xl bg-gradient-to-br from-ink-950 via-ink-900 to-accent-dark p-6">
              <h2 className="font-serif text-xl leading-snug text-paper-100">Already know you're ready?</h2>
              <p className="mt-2 text-sm text-paper-100/70">
                Complete the full intake form and your provider will have everything before your first visit.
              </p>
              <Link
                to="/intake"
                className="mt-5 inline-flex rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-ink-950 transition-[transform,background-color] duration-200 ease-out-smooth hover:scale-[1.02] hover:bg-accent-dark"
              >
                Start your intake
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </>
  )
}
