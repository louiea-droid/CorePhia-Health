import { useEffect, useState } from "react"
import { Helmet } from "react-helmet-async"
import { Route, Routes } from "react-router-dom"
import Dashboard from "./Dashboard"
import { getAdminRole, isConfigured, usingSeedData, watchAdminUser } from "./firebase"
import { MenuIcon } from "./icons"
import Login from "./Login"
import Patients from "./Patients"
import Sidebar from "./Sidebar"

function AdminRoutes() {
  return (
    <Routes>
      <Route path="/admin" element={<Dashboard />} />
      <Route path="/admin/patients" element={<Patients />} />
    </Routes>
  )
}

const COLLAPSED_KEY = "corephia-admin-sidebar-collapsed"

function AdminChrome({ user, role, onSignOut, children }) {
  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem(COLLAPSED_KEY) === "1"
    } catch {
      return false
    }
  })
  const [mobileOpen, setMobileOpen] = useState(false)

  const toggleCollapsed = () => {
    setCollapsed((previous) => {
      const next = !previous
      try {
        localStorage.setItem(COLLAPSED_KEY, next ? "1" : "0")
      } catch {
        /* private browsing / storage disabled */
      }
      return next
    })
  }

  return (
    // h-screen + overflow-hidden at the root, rather than min-h-screen, so
    // the document itself never grows taller than the viewport and shows
    // its own native scrollbar — all scrolling happens inside <main> below
    // instead, which individual pages (like Patients) can further subdivide
    // so only part of their own content scrolls.
    <div className="h-screen overflow-hidden bg-paper-50">
      <Sidebar
        user={user}
        role={role}
        collapsed={collapsed}
        onToggleCollapsed={toggleCollapsed}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
        onSignOut={onSignOut}
      />

      <div
        className={`flex h-full flex-col transition-[padding] duration-300 ease-out-smooth ${
          collapsed ? "lg:pl-18" : "lg:pl-64"
        }`}
      >
        <div className="flex shrink-0 items-center gap-3 border-b border-ink-950/10 bg-white px-4 py-3 lg:hidden">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            aria-expanded={mobileOpen}
            className="rounded-lg p-1.5 text-ink-950/70 transition-colors duration-200 hover:bg-ink-950/5"
          >
            <MenuIcon className="size-5" />
          </button>
          <p className="font-serif text-base leading-none text-ink-950">Corephia Admin</p>
        </div>

        {/* No top padding: PageHeader owns its own top spacing directly
            (plain padding, not a negative margin trying to cancel this
            element's), so there's exactly one place that math lives. */}
        <main className="flex-1 overflow-y-auto px-4 pb-6 sm:px-6 sm:pb-8">{children}</main>
      </div>
    </div>
  )
}

function NoAccessScreen({ email }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-paper-50 px-4">
      <div className="w-full max-w-md rounded-3xl border border-ink-950/10 bg-white p-8">
        <p className="font-serif text-2xl text-ink-950">No access assigned</p>
        <p className="mt-3 text-sm leading-relaxed text-ink-950/60">
          You are signed in as <span className="font-medium text-ink-950">{email}</span>, but this account has
          no admin role yet, so it cannot read patient records. A super admin needs to assign one.
        </p>
      </div>
    </div>
  )
}

function NotConfiguredScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-paper-50 px-4">
      <div className="w-full max-w-md rounded-3xl border border-ink-950/10 bg-white p-8">
        <p className="font-serif text-2xl text-ink-950">Admin is not configured</p>
        <p className="mt-3 text-sm leading-relaxed text-ink-950/60">
          This build has no Firebase credentials, so there is nothing to sign in to and no records to read.
          Set the <code className="text-ink-950">VITE_FIREBASE_*</code> variables listed in{" "}
          <code className="text-ink-950">.env.example</code> and rebuild.
        </p>
      </div>
    </div>
  )
}

export default function AdminApp() {
  const [user, setUser] = useState(null)
  const [role, setRole] = useState(null)
  const [checkingAuth, setCheckingAuth] = useState(isConfigured)
  const [demoSignedOut, setDemoSignedOut] = useState(false)

  useEffect(() => {
    if (!isConfigured) return
    return watchAdminUser(async (nextUser) => {
      setUser(nextUser)
      setRole(nextUser ? await getAdminRole(nextUser) : null)
      setCheckingAuth(false)
    })
  }, [])

  // The admin must never be indexed or followed, wherever it is hosted.
  const head = (
    <Helmet>
      <title>Corephia Admin</title>
      <meta name="robots" content="noindex, nofollow" />
    </Helmet>
  )

  if (usingSeedData) {
    // Demo mode has no real session to end, but "Sign out" should still show
    // what a signed-out admin sees rather than doing nothing when clicked.
    if (demoSignedOut) {
      return (
        <>
          {head}
          <Login
            notice={
              <div className="mb-4 flex items-center justify-between gap-3 rounded-2xl border border-ink-950/10 bg-paper-100 px-4 py-3 text-sm text-ink-950/70">
                <span>
                  <strong className="font-semibold text-ink-950">Demo preview.</strong> Firebase isn't
                  configured, so this just previews the signed-out screen.
                </span>
                <button
                  type="button"
                  onClick={() => setDemoSignedOut(false)}
                  className="shrink-0 font-semibold text-accent-dark transition-opacity duration-200 hover:opacity-70"
                >
                  Back
                </button>
              </div>
            }
          />
        </>
      )
    }

    return (
      <>
        {head}
        <AdminChrome user={null} role="superAdmin" onSignOut={() => setDemoSignedOut(true)}>
          <AdminRoutes />
        </AdminChrome>
      </>
    )
  }

  if (!isConfigured) {
    return (
      <>
        {head}
        <NotConfiguredScreen />
      </>
    )
  }

  if (checkingAuth) {
    return (
      <>
        {head}
        <div className="flex min-h-screen items-center justify-center bg-paper-50">
          <p className="text-sm text-ink-950/50">Checking your session…</p>
        </div>
      </>
    )
  }

  if (!user) {
    return (
      <>
        {head}
        <Login />
      </>
    )
  }

  if (!role) {
    return (
      <>
        {head}
        <NoAccessScreen email={user.email} />
      </>
    )
  }

  return (
    <>
      {head}
      <AdminChrome user={user} role={role}>
        <AdminRoutes />
      </AdminChrome>
    </>
  )
}
