import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import MagneticLink from './MagneticLink'
import SpecularButton from './SpecularButton'
import { mono, serif, text } from '../theme'
import { CAREERS_INTEREST, isValidPhone, submitBooking } from '../data/booking'

// Global booking modal, mounted once; CTAs call useBooking().open() instead of mailto:.
const BookingContext = createContext(() => {})

/** Call `open(preset)` from any CTA. `preset` optionally seeds the interest field. */
export function useBooking() {
  return useContext(BookingContext)
}

const DEFAULT_SPECULAR_PROPS = {
  size: 'lg',
  radius: 4,
  tintOpacity: 0,
  textColor: '#F2EFE9',
  lineColor: '#E8C97A',
  baseColor: 'rgba(195,155,83,.55)',
  intensity: 1.1,
  shineSize: 12,
  shineFade: 45,
  proximity: 320,
  className: 'rw-specular-cta',
}

// Magnetic button that opens the booking modal instead of a mailto: link; role/jobId tag careers applications.
export function BookButton({ interest, role, jobId, roleOptions, style, children, specular = false, specularProps, className = '', ...rest }) {
  const open = useBooking()
  const handleClick = () => open({ interest, role, jobId, roleOptions })

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
      style={{ border: 'none', cursor: 'pointer', textAlign: 'center', ...style }}
      {...rest}
    >
      {children}
    </MagneticLink>
  )
}

const INTERESTS = ['Coaching', 'Consulting', 'RW Realty mandate', CAREERS_INTEREST, 'Something else']

const EMPTY = {
  name: '', email: '', phone: '', interest: '', role: '', jobId: '', experience: '', experienceCustom: '',
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

function BookingModal({ preset, onClose }) {
  const [form, setForm] = useState({
    ...EMPTY,
    interest: preset.interest || '',
    role: preset.role || '',
    jobId: preset.jobId || '',
  })
  const roleOptions = preset.roleOptions || []
  const [status, setStatus] = useState('idle') // idle | sending | sent | error
  const [error, setError] = useState('')

  // Esc closes; lock the page scroll while the modal is up.
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = previous
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))
  const setConsent = (e) => setForm((f) => ({ ...f, privacyConsent: e.target.checked }))

  const isApplying = form.interest === CAREERS_INTEREST
  const selectedRole = roleOptions.find((role) => role === form.role)

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
      await submitBooking(form)
      setStatus('sent')
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

        {status === 'sent' ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ ...eyebrow, marginBottom: 14 }}>{isApplying ? 'APPLICATION RECEIVED' : 'REQUEST RECEIVED'}</div>
            <h2 style={{ fontFamily: serif, fontWeight: 400, letterSpacing: '-.01em', fontSize: 'clamp(24px,3.2vw,32px)', color: 'var(--ink)', lineHeight: 1.15, marginBottom: 14 }}>
              Thank you — we’ll be in touch.
            </h2>
            <p style={{ fontFamily: text, fontWeight: 300, fontSize: 15, lineHeight: 1.6, color: 'var(--faded)', maxWidth: '28em', margin: '0 auto 24px' }}>
              {isApplying
                ? 'Your application has reached the team. If there’s a fit, you’ll hear from us within one business day.'
                : 'Your request has reached the team. Expect a reply within one business day to arrange your strategy call.'}
            </p>
            <button type="button" onClick={onClose} style={{ ...ctaBtn }}>Close</button>
          </div>
        ) : (
          <>
            {isApplying ? (
              <>
                <div className="rw-career-modal-kicker">APPLY FOR</div>
                <h2 className="rw-career-modal-title">{selectedRole || 'Join the team'}</h2>
                <div className="rw-career-modal-meta">
                  <MetaIcon type="level" /> {selectedRole ? 'Selected role' : 'Open application'}
                  <MetaIcon type="briefcase" /> Full-time
                  <MetaIcon type="pin" /> Hyderabad
                </div>
              </>
            ) : (
              <>
                <div style={{ ...eyebrow, marginBottom: 12, paddingRight: 44 }}>BOOK A STRATEGY CALL</div>
                <h2 style={{ fontFamily: serif, fontWeight: 400, letterSpacing: '-.01em', fontSize: 'clamp(24px,3.2vw,32px)', color: 'var(--ink)', lineHeight: 1.15, marginBottom: 8 }}>
                  Let’s start the conversation.
                </h2>
                <p style={{ fontFamily: text, fontWeight: 300, fontSize: 14, lineHeight: 1.6, color: 'var(--faded)', marginBottom: 24 }}>
                  Share a few details and the team will reach out to schedule a call.
                </p>
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
              {!isApplying && <Field label="I’m interested in">
                <select value={form.interest} onChange={set('interest')} style={{ ...inputStyle, appearance: 'none' }}>
                  <option value="">Select one…</option>
                  {INTERESTS.map((i) => <option key={i} value={i}>{i}</option>)}
                </select>
              </Field>}
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
                  <Field label="Experience" required>
                    <select required value={form.experience} onChange={set('experience')} style={{ ...inputStyle, appearance: 'none' }}>
                      <option value="">Select experience…</option>
                      <option value="0–1 years">0–1 years</option>
                      <option value="1–3 years">1–3 years</option>
                      <option value="3–6 years">3–6 years</option>
                      <option value="6–10 years">6–10 years</option>
                      <option value="10+ years">10+ years</option>
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

              <button type="submit" disabled={status === 'sending'} className={isApplying ? 'rw-career-submit' : ''} style={{ ...ctaBtn, marginTop: 6, opacity: status === 'sending' ? 0.6 : 1, cursor: status === 'sending' ? 'default' : 'pointer' }}>
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
  display: 'inline-block', width: '100%', textAlign: 'center', border: 'none',
  background: 'var(--gold-gradient)', color: '#fff',
  fontFamily: mono, fontSize: 13, letterSpacing: '.1em', padding: '16px 30px', borderRadius: 2, cursor: 'pointer',
}
