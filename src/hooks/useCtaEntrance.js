import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

/**
 * Entrance pop for a primary CTA on mount: a short back-out scale + rise.
 * Uses gsap.matchMedia so it is skipped under prefers-reduced-motion, and a
 * transform tween so it composes cleanly with a parent Reveal's fade.
 */
export default function useCtaEntrance({ delay = 0, y = 10 } = {}) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return undefined
    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.fromTo(
        el,
        { opacity: 0.001, scale: 0.94, y },
        { opacity: 1, scale: 1, y: 0, duration: 0.55, delay, ease: 'back.out(1.7)' },
      )
    })
    return () => mm.revert()
  }, [delay, y])
  return ref
}