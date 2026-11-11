import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import BorderGlow from '../components/BorderGlow'
import { ASSESSMENT_TRACKS, TRACK_ORDER } from './tracks'
import { useReveal } from './useReveal'
import { useLang } from '../i18n/LangProvider'
import './form.css'

/* Same cursor-tracked gold edge as CareersApply. Replaces the flat copper spine. */
const FORM_GLOW = {
  backgroundColor: 'var(--card)',
  glowColor: '40 55 60',
  colors: ['#C39B53', '#E8C97A', '#A67C3D'],
  borderRadius: 4,
  glowRadius: 14,
  fillOpacity: 0.1,
  animated: false,
}

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

/**
 * Control by option count, not by packing every choice into chips:
 *  - 2–3 exclusive, or 4 short exclusive → one segmented bar (scale / yes-no)
 *  - 5+ exclusive, or 4 with long labels → branded dropdown (not native select)
 *  - multi-select stays chips, because a closed menu hides what is picked
 */
function controlKind(q) {
  if (q.type !== 'pill') return q.type
  const n = q.options.length
  const longest = Math.max(...q.options.map((option) => option.length))
  if (n <= 4 && longest <= 16) return 'segment'
  return 'select'
}

/**
 * Two-column layout: fields, dropdowns and short segments share a row.
 * Multi-select chip groups span it. A leftover short beside a spanning one
 * is widened so the panel has no holes and reading order stays the question order.
 */
const isHalf = (q) => q.type !== 'check'
function wideQuestions(questions) {
  const wide = new Set()
  let pending = null
  for (const q of questions) {
    // Coaching only: role is a multi-select chip group that sits beside Email.
    if (q.id === 'role' && q.type === 'check') { pending = null; continue }
    if (isHalf(q)) { pending = pending ? null : q; continue }
    if (pending) wide.add(pending.id)
    pending = null
    wide.add(q.id)
  }
  if (pending) wide.add(pending.id)
  return wide
}

function FormSelect({ id, value, options, placeholder = 'Select one…', onChange, labelFor }) {
  const reactId = useId()
  const show = (option) => (labelFor ? labelFor(option) : option)
  const uid = id || `rw-sel-${reactId.replace(/:/g, '')}`
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)
  const [pos, setPos] = useState(null)
  const [dropUp, setDropUp] = useState(false)
  const btn = useRef(null)
  const menu = useRef(null)
  const typeRef = useRef({ buf: '', at: 0 })
  const selectedIndex = options.indexOf(value)

  const place = () => {
    const el = btn.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const gap = 8
    const below = window.innerHeight - r.bottom - 16
    const above = r.top - 16
    const openUp = below < 200 && above > below
    setDropUp(openUp)
    setPos({
      position: 'fixed',
      left: Math.max(12, Math.min(r.left, window.innerWidth - r.width - 12)),
      width: r.width,
      maxHeight: Math.min(288, Math.max(120, openUp ? above : below)),
      ...(openUp
        ? { bottom: window.innerHeight - r.top + gap, top: 'auto' }
        : { top: r.bottom + gap, bottom: 'auto' }),
    })
  }

  useLayoutEffect(() => {
    if (!open) return undefined
    setActive(selectedIndex >= 0 ? selectedIndex : 0)
    place()
    const onMove = () => place()
    window.addEventListener('resize', onMove)
    window.addEventListener('scroll', onMove, true)
    return () => {
      window.removeEventListener('resize', onMove)
      window.removeEventListener('scroll', onMove, true)
    }
  }, [open, selectedIndex])

  useEffect(() => {
    if (!open) return undefined
    const onDoc = (event) => {
      if (btn.current?.contains(event.target) || menu.current?.contains(event.target)) return
      setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [open])

  useEffect(() => {
    if (!open) return
    menu.current?.querySelector(`[data-idx="${active}"]`)?.scrollIntoView({ block: 'nearest' })
  }, [open, active])

  function pick(option) {
    onChange(option)
    setOpen(false)
    btn.current?.focus()
  }

  function onKeyDown(event) {
    const { key } = event
    if (!open && (key === 'ArrowDown' || key === 'ArrowUp' || key === 'Enter' || key === ' ')) {
      event.preventDefault()
      setOpen(true)
      return
    }
    if (!open) return
    if (key === 'Escape') {
      event.preventDefault()
      setOpen(false)
      return
    }
    if (key === 'ArrowDown') {
      event.preventDefault()
      setActive((i) => (i + 1) % options.length)
      return
    }
    if (key === 'ArrowUp') {
      event.preventDefault()
      setActive((i) => (i <= 0 ? options.length - 1 : i - 1))
      return
    }
    if (key === 'Home') {
      event.preventDefault()
      setActive(0)
      return
    }
    if (key === 'End') {
      event.preventDefault()
      setActive(options.length - 1)
      return
    }
    if (key === 'Enter' || key === ' ') {
      event.preventDefault()
      if (options[active]) pick(options[active])
      return
    }
    if (key === 'Tab') {
      setOpen(false)
      return
    }
    if (key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
      const now = Date.now()
      const next = `${now - typeRef.current.at < 600 ? typeRef.current.buf : ''}${key.toLowerCase()}`
      typeRef.current = { buf: next, at: now }
      const idx = options.findIndex((option) => option.toLowerCase().startsWith(next))
      if (idx >= 0) setActive(idx)
    }
  }

  return (
    <div className={`rw-form-select${open ? ' is-open' : ''}${value ? ' is-picked' : ''}`}>
      <button
        ref={btn}
        type="button"
        id={uid}
        className="rw-form-field rw-form-select-btn"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-controls={`${uid}-list`}
        aria-activedescendant={open ? `${uid}-opt-${active}` : undefined}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={onKeyDown}
      >
        <span className="rw-form-select-label">{value ? show(value) : placeholder}</span>
        <svg className="rw-form-select-caret" width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
          <path d="M2.4 4.4 6 8l3.6-3.6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && pos && createPortal(
        <ul
          ref={menu}
          id={`${uid}-list`}
          className={`rw-form-select-menu${dropUp ? ' is-up' : ''}`}
          role="listbox"
          style={pos}
        >
          {options.map((option, i) => {
            const on = value === option
            return (
              <li key={option} role="none">
                <button
                  type="button"
                  id={`${uid}-opt-${i}`}
                  data-idx={i}
                  role="option"
                  aria-selected={on}
                  className={`rw-form-select-option${on ? ' is-on' : ''}${i === active ? ' is-active' : ''}`}
                  onMouseEnter={() => setActive(i)}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => pick(option)}
                >
                  <span>{show(option)}</span>
                  {on && (
                    <svg className="rw-form-select-check" width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
                      <path d="M2.5 7.2 5.6 10.2 11.5 3.8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </button>
              </li>
            )
          })}
        </ul>,
        document.body,
      )}
    </div>
  )
}

const isAnswered =(q, value) => (q.type === 'check' ? value.length > 0 : String(value).trim() !== '')

const Arrow = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
)

/** Pre-consultation assessment: track picker, questionnaire, confirmation. Self-contained inside `src/form/`. */
export default function AssessmentForm({ initialTrack, onTrackChange, onSubmit, stickyOffset = 0, prefill = {}, extraAnswers = {}, onFirstInput, onBack, returnTo }) {
  const { t } = useLang()
  const [trackKey, setTrackKey] = useState(ASSESSMENT_TRACKS[initialTrack] ? initialTrack : null)
  const track = trackKey ? ASSESSMENT_TRACKS[trackKey] : null

  // `prefill` seeds answers by question id (from the guided finder); `extraAnswers` ride along in the payload untouched.
  const [answers, setAnswers] = useState(() => (track ? { ...blankAnswers(track), ...prefill } : {}))
  const [sent, setSent] = useState(false)
  const [submitStatus, setSubmitStatus] = useState('idle')
  const [submitError, setSubmitError] = useState('')
  const submitLock = useRef(false)
  const isSubmitting = submitStatus === 'submitting'

  /* Scroll to top on each view change so a new track/confirmation starts visible. */
  useEffect(() => { window.scrollTo(0, 0) }, [trackKey, sent])

  const wide = useMemo(() => (track ? wideQuestions(track.questions) : new Set()), [track])
  const required = useMemo(() => (track ? track.questions.filter((q) => q.required) : []), [track])
  const done = required.filter((q) => isAnswered(q, answers[q.id] ?? '')).length
  const left = required.length - done

  function openTrack(key) {
    setTrackKey(key)
    setAnswers(blankAnswers(ASSESSMENT_TRACKS[key]))
    setSent(false)
    setSubmitStatus('idle')
    setSubmitError('')
    onTrackChange?.(key)
  }

  function reset() {
    if (submitLock.current) return

    // Deep-linked service forms return to the page that sent the visitor here.
    if (initialTrack && onBack) {
      onBack()
      return
    }

    setTrackKey(null)
    setAnswers({})
    setSent(false)
    setSubmitStatus('idle')
    setSubmitError('')
    onTrackChange?.(null)
  }

  const backLabel = initialTrack && onBack ? t('cta.back') : t('sale.all')

  // Optional analytics hook: the parent decides what (if anything) to record.
  const set = (id, value) => { onFirstInput?.(); setAnswers((prev) => ({ ...prev, [id]: value })) }

  const toggle = (id, option) => { onFirstInput?.(); setAnswers((prev) => {
    const current = prev[id]
    return { ...prev, [id]: current.includes(option) ? current.filter((v) => v !== option) : [...current, option] }
  }) }

  async function submit() {
    if (left > 0 || submitLock.current) return

    submitLock.current = true
    setSubmitStatus('submitting')
    setSubmitError('')
    const payload = { track: trackKey, answers: { ...answers, ...extraAnswers }, submittedAt: new Date().toISOString() }
    try {
      if (onSubmit) {
        await onSubmit(payload)
      } else {
        console.log('RW assessment', payload)
      }

      setSubmitStatus('idle')
      setSent(true)
    } catch (error) {
      console.error('Lead submission failed:', error)
      setSubmitError(error?.message || t('sale.err'))
      setSubmitStatus('error')
    } finally {
      submitLock.current = false
    }
  }

  const contact = q => q.id === 'name' || q.id === 'phone' || q.id === 'email'
  const qTitle = (q) => t(contact(q) ? `sale.q.contact.${q.id}.title` : `sale.q.${trackKey}.${q.id}.title`)
  const qPh = (q) => {
    const key = contact(q) ? `sale.q.contact.${q.id}.ph` : `sale.q.${trackKey}.${q.id}.ph`
    const next = t(key)
    return next === key ? (q.placeholder || '') : next
  }
  const qHelp = (q) => (q.help ? t(`sale.q.${trackKey}.${q.id}.help`) : '')
  const optLabel = (q, option) => {
    const i = (q.options || []).indexOf(option)
    if (i < 0) return option
    const key = `sale.opt.${trackKey}.${q.id}.${i}`
    const next = t(key)
    return next === key ? option : next
  }

  /* ---------- 1. Track picker ---------- */
  if (!track) {
    return (
      <div className="rw-form">
        <section className="rw-form-pad rw-form-wrap" style={{ padding: '80px 40px 30px' }}>
          <Reveal className="rw-form-eyebrow" style={{ marginBottom: 30 }}>{t('sale.eyebrow')}</Reveal>

          <Reveal as="h1" delay={80} className="rw-form-h1" style={{ maxWidth: '15em' }}>
            {t('sale.h1.a')}
            <span className="rw-form-gold">{t('sale.h1.b')}</span>
          </Reveal>

          <Reveal as="p" delay={140} className="rw-form-lede" style={{ marginTop: 28 }}>
            {t('sale.lede')}
          </Reveal>

          <Reveal as="p" delay={180} className="rw-form-intro" style={{ marginTop: 16, maxWidth: '36em' }}>
            {t('sale.intro')}
          </Reveal>
        </section>

        <section className="rw-form-pad rw-form-wrap" style={{ padding: '10px 40px clamp(80px,10vw,120px)' }}>
          <div className="rw-form-tracks">
            {TRACK_ORDER.map((key, i) => {
              const item = ASSESSMENT_TRACKS[key]
              return (
                <Reveal key={key} delay={i * 90}>
                  <button type="button" className="rw-form-track" onClick={() => openTrack(key)}>
                    <span className="rw-form-track-num">{item.numeral}. {t(`sale.track.${key}.label`)}</span>
                    <span className="rw-form-track-title">{t(`sale.track.${key}.cardTitle`)}</span>
                    <span className="rw-form-track-body rw-form-note">{t(`sale.track.${key}.cardBody`)}</span>
                    <span className="rw-form-track-cta">{t(`sale.track.${key}.cardCta`)} <Arrow /></span>
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
            <h2 className="rw-form-h2" style={{ marginTop: 28 }}>{t('sale.thanks')}</h2>
            <p className="rw-form-note" style={{ marginTop: 16, marginLeft: 'auto', marginRight: 'auto', maxWidth: '30em' }}>
              {t(`sale.track.${trackKey}.confirm`)}
            </p>
            <button type="button" className="rw-form-back" onClick={reset} style={{ marginTop: 34 }}>
              {backLabel}
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
          <button type="button" className="rw-form-back" onClick={reset} disabled={isSubmitting}>{backLabel}</button>
          <span className="rw-form-rail-label">{t('sale.rail', { label: t(`sale.track.${trackKey}.label`), done, total: required.length })}</span>
          <div className="rw-form-bar">
            <div className="rw-form-bar-fill" style={{ transform: `scaleX(${required.length ? done / required.length : 0})` }} />
          </div>
        </div>
      </div>

      <section className="rw-form-pad rw-form-body">
        <Reveal className="rw-form-preamble">
          <div className="rw-form-eyebrow" style={{ fontSize: 13 }}>{t(`sale.track.${trackKey}.eyebrow`)}</div>
          <h1 className="rw-form-h2" style={{ marginTop: 12 }}>{t(`sale.track.${trackKey}.title`)}</h1>
          {track.intro.thanks && <p className="rw-form-thanks">{t(`sale.track.${trackKey}.thanks`)}</p>}
          <p className="rw-form-note" style={{ marginTop: 6, marginLeft: 'auto', marginRight: 'auto', maxWidth: '36em' }}>
            {t(`sale.track.${trackKey}.line`)}
          </p>
          <span className="rw-form-time">{t(`sale.track.${trackKey}.time`)}</span>
        </Reveal>

        <BorderGlow {...FORM_GLOW} className="rw-form-glow">
          <div className="rw-form-questions rw-form-panel rw-form-panel--questions rw-form-panel--glow">
            {track.questions.map((q, i) => (
              <Reveal key={q.id} delay={Math.min(i, 4) * 60} className={`rw-form-field-wrap${wide.has(q.id) ? ' rw-form-field-wrap--wide' : ''}`}>
                <div className="rw-form-q-title">
                  {qTitle(q)}
                  {q.required
                    ? <span className="rw-form-req"> *</span>
                    : <span className="rw-form-optional"> {t('sale.optional')}</span>}
                </div>
                {q.help && <span className="rw-form-help">{qHelp(q)}</span>}

                <div className="rw-form-controls">
                  {controlKind(q) === 'select' && (
                    <FormSelect
                      id={`rw-sel-${q.id}`}
                      value={answers[q.id]}
                      options={q.options}
                      placeholder={t('sale.select')}
                      labelFor={(option) => optLabel(q, option)}
                      onChange={(option) => set(q.id, option)}
                    />
                  )}

                  {controlKind(q) === 'segment' && (
                    <div className="rw-form-segment" role="group" aria-label={qTitle(q)}>
                      {q.options.map((option) => {
                        const on = answers[q.id] === option
                        return (
                          <button
                            key={option}
                            type="button"
                            aria-pressed={on}
                            className={on ? 'is-on' : ''}
                            onClick={() => set(q.id, on ? '' : option)}
                          >
                            {optLabel(q, option)}
                          </button>
                        )
                      })}
                    </div>
                  )}

                  {q.type === 'check' && (
                    <div className={`rw-form-checks${q.id === 'role' ? ' rw-form-checks--single' : ''}`}>
                      {q.options.map((option) => {
                        const on = answers[q.id].includes(option)
                        return (
                          <label key={option} className={`rw-form-check${on ? ' is-on' : ''}`}>
                            <input type="checkbox" checked={on} onChange={() => toggle(q.id, option)} />
                            {optLabel(q, option)}
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
                      placeholder={qPh(q)}
                      onChange={(e) => set(q.id, e.target.value)}
                    />
                  )}

                  {q.type === 'text' && (
                    <textarea
                      className="rw-form-field"
                      rows={3}
                      value={answers[q.id]}
                      placeholder={qPh(q)}
                      onChange={(e) => set(q.id, e.target.value)}
                    />
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </BorderGlow>

        <div className="rw-form-submit-bar">
          <span className="rw-form-left" role="status" aria-live="polite">
            {isSubmitting
              ? t('sale.working')
              : left > 0
                ? (left === 1 ? t('sale.leftOne', { n: left }) : t('sale.left', { n: left }))
                : t('sale.ready')}
          </span>
          <button
            type="button"
            className="rw-form-submit rw-cta"
            onClick={submit}
            disabled={left > 0 || isSubmitting}
            aria-busy={isSubmitting}
            aria-describedby={submitStatus === 'error' ? 'rw-form-submit-error' : undefined}
          >
            {isSubmitting ? t('sale.submitting') : t('sale.submit')}
          </button>
        </div>
        {submitStatus === 'error' && (
          <p id="rw-form-submit-error" className="rw-form-submit-error" role="alert">
            {submitError} {t('sale.errKeep')}
          </p>
        )}
      </section>
    </div>
  )
}
