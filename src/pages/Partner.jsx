import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import Footer from '../components/Footer'
import Header from '../components/Header'
import Seo from '../components/Seo'
import Reveal from '../components/Reveal'
import PageIntro from '../components/PageIntro'
import ClosingCTA from '../components/ClosingCTA'
import { BookButton } from '../components/BookingModal'
import saplingImage from '../assets/site/channel-partner-sapling-transparent.png'
import { useSmoothScroll } from '../hooks/useSmoothScroll'
import { submitChannelPartner, getErrorMessage } from '../data/api'
import { errorCategory, track } from '../data/analytics'
import { FOOTER_LINKS, mono, serif, text, WHATSAPP } from '../theme'
import { container, ctaCopper, eyebrow, note, sectionHeading, sectionRule } from '../styles'
import '../form/form.css'

const PARTNER_INTEREST = 'Channel partner application'

const HEADLINE = [
  { text: 'Sell luxury inventory ' },
  { br: true },
  { text: 'with the people who move it.', italic: true, copper: true },
]

const VALUE = [
  {
    n: '01',
    tag: 'ACCESS',
    title: 'Exclusive mandates, not open-market.',
    body: 'A small roster of projects owned end to end. Mandate inventory is not pitched by every broker in the city, so your buyers are chasing a property only you can sell.',
  },
  {
    n: '02',
    tag: 'TRUST',
    title: 'Golden-rate commissions, published before you sign.',
    body: 'The structure is on the table from day one, the deal log is shared every month, and payments clear on schedule. No surprises at settlement.',
  },
  {
    n: '03',
    tag: 'GROWTH',
    title: 'Training, warm leads and Volume.',
    body: 'In-house sales training before the first site visit, leads kept warm by our funnel, and more inventory offered as your numbers come in.',
  },
]

const STEPS = [
  { n: '1', title: 'Apply', body: 'The form below takes about two minutes. References matter more than a big deck.' },
  { n: '2', title: 'Qualify', body: 'A call with the team and a short reference check, usually within the week.' },
  { n: '3', title: 'Mandate in', body: 'Access to live inventory, sales training, and the deal room.' },
]

// Trimmed to what's needed to identify and route an applicant before the Step 2 call —
// designation, operating cities, expected business, preferred inventory, social links,
// team size and buyer segments all move to that live conversation instead, where they
// get a real answer rather than a guessed one. "How did you hear about us" is cut
// outright: queryAttribution() below already captures UTM source/medium from the URL,
// so asking the applicant to retype it was pure duplication. RERA is asked here (not
// deferred) because it gates eligibility under Telangana law.
const PILL_FIELDS = [
  { title: 'Years in real estate', id: 'yearsExperience', required: true, options: ['0-2', '2-5', '5-10', '10+'] },
]

const CHECK_GROUPS = [
  { title: 'Which categories do you sell?', id: 'projectCategories', required: true, options: ['Luxury apartments', 'Villas', 'Plots and lands', 'Mixed use'] },
]

const FILE_MAX_BYTES = 5 * 1024 * 1024
const FILE_TYPES = '.pdf,.jpg,.jpeg,.png'

// Compliance documents required for RERA/payout verification — the same reason
// RERA registration itself is asked upfront rather than deferred to the call.
const FILE_FIELDS = [
  { title: 'Upload your PAN card', id: 'panCard', required: true, hint: 'Drag and drop your PAN card here' },
  { title: 'Upload cancelled cheque', id: 'cancelledCheque', required: true, hint: 'Drag and drop your cancelled cheque here' },
]

/* Resume-style dropzone: a real drop target (not a single-line file input) with a
   drag/drop state, an image/document preview after selection, a remove button, and
   the accepted formats spelled out so applicants aren't guessing about file types. */
function FileDropzone({ title, hint, required, accept, maxBytes, file, onSelect }) {
  const [dragOver, setDragOver] = useState(false)
  const [previewUrl, setPreviewUrl] = useState('')
  const [localError, setLocalError] = useState('')

  // Image types get a live thumbnail; PDFs fall back to the document icon. The object
  // URL is revoked on replace/unmount so memory doesn't leak while re-selecting files.
  useEffect(() => {
    if (!file || !file.type.startsWith('image/')) { setPreviewUrl(''); return }
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [file])

  const acceptFile = (candidate) => {
    if (!candidate) return
    if (candidate.size > maxBytes) {
      setLocalError('That file is over 5MB. Please attach a smaller one.')
      return
    }
    setLocalError('')
    onSelect(candidate)
  }

  const handleChange = (e) => {
    acceptFile(e.target.files?.[0])
    e.target.value = ''
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    acceptFile(e.dataTransfer.files?.[0])
  }

  const clear = (e) => {
    e.preventDefault()
    e.stopPropagation()
    onSelect(null)
  }

  return (
    // Not --wide: PAN card and cancelled cheque share one row of the panel's
    // two-column grid, which already collapses to a single column below 900px.
    <div className="rw-form-field-wrap">
      <span className="rw-form-q-title">
        {title}
        {required
          ? <span className="rw-form-req"> *</span>
          : <span className="rw-form-optional"> (optional)</span>}
      </span>

      {file ? (
        <div className="rw-file-preview" style={{ marginTop: 10 }}>
          {previewUrl
            ? <img className="rw-file-preview-image" src={previewUrl} alt={file.name} />
            : (
              <span className="rw-file-preview-icon" aria-hidden>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6Z" />
                  <path d="M14 2v6h6" />
                </svg>
              </span>
            )}
          <span className="rw-file-preview-meta">
            <strong>{file.name}</strong>
            <small>{file.type || 'Document'} · {(file.size / 1024).toFixed(1)} KB</small>
          </span>
          <button type="button" className="rw-file-remove" onClick={clear} aria-label={`Remove ${file.name}`}>×</button>
        </div>
      ) : (
        <label
          className={`rw-resume-dropzone${dragOver ? ' rw-resume-dropzone--over' : ''}`}
          style={{ marginTop: 10 }}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
            <path d="M12 16V4m0 0L7.5 8.5M12 4l4.5 4.5" />
            <path d="M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3" />
          </svg>
          <span>{hint}</span>
          <small>or click to browse · {accept === '.pdf,.jpg,.jpeg,.png' ? 'PDF, JPG or PNG' : accept.split(',').join(', ').replace(/\./g, '').toUpperCase()} (Max {Math.round(maxBytes / 1024 / 1024)}MB)</small>
          {/* No `required` here: this input is CSS-hidden (.rw-resume-dropzone input
              { display:none }), and a hidden control failing native constraint
              validation blocks submission with no visible browser tooltip to explain
              why. handleSubmit already checks both files are present before sending. */}
          <input type="file" accept={accept} onChange={handleChange} />
        </label>
      )}

      {localError && (
        <span className="rw-form-help" style={{ marginTop: 8, color: 'var(--copper)' }}>{localError}</span>
      )}
    </div>
  )
}

const INPUT_FIELDS = [
  { title: 'Full name', id: 'name', required: true, placeholder: 'Your name' },
  { title: 'Phone', id: 'phone', required: true, type: 'tel', placeholder: '+91 ·····' },
  { title: 'Email', id: 'email', required: true, type: 'email', placeholder: 'you@agency.com' },
  { title: 'Agency / Company Name', id: 'agencyName', required: true, placeholder: 'The firm you work under' },
  { title: 'Base city', id: 'city', required: true, placeholder: 'Hyderabad' },
]

function queryAttribution(search) {
  const q = new URLSearchParams(search)
  const pick = (key) => q.get(key) || ''
  return {
    utmSource: pick('utm_source'),
    utmMedium: pick('utm_medium'),
    utmCampaign: pick('utm_campaign'),
    utmTerm: pick('utm_term'),
    utmContent: pick('utm_content'),
    clickId: pick('fbclid') || pick('gclid'),
  }
}

export default function Partner() {
  const scrollToId = useSmoothScroll()
  const { search } = useLocation()

  const [attribution] = useState(() => queryAttribution(search))
  const [values, setValues] = useState({})
  const [checks, setChecks] = useState({ projectCategories: [] })
  const [pills, setPills] = useState({})
  const [files, setFiles] = useState({})
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')
  const honeypot = useRef('')

  const set = (id) => (e) => setValues((prev) => ({ ...prev, [id]: e.target.value }))

  const setFile = (id, file) => setFiles((prev) => ({ ...prev, [id]: file || undefined }))

  const toggleCheck = (id, option) => setChecks((prev) => ({
    ...prev,
    [id]: prev[id].includes(option) ? prev[id].filter((v) => v !== option) : [...prev[id], option],
  }))

  const setPill = (id, option) => setPills((prev) => ({ ...prev, [id]: prev[id] === option ? '' : option }))

  // Bounded, non-personal properties only (handoff §10.4). UTM values are length-limited.
  const clip = (v) => (v ? String(v).slice(0, 64) : undefined)
  const partnerAnalytics = () => ({
    applicationType: 'channel_partner',
    source: 'partner_page',
    utmSource: clip(attribution.utmSource),
    utmMedium: clip(attribution.utmMedium),
    utmCampaign: clip(attribution.utmCampaign),
    hasRera: pills.hasRera || undefined,
    projectCategoryCount: checks.projectCategories.length,
  })

  async function handleSubmit(e) {
    e.preventDefault()
    if (honeypot.current.value) {
      setStatus('done')
      return
    }
    if (!pills.yearsExperience) {
      setError('Please choose your years of experience.')
      return
    }
    if (!pills.hasRera) {
      setError('Please tell us whether you are RERA registered.')
      return
    }
    if (pills.hasRera === 'Yes' && !values.reraNo?.trim()) {
      setError('Please enter your RERA registration number.')
      return
    }
    if (!files.panCard) {
      setError('Please upload your PAN card.')
      return
    }
    if (!files.cancelledCheque) {
      setError('Please upload a cancelled cheque.')
      return
    }
    setError('')
    setStatus('sending')

    const payload = {
      ...values,
      ...pills,
      // A "No" answer means there is no number to store; never carry a stale one.
      reraNo: pills.hasRera === 'Yes' ? values.reraNo?.trim() : '',
      projectCategories: checks.projectCategories,
      ...attribution,
      referrer: document.referrer || '',
      submittedAt: new Date().toISOString(),
    }

    // Multipart from here down — the two documents ride alongside the same fields
    // that used to go as plain JSON. Arrays have no native multipart representation,
    // so projectCategories goes as a JSON string; the backend parses it back out.
    const fd = new FormData()
    Object.entries(payload).forEach(([key, val]) => {
      if (val === undefined || val === null) return
      fd.append(key, Array.isArray(val) ? JSON.stringify(val) : val)
    })
    fd.append('panCard', files.panCard)
    fd.append('cancelledCheque', files.cancelledCheque)

    try {
      await submitChannelPartner(fd)
      setStatus('done')
      // Safe whitelist only — the application itself (contact, RERA, documents, notes) never goes to analytics.
      track('application_submitted', partnerAnalytics())
    } catch (err) {
      setError(getErrorMessage(err))
      setStatus('idle')
      track('application_submission_failed', { ...partnerAnalytics(), errorCategory: errorCategory(err) })
    }
  }

  /* Attribution still arrives reliably when the route lands from a fresh page load. */
  useEffect(() => {
    track('partner_page_view', { utmSource: attribution.utmSource })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <Seo route="/partner" />
      <Header />

      {/* Intro */}
      <PageIntro
        eyebrow="RW REALTY · CHANNEL PARTNERS"
        headline={HEADLINE}
        headlineStyle={{ fontSize: 'clamp(42px,4.4vw,64px)' }}
        lede="Exclusive mandates, golden-rate commissions, and a team that runs the funnel with you."
        intro="RW Realty carries a small number of projects at a time, on exclusive mandates. Partners inside those mandates get inventory worth carrying, leads we keep warm, and the training to close at the ticket size."
        image={saplingImage}
        imageAlt="RW Realty partnership tree: trust, strong relationships, open communication, mutual respect, shared vision, consistent support and long-term growth."
        cta={<>
          <button type="button" onClick={() => scrollToId('apply')} className="rw-cta rw-cta--live" style={ctaCopper}>
            APPLY TO BECOME A CHANNEL PARTNER <span className="rw-cta-arrow" aria-hidden> →</span>
          </button>
          <BookButton specular interest={PARTNER_INTEREST}>OR BOOK A CALL FIRST</BookButton>
        </>}
      />

      {/* Why partner with us */}
      <section style={{ ...sectionRule, borderBottom: '1px solid var(--line)', background: 'var(--chip)' }}>
        <div className="rw-pad" style={{ ...container, padding: 'clamp(80px,10vw,110px) 40px' }}>
          <Reveal style={{ ...eyebrow, marginBottom: 14 }}>WHY PARTNER WITH US</Reveal>
          <Reveal as="h2" delay={80} style={{ ...sectionHeading, maxWidth: '14em' }}>
            A few mandates, run properly.
          </Reveal>

          <div
            className="rw-grid-3"
            style={{
              display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 'clamp(16px, 2.2vw, 30px)', marginTop: 'clamp(40px,5vw,64px)',
            }}
          >
            {VALUE.map((item, i) => (
              <Reveal key={item.n} delay={i * 90} style={{ border: '1px solid var(--line)', background: 'var(--card)', padding: 'clamp(26px,3.4vw,38px)' }}>
                <div style={{ fontFamily: mono, fontSize: 11, letterSpacing: '.14em', color: 'var(--copper)' }}>{item.tag}</div>
                <h3 style={{ marginTop: 16, fontFamily: serif, fontWeight: 400, fontSize: 'clamp(21px,2.3vw,25px)', lineHeight: 1.15, color: 'var(--ink)' }}>
                  {item.title}
                </h3>
                <p style={{ ...note, marginTop: 12, fontSize: 16, lineHeight: 1.55 }}>{item.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Statement band */}
      <section style={{ ...sectionRule, background: 'var(--card)', position: 'relative', overflow: 'hidden' }}>
        <div className="rw-pad" style={{ ...container, padding: 'clamp(64px,8vw,96px) 40px', textAlign: 'center' }}>
          <Reveal as="p" style={{ ...sectionHeading, fontSize: 'clamp(26px,3.4vw,44px)', lineHeight: 1.12, maxWidth: '20em', margin: '0 auto' }}>
            Serious inventory. Serious commissions.{' '}
            <span style={{ fontStyle: 'italic', color: 'var(--copper)' }}>A partner who keeps score openly.</span>
          </Reveal>
        </div>
      </section>

      {/* How it works */}
      <section className="rw-pad" style={{ ...container, ...sectionRule, padding: 'clamp(80px,10vw,110px) 40px' }}>
        <Reveal style={{ ...eyebrow, marginBottom: 16 }}>HOW IT WORKS</Reveal>
        <Reveal as="h2" delay={80} style={{ ...sectionHeading, maxWidth: '14em' }}>
          Three steps, about two weeks.
        </Reveal>

        <div className="rw-grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'clamp(28px,4vw,56px)', marginTop: 'clamp(44px,6vw,64px)' }}>
          {STEPS.map((step, i) => (
            <Reveal key={step.n} delay={i * 90}>
              <div style={{ fontFamily: mono, fontSize: 13, letterSpacing: '.08em', color: 'var(--copper)', borderBottom: '1px solid var(--line)', paddingBottom: 14 }}>STEP {step.n}</div>
              {/* Sans, not the display serif: Cormorant Garamond's capital Q carries a long
                  decorative swash that reads as italic/cursive next to "Apply"/"Mandate in" —
                  the webfont has no alternate glyph (tested via font-feature-settings, no effect). */}
              <div style={{ marginTop: 20, fontFamily: text, fontWeight: 500, fontSize: 'clamp(19px,2.1vw,23px)', color: 'var(--ink)' }}>{step.title}</div>
              <p style={{ ...note, marginTop: 8, fontSize: 16, lineHeight: 1.55 }}>{step.body}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Application */}
      <section id="apply" style={{ ...sectionRule, background: 'var(--chip)', borderBottom: '1px solid var(--line)' }}>
        <div className="rw-pad" style={{ maxWidth: 860, margin: '0 auto', padding: 'clamp(80px,10vw,110px) 40px' }}>
          <Reveal style={{ ...eyebrow, letterSpacing: '.24em' }}>APPLICATION</Reveal>
          <Reveal as="h2" delay={80} style={{ ...sectionHeading, marginTop: 16 }}>
            Apply to become a channel partner.
          </Reveal>
          <Reveal as="p" delay={140} style={{ ...note, marginTop: 14, fontSize: 'clamp(16px,1.7vw,18px)', maxWidth: '36em' }}>
            Ten minutes, references over a big deck. Everything you share stays between us.
          </Reveal>

          {status === 'done' ? (
            <Reveal delay={100} style={{ textAlign: 'center', paddingTop: 'clamp(44px,6vw,66px)' }}>
              <div className="rw-form-ring">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
                  <path d="M4 12.5 9.5 18 20 6.5" />
                </svg>
              </div>
              <h3 style={{ fontFamily: serif, fontWeight: 400, fontSize: 'clamp(24px,3vw,32px)', color: 'var(--ink)', marginTop: 26 }}>
                Application received.
              </h3>
              <p style={{ ...note, marginTop: 14, marginLeft: 'auto', marginRight: 'auto', maxWidth: '30em' }}>
                It's under review. We respond within two hours, usually we reply faster and if you would rather talk first, call or WhatsApp us below.
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 20, flexWrap: 'wrap', marginTop: 32 }}>
                <a className="rw-cta" style={{ ...ctaCopper }} href={WHATSAPP} target="_blank" rel="noreferrer">
                  WHATSAPP THE TEAM
                </a>
                <BookButton specular interest={PARTNER_INTEREST}>BOOK A CALL</BookButton>
              </div>
            </Reveal>
          ) : (
            <Reveal delay={160}>
              <form onSubmit={handleSubmit} style={{ marginTop: 'clamp(34px,5vw,50px)' }}>
                {/* Honeypot - humans never see this field. */}
                <input
                  ref={honeypot}
                  type="text"
                  name="website_hp"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px' }}
                />

                {/* One connected panel: fields are separated by hairlines, not boxes.
                    --compact: tighter padding, since 8 fields left generous room to breathe
                    as visibly empty space rather than intentional layout. */}
                <div className="rw-form-panel rw-form-panel--compact">
                  {INPUT_FIELDS.map((field) => (
                    <label key={field.id} className="rw-form-field-wrap" style={{ display: 'block' }}>
                      <span className="rw-form-q-title">
                        {field.title}
                        {field.required
                          ? <span className="rw-form-req"> *</span>
                          : <span className="rw-form-optional"> (optional)</span>}
                      </span>
                      <input
                        className="rw-form-field"
                        type={field.type || 'text'}
                        style={{ marginTop: 10 }}
                        required={field.required}
                        placeholder={field.placeholder}
                        value={values[field.id] || ''}
                        onChange={set(field.id)}
                      />
                    </label>
                  ))}

                  {PILL_FIELDS.map((field) => (
                    <div key={field.id} className="rw-form-field-wrap">
                      <span className="rw-form-q-title">
                        {field.title}
                        {field.required
                          ? <span className="rw-form-req"> *</span>
                          : <span className="rw-form-optional"> (optional)</span>}
                      </span>
                      {field.help && <span className="rw-form-help">{field.help}</span>}
                      <div className="rw-form-controls rw-form-pills">
                        {field.options.map((option) => {
                          const on = pills[field.id] === option
                          return (
                            <button
                              key={option}
                              type="button"
                              aria-pressed={on}
                              className={`rw-form-pill${on ? ' is-on' : ''}`}
                              onClick={() => setPill(field.id, option)}
                            >
                              {option}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  ))}

                  {/* RERA registration — a No does not block the application, but the
                      applicant is told upfront that Telangana law requires registration
                      before they can operate. A Yes reveals the number field. */}
                  <div className="rw-form-field-wrap rw-form-field-wrap--wide">
                    <span className="rw-form-q-title">
                      Are you RERA registered?
                      <span className="rw-form-req"> *</span>
                    </span>
                    <div className="rw-form-controls rw-form-pills">
                      {['Yes', 'No'].map((option) => {
                        const on = pills.hasRera === option
                        return (
                          <button
                            key={option}
                            type="button"
                            aria-pressed={on}
                            className={`rw-form-pill${on ? ' is-on' : ''}`}
                            onClick={() => setPill('hasRera', option)}
                          >
                            {option}
                          </button>
                        )
                      })}
                    </div>
                    {pills.hasRera === 'Yes' && (
                      <input
                        className="rw-form-field"
                        type="text"
                        style={{ marginTop: 12 }}
                        placeholder="Your RERA registration number"
                        value={values.reraNo || ''}
                        onChange={set('reraNo')}
                      />
                    )}
                    {pills.hasRera === 'No' && (
                      <span className="rw-form-help" style={{ marginTop: 12, color: 'var(--ink)', fontSize: 13, lineHeight: 1.55, letterSpacing: '.02em' }}>
                        As per TG RERA, it is mandatory for every agent, channel partner, broker to have a RERA number, we recommend you encourage you to file for a RERA number ASAP to avoid future inconvenience.
                      </span>
                    )}
                  </div>

                  {CHECK_GROUPS.map((group) => (
                    <div key={group.id} className="rw-form-field-wrap rw-form-field-wrap--wide">
                      <span className="rw-form-q-title">{group.title} <span className="rw-form-optional"> (optional)</span></span>
                      <div className="rw-form-controls rw-form-checks">
                        {group.options.map((option) => {
                          const on = checks[group.id].includes(option)
                          return (
                            <label key={option} className={`rw-form-check${on ? ' is-on' : ''}`}>
                              <input type="checkbox" checked={on} onChange={() => toggleCheck(group.id, option)} />
                              {option}
                            </label>
                          )
                        })}
                      </div>
                    </div>
                  ))}

                  {FILE_FIELDS.map((field) => (
                    <FileDropzone
                      key={field.id}
                      title={field.title}
                      hint={field.hint}
                      required={field.required}
                      accept={FILE_TYPES}
                      maxBytes={FILE_MAX_BYTES}
                      file={files[field.id]}
                      onSelect={(file) => setFile(field.id, file)}
                    />
                  ))}
                </div>

                {error && (
                  <p style={{ fontFamily: text, fontWeight: 300, fontSize: 14, color: 'var(--copper)', margin: 0 }}>{error}</p>
                )}

                <div className="rw-form-submit-bar">
                  <span className="rw-form-left">One application, no obligation to proceed.</span>
                  <button
                    type="submit"
                    className="rw-form-submit rw-cta rw-cta--live"
                    disabled={status === 'sending'}
                  >
                    {status === 'sending' ? 'SENDING…' : 'SUBMIT APPLICATION'} <span className="rw-cta-arrow" aria-hidden>→</span>
                  </button>
                </div>
              </form>
            </Reveal>
          )}
        </div>
      </section>

      <ClosingCTA id="join" title="Put your buyer network in front of Hyderabad’s premium inventory.">
        <button type="button" onClick={() => scrollToId('apply')} className="rw-cta rw-cta--live" style={{ ...ctaCopper, background: 'var(--ink)', color: 'var(--bg)' }}>
          APPLY TO BECOME A CHANNEL PARTNER <span className="rw-cta-arrow" aria-hidden> →</span>
        </button>
      </ClosingCTA>

      <Footer links={FOOTER_LINKS} />
    </>
  )
}
