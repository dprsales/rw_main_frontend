import { useEffect, useId, useRef, useState } from 'react'
import { gsap } from 'gsap'
import goldLogo from '../assets/site/gold1.png'

const MIN_VISIBLE_MS = 1800
const EXIT_MS = 420

/** A brief branded cover for the initial document load. Route changes stay instant. */
export default function SiteLoader() {
  const outlineId = `rw-loader-outline-${useId().replace(/:/g, '')}`
  const glowRef = useRef(null)
  const [logoReady, setLogoReady] = useState(false)
  const [leaving, setLeaving] = useState(false)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    if (!visible || leaving) return
    const previousOverflow = document.documentElement.style.overflow
    document.documentElement.style.overflow = 'hidden'
    return () => { document.documentElement.style.overflow = previousOverflow }
  }, [visible, leaving])

  useEffect(() => {
    if (!logoReady) return
    const startedAt = performance.now()
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const minimumVisible = reducedMotion ? 0 : MIN_VISIBLE_MS
    let exitTimer
    let removeTimer
    let hasStartedExit = false

    const startExit = () => {
      if (hasStartedExit) return
      hasStartedExit = true

      const wait = Math.max(0, minimumVisible - (performance.now() - startedAt))
      exitTimer = window.setTimeout(() => {
        setLeaving(true)
        removeTimer = window.setTimeout(() => setVisible(false), reducedMotion ? 150 : EXIT_MS)
      }, wait)
    }

    if (document.readyState === 'complete') startExit()
    else window.addEventListener('load', startExit, { once: true })

    return () => {
      window.removeEventListener('load', startExit)
      window.clearTimeout(exitTimer)
      window.clearTimeout(removeTimer)
    }
  }, [logoReady])

  useEffect(() => {
    if (!logoReady || !visible || !glowRef.current) return
    const media = gsap.matchMedia()
    media.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.fromTo(glowRef.current,
        { '--rw-loader-glow-angle': '-90deg' },
        { '--rw-loader-glow-angle': '270deg', duration: 1.6, repeat: -1, ease: 'none' },
      )
      gsap.fromTo(glowRef.current,
        { opacity: 0 },
        { opacity: .9, duration: .3, ease: 'power1.out' },
      )
    })
    // Returning null doesn't unmount this component, so stop GSAP when it hides.
    return () => media.revert()
  }, [logoReady, visible])

  if (!visible) return null

  return (
    <div
      className={`rw-site-loader${leaving ? ' is-leaving' : ''}`}
      role="status"
      aria-label="Loading Rajiv Williams"
    >
      <div
        className={`rw-site-loader-logo${logoReady ? ' is-ready' : ''}`}
        style={{ '--rw-loader-logo': `url(${goldLogo})` }}
        aria-hidden="true"
      >
        <img
          className="rw-site-loader-logo-base"
          src={goldLogo}
          alt=""
          width={461}
          height={357}
          onLoad={() => setLogoReady(true)}
          onError={() => setLogoReady(true)}
        />
        <div className="rw-site-loader-fill">
          <div className="rw-site-loader-liquid">
            <svg className="rw-site-loader-wave" viewBox="0 0 200 20" preserveAspectRatio="none" focusable="false">
              <path d="M0 10 C25 0 25 0 50 10 S75 20 100 10 S125 0 150 10 S175 20 200 10 V20 H0 Z" />
            </svg>
          </div>
        </div>
        <svg className="rw-site-loader-outline" viewBox="0 0 461 357" focusable="false">
          <defs>
            {/* Extract the edge from the actual PNG, including the inner cutouts. */}
            <filter id={outlineId} x="-5%" y="-5%" width="110%" height="110%" colorInterpolationFilters="sRGB">
              <feMorphology in="SourceAlpha" operator="erode" radius="2" result="inner" />
              <feComposite in="SourceAlpha" in2="inner" operator="out" result="edge" />
              <feFlood floodColor="#E8C97A" />
              <feComposite in2="edge" operator="in" />
            </filter>
          </defs>
          <image href={goldLogo} width="461" height="357" filter={`url(#${outlineId})`} />
        </svg>
        <div ref={glowRef} className="rw-site-loader-glow">
          <svg className="rw-site-loader-glow-sweep" viewBox="0 0 461 357" focusable="false">
            <image href={goldLogo} width="461" height="357" filter={`url(#${outlineId})`} />
          </svg>
        </div>
      </div>
    </div>
  )
}
