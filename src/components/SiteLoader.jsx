import { Fragment, useEffect, useId, useRef, useState } from 'react'
import { gsap } from 'gsap'
// Vector mark (from the brand guidelines' colour-variation artwork) so it stays crisp at any size.
import goldMark from '../assets/site/rw-mark-gold.svg'
import { mono } from '../theme'

// Entrance only: Home, first arrival in this tab. Inner pages and later visits skip it.
const SEEN_KEY = 'rw-loader-seen'
const MIN_VISIBLE_MS = 3200
const EXIT_MS = 1100
const FONT_WAIT_MS = 700
const SERVICES = ['Coaching', 'Consulting', 'Realty']

// Timeline beats (seconds at full speed, from the moment the logo and font are ready).
const FILL_TIME = 1.1
const IGNITE = .15 + FILL_TIME
// The progress line creeps to 92% by the minimum time and only completes when the cover lifts.
const PROGRESS_START = IGNITE + .5
const PROGRESS_END = MIN_VISIBLE_MS / 1000 - .2

// Every logo filter state keeps the same function list so GSAP can interpolate between them.
const LOGO_FILTER_HIDDEN = 'blur(10px) brightness(1) drop-shadow(0px 20px 48px rgba(195,155,83,0.22))'
const LOGO_FILTER_REST = 'blur(0px) brightness(1) drop-shadow(0px 20px 48px rgba(195,155,83,0.22))'
const LOGO_FILTER_IGNITE = 'blur(0px) brightness(1.35) drop-shadow(0px 0px 42px rgba(232,201,122,0.7))'

// Fixed positions so the rising embers look the same on every load.
const EMBERS = [
  [9, 0, 2, 8.4], [21, 1.4, 2, 7.2], [33, .6, 3, 9.2], [45, 2.1, 2, 7.8], [57, .3, 2, 8.8],
  [68, 1.7, 3, 7.4], [79, .9, 2, 9], [90, 2.4, 2, 8.1],
]

function readSeen() {
  try { return window.sessionStorage.getItem(SEEN_KEY) === '1' } catch { return false }
}

function markSeen() {
  try { window.sessionStorage.setItem(SEEN_KEY, '1') } catch { /* storage blocked: Home still plays once per mount */ }
}

function shouldPlay() {
  if (typeof window === 'undefined') return false
  if (window.location.pathname !== '/') return false
  return !readSeen()
}

/** Letters are split so each one can rise on its own; the shine copy reuses the same markup to match kerning. */
function ServiceRow({ className, rowRef }) {
  return (
    <span ref={rowRef} className={className}>
      {SERVICES.map((word, i) => (
        <Fragment key={word}>
          {i > 0 && <span className="rw-site-loader-divider" />}
          <span className="rw-site-loader-word">
            {[...word].map((ch, j) => <span key={j} className="rw-site-loader-letter">{ch}</span>)}
          </span>
        </Fragment>
      ))}
    </span>
  )
}

/** Branded cover for the first Home arrival. Route changes and inner-page landings stay instant. */
export default function SiteLoader() {
  const outlineId = `rw-loader-outline-${useId().replace(/:/g, '')}`
  const rootRef = useRef(null)
  const glowRef = useRef(null)
  const rowRef = useRef(null)
  const shineRef = useRef(null)
  const progressRef = useRef(null)
  const [logoReady, setLogoReady] = useState(false)
  const [fontReady, setFontReady] = useState(false)
  const [leaving, setLeaving] = useState(false)
  const [visible, setVisible] = useState(shouldPlay)
  const ready = logoReady && fontReady

  useEffect(() => { markSeen() }, [])

  useEffect(() => {
    if (!visible || leaving) return
    const previousOverflow = document.documentElement.style.overflow
    document.documentElement.style.overflow = 'hidden'
    return () => { document.documentElement.style.overflow = previousOverflow }
  }, [visible, leaving])

  // Don't animate the words in a fallback face and then swap; wait briefly for Poppins.
  useEffect(() => {
    if (!visible) return
    let cancelled = false
    const fontLoad = document.fonts?.load ? document.fonts.load('400 16px Poppins') : Promise.resolve()
    const timeout = new Promise(resolve => window.setTimeout(resolve, FONT_WAIT_MS))
    Promise.race([fontLoad, timeout]).catch(() => {}).then(() => { if (!cancelled) setFontReady(true) })
    return () => { cancelled = true }
  }, [visible])

  useEffect(() => {
    if (!visible || !ready) return
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
  }, [visible, ready])

  // The page is ready: snap the progress line to 100% just before everything lifts away.
  useEffect(() => {
    if (!leaving || !progressRef.current) return
    const tween = gsap.to(progressRef.current, { scaleX: 1, duration: .3, ease: 'power2.out', overwrite: true })
    return () => tween.kill()
  }, [leaving])

  useEffect(() => {
    if (!ready || !visible || !rootRef.current) return
    const media = gsap.matchMedia()
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const q = gsap.utils.selector(rootRef.current)
      const logo = q('.rw-site-loader-logo')
      const halo = q('.rw-site-loader-halo')
      const glint = q('.rw-site-loader-glint-band')
      const liquid = q('.rw-site-loader-liquid')
      const words = q('.rw-site-loader-row--main .rw-site-loader-word')
      const dividers = q('.rw-site-loader-row--main .rw-site-loader-divider')
      const rowStyle = getComputedStyle(rowRef.current)
      const restingTracking = parseFloat(rowStyle.letterSpacing) / parseFloat(rowStyle.fontSize)
      // Per-letter blur is the costliest effect here; phones get the same rise without it.
      const letterBlur = window.matchMedia('(max-width: 768px)').matches ? {} : { filter: 'blur(8px)' }

      // CSS only hides these (so nothing flashes before this runs); GSAP owns the start poses.
      gsap.set(halo, { scale: .55 })
      gsap.set(logo, { scale: .9, filter: LOGO_FILTER_HIDDEN })
      gsap.set(glint, { xPercent: -120, skewX: -18 })
      gsap.set(liquid, { yPercent: 100, y: 18 })
      gsap.set(progressRef.current, { scaleX: 0 })
      gsap.set(q('.rw-site-loader-row--main .rw-site-loader-letter'), {
        yPercent: 115, rotationX: -85, transformOrigin: '50% 100%', ...letterBlur,
      })
      gsap.set(dividers, { scale: 0, rotation: -135 })

      gsap.fromTo(glowRef.current,
        { '--rw-loader-glow-angle': '-90deg' },
        { '--rw-loader-glow-angle': '270deg', duration: 1.6, repeat: -1, ease: 'none' },
      )

      // Act 1: the mark arrives and fills with gold while its rim is traced with light.
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })
      tl.to(halo, { opacity: .55, scale: 1, duration: 1.6 }, 0)
        .to(logo, { opacity: 1, scale: 1, filter: LOGO_FILTER_REST, duration: 1 }, 0)
        .to(glowRef.current, { opacity: .9, duration: .4, ease: 'power1.out' }, .1)
        .to(liquid, { yPercent: 0, y: 0, duration: FILL_TIME, ease: 'power2.inOut' }, IGNITE - FILL_TIME)

      // Act 2: the filled mark ignites once; the rim light retires and the room warms up.
        .to(logo, { scale: 1.045, filter: LOGO_FILTER_IGNITE, duration: .28, ease: 'power2.out' }, IGNITE)
        .to(logo, { scale: 1, filter: LOGO_FILTER_REST, duration: 1.1 }, IGNITE + .28)
        // A single specular glint crosses the mark, clipped to the RW shape.
        .to(glint, { xPercent: 220, duration: 1, ease: 'power2.inOut' }, IGNITE - .05)
        .to(halo, { opacity: 1, duration: .5, ease: 'power2.out' }, IGNITE)
        .to(glowRef.current, { opacity: 0, duration: .6, ease: 'power1.inOut' }, IGNITE + .1)
        .to(q('.rw-site-loader-ambient'), { opacity: 1, duration: 1.4, ease: 'power2.out' }, IGNITE)

      // Act 3: the track draws out, the services land, and loading visibly progresses.
        .to(q('.rw-site-loader-rule'), { scaleX: 1, opacity: 1, duration: 1, ease: 'expo.inOut' }, IGNITE - .15)
        .fromTo(rowRef.current,
          { letterSpacing: `${restingTracking * 2.1}em` },
          { letterSpacing: `${restingTracking}em`, duration: 1.7, ease: 'expo.out', clearProps: 'letterSpacing' },
          IGNITE + .05,
        )
        .to(progressRef.current, { scaleX: .92, duration: PROGRESS_END - PROGRESS_START, ease: 'power1.inOut' }, PROGRESS_START)

      words.forEach((word, i) => {
        tl.to(word.children, {
          yPercent: 0, rotationX: 0, opacity: 1, ...(letterBlur.filter && { filter: 'blur(0px)' }),
          duration: .9, stagger: .03,
        }, IGNITE + .1 + i * .16)
      })
      dividers.forEach((divider, i) => {
        tl.to(divider, { scale: 1, rotation: 45, opacity: 1, duration: .8, ease: 'back.out(3)' }, IGNITE + .35 + i * .16)
      })

      // A band of light sweeps the words once they settle, then keeps gliding while loading.
      tl.set(shineRef.current, { opacity: 1 }, IGNITE + 1)
        .fromTo(shineRef.current,
          { '--rw-shine-x': '-20%' },
          { '--rw-shine-x': '120%', duration: 1.3, ease: 'power2.inOut', repeat: -1, repeatDelay: .7 },
          IGNITE + 1,
        )
    })
    // Returning null doesn't unmount this component, so stop GSAP when it hides.
    return () => media.revert()
  }, [ready, visible])

  if (!visible) return null

  return (
    <div
      ref={rootRef}
      className={`rw-site-loader${leaving ? ' is-leaving' : ''}`}
      role="status"
      aria-label="Loading Rajiv Williams: Coaching, Consulting, Realty"
    >
      <div className="rw-site-loader-ambient" aria-hidden="true">
        {EMBERS.map(([x, delay, size, duration], i) => (
          <span
            key={i}
            className="rw-site-loader-ember"
            style={{ '--x': `${x}%`, '--delay': `${delay}s`, '--size': `${size}px`, '--duration': `${duration}s` }}
          />
        ))}
      </div>

      <div className="rw-site-loader-stage" aria-hidden="true">
        <div className="rw-site-loader-halo" />
        <div
          className={`rw-site-loader-logo${logoReady ? ' is-ready' : ''}`}
          style={{ '--rw-loader-logo': `url("${goldMark}")` }}
        >
          <img
            className="rw-site-loader-logo-base"
            src={goldMark}
            alt=""
            width={632}
            height={481}
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
          <div className="rw-site-loader-glint"><div className="rw-site-loader-glint-band" /></div>
          <svg className="rw-site-loader-outline" viewBox="0 0 316.3 240.7" focusable="false">
            <defs>
              {/* Extract the edge from the actual PNG, including the inner cutouts. */}
              <filter id={outlineId} x="-5%" y="-5%" width="110%" height="110%" colorInterpolationFilters="sRGB">
                <feMorphology in="SourceAlpha" operator="erode" radius="1.4" result="inner" />
                <feComposite in="SourceAlpha" in2="inner" operator="out" result="edge" />
                <feFlood floodColor="#E8C97A" />
                <feComposite in2="edge" operator="in" />
              </filter>
            </defs>
            <image href={goldMark} width="316.3" height="240.7" filter={`url(#${outlineId})`} />
          </svg>
          <div ref={glowRef} className="rw-site-loader-glow">
            <svg className="rw-site-loader-glow-sweep" viewBox="0 0 316.3 240.7" focusable="false">
              <image href={goldMark} width="316.3" height="240.7" filter={`url(#${outlineId})`} />
            </svg>
          </div>
        </div>

        <div className="rw-site-loader-rule">
          <div ref={progressRef} className="rw-site-loader-progress" />
        </div>
        <div className="rw-site-loader-services" style={{ fontFamily: mono }}>
          <ServiceRow className="rw-site-loader-row rw-site-loader-row--main" rowRef={rowRef} />
          <ServiceRow className="rw-site-loader-row rw-site-loader-row--shine" rowRef={shineRef} />
        </div>
      </div>
    </div>
  )
}
