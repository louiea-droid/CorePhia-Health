import { useEffect, useState } from "react"

const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches

/** Becomes true `delay`ms after mount, for choreographing a one-time page-load intro sequence. */
export function useIntro(delay = 0) {
  const [visible, setVisible] = useState(prefersReducedMotion)

  useEffect(() => {
    if (visible) return
    const timer = setTimeout(() => setVisible(true), delay)
    return () => clearTimeout(timer)
  }, [delay, visible])

  return visible
}
