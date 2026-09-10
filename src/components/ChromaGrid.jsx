import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import './ChromaGrid.css'

/**
 * ChromaGrid (React Bits): a desaturating overlay with a radial mask that follows the
 * cursor, revealing colour only under the pointer. Changes from upstream: initials
 * monogram when `image` is missing; motion skipped for reduced-motion; no per-card
 * hover spotlight (matches the site's "no hover magnet" rule).
 */
export default function ChromaGrid({
  items,
  className = '',
  radius = 300,
  columns = 3,
  rows = 2,
  damping = 0.45,
  fadeOut = 0.6,
  ease = 'power3.out',
  scrim = true,
}) {
  const rootRef = useRef(null)
  const fadeRef = useRef(null)
  const setX = useRef(null)
  const setY = useRef(null)
  const pos = useRef({ x: 0, y: 0 })

  const data = items?.length ? items : []

  useEffect(() => {
    const el = rootRef.current
    if (!el) return
    setX.current = gsap.quickSetter(el, '--x', 'px')
    setY.current = gsap.quickSetter(el, '--y', 'px')
    const { width, height } = el.getBoundingClientRect()
    pos.current = { x: width / 2, y: height / 2 }
    setX.current(pos.current.x)
    setY.current(pos.current.y)
  }, [])

  const reduced = () =>
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

  const moveTo = (x, y) => {
    gsap.to(pos.current, {
      x,
      y,
      duration: damping,
      ease,
      onUpdate: () => {
        setX.current?.(pos.current.x)
        setY.current?.(pos.current.y)
      },
      overwrite: true,
    })
  }

  const handleMove = (e) => {
    if (reduced() || !scrim) return
    const r = rootRef.current.getBoundingClientRect()
    moveTo(e.clientX - r.left, e.clientY - r.top)
    gsap.to(fadeRef.current, { opacity: 0, duration: 0.25, overwrite: true })
  }

  const handleLeave = () => {
    if (reduced() || !scrim) return
    gsap.to(fadeRef.current, { opacity: 1, duration: fadeOut, overwrite: true })
  }

  const handleCardClick = (url) => {
    if (url) window.open(url, '_blank', 'noopener,noreferrer')
  }

  // First letters of the first two words, e.g. "Priyanka Panda" -> "PP".
  const initials = (name = '') =>
    name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]).join('').toUpperCase()

  return (
    <div
      ref={rootRef}
      className={`chroma-grid ${className}`}
      style={{ '--r': `${radius}px`, '--cols': columns, '--rows': rows }}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
    >
      {data.map((c, i) => (
        <article
          key={c.title || i}
          className="chroma-card"
          onClick={() => handleCardClick(c.url)}
          style={{
            '--card-border': c.borderColor || 'transparent',
            '--card-gradient': c.gradient,
            cursor: c.url ? 'pointer' : 'default',
          }}
        >
          <div className="chroma-img-wrapper">
            {c.image ? (
              <img src={c.image} alt={c.title} loading="lazy" />
            ) : (
              <div className="chroma-monogram" aria-hidden>
                <span>{initials(c.title)}</span>
              </div>
            )}
          </div>
          <footer className="chroma-info">
            <div className="chroma-info-top">
              <div className="chroma-info-head">
                <h3 className="name">{c.title}</h3>
                {c.handle && <span className="handle">{c.handle}</span>}
                {c.subtitle && <p className="role">{c.subtitle}</p>}
              </div>
              {c.location && <span className="location">{c.location}</span>}
            </div>

            {c.url && (
              <a
                className="chroma-linkedin"
                href={c.url}
                target="_blank"
                rel="noreferrer"
                aria-label={`${c.title} on LinkedIn`}
                onClick={(e) => e.stopPropagation()}
              >
                <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true">
                  <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.61 0 4.28 2.38 4.28 5.48v6.26zM5.34 7.43a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45z" />
                </svg>
                LINKEDIN
              </a>
            )}
          </footer>
        </article>
      ))}
      {/* Scrim desaturates the whole grid; cursor punches a colour hole through it. Off unless asked for. */}
      {scrim && (
        <>
          <div className="chroma-overlay" />
          <div ref={fadeRef} className="chroma-fade" />
        </>
      )}
    </div>
  )
}

export { ChromaGrid }
