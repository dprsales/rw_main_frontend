import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import './ChromaGrid.css'

/** Spotlight grid (React Bits): overlay desaturates the grid, a cursor-tracked mask reveals colour per card. */
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

  const handleCardMove = (e) => {
    const card = e.currentTarget
    const rect = card.getBoundingClientRect()
    card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`)
    card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`)
  }

  // Initials from the first two words of the name, e.g. "PP".
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
          onMouseMove={handleCardMove}
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
            <h3 className="name">{c.title}</h3>
            {c.handle && <span className="handle">{c.handle}</span>}
            {c.subtitle && <p className="role">{c.subtitle}</p>}
            {c.location && <span className="location">{c.location}</span>}
          </footer>
        </article>
      ))}
      {/* Desaturating scrim, cursor punches a colour hole through it; off unless enabled */}
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
