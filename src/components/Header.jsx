import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import CrawlableNav from './CrawlableNav'
import OptionWheel from './OptionWheel'
import Wordmark from './Wordmark'
import FontSizeControl from './FontSizeControl'
import { useBooking } from './BookingModal'
import { useSmoothScroll } from '../hooks/useSmoothScroll'
import { mono } from '../theme'
import {
  ArrowRight, Building2, ChartNoAxesColumnIncreasing, ChevronDown, ChevronRight, FileSignature, Handshake, KeyRound, LayoutGrid, ListPlus, Target, Users,
} from 'lucide-react'

// Same wheel menu on every page: only route links belong here, not per-page scroll anchors.
const SITE_NAV = [
  { label: 'Home', to: '/' },
  { label: 'Sales Coaching', to: '/coaching' },
  { label: 'Sales Consulting', to: '/consulting' },
  { label: 'Projects in Hyderabad', to: '/project-hyderabad' },
  { label: 'Sales Mandate', to: '/realty' },
  { label: 'Portfolio', to: '/realty/portfolio' },
  { label: 'Careers', to: '/careers' },
  { label: 'Channel Partners', to: '/partner' },
  { label: 'KRISAH Assessment', to: '/assessment' },
  // { label: 'Find your fit', to: '/start' },
  { label: 'Book a call', book: true },
]

/**
 * Desktop/laptop inline nav (approved wireframe Option B): a few top-level links plus
 * one "Work with RW" glass mega menu. Tablet and phone keep the wheel menu instead.
 */
const MEGA_COLUMNS = [
  {
    heading: 'Grow your sales',
    items: [
      { label: 'Sales Coaching', to: '/coaching', desc: '1:1 and team sales coaching', icon: Users },
      { label: 'Sales Consulting', to: '/consulting', desc: 'Sales structure & strategy for developers', icon: ChartNoAxesColumnIncreasing },
      { label: 'Sales Mandate', to: '/realty', desc: 'RW runs your project sales mandate', icon: FileSignature },
    ],
  },
  {
    heading: 'Partners',
    items: [
      { label: 'Channel Partners', to: '/partner', desc: 'Partner with RW', icon: Handshake },
    ],
  },
  {
    heading: 'Start here',
    items: [
      { label: 'KRISAH Assessment', to: '/assessment', desc: 'Find your sales strengths', icon: Target },
    ],
    book: true,
  },
]
const MEGA_PATHS = MEGA_COLUMNS.flatMap((col) => col.items.map((item) => item.to).filter(Boolean))
const TOP_LINKS = [
  { label: 'Portfolio', to: '/realty/portfolio' },
  { label: 'Careers', to: '/careers' },
]
const PROPERTY_COLUMNS = [
  {
    heading: 'Builder',
    items: [
      { label: 'Projects in Hyderabad', to: '/project-hyderabad', desc: 'Projects that Team RW has represented', icon: Building2 },
    ],
  },
  {
    heading: 'Resale',
    soon: true,
    items: [
      { label: 'List a property', desc: 'List your property with Team RW', soon: true, icon: ListPlus },
      { label: 'Listed properties', desc: 'See rates and send an enquiry', soon: true, icon: LayoutGrid },
    ],
  },
  {
    heading: 'Rent',
    soon: true,
    items: [
      { label: 'Rentals', desc: 'Hyderabad rentals', soon: true, icon: KeyRound },
    ],
  },
]

function MegaPanel({ id, columns, pathname, onClose, onBook }) {
  return (
    <div id={id} className="rw-mega">
      <div className="rw-mega-panel">
        {columns.map((col) => (
          <div key={col.heading} className="rw-mega-col">
            <p className="rw-mega-head">
              {col.heading}
              {col.soon && <span className="rw-mega-soon">Coming soon</span>}
            </p>
            {col.items.map((item) => {
              const Icon = item.icon
              const body = (
                <>
                  {Icon && <Icon className="rw-mega-icon" size={24} strokeWidth={1.5} aria-hidden="true" />}
                  <span className="rw-mega-text">
                    <span className="rw-mega-title">{item.label}</span>
                    <span className="rw-mega-desc">{item.desc}</span>
                  </span>
                  {item.to && !item.soon && <ChevronRight className="rw-mega-go" size={18} strokeWidth={1.75} aria-hidden="true" />}
                </>
              )
              if (item.soon) {
                return <div key={item.label} className="rw-mega-item is-soon" aria-disabled="true">{body}</div>
              }
              return (
                <Link key={item.to} to={item.to} onClick={onClose} className={`rw-mega-item${pathname === item.to ? ' is-active' : ''}`}>
                  {body}
                </Link>
              )
            })}
            {col.book && (
              <button type="button" className="rw-mega-book" onClick={() => { onClose(); onBook() }}>
                BOOK A STRATEGY CALL <ArrowRight size={18} strokeWidth={1.6} aria-hidden="true" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function DesktopNav({ pathname, onBook }) {
  const [open, setOpen] = useState(null)
  const workRef = useRef(null)
  const propsRef = useRef(null)
  const workTriggerRef = useRef(null)
  const propsTriggerRef = useRef(null)
  const hoverOpenedRef = useRef(false)
  const closeTimerRef = useRef(null)
  const openTimerRef = useRef(null)

  useEffect(() => () => {
    clearTimeout(closeTimerRef.current)
    clearTimeout(openTimerRef.current)
  }, [])
  useEffect(() => { setOpen(null) }, [pathname])

  useEffect(() => {
    if (!open) return
    const wraps = [workRef.current, propsRef.current].filter(Boolean)
    const onKey = (e) => {
      if (e.key !== 'Escape') return
      const trigger = open === 'work' ? workTriggerRef.current : propsTriggerRef.current
      if (wraps.some((el) => el.contains(document.activeElement))) trigger?.focus()
      setOpen(null)
    }
    const onDown = (e) => { if (!wraps.some((el) => el.contains(e.target))) setOpen(null) }
    window.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onDown)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onDown)
    }
  }, [open])

  const enter = (id) => {
    clearTimeout(closeTimerRef.current)
    if (open === id) return
    if (open) { hoverOpenedRef.current = true; setOpen(id); return }
    openTimerRef.current = setTimeout(() => { hoverOpenedRef.current = true; setOpen(id) }, 120)
  }
  const leave = () => {
    clearTimeout(openTimerRef.current)
    hoverOpenedRef.current = false
    closeTimerRef.current = setTimeout(() => setOpen(null), 180)
  }
  const toggle = (id) => {
    clearTimeout(openTimerRef.current)
    if (hoverOpenedRef.current && open === id) { hoverOpenedRef.current = false; return }
    setOpen((was) => (was === id ? null : id))
  }
  const close = () => setOpen(null)
  const linkClass = (to) => `rw-dnav-link${pathname === to ? ' is-active' : ''}`

  return (
    <nav className="rw-dnav" aria-label="Main">
      <Link to="/" className={linkClass('/')}>Home</Link>

      <div
        ref={propsRef}
        className="rw-dnav-mega-wrap"
        onMouseEnter={() => enter('props')}
        onMouseLeave={leave}
        onBlur={(e) => { if (e.relatedTarget && !propsRef.current?.contains(e.relatedTarget) && !workRef.current?.contains(e.relatedTarget)) setOpen(null) }}
      >
        <button
          ref={propsTriggerRef}
          type="button"
          className={`rw-dnav-link${pathname === '/project-hyderabad' ? ' is-active' : ''}`}
          aria-expanded={open === 'props'}
          aria-controls="rw-props-mega"
          onClick={() => toggle('props')}
        >
          Properties <ChevronDown className="rw-dnav-caret" size={14} strokeWidth={1.75} aria-hidden="true" />
        </button>

        {open === 'props' && (
          <MegaPanel id="rw-props-mega" columns={PROPERTY_COLUMNS} pathname={pathname} onClose={close} />
        )}
      </div>

      <div
        ref={workRef}
        className="rw-dnav-mega-wrap"
        onMouseEnter={() => enter('work')}
        onMouseLeave={leave}
        onBlur={(e) => { if (e.relatedTarget && !workRef.current?.contains(e.relatedTarget) && !propsRef.current?.contains(e.relatedTarget)) setOpen(null) }}
      >
        <button
          ref={workTriggerRef}
          type="button"
          className={`rw-dnav-link${MEGA_PATHS.includes(pathname) ? ' is-active' : ''}`}
          aria-expanded={open === 'work'}
          aria-controls="rw-mega"
          onClick={() => toggle('work')}
        >
          Work with RW <ChevronDown className="rw-dnav-caret" size={14} strokeWidth={1.75} aria-hidden="true" />
        </button>

        {open === 'work' && (
          <MegaPanel id="rw-mega" columns={MEGA_COLUMNS} pathname={pathname} onClose={close} onBook={onBook} />
        )}
      </div>

      {TOP_LINKS.map((item) => (
        <Link key={item.to} to={item.to} className={linkClass(item.to)}>{item.label}</Link>
      ))}
    </nav>
  )
}

/**
 * Font size and edge inset for the fullscreen wheel, sized against the viewport since the
 * wheel positions options from their rem-sized rows and can't take a clamp().
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
  const headerRef = useRef(null)

  /* Publish the header's height as --rw-header-h so the hero can fill exactly the
     visible screen below it (100svh alone made the hero one header too tall). */
  useEffect(() => {
    const el = headerRef.current
    if (!el || typeof ResizeObserver === 'undefined') return
    const ro = new ResizeObserver(() => {
      document.documentElement.style.setProperty('--rw-header-h', `${el.offsetHeight}px`)
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
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
    // Glass background lives on .rw-header::before (global.css), not on the header itself:
    // a backdrop-filter on the header would stop the mega menu's own glass from blurring the page.
    <header ref={headerRef} className="rw-header" style={{ position: 'sticky', top: 0, zIndex: 50, borderBottom: '1px solid var(--line)' }}>
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

        {/* Desktop/laptop only (CSS hides it below 1100px, where the wheel menu takes over). */}
        <DesktopNav pathname={pathname} onBook={openBooking} />

        <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(12px,1.6vw,20px)' }}>
          {/* Whole-site text-size control (Small/default, Medium, Large). */}
          <FontSizeControl />

          <button type="button" className="rw-dnav-book" onClick={() => openBooking()}>BOOK A CALL</button>

          {/* Tablet/phone: nav lives in the wheel menu behind this button. */}
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
