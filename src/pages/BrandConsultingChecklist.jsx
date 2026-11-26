import { useEffect, useMemo, useRef, useState } from 'react'
import Footer from '../components/Footer'
import Header from '../components/Header'
import Seo from '../components/Seo'
import { BRAND_CHECKLIST_SECTIONS, BRAND_CHECKLIST_TOTAL } from '../data/brand-consulting-checklist'
import { getErrorMessage, submitBrandConsultingChecklist } from '../data/api'
import { FOOTER_LINKS } from '../theme'
import { ctaCopper } from '../styles'
import '../form/form.css'
import './brand-checklist.css'

const META_FIELDS = [
  { id: 'clientProjectName', label: 'Client / project name', placeholder: 'Project or client name' },
  { id: 'location', label: 'Location', placeholder: 'Site address or area' },
  { id: 'visitedAt', label: 'Date and time', placeholder: 'e.g. 16 Nov 2026, 11:00 am' },
  { id: 'visitedBy', label: 'Visited by', placeholder: 'Our team member' },
  { id: 'personMet', label: 'Person met (name, role)', placeholder: 'Name and role on site', wide: true },
]

/** 0 = visit details, 1..N = sections, last = review + save */
const SECTION_COUNT = BRAND_CHECKLIST_SECTIONS.length
const STEP_META = 0
const STEP_REVIEW = SECTION_COUNT + 1
const STEP_TOTAL = SECTION_COUNT + 2

function emptyAnswers() {
  const map = {}
  for (const section of BRAND_CHECKLIST_SECTIONS) {
    for (const item of section.items) {
      map[item.no] = { checked: false, notes: '' }
    }
  }
  return map
}

function emptyMeta() {
  return {
    clientProjectName: '',
    location: '',
    visitedAt: '',
    visitedBy: '',
    personMet: '',
    overallNotes: '',
  }
}

function stepLabel(step) {
  if (step === STEP_META) return 'Visit details'
  if (step === STEP_REVIEW) return 'Review & save'
  const section = BRAND_CHECKLIST_SECTIONS[step - 1]
  return section ? `${section.no}. ${section.title}` : ''
}

export default function BrandConsultingChecklist() {
  const [meta, setMeta] = useState(emptyMeta)
  const [answers, setAnswers] = useState(() => emptyAnswers())
  const [step, setStep] = useState(STEP_META)
  const [openNotes, setOpenNotes] = useState(() => ({}))
  const [busy, setBusy] = useState(false)
  const [fieldErrors, setFieldErrors] = useState([])
  const [submitError, setSubmitError] = useState('')
  const [done, setDone] = useState(null)
  const errorRef = useRef(null)
  const panelRef = useRef(null)

  const checkedCount = useMemo(
    () => Object.values(answers).filter((row) => row.checked).length,
    [answers],
  )

  const pointProgress = BRAND_CHECKLIST_TOTAL ? checkedCount / BRAND_CHECKLIST_TOTAL : 0
  const stepProgress = STEP_TOTAL > 1 ? step / (STEP_TOTAL - 1) : 0

  useEffect(() => {
    if ((fieldErrors.length || submitError) && errorRef.current) {
      errorRef.current.focus()
    }
  }, [fieldErrors, submitError])

  useEffect(() => {
    if (panelRef.current) {
      panelRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [step])

  const setMetaField = (id) => (e) => {
    setMeta((prev) => ({ ...prev, [id]: e.target.value }))
    setFieldErrors((prev) => prev.filter((row) => row.id !== id))
  }

  const toggleItem = (no) => {
    setAnswers((prev) => ({
      ...prev,
      [no]: { ...prev[no], checked: !prev[no].checked },
    }))
  }

  const setNotes = (no, notes) => {
    setAnswers((prev) => ({
      ...prev,
      [no]: { ...prev[no], notes },
    }))
  }

  const toggleNotes = (no) => {
    setOpenNotes((prev) => ({ ...prev, [no]: !prev[no] }))
  }

  const sectionStats = (section) =>
    section.items.reduce((n, item) => n + (answers[item.no]?.checked ? 1 : 0), 0)

  const validateMeta = () => {
    const missing = META_FIELDS.filter((field) => !String(meta[field.id] || '').trim()).map((field) => ({
      id: field.id,
      label: field.label,
    }))
    setFieldErrors(missing)
    return missing.length === 0
  }

  const goNext = () => {
    setSubmitError('')
    if (step === STEP_META && !validateMeta()) return
    setFieldErrors([])
    setStep((s) => Math.min(STEP_REVIEW, s + 1))
  }

  const goBack = () => {
    setSubmitError('')
    setFieldErrors([])
    setStep((s) => Math.max(STEP_META, s - 1))
  }

  const goToStep = (next) => {
    if (next > STEP_META && !validateMeta()) return
    setFieldErrors([])
    setSubmitError('')
    setStep(next)
  }

  const resetForm = () => {
    setDone(null)
    setAnswers(emptyAnswers())
    setMeta(emptyMeta())
    setStep(STEP_META)
    setOpenNotes({})
    setFieldErrors([])
    setSubmitError('')
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setSubmitError('')
    if (!validateMeta()) {
      setStep(STEP_META)
      return
    }

    const items = []
    for (const section of BRAND_CHECKLIST_SECTIONS) {
      for (const item of section.items) {
        const row = answers[item.no] || { checked: false, notes: '' }
        items.push({
          no: item.no,
          sectionNo: section.no,
          sectionTitle: section.title,
          text: item.text,
          checked: Boolean(row.checked),
          notes: String(row.notes || '').trim(),
        })
      }
    }

    setBusy(true)
    try {
      const res = await submitBrandConsultingChecklist({
        clientProjectName: meta.clientProjectName.trim(),
        location: meta.location.trim(),
        visitedAt: meta.visitedAt.trim(),
        visitedBy: meta.visitedBy.trim(),
        personMet: meta.personMet.trim(),
        overallNotes: meta.overallNotes.trim(),
        items,
      })
      setDone(res)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (err) {
      setSubmitError(getErrorMessage(err) || 'Could not save the checklist. Try again.')
    } finally {
      setBusy(false)
    }
  }

  const activeSection = step >= 1 && step <= SECTION_COUNT ? BRAND_CHECKLIST_SECTIONS[step - 1] : null

  return (
    <>
      <Seo
        title="Brand consulting site visit checklist | Team RW"
        description="Internal marketing and branding site visit checklist."
        noindex
      />
      <Header />
      <main className="rw-form rw-bcl">
        <div className="rw-bcl-shell">
          <header className="rw-bcl-intro">
            <p className="rw-form-eyebrow">Internal · Sales Consulting</p>
            <h1 className="rw-form-h2">Site visit checklist</h1>
            <p className="rw-form-note">
              One section at a time. Tick what you covered, add notes if needed, then continue.
            </p>
          </header>

          {done ? (
            <div className="rw-form-panel rw-bcl-done" style={{ display: 'block' }}>
              <h2 className="rw-form-h2" style={{ marginTop: 0 }}>Checklist saved</h2>
              <p className="rw-form-note" style={{ marginTop: 12 }}>
                {done.checkedCount} of {done.totalCount} points marked done. Reference: {done.id}
              </p>
              <p className="rw-form-note" style={{ marginTop: 8 }}>No email was sent.</p>
              <button type="button" className="rw-cta" style={{ ...ctaCopper, marginTop: 24 }} onClick={resetForm}>
                Submit another
              </button>
            </div>
          ) : (
            <form onSubmit={onSubmit} ref={panelRef} className="rw-bcl-form">
              <div className="rw-bcl-rail" aria-label="Checklist progress">
                <div className="rw-bcl-rail-meta">
                  <div className="rw-bcl-rail-label">
                    Step <strong>{step + 1}</strong> / {STEP_TOTAL}
                    <span className="rw-bcl-rail-sep">·</span>
                    <span className="rw-bcl-rail-current">{stepLabel(step)}</span>
                  </div>
                  <div className="rw-bcl-bar" aria-hidden="true">
                    <div className="rw-bcl-bar-fill" style={{ transform: `scaleX(${Math.max(stepProgress, pointProgress * 0.35)})` }} />
                  </div>
                  <div className="rw-bcl-rail-sub">
                    Points checked <strong>{checkedCount}</strong> / {BRAND_CHECKLIST_TOTAL}
                  </div>
                </div>

                <div className="rw-bcl-stepper" role="navigation" aria-label="Checklist steps">
                  <button
                    type="button"
                    className={`rw-bcl-seg${step === STEP_META ? ' is-on' : ''}${validateMetaSilent(meta) ? ' is-done' : ''}`}
                    onClick={() => goToStep(STEP_META)}
                    aria-label="Visit details"
                    title="Visit details"
                  />
                  {BRAND_CHECKLIST_SECTIONS.map((section, i) => {
                    const s = i + 1
                    const doneCount = sectionStats(section)
                    const complete = doneCount === section.items.length && section.items.length > 0
                    return (
                      <button
                        key={section.no}
                        type="button"
                        className={`rw-bcl-seg${step === s ? ' is-on' : ''}${complete ? ' is-done' : ''}`}
                        onClick={() => goToStep(s)}
                        aria-label={`Section ${section.no}: ${section.title}`}
                        title={`${section.no}. ${section.title}`}
                      />
                    )
                  })}
                  <button
                    type="button"
                    className={`rw-bcl-seg${step === STEP_REVIEW ? ' is-on' : ''}`}
                    onClick={() => goToStep(STEP_REVIEW)}
                    aria-label="Review and save"
                    title="Review and save"
                  />
                </div>
              </div>

              {(fieldErrors.length > 0 || submitError) && (
                <div
                  className="rw-bcl-alert"
                  role="alert"
                  tabIndex={-1}
                  ref={errorRef}
                  aria-labelledby="bcl-error-title"
                >
                  <h2 id="bcl-error-title">There is a problem</h2>
                  {submitError ? (
                    <p className="rw-form-note" style={{ margin: 0 }}>{submitError}</p>
                  ) : (
                    <ul style={{ margin: 0, paddingLeft: 18 }}>
                      {fieldErrors.map((row) => (
                        <li key={row.id}>
                          <a href={`#bcl-${row.id}`}>{row.label} is required</a>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}

              {step === STEP_META && (
                <section className="rw-bcl-panel" aria-labelledby="bcl-step-meta">
                  <h2 id="bcl-step-meta" className="rw-bcl-panel-title">Visit details</h2>
                  <p className="rw-bcl-panel-lede">Fill these once. You can edit them later from step 1.</p>
                  <div className="rw-form-panel rw-form-panel--compact rw-bcl-meta-grid">
                    {META_FIELDS.map((field) => (
                      <label
                        key={field.id}
                        className={`rw-form-field-wrap${field.wide ? ' rw-form-field-wrap--wide' : ''}`}
                        htmlFor={`bcl-${field.id}`}
                        style={{ display: 'block' }}
                      >
                        <span className="rw-form-q-title">
                          {field.label} <span className="rw-form-req"> *</span>
                        </span>
                        <input
                          id={`bcl-${field.id}`}
                          className="rw-form-field"
                          value={meta[field.id]}
                          onChange={setMetaField(field.id)}
                          placeholder={field.placeholder}
                          required
                          aria-invalid={fieldErrors.some((row) => row.id === field.id)}
                        />
                      </label>
                    ))}
                  </div>
                </section>
              )}

              {activeSection && (
                <section className="rw-bcl-panel" aria-labelledby={`bcl-section-title-${activeSection.no}`}>
                  <div className="rw-bcl-panel-head">
                    <h2 id={`bcl-section-title-${activeSection.no}`} className="rw-bcl-panel-title">
                      {activeSection.no}. {activeSection.title}
                    </h2>
                    <span className="rw-bcl-panel-count">
                      {sectionStats(activeSection)}/{activeSection.items.length} checked
                    </span>
                  </div>
                  <div className="rw-bcl-section-body rw-bcl-section-body--flat">
                    {activeSection.items.map((item) => {
                      const row = answers[item.no] || { checked: false, notes: '' }
                      const notesId = `bcl-notes-${item.no}`
                      const notesOpen = Boolean(openNotes[item.no] || row.notes)
                      return (
                        <div
                          key={item.no}
                          className={`rw-bcl-item${row.checked ? ' is-checked' : ''}`}
                        >
                          <label className="rw-bcl-check">
                            <span className="rw-bcl-box">
                              <input
                                type="checkbox"
                                checked={row.checked}
                                onChange={() => toggleItem(item.no)}
                                aria-label={`Point ${item.no}: ${item.text}`}
                              />
                              <span className="rw-bcl-box-ui" aria-hidden="true">
                                <svg viewBox="0 0 12 12" fill="none">
                                  <path d="M2.2 6.2L4.8 8.8L9.8 3.2" stroke="#E8C97A" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              </span>
                            </span>
                            <span className="rw-bcl-check-text">
                              <span className="rw-bcl-num">{item.no}.</span>
                              {item.text}
                            </span>
                          </label>
                          <div className="rw-bcl-notes">
                            {!notesOpen ? (
                              <button
                                type="button"
                                className="rw-bcl-notes-toggle"
                                onClick={() => toggleNotes(item.no)}
                              >
                                Add note
                              </button>
                            ) : (
                              <>
                                <label htmlFor={notesId} className="sr-only">
                                  Notes for point {item.no}
                                </label>
                                <textarea
                                  id={notesId}
                                  className="rw-bcl-notes-field"
                                  rows={2}
                                  placeholder="Notes / observations"
                                  value={row.notes}
                                  onChange={(e) => setNotes(item.no, e.target.value)}
                                />
                              </>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </section>
              )}

              {step === STEP_REVIEW && (
                <section className="rw-bcl-panel" aria-labelledby="bcl-step-review">
                  <h2 id="bcl-step-review" className="rw-bcl-panel-title">Review & save</h2>
                  <p className="rw-bcl-panel-lede">
                    {checkedCount} of {BRAND_CHECKLIST_TOTAL} points checked across {SECTION_COUNT} sections.
                  </p>
                  <ul className="rw-bcl-review-list">
                    {BRAND_CHECKLIST_SECTIONS.map((section) => {
                      const n = sectionStats(section)
                      return (
                        <li key={section.no}>
                          <button type="button" className="rw-bcl-review-link" onClick={() => goToStep(section.no)}>
                            <span>{section.no}. {section.title}</span>
                            <span>{n}/{section.items.length}</span>
                          </button>
                        </li>
                      )
                    })}
                  </ul>
                  <label className="rw-bcl-overall" htmlFor="bcl-overallNotes">
                    <span className="rw-form-q-title">Overall notes</span>
                    <textarea
                      id="bcl-overallNotes"
                      className="rw-bcl-notes-field"
                      rows={4}
                      value={meta.overallNotes}
                      onChange={setMetaField('overallNotes')}
                      placeholder="Summary, risks, recommendations"
                    />
                  </label>
                </section>
              )}

              <div className="rw-bcl-foot">
                <div className="rw-bcl-foot-inner">
                  <button
                    type="button"
                    className="rw-bcl-nav-btn"
                    onClick={goBack}
                    disabled={step === STEP_META || busy}
                  >
                    Back
                  </button>

                  {step < STEP_REVIEW ? (
                    <button type="button" className="rw-cta" style={ctaCopper} onClick={goNext} disabled={busy}>
                      Continue
                    </button>
                  ) : (
                    <button type="submit" className="rw-cta" style={ctaCopper} disabled={busy}>
                      {busy ? 'Submitting…' : 'Submit'}
                    </button>
                  )}
                </div>
                <p className="rw-bcl-foot-hint">
                  Saves to database only · no email
                </p>
              </div>
            </form>
          )}
        </div>
      </main>
      <Footer links={FOOTER_LINKS} />
    </>
  )
}

function validateMetaSilent(meta) {
  return META_FIELDS.every((field) => String(meta[field.id] || '').trim())
}
