import { useEffect, useMemo, useState } from 'react'
import { ASSESSMENT_TRACKS, TRACK_ORDER } from './tracks'
import { useReveal } from './useReveal'
import './form.css'

/* Fades and lifts children in on first sight; kept local so this folder imports nothing upward. */
function Reveal({ as: Tag = 'div', delay = 0, className = '', style, children, ...rest }) {
  const [ref, inView] = useReveal()

  return (
    <Tag
      ref={ref}
      className={`rw-form-reveal${inView ? ' is-in' : ''}${className ? ` ${className}` : ''}`}
      style={{ transitionDelay: `${delay}ms`, ...style }}
      {...rest}
    >
      {children}
    </Tag>
  )
}

/* Ensures `answers[id]` is never undefined, so inputs stay controlled. */
function blankAnswers(track) {
  return Object.fromEntries(track.questions.map((q) => [q.id, q.type === 'check' ? [] : '']))
}

const isAnswered = (q, value) => (q.type === 'check' ? value.length > 0 : String(value).trim() !== '')

const Arrow = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
)

/** Pre-consultation assessment: track picker, questionnaire, confirmation. Self-contained inside `src/form/`. */
export default function AssessmentForm({ initialTrack, onTrackChange, onSubmit, stickyOffset = 0 }) {
  const [trackKey, setTrackKey] = useState(ASSESSMENT_TRACKS[initialTrack] ? initialTrack : null)
  const track = trackKey ? ASSESSMENT_TRACKS[trackKey] : null

  const [answers, setAnswers] = useState(() => (track ? blankAnswers(track) : {}))
  const [sent, setSent] = useState(false)

  /* Scroll to top on each view change so a new track/confirmation starts visible. */
  useEffect(() => { window.scrollTo(0, 0) }, [trackKey, sent])

  const required = useMemo(() => (track ? track.questions.filter((q) => q.required) : []), [track])
  const done = required.filter((q) => isAnswered(q, answers[q.id] ?? '')).length
  const left = required.length - done

  function openTrack(key) {
    setTrackKey(key)
    setAnswers(blankAnswers(ASSESSMENT_TRACKS[key]))
    setSent(false)
    onTrackChange?.(key)
  }

  function reset() {
    setTrackKey(null)
    setAnswers({})
    setSent(false)
    onTrackChange?.(null)
  }

  const set = (id, value) => setAnswers((prev) => ({ ...prev, [id]: value }))

  const toggle = (id, option) => setAnswers((prev) => {
    const current = prev[id]
    return { ...prev, [id]: current.includes(option) ? current.filter((v) => v !== option) : [...current, option] }
  })

  function submit() {
    const payload = { track: trackKey, answers, submittedAt: new Date().toISOString() }
    if (onSubmit) onSubmit(payload)
    else console.log('RW assessment', payload)
    setSent(true)
  }

  /* ---------- 1. Track picker ---------- */
  if (!track) {
    return (
      <div className="rw-form">
        <section className="rw-form-pad rw-form-wrap" style={{ padding: '80px 40px 30px' }}>
          <Reveal className="rw-form-eyebrow" style={{ marginBottom: 30 }}>PRE-CONSULTATION ASSESSMENT</Reveal>

          <Reveal as="h1" delay={80} className="rw-form-h1" style={{ maxWidth: '15em' }}>
            Coaching your team, consulting on your process,{' '}
            <span className="rw-form-gold">or owning the sale outright.</span>
          </Reveal>

          <Reveal as="p" delay={140} className="rw-form-lede" style={{ marginTop: 28 }}>
            Where do you need us?
          </Reveal>

          <Reveal as="p" delay={180} className="rw-form-intro" style={{ marginTop: 16, maxWidth: '36em' }}>
            Pick a track below. A short set of questions is what lets us walk into the consultation already knowing your project — so the hour is spent on answers, not introductions.
          </Reveal>
        </section>

        <section className="rw-form-pad rw-form-wrap" style={{ padding: '10px 40px clamp(80px,10vw,120px)' }}>
          <div className="rw-form-tracks">
            {TRACK_ORDER.map((key, i) => {
              const t = ASSESSMENT_TRACKS[key]
              return (
                <Reveal key={key} delay={i * 90}>
                  <button type="button" className="rw-form-track" onClick={() => openTrack(key)}>
                    <span className="rw-form-track-num">{t.numeral}. {t.label}</span>
                    <span className="rw-form-track-title">{t.cardTitle}</span>
                    <span className="rw-form-track-body rw-form-note">{t.cardBody}</span>
                    <span className="rw-form-track-cta">{t.cardCta} <Arrow /></span>
                  </button>
                </Reveal>
              )
            })}
          </div>
        </section>
      </div>
    )
  }

  /* ---------- 3. Confirmation ---------- */
  if (sent) {
    return (
      <div className="rw-form">
        <section className="rw-form-pad rw-form-wrap rw-form-done">
          <Reveal>
            <div className="rw-form-ring">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
                <path d="M4 12.5 9.5 18 20 6.5" />
              </svg>
            </div>
            <h2 className="rw-form-h2" style={{ marginTop: 28 }}>Thank you.</h2>
            <p className="rw-form-note" style={{ marginTop: 16, marginLeft: 'auto', marginRight: 'auto', maxWidth: '30em' }}>
              {track.confirm}
            </p>
            <button type="button" className="rw-form-back" onClick={reset} style={{ marginTop: 34 }}>
              ← All tracks
            </button>
          </Reveal>
        </section>
      </div>
    )
  }

  /* ---------- 2. The questionnaire ---------- */
  return (
    <div className="rw-form">
      {/* Progress rail counts required questions only. */}
      <div className="rw-form-rail" style={{ top: stickyOffset }}>
        <div className="rw-form-pad rw-form-wrap rw-form-rail-inner">
          <button type="button" className="rw-form-back" onClick={reset}>← All tracks</button>
          <span className="rw-form-rail-label">{track.label} assessment · {done} of {required.length}</span>
          <div className="rw-form-bar">
            <div className="rw-form-bar-fill" style={{ transform: `scaleX(${required.length ? done / required.length : 0})` }} />
          </div>
        </div>
      </div>

      <section className="rw-form-pad rw-form-body">
        <Reveal className="rw-form-preamble">
          <div className="rw-form-eyebrow" style={{ fontSize: 13 }}>{track.intro.eyebrow}</div>
          <h1 className="rw-form-h2" style={{ marginTop: 18 }}>{track.intro.title}</h1>
          <p className="rw-form-thanks">{track.intro.thanks}</p>
          {track.intro.lines.map((line) => (
            <p key={line} className="rw-form-note" style={{ marginTop: 10, marginLeft: 'auto', marginRight: 'auto', maxWidth: '34em' }}>
              {line}
            </p>
          ))}
          <span className="rw-form-time">{track.intro.time}</span>
        </Reveal>

        <div className="rw-form-questions">
          {track.questions.map((q, i) => (
            <Reveal key={q.id} delay={Math.min(i, 4) * 60} className="rw-form-q">
              <div className="rw-form-q-title">
                {q.title}
                {q.required
                  ? <span className="rw-form-req"> *</span>
                  : <span className="rw-form-optional"> (optional)</span>}
              </div>
              {q.help && <span className="rw-form-help">{q.help}</span>}

              <div className="rw-form-controls">
                {q.type === 'pill' && (
                  <div className="rw-form-pills">
                    {q.options.map((option) => {
                      const on = answers[q.id] === option
                      return (
                        <button
                          key={option}
                          type="button"
                          aria-pressed={on}
                          className={`rw-form-pill${on ? ' is-on' : ''}`}
                          onClick={() => set(q.id, on ? '' : option)}
                        >
                          {option}
                        </button>
                      )
                    })}
                  </div>
                )}

                {q.type === 'check' && (
                  <div className="rw-form-checks">
                    {q.options.map((option) => {
                      const on = answers[q.id].includes(option)
                      return (
                        <label key={option} className={`rw-form-check${on ? ' is-on' : ''}`}>
                          <input type="checkbox" checked={on} onChange={() => toggle(q.id, option)} />
                          {option}
                        </label>
                      )
                    })}
                  </div>
                )}

                {q.type === 'input' && (
                  <input
                    className="rw-form-field"
                    type={q.inputType}
                    value={answers[q.id]}
                    placeholder={q.placeholder || ''}
                    onChange={(e) => set(q.id, e.target.value)}
                  />
                )}

                {q.type === 'text' && (
                  <textarea
                    className="rw-form-field"
                    rows={3}
                    value={answers[q.id]}
                    placeholder={q.placeholder || ''}
                    onChange={(e) => set(q.id, e.target.value)}
                  />
                )}
              </div>
            </Reveal>
          ))}
        </div>

        <div className="rw-form-submit-bar">
          <span className="rw-form-left">
            {left > 0 ? `${left} required question${left === 1 ? '' : 's'} left` : 'Ready to submit'}
          </span>
          <button type="button" className="rw-form-submit" onClick={submit} disabled={left > 0}>
            SUBMIT &amp; SCHEDULE CONSULTATION
          </button>
        </div>
      </section>
    </div>
  )
}
