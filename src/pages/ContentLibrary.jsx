import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Download, Search, X } from 'lucide-react'
import Footer from '../components/Footer'
import Header from '../components/Header'
import PageIntro from '../components/PageIntro'
import Reveal from '../components/Reveal'
import Seo from '../components/Seo'
import { useLang } from '../i18n/LangProvider'
import {
  CAROUSEL_MONTHS,
  CAROUSELS,
  carouselCoverUrl,
  carouselDownloadUrl,
} from '../data/carousels'
import { isValidPhone, submitBooking } from '../data/booking'
import { getErrorMessage } from '../data/api'
import { FOOTER_LINKS, mono } from '../theme'
import { container, fs, note } from '../styles'

const GATE_KEY = 'rw-cl-download-gate'
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function readGate() {
  try {
    const raw = sessionStorage.getItem(GATE_KEY)
    if (!raw) return null
    const data = JSON.parse(raw)
    if (!data?.name || !data?.email || !data?.phone) return null
    return data
  } catch {
    return null
  }
}

function writeGate(data) {
  try {
    sessionStorage.setItem(GATE_KEY, JSON.stringify(data))
  } catch {
    /* private mode / quota — unlock still works in memory for this visit */
  }
}

function startDownload(item) {
  const href = carouselDownloadUrl(item)
  const frame = document.createElement('iframe')
  frame.style.display = 'none'
  frame.setAttribute('aria-hidden', 'true')
  frame.src = href
  document.body.appendChild(frame)
  window.setTimeout(() => frame.remove(), 60_000)
}

/** Save who + which carousel for nurture (fire-and-forget after unlock). */
function recordContentDownload(person, item, website = '') {
  return submitBooking({
    name: person.name,
    email: person.email,
    phone: person.phone,
    interest: 'Content Library',
    source: 'content_library',
    intent: 'nurture',
    message: `Content Library download: ${item.title}\nFile: ${item.name}\nDate: ${item.date}`,
    contentDownload: {
      title: item.title,
      fileId: item.id,
      fileName: item.name,
      date: item.date,
    },
    website,
  })
}

function CarouselCard({ item, t, onDownload }) {
  return (
    <article className="rw-cl-card">
      <div className="rw-cl-thumb">
        <img
          src={carouselCoverUrl(item)}
          alt=""
          loading="lazy"
          decoding="async"
        />
        <span className="rw-cl-date">{item.date}</span>
      </div>

      <div className="rw-cl-body">
        <h3 className="rw-cl-title">{item.title}</h3>
        <p className="rw-cl-meta">
          <span>{item.sizeLabel}</span>
          <span aria-hidden="true">·</span>
          <span>{item.slideCount ? `${item.slideCount} slides` : 'ZIP'}</span>
        </p>
        <div className="rw-cl-actions">
          <button type="button" className="rw-cl-btn is-dl" onClick={() => onDownload(item)}>
            <Download size={14} strokeWidth={1.8} aria-hidden="true" />
            {t('cl.download')}
          </button>
        </div>
      </div>
    </article>
  )
}

function DownloadGateModal({ item, t, initial, onClose, onUnlocked }) {
  const [name, setName] = useState(initial?.name || '')
  const [email, setEmail] = useState(initial?.email || '')
  const [phone, setPhone] = useState(initial?.phone || '')
  const [error, setError] = useState('')
  const [sending, setSending] = useState(false)
  const honeypot = useRef(null)
  const firstField = useRef(null)

  useEffect(() => {
    firstField.current?.focus()
    const onKey = (e) => { if (e.key === 'Escape' && !sending) onClose() }
    window.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [onClose, sending])

  async function submit(e) {
    e.preventDefault()
    if (sending) return
    const cleanName = name.trim()
    const cleanEmail = email.trim()
    const cleanPhone = phone.trim()
    if (cleanName.length < 2) {
      setError(t('cl.gate.errName'))
      return
    }
    if (!EMAIL_RE.test(cleanEmail)) {
      setError(t('cl.gate.errEmail'))
      return
    }
    if (!isValidPhone(cleanPhone)) {
      setError(t('cl.gate.errPhone'))
      return
    }
    setError('')
    setSending(true)
    try {
      const gate = { name: cleanName, email: cleanEmail, phone: cleanPhone }
      await recordContentDownload(gate, item, honeypot.current?.value || '')
      writeGate(gate)
      onUnlocked(gate, item)
    } catch (err) {
      setError(getErrorMessage(err))
      setSending(false)
    }
  }

  /* Theme tokens live on #rw-app-shell — portal there so gold/ink resolve. */
  const mount = typeof document !== 'undefined'
    ? (document.getElementById('rw-app-shell') || document.body)
    : null
  if (!mount) return null

  return createPortal(
    <div className="rw-cl-gate" role="presentation" onMouseDown={(e) => { if (e.target === e.currentTarget && !sending) onClose() }}>
      <div
        className="rw-cl-gate-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="rw-cl-gate-title"
      >
        <button type="button" className="rw-cl-gate-close" onClick={onClose} disabled={sending} aria-label={t('cta.close')}>
          <X size={18} strokeWidth={1.8} aria-hidden="true" />
        </button>

        <p className="rw-cl-gate-eyebrow" style={{ fontFamily: mono }}>{t('cl.gate.eyebrow')}</p>
        <h2 id="rw-cl-gate-title" className="rw-cl-gate-title">{t('cl.gate.title')}</h2>
        <p className="rw-cl-gate-lede">{t('cl.gate.lede')}</p>
        <p className="rw-cl-gate-file">{item.title}</p>

        <form className="rw-cl-gate-form" onSubmit={submit} noValidate>
          <label>
            <span>{t('field.name')}</span>
            <input
              ref={firstField}
              type="text"
              name="name"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('ph.fullName')}
              required
            />
          </label>
          <label>
            <span>{t('field.phone')}</span>
            <input
              type="tel"
              name="phone"
              autoComplete="tel"
              inputMode="numeric"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder={t('ph.phone')}
              required
            />
          </label>
          <label>
            <span>{t('field.email')}</span>
            <input
              type="email"
              name="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              required
            />
          </label>

          <input
            ref={honeypot}
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="rw-cl-gate-hp"
          />

          {error && <p className="rw-cl-gate-error" role="alert">{error}</p>}

          <p className="rw-cl-gate-note">{t('cl.gate.note')}</p>

          <button type="submit" className="rw-cl-btn is-dl rw-cl-gate-submit" disabled={sending}>
            <Download size={14} strokeWidth={1.8} aria-hidden="true" />
            {sending ? t('cta.sending') : t('cl.gate.submit')}
          </button>
        </form>
      </div>
    </div>,
    mount,
  )
}

export default function ContentLibrary() {
  const { t } = useLang()
  const [query, setQuery] = useState('')
  const [month, setMonth] = useState('all')
  const [gate, setGate] = useState(() => (typeof window !== 'undefined' ? readGate() : null))
  const [pending, setPending] = useState(null)

  const months = useMemo(() => {
    const present = new Set(CAROUSELS.map((c) => c.month))
    return CAROUSEL_MONTHS.filter((m) => present.has(m.id))
  }, [])

  const headline = useMemo(() => [
    { text: t('cl.h1.a') },
    { br: true },
    { text: t('cl.h1.b'), italic: true, copper: true },
  ], [t])

  const catalog = useMemo(() => {
    if (month === 'all') return CAROUSELS
    return CAROUSELS.filter((item) => item.month === month)
  }, [month])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return catalog
    return catalog.filter((item) => (
      item.title.toLowerCase().includes(q)
      || item.date.includes(q)
      || item.name.toLowerCase().includes(q)
      || item.slug?.toLowerCase().includes(q)
    ))
  }, [catalog, query])

  function requestDownload(item) {
    if (gate) {
      startDownload(item)
      recordContentDownload(gate, item).catch(() => {})
      return
    }
    setPending(item)
  }

  function handleUnlocked(nextGate, item) {
    setGate(nextGate)
    setPending(null)
    startDownload(item)
  }

  return (
    <>
      <Seo route="/content-library" />
      <Header />

      <PageIntro
        eyebrow={t('cl.eyebrow')}
        headline={headline}
        lede={t('cl.lede')}
        intro={t('cl.intro')}
      />

      <section className="rw-pad rw-cl-section" style={{ ...container, padding: '10px 40px var(--rw-sy-lg)' }}>
        <div className="rw-cl-toolbar">
          <div className="rw-cl-months" role="tablist" aria-label="Month">
            <button
              type="button"
              role="tab"
              aria-selected={month === 'all'}
              className={`rw-cl-month${month === 'all' ? ' is-on' : ''}`}
              onClick={() => setMonth('all')}
            >
              All
            </button>
            {months.map((m) => (
              <button
                key={m.id}
                type="button"
                role="tab"
                aria-selected={month === m.id}
                className={`rw-cl-month${month === m.id ? ' is-on' : ''}`}
                onClick={() => setMonth(m.id)}
              >
                {m.label}
              </button>
            ))}
          </div>

          <label className="rw-cl-search">
            <Search size={16} strokeWidth={1.7} aria-hidden="true" />
            <span className="sr-only">{t('cl.search')}</span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('cl.searchPh')}
              style={{ fontFamily: mono, fontSize: fs('13px') }}
            />
          </label>
        </div>

        <p className="rw-cl-showing" style={{ ...note, fontFamily: mono, fontSize: fs('12px'), letterSpacing: '.08em' }}>
          {t('cl.showing', { n: filtered.length, total: catalog.length })}
        </p>

        {filtered.length === 0 ? (
          <p style={{ ...note, fontFamily: mono, fontSize: fs('13px'), letterSpacing: '.08em', marginTop: 28 }}>
            {t('cl.empty')}
          </p>
        ) : (
          <Reveal delay={60}>
            <div className="rw-cl-grid">
              {filtered.map((item) => (
                <CarouselCard
                  key={item.id}
                  item={item}
                  t={t}
                  onDownload={requestDownload}
                />
              ))}
            </div>
          </Reveal>
        )}
      </section>

      <Footer links={FOOTER_LINKS} />

      {pending && (
        <DownloadGateModal
          item={pending}
          t={t}
          initial={gate}
          onClose={() => setPending(null)}
          onUnlocked={handleUnlocked}
        />
      )}
    </>
  )
}
