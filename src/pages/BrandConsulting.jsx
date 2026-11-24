import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Footer from '../components/Footer'
import Header from '../components/Header'
import Seo from '../components/Seo'
import Reveal from '../components/Reveal'
import { getErrorMessage, submitBrandConsultingEnquiry } from '../data/api'
import { errorCategory, track } from '../data/analytics'
import { isValidPhone, toPhoneDigits } from '../data/booking'
import FormSelect from '../form/FormSelect'
import { FOOTER_LINKS, mono, serif, text } from '../theme'
import { ctaCopper, fs } from '../styles'
import '../form/form.css'
import './brand-consulting.css'

const INTEREST = 'Brand Consulting'

const ROLES = [
  'Developer / promoter',
  'Sales head',
  'Marketing head',
  'Brand / CRM lead',
  'Channel partner',
  'Other',
]

const BRAND_NEEDS = [
  'New brand from scratch',
  'Rebrand / refresh',
  'Project launch brand',
  'Site visit experience',
  'Sales story and messaging',
  'Not sure yet',
]

const HELP_AREAS = [
  'Logo and visual identity',
  'Brochure and sales collateral',
  'Site visit and approach experience',
  'Sales gallery / experience centre look',
  'Website and digital presence',
  'Channel partner kits',
  'Launch campaign story',
  'Other',
]

const PROJECT_STAGES = [
  'Planning / pre-launch',
  'Soft launch',
  'Active sales',
  'Ready to move',
  'Resale / inventory',
  'Other',
]

const TIMELINES = [
  'As soon as possible',
  'This month',
  '1 to 3 months',
  'Just exploring',
]

/** Each row: We have / We need buttons (Rajiv guidance). */
const BRAND_ASSETS = [
  { key: 'brandIdentity', no: '01', label: 'Brand identity' },
  { key: 'logos', no: '02', label: 'Logos' },
  { key: 'fontsColours', no: '03', label: 'Fonts & colours' },
  { key: 'socialMedia', no: '04', label: 'Social media' },
  { key: 'metaGoogleAds', no: '05', label: 'Meta & Google ads' },
  { key: 'videoMotion', no: '06', label: 'Video & motion' },
  { key: 'websiteAssets', no: '07', label: 'Website assets' },
  { key: 'marketingCollateral', no: '08', label: 'Marketing collateral' },
  { key: 'photography', no: '09', label: 'Photography' },
  { key: 'brandGuidelines', no: '10', label: 'Brand guidelines' },
  { key: 'siteVisit', no: '11', label: 'Site visit experience' },
  { key: 'gallery', no: '12', label: 'Sales gallery look' },
  { key: 'crm', no: '13', label: 'CRM / follow-up look' },
  { key: 'cpKits', no: '14', label: 'Channel partner kits' },
  { key: 'podcasts', no: '15', label: 'Podcasts' },
  { key: 'droneShoots', no: '16', label: 'Drone shoots' },
  { key: 'hoardingDesigns', no: '17', label: 'Hoarding designs' },
  { key: 'brochures', no: '18', label: 'Brochures' },
  { key: 'communicationStrategy', no: '19', label: 'Communication strategy' },
]

const CHALLENGES = [
  'Weak first impression on site visit',
  'Logo / identity feels outdated',
  'Brochure does not match the product',
  'Sales story is unclear',
  'Website does not convert',
  'Brand and sales feel disconnected',
  'Launch look is not premium enough',
  'Channel partners lack strong kits',
  'Other',
]

const EXTRA_NOTES = [
  'Launch date is soon',
  'Want a site visit audit',
  'Have competitor references',
  'Want budget discussion',
  'Other',
]

const emptyAssets = () =>
  Object.fromEntries(BRAND_ASSETS.map((item) => [item.key, 'unset']))

const emptyForm = () => ({
  name: '',
  email: '',
  phone: '',
  company: '',
  projectName: '',
  location: '',
  role: '',
  brandNeed: '',
  helpAreas: [],
  projectStage: '',
  timeline: '',
  assetsMode: 'detailed',
  assetsSkipReason: '',
  brandAssets: emptyAssets(),
  challenges: [],
  challengeOther: '',
  extras: [],
  extrasOther: '',
  website: '',
  privacyConsent: false,
})

/** Concrete options only. Other stays manual because it needs a note. */
const selectableItems = (items) => items.filter((item) => item !== 'Other')

const STEPS = [
  { id: 'details', label: 'Your details' },
  { id: 'need', label: 'Brand need' },
  { id: 'assets', label: 'Brand assets' },
  { id: 'challenge', label: 'Challenge' },
  { id: 'review', label: 'Review & send' },
]
const STEP_LAST = STEPS.length - 1

function missingForStep(step, form) {
  const missing = []
  if (step === 0) {
    if (!form.name.trim()) missing.push({ id: 'name', label: 'Name' })
    if (!form.email.trim()) missing.push({ id: 'email', label: 'Email' })
    if (!isValidPhone(form.phone)) missing.push({ id: 'phone', label: 'Phone (10 digits)' })
    if (!form.role) missing.push({ id: 'role', label: 'Your role' })
    if (!form.company.trim()) missing.push({ id: 'company', label: 'Company / developer' })
    if (!form.projectName.trim()) missing.push({ id: 'projectName', label: 'Project name' })
    if (!form.location.trim()) missing.push({ id: 'location', label: 'City / location' })
    if (!form.projectStage) missing.push({ id: 'projectStage', label: 'Project stage' })
  }
  if (step === 1) {
    if (!form.brandNeed) missing.push({ id: 'brandNeed', label: 'What you need' })
    if (!form.helpAreas.length) missing.push({ id: 'helpAreas', label: 'Areas of help' })
    if (!form.timeline) missing.push({ id: 'timeline', label: 'When you want to start' })
  }
  if (step === 2) {
    if (form.assetsMode === 'skipped') {
      if (!form.assetsSkipReason.trim()) {
        missing.push({ id: 'assetsSkipReason', label: 'Reason for skipping brand assets' })
      }
    } else {
      const unanswered = BRAND_ASSETS.filter((item) => {
        const value = form.brandAssets[item.key]
        return value !== 'have' && value !== 'need'
      })
      if (unanswered.length) {
        missing.push({ id: 'brandAssets', label: 'Brand assets (mark every row, or Skip)' })
      }
    }
  }
  if (step === 3) {
    if (!form.challenges.length) missing.push({ id: 'challenges', label: 'Biggest brand challenge' })
    if (form.challenges.includes('Other') && !form.challengeOther.trim()) {
      missing.push({ id: 'challengeOther', label: 'Other challenge detail' })
    }
    if (!form.extras.length) missing.push({ id: 'extras', label: 'Anything else we should know' })
    if (form.extras.includes('Other') && !form.extrasOther.trim()) {
      missing.push({ id: 'extrasOther', label: 'Other note detail' })
    }
  }
  if (step === 4) {
    if (!form.privacyConsent) missing.push({ id: 'privacyConsent', label: 'Privacy consent' })
  }
  return missing
}

function stepIsComplete(step, form) {
  return missingForStep(step, form).length === 0
}

export default function BrandConsulting() {
  const [form, setForm] = useState(emptyForm)
  const [step, setStep] = useState(0)
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState([])
  const [repeat, setRepeat] = useState(false)
  const errorRef = useRef(null)
  const panelRef = useRef(null)
  const startedRef = useRef(false)

  const stepProgress = STEP_LAST > 0 ? step / STEP_LAST : 0

  useEffect(() => {
    if (panelRef.current) {
      panelRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [step])

  const markStarted = () => {
    if (startedRef.current) return
    startedRef.current = true
    track('lead_started', { source: 'site_cta', interest: INTEREST, page: '/brandconsulting' })
  }

  const applyField = (key, value) => {
    markStarted()
    setForm((prev) => ({ ...prev, [key]: value }))
    setFieldErrors((prev) => prev.filter((row) => row.id !== key))
    if (status === 'error') {
      setStatus('idle')
      setError('')
    }
  }

  const set = (key) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    applyField(key, value)
  }

  const setPick = (key) => (value) => applyField(key, value)

  const toggleList = (field, otherField, value) => {
    markStarted()
    setForm((prev) => {
      const list = prev[field] || []
      const has = list.includes(value)
      const next = has ? list.filter((item) => item !== value) : [...list, value]
      const clearOther = value === 'Other' && has
      return {
        ...prev,
        [field]: next,
        ...(clearOther && otherField ? { [otherField]: '' } : {}),
      }
    })
    setFieldErrors((prev) => prev.filter((row) => row.id !== field && row.id !== otherField))
    if (status === 'error') {
      setStatus('idle')
      setError('')
    }
  }

  const selectAllList = (field, items, otherField) => {
    markStarted()
    const all = selectableItems(items)
    setForm((prev) => {
      const keepOther = otherField && (prev[field] || []).includes('Other')
      return {
        ...prev,
        [field]: keepOther ? [...all, 'Other'] : all,
      }
    })
    setFieldErrors((prev) => prev.filter((row) => row.id !== field))
    if (status === 'error') {
      setStatus('idle')
      setError('')
    }
  }

  const clearList = (field, otherField) => {
    markStarted()
    setForm((prev) => ({
      ...prev,
      [field]: [],
      ...(otherField ? { [otherField]: '' } : {}),
    }))
    setFieldErrors((prev) => prev.filter((row) => row.id !== field && row.id !== otherField))
    if (status === 'error') {
      setStatus('idle')
      setError('')
    }
  }

  const toggleHelpArea = (area) => toggleList('helpAreas', null, area)
  const toggleChallenge = (item) => toggleList('challenges', 'challengeOther', item)
  const toggleExtra = (item) => toggleList('extras', 'extrasOther', item)

  const setAssetStatus = (key, next) => {
    markStarted()
    setForm((prev) => {
      if (prev.assetsMode === 'skipped') return prev
      const current = prev.brandAssets[key]
      const statusValue = current === next ? 'unset' : next
      return {
        ...prev,
        assetsMode: 'detailed',
        assetsSkipReason: '',
        brandAssets: { ...prev.brandAssets, [key]: statusValue },
      }
    })
    setFieldErrors((prev) => prev.filter((row) => row.id !== 'brandAssets' && row.id !== 'assetsSkipReason'))
    if (status === 'error') {
      setStatus('idle')
      setError('')
    }
  }

  const markAllAssets = (statusValue) => {
    markStarted()
    setForm((prev) => ({
      ...prev,
      assetsMode: 'detailed',
      assetsSkipReason: '',
      brandAssets: Object.fromEntries(BRAND_ASSETS.map((item) => [item.key, statusValue])),
    }))
    setFieldErrors((prev) => prev.filter((row) => row.id !== 'brandAssets' && row.id !== 'assetsSkipReason'))
    if (status === 'error') {
      setStatus('idle')
      setError('')
    }
  }

  const setAssetsSkip = (on) => {
    markStarted()
    setForm((prev) => ({
      ...prev,
      assetsMode: on ? 'skipped' : 'detailed',
      assetsSkipReason: on ? prev.assetsSkipReason : '',
      brandAssets: on ? emptyAssets() : prev.brandAssets,
    }))
    setFieldErrors((prev) => prev.filter((row) => row.id !== 'brandAssets' && row.id !== 'assetsSkipReason'))
    if (status === 'error') {
      setStatus('idle')
      setError('')
    }
  }

  const validate = () => {
    const missing = []
    for (let i = 0; i <= STEP_LAST; i += 1) missing.push(...missingForStep(i, form))
    setFieldErrors(missing)
    return missing
  }

  const validateStep = (target = step) => {
    const missing = missingForStep(target, form)
    setFieldErrors(missing)
    return missing
  }

  const goNext = () => {
    const missing = validateStep(step)
    if (missing.length) {
      setStatus('error')
      setError('Please fill the highlighted required fields.')
      requestAnimationFrame(() => focusFirstMissing(missing))
      return
    }
    setStatus('idle')
    setError('')
    setFieldErrors([])
    setStep((s) => Math.min(STEP_LAST, s + 1))
  }

  const goBack = () => {
    setStatus('idle')
    setError('')
    setFieldErrors([])
    setStep((s) => Math.max(0, s - 1))
  }

  const goToStep = (next) => {
    if (next > step) {
      for (let i = step; i < next; i += 1) {
        const missing = missingForStep(i, form)
        if (missing.length) {
          setStep(i)
          setFieldErrors(missing)
          setStatus('error')
          setError('Please fill the highlighted required fields.')
          requestAnimationFrame(() => focusFirstMissing(missing))
          return
        }
      }
    }
    setStatus('idle')
    setError('')
    setFieldErrors([])
    setStep(next)
  }

  const focusFirstMissing = (missing) => {
    const first = missing[0]
    if (!first) return
    let root = document.getElementById(`bc-${first.id}`)
    if (!root) {
      errorRef.current?.focus()
      return
    }
    if (root.tagName === 'LEGEND') {
      const matrix = root.parentElement?.querySelector('.rw-bc-matrix, .rw-bc-toolbar, textarea')
      if (matrix) root = matrix
    }
    root.scrollIntoView({ behavior: 'smooth', block: 'center' })
    const focusable = root.matches('input, textarea, select, button')
      ? root
      : root.querySelector(
          'input:not([type="hidden"]), textarea, button.rw-form-select-btn, button.rw-bc-chip, button.rw-bc-seg-btn, button.rw-bc-check-action, button.rw-bc-mode-btn, button.rw-bc-link-action',
        )
    window.setTimeout(() => {
      if (focusable && typeof focusable.focus === 'function') {
        focusable.focus({ preventScroll: true })
        return
      }
      if (!root.hasAttribute('tabindex')) root.tabIndex = -1
      root.focus({ preventScroll: true })
    }, 280)
  }

  const composeChallenge = () => {
    const picked = form.challenges.filter((item) => item !== 'Other')
    if (form.challenges.includes('Other') && form.challengeOther.trim()) {
      picked.push(`Other: ${form.challengeOther.trim()}`)
    }
    return picked.join('; ')
  }

  const composeMoreDetail = () => {
    const picked = form.extras.filter((item) => item !== 'Other')
    if (form.extras.includes('Other') && form.extrasOther.trim()) {
      picked.push(`Other: ${form.extrasOther.trim()}`)
    }
    return picked.join('; ')
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    if (status === 'sending') return
    if (step < STEP_LAST) {
      goNext()
      return
    }
    const missing = validate()
    if (missing.length) {
      setStatus('error')
      setError('Please fill the highlighted required fields.')
      for (let i = 0; i <= STEP_LAST; i += 1) {
        if (missingForStep(i, form).length) {
          setStep(i)
          break
        }
      }
      requestAnimationFrame(() => focusFirstMissing(missing))
      return
    }

    setStatus('sending')
    setError('')
    try {
      const assetsSkipped = form.assetsMode === 'skipped'
      await submitBrandConsultingEnquiry({
        name: form.name.trim(),
        email: form.email.trim(),
        phoneNumber: toPhoneDigits(form.phone),
        company: form.company.trim(),
        projectName: form.projectName.trim(),
        location: form.location.trim(),
        role: form.role,
        brandNeed: form.brandNeed,
        helpAreas: form.helpAreas,
        projectStage: form.projectStage,
        timeline: form.timeline,
        assetsMode: assetsSkipped ? 'skipped' : 'detailed',
        assetsSkipReason: assetsSkipped ? form.assetsSkipReason.trim() : '',
        brandAssets: assetsSkipped
          ? []
          : BRAND_ASSETS.map((item) => ({
              key: item.key,
              label: `${item.no} ${item.label}`,
              status: form.brandAssets[item.key] || 'unset',
            })),
        challenge: composeChallenge(),
        moreDetail: composeMoreDetail(),
        website: form.website,
      })
      setRepeat(false)
      setStatus('sent')
      track('lead_submitted', {
        source: 'brand_consulting_enquiry',
        interest: INTEREST,
        page: '/brandconsulting',
      })
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (err) {
      setStatus('error')
      setError(getErrorMessage(err) || 'Could not send your enquiry. Try again.')
      track('lead_submission_failed', {
        source: 'brand_consulting_enquiry',
        interest: INTEREST,
        page: '/brandconsulting',
        errorCategory: errorCategory(err),
      })
      requestAnimationFrame(() => errorRef.current?.focus())
    }
  }

  return (
    <>
      <Seo route="/brandconsulting" />
      <Header />

      <main className="rw-bc">
        <section className="rw-bc-hero" aria-labelledby="bc-hero-title">
          <div className="rw-bc-hero-copy rw-pad">
            <p className="rw-bc-eyebrow" style={{ fontFamily: mono }}>
              Brand Consulting
            </p>
            <h1 id="bc-hero-title" className="rw-bc-title" style={{ fontFamily: serif }}>
              <span>Brand consulting</span>
              <span className="rw-bc-title-italic">for developers who sell on trust</span>
            </h1>
            <p className="rw-bc-lede" style={{ fontFamily: text }}>
              16 years of market craft behind the brand. Rajiv is the face.
              Team RW delivers the brand and marketing work that helps developers sell on trust.
            </p>
            <p className="rw-bc-proof" style={{ fontFamily: text }}>
              Team RW brand consulting has helped developers move hundreds of crores of inventory with clearer language and buyer psychology.
            </p>
            <div className="rw-bc-hero-actions">
              <a href="#enquire" className="rw-cta" style={ctaCopper}>
                Enquire now
              </a>
              <Link to="/about" className="rw-cta-secondary">
                About Team RW
              </Link>
            </div>
          </div>
        </section>

        <section id="enquire" className="rw-bc-form-section is-stepper rw-pad">
          <div className="rw-bc-shell">
            {status === 'sent' ? (
              <Reveal className="rw-bc-panel rw-bc-done">
                <p className="rw-bc-eyebrow" style={{ fontFamily: mono }}>Thank you</p>
                <h2 className="rw-bc-panel-title" style={{ fontFamily: serif }}>
                  Brand brief received
                </h2>
                <p className="rw-bc-note" style={{ fontFamily: text }}>
                  Team RW will review your brand brief and get back to you on email or phone.
                </p>
                <button
                  type="button"
                  className="rw-cta"
                  style={{ ...ctaCopper, marginTop: 22 }}
                  onClick={() => {
                    setForm(emptyForm())
                    setStep(0)
                    setStatus('idle')
                    setRepeat(false)
                    startedRef.current = false
                  }}
                >
                  Send another brief
                </button>
              </Reveal>
            ) : (
              <form className="rw-bc-panel is-stepper rw-bc-form" onSubmit={onSubmit} noValidate ref={panelRef}>
                <header className="rw-bc-panel-head">
                  <p className="rw-bc-eyebrow" style={{ fontFamily: mono }}>Brand brief</p>
                  <h2 className="rw-bc-panel-title" style={{ fontFamily: serif }}>
                    Tell us about the brand work
                  </h2>
                  <p className="rw-bc-note" style={{ fontFamily: text }}>
                    One section at a time. Every field is required. Mark Have or Need on every asset, or Skip with a reason.
                  </p>
                </header>

                <div className="rw-bc-rail" aria-label="Brief progress">
                  <div className="rw-bc-rail-meta">
                    <div className="rw-bc-rail-label">
                      Step <strong>{step + 1}</strong> / {STEPS.length}
                      <span className="rw-bc-rail-sep">·</span>
                      <span className="rw-bc-rail-current">{STEPS[step].label}</span>
                    </div>
                    <div className="rw-bc-bar" aria-hidden="true">
                      <div className="rw-bc-bar-fill" style={{ transform: `scaleX(${stepProgress})` }} />
                    </div>
                  </div>
                  <div className="rw-bc-stepper" role="navigation" aria-label="Brief steps">
                    {STEPS.map((row, i) => (
                      <button
                        key={row.id}
                        type="button"
                        className={`rw-bc-step-seg${step === i ? ' is-on' : ''}${stepIsComplete(i, form) ? ' is-done' : ''}`}
                        onClick={() => goToStep(i)}
                        aria-label={row.label}
                        title={row.label}
                      />
                    ))}
                  </div>
                </div>

                {(fieldErrors.length > 0 || error) && (
                  <div
                    className="rw-bc-alert"
                    role="alert"
                    tabIndex={-1}
                    ref={errorRef}
                    aria-labelledby="bc-error-title"
                  >
                    <h3 id="bc-error-title">There is a problem</h3>
                    {error ? <p>{error}</p> : null}
                    {fieldErrors.length > 0 && (
                      <ul>
                        {fieldErrors.map((row) => (
                          <li key={row.id}>
                            <a
                              href={`#bc-${row.id}`}
                              onClick={(ev) => {
                                ev.preventDefault()
                                focusFirstMissing([row])
                              }}
                            >
                              {row.label} is required
                            </a>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}

                {step === 0 && (
                <fieldset className="rw-bc-block rw-bc-step-panel">
                  <legend className="rw-bc-block-title">Your details</legend>
                  <div className="rw-form-panel rw-form-panel--compact rw-bc-grid">
                    <label className="rw-form-field-wrap" htmlFor="bc-name">
                      <span className="rw-form-q-title">
                        Name <span className="rw-form-req">*</span>
                      </span>
                      <input
                        id="bc-name"
                        className="rw-form-field"
                        name="name"
                        autoComplete="name"
                        value={form.name}
                        onChange={set('name')}
                        aria-invalid={fieldErrors.some((row) => row.id === 'name')}
                        required
                      />
                    </label>

                    <label className="rw-form-field-wrap" htmlFor="bc-email">
                      <span className="rw-form-q-title">
                        Email <span className="rw-form-req">*</span>
                      </span>
                      <input
                        id="bc-email"
                        className="rw-form-field"
                        name="email"
                        type="email"
                        autoComplete="email"
                        value={form.email}
                        onChange={set('email')}
                        aria-invalid={fieldErrors.some((row) => row.id === 'email')}
                        required
                      />
                    </label>

                    <label className="rw-form-field-wrap" htmlFor="bc-phone">
                      <span className="rw-form-q-title">
                        Phone <span className="rw-form-req">*</span>
                      </span>
                      <input
                        id="bc-phone"
                        className="rw-form-field"
                        name="phone"
                        type="tel"
                        inputMode="numeric"
                        autoComplete="tel"
                        placeholder="10-digit mobile"
                        value={form.phone}
                        onChange={set('phone')}
                        aria-invalid={fieldErrors.some((row) => row.id === 'phone')}
                        required
                      />
                    </label>

                    <label className="rw-form-field-wrap" htmlFor="bc-role">
                      <span className="rw-form-q-title">
                        Your role <span className="rw-form-req">*</span>
                      </span>
                      <FormSelect
                        id="bc-role"
                        value={form.role}
                        options={ROLES}
                        placeholder="Select"
                        onChange={setPick('role')}
                        aria-invalid={fieldErrors.some((row) => row.id === 'role')}
                        required
                      />
                    </label>

                    <label className="rw-form-field-wrap" htmlFor="bc-company">
                      <span className="rw-form-q-title">
                        Company / developer <span className="rw-form-req">*</span>
                      </span>
                      <input
                        id="bc-company"
                        className="rw-form-field"
                        name="company"
                        autoComplete="organization"
                        value={form.company}
                        onChange={set('company')}
                        aria-invalid={fieldErrors.some((row) => row.id === 'company')}
                        required
                      />
                    </label>

                    <label className="rw-form-field-wrap" htmlFor="bc-projectName">
                      <span className="rw-form-q-title">
                        Project name <span className="rw-form-req">*</span>
                      </span>
                      <input
                        id="bc-projectName"
                        className="rw-form-field"
                        name="projectName"
                        value={form.projectName}
                        onChange={set('projectName')}
                        aria-invalid={fieldErrors.some((row) => row.id === 'projectName')}
                        required
                      />
                    </label>

                    <label className="rw-form-field-wrap" htmlFor="bc-location">
                      <span className="rw-form-q-title">
                        City / location <span className="rw-form-req">*</span>
                      </span>
                      <input
                        id="bc-location"
                        className="rw-form-field"
                        name="location"
                        placeholder="e.g. Gachibowli, Hyderabad"
                        value={form.location}
                        onChange={set('location')}
                        aria-invalid={fieldErrors.some((row) => row.id === 'location')}
                        required
                      />
                    </label>

                    <label className="rw-form-field-wrap" htmlFor="bc-projectStage">
                      <span className="rw-form-q-title">
                        Project stage <span className="rw-form-req">*</span>
                      </span>
                      <FormSelect
                        id="bc-projectStage"
                        value={form.projectStage}
                        options={PROJECT_STAGES}
                        placeholder="Select"
                        onChange={setPick('projectStage')}
                        aria-invalid={fieldErrors.some((row) => row.id === 'projectStage')}
                        required
                      />
                    </label>
                  </div>
                </fieldset>
                )}

                {step === 1 && (
                <fieldset className="rw-bc-block rw-bc-step-panel">
                  <legend className="rw-bc-block-title">Brand need</legend>
                  <div className="rw-form-panel rw-form-panel--compact rw-bc-grid">
                    <label className="rw-form-field-wrap rw-form-field-wrap--wide" htmlFor="bc-brandNeed">
                      <span className="rw-form-q-title">
                        What do you need most? <span className="rw-form-req">*</span>
                      </span>
                      <FormSelect
                        id="bc-brandNeed"
                        value={form.brandNeed}
                        options={BRAND_NEEDS}
                        placeholder="Select"
                        onChange={setPick('brandNeed')}
                        aria-invalid={fieldErrors.some((row) => row.id === 'brandNeed')}
                        required
                      />
                    </label>

                    <div
                      id="bc-helpAreas"
                      className="rw-form-field-wrap rw-form-field-wrap--wide"
                      role="group"
                      aria-labelledby="bc-helpAreas-label"
                      aria-invalid={fieldErrors.some((row) => row.id === 'helpAreas')}
                    >
                      <span id="bc-helpAreas-label" className="rw-form-q-title">
                        Where do you need help? <span className="rw-form-req">*</span>
                      </span>
                      <p className="rw-bc-hint">Select a few, or Select all. Each choice is saved by name.</p>
                      <div className="rw-bc-toolbar rw-bc-toolbar--checks" role="toolbar" aria-label="Help areas quick actions">
                        <button
                          type="button"
                          className={`rw-bc-check-action${selectableItems(HELP_AREAS).every((item) => form.helpAreas.includes(item)) ? ' is-on' : ''}`}
                          aria-pressed={selectableItems(HELP_AREAS).every((item) => form.helpAreas.includes(item))}
                          onClick={() => {
                            if (selectableItems(HELP_AREAS).every((item) => form.helpAreas.includes(item))) {
                              clearList('helpAreas', null)
                            } else {
                              selectAllList('helpAreas', HELP_AREAS, null)
                            }
                          }}
                        >
                          <span className="rw-bc-check-box" aria-hidden="true" />
                          Select all
                        </button>
                        <span className="rw-bc-toolbar-sep" aria-hidden="true" />
                        <button
                          type="button"
                          className="rw-bc-link-action"
                          onClick={() => clearList('helpAreas', null)}
                          disabled={!form.helpAreas.length}
                        >
                          Clear
                        </button>
                      </div>
                      <div className="rw-bc-chips">
                        {HELP_AREAS.map((area) => {
                          const on = form.helpAreas.includes(area)
                          return (
                            <button
                              key={area}
                              type="button"
                              className={`rw-bc-chip${on ? ' is-on' : ''}`}
                              aria-pressed={on}
                              onClick={() => toggleHelpArea(area)}
                            >
                              {area}
                            </button>
                          )
                        })}
                      </div>
                    </div>

                    <label className="rw-form-field-wrap" htmlFor="bc-timeline">
                      <span className="rw-form-q-title">
                        When do you want to start? <span className="rw-form-req">*</span>
                      </span>
                      <FormSelect
                        id="bc-timeline"
                        value={form.timeline}
                        options={TIMELINES}
                        placeholder="Select"
                        onChange={setPick('timeline')}
                        aria-invalid={fieldErrors.some((row) => row.id === 'timeline')}
                        required
                      />
                    </label>
                  </div>
                </fieldset>
                )}

                {step === 2 && (
                <fieldset className="rw-bc-block rw-bc-step-panel">
                  <legend className="rw-bc-block-title" id="bc-brandAssets">
                    Brand assets <span className="rw-form-req">*</span>
                  </legend>
                  <p className="rw-bc-hint rw-bc-hint--tight">
                    Mark Have or Need on every row, use Mark all shortcuts, or Skip for now with a reason.
                  </p>
                  <div
                    className="rw-bc-toolbar rw-bc-toolbar--mode"
                    role="radiogroup"
                    aria-label="Brand asset quick actions"
                  >
                    <button
                      type="button"
                      role="radio"
                      className={`rw-bc-mode-btn${form.assetsMode !== 'skipped' && BRAND_ASSETS.every((item) => form.brandAssets[item.key] === 'have') ? ' is-on' : ''}`}
                      aria-checked={form.assetsMode !== 'skipped' && BRAND_ASSETS.every((item) => form.brandAssets[item.key] === 'have')}
                      onClick={() => markAllAssets('have')}
                    >
                      All Have
                    </button>
                    <button
                      type="button"
                      role="radio"
                      className={`rw-bc-mode-btn${form.assetsMode !== 'skipped' && BRAND_ASSETS.every((item) => form.brandAssets[item.key] === 'need') ? ' is-on' : ''}`}
                      aria-checked={form.assetsMode !== 'skipped' && BRAND_ASSETS.every((item) => form.brandAssets[item.key] === 'need')}
                      onClick={() => markAllAssets('need')}
                    >
                      All Need
                    </button>
                    <button
                      type="button"
                      role="radio"
                      className={`rw-bc-mode-btn${form.assetsMode === 'skipped' ? ' is-on' : ''}`}
                      aria-checked={form.assetsMode === 'skipped'}
                      onClick={() => setAssetsSkip(form.assetsMode !== 'skipped')}
                    >
                      Skip
                    </button>
                  </div>
                  {form.assetsMode === 'skipped' ? (
                    <label className="rw-bc-other-field" htmlFor="bc-assetsSkipReason">
                      <span className="rw-form-q-title">
                        Why are you skipping this? <span className="rw-form-req">*</span>
                      </span>
                      <textarea
                        id="bc-assetsSkipReason"
                        className="rw-form-field rw-bc-message"
                        name="assetsSkipReason"
                        rows={3}
                        value={form.assetsSkipReason}
                        onChange={set('assetsSkipReason')}
                        placeholder="e.g. Will share brand kit on the call / Not ready yet / Already have an agency"
                        aria-invalid={fieldErrors.some((row) => row.id === 'assetsSkipReason')}
                        required
                      />
                    </label>
                  ) : null}
                  <div
                    className={`rw-bc-matrix${form.assetsMode === 'skipped' ? ' is-skipped' : ''}`}
                    role="group"
                    aria-labelledby="bc-brandAssets"
                    aria-invalid={fieldErrors.some((row) => row.id === 'brandAssets')}
                  >
                    <div className="rw-bc-matrix-head" aria-hidden="true">
                      <span className="rw-bc-matrix-asset">Asset</span>
                      <span className="rw-bc-matrix-choices">
                        <span className="rw-bc-matrix-choice">Have</span>
                        <span className="rw-bc-matrix-choice">Need</span>
                      </span>
                    </div>
                    <div className="rw-bc-matrix-body">
                      {BRAND_ASSETS.map((item) => {
                        const value = form.brandAssets[item.key] || 'unset'
                        return (
                          <div key={item.key} className="rw-bc-matrix-row">
                            <span className="rw-bc-matrix-name" id={`bc-asset-${item.key}`}>
                              <span className="rw-bc-matrix-no">{item.no}</span>
                              {item.label}
                            </span>
                            <div
                              className="rw-bc-seg"
                              role="radiogroup"
                              aria-labelledby={`bc-asset-${item.key}`}
                            >
                              <button
                                type="button"
                                role="radio"
                                className={`rw-bc-seg-btn${value === 'have' ? ' is-on' : ''}`}
                                aria-checked={value === 'have'}
                                onClick={() => setAssetStatus(item.key, 'have')}
                                disabled={form.assetsMode === 'skipped'}
                              >
                                Have
                              </button>
                              <button
                                type="button"
                                role="radio"
                                className={`rw-bc-seg-btn${value === 'need' ? ' is-on' : ''}`}
                                aria-checked={value === 'need'}
                                onClick={() => setAssetStatus(item.key, 'need')}
                                disabled={form.assetsMode === 'skipped'}
                              >
                                Need
                              </button>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </fieldset>
                )}

                {step === 3 && (
                <fieldset className="rw-bc-block rw-bc-step-panel">
                  <legend className="rw-bc-block-title">Challenge</legend>
                  <div className="rw-form-panel rw-form-panel--compact rw-bc-grid">
                    <div
                      id="bc-challenges"
                      className="rw-form-field-wrap rw-form-field-wrap--wide"
                      role="group"
                      aria-labelledby="bc-challenges-label"
                      aria-invalid={fieldErrors.some((row) => row.id === 'challenges')}
                    >
                      <span id="bc-challenges-label" className="rw-form-q-title">
                        Biggest brand challenge right now <span className="rw-form-req">*</span>
                      </span>
                      <p className="rw-bc-hint">Select all that apply. Tap Other only if needed.</p>
                      <div className="rw-bc-toolbar rw-bc-toolbar--checks" role="toolbar" aria-label="Challenges quick actions">
                        <button
                          type="button"
                          className={`rw-bc-check-action${selectableItems(CHALLENGES).every((item) => form.challenges.includes(item)) ? ' is-on' : ''}`}
                          aria-pressed={selectableItems(CHALLENGES).every((item) => form.challenges.includes(item))}
                          onClick={() => {
                            if (selectableItems(CHALLENGES).every((item) => form.challenges.includes(item))) {
                              clearList('challenges', 'challengeOther')
                            } else {
                              selectAllList('challenges', CHALLENGES, 'challengeOther')
                            }
                          }}
                        >
                          <span className="rw-bc-check-box" aria-hidden="true" />
                          Select all
                        </button>
                        <span className="rw-bc-toolbar-sep" aria-hidden="true" />
                        <button
                          type="button"
                          className="rw-bc-link-action"
                          onClick={() => clearList('challenges', 'challengeOther')}
                          disabled={!form.challenges.length}
                        >
                          Clear
                        </button>
                      </div>
                      <div className="rw-bc-chips">
                        {CHALLENGES.map((item) => {
                          const on = form.challenges.includes(item)
                          return (
                            <button
                              key={item}
                              type="button"
                              className={`rw-bc-chip${on ? ' is-on' : ''}`}
                              aria-pressed={on}
                              onClick={() => toggleChallenge(item)}
                            >
                              {item}
                            </button>
                          )
                        })}
                      </div>
                      {form.challenges.includes('Other') && (
                        <label className="rw-bc-other-field" htmlFor="bc-challengeOther">
                          <span className="rw-form-q-title">
                            Tell us the other challenge <span className="rw-form-req">*</span>
                          </span>
                          <textarea
                            id="bc-challengeOther"
                            className="rw-form-field rw-bc-message"
                            name="challengeOther"
                            rows={3}
                            value={form.challengeOther}
                            onChange={set('challengeOther')}
                            placeholder="Write the challenge in a few words..."
                            aria-invalid={fieldErrors.some((row) => row.id === 'challengeOther')}
                            required
                          />
                        </label>
                      )}
                    </div>

                    <div
                      id="bc-extras"
                      className="rw-form-field-wrap rw-form-field-wrap--wide"
                      role="group"
                      aria-labelledby="bc-extras-label"
                      aria-invalid={fieldErrors.some((row) => row.id === 'extras')}
                    >
                      <span id="bc-extras-label" className="rw-form-q-title">
                        Anything else we should know? <span className="rw-form-req">*</span>
                      </span>
                      <p className="rw-bc-hint">Select at least one. Tap Other only if needed.</p>
                      <div className="rw-bc-toolbar rw-bc-toolbar--checks" role="toolbar" aria-label="Extra notes quick actions">
                        <button
                          type="button"
                          className={`rw-bc-check-action${selectableItems(EXTRA_NOTES).every((item) => form.extras.includes(item)) ? ' is-on' : ''}`}
                          aria-pressed={selectableItems(EXTRA_NOTES).every((item) => form.extras.includes(item))}
                          onClick={() => {
                            if (selectableItems(EXTRA_NOTES).every((item) => form.extras.includes(item))) {
                              clearList('extras', 'extrasOther')
                            } else {
                              selectAllList('extras', EXTRA_NOTES, 'extrasOther')
                            }
                          }}
                        >
                          <span className="rw-bc-check-box" aria-hidden="true" />
                          Select all
                        </button>
                        <span className="rw-bc-toolbar-sep" aria-hidden="true" />
                        <button
                          type="button"
                          className="rw-bc-link-action"
                          onClick={() => clearList('extras', 'extrasOther')}
                          disabled={!form.extras.length}
                        >
                          Clear
                        </button>
                      </div>
                      <div className="rw-bc-chips">
                        {EXTRA_NOTES.map((item) => {
                          const on = form.extras.includes(item)
                          return (
                            <button
                              key={item}
                              type="button"
                              className={`rw-bc-chip${on ? ' is-on' : ''}`}
                              aria-pressed={on}
                              onClick={() => toggleExtra(item)}
                            >
                              {item}
                            </button>
                          )
                        })}
                      </div>
                      {form.extras.includes('Other') && (
                        <label className="rw-bc-other-field" htmlFor="bc-extrasOther">
                          <span className="rw-form-q-title">
                            Add the other note <span className="rw-form-req">*</span>
                          </span>
                          <textarea
                            id="bc-extrasOther"
                            className="rw-form-field rw-bc-message"
                            name="extrasOther"
                            rows={3}
                            value={form.extrasOther}
                            onChange={set('extrasOther')}
                            placeholder="Write the note in a few words..."
                            aria-invalid={fieldErrors.some((row) => row.id === 'extrasOther')}
                            required
                          />
                        </label>
                      )}
                    </div>
                  </div>
                </fieldset>
                )}

                {step === 4 && (
                <section className="rw-bc-block rw-bc-step-panel" aria-labelledby="bc-review-title">
                  <h3 id="bc-review-title" className="rw-bc-block-title">Review & send</h3>
                  <p className="rw-bc-review-meta">
                    Check your brief, then agree to privacy and submit. Tap a row to edit that section.
                  </p>
                  <ul className="rw-bc-review-list">
                    {STEPS.slice(0, 4).map((row, i) => (
                      <li key={row.id}>
                        <button type="button" className="rw-bc-review-link" onClick={() => goToStep(i)}>
                          <span>{row.label}</span>
                          <span>{stepIsComplete(i, form) ? 'Ready' : 'Needs detail'}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                  <label className="rw-bc-consent" htmlFor="bc-privacyConsent">
                    <input
                      id="bc-privacyConsent"
                      type="checkbox"
                      checked={form.privacyConsent}
                      onChange={set('privacyConsent')}
                      aria-invalid={fieldErrors.some((row) => row.id === 'privacyConsent')}
                    />
                    <span style={{ fontFamily: text, fontSize: fs('13px') }}>
                      I agree to the{' '}
                      <Link to="/privacy-policy" target="_blank" rel="noreferrer">Privacy Policy</Link>
                      {' '}and Team RW contacting me about this enquiry.
                    </span>
                  </label>
                </section>
                )}

                <label className="rw-bc-hp" aria-hidden="true">
                  Website
                  <input
                    type="text"
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                    value={form.website}
                    onChange={set('website')}
                  />
                </label>

                <div className="rw-bc-foot">
                  <div className="rw-bc-foot-inner">
                    <button
                      type="button"
                      className="rw-bc-nav-btn"
                      onClick={goBack}
                      disabled={step === 0 || status === 'sending'}
                    >
                      Back
                    </button>
                    {step < STEP_LAST ? (
                      <button type="button" className="rw-cta" style={ctaCopper} onClick={goNext} disabled={status === 'sending'}>
                        Continue
                      </button>
                    ) : (
                      <button
                        type="submit"
                        className="rw-cta rw-bc-submit"
                        style={ctaCopper}
                        disabled={status === 'sending'}
                      >
                        {status === 'sending' ? 'Submitting...' : 'Submit'}
                      </button>
                    )}
                  </div>
                </div>
              </form>
            )}
          </div>
        </section>
      </main>

      <Footer links={FOOTER_LINKS} />
    </>
  )
}
