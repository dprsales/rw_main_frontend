import { useEffect, useRef, useState } from 'react'

/** Fires once when the element enters view. Local copy of `useInView` so `src/form/` has no outside imports. */
export function useReveal() {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    /* No IntersectionObserver support: show content instead of leaving it blank. */
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        setInView(true)
        observer.disconnect()
      },
      { threshold: 0.15, rootMargin: '0px 0px -12% 0px' },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return [ref, inView]
}
