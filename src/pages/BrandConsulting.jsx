import { useRef, useState } from 'react'
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
  brandAssets: emptyAssets(),
  challenges: [],
  challengeOther: '',
  extras: [],
  extrasOther: '',
  website: '',
  privacyConsent: false,
})

export default function BrandConsulting() {
  const [form, setForm] = useState(emptyForm)
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState([])
  const [repeat, setRepeat] = useState(false)
  const errorRef = useRef(null)
  const startedRef = useRef(false)

  const markStarted = () => {
    if (startedRef.current) return
    startedRef.current = true
    track('lead_started', { source: 'site_cta', interest: INTEREST, page: '/brandingconsulting' })
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

  const toggleHelpArea = (area) => toggleList('helpAreas', null, area)
  const toggleChallenge = (item) => toggleList('challenges', 'challengeOther', item)
  const toggleExtra = (item) => toggleList('extras', 'extrasOther', item)

  const setAssetStatus = (key, next) => {
    markStarted()
    setForm((prev) => {
      const current = prev.brandAssets[key]
      // Tap again to clear.
      const statusValue = current === next ? 'unset' : next
      return {
        ...prev,
        brandAssets: { ...prev.brandAssets, [key]: statusValue },
      }
    })
    setFieldErrors((prev) => prev.filter((row) => row.id !== 'brandAssets'))
    if (status === 'error') {
      setStatus('idle')
      setError('')
    }
  }

  const validate = () => {
    const missing = []
    if (!form.name.trim()) missing.push({ id: 'name', label: 'Name' })
    if (!form.email.trim()) missing.push({ id: 'email', label: 'Email' })
    if (!isValidPhone(form.phone)) missing.push({ id: 'phone', label: 'Phone (10 digits)' })
    if (!form.brandNeed) missing.push({ id: 'brandNeed', label: 'What you need' })
    if (!form.helpAreas.length) missing.push({ id: 'helpAreas', label: 'Areas of help' })
    const answeredAssets = Object.values(form.brandAssets).filter((value) => value === 'have' || value === 'need')
    if (!answeredAssets.length) missing.push({ id: 'brandAssets', label: 'Brand assets (We have / We need)' })
    if (!form.challenges.length) missing.push({ id: 'challenges', label: 'Biggest brand challenge' })
    if (form.challenges.includes('Other') && !form.challengeOther.trim()) {
      missing.push({ id: 'challengeOther', label: 'Other challenge detail' })
    }
    if (form.extras.includes('Other') && !form.extrasOther.trim()) {
      missing.push({ id: 'extrasOther', label: 'Other note detail' })
    }
    if (!form.privacyConsent) missing.push({ id: 'privacyConsent', label: 'Privacy consent' })
    setFieldErrors(missing)
    return missing.length === 0
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
    if (!validate()) {
      setStatus('error')
      setError('Please fix the highlighted fields.')
      requestAnimationFrame(() => errorRef.current?.focus())
      return
    }

    setStatus('sending')
    setError('')
    try {
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
        brandAssets: BRAND_ASSETS.map((item) => ({
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
        page: '/brandingconsulting',
      })
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (err) {
      setStatus('error')
      setError(getErrorMessage(err) || 'Could not send your enquiry. Try again.')
      track('lead_submission_failed', {
        source: 'brand_consulting_enquiry',
        interest: INTEREST,
        page: '/brandingconsulting',
        errorCategory: errorCategory(err),
      })
      requestAnimationFrame(() => errorRef.current?.focus())
    }
  }

  return (
    <>
      <Seo route="/brandingconsulting" />
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
              16 years of extensive expertise in selling inventory across Hyderabad.
              We speak the real estate language and we understand the psychology required to move your inventory.
            </p>
            <p className="rw-bc-proof" style={{ fontFamily: text }}>
              Team Rajiv Williams brand consulting has helped various developers move hundreds of crores of inventory.
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

        <section id="enquire" className="rw-bc-form-section rw-pad">
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
                    setStatus('idle')
                    setRepeat(false)
                    startedRef.current = false
                  }}
                >
                  Send another brief
                </button>
              </Reveal>
            ) : (
              <form className="rw-bc-panel" onSubmit={onSubmit} noValidate>
                <header className="rw-bc-panel-head">
                  <p className="rw-bc-eyebrow" style={{ fontFamily: mono }}>Brand brief</p>
                  <h2 className="rw-bc-panel-title" style={{ fontFamily: serif }}>
                    Tell us about the brand work
                  </h2>
                  <p className="rw-bc-note" style={{ fontFamily: text }}>
                    Short brand brief for Team RW. Mark Have or Need on your assets below.
                  </p>
                </header>

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
                            <a href={`#bc-${row.id}`}>{row.label} is required</a>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}

                <fieldset className="rw-bc-block">
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
                      <span className="rw-form-q-title">Your role</span>
                      <FormSelect
                        id="bc-role"
                        value={form.role}
                        options={ROLES}
                        placeholder="Select"
                        onChange={setPick('role')}
                      />
                    </label>

                    <label className="rw-form-field-wrap" htmlFor="bc-company">
                      <span className="rw-form-q-title">Company / developer</span>
                      <input
                        id="bc-company"
                        className="rw-form-field"
                        name="company"
                        autoComplete="organization"
                        value={form.company}
                        onChange={set('company')}
                      />
                    </label>

                    <label className="rw-form-field-wrap" htmlFor="bc-projectName">
                      <span className="rw-form-q-title">Project name</span>
                      <input
                        id="bc-projectName"
                        className="rw-form-field"
                        name="projectName"
                        value={form.projectName}
                        onChange={set('projectName')}
                      />
                    </label>

                    <label className="rw-form-field-wrap" htmlFor="bc-location">
                      <span className="rw-form-q-title">City / location</span>
                      <input
                        id="bc-location"
                        className="rw-form-field"
                        name="location"
                        placeholder="e.g. Gachibowli, Hyderabad"
                        value={form.location}
                        onChange={set('location')}
                      />
                    </label>

                    <label className="rw-form-field-wrap" htmlFor="bc-projectStage">
                      <span className="rw-form-q-title">Project stage</span>
                      <FormSelect
                        id="bc-projectStage"
                        value={form.projectStage}
                        options={PROJECT_STAGES}
                        placeholder="Select"
                        onChange={setPick('projectStage')}
                      />
                    </label>
                  </div>
                </fieldset>

                <fieldset className="rw-bc-block">
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
                      <p className="rw-bc-hint">Select all that apply.</p>
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
                      <span className="rw-form-q-title">When do you want to start?</span>
                      <FormSelect
                        id="bc-timeline"
                        value={form.timeline}
                        options={TIMELINES}
                        placeholder="Select"
                        onChange={setPick('timeline')}
                      />
                    </label>
                  </div>
                </fieldset>

                <fieldset className="rw-bc-block">
                  <legend className="rw-bc-block-title" id="bc-brandAssets">
                    Brand assets <span className="rw-form-req">*</span>
                  </legend>
                  <p className="rw-bc-hint rw-bc-hint--tight">
                    Mark Have or Need for every asset below.
                  </p>
                  <div
                    className="rw-bc-matrix"
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
                              >
                                Have
                              </button>
                              <button
                                type="button"
                                role="radio"
                                className={`rw-bc-seg-btn${value === 'need' ? ' is-on' : ''}`}
                                aria-checked={value === 'need'}
                                onClick={() => setAssetStatus(item.key, 'need')}
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

                <fieldset className="rw-bc-block">
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
                    >
                      <span id="bc-extras-label" className="rw-form-q-title">
                        Anything else we should know?
                      </span>
                      <p className="rw-bc-hint">Optional. Tap Other only if needed.</p>
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

                <div className="rw-bc-footer">
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

                  <button
                    type="submit"
                    className="rw-cta rw-bc-submit"
                    style={ctaCopper}
                    disabled={status === 'sending'}
                  >
                    {status === 'sending' ? 'Sending...' : 'Send brand brief'}
                  </button>
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
