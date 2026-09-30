import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Footer from '../components/Footer'
import Header from '../components/Header'
import Seo from '../components/Seo'
import Reveal from '../components/Reveal'
import PageIntro from '../components/PageIntro'
import BorderGlow from '../components/BorderGlow'
import { submitBooking, CAREERS_INTEREST, isValidPhone } from '../data/booking'
import { fetchRoles } from '../data/jobs'
import { track } from '../data/analytics'
import {
  ANSWER_MAX, CHARACTER_QUESTIONS, LIKERT, likertLabel, HEXACO_TRAITS, HEXACO_STATEMENT_IDS,
} from '../data/careersApplication'
import { FOOTER_LINKS, mono, serif, text, WHATSAPP } from '../theme'
import { ctaCopper, eyebrow, fs, note, sectionRule } from '../styles'
import SuccessAnimation from '../components/SuccessAnimation'
import '../form/form.css'

const HEADLINE = [
  { text: 'Apply to ' },
  { text: 'Team RW.', italic: true, copper: true },
]

const EXPERIENCE_LEVELS = [
  'Fresher (0–1 years)', 'Junior (1–3 years)', 'Mid-Level (3–6 years)',
  'Senior (6–10 years)', 'Senior Manager (10+ years)', 'Other',
]
const CTC_OPTIONS = ['Prefer not to disclose', 'Below 5 LPA', '5–10 LPA', '10–20 LPA', '20+ LPA']
const NOTICE_OPTIONS = ['Immediate', '15 days', '30 days', '60 days', '90 days']
const RELOCATE_OPTIONS = ['Yes', 'No', 'Maybe, depending on the role']
const WORKMODE_OPTIONS = ['Onsite', 'Hybrid', 'Remote']
const SOURCE_OPTIONS = ['LinkedIn', 'Company website', 'Employee referral', 'Job portal', 'Social media', 'Other']

const RESUME_TYPES = '.pdf,.doc,.docx'
const RESUME_MAX = 5 * 1024 * 1024

/* The gold edge around each step's field panel. Same palette as the careers role
   cards, tuned softer: a form is a big filled surface, so the glow stays subtle
   and only really appears as the cursor tracks toward an edge. */
const FORM_GLOW = {
  backgroundColor: 'var(--card)',
  glowColor: '41 82 71',
  colors: ['#C39B53', '#E8C97A', '#A67C3D'],
  borderRadius: 4,
  glowRadius: 18,
  fillOpacity: 0.16,
  animated: false,
}

// The five steps of the wizard. Order here is the order shown in the tracker.
const STEP_META = [
  { key: 'about', label: 'About you' },
  { key: 'career', label: 'Career' },
  { key: 'questions', label: 'Questions' },
  { key: 'assessment', label: 'Assessment' },
  { key: 'wrapup', label: 'Wrap up' },
]
const LAST_STEP = STEP_META.length - 1

const INITIAL = {
  name: '', email: '', phone: '',
  role: '', experience: '', experienceCustom: '', linkedinUrl: '', portfolioUrl: '',
  currentCtc: '', expectedCtc: '', currentLocation: '', noticePeriod: '', relocation: '', workMode: '', applicationSource: '',
  qImpact: '', qDuties: '', qMotivation: '', qIntegrity: '', qSetback: '', qLoyalty: '', qFlexibility: '',
  ref1Name: '', ref1Number: '', ref1Relationship: '', ref2Name: '', ref2Number: '', ref2Relationship: '',
  message: '', privacyConsent: false,
}

/** A titled block of the form. Uses the same joined-panel styling as the other forms.
 *  `panel` carries the step-transition direction; the caller also keys the element on
 *  the step index so React remounts it and the entrance animation replays. */
function Section({ eyebrow: kicker, title, children, panel }) {
  return (
    <div
      className={panel ? `rw-step-panel rw-step-panel--${panel}` : undefined}
      style={{ marginTop: 'clamp(24px,3vw,32px)' }}
    >
      <div style={{ ...eyebrow, fontSize: fs('12px'), letterSpacing: '.2em', marginBottom: 6 }}>{kicker}</div>
      {title && <p style={{ ...note, marginBottom: 16, fontSize: fs('14px') }}>{title}</p>}
      <BorderGlow {...FORM_GLOW} className="rw-form-glow">
        <div className="rw-form-panel rw-form-panel--compact rw-form-panel--glow">
          {children}
        </div>
      </BorderGlow>
    </div>
  )
}

function TextField({ label, id, values, set, required, type = 'text', placeholder, wide }) {
  return (
    <label className={`rw-form-field-wrap${wide ? ' rw-form-field-wrap--wide' : ''}`} style={{ display: 'block' }}>
      <span className="rw-form-q-title">
        {label}
        {required ? <span className="rw-form-req"> *</span> : <span className="rw-form-optional"> (optional)</span>}
      </span>
      <input
        className="rw-form-field" type={type} style={{ marginTop: 10 }}
        placeholder={placeholder} value={values[id] || ''} onChange={set(id)}
      />
    </label>
  )
}

function SelectField({ label, id, values, set, options, required, wide }) {
  return (
    <div className={`rw-form-field-wrap${wide ? ' rw-form-field-wrap--wide' : ''}`}>
      <span className="rw-form-q-title">
        {label}
        {required ? <span className="rw-form-req"> *</span> : <span className="rw-form-optional"> (optional)</span>}
      </span>
      <select
        className="rw-form-field" style={{ marginTop: 10, appearance: 'none' }}
        value={values[id] || ''} onChange={set(id)}
      >
        <option value="">Select…</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  )
}

const CheckIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden>
    <path d="M4 12.5 9.5 18 20 6.5" />
  </svg>
)

/** Numbered progress tracker with a gold connecting line. Completed steps show a
 * check and can be clicked to jump back; steps ahead of the furthest reached are
 * locked. On mobile the labels collapse to just the active one. */
function Stepper({ steps, current, reached, onJump }) {
  return (
    <div className="rw-stepper" role="list" aria-label="Application progress">
      {steps.map((s, i) => {
        const state = i < current ? 'done' : i === current ? 'active' : 'todo'
        const clickable = i <= reached && i !== current
        return (
          <div key={s.key} className={`rw-step rw-step--${state}`} role="listitem">
            {i > 0 && <span className={`rw-step-line${i <= current ? ' is-filled' : ''}`} aria-hidden />}
            <button
              type="button"
              className="rw-step-dot"
              disabled={!clickable}
              aria-current={state === 'active' ? 'step' : undefined}
              aria-label={`Step ${i + 1}: ${s.label}`}
              onClick={() => clickable && onJump(i)}
            >
              {state === 'done' ? <CheckIcon /> : i + 1}
            </button>
            <span className="rw-step-label" style={{ fontFamily: mono }}>{s.label}</span>
          </div>
        )
      })}
    </div>
  )
}

export default function CareersApply() {
  const { search } = useLocation()
  const params = useMemo(() => new URLSearchParams(search), [search])
  const presetRole = params.get('role') || ''
  const presetJobId = params.get('jobId') || ''

  const [values, setValues] = useState(() => ({ ...INITIAL, role: presetRole }))
  const [hex, setHex] = useState({}) // { statementId: -2..2 }
  const [resume, setResume] = useState(null)
  const [roleOptions, setRoleOptions] = useState([])
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')
  const [referenceNo, setReferenceNo] = useState('')
  const [firstName, setFirstName] = useState('')
  const [step, setStep] = useState(0)
  const [reached, setReached] = useState(0) // furthest step unlocked
  const [dir, setDir] = useState('fwd') // slide direction for the step transition
  const honeypot = useRef('')
  const formTopRef = useRef(null)

  const set = (id) => (e) => setValues((prev) => ({ ...prev, [id]: e.target.value }))

  useEffect(() => {
    let live = true
    fetchRoles().then((rows) => { if (live) setRoleOptions(rows.map((r) => r.title)) })
    return () => { live = false }
  }, [])

  useEffect(() => {
    if (presetRole) setValues((prev) => ({ ...prev, role: presetRole }))
  }, [presetRole])

  useEffect(() => { track('careers_apply_view') }, [])

  const setResumeFile = (file) => {
    if (!file) { setResume(null); return }
    if (!/\.(pdf|docx?|DOC|DOCX|PDF)$/.test(file.name)) { setError('Resume must be a PDF, DOC or DOCX.'); return }
    if (file.size > RESUME_MAX) { setError('That resume is over 5MB. Please attach a smaller file.'); return }
    setError('')
    setResume(file)
  }

  // `!== undefined`, not truthiness: the neutral answer is 0, which is a valid choice.
  const hexComplete = HEXACO_STATEMENT_IDS.every((id) => hex[id] !== undefined)

  /** Validate one step; returns a message to show, or '' when the step is complete. */
  function validateStep(i) {
    if (i === 0) {
      const req = [
        ['name', 'your name'], ['phone', 'your phone number'], ['email', 'your email'],
        ['role', 'the role'], ['experience', 'your experience level'],
      ]
      for (const [f, l] of req) if (!String(values[f] || '').trim()) return `Please provide ${l}.`
      if (!isValidPhone(values.phone)) return 'Please enter a valid 10-digit phone number.'
      if (values.experience === 'Other' && !values.experienceCustom.trim()) return 'Please describe your experience.'
    }
    if (i === 1) {
      const req = [
        ['currentCtc', 'current CTC'], ['expectedCtc', 'expected CTC'], ['currentLocation', 'current location'],
        ['noticePeriod', 'notice period'], ['relocation', 'relocation preference'],
        ['workMode', 'work mode'], ['applicationSource', 'how you heard about us'],
      ]
      for (const [f, l] of req) if (!String(values[f] || '').trim()) return `Please provide ${l}.`
    }
    if (i === 2) {
      for (const q of CHARACTER_QUESTIONS) if (q.required && !values[q.id].trim()) return `Please answer: “${q.label}”.`
    }
    if (i === 3) {
      if (!hexComplete) return 'Please answer every statement in the assessment before continuing.'
    }
    if (i === 4) {
      if (!resume) return 'Please attach your resume.'
      if (!values.privacyConsent) return 'Please give consent to proceed.'
    }
    return ''
  }

  const goTo = (i) => {
    setError('')
    setDir(i > step ? 'fwd' : 'back')
    setStep(i)
    setReached((r) => Math.max(r, i))
    // Let the new step paint, then bring the tracker to the top of the viewport.
    requestAnimationFrame(() => formTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
  }

  const next = () => {
    const err = validateStep(step)
    if (err) { setError(err); return }
    if (step < LAST_STEP) goTo(step + 1)
  }
  const back = () => { if (step > 0) goTo(step - 1) }
  const jumpTo = (i) => { if (i <= reached) goTo(i) }

  async function handleSubmit(e) {
    e.preventDefault()
    // Enter / the primary button on any non-final step just advances.
    if (step !== LAST_STEP) { next(); return }
    if (honeypot.current?.value) { setStatus('done'); return }

    // Final guard: re-check every step so a jump-back edit can't slip an invalid one through.
    for (let i = 0; i <= LAST_STEP; i++) {
      const err = validateStep(i)
      if (err) { setError(err); goTo(i); return }
    }

    setError('')
    setStatus('sending')

    // Only the raw answers go up; the backend runs the HEXACO algorithm and
    // owns the trait scores, so a tampered client can't fake a personality result.
    const payload = {
      ...values,
      interest: CAREERS_INTEREST,
      ...(presetJobId && { jobId: presetJobId }),
      resume,
      website: honeypot.current?.value || '',
      hexacoAnswers: JSON.stringify(hex),
    }

    try {
      const res = await submitBooking(payload)
      setReferenceNo(res?.referenceNo || res?.reference || '')
      setFirstName(String(values.name || '').trim().split(/\s+/)[0] || '')
      // The trait scores and their read-back are for the hiring team, not the
      // applicant, so nothing is scored or rendered here — the raw answers go
      // up and the backend owns the result. Staff see it in the admin panel.
      setStatus('done')
      track('application_submitted', { applicationType: 'careers', source: 'careers_apply_page', role: values.role })
    } catch (err) {
      setError(err?.message || 'Something went wrong. Please try again.')
      setStatus('idle')
    }
  }

  const roleList = roleOptions.length ? roleOptions : (presetRole ? [presetRole] : [])

  return (
    <>
      <Seo route="/careers/apply" />
      <Header />

      <PageIntro
        eyebrow="CAREERS · APPLICATION"
        headline={HEADLINE}
        headlineStyle={{ fontSize: fs('clamp(38px,4.4vw,64px)') }}
        lede="One form, about ten minutes."
        intro="Tell us who you are and how you work. The short questions and the quick assessment matter as much as the resume. They are how we read judgement, integrity and fit."
        padding="80px 40px 20px"
      />

      <section style={{ ...sectionRule, background: 'var(--chip)', borderBottom: '1px solid var(--line)' }}>
        <div className="rw-pad" style={{ maxWidth: 880, margin: '0 auto', padding: 'clamp(40px,6vw,70px) 40px' }}>
          <Link to="/careers" style={{ ...eyebrow, fontSize: fs('12px'), color: 'var(--faded)', textDecoration: 'none' }}>← Back to open roles</Link>

          {status === 'done' ? (
            <Reveal delay={100} style={{ textAlign: 'center', paddingTop: 'clamp(40px,6vw,60px)' }}>
              {/* The thumbs-up replaces the old tick ring: it carries the same
                  "we got it" signal. Shown unconditionally, not tied to the
                  assessment, which is now scored for the hiring team only. */}
              <SuccessAnimation size={148} />

              {/* The reference leads: it's the one piece of information the
                  candidate needs to act on (quote it in a follow-up), so it sits
                  above the thank-you rather than trailing a heading. */}
              <div style={{ ...eyebrow, fontSize: fs('11px'), letterSpacing: '.2em', color: 'var(--copper)', marginTop: 26 }}>
                APPLICATION RECEIVED
              </div>

              {referenceNo && (
                <div style={{ fontFamily: mono, fontSize: fs('clamp(26px,4.2vw,40px)'), letterSpacing: '.04em', color: 'var(--ink)', marginTop: 10, wordBreak: 'break-word' }}>
                  {referenceNo}
                </div>
              )}

              <h3 style={{ fontFamily: serif, fontWeight: 400, fontSize: fs('clamp(21px,2.6vw,27px)'), color: 'var(--ink)', marginTop: referenceNo ? 14 : 10 }}>
                Thank you{firstName ? `, ${firstName}` : ''}.
              </h3>
              <p style={{ ...note, marginTop: 14, marginLeft: 'auto', marginRight: 'auto', maxWidth: '34em' }}>
                {referenceNo ? 'Quote that reference' : 'Keep this reference'} if you get in touch about this application. Someone from the team reads every one personally, and if there is a fit you will hear from us within a couple of working days.
              </p>

              <div style={{ display: 'flex', justifyContent: 'center', gap: 20, flexWrap: 'wrap', marginTop: 32 }}>
                <a className="rw-cta" style={{ ...ctaCopper }} href={WHATSAPP} target="_blank" rel="noreferrer">WHATSAPP THE TEAM</a>
                <Link to="/careers" className="rw-cta" style={{ ...ctaCopper, background: 'transparent', color: 'var(--ink)', border: '1px solid var(--line)' }}>BACK TO CAREERS</Link>
              </div>
            </Reveal>
          ) : (
            <form onSubmit={handleSubmit} style={{ marginTop: 'clamp(24px,3vw,32px)' }}>
              {/* Honeypot — humans never see this. */}
              <input ref={honeypot} type="text" name="website_hp" tabIndex={-1} autoComplete="off" aria-hidden="true"
                style={{ position: 'absolute', left: '-9999px', width: 1, height: 1 }} />

              <div ref={formTopRef} style={{ scrollMarginTop: 90 }}>
                <Stepper steps={STEP_META} current={step} reached={reached} onJump={jumpTo} />
              </div>

              {step === 0 && (
                <Section key="about" panel={dir} eyebrow="ABOUT YOU">
                  <TextField label="Full name" id="name" values={values} set={set} required placeholder="Your name" />
                  <TextField label="Phone" id="phone" values={values} set={set} required type="tel" placeholder="10-digit mobile" />
                  <TextField label="Email" id="email" values={values} set={set} required type="email" placeholder="you@email.com" />
                  <div className="rw-form-field-wrap">
                    <span className="rw-form-q-title">Role you are applying for <span className="rw-form-req"> *</span></span>
                    <select className="rw-form-field" style={{ marginTop: 10, appearance: 'none' }} value={values.role} onChange={set('role')}>
                      <option value="">Select a role…</option>
                      {roleList.map((r) => <option key={r} value={r}>{r}</option>)}
                      {values.role && !roleList.includes(values.role) && <option value={values.role}>{values.role}</option>}
                    </select>
                  </div>
                  <TextField label="LinkedIn profile" id="linkedinUrl" values={values} set={set} type="url" placeholder="https://linkedin.com/in/your-name" />
                  <TextField label="Portfolio or website" id="portfolioUrl" values={values} set={set} type="url" placeholder="https://yourportfolio.com" />
                  <SelectField label="Experience level" id="experience" values={values} set={set} options={EXPERIENCE_LEVELS} required wide />
                  {values.experience === 'Other' && (
                    <TextField label="Your experience" id="experienceCustom" values={values} set={set} required placeholder="e.g. 18 months in luxury retail" wide />
                  )}
                </Section>
              )}

              {step === 1 && (
                <Section key="career" panel={dir} eyebrow="CAREER DETAILS">
                  <SelectField label="Current CTC" id="currentCtc" values={values} set={set} options={CTC_OPTIONS} required />
                  <SelectField label="Expected CTC" id="expectedCtc" values={values} set={set} options={CTC_OPTIONS} required />
                  <TextField label="Current location" id="currentLocation" values={values} set={set} required placeholder="City, state" />
                  <SelectField label="Notice period" id="noticePeriod" values={values} set={set} options={NOTICE_OPTIONS} required />
                  <SelectField label="Open to relocate" id="relocation" values={values} set={set} options={RELOCATE_OPTIONS} required />
                  <SelectField label="Preferred work mode" id="workMode" values={values} set={set} options={WORKMODE_OPTIONS} required />
                  <SelectField label="How did you hear about us?" id="applicationSource" values={values} set={set} options={SOURCE_OPTIONS} required wide />
                </Section>
              )}

              {step === 2 && (
                <Section key="questions" panel={dir} eyebrow="IN YOUR WORDS" title="Short answers, around a line or two each. Be specific, a concrete example tells us more than a polished summary.">
                  {CHARACTER_QUESTIONS.map((q) => {
                    const val = values[q.id] || ''
                    return (
                      <label key={q.id} className="rw-form-field-wrap rw-form-field-wrap--wide" style={{ display: 'block' }}>
                        <span className="rw-form-q-title">
                          {q.label}
                          {q.required ? <span className="rw-form-req"> *</span> : <span className="rw-form-optional"> (optional)</span>}
                        </span>
                        <textarea
                          className="rw-form-field" rows={3} maxLength={ANSWER_MAX}
                          style={{ marginTop: 10, resize: 'vertical' }}
                          placeholder={q.placeholder} value={val} onChange={set(q.id)}
                        />
                        <span className="rw-form-help" style={{ textAlign: 'right', color: val.length >= ANSWER_MAX ? 'var(--copper)' : 'var(--faded)' }}>
                          {val.length}/{ANSWER_MAX}
                        </span>
                      </label>
                    )
                  })}
                </Section>
              )}

              {step === 3 && (
                <Section key="assessment" panel={dir} eyebrow="QUICK ASSESSMENT" title="There are no right answers, just be honest. Rate how much you agree with each statement.">
                  <div className="rw-form-field-wrap rw-form-field-wrap--wide" style={{ display: 'block' }}>
                    {HEXACO_TRAITS.map((trait) => (
                      <div key={trait.key} style={{ marginBottom: 18 }}>
                        {trait.statements.map((s) => (
                          <div key={s.id} className="rw-likert">
                            <p className="rw-likert-text" style={{ fontFamily: text }}>{s.text}</p>
                            <div className="rw-likert-scale" role="group" aria-label={s.text}>
                              {LIKERT.map((opt) => {
                                const on = Number(hex[s.id]) === opt.v
                                return (
                                  <button
                                    key={opt.v} type="button" title={opt.label} aria-pressed={on}
                                    className={`rw-likert-dot${on ? ' is-on' : ''}`}
                                    style={{ fontFamily: mono }}
                                    onClick={() => setHex((prev) => ({ ...prev, [s.id]: opt.v }))}
                                  >
                                    {likertLabel(opt.v)}
                                  </button>
                                )
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}
                    <div className="rw-likert-legend" style={{ fontFamily: mono }}>−2 = strongly disagree · 0 = neutral · +2 = strongly agree</div>
                  </div>
                </Section>
              )}

              {step === 4 && (
                // A div rather than a fragment so the transition class has something to sit on.
                <div key="wrapup" className={`rw-step-panel rw-step-panel--${dir}`}>
                  <Section eyebrow="REFERENCES" title="Optional. Please make sure anyone you list has agreed to be contacted.">
                    <TextField label="Reference 1: name" id="ref1Name" values={values} set={set} placeholder="Full name" />
                    <TextField label="Reference 1: number" id="ref1Number" values={values} set={set} type="tel" placeholder="Mobile number" />
                    <TextField label="Reference 1: relationship" id="ref1Relationship" values={values} set={set} placeholder="Former manager, colleague…" />
                    <TextField label="Reference 2: name" id="ref2Name" values={values} set={set} placeholder="Full name" />
                    <TextField label="Reference 2: number" id="ref2Number" values={values} set={set} type="tel" placeholder="Mobile number" />
                    <TextField label="Reference 2: relationship" id="ref2Relationship" values={values} set={set} placeholder="Former manager, colleague…" />
                  </Section>

                  <Section eyebrow="RESUME">
                    <div className="rw-form-field-wrap rw-form-field-wrap--wide">
                      <span className="rw-form-q-title">Resume / CV <span className="rw-form-req"> *</span></span>
                      {resume ? (
                        <div className="rw-file-preview" style={{ marginTop: 10 }}>
                          <span className="rw-file-preview-icon" aria-hidden>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6Z" /><path d="M14 2v6h6" />
                            </svg>
                          </span>
                          <span className="rw-file-preview-meta">
                            <strong>{resume.name}</strong>
                            <small>{(resume.size / 1024).toFixed(1)} KB</small>
                          </span>
                          <button type="button" className="rw-file-remove" onClick={() => setResume(null)} aria-label="Remove resume">×</button>
                        </div>
                      ) : (
                        <label className="rw-resume-dropzone" style={{ marginTop: 10 }}>
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                            <path d="M12 16V4m0 0L7.5 8.5M12 4l4.5 4.5" /><path d="M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3" />
                          </svg>
                          <span>Drag and drop your resume here</span>
                          <small>or click to browse · PDF, DOC or DOCX (Max 5MB)</small>
                          <input type="file" accept={RESUME_TYPES} onChange={(e) => { setResumeFile(e.target.files?.[0]); e.target.value = '' }} />
                        </label>
                      )}
                    </div>
                    <label className="rw-form-field-wrap rw-form-field-wrap--wide" style={{ display: 'block' }}>
                      <span className="rw-form-q-title">Anything else we should know? <span className="rw-form-optional"> (optional)</span></span>
                      <textarea className="rw-form-field" rows={3} style={{ marginTop: 10, resize: 'vertical' }}
                        placeholder="Anything about your experience, skills or situation that helps us read your application."
                        value={values.message} onChange={set('message')} />
                    </label>
                  </Section>

                  <label className="rw-career-consent" style={{ marginTop: 24 }}>
                    <input type="checkbox" checked={values.privacyConsent} onChange={(e) => setValues((p) => ({ ...p, privacyConsent: e.target.checked }))} />
                    <span>I consent to Team Rajiv Williams using my information for recruitment and selection purposes.</span>
                  </label>
                </div>
              )}

              {error && (
                <p style={{ fontFamily: text, fontWeight: 300, fontSize: fs('14px'), color: 'var(--copper)', marginTop: 18 }}>{error}</p>
              )}

              <div className="rw-step-nav">
                <button type="button" className="rw-step-back" onClick={back} disabled={step === 0 || status === 'sending'}>
                  <span aria-hidden>←</span> Back
                </button>
                <span className="rw-step-count" style={{ fontFamily: mono }}>
                  Step {step + 1} of {STEP_META.length} · {STEP_META[step].label}
                </span>
                {step < LAST_STEP ? (
                  <button type="button" className="rw-form-submit rw-cta rw-cta--live" onClick={next}>
                    CONTINUE <span className="rw-cta-arrow" aria-hidden>→</span>
                  </button>
                ) : (
                  <button type="submit" className="rw-form-submit rw-cta rw-cta--live" disabled={status === 'sending'}>
                    {status === 'sending' ? 'SENDING…' : 'SUBMIT APPLICATION'} <span className="rw-cta-arrow" aria-hidden>→</span>
                  </button>
                )}
              </div>
            </form>
          )}
        </div>
      </section>

      <Footer links={FOOTER_LINKS} />
    </>
  )
}
