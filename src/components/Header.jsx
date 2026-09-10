import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import CrawlableNav from './CrawlableNav'
import OptionWheel from './OptionWheel'
import Wordmark from './Wordmark'
import { useBooking } from './BookingModal'
import { useSmoothScroll } from '../hooks/useSmoothScroll'
import { mono } from '../theme'

// Same wheel menu on every page: only route links belong here, not per-page scroll anchors.
const SITE_NAV = [
  { label: 'Home', to: '/' },
  { label: 'Coaching', to: '/coaching' },
  { label: 'Consulting', to: '/consulting' },
  { label: 'RW Realty', to: '/realty' },
  { label: 'Portfolio', to: '/realty/portfolio' },
  { label: 'Careers', to: '/careers' },
  { label: 'Book a call', book: true },
]

/**
 * Font size and edge inset for the fullscreen wheel, sized against the viewport since the
 * wheel positions options in real px and can't take a clamp(). Height matters as much as width.
 */
function wheelMetrics() {
  if (typeof window === 'undefined') return { fontSize: 3.2, inset: 96 }
  const { innerWidth: w, innerHeight: h } = window
  if (w < 480) return { fontSize: 1.6, inset: 22 }
  if (w < 720) return { fontSize: 1.9, inset: 32 }
  if (h < 620) return { fontSize: 2.1, inset: 48 }
  if (w < 1100) return { fontSize: 2.6, inset: 64 }
  return { fontSize: 3.2, inset: 96 }
}

function MenuIcon({ open }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
      {open
        ? <><path d="M5 5l14 14" /><path d="M19 5L5 19" /></>
        : <><path d="M3 7h18" /><path d="M3 12h18" /><path d="M3 17h18" /></>}
    </svg>
  )
}

/** Wordmark + menu button; nav lives in the wheel menu (SITE_NAV). Takes no props. */
export default function Header() {
  const scrollToId = useSmoothScroll()
  const openBooking = useBooking()
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  const navigate = useNavigate()

  /* A route change means the menu's job is done. */
  useEffect(() => { setOpen(false) }, [pathname])

  /* Don't let the page scroll behind the open menu. */
  useEffect(() => {
    if (!open) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = previous }
  }, [open])

  const jumpTo = (section) => {
    setOpen(false)
    // Wait for the menu to unmount before measuring the target's position.
    requestAnimationFrame(() => scrollToId(section))
  }

  /* Esc closes the wheel menu, as it should for any modal. */
  useEffect(() => {
    if (!open) return
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  // Opens the wheel on the current page's option; wheel takes labels, index maps back to SITE_NAV.
  const currentIndex = Math.max(0, SITE_NAV.findIndex((item) => item.to === pathname))

  const goTo = (item) => {
    if (!item) return
    if (item.section) { jumpTo(item.section); return }
    setOpen(false)
    if (item.book) openBooking()
    else if (item.to) navigate(item.to)
    else if (item.href) window.location.href = item.href
  }

  // Re-measured on resize/rotate, not just at mount, so type stays sized to the viewport.
  const [wheel, setWheel] = useState(wheelMetrics)
  useEffect(() => {
    const onResize = () => setWheel(wheelMetrics())
    window.addEventListener('resize', onResize)
    window.addEventListener('orientationchange', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
      window.removeEventListener('orientationchange', onResize)
    }
  }, [])

  return (
    <header
      style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'color-mix(in srgb, var(--bg) 84%, transparent)',
        backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)',
        borderBottom: '1px solid var(--line)',
      }}
    >
      <div
        className="rw-pad"
        style={{
          maxWidth: 1320, margin: '0 auto', padding: 'clamp(10px,1.4vw,15px) 40px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24,
        }}
      >
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 13, color: 'var(--ink)' }}>
          <Wordmark />
        </Link>

        {/* No inline nav — it lives in the wheel menu behind this button. */}
        <button
          type="button"
          className="rw-menu-btn"
          onClick={() => setOpen((wasOpen) => !wasOpen)}
          aria-expanded={open}
          aria-label={open ? 'Close menu' : 'Open menu'}
          style={{
            display: 'none', alignItems: 'center', justifyContent: 'center',
            width: 40, height: 40, background: 'none', cursor: 'pointer',
            border: '1px solid var(--line)', borderRadius: 100, color: 'var(--ink)',
          }}
        >
          <MenuIcon open={open} />
        </button>
      </div>

      {/* Portalled past the header (backdrop-filter would clip fixed descendants) but into
          the theme shell, not <body>, so the overlay keeps the shell's palette var(--…) scope. */}
      {open && createPortal(
        <div className="rw-wheel-menu" role="dialog" aria-modal="true" aria-label="Navigation">
          <button
            type="button"
            className="rw-wheel-close"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
          >
            <MenuIcon open />
          </button>

          <div className="rw-wheel-stage">
            <OptionWheel
              items={SITE_NAV.map((item) => item.label)}
              defaultSelected={currentIndex}
              onActivate={(index) => goTo(SITE_NAV[index])}
              textColor="rgba(242,239,233,0.28)"
              activeColor="#F2EFE9"
              side="left"
              fontSize={wheel.fontSize}
              spacing={1.35}
              curve={1}
              tilt={7}
              blur={1.6}
              fade={0.26}
              smoothing={190}
              inset={wheel.inset}
            />
          </div>

          <p className="rw-wheel-hint" style={{ fontFamily: mono }}>Scroll, drag or use ↑ ↓ · click to go</p>
        </div>,
        document.getElementById('rw-app-shell') || document.body,
      )}
    </header>
  )
}
