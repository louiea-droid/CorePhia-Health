import { useState } from "react"
import { resetAdminPassword, signInAdmin } from "./firebase"
import { EyeIcon, EyeOffIcon } from "./icons"

const fieldClass =
  "w-full rounded-2xl border border-ink-950/15 bg-paper-50 px-4 py-3 text-ink-950 outline-none transition-colors duration-200 ease-out-smooth focus:border-ink-950/40"

function ResetPasswordForm({ initialEmail, onBack }) {
  const [email, setEmail] = useState(initialEmail)
  const [busy, setBusy] = useState(false)
  const [sent, setSent] = useState(false)
  // Firebase returns "user not found" for an unregistered email — surfacing
  // that lets anyone probe which addresses have an admin account, so it's
  // folded into the same success state instead of being shown as an error.
  const [error, setError] = useState(null)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setBusy(true)
    setError(null)
    try {
      await resetAdminPassword(email)
      setSent(true)
    } catch (cause) {
      if (cause.code === "auth/user-not-found" || cause.code === "auth/invalid-email") {
        setSent(true)
      } else {
        setError("Something went wrong sending that email. Try again.")
      }
    } finally {
      setBusy(false)
    }
  }

  if (sent) {
    return (
      <div>
        <p className="font-serif text-2xl text-ink-950">Check your inbox</p>
        <p className="mt-3 text-sm leading-relaxed text-ink-950/60">
          If <span className="font-medium text-ink-950">{email}</span> has an admin account, a reset link is
          on its way. It can take a few minutes to arrive.
        </p>
        <button
          type="button"
          onClick={onBack}
          className="mt-6 text-sm font-semibold text-accent-dark transition-opacity duration-200 hover:opacity-70"
        >
          ← Back to sign in
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit}>
      <p className="font-serif text-2xl text-ink-950">Reset your password</p>
      <p className="mt-2 text-sm text-ink-950/55">We'll email you a link to choose a new one.</p>

      <label className="mt-6 block">
        <span className="mb-1.5 block text-sm font-medium text-ink-950/80">Email</span>
        <input
          type="email"
          required
          autoFocus
          autoComplete="username"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className={fieldClass}
        />
      </label>

      {error && (
        <p role="alert" className="mt-4 text-sm text-brand-dark">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={busy}
        className="mt-6 w-full rounded-full bg-ink-950 py-3.5 text-sm font-semibold text-paper-50 transition-colors duration-200 ease-out-smooth hover:bg-ink-900 disabled:opacity-60"
      >
        {busy ? "Sending…" : "Send reset link"}
      </button>

      <button
        type="button"
        onClick={onBack}
        className="mt-4 block w-full text-center text-sm font-medium text-ink-950/60 transition-colors duration-200 hover:text-ink-950"
      >
        ← Back to sign in
      </button>
    </form>
  )
}

function SignInForm({ onForgotPassword }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(null)
  const [busy, setBusy] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setBusy(true)
    setError(null)
    try {
      await signInAdmin(email, password)
    } catch (cause) {
      // The UI message stays deliberately vague — telling an attacker which
      // half was wrong helps them enumerate valid accounts — but the real
      // Firebase error code is still worth having in the console for
      // debugging from the browser that hit it.
      console.error("Admin sign-in failed:", cause.code ?? cause.message)
      setError("Those sign-in details were not accepted.")
    } finally {
      setBusy(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <p className="font-serif text-2xl text-ink-950">Corephia Admin</p>
      <p className="mt-2 text-sm text-ink-950/55">Authorized person only</p>

      <label className="mt-6 block">
        <span className="mb-1.5 block text-sm font-medium text-ink-950/80">Email</span>
        <input
          type="email"
          required
          autoComplete="username"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className={fieldClass}
        />
      </label>

      <label className="mt-4 block">
        <div className="mb-1.5 flex items-baseline justify-between">
          <span className="text-sm font-medium text-ink-950/80">Password</span>
          <button
            type="button"
            onClick={() => onForgotPassword(email)}
            className="text-xs font-medium text-accent-dark transition-opacity duration-200 hover:opacity-70"
          >
            Forgot password?
          </button>
        </div>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            required
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className={`${fieldClass} pr-11`}
          />
          <button
            type="button"
            onClick={() => setShowPassword((previous) => !previous)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            aria-pressed={showPassword}
            className="absolute top-1/2 right-3 -translate-y-1/2 rounded-lg p-1 text-ink-950/45 transition-colors duration-200 ease-out-smooth hover:text-ink-950"
          >
            {showPassword ? <EyeOffIcon className="size-5" /> : <EyeIcon className="size-5" />}
          </button>
        </div>
      </label>

      {error && (
        <p role="alert" className="mt-4 text-sm text-brand-dark">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={busy}
        className="mt-6 w-full rounded-full bg-ink-950 py-3.5 text-sm font-semibold text-paper-50 transition-colors duration-200 ease-out-smooth hover:bg-ink-900 disabled:opacity-60"
      >
        {busy ? "Signing in…" : "Sign in"}
      </button>
    </form>
  )
}

export default function Login({ notice }) {
  // Lifted above both forms so the email a person typed while signing in
  // carries over if they tap "Forgot password?" instead of retyping it.
  const [mode, setMode] = useState("sign-in")
  const [resetEmail, setResetEmail] = useState("")

  return (
    <div className="flex min-h-screen items-center justify-center bg-paper-50 px-4">
      <div className="w-full max-w-sm">
        {notice}
        <div className="rounded-3xl border border-ink-950/10 bg-white p-8">
          {mode === "sign-in" ? (
            <SignInForm
              onForgotPassword={(email) => {
                setResetEmail(email)
                setMode("reset")
              }}
            />
          ) : (
            <ResetPasswordForm initialEmail={resetEmail} onBack={() => setMode("sign-in")} />
          )}
        </div>
      </div>
    </div>
  )
}
