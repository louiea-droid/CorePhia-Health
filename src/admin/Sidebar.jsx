import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import ConfirmDialog from "./ConfirmDialog"
import {
  ActivityIcon,
  ChevronLeftIcon,
  CloseIcon,
  DashboardIcon,
  MailIcon,
  PatientsIcon,
  PersonIcon,
  SignOutIcon,
} from "./icons"
import { signOutAdmin } from "./firebase"

// `superAdminOnly` mirrors firestore.rules rather than adding a second source
// of truth: a plain admin following the URL directly still gets refused by
// Firestore, this just keeps a link they can't use out of their sidebar.
const NAV_ITEMS = [
  { label: "Dashboard", icon: DashboardIcon, to: "/admin" },
  { label: "Patients", icon: PatientsIcon, to: "/admin/patients" },
  { label: "Messages", icon: MailIcon, to: "/admin/messages" },
  { label: "Activity", icon: ActivityIcon, to: "/admin/activity", superAdminOnly: true },
]

const ROLE_LABELS = {
  superAdmin: "Super admin",
  admin: "Admin",
}

function roleLabel(role) {
  return ROLE_LABELS[role] ?? "No role assigned"
}

// Shared by every collapsible label (nav items, the brand wordmark, footer
// rows). display:none (what a plain `lg:hidden` toggle uses) can't be
// transitioned by CSS at all — it just pops — so this fades opacity and
// collapses max-width instead, both of which animate properly. Paired with
// a constant justify-content on the parent row (never swapped for
// justify-center) so icons don't jump sideways either — that property can't
// animate smoothly any more than display can.
function collapsibleLabelClass(collapsed, maxWidthClass = "lg:max-w-40") {
  return `overflow-hidden whitespace-nowrap transition-[max-width,opacity] duration-300 ease-out-smooth ${
    collapsed ? "lg:max-w-0 lg:opacity-0" : `${maxWidthClass} lg:opacity-100`
  }`
}

export default function Sidebar({
  user,
  role,
  collapsed,
  onToggleCollapsed,
  mobileOpen,
  onCloseMobile,
  onSignOut = signOutAdmin,
}) {
  const location = useLocation()
  const [confirmingSignOut, setConfirmingSignOut] = useState(false)

  return (
    <>
      <ConfirmDialog
        open={confirmingSignOut}
        title="Sign out of Corephia Admin?"
        description="You'll need to sign in again to view patient records."
        confirmLabel="Sign out"
        onConfirm={() => {
          setConfirmingSignOut(false)
          onSignOut()
        }}
        onCancel={() => setConfirmingSignOut(false)}
      />

      {/* Mobile scrim. Hidden from assistive tech; the panel below owns focus. */}
      <div
        aria-hidden="true"
        onClick={onCloseMobile}
        className={`fixed inset-0 z-30 bg-ink-950/50 transition-opacity duration-300 lg:hidden ${
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Collapsing is a desktop affordance, so every collapsed style is
          lg-scoped: the mobile drawer is always full width with full labels,
          whatever the saved desktop state is. */}
      <div
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-ink-950/10 bg-white transition-[width,transform] duration-300 ease-out-smooth ${
          collapsed ? "lg:w-18" : "lg:w-64"
        } ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        <div className="flex items-center justify-between gap-2 border-b border-ink-950/10 px-4 py-4">
          <div className="flex min-w-0 items-center gap-2">
            {/* The real Corephia infinity mark, in its original colours —
                cropped from cp-logo.webp. CLAUDE.md keeps this logo's orange
                off the public marketing site pending an orange-free asset
                from the client, but this admin is internal-only (noindex,
                nofollow, never linked from the public site), so it's shown
                as-is here rather than flattened to one colour. Always
                visible, and always at the same position — the row's
                justify-content never changes, so the icon doesn't shift
                sideways as the label beside it collapses away. */}
            <img src="/cp-mark.webp" alt="" className="size-7 shrink-0 object-contain" />

            <div className={`min-w-0 ${collapsibleLabelClass(collapsed)}`}>
              <p className="truncate font-serif text-base leading-none text-ink-950">Corephia Admin</p>
              
            </div>
          </div>

          <button
            type="button"
            onClick={onCloseMobile}
            aria-label="Close menu"
            className="shrink-0 rounded-lg p-1.5 text-ink-950/60 transition-colors duration-200 hover:bg-ink-950/5 hover:text-ink-950 lg:hidden"
          >
            <CloseIcon className="size-5" />
          </button>
        </div>

        <nav aria-label="Admin" className="flex-1 overflow-y-auto p-3">
          <ul className="space-y-1">
            {NAV_ITEMS.filter((item) => !item.superAdminOnly || role === "superAdmin").map((item) => {
              const current = location.pathname === item.to
              return (
                <li key={item.label}>
                  <Link
                    to={item.to}
                    aria-current={current ? "page" : undefined}
                    title={collapsed ? item.label : undefined}
                    onClick={onCloseMobile}
                    className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors duration-200 ${
                      current
                        ? "bg-accent-dark text-paper-50"
                        : "text-ink-950/70 hover:bg-ink-950/5 hover:text-ink-950"
                    }`}
                  >
                    <item.icon className="size-5 shrink-0" />
                    <span className={collapsibleLabelClass(collapsed, "lg:max-w-28")}>{item.label}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="border-t border-ink-950/10 p-3">
          {/* Collapsing is a desktop affordance (see the note above on the
              sidebar's own width classes), so this never renders on the
              mobile drawer. */}
          <button
            type="button"
            onClick={onToggleCollapsed}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-expanded={!collapsed}
            title={collapsed ? "Expand sidebar" : undefined}
            className="hidden w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-ink-950/70 transition-colors duration-200 hover:bg-ink-950/5 hover:text-ink-950 lg:flex"
          >
            <ChevronLeftIcon
              className={`size-5 shrink-0 transition-transform duration-300 ease-out-smooth ${
                collapsed ? "rotate-180" : ""
              }`}
            />
            <span className={collapsibleLabelClass(collapsed, "lg:max-w-28")}>Collapse</span>
          </button>

          {/* The account row doubles as the way into this account's own
              settings — the conventional place to look for them, and it keeps
              a per-account page out of the main nav, which lists data
              sections. */}
          <Link
            to="/admin/security"
            onClick={onCloseMobile}
            title={collapsed && user ? `${user.email} — ${roleLabel(role)}` : undefined}
            className="mt-1 flex items-center gap-3 rounded-xl px-2 py-2 transition-colors duration-200 hover:bg-ink-950/5"
          >
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-paper-100 text-ink-950/70">
              <PersonIcon className="size-4" />
            </span>
            <div className={`min-w-0 flex-1 ${collapsibleLabelClass(collapsed)}`}>
              <p className="truncate text-sm font-medium text-ink-950">{user?.email ?? "Demo admin (preview)"}</p>
              <p className={`truncate text-xs ${role ? "text-ink-950/50" : "text-brand-dark"}`}>
                {roleLabel(role)}
              </p>
            </div>
          </Link>

          <button
            type="button"
            onClick={() => setConfirmingSignOut(true)}
            title={collapsed ? "Sign out" : undefined}
            className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-ink-950/70 transition-colors duration-200 hover:bg-ink-950/5 hover:text-ink-950"
          >
            <SignOutIcon className="size-5 shrink-0" />
            <span className={collapsibleLabelClass(collapsed, "lg:max-w-28")}>Sign out</span>
          </button>
        </div>
      </div>
    </>
  )
}
