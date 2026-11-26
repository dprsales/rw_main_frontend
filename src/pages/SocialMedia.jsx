import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Footer from '../components/Footer'
import Header from '../components/Header'
import Seo from '../components/Seo'
import Reveal from '../components/Reveal'
import { getErrorMessage, submitSocialMediaEnquiry } from '../data/api'
import { errorCategory, track } from '../data/analytics'
import { isValidPhone, toPhoneDigits } from '../data/booking'
import FormSelect from '../form/FormSelect'
import BriefStepper from '../components/BriefStepper'
import { FOOTER_LINKS, mono, serif, text } from '../theme'
import { ctaCopper, fs } from '../styles'
import '../form/form.css'
import './brand-consulting.css'

const INTEREST = 'Social Media Management'
const PAGE = '/socialmedia'

const ROLES = [
  'Developer / promoter',
  'Sales head',
  'Marketing head',
  'Brand / CRM lead',
  'Channel partner',
  'Founder / owner',
  'Other',
]

const PRIMARY_NEEDS = [
  'End-to-end',
  'Content and creatives only',
  'Paid social ads (Meta / YouTube / LinkedIn)',
  'Launch / campaign burst',
  'Page audit and cleanup',
  'SEO + local visibility add-on',
  'Not sure yet',
]

const PLATFORMS = [
  'Instagram',
  'Facebook',
  'YouTube',
  'LinkedIn',
  'X (Twitter)',
  'Threads',
  'WhatsApp Business / Channel',
  'Google Business Profile',
  'Pinterest',
  'Other',
]

const HELP_AREAS = [
  'Content calendar and posting',
  'Reels / Shorts / video',
  'Static creatives and carousels',
  'Community management and replies',
  'Paid social ads and retargeting',
  'Influencer / collab coordination',
  'Profile and page setup',
  'Analytics and monthly reporting',
  'SEO (search / website discovery)',
  'Local SEO and Google Maps',
  'GEO (AI / generative search visibility)',
  'Other',
]

const GOALS = [
  'More enquiries / leads',
  'Project launch buzz',
  'Brand recall in Hyderabad market',
  'Site visit interest',
  'Thought leadership for founders',
  'Hiring / team brand',
  'Channel partner visibility',
  'Other',
]

const CADENCES = [
  '3 to 5 posts a week',
  'Daily posts',
  'Reels-heavy (4+ short videos a week)',
  'Campaign bursts only',
  'Not sure, need a plan',
]

const PROJECT_STAGES = [
  'Planning / pre-launch',
  'Soft launch',
  'Active sales',
  'Ready to move',
  'Resale / inventory',
  'Company / personal brand',
  'Other',
]

const TIMELINES = [
  'As soon as possible',
  'This month',
  '1 to 3 months',
  'Just exploring',
]

/** Creative / ops assets: Have or Need. */
const CREATIVE_ASSETS = [
  { key: 'brandKit', no: '01', label: 'Brand kit (logo, fonts, colours)' },
  { key: 'photoBank', no: '02', label: 'Project / team photo bank' },
  { key: 'videoBank', no: '03', label: 'Video / reel footage' },
  { key: 'templates', no: '04', label: 'Post / story templates' },
  { key: 'adCreatives', no: '05', label: 'Paid ad creatives' },
  { key: 'captionVoice', no: '06', label: 'Caption voice / tone guide' },
  { key: 'handlesAccess', no: '07', label: 'Page / handle admin access' },
  { key: 'pixelTracking', no: '08', label: 'Pixel / tracking setup' },
  { key: 'gbp', no: '09', label: 'Google Business Profile' },
  { key: 'websiteSeo', no: '10', label: 'Website SEO basics' },
]

const CHALLENGES = [
  'Inconsistent posting',
  'Low engagement / reach',
  'Creatives look generic',
  'No clear content plan',
  'Ads spend without results',
  'Wrong audience targeting',
  'Handles look inactive or outdated',
  'Hard to get site visits from social',
  'No SEO / Maps presence',
  'Other',
]

const EXTRA_NOTES = [
  'Launch date is soon',
  'Want a content audit first',
  'Have competitor pages to study',
  'Want budget discussion',
  'Need bilingual (EN + TE) content',
  'Other',
]

const emptyAssets = () =>
  Object.fromEntries(CREATIVE_ASSETS.map((item) => [item.key, 'unset']))

const emptyForm = () => ({
  name: '',
  email: '',
  phone: '',
  company: '',
  projectName: '',
  location: '',
  role: '',
  primaryNeeds: [],
  platforms: [],
  platformLinks: '',
  helpAreas: [],
  goals: [],
  cadence: '',
  projectStage: '',
  timeline: '',
  assetsMode: 'detailed',
  assetsSkipReason: '',
  creativeAssets: emptyAssets(),
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
  { id: 'details', label: 'Details' },
  { id: 'need', label: 'Need' },
  { id: 'assets', label: 'Assets' },
  { id: 'challenge', label: 'Challenge' },
  { id: 'review', label: 'Review' },
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
    if (!form.projectName.trim()) missing.push({ id: 'projectName', label: 'Project or brand name' })
    if (!form.location.trim()) missing.push({ id: 'location', label: 'City / location' })
    if (!form.projectStage) missing.push({ id: 'projectStage', label: 'Stage' })
  }
  if (step === 1) {
    if (!form.primaryNeeds.length) missing.push({ id: 'primaryNeeds', label: 'What you need' })
    if (!form.platforms.length) missing.push({ id: 'platforms', label: 'Platforms' })
    if (!form.platformLinks.trim()) missing.push({ id: 'platformLinks', label: 'Handles or page links' })
    if (!form.helpAreas.length) missing.push({ id: 'helpAreas', label: 'Areas of help' })
    if (!form.goals.length) missing.push({ id: 'goals', label: 'Goals' })
    if (!form.cadence) missing.push({ id: 'cadence', label: 'Posting cadence' })
    if (!form.timeline) missing.push({ id: 'timeline', label: 'When you want to start' })
  }
  if (step === 2) {
    if (form.assetsMode === 'skipped') {
      if (!form.assetsSkipReason.trim()) {
        missing.push({ id: 'assetsSkipReason', label: 'Reason for skipping assets' })
      }
    } else {
      const unanswered = CREATIVE_ASSETS.filter((item) => {
        const value = form.creativeAssets[item.key]
        return value !== 'have' && value !== 'need'
      })
      if (unanswered.length) {
        missing.push({ id: 'creativeAssets', label: 'Creative assets (mark every row, or Skip)' })
      }
    }
  }
  if (step === 3) {
    if (!form.challenges.length) missing.push({ id: 'challenges', label: 'Biggest social challenge' })
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

export default function SocialMedia() {
  const [form, setForm] = useState(emptyForm)
  const [step, setStep] = useState(0)
  const [reached, setReached] = useState(0)
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState([])
  const errorRef = useRef(null)
  const panelRef = useRef(null)
  const startedRef = useRef(false)

  const scrollFormIntoView = () => {
    requestAnimationFrame(() => {
      panelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }

  const moveToStep = (next) => {
    const n = Math.max(0, Math.min(STEP_LAST, next))
    setStep(n)
    setReached((r) => Math.max(r, n))
  }

  const markStarted = () => {
    if (startedRef.current) return
    startedRef.current = true
    track('lead_started', { source: 'site_cta', interest: INTEREST, page: PAGE })
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

  const setAssetStatus = (key, next) => {
    markStarted()
    setForm((prev) => {
      if (prev.assetsMode === 'skipped') return prev
      const current = prev.creativeAssets[key]
      const statusValue = current === next ? 'unset' : next
      return {
        ...prev,
        assetsMode: 'detailed',
        assetsSkipReason: '',
        creativeAssets: { ...prev.creativeAssets, [key]: statusValue },
      }
    })
    setFieldErrors((prev) => prev.filter((row) => row.id !== 'creativeAssets' && row.id !== 'assetsSkipReason'))
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
      creativeAssets: Object.fromEntries(CREATIVE_ASSETS.map((item) => [item.key, statusValue])),
    }))
    setFieldErrors((prev) => prev.filter((row) => row.id !== 'creativeAssets' && row.id !== 'assetsSkipReason'))
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
      creativeAssets: on ? emptyAssets() : prev.creativeAssets,
    }))
    setFieldErrors((prev) => prev.filter((row) => row.id !== 'creativeAssets' && row.id !== 'assetsSkipReason'))
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
    moveToStep(step + 1)
    scrollFormIntoView()
  }

  const goBack = () => {
    setStatus('idle')
    setError('')
    setFieldErrors([])
    moveToStep(step - 1)
    scrollFormIntoView()
  }

  const goToStep = (next) => {
    if (next > reached) return
    if (next > step) {
      for (let i = step; i < next; i += 1) {
        const missing = missingForStep(i, form)
        if (missing.length) {
          moveToStep(i)
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
    moveToStep(next)
    scrollFormIntoView()
  }

  const focusFirstMissing = (missing) => {
    const first = missing[0]
    if (!first) return
    let root = document.getElementById(`sm-${first.id}`)
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
          moveToStep(i)
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
      await submitSocialMediaEnquiry({
        name: form.name.trim(),
        email: form.email.trim(),
        phoneNumber: toPhoneDigits(form.phone),
        company: form.company.trim(),
        projectName: form.projectName.trim(),
        location: form.location.trim(),
        role: form.role,
        primaryNeeds: form.primaryNeeds,
        platforms: form.platforms,
        platformLinks: form.platformLinks.trim(),
        helpAreas: form.helpAreas,
        goals: form.goals,
        cadence: form.cadence,
        projectStage: form.projectStage,
        timeline: form.timeline,
        assetsMode: assetsSkipped ? 'skipped' : 'detailed',
        assetsSkipReason: assetsSkipped ? form.assetsSkipReason.trim() : '',
        creativeAssets: assetsSkipped
          ? []
          : CREATIVE_ASSETS.map((item) => ({
              key: item.key,
              label: `${item.no} ${item.label}`,
              status: form.creativeAssets[item.key] || 'unset',
            })),
        challenge: composeChallenge(),
        moreDetail: composeMoreDetail(),
        website: form.website,
      })
      setStatus('sent')
      track('lead_submitted', {
        source: 'social_media_enquiry',
        interest: INTEREST,
        page: PAGE,
      })
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (err) {
      setStatus('error')
      setError(getErrorMessage(err) || 'Could not send your enquiry. Try again.')
      track('lead_submission_failed', {
        source: 'social_media_enquiry',
        interest: INTEREST,
        page: PAGE,
        errorCategory: errorCategory(err),
      })
      requestAnimationFrame(() => errorRef.current?.focus())
    }
  }

  const chipGroup = (id, label, required, items, field, otherField, hint) => {
    const concrete = selectableItems(items)
    const selectedConcrete = concrete.filter((item) => form[field].includes(item))
    const allOn = concrete.length > 0 && selectedConcrete.length === concrete.length
    return (
      <div
        id={`sm-${id}`}
        className="rw-form-field-wrap rw-form-field-wrap--wide"
        role="group"
        aria-labelledby={`sm-${id}-label`}
        aria-invalid={fieldErrors.some((row) => row.id === id)}
      >
        <span id={`sm-${id}-label`} className="rw-form-q-title">
          {label} {required ? <span className="rw-form-req">*</span> : null}
        </span>
        {hint ? <p className="rw-bc-hint">{hint}</p> : null}
        <div className="rw-bc-toolbar rw-bc-toolbar--checks" role="toolbar" aria-label={`${label} quick actions`}>
          <button
            type="button"
            className={`rw-bc-check-action${allOn ? ' is-on' : ''}`}
            aria-pressed={allOn}
            onClick={() => {
              if (allOn) clearList(field, otherField)
              else selectAllList(field, items, otherField)
            }}
          >
            <span className="rw-bc-check-box" aria-hidden="true" />
            Select all
          </button>
          <span className="rw-bc-toolbar-sep" aria-hidden="true" />
          <button
            type="button"
            className="rw-bc-link-action"
            onClick={() => clearList(field, otherField)}
            disabled={!form[field].length}
          >
            Clear
          </button>
        </div>
        <div className="rw-bc-chips">
          {items.map((item) => {
            const on = form[field].includes(item)
            return (
              <button
                key={item}
                type="button"
                className={`rw-bc-chip${on ? ' is-on' : ''}`}
                aria-pressed={on}
                onClick={() => toggleList(field, otherField, item)}
              >
                {item}
              </button>
            )
          })}
        </div>
        {otherField && form[field].includes('Other') && (
          <label className="rw-bc-other-field" htmlFor={`sm-${otherField}`}>
            <span className="rw-form-q-title">
              Tell us more <span className="rw-form-req">*</span>
            </span>
            <textarea
              id={`sm-${otherField}`}
              className="rw-form-field rw-bc-message"
              name={otherField}
              rows={3}
              value={form[otherField]}
              onChange={set(otherField)}
              placeholder="A few words..."
              aria-invalid={fieldErrors.some((row) => row.id === otherField)}
              required
            />
          </label>
        )}
      </div>
    )
  }

  return (
    <>
      <Seo route={PAGE} />
      <Header />

      <main className="rw-bc">
        <section className="rw-bc-hero" aria-labelledby="sm-hero-title">
          <div className="rw-bc-hero-copy rw-pad">
            <p className="rw-bc-eyebrow" style={{ fontFamily: mono }}>
              Social Media Management
            </p>
            <h1 id="sm-hero-title" className="rw-bc-title" style={{ fontFamily: serif }}>
              <span>Social media that sells</span>
              <span className="rw-bc-title-italic">for Hyderabad real estate brands</span>
            </h1>
            <p className="rw-bc-lede" style={{ fontFamily: text }}>
              We run Instagram, Facebook, YouTube, LinkedIn, X, Threads and more,
              with creatives, calendars, and optional SEO / local visibility add-ons.
              Built for developers and sales brands that need a clear link to enquire.
            </p>
            <p className="rw-bc-proof" style={{ fontFamily: text }}>
              One brief. The right platforms. Content, ads, and discovery work that supports enquiries, not vanity likes.
            </p>
            <div className="rw-bc-hero-actions">
              <a href="#enquire" className="rw-cta" style={ctaCopper}>
                Enquire now
              </a>
              <Link to="/brandconsulting" className="rw-cta-secondary">
                Brand consulting
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
                  Social brief received
                </h2>
                <p className="rw-bc-note" style={{ fontFamily: text }}>
                  We will review your social media brief and get back to you on email or phone.
                </p>
                <button
                  type="button"
                  className="rw-cta"
                  style={{ ...ctaCopper, marginTop: 22 }}
                  onClick={() => {
                    setForm(emptyForm())
                    setStep(0)
                    setReached(0)
                    setStatus('idle')
                    startedRef.current = false
                  }}
                >
                  Submit another
                </button>
              </Reveal>
            ) : (
              <>
              <header className="rw-bc-intro">
                <p className="rw-bc-eyebrow" style={{ fontFamily: mono }}>Social brief</p>
                <h2 className="rw-bc-panel-title" style={{ fontFamily: serif }}>
                  Tell us about the social work
                </h2>
                <p className="rw-bc-note" style={{ fontFamily: text }}>
                  One section at a time. Platforms, goals, creatives, SEO / local / GEO add-ons.
                </p>
              </header>

              <form className="rw-bc-form is-stepper" onSubmit={onSubmit} noValidate ref={panelRef}>
                <BriefStepper
                  steps={STEPS}
                  current={step}
                  reached={reached}
                  onJump={goToStep}
                  ariaLabel="Social brief steps"
                />

                {(fieldErrors.length > 0 || error) && (
                  <div
                    className="rw-bc-alert"
                    role="alert"
                    tabIndex={-1}
                    ref={errorRef}
                    aria-labelledby="sm-error-title"
                  >
                    <h3 id="sm-error-title">There is a problem</h3>
                    {error ? <p>{error}</p> : null}
                    {fieldErrors.length > 0 && (
                      <ul>
                        {fieldErrors.map((row) => (
                          <li key={row.id}>
                            <a
                              href={`#sm-${row.id}`}
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
                    <label className="rw-form-field-wrap" htmlFor="sm-name">
                      <span className="rw-form-q-title">
                        Name <span className="rw-form-req">*</span>
                      </span>
                      <input
                        id="sm-name"
                        className="rw-form-field"
                        name="name"
                        autoComplete="name"
                        value={form.name}
                        onChange={set('name')}
                        aria-invalid={fieldErrors.some((row) => row.id === 'name')}
                        required
                      />
                    </label>

                    <label className="rw-form-field-wrap" htmlFor="sm-email">
                      <span className="rw-form-q-title">
                        Email <span className="rw-form-req">*</span>
                      </span>
                      <input
                        id="sm-email"
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

                    <label className="rw-form-field-wrap" htmlFor="sm-phone">
                      <span className="rw-form-q-title">
                        Phone <span className="rw-form-req">*</span>
                      </span>
                      <input
                        id="sm-phone"
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

                    <label className="rw-form-field-wrap" htmlFor="sm-role">
                      <span className="rw-form-q-title">
                        Your role <span className="rw-form-req">*</span>
                      </span>
                      <FormSelect
                        id="sm-role"
                        value={form.role}
                        options={ROLES}
                        placeholder="Select"
                        onChange={setPick('role')}
                        aria-invalid={fieldErrors.some((row) => row.id === 'role')}
                        required
                      />
                    </label>

                    <label className="rw-form-field-wrap" htmlFor="sm-company">
                      <span className="rw-form-q-title">
                        Company / developer <span className="rw-form-req">*</span>
                      </span>
                      <input
                        id="sm-company"
                        className="rw-form-field"
                        name="company"
                        autoComplete="organization"
                        value={form.company}
                        onChange={set('company')}
                        aria-invalid={fieldErrors.some((row) => row.id === 'company')}
                        required
                      />
                    </label>

                    <label className="rw-form-field-wrap" htmlFor="sm-projectName">
                      <span className="rw-form-q-title">
                        Project or brand name <span className="rw-form-req">*</span>
                      </span>
                      <input
                        id="sm-projectName"
                        className="rw-form-field"
                        name="projectName"
                        value={form.projectName}
                        onChange={set('projectName')}
                        aria-invalid={fieldErrors.some((row) => row.id === 'projectName')}
                        required
                      />
                    </label>

                    <label className="rw-form-field-wrap" htmlFor="sm-location">
                      <span className="rw-form-q-title">
                        City / location <span className="rw-form-req">*</span>
                      </span>
                      <input
                        id="sm-location"
                        className="rw-form-field"
                        name="location"
                        placeholder="e.g. Gachibowli, Hyderabad"
                        value={form.location}
                        onChange={set('location')}
                        aria-invalid={fieldErrors.some((row) => row.id === 'location')}
                        required
                      />
                    </label>

                    <label className="rw-form-field-wrap" htmlFor="sm-projectStage">
                      <span className="rw-form-q-title">
                        Stage <span className="rw-form-req">*</span>
                      </span>
                      <FormSelect
                        id="sm-projectStage"
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
                  <legend className="rw-bc-block-title">Social need</legend>
                  <div className="rw-form-panel rw-form-panel--compact rw-bc-grid">
                    {chipGroup(
                      'primaryNeeds',
                      'What do you need most?',
                      true,
                      PRIMARY_NEEDS,
                      'primaryNeeds',
                      null,
                      'Select one or more. End-to-end covers full management.',
                    )}

                    {chipGroup(
                      'platforms',
                      'Which platforms?',
                      true,
                      PLATFORMS,
                      'platforms',
                      null,
                      'Select all that apply.',
                    )}

                    <label className="rw-form-field-wrap rw-form-field-wrap--wide" htmlFor="sm-platformLinks">
                      <span className="rw-form-q-title">
                        Handles or page links <span className="rw-form-req">*</span>
                      </span>
                      <p className="rw-bc-hint">Paste Instagram, Facebook, YouTube, LinkedIn, X, Threads, GBP, etc.</p>
                      <textarea
                        id="sm-platformLinks"
                        className="rw-form-field rw-bc-message"
                        name="platformLinks"
                        rows={3}
                        value={form.platformLinks}
                        onChange={set('platformLinks')}
                        placeholder={'@handle or https://...\nOne per line is fine'}
                        aria-invalid={fieldErrors.some((row) => row.id === 'platformLinks')}
                        required
                      />
                    </label>

                    {chipGroup(
                      'helpAreas',
                      'Where do you need help?',
                      true,
                      HELP_AREAS,
                      'helpAreas',
                      null,
                      'Includes creatives, ads, SEO, local Maps, and GEO (AI search) add-ons.',
                    )}

                    {chipGroup(
                      'goals',
                      'Main goals',
                      true,
                      GOALS,
                      'goals',
                      null,
                      'Select all that apply.',
                    )}

                    <label className="rw-form-field-wrap" htmlFor="sm-cadence">
                      <span className="rw-form-q-title">
                        Posting cadence <span className="rw-form-req">*</span>
                      </span>
                      <FormSelect
                        id="sm-cadence"
                        value={form.cadence}
                        options={CADENCES}
                        placeholder="Select"
                        onChange={setPick('cadence')}
                        aria-invalid={fieldErrors.some((row) => row.id === 'cadence')}
                        required
                      />
                    </label>

                    <label className="rw-form-field-wrap" htmlFor="sm-timeline">
                      <span className="rw-form-q-title">
                        When do you want to start? <span className="rw-form-req">*</span>
                      </span>
                      <FormSelect
                        id="sm-timeline"
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
                  <legend className="rw-bc-block-title" id="sm-creativeAssets">
                    Creative and setup assets <span className="rw-form-req">*</span>
                  </legend>
                  <p className="rw-bc-hint rw-bc-hint--tight">
                    Mark Have or Need on every row, use Mark all shortcuts, or Skip for now with a reason.
                  </p>
                  <div
                    className="rw-bc-toolbar rw-bc-toolbar--mode"
                    role="radiogroup"
                    aria-label="Asset quick actions"
                  >
                    <button
                      type="button"
                      role="radio"
                      className={`rw-bc-mode-btn${form.assetsMode !== 'skipped' && CREATIVE_ASSETS.every((item) => form.creativeAssets[item.key] === 'have') ? ' is-on' : ''}`}
                      aria-checked={form.assetsMode !== 'skipped' && CREATIVE_ASSETS.every((item) => form.creativeAssets[item.key] === 'have')}
                      onClick={() => markAllAssets('have')}
                    >
                      All Have
                    </button>
                    <button
                      type="button"
                      role="radio"
                      className={`rw-bc-mode-btn${form.assetsMode !== 'skipped' && CREATIVE_ASSETS.every((item) => form.creativeAssets[item.key] === 'need') ? ' is-on' : ''}`}
                      aria-checked={form.assetsMode !== 'skipped' && CREATIVE_ASSETS.every((item) => form.creativeAssets[item.key] === 'need')}
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
                    <label className="rw-bc-other-field" htmlFor="sm-assetsSkipReason">
                      <span className="rw-form-q-title">
                        Why are you skipping this? <span className="rw-form-req">*</span>
                      </span>
                      <textarea
                        id="sm-assetsSkipReason"
                        className="rw-form-field rw-bc-message"
                        name="assetsSkipReason"
                        rows={3}
                        value={form.assetsSkipReason}
                        onChange={set('assetsSkipReason')}
                        placeholder="e.g. Will share assets on the call / Not sure yet / Agency already handling"
                        aria-invalid={fieldErrors.some((row) => row.id === 'assetsSkipReason')}
                        required
                      />
                    </label>
                  ) : null}
                  <div
                    className={`rw-bc-matrix${form.assetsMode === 'skipped' ? ' is-skipped' : ''}`}
                    role="group"
                    aria-labelledby="sm-creativeAssets"
                    aria-invalid={fieldErrors.some((row) => row.id === 'creativeAssets')}
                  >
                    <div className="rw-bc-matrix-head" aria-hidden="true">
                      <span className="rw-bc-matrix-asset">Asset</span>
                      <span className="rw-bc-matrix-choices">
                        <span className="rw-bc-matrix-choice">Have</span>
                        <span className="rw-bc-matrix-choice">Need</span>
                      </span>
                    </div>
                    <div className="rw-bc-matrix-body">
                      {CREATIVE_ASSETS.map((item) => {
                        const value = form.creativeAssets[item.key] || 'unset'
                        return (
                          <div key={item.key} className="rw-bc-matrix-row">
                            <span className="rw-bc-matrix-name" id={`sm-asset-${item.key}`}>
                              <span className="rw-bc-matrix-no">{item.no}</span>
                              {item.label}
                            </span>
                            <div
                              className="rw-bc-seg"
                              role="radiogroup"
                              aria-labelledby={`sm-asset-${item.key}`}
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
                    {chipGroup(
                      'challenges',
                      'Biggest social challenge right now',
                      true,
                      CHALLENGES,
                      'challenges',
                      'challengeOther',
                      'Select all that apply. Tap Other only if needed.',
                    )}
                    {chipGroup(
                      'extras',
                      'Anything else we should know?',
                      true,
                      EXTRA_NOTES,
                      'extras',
                      'extrasOther',
                      'Select at least one. Tap Other only if needed.',
                    )}
                  </div>
                </fieldset>
                )}

                {step === 4 && (
                <section className="rw-bc-block rw-bc-step-panel" aria-labelledby="sm-review-title">
                  <h3 id="sm-review-title" className="rw-bc-block-title">Review & send</h3>
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
                  <label className="rw-bc-consent" htmlFor="sm-privacyConsent">
                    <input
                      id="sm-privacyConsent"
                      type="checkbox"
                      checked={form.privacyConsent}
                      onChange={set('privacyConsent')}
                      aria-invalid={fieldErrors.some((row) => row.id === 'privacyConsent')}
                    />
                    <span style={{ fontFamily: text, fontSize: fs('13px') }}>
                      I agree to the{' '}
                      <Link to="/privacy-policy" target="_blank" rel="noreferrer">Privacy Policy</Link>
                      {' '}and agree that we may contact me about this enquiry.
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
                        {status === 'sending' ? 'Submitting…' : 'Submit'}
                      </button>
                    )}
                  </div>
                </div>
              </form>
              </>
            )}
          </div>
        </section>
      </main>

      <Footer links={FOOTER_LINKS} />
    </>
  )
}
