import { useEffect, useRef, useState } from "react"

const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches

/** Tracks whether an element has scrolled into view, for one-time scroll-reveal animations. */
export function useReveal(options) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(prefersReducedMotion)

  useEffect(() => {
    if (visible) return

    const node = ref.current
    if (!node) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.3, ...options },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [visible, options])

  return [ref, visible]
}
