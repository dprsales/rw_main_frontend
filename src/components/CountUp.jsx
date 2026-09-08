import { useEffect, useState } from 'react'
import { useInView } from '../hooks/useInView'

/** Counts from 0 to `to` on first scroll into view, with an ease-out cubic curve. */
export default function CountUp({ to, prefix = '', suffix = '', duration = 1600 }) {
  const [ref, inView] = useInView()
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!inView) return
    let raf
    const start = performance.now()

    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - t, 3)
      setValue(to * eased)
      if (t < 1) raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, to, duration])

  return <span ref={ref}>{prefix}{Math.round(value).toLocaleString('en-IN')}{suffix}</span>
}
