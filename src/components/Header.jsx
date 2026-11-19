import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { createPortal } from 'react-dom'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import CrawlableNav from './CrawlableNav'
import HiringBanner from './HiringBanner'
import OptionWheel from './OptionWheel'
import Wordmark from './Wordmark'
import FontSizeControl from './FontSizeControl'
import LangSwitch from './LangSwitch'
import AccountMenu from '../listings/components/AccountMenu'
import CtaButton from './CtaButton'
import { formPathForRoute } from '../data/booking'
import { useLang } from '../i18n/LangProvider'
import { useSmoothScroll } from '../hooks/useSmoothScroll'
import { mono } from '../theme'
import {
  ArrowRight, BookOpen, Building2, ChartNoAxesColumnIncreasing, ChevronDown, ChevronRight, CircleHelp,
  FileSignature, Film, Gem, Handshake, House, Layers, Library, Package, Target, Users,
} from 'lucide-react'

// Wheel: Realty holds Mandate + Advisory; Branding under Consulting; programmes under Coaching.
const SITE_NAV = [
  { key: 'nav.home', label: 'Home', to: '/' },
  { key: 'nav.coaching', label: 'Sales Coaching', to: '/coaching' },
  { key: 'nav.consulting', label: 'Sales Consulting', to: '/consulting' },
  { key: 'nav.brandConsulting', label: 'Branding & Marketing', to: '/consulting/brand-consulting' },
  { key: 'nav.realty', label: 'Realty', to: '/realty' },
  { key: 'nav.mandate', label: 'Sales Mandate', to: '/realty' },
  { key: 'nav.advisory', label: 'Investment Advisory', to: '/project-hyderabad' },
  { key: 'mega.listProperty', label: 'Buy, sell, rent', to: '/listings' },
  { key: 'nav.portfolio', label: 'About', to: '/about' },
  { key: 'nav.careers', label: 'Careers', to: '/careers' },
  { key: 'nav.gallery', label: 'Gallery', to: '/gallery' },
  { key: 'nav.contact', label: 'Contact', to: '/contact' },
  { key: 'nav.articles', label: 'Articles', to: '/articles' },
  { key: 'nav.contentLibrary', label: 'Content Library', to: '/content-library' },
  { key: 'nav.faqs', label: 'FAQs', to: '/faqs' },
  { key: 'nav.partners', label: 'Channel Partners', to: '/partner' },
  { key: 'nav.krisah', label: 'KRISAH Assessment', to: '/assessment' },
  { key: 'nav.bookCall', label: 'Talk to Team RW', book: true },
]

/**
 * Services mega: Grow your sales | hover submenu | Start here.
 * Coaching programmes, Consulting → Branding, Realty → Mandate + Advisory.
 * Team Sales Coaching links to /coaching (no separate programme section yet).
 */
const MEGA_GROWTH_ITEMS = [
  {
    key: 'nav.coaching', label: 'Sales Coaching', to: '/coaching', descKey: 'mega.coachingDesc',
    panelTitleKey: 'mega.coachingPanelTitle', panelDescKey: 'mega.coachingPanelDesc', icon: Users,
    children: [
      { key: 'nav.programMastery', label: 'Luxury Sales Mastery', to: '/coaching#program-luxury-sales-mastery', descKey: 'mega.programMasteryDesc', icon: Gem },
      { key: 'nav.programHighTicket', label: 'High Ticket Sales Mastery', to: '/coaching#program-high-ticket-sales', descKey: 'mega.programHighTicketDesc', icon: Layers },
      { key: 'nav.programOneToOne', label: 'One-to-One Mentoring', to: '/coaching#program-one-to-one', descKey: 'mega.programOneToOneDesc', icon: Users },
      { key: 'nav.programTeam', label: 'Team Sales Coaching', to: '/coaching', descKey: 'mega.programTeamDesc', icon: Users },
    ],
  },
  {
    key: 'nav.consulting', label: 'Sales Consulting', to: '/consulting', descKey: 'mega.consultingDesc',
    panelTitleKey: 'mega.consultingPanelTitle', panelDescKey: 'mega.consultingPanelDesc', icon: ChartNoAxesColumnIncreasing,
    children: [
      { key: 'nav.brandConsulting', label: 'Branding & Marketing', to: '/consulting/brand-consulting', descKey: 'mega.brandConsultingDesc', icon: Library },
    ],
  },
  {
    key: 'nav.realty', label: 'Realty', to: '/realty', descKey: 'mega.realtyDesc',
    panelTitleKey: 'mega.realtyPanelTitle', panelDescKey: 'mega.realtyPanelDesc', icon: Building2,
    children: [
      { key: 'nav.mandate', label: 'Sales Mandate', to: '/realty', descKey: 'mega.mandateDesc', icon: FileSignature },
      { key: 'nav.advisory', label: 'Investment Advisory', to: '/project-hyderabad', descKey: 'mega.advisoryDesc', icon: Target },
      { key: 'mega.listProperty', label: 'Buy, sell, rent', to: '/listings', descKey: 'mega.listDesc', icon: House },
    ],
  },
]

const MEGA_START_ITEMS = [
  { key: 'nav.krisah', label: 'KRISAH Assessment', to: '/assessment', descKey: 'mega.krisahDesc', icon: Target, featured: true },
  { key: 'nav.partners', label: 'Channel Partners', to: '/partner', descKey: 'mega.partnerDesc', icon: Handshake, compact: true },
  { key: 'mega.vendors', label: 'Vendors / Partners', to: '/vendorpartner', descKey: 'mega.vendorDesc', icon: Package, compact: true },
]

const MEGA_COLUMNS = [
  { headingKey: 'mega.salesGrowth', heading: 'Sales Growth', items: MEGA_GROWTH_ITEMS },
  { headingKey: 'mega.getStarted', heading: 'Get Started', items: MEGA_START_ITEMS, book: true },
]
function collectMegaPaths(items) {
  return items.flatMap((item) => [
    item.to,
    ...(item.children ? collectMegaPaths(item.children) : []),
  ].filter(Boolean)).map((to) => String(to).split('#')[0])
}
const MEGA_PATHS = [...new Set(MEGA_COLUMNS.flatMap((col) => collectMegaPaths(col.items)))]

const LEARN_COLUMNS = [
  {
    headingKey: 'mega.learn',
    heading: 'Learn',
    items: [
      { key: 'nav.gallery', label: 'Gallery', to: '/gallery', descKey: 'mega.galleryDesc', desc: 'YouTube talks and Team RW floor stills', icon: Film },
      { key: 'nav.articles', label: 'Articles', to: '/articles', descKey: 'mega.articlesDesc', desc: 'Readings on luxury sales and teams', icon: BookOpen },
      { key: 'nav.contentLibrary', label: 'Content Library', to: '/content-library', descKey: 'mega.contentLibraryDesc', desc: 'Sales carousels to preview and download', icon: Library },
      { key: 'nav.faqs', label: 'FAQs', to: '/faqs', descKey: 'mega.faqsDesc', desc: 'Answers on coaching, consulting, mandates', icon: CircleHelp },
    ],
  },
]
const LEARN_PATHS = LEARN_COLUMNS.flatMap((col) => col.items.map((item) => item.to).filter(Boolean))

function pathActive(pathname, to) {
  if (!to) return false
  const [path, hash] = String(to).split('#')
  if (hash) {
    return pathname === path && typeof window !== 'undefined' && window.location.hash === `#${hash}`
  }
  return pathname === path || (path !== '/' && pathname.startsWith(`${path}/`))
}

function serviceKeyForPath(pathname) {
  const match = MEGA_GROWTH_ITEMS.find((item) => (
    collectMegaPaths([item]).some((p) => pathActive(pathname, p))
  ))
  return match?.key || MEGA_GROWTH_ITEMS[0].key
}

function renderMegaItemBody(item, t) {
  const Icon = item.icon
  return (
    <>
      {Icon && <Icon className="rw-mega-icon" size={22} strokeWidth={1.5} aria-hidden="true" />}
      <span className="rw-mega-text">
        <span className="rw-mega-title">{t(item.key)}</span>
        {!item.compact && item.descKey && <span className="rw-mega-desc">{t(item.descKey)}</span>}
      </span>
    </>
  )
}

function MegaLinkItem({ item, pathname, onClose, active = false, showGo = true }) {
  const { t } = useLang()
  if (item.soon) {
    return (
      <div className="rw-mega-item is-soon" aria-disabled="true">
        {renderMegaItemBody(item, t)}
      </div>
    )
  }
  return (
    <Link
      to={item.to}
      onClick={onClose}
      className={`rw-mega-item${item.compact ? ' is-compact' : ''}${item.featured ? ' is-featured' : ''}${pathActive(pathname, item.to) || active ? ' is-active' : ''}`}
    >
      {renderMegaItemBody(item, t)}
      {showGo && <ChevronRight className="rw-mega-go" size={16} strokeWidth={1.75} aria-hidden="true" />}
    </Link>
  )
}

/** Keep the panel caret under the open Services / Learn trigger. */
function useMegaCaret(triggerRef) {
  const shellRef = useRef(null)
  useEffect(() => {
    const shell = shellRef.current
    const trigger = triggerRef?.current
    if (!shell || !trigger) return undefined
    const sync = () => {
      const sr = shell.getBoundingClientRect()
      const tr = trigger.getBoundingClientRect()
      if (!sr.width) return
      const x = Math.min(Math.max(tr.left + tr.width / 2 - sr.left, 18), sr.width - 18)
      shell.style.setProperty('--rw-mega-caret-x', `${Math.round(x)}px`)
    }
    sync()
    window.addEventListener('resize', sync)
    return () => window.removeEventListener('resize', sync)
  }, [triggerRef])
  return shellRef
}

/** Learn (and other flat megas): same quiet list as Services. */
function FlatMegaPanel({ id, columns, pathname, onClose, onBook, triggerRef }) {
  const { t } = useLang()
  const shellRef = useMegaCaret(triggerRef)
  const stackRef = useRef(null)

  useLayoutEffect(() => {
    const stack = stackRef.current
    if (!stack) return undefined
    const items = stack.querySelectorAll('.rw-mega-item')
    if (!items.length) return undefined
    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.fromTo(
        items,
        { opacity: 0.001, y: 10 },
        { opacity: 1, y: 0, duration: 0.45, stagger: 0.05, ease: 'expo.out', overwrite: true },
      )
    })
    return () => mm.revert()
  }, [id])

  return (
    <div id={id} ref={shellRef} className="rw-mega rw-mega-learn">
      <div className={`rw-mega-panel is-learn${columns.length === 1 ? ' is-single' : ''}`}>
        {columns.map((col) => (
          <div key={col.heading} className="rw-mega-col">
            <p className="rw-mega-col-label">
              {t(col.headingKey)}
              {col.soon && <span className="rw-mega-soon">{t('mega.soon')}</span>}
            </p>
            <div ref={stackRef} className="rw-mega-stack">
              {col.items.map((item) => (
                <MegaLinkItem key={item.key || item.to} item={item} pathname={pathname} onClose={onClose} />
              ))}
            </div>
            {col.book && (
              <CtaButton className="rw-mega-cta" onClick={() => { onClose(); onBook() }}>
                {t('mega.bookStrategy')}
              </CtaButton>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

/** Prefer hover popovers on fine pointers; accordion on touch / coarse. */
function useMegaHoverMode() {
  const [hoverMode, setHoverMode] = useState(() => (
    typeof window !== 'undefined'
      && window.matchMedia('(hover: hover) and (pointer: fine)').matches
  ))
  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)')
    const sync = () => setHoverMode(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])
  return hoverMode
}

/**
 * One Services mega. Hover Coaching, Consulting, or Realty to swap the middle
 * column in place. No flyout to the right of the panel.
 */
function ServicesMegaPanel({ id, pathname, onClose, onBook, triggerRef }) {
  const { t } = useLang()
  const hoverMode = useMegaHoverMode()
  const shellRef = useMegaCaret(triggerRef)
  const catsRef = useRef(null)
  const nubRef = useRef(null)
  const stackRef = useRef(null)
  const nubReady = useRef(false)
  const defaultKey = serviceKeyForPath(pathname)
  const [activeKey, setActiveKey] = useState(defaultKey)
  const panelId = `${id}-panel`
  const active = MEGA_GROWTH_ITEMS.find((item) => item.key === activeKey) || MEGA_GROWTH_ITEMS[0]
  const childItems = active.children || []

  useEffect(() => {
    setActiveKey(defaultKey)
  }, [defaultKey, id])

  useLayoutEffect(() => {
    const cats = catsRef.current
    const nub = nubRef.current
    const row = cats?.querySelector('.rw-mega-cat.is-active')
    if (!cats || !nub || !row) return undefined
    const cr = cats.getBoundingClientRect()
    const rr = row.getBoundingClientRect()
    const y = rr.top - cr.top + cats.scrollTop
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!nubReady.current || reduced) {
      gsap.set(nub, { y, height: rr.height })
      nubReady.current = true
      return undefined
    }
    gsap.to(nub, { y, height: rr.height, duration: 0.42, ease: 'expo.out', overwrite: true })
    return undefined
  }, [activeKey, hoverMode])

  useLayoutEffect(() => {
    const stack = stackRef.current
    if (!stack || !hoverMode) return undefined
    const items = stack.querySelectorAll('.rw-mega-item')
    if (!items.length) return undefined
    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.fromTo(
        items,
        { opacity: 0.001, y: 10 },
        { opacity: 1, y: 0, duration: 0.45, stagger: 0.05, ease: 'expo.out', overwrite: true },
      )
    })
    return () => mm.revert()
  }, [activeKey, hoverMode])

  const selectService = (key) => setActiveKey(key)

  const onServiceKeyDown = (e, index) => {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp' && e.key !== 'Home' && e.key !== 'End') return
    e.preventDefault()
    const last = MEGA_GROWTH_ITEMS.length - 1
    let next = index
    if (e.key === 'ArrowDown') next = index === last ? 0 : index + 1
    if (e.key === 'ArrowUp') next = index === 0 ? last : index - 1
    if (e.key === 'Home') next = 0
    if (e.key === 'End') next = last
    const nextKey = MEGA_GROWTH_ITEMS[next].key
    selectService(nextKey)
    document.getElementById(`${id}-svc-${nextKey}`)?.focus()
  }

  const serviceBody = (service) => {
    const Icon = service.icon
    return (
      <>
        {Icon && <Icon className="rw-mega-icon" size={18} strokeWidth={1.4} aria-hidden="true" />}
        <span className="rw-mega-text">
          <span className="rw-mega-title">{t(service.key)}</span>
          <span className="rw-mega-desc">{t(service.descKey)}</span>
        </span>
        <ChevronRight className="rw-mega-go" size={15} strokeWidth={1.6} aria-hidden="true" />
      </>
    )
  }

  return (
    <div
      id={id}
      ref={shellRef}
      className={`rw-mega rw-mega-services${hoverMode ? '' : ' is-touch'}`}
    >
      <div className="rw-mega-panel is-services">
        <div ref={catsRef} className="rw-mega-cats" role="none">
          <p className="rw-mega-col-label">{t('mega.grow')}</p>
          {hoverMode && <div ref={nubRef} className="rw-mega-cat-nub" aria-hidden="true" />}
          {MEGA_GROWTH_ITEMS.map((service, index) => {
            const isActive = service.key === active.key
            const accId = `${id}-acc-${service.key}`
            const catClass = `rw-mega-cat${isActive ? ' is-active' : ''}`
            const catProps = {
              id: `${id}-svc-${service.key}`,
              className: catClass,
              'aria-expanded': isActive,
              'aria-controls': hoverMode ? panelId : accId,
              onMouseEnter: () => { if (hoverMode) selectService(service.key) },
              onFocus: () => selectService(service.key),
              onKeyDown: (e) => onServiceKeyDown(e, index),
            }
            return (
              <div key={service.key} className={`rw-mega-cat-block${isActive ? ' is-active' : ''}`}>
                {hoverMode ? (
                  <Link
                    {...catProps}
                    to={service.to}
                    onClick={onClose}
                  >
                    {serviceBody(service)}
                  </Link>
                ) : (
                  <button
                    {...catProps}
                    type="button"
                    onClick={() => selectService(service.key)}
                  >
                    {serviceBody(service)}
                  </button>
                )}

                {!hoverMode && isActive && (
                  <div id={accId} className="rw-mega-accordion" role="region" aria-labelledby={`${id}-svc-${service.key}`}>
                    {(service.children || []).map((item) => (
                      <MegaLinkItem key={item.key || item.to} item={item} pathname={pathname} onClose={onClose} />
                    ))}
                    <Link to={service.to} className="rw-mega-explore" onClick={onClose}>
                      {t('mega.explore')} {t(service.key)}
                      <ArrowRight size={16} strokeWidth={1.6} aria-hidden="true" />
                    </Link>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {hoverMode && (
          <div
            id={panelId}
            className="rw-mega-content"
            role="region"
            aria-labelledby={`${id}-svc-${active.key}`}
            key={active.key}
          >
            <p className="rw-mega-col-label">{t(active.key)}</p>
            <div ref={stackRef} className="rw-mega-stack">
              {childItems.map((item) => (
                <MegaLinkItem key={item.key || item.to} item={item} pathname={pathname} onClose={onClose} />
              ))}
            </div>
          </div>
        )}

        <div className="rw-mega-start" role="none">
          <p className="rw-mega-col-label">{t('mega.startHere')}</p>
          <div className="rw-mega-start-list">
            {MEGA_START_ITEMS.map((item) => (
              <MegaLinkItem key={item.key || item.to} item={item} pathname={pathname} onClose={onClose} />
            ))}
          </div>
          <CtaButton
            className="rw-mega-cta"
            onClick={() => { onClose(); onBook() }}
          >
            {t('mega.bookStrategy')}
          </CtaButton>
        </div>
      </div>
    </div>
  )
}

function MegaPanel({ id, columns, pathname, onClose, onBook, triggerRef }) {
  return <FlatMegaPanel id={id} columns={columns} pathname={pathname} onClose={onClose} onBook={onBook} triggerRef={triggerRef} />
}

/** Top bar: Home, Services, About, Learn, Careers, Contact. Gallery lives under Learn. */
function DesktopNav({ pathname, onBook }) {
  const { t } = useLang()
  const [open, setOpen] = useState(null)
  const workRef = useRef(null)
  const learnRef = useRef(null)
  const workTriggerRef = useRef(null)
  const learnTriggerRef = useRef(null)
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
    const wraps = [workRef.current, learnRef.current].filter(Boolean)
    const onKey = (e) => {
      if (e.key !== 'Escape') return
      const trigger = open === 'learn' ? learnTriggerRef.current : workTriggerRef.current
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
    closeTimerRef.current = setTimeout(() => setOpen(null), 220)
  }
  const toggle = (id) => {
    clearTimeout(openTimerRef.current)
    if (hoverOpenedRef.current && open === id) { hoverOpenedRef.current = false; return }
    setOpen((was) => (was === id ? null : id))
  }
  const close = () => setOpen(null)
  const megaOpen = open === 'work' || open === 'learn'
  const linkClass = (to) => {
    const current = pathname === to
    return `rw-dnav-link${current ? ' is-current' : ''}${current && !megaOpen ? ' is-active' : ''}`
  }
  const blurUnlessSibling = (e, selfRef) => {
    const related = e.relatedTarget
    if (!related) return
    const wraps = [workRef.current, learnRef.current]
    if (!wraps.some((el) => el?.contains(related))) setOpen(null)
    else if (!selfRef.current?.contains(related)) {/* switching megas handled by enter */}
  }

  const servicesActive = MEGA_PATHS.some((p) => pathActive(pathname, p))
    || pathname.startsWith('/listings')
    || pathname.startsWith('/list-property')
    || pathname.startsWith('/realty/listings')
    || pathname.startsWith('/projects/')
    || pathname.startsWith('/realty/projects/')
  const learnActive = LEARN_PATHS.includes(pathname)

  return (
    <nav className="rw-dnav" aria-label={t('ui.main')}>
      <Link to="/" className={linkClass('/')}>{t('nav.home')}</Link>

      <div
        ref={workRef}
        className={`rw-dnav-mega-wrap${open === 'work' ? ' is-open' : ''}`}
        onMouseEnter={() => enter('work')}
        onMouseLeave={leave}
        onBlur={(e) => blurUnlessSibling(e, workRef)}
      >
        <button
          ref={workTriggerRef}
          type="button"
          className={`rw-dnav-link${servicesActive ? ' is-current' : ''}${open === 'work' || (servicesActive && !megaOpen) ? ' is-active' : ''}`}
          aria-expanded={open === 'work'}
          aria-controls="rw-mega"
          onClick={() => toggle('work')}
        >
          {t('nav.services')} <ChevronDown className="rw-dnav-caret" size={14} strokeWidth={1.75} aria-hidden="true" />
        </button>

        {open === 'work' && (
          <ServicesMegaPanel id="rw-mega" pathname={pathname} onClose={close} onBook={onBook} triggerRef={workTriggerRef} />
        )}
      </div>

      <Link to="/about" className={linkClass('/about')}>{t('nav.portfolio')}</Link>

      <div
        ref={learnRef}
        className={`rw-dnav-mega-wrap${open === 'learn' ? ' is-open' : ''}`}
        onMouseEnter={() => enter('learn')}
        onMouseLeave={leave}
        onBlur={(e) => blurUnlessSibling(e, learnRef)}
      >
        <button
          ref={learnTriggerRef}
          type="button"
          className={`rw-dnav-link${learnActive ? ' is-current' : ''}${open === 'learn' || (learnActive && !megaOpen) ? ' is-active' : ''}`}
          aria-expanded={open === 'learn'}
          aria-controls="rw-learn-mega"
          onClick={() => toggle('learn')}
        >
          {t('nav.learn')} <ChevronDown className="rw-dnav-caret" size={14} strokeWidth={1.75} aria-hidden="true" />
        </button>

        {open === 'learn' && (
          <MegaPanel id="rw-learn-mega" columns={LEARN_COLUMNS} pathname={pathname} onClose={close} triggerRef={learnTriggerRef} />
        )}
      </div>

      <Link to="/careers" className={linkClass('/careers')}>{t('nav.careers')}</Link>
      <Link to="/contact" className={linkClass('/contact')}>{t('nav.contact')}</Link>
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

/** Wordmark + menu button; nav lives in the wheel menu (SITE_NAV).
 *  Listing Log in / account sits where Book a call used to. */
export default function Header() {
  const { t } = useLang()
  const scrollToId = useSmoothScroll()
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
  const { pathname, search } = useLocation()
  const navigate = useNavigate()
  const goBookStrategy = () => {
    const target = formPathForRoute(pathname)
    if (target.includes('#')) {
      const [path, id] = target.split('#')
      if (!path || path === pathname) {
        scrollToId(id)
        return
      }
    }
    navigate(target, { state: { from: `${pathname}${search}` } })
  }

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
    if (item.book) goBookStrategy()
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
      <HiringBanner />
      <div
        className="rw-pad"
        style={{
          maxWidth: 1320, margin: '0 auto', padding: 'clamp(10px,1.4vw,15px) 40px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24,
        }}
      >
        <Link to="/" className="rw-header-brand" aria-label="Team Rajiv Williams home">
          <Wordmark />
          <span className="rw-brand-name">{t('brand.legalName')}</span>
        </Link>

        {/* Desktop/laptop only (CSS hides it below 1100px, where the wheel menu takes over). */}
        <DesktopNav pathname={pathname} onBook={goBookStrategy} />

        <div className="rw-header-tools" style={{ display: 'flex', alignItems: 'center', gap: 'clamp(12px,1.6vw,20px)' }}>
          <LangSwitch />
          {/* Whole-site text-size control (Small/default, Medium, Large). */}
          <FontSizeControl />

          <AccountMenu />

          {/* Tablet/phone: nav lives in the wheel menu behind this button. */}
          <button
            type="button"
            className="rw-menu-btn"
            onClick={() => setOpen((wasOpen) => !wasOpen)}
            aria-expanded={open}
            aria-label={open ? t('ui.closeMenu') : t('ui.openMenu')}
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
        <div className="rw-wheel-menu" role="dialog" aria-modal="true" aria-label={t('ui.nav')}>
          <button
            type="button"
            className="rw-wheel-close"
            onClick={() => setOpen(false)}
            aria-label={t('ui.closeMenu')}
          >
            <MenuIcon open />
          </button>

          <div className="rw-wheel-stage">
            <OptionWheel
              items={SITE_NAV.map((item) => t(item.key))}
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

          <p className="rw-wheel-hint" style={{ fontFamily: mono }}>{t('ui.wheelHint')}</p>
        </div>,
        document.getElementById('rw-app-shell') || document.body,
      )}
    </header>
  )
}
