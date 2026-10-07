import { useEffect, useRef, useState } from 'react'
import Footer from '../components/Footer'
import Header from '../components/Header'
import Seo from '../components/Seo'
import BorderGlow from '../components/BorderGlow'
import Reveal from '../components/Reveal'
import PageIntro from '../components/PageIntro'
import { CenteredHead } from '../components/SectionHead'
import { useSmoothScroll } from '../hooks/useSmoothScroll'
import { TEMPLATE_PACKS, TEMPLATES } from '../data/templates'
import { isValidPhone, submitBooking } from '../data/booking'
import { getErrorMessage } from '../data/api'
import { FOOTER_LINKS, mono, serif } from '../theme'
import { fs, container, ctaInline, note, sectionRule } from '../styles'

const ALL = 'All'
const PER_PAGE = 6
const GLOW = {
  backgroundColor: 'var(--card)',
  glowColor: '41 82 71',
  colors: ['#C39B53', '#E8C97A', '#A67C3D'],
  borderRadius: 4,
  glowRadius: 24,
  fillOpacity: 0.22,
  animated: false,
}

const HEADLINE = [
  { text: 'The forms, written properly. ' },
  { br: true },
  { text: 'Free for the people who sell.', italic: true, copper: true },
]

function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

function isPhone(value) {
  const digits = value.replace(/\D/g, '')
  return digits.length === 10 || (digits.length === 12 && digits.startsWith('91'))
}

export default function Templates() {
  const scrollToId = useSmoothScroll()
  const [filter, setFilter] = useState(ALL)
  const [visibleCount, setVisibleCount] = useState(PER_PAGE)
  const [active, setActive] = useState(null)
  const [name, setName] = useState('')
  const [contact, setContact] = useState('')
  const [email, setEmail] = useState('')
  const [details, setDetails] = useState({})
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)
  const honeypot = useRef(null)

  useEffect(() => {
    document.body.classList.add('rw-templates-page')
    return () => document.body.classList.remove('rw-templates-page')
  }, [])

  const tabs = [ALL, ...TEMPLATE_PACKS]
  const forms = filter === ALL ? TEMPLATES : TEMPLATES.filter((item) => item.pack === filter)
  const visible = forms.slice(0, visibleCount)

  function openForm(item) {
    setActive(item)
    setName('')
    setContact('')
    setEmail('')
    setDetails({})
    setError('')
    setSent(false)
    setSending(false)
  }

  function closeForm() {
    setActive(null)
  }

  function submitGate(event) {
    event.preventDefault()
    if (sending) return
    if (name.trim().length < 2) {
      setError('Enter your name.')
      return
    }
    if (active?.fields) {
      submitSheet()
      return
    }
    if (!isEmail(contact.trim()) && !isPhone(contact.trim())) {
      setError('Enter a phone number or an email.')
      return
    }
    setError('')
    setSent(true)
  }

  async function submitSheet() {
    if (!isValidPhone(contact)) {
      setError('Enter a 10-digit phone number.')
      return
    }
    if (!isEmail(email.trim())) {
      setError('Enter an email.')
      return
    }
    const missing = (active.fields || []).find((field) => !String(details[field.name] || '').trim())
    if (missing) {
      setError(`Enter ${missing.label.toLowerCase()}.`)
      return
    }
    setError('')
    setSending(true)
    const lines = (active.fields || []).map((field) => `${field.label}: ${details[field.name].trim()}`)
    try {
      await submitBooking({
        name,
        email,
        phone: contact,
        interest: 'Template form',
        message: `${active.title}\n${lines.join('\n')}`,
        source: 'brokerage_form',
        website: honeypot.current?.value || '',
      })
      setSent(true)
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setSending(false)
    }
  }

  return (
    <>
      <Seo route="/templates" />
      <Header />

      <PageIntro
        eyebrow="TEMPLATES · HYDERABAD REALTY"
        headline={HEADLINE}
        lede="For channel partners, brokers, and advisory desks."
        intro="Lead intake, builder relations, inventory and mandates, deal closing, and compliance. Fill the sheet on this page."
        cta={
          <button type="button" onClick={() => scrollToId('forms')} className="rw-inline-cta" style={ctaInline}>
            See the forms →
          </button>
        }
      />

      <section id="forms" style={{ ...sectionRule, background: 'var(--chip)' }}>
        <div className="rw-pad" style={{ ...container, padding: 'var(--rw-sy-lg) 40px' }}>
          <CenteredHead
            eyebrow="THE FORMS"
            title="The deal, in order"
            intro="Each card is one sheet from that stage. Fill it here. Your name, phone, and email travel with the sheet."
          />

          <Reveal delay={80} style={{ marginTop: 38, display: 'flex', justifyContent: 'center' }}>
            <div className="rw-tabs rw-desktop-career-filters" role="tablist" aria-label="Filter forms by pack">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  role="tab"
                  aria-selected={filter === tab}
                  onClick={() => { setFilter(tab); setVisibleCount(PER_PAGE) }}
                  className={`rw-tab${filter === tab ? ' is-on' : ''}`}
                  style={{ fontFamily: mono, fontSize: fs('12px'), letterSpacing: '.12em', textTransform: 'uppercase' }}
                >
                  {tab}
                </button>
              ))}
            </div>
          </Reveal>

          <div className="rw-mobile-career-filters">
            <label>
              <span>PACK</span>
              <select value={filter} onChange={(event) => { setFilter(event.target.value); setVisibleCount(PER_PAGE) }}>
                {tabs.map((tab) => <option key={tab} value={tab}>{tab}</option>)}
              </select>
            </label>
          </div>

          <div className="rw-careers-grid" style={{ marginTop: 42 }}>
            {visible.map((item) => {
              const action = item.fields ? 'fill' : 'soon'
              const label = action === 'download' ? 'DOWNLOAD' : action === 'fill' ? 'FILL' : 'COMING SOON'
              return (
                <Reveal key={item.id} className="rw-role-card">
                  <BorderGlow {...GLOW} className="rw-role-card-glow">
                    <article className="rw-role-row">
                      <div className="rw-role-card-main">
                        <span className="rw-role-level">{item.pack}</span>
                        <div className="rw-role-title">{item.title}</div>
                      </div>
                      <div className="rw-role-summary">
                        <div className="rw-role-meta">
                          <span>{action === 'soon' ? 'Coming soon' : action === 'fill' ? 'Fill on this page' : 'Ready to request'}</span>
                          <span>Hyderabad</span>
                        </div>
                        <p>{item.description}</p>
                      </div>
                      <button
                        type="button"
                        className="rw-role-apply"
                        disabled={action === 'soon'}
                        onClick={() => action !== 'soon' && openForm(item)}
                        style={{ marginTop: 0, fontFamily: mono, border: action !== 'soon' ? 'none' : undefined, cursor: action !== 'soon' ? 'pointer' : 'default' }}
                      >
                        {label} <span aria-hidden>{action === 'soon' ? '' : '→'}</span>
                      </button>
                    </article>
                  </BorderGlow>
                </Reveal>
              )
            })}
          </div>

          {forms.length > visibleCount && (
            <div className="rw-load-more-wrap">
              <button type="button" className="rw-load-more" onClick={() => setVisibleCount((count) => count + PER_PAGE)}>
                <span>LOAD MORE</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                  <path d="M12 5v14M6 13l6 6 6-6" />
                </svg>
              </button>
              <span className="rw-load-more-count">Showing {visible.length} of {forms.length}</span>
            </div>
          )}
        </div>
      </section>

      <Footer links={FOOTER_LINKS} />

      {active && (
        <div
          role="presentation"
          onClick={closeForm}
          style={{ position: 'fixed', inset: 0, zIndex: 80, background: 'rgba(11,10,9,.72)', display: 'grid', placeItems: 'center', padding: 20 }}
        >
          <form
            onClick={(event) => event.stopPropagation()}
            onSubmit={submitGate}
            style={{ width: 'min(460px, 100%)', maxHeight: 'min(640px, calc(100vh - 40px))', overflow: 'auto', background: 'var(--card)', border: '1px solid var(--line)', padding: '28px 26px', color: 'var(--ink)' }}
          >
            <div style={{ fontFamily: mono, fontSize: fs('11px'), letterSpacing: '.14em', color: 'var(--copper)' }}>{active.pack}</div>
            <h2 style={{ fontFamily: serif, fontWeight: 400, fontSize: fs('32px'), lineHeight: 1.05, margin: '10px 0 8px' }}>{active.title}</h2>
            {sent ? (
              <p style={{ ...note, fontSize: fs('16px'), lineHeight: 1.55 }}>
                {active.fields
                  ? `Noted, ${name.trim()}. This ${active.title.toLowerCase()} is with the team.`
                  : `Noted, ${name.trim()}. This file is still being finished. When it is published, the download uses the phone or email you entered. It is not a public link.`}
              </p>
            ) : active.fields ? (
              <>
                <p style={{ ...note, fontSize: fs('15px'), lineHeight: 1.5, marginBottom: 18 }}>
                  Your name, phone, and email, then the sheet.
                </p>
                <input ref={honeypot} type="text" name="website_hp" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: 'absolute', left: '-9999px', width: 1, height: 1 }} />
                <Field label="Your name" value={name} onChange={setName} autoComplete="name" />
                <Field label="Phone" value={contact} onChange={setContact} autoComplete="tel" />
                <Field label="Email" value={email} onChange={setEmail} autoComplete="email" />
                {(active.fields || []).map((field) => (
                  <Field
                    key={field.name}
                    label={field.label}
                    value={details[field.name] || ''}
                    onChange={(value) => setDetails((current) => ({ ...current, [field.name]: value }))}
                  />
                ))}
                {error && <p style={{ ...note, color: '#d9826b', fontSize: fs('13px'), marginTop: 8 }}>{error}</p>}
              </>
            ) : (
              <>
                <p style={{ ...note, fontSize: fs('15px'), lineHeight: 1.5, marginBottom: 18 }}>
                  Name, and a phone or email. Then the file.
                </p>
                <Field label="Name" value={name} onChange={setName} autoComplete="name" />
                <Field label="Phone or email" value={contact} onChange={setContact} autoComplete="email" />
                {error && <p style={{ ...note, color: '#d9826b', fontSize: fs('13px'), marginTop: 8 }}>{error}</p>}
              </>
            )}
            <div style={{ display: 'flex', gap: 12, marginTop: 22, flexWrap: 'wrap' }}>
              {!sent && (
                <button type="submit" className="rw-role-apply" disabled={sending} style={{ fontFamily: mono, cursor: sending ? 'default' : 'pointer' }}>
                  {sending ? 'SENDING…' : active.fields ? 'SUBMIT →' : 'DOWNLOAD →'}
                </button>
              )}
              <button type="button" onClick={closeForm} className="rw-inline-cta" style={{ ...ctaInline, background: 'none', border: 0, cursor: 'pointer' }}>
                Close
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  )
}

function Field({ label, value, onChange, autoComplete }) {
  return (
    <label style={{ display: 'grid', gap: 6, marginBottom: 14 }}>
      <span style={{ fontFamily: mono, fontSize: fs('10px'), letterSpacing: '.14em', color: 'var(--faded)' }}>{label.toUpperCase()}</span>
      <input value={value} onChange={(event) => onChange(event.target.value)} autoComplete={autoComplete} style={fieldStyle} />
    </label>
  )
}

const fieldStyle = {
  background: 'transparent',
  border: '1px solid var(--line)',
  color: 'var(--ink)',
  fontFamily: "'Poppins', system-ui, sans-serif",
  fontSize: 15,
  padding: '12px 12px',
  width: '100%',
}
