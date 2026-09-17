import { useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"
import { ChevronLeftIcon, MailIcon } from "./icons"
import { formatRelativeTime, useRelativeTimeClock } from "./relativeTime"
import { useContactMessages } from "./useContactMessages"

const RECENT_WINDOW_MS = 24 * 60 * 60 * 1000
const PREVIEW_COUNT = 4

// A persistent corner affordance across every admin page (mounted once in
// AdminChrome, not per-page), so a message can be noticed without first
// navigating to Messages. useContactMessages fetches once on mount rather
// than subscribing — same one-shot pattern every other list in this admin
// uses, no onSnapshot listeners anywhere — so the badge reflects messages as
// of whenever this admin session started or the panel was last reopened,
// not truly live. A real live badge would need a Firestore listener, which is
// a bigger architectural change than this widget is asking for.
export default function MessagesNotification() {
  const { messages } = useContactMessages()
  const [open, setOpen] = useState(false)
  const rootRef = useRef(null)
  // Only ticks while the panel is actually open — the relative times aren't
  // visible otherwise, so there is nothing to keep current.
  const now = useRelativeTimeClock(open)
  // A separate, non-ticking timestamp for the badge count: a 24-hour window
  // doesn't need per-second accuracy, and computing it from Date.now() directly
  // in the render body (rather than a value fixed at mount) is an impure call
  // during render — same value every time in practice, but the wrong way to get it.
  const [badgeNow] = useState(() => Date.now())

  useEffect(() => {
    if (!open) return
    const onPointerDown = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpen(false)
    }
    const onKeyDown = (event) => {
      if (event.key === "Escape") setOpen(false)
    }
    document.addEventListener("mousedown", onPointerDown)
    document.addEventListener("keydown", onKeyDown)
    return () => {
      document.removeEventListener("mousedown", onPointerDown)
      document.removeEventListener("keydown", onKeyDown)
    }
  }, [open])

  // Still loading, or Firebase isn't configured (loadContactMessages already
  // resolves to [] for the demo/seed path) — nothing useful to show yet.
  if (!messages) return null

  const recentCount = messages.filter(
    (message) => badgeNow - new Date(message.submittedAt).getTime() < RECENT_WINDOW_MS,
  ).length
  const preview = messages.slice(0, PREVIEW_COUNT)

  return (
    <div ref={rootRef} className="fixed top-4 right-4 z-20">
      <button
        type="button"
        onClick={() => setOpen((previous) => !previous)}
        aria-label={recentCount > 0 ? `${recentCount} new messages in the last day` : "Recent messages"}
        aria-expanded={open}
        className="relative flex size-11 items-center justify-center rounded-full bg-white text-ink-950/70 shadow-lg ring-1 ring-ink-950/10 transition-colors duration-200 hover:bg-paper-100"
      >
        <MailIcon className="size-5" />
        {recentCount > 0 && (
          <span className="absolute -top-1 -right-1 flex size-5 items-center justify-center rounded-full bg-accent-dark text-[11px] font-semibold text-paper-50">
            {recentCount > 9 ? "9+" : recentCount}
          </span>
        )}
      </button>

      <div
        role="dialog"
        aria-label="Recent messages"
        className={`absolute top-full right-0 mt-2 w-80 origin-top-right rounded-2xl bg-white p-3 shadow-xl ring-1 ring-ink-950/10 transition-[opacity,transform] duration-150 ease-out-smooth ${
          open ? "scale-100 opacity-100" : "pointer-events-none scale-95 opacity-0"
        }`}
      >
        <p className="px-1 pb-2 text-sm font-semibold text-ink-950">Recent messages</p>

        {preview.length === 0 ? (
          <p className="px-1 py-3 text-sm text-ink-950/50">No messages yet.</p>
        ) : (
          <ul className="space-y-0.5">
            {preview.map((message) => (
              <li key={message.id}>
                <Link
                  to="/admin/messages"
                  onClick={() => setOpen(false)}
                  className="block rounded-xl px-2 py-2 transition-colors duration-150 hover:bg-paper-100"
                >
                  <p className="truncate text-sm font-medium text-ink-950">{message.name || "Visitor"}</p>
                  <p className="truncate text-xs text-ink-950/50">
                    {formatRelativeTime(message.submittedAt, now)} ({message.interest || "General inquiry"})
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}

        <Link
          to="/admin/messages"
          onClick={() => setOpen(false)}
          className="mt-2 flex items-center justify-center gap-1 rounded-xl px-2 py-2 text-sm font-medium text-accent-dark transition-colors duration-150 hover:bg-paper-100"
        >
          View all messages
          <ChevronLeftIcon className="size-3.5 rotate-180" />
        </Link>
      </div>
    </div>
  )
}
