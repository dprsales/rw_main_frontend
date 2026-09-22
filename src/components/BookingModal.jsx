import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import MagneticLink from './MagneticLink'
import SpecularButton from './SpecularButton'
import { mono, serif, text } from '../theme'
import { CAREERS_INTEREST, INTERESTS, isValidPhone, submitBooking } from '../data/booking'
import { labelFor } from '../data/guidance'
import { track } from '../data/analytics'
import { useFinder } from '../hooks/useFinder'
import FinderSteps from './FinderSteps'
import CtaButton from './CtaButton'

// Global booking modal, mounted once; CTAs call useBooking().open() instead of mailto:.
const BookingContext = createContext(() => {})

/** Call `open(preset)` from any CTA. `preset` optionally seeds the interest field. */
export function useBooking() {
  return useContext(BookingContext)
}

const DEFAULT_SPECULAR_PROPS = {
  size: 'lg',
  radius: 10,
  tintOpacity: 0,
  textColor: '#F2EFE9',
  lineColor: '#E8C97A',
  baseColor: '#C39B53',
  intensity: 1.1,
  shineSize: 12,
  shineFade: 45,
  proximity: 320,
  className: 'rw-specular-cta',
}

// Magnetic button that opens the booking modal instead of a mailto: link; role/jobId tag careers applications.
export function BookButton({ interest, role, jobId, roleOptions, guidance, source, skipQuestions, eyebrow: eyebrowText, title, subtitle, style, children, specular = false, specularProps, className = '', ...rest }) {
  const open = useBooking()
  const handleClick = () => open({ interest, role, jobId, roleOptions, guidance, source, skipQuestions, eyebrow: eyebrowText, title, subtitle })

  if (specular) {
    return (
      <SpecularButton onClick={handleClick} {...DEFAULT_SPECULAR_PROPS} className={`${DEFAULT_SPECULAR_PROPS.className} ${className}`.trim()} style={style} {...specularProps} {...rest}>
        {children}
      </SpecularButton>
    )
  }

  return (
    <MagneticLink
      as="button"
      type="button"
      onClick={handleClick}
      className={className || undefined}
      style={{ border: 'none', cursor: 'pointer', textAlign: 'center', ...style }}
      {...rest}
    >
      {children}
    </MagneticLink>
  )
}

// Page presets predate the select's option list; fold them onto it so the select shows a selection.
const INTEREST_ALIASES = {
  'Coaching': 'Sales Coaching',
  'Consulting': 'Sales Consulting',
  'RW Realty mandate': 'Sales Mandates',
}
const normaliseInterest = (value) => INTEREST_ALIASES[value] || value || ''

const EMPTY = {
  name: '', email: '', phone: '', company: '', website: '', interest: '', role: '', jobId: '', experience: '', experienceCustom: '',
  currentCtc: '', expectedCtc: '', currentLocation: '', noticePeriod: '', relocation: '', workMode: '',
  applicationSource: '',
  ref1Name: '', ref1Number: '', ref1Relationship: '', ref2Name: '', ref2Number: '', ref2Relationship: '',
  privacyConsent: false, linkedinUrl: '', portfolioUrl: '', message: '', resume: null,
}

// 10MB cap avoids timing out the upload of a phone-camera PDF on mobile data.
const RESUME_TYPES = '.pdf,.doc,.docx'
const RESUME_MAX_BYTES = 5 * 1024 * 1024

export function BookingProvider({ children }) {
  const [open, setOpen] = useState(false)
  const [preset, setPreset] = useState({})

  // Accepts a preset object or a bare interest string, for backward-compatible call sites.
  const show = useCallback((next = {}) => {
    setPreset(typeof next === 'string' ? { interest: next } : next || {})
    setOpen(true)
  }, [])
  const close = useCallback(() => setOpen(false), [])

  return (
    <BookingContext.Provider value={show}>
      {children}
      {open && <BookingModal preset={preset} onClose={close} />}
    </BookingContext.Provider>
  )
}

// Interests the modal already understands — opening with one of these skips the questions.
const KNOWN_INTERESTS = ['Sales Coaching', 'Sales Consulting', 'Sales Mandates', CAREERS_INTEREST]

function BookingModal({ preset, onClose }) {
  const presetInterest = normaliseInterest(preset.interest)
  // The questions run first unless the opener already knows who the visitor is
  // (finder card, a service page, careers) or asked to skip them.
  const askQuestions = !preset.guidance && !preset.skipQuestions && !KNOWN_INTERESTS.includes(presetInterest)
  const [phase, setPhase] = useState(askQuestions ? 'questions' : 'details')
  const finder = useFinder({ location: 'modal' })

  // `guidance` comes from the finder card (preset) or from the questions answered in here.
  const guidance = preset.guidance || (phase === 'details' && finder.done ? { ...finder.guidance, onEdit: 'modal' } : null)
  const [form, setForm] = useState({
    ...EMPTY,
    interest: presetInterest,
    role: preset.role || '',
    jobId: preset.jobId || '',
    source: preset.source || '',
  })

  // Questions finished inside the modal → carry the recommendation into the form and move on.
  useEffect(() => {
    if (phase !== 'questions' || !finder.done) return
    const outcome = finder.result.outcome
    setForm((f) => ({ ...f, interest: outcome.interest || f.interest, source: 'guided_finder' }))
    setPhase('details')
  }, [phase, finder.done, finder.result])

  const skipQuestions = () => {
    track('finder_abandoned', { lastStep: Object.keys(finder.answers).length, location: 'modal', skipped: true })
    finder.restart()
    setForm((f) => ({ ...f, source: f.source || 'finder_skip' }))
    setPhase('details')
  }
  const roleOptions = preset.roleOptions || []
  const [status, setStatus] = useState('idle') // idle | sending | sent | error
  const [error, setError] = useState('')
  const [repeat, setRepeat] = useState(false)
  const cardRef = useRef(null)

  // Esc closes; lock the page scroll while the modal is up. Tab stays inside the card,
  // and focus goes back to whatever opened the modal when it closes.
  useEffect(() => {
    const opener = document.activeElement
    const onKey = (e) => {
      if (e.key === 'Escape') { onClose(); return }
      if (e.key !== 'Tab' || !cardRef.current) return
      const focusable = cardRef.current.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
      if (!focusable.length) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
    }
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = previous
      window.removeEventListener('keydown', onKey)
      if (opener && typeof opener.focus === 'function') opener.focus()
    }
  }, [onClose])

  const startedRef = useRef(false)
  useEffect(() => {
    if (startedRef.current) return   // StrictMode double-invokes effects in dev
    startedRef.current = true
    track('booking_started', {
      source: preset.source || (guidance ? 'guided_finder' : 'site_cta'),
      interest: normaliseInterest(preset.interest) || undefined,
      recommendedService: guidance?.recommendedKey,
      visitorType: guidance?.who,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))
  const setConsent = (e) => setForm((f) => ({ ...f, privacyConsent: e.target.checked }))

  const isApplying = form.interest === CAREERS_INTEREST
  const selectedRole = roleOptions.find((role) => role === form.role)
  // A preset the select doesn't list (e.g. "General enquiry") still needs to be visible and submittable.
  const interestOptions = form.interest && !INTERESTS.includes(form.interest) ? [form.interest, ...INTERESTS] : INTERESTS

  const editAnswers = () => {
    if (guidance?.onEdit === 'modal') { finder.restart(); setPhase('questions'); return }
    onClose()
    guidance?.onEdit?.()
  }

  const setResume = (e) => {
    const file = e.target.files?.[0] || null
    if (file && file.size > RESUME_MAX_BYTES) {
      setError('That file is over 5MB. Please attach a smaller resume.')
      setStatus('error')
      e.target.value = ''
      return
    }
    if (status === 'error') { setStatus('idle'); setError('') }
    setForm((f) => ({ ...f, resume: file }))
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    if (status === 'sending') return

    // Validated client-side too, since the API's error wording isn't visitor-friendly.
    if (!isValidPhone(form.phone)) {
      setError('Please enter a 10-digit mobile number.')
      setStatus('error')
      return
    }

    setStatus('sending')
    setError('')
    try {
      const result = await submitBooking({ ...form, guidance })
      setRepeat(Boolean(result?.repeat))
      setStatus('sent')
      track('booking_completed', {
        source: form.source || (guidance ? 'guided_finder' : 'site_cta'),
        interest: form.interest || undefined,
        recommendedService: guidance?.recommendedKey,
        visitorType: guidance?.who,
        repeat: Boolean(result?.repeat),
        deep: false,
      })
    } catch (err) {
      setError(err?.message || 'Something went wrong. Please try again.')
      setStatus('error')
    }
  }

  const target = document.getElementById('rw-app-shell') || document.body

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Book a strategy call"
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 300,
        background: 'rgba(6,5,4,.78)', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'clamp(12px,4vw,24px)',
      }}
    >
      {/* max-height lives in global.css so it can use dvh with a vh fallback for mobile chrome */}
      <div
        ref={cardRef}
        className="rw-modal-card"
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'relative', width: isApplying ? 'min(650px, 100%)' : 'min(520px, 100%)', overflowY: 'auto',
          background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 4,
          boxShadow: 'var(--shadow-lift)', padding: isApplying ? 'clamp(22px, 3vw, 34px)' : 'clamp(26px, 4vw, 40px)',
        }}
      >
        <button
          type="button" onClick={onClose} aria-label="Close"
          style={{
            position: 'absolute', top: 16, right: 16, width: 38, height: 38, borderRadius: '50%',
            border: '1px solid var(--line)', background: 'transparent', color: 'var(--ink)',
            fontSize: 17, cursor: 'pointer', lineHeight: 1,
          }}
        >×</button>

        {phase === 'questions' ? (
          <>
            <div style={{ ...eyebrow, marginBottom: 12, paddingRight: 44 }}>{preset.eyebrow || 'BOOK A STRATEGY CALL'}</div>
            <h2 style={{ fontFamily: serif, fontWeight: 400, letterSpacing: '-.01em', fontSize: 'clamp(24px,3.2vw,32px)', color: 'var(--ink)', lineHeight: 1.15, marginBottom: 8 }}>
              First, a little about you.
            </h2>
            <p style={{ fontFamily: text, fontWeight: 300, fontSize: 14, lineHeight: 1.6, color: 'var(--faded)', marginBottom: 22 }}>
              One to three taps, so the call starts on the right subject. Then your details.
            </p>
            <FinderSteps finder={finder} compact>
              <div className="rw-finder-links" style={{ marginTop: 18 }}>
                {finder.stepIndex > 0 && <CtaButton variant="secondary" arrow="←" onClick={finder.back}>Back</CtaButton>}
                <CtaButton variant="secondary" onClick={skipQuestions}>Skip — just give me the form</CtaButton>
              </div>
            </FinderSteps>
          </>
        ) : status === 'sent' ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ ...eyebrow, marginBottom: 14 }}>{isApplying ? 'APPLICATION RECEIVED' : 'REQUEST RECEIVED'}</div>
            <h2 style={{ fontFamily: serif, fontWeight: 400, letterSpacing: '-.01em', fontSize: 'clamp(24px,3.2vw,32px)', color: 'var(--ink)', lineHeight: 1.15, marginBottom: 14 }}>
              Thank you — we’ll be in touch.
            </h2>
            <p style={{ fontFamily: text, fontWeight: 300, fontSize: 15, lineHeight: 1.6, color: 'var(--faded)', maxWidth: '28em', margin: '0 auto 24px' }}>
              {isApplying
                ? 'Your application has reached the team. If there’s a fit, you’ll hear from us within one business day.'
                : repeat
                  ? 'You’re already with us — we’ve added this request to your existing enquiry and the team has been notified.'
                  : 'Your request has reached the team. Expect a reply within one business day to arrange your strategy call.'}
            </p>
            <button type="button" onClick={onClose} style={{ ...ctaBtn }}>Close</button>
          </div>
        ) : (
          <>
            {isApplying ? (
              <>
                <div className="rw-career-modal-kicker">APPLY FOR</div>
                <h2 className="rw-career-modal-title">{selectedRole || 'Join Team RW'}</h2>
                <div className="rw-career-modal-meta">
                  <MetaIcon type="level" /> {selectedRole ? 'Selected role' : 'Open application'}
                  <MetaIcon type="briefcase" /> Full-time
                  <MetaIcon type="pin" /> Hyderabad
                </div>
              </>
            ) : (
              <>
                <div style={{ ...eyebrow, marginBottom: 12, paddingRight: 44 }}>{preset.eyebrow || 'BOOK A STRATEGY CALL'}</div>
                <h2 style={{ fontFamily: serif, fontWeight: 400, letterSpacing: '-.01em', fontSize: 'clamp(24px,3.2vw,32px)', color: 'var(--ink)', lineHeight: 1.15, marginBottom: 8 }}>
                  {preset.title || 'Let’s start the conversation.'}
                </h2>
                <p style={{ fontFamily: text, fontWeight: 300, fontSize: 14, lineHeight: 1.6, color: 'var(--faded)', marginBottom: guidance ? 14 : 24 }}>
                  {preset.subtitle || 'Share a few details and the team will reach out to schedule a call.'}
                </p>
                {guidance && (
                  <div className="rw-guidance-chips" aria-label="Your answers" style={{ marginBottom: 22 }}>
                    {guidance.who && <span className="rw-guidance-chip">{labelFor('who', guidance.who)}</span>}
                    {guidance.challenge && <span className="rw-guidance-chip">{labelFor('challenge', guidance.challenge)}</span>}
                    {guidance.goal && <span className="rw-guidance-chip">{labelFor('goal', guidance.goal)}</span>}
                    {guidance.recommended && <span className="rw-guidance-chip is-result">→ {guidance.recommended}</span>}
                    {guidance.onEdit && (
                      <button type="button" className="rw-guidance-chip is-edit" onClick={editAnswers}>edit</button>
                    )}
                  </div>
                )}
              </>
            )}

            <form onSubmit={onSubmit} className={isApplying ? 'rw-career-modal-form' : ''} style={{ display: 'grid', gap: 14 }}>
              <Field label="Name" required>
                <input required value={form.name} onChange={set('name')} style={inputStyle} placeholder="Your full name" autoFocus />
              </Field>
              <Field label="Email" required>
                <input required type="email" value={form.email} onChange={set('email')} style={inputStyle} placeholder="you@company.com" />
              </Field>
              {/* Required: leads endpoint rejects any phone that isn't exactly ten digits */}
              <Field label="Phone" required>
                <input
                  required type="tel" inputMode="numeric" autoComplete="tel"
                  value={form.phone} onChange={set('phone')} style={inputStyle}
                  placeholder="10-digit mobile number"
                />
              </Field>
              {!isApplying && (
                <Field label="Company / organisation">
                  <input value={form.company} onChange={set('company')} style={inputStyle} placeholder="Optional" autoComplete="organization" />
                </Field>
              )}
              {!isApplying && <Field label="I’m interested in">
                <select value={form.interest} onChange={set('interest')} style={{ ...inputStyle, appearance: 'none' }}>
                  <option value="">Select one…</option>
                  {interestOptions.map((i) => <option key={i} value={i}>{i}</option>)}
                </select>
              </Field>}
              {/* Honeypot: off-screen, never focusable; a filled value means a bot and the server drops it. */}
              <label aria-hidden="true" style={{ position: 'absolute', left: -9999, width: 1, height: 1, overflow: 'hidden' }}>
                Website
                <input type="text" name="website" tabIndex={-1} autoComplete="off" value={form.website} onChange={set('website')} />
              </label>
              {/* Only shown for careers: attaching a file routes to the applications endpoint */}
              {isApplying && (
                <Field label="Job role" required>
                  <select required value={form.role} onChange={set('role')} style={{ ...inputStyle, appearance: 'none' }}>
                    <option value="">Select a role…</option>
                    {roleOptions.map((option) => <option key={option} value={option}>{option}</option>)}
                  </select>
                </Field>
              )}
              {isApplying && (
                <>
                  <Field label="Experience level" required>
                    <select required value={form.experience} onChange={set('experience')} style={{ ...inputStyle, appearance: 'none' }}>
                      <option value="">Select your level…</option>
                      <option value="Fresher (0–1 years)">Fr (0–1 years)</option>
                      <option value="Junior (1–3 years)">Jr (1–3 years)</option>
                      <option value="Mid-Level (3–6 years)">Mid (3–6 years)</option>
                      <option value="Senior (6–10 years)">Sr (6–10 years)</option>
                      <option value="Senior Manager (10+ years)">Sr.Mgr (10+ years)</option>
                      <option value="Other">Other</option>
                    </select>
                  </Field>
                  {form.experience === 'Other' && (
                    <Field label="Your experience" required>
                      <input required value={form.experienceCustom} onChange={set('experienceCustom')} style={inputStyle} placeholder="e.g. 18 months in luxury retail" />
                    </Field>
                  )}
                </>
              )}
              {isApplying && (
                <>
                  <Field label="LinkedIn profile">
                    <input type="url" value={form.linkedinUrl} onChange={set('linkedinUrl')} style={inputStyle} placeholder="https://linkedin.com/in/your-name" />
                  </Field>
                  <Field label="Portfolio or website">
                    <input type="url" value={form.portfolioUrl} onChange={set('portfolioUrl')} style={inputStyle} placeholder="https://yourportfolio.com" />
                  </Field>
                </>
              )}
              {isApplying && (
                <>
                  <div className="rw-career-form-section">CAREER DETAILS</div>
                  <Field label="Current CTC" required>
                    <select required value={form.currentCtc} onChange={set('currentCtc')} style={{ ...inputStyle, appearance: 'none' }}>
                      <option value="">Select current CTC...</option>
                      <option value="Prefer not to disclose">Prefer not to disclose</option>
                      <option value="Below 5 LPA">Below 5 LPA</option>
                      <option value="5–10 LPA">5–10 LPA</option>
                      <option value="10–20 LPA">10–20 LPA</option>
                      <option value="20+ LPA">20+ LPA</option>
                    </select>
                  </Field>
                  <Field label="Expected CTC" required>
                    <select required value={form.expectedCtc} onChange={set('expectedCtc')} style={{ ...inputStyle, appearance: 'none' }}>
                      <option value="">Select expected CTC...</option>
                      <option value="Prefer not to disclose">Prefer not to disclose</option>
                      <option value="Below 5 LPA">Below 5 LPA</option>
                      <option value="5–10 LPA">5–10 LPA</option>
                      <option value="10–20 LPA">10–20 LPA</option>
                      <option value="20+ LPA">20+ LPA</option>
                    </select>
                  </Field>
                  <Field label="Current location" required>
                    <input required value={form.currentLocation} onChange={set('currentLocation')} style={inputStyle} placeholder="City, state" />
                  </Field>
                  <Field label="Notice period" required>
                    <select required value={form.noticePeriod} onChange={set('noticePeriod')} style={{ ...inputStyle, appearance: 'none' }}>
                      <option value="">Select notice period...</option>
                      <option value="Immediate">Immediate</option>
                      <option value="15 days">15 days</option>
                      <option value="30 days">30 days</option>
                      <option value="60 days">60 days</option>
                      <option value="90 days">90 days</option>
                    </select>
                  </Field>
                  <Field label="Open to relocate" required>
                    <select required value={form.relocation} onChange={set('relocation')} style={{ ...inputStyle, appearance: 'none' }}>
                      <option value="">Select an option...</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                      <option value="Maybe">Maybe, depending on the role</option>
                    </select>
                  </Field>
                  <Field label="Preferred work mode" required>
                    <select required value={form.workMode} onChange={set('workMode')} style={{ ...inputStyle, appearance: 'none' }}>
                      <option value="">Select work mode...</option>
                      <option value="Onsite">Onsite</option>
                      <option value="Hybrid">Hybrid</option>
                      <option value="Remote">Remote</option>
                    </select>
                  </Field>
                  <Field label="How did you hear about us?" required>
                    <select required value={form.applicationSource} onChange={set('applicationSource')} style={{ ...inputStyle, appearance: 'none' }}>
                      <option value="">Select a source...</option>
                      <option value="LinkedIn">LinkedIn</option>
                      <option value="Website">Company website</option>
                      <option value="Employee referral">Employee referral</option>
                      <option value="Job portal">Job portal</option>
                      <option value="Social media">Social media</option>
                      <option value="Other">Other</option>
                    </select>
                  </Field>
                  <div className="rw-career-form-section">PROFESSIONAL REFERENCES <span>(OPTIONAL)</span></div>
                  <p className="rw-reference-disclaimer">
                    Note: Please provide accurate reference details and ensure the individuals listed have consented to being contacted.
                  </p>
                  <div className="rw-career-reference-title">REFERENCE 1</div>
                  <Field label="Name">
                    <input value={form.ref1Name} onChange={set('ref1Name')} style={inputStyle} placeholder="Full name" />
                  </Field>
                  <Field label="Number">
                    <input type="tel" inputMode="numeric" value={form.ref1Number} onChange={set('ref1Number')} style={inputStyle} placeholder="Mobile number" />
                  </Field>
                  <Field label="Relationship">
                    <input value={form.ref1Relationship} onChange={set('ref1Relationship')} style={inputStyle} placeholder="Former manager, colleague..." />
                  </Field>
                  <div className="rw-career-reference-title">REFERENCE 2</div>
                  <Field label="Name">
                    <input value={form.ref2Name} onChange={set('ref2Name')} style={inputStyle} placeholder="Full name" />
                  </Field>
                  <Field label="Number">
                    <input type="tel" inputMode="numeric" value={form.ref2Number} onChange={set('ref2Number')} style={inputStyle} placeholder="Mobile number" />
                  </Field>
                  <Field label="Relationship">
                    <input value={form.ref2Relationship} onChange={set('ref2Relationship')} style={inputStyle} placeholder="Former manager, colleague..." />
                  </Field>
                </>
              )}

              {isApplying && (
                <>
                  <div className="rw-career-form-section">RESUME / CV</div>
                  <Field label="Resume / CV">
                    <label className="rw-resume-dropzone">
                      <MetaIcon type="clip" />
                      <span>{form.resume ? form.resume.name : 'Drag and drop your resume here'}</span>
                      <small>or click to browse · PDF, DOC, DOCX (Max 5MB)</small>
                      <input type="file" accept={RESUME_TYPES} onChange={setResume} />
                    </label>
                  </Field>
                </>
              )}

              <Field label={isApplying ? 'Additional information (optional)' : 'Message'}>
                <textarea value={form.message} onChange={set('message')} rows={isApplying ? 3 : 3} style={{ ...inputStyle, resize: 'vertical' }} placeholder={isApplying ? 'Tell us about your experience, skills or anything else we should know...' : 'What would you like to discuss? (optional)'} />
              </Field>

              {isApplying && (
                <label className="rw-career-consent">
                  <input type="checkbox" checked={form.privacyConsent} onChange={setConsent} required />
                  <span>I consent to Team Rajiv Williams using my information for recruitment and selection purposes.</span>
                </label>
              )}

              {status === 'error' && (
                <p style={{ fontFamily: mono, fontSize: 12, color: '#E5726A', letterSpacing: '.02em' }}>{error}</p>
              )}

              <button type="submit" disabled={status === 'sending'} className={`rw-cta ${isApplying ? 'rw-career-submit' : ''}`.trim()} style={{ ...ctaBtn, marginTop: 6, opacity: status === 'sending' ? 0.6 : 1, cursor: status === 'sending' ? 'default' : 'pointer' }}>
                {status === 'sending' ? 'Sending...' : isApplying ? 'Submit Application →' : 'Request my call'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>,
    target,
  )
}

function MetaIcon({ type }) {
  const paths = {
    level: <path d="M12 3 4 7l8 4 8-4-8-4Zm-6 7v5l6 3 6-3v-5M9 17v3h6v-3" />,
    briefcase: <path d="M4 8h16v11H4zM9 8V5h6v3M4 12h16" />,
    pin: <><path d="M12 21s6-5.2 6-11a6 6 0 1 0-12 0c0 5.8 6 11 6 11Z" /><circle cx="12" cy="10" r="2" /></>,
    clip: <><path d="m9 12.5 4.8-4.8a2.5 2.5 0 1 1 3.5 3.5l-6.1 6.1a4 4 0 0 1-5.7-5.7l6.1-6.1" /><path d="m8.5 15.5 5-5" /></>,
  }
  return <svg className="rw-meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>{paths[type]}</svg>
}

function Field({ label, required, children }) {
  return (
    <label style={{ display: 'grid', gap: 7 }}>
      <span style={{ fontFamily: mono, fontSize: 11, letterSpacing: '.12em', color: 'var(--faded)' }}>
        {label.toUpperCase()}{required && <span style={{ color: 'var(--copper)' }}> *</span>}
      </span>
      {children}
    </label>
  )
}

const eyebrow = { fontFamily: mono, fontSize: 15, letterSpacing: '.22em', color: 'var(--copper)' }

// 16px is a floor: iOS Safari zooms in on focus for smaller input text and never zooms back out.
const inputStyle = {
  width: '100%', boxSizing: 'border-box',
  background: 'var(--bg)', border: '1px solid var(--line)', borderRadius: 2,
  color: 'var(--ink)', fontFamily: text, fontWeight: 300, fontSize: 16, padding: '12px 14px', outline: 'none',
}

const ctaBtn = {
  display: 'inline-flex', width: '100%', alignItems: 'center', justifyContent: 'center',
  background: 'var(--gold-gradient)', color: '#16110a',
  fontFamily: mono, fontSize: 13, letterSpacing: '.1em',
  height: 48, padding: '0 30px', whiteSpace: 'nowrap', boxSizing: 'border-box',
  borderRadius: 10, border: '0 solid transparent', cursor: 'pointer',
}
