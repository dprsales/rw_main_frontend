import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Footer from '../components/Footer'
import Header from '../components/Header'
import Seo from '../components/Seo'
import Reveal from '../components/Reveal'
import PageIntro from '../components/PageIntro'
import ClosingCTA from '../components/ClosingCTA'
import { BookButton } from '../components/BookingModal'
import partnerNetwork from '../assets/site/channel-partner-network.jpg'
import { useSmoothScroll } from '../hooks/useSmoothScroll'
import { submitChannelPartner, getErrorMessage } from '../data/api'
import { errorCategory, track } from '../data/analytics'
import { FOOTER_LINKS, mono, serif, text, WHATSAPP } from '../theme'
import { fs, container, ctaCopper, eyebrow, note, sectionHeading, sectionRule } from '../styles'
import { useLang } from '../i18n/LangProvider'
import '../form/form.css'

const PARTNER_INTEREST = 'Channel partner application'

const YEARS = ['0-2', '2-5', '5-10', '10+']
const CATEGORIES = ['Luxury apartments', 'Villas', 'Plots and lands', 'Mixed use']

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
  const { t } = useLang()
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
      setLocalError(t('partner.file.tooBig'))
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
          : <span className="rw-form-optional"> {t('sale.optional')}</span>}
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
            <small>{file.type || t('partner.file.doc')} · {(file.size / 1024).toFixed(1)} KB</small>
          </span>
          <button type="button" className="rw-file-remove" onClick={clear} aria-label={t('partner.file.remove', { name: file.name })}>×</button>
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
          <small>{t('partner.file.browse')}</small>
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
  const { t } = useLang()
  const scrollToId = useSmoothScroll()
  const headline = useMemo(() => [
    { text: t('partner.h1.a') },
    { br: true },
    { text: t('partner.h1.b'), italic: true, copper: true },
  ], [t])
  const value = useMemo(() => [0, 1, 2, 3].map((i) => ({
    n: String(i + 1).padStart(2, '0'),
    tag: t(`partner.v.${i}.tag`),
    title: t(`partner.v.${i}.title`),
    body: t(`partner.v.${i}.body`),
  })), [t])
  const { search } = useLocation()

  const [attribution] = useState(() => queryAttribution(search))
  const [values, setValues] = useState({})
  const [checks, setChecks] = useState({ projectCategories: [] })
  const [pills, setPills] = useState({})
  const [files, setFiles] = useState({})
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')
  const [termsAccepted, setTermsAccepted] = useState(false)
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
      setError(t('partner.err.years'))
      return
    }
    if (!pills.hasRera) {
      setError(t('partner.err.rera'))
      return
    }
    if (pills.hasRera === 'Yes' && !values.reraNo?.trim()) {
      setError(t('partner.err.reraNo'))
      return
    }
    if (!files.panCard) {
      setError(t('partner.err.pan'))
      return
    }
    if (!files.cancelledCheque) {
      setError(t('partner.err.cheque'))
      return
    }
    if (!termsAccepted) {
      setError(t('partner.err.terms'))
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
    fd.append('termsAccepted', 'true')

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
        eyebrow={t('partner.eyebrow')}
        headline={headline}
        headlineStyle={{ fontSize: fs('clamp(42px,4.4vw,64px)') }}
        lede={t('partner.lede')}
        intro={t('partner.intro')}
        image={partnerNetwork}
        imageAlt={t('partner.alt')}
        cta={<>
          <button type="button" onClick={() => scrollToId('apply')} className="rw-cta rw-cta--live" style={ctaCopper}>
            {t('partner.apply')} <span className="rw-cta-arrow" aria-hidden> →</span>
          </button>
          <BookButton to="/form" specular interest={PARTNER_INTEREST}>{t('partner.orCall')}</BookButton>
        </>}
      />

      {/* Why partner with us */}
      <section style={{ ...sectionRule, borderBottom: '1px solid var(--line)', background: 'var(--chip)' }}>
        <div className="rw-pad" style={{ ...container, padding: 'var(--rw-sy) 40px' }}>
          <Reveal style={{ ...eyebrow, marginBottom: 14 }}>{t('partner.why')}</Reveal>
          <Reveal as="h2" delay={80} style={{ ...sectionHeading, maxWidth: '14em' }}>
            {t('partner.whyTitle')}
          </Reveal>

          <div
            className="rw-grid-2"
            style={{
              display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 'clamp(16px, 2.2vw, 30px)', marginTop: 'clamp(40px,5vw,64px)',
            }}
          >
            {value.map((item, i) => (
              <Reveal key={item.n} delay={i * 90} style={{ border: '1px solid var(--line)', background: 'var(--card)', padding: 'clamp(26px,3.4vw,38px)' }}>
                <div style={{ fontFamily: mono, fontSize: fs('11px'), letterSpacing: '.14em', color: 'var(--ink)' }}>{item.tag}</div>
                <h3 className="rw-gold-text" style={{ marginTop: 16, fontFamily: serif, fontWeight: 700, fontSize: fs('clamp(21px,2.3vw,25px)'), lineHeight: 1.15 }}>
                  {item.title}
                </h3>
                <p style={{ ...note, marginTop: 12, fontSize: fs('16px'), lineHeight: 1.55 }}>{item.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Statement band */}
      <section style={{ ...sectionRule, background: 'var(--card)', position: 'relative', overflow: 'hidden' }}>
        <div className="rw-pad" style={{ ...container, padding: 'var(--rw-sy-sm) 40px', textAlign: 'center' }}>
          <Reveal as="p" className="rw-te-display" style={{ ...sectionHeading, fontSize: fs('clamp(26px,3.4vw,44px)'), lineHeight: 1.12, maxWidth: '20em', margin: '0 auto' }}>
            {t('partner.band.a')}
            <span className="rw-gold-text" style={{ fontStyle: 'italic' }}>{t('partner.band.b')}</span><br />
            {t('partner.band.c')}
          </Reveal>
        </div>
      </section>



      {/* Application */}
      <section id="apply" style={{ ...sectionRule, background: 'var(--chip)', borderBottom: '1px solid var(--line)' }}>
        <div className="rw-pad" style={{ maxWidth: 860, margin: '0 auto', padding: 'var(--rw-sy) 40px' }}>
          <Reveal style={{ ...eyebrow, letterSpacing: '.24em' }}>{t('partner.app.eyebrow')}</Reveal>
          <Reveal as="h2" delay={80} style={{ ...sectionHeading, marginTop: 16 }}>
            {t('partner.app.title')}
          </Reveal>
          <Reveal as="p" delay={140} style={{ ...note, marginTop: 14, fontSize: fs('clamp(16px,1.7vw,18px)'), maxWidth: '36em' }}>
            {t('partner.app.lede')}
          </Reveal>

          {status === 'done' ? (
            <Reveal delay={100} style={{ textAlign: 'center', paddingTop: 'clamp(44px,6vw,66px)' }}>
              <div className="rw-form-ring">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
                  <path d="M4 12.5 9.5 18 20 6.5" />
                </svg>
              </div>
              <h3 style={{ fontFamily: serif, fontWeight: 400, fontSize: fs('clamp(24px,3vw,32px)'), color: 'var(--ink)', marginTop: 26 }}>
                {t('partner.done.title')}
              </h3>
              <p style={{ ...note, marginTop: 14, marginLeft: 'auto', marginRight: 'auto', maxWidth: '30em' }}>
                {t('partner.done.body')}
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 20, flexWrap: 'wrap', marginTop: 32 }}>
                <a className="rw-cta" style={{ ...ctaCopper }} href={WHATSAPP} target="_blank" rel="noreferrer">
                  {t('partner.done.wa')}
                </a>
                <BookButton to="/form" specular interest={PARTNER_INTEREST}>{t('partner.done.call')}</BookButton>
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
                        {t(`partner.f.${field.id}`)}
                        {field.required
                          ? <span className="rw-form-req"> *</span>
                          : <span className="rw-form-optional"> {t('sale.optional')}</span>}
                      </span>
                      <input
                        className="rw-form-field"
                        type={field.type || 'text'}
                        style={{ marginTop: 10 }}
                        required={field.required}
                        placeholder={t(`partner.f.${field.id}.ph`)}
                        value={values[field.id] || ''}
                        onChange={set(field.id)}
                      />
                    </label>
                  ))}

                  <div className="rw-form-field-wrap">
                      <span className="rw-form-q-title">
                        {t('partner.years')}
                        <span className="rw-form-req"> *</span>
                      </span>
                      <div className="rw-form-controls rw-form-pills">
                        {YEARS.map((option) => {
                          const on = pills.yearsExperience === option
                          return (
                            <button
                              key={option}
                              type="button"
                              aria-pressed={on}
                              className={`rw-form-pill${on ? ' is-on' : ''}`}
                              onClick={() => setPill('yearsExperience', option)}
                            >
                              {option}
                            </button>
                          )
                        })}
                      </div>
                    </div>

                  {/* RERA registration — a No does not block the application, but the
                      applicant is told upfront that Telangana law requires registration
                      before they can operate. A Yes reveals the number field. */}
                  <div className="rw-form-field-wrap rw-form-field-wrap--wide">
                    <span className="rw-form-q-title">
                      {t('partner.rera')}
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
                            {option === 'Yes' ? t('partner.yes') : t('partner.no')}
                          </button>
                        )
                      })}
                    </div>
                    {pills.hasRera === 'Yes' && (
                      <input
                        className="rw-form-field"
                        type="text"
                        style={{ marginTop: 12 }}
                        placeholder={t('partner.reraPh')}
                        value={values.reraNo || ''}
                        onChange={set('reraNo')}
                      />
                    )}
                    {pills.hasRera === 'No' && (
                      <span className="rw-form-help" style={{ marginTop: 12, color: 'var(--ink)', fontSize: fs('13px'), lineHeight: 1.55, letterSpacing: '.02em' }}>
                        {t('partner.reraNo')}
                      </span>
                    )}
                  </div>

                  <div className="rw-form-field-wrap rw-form-field-wrap--wide">
                      <span className="rw-form-q-title">{t('partner.cats')} <span className="rw-form-optional"> {t('sale.optional')}</span></span>
                      <div className="rw-form-controls rw-form-checks">
                        {CATEGORIES.map((option, i) => {
                          const on = checks.projectCategories.includes(option)
                          return (
                            <label key={option} className={`rw-form-check${on ? ' is-on' : ''}`}>
                              <input type="checkbox" checked={on} onChange={() => toggleCheck('projectCategories', option)} />
                              {t(`partner.cat.${i}`)}
                            </label>
                          )
                        })}
                      </div>
                    </div>

                  {FILE_FIELDS.map((field) => (
                    <FileDropzone
                      key={field.id}
                      title={t(field.id === 'panCard' ? 'partner.file.pan' : 'partner.file.cheque')}
                      hint={t(field.id === 'panCard' ? 'partner.file.panHint' : 'partner.file.chequeHint')}
                      required={field.required}
                      accept={FILE_TYPES}
                      maxBytes={FILE_MAX_BYTES}
                      file={files[field.id]}
                      onSelect={(file) => setFile(field.id, file)}
                    />
                  ))}
                </div>

                <div className="rw-consent" style={{ marginTop: 24 }}>
                  <span className="rw-consent-title">{t('partner.terms.title')} <span className="rw-form-req">*</span></span>
                  <label className="rw-career-consent">
                    <input
                      id="partnerTerms"
                      type="checkbox"
                      aria-required="true"
                      checked={termsAccepted}
                      onChange={(e) => {
                        setTermsAccepted(e.target.checked)
                        if (e.target.checked) setError('')
                      }}
                    />
                    <span>
                      {t('partner.terms.before')}{' '}
                      <Link to="/partner/terms" target="_blank" rel="noreferrer">{t('partner.terms.link')}</Link>
                      {' '}{t('partner.terms.mid')}{' '}
                      <Link to="/privacy-policy" target="_blank" rel="noreferrer">{t('partner.terms.privacy')}</Link>
                      {t('partner.terms.after')}
                    </span>
                  </label>
                </div>

                {error && (
                  <p role="alert" style={{ fontFamily: text, fontWeight: 300, fontSize: fs('14px'), color: 'var(--copper)', margin: 0 }}>{error}</p>
                )}

                <div className="rw-form-submit-bar">
                  <span className="rw-form-left">{t('partner.note')}</span>
                  <button
                    type="submit"
                    className="rw-form-submit rw-cta rw-cta--live"
                    disabled={status === 'sending'}
                  >
                    {status === 'sending' ? t('sale.submitting') : t('apply.submit')} <span className="rw-cta-arrow" aria-hidden>→</span>
                  </button>
                </div>
              </form>
            </Reveal>
          )}
        </div>
      </section>

      <ClosingCTA id="join" title={t('partner.close')}>
        <button type="button" onClick={() => scrollToId('apply')} className="rw-cta rw-cta--live" style={{ ...ctaCopper, background: 'var(--ink)', color: 'var(--bg)' }}>
          {t('partner.apply')} <span className="rw-cta-arrow" aria-hidden> →</span>
        </button>
      </ClosingCTA>

      <Footer links={FOOTER_LINKS} />
    </>
  )
}
