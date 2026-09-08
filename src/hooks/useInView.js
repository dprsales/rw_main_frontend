import { useEffect, useRef, useState } from 'react'

/** Fires once when the element crosses into the lower 94% of the viewport. */
export function useInView({ rootMargin = '0px 0px -6% 0px' } = {}) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (typeof IntersectionObserver === 'undefined') { setInView(true); return }

    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true)
        io.disconnect()
      }
    }, { rootMargin })

    io.observe(el)
    return () => io.disconnect()
  }, [rootMargin])

  return [ref, inView]
}
