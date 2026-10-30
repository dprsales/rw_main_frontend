import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link, Navigate, useLocation, useParams } from 'react-router-dom'
import Footer from '../components/Footer'
import Header from '../components/Header'
import Seo from '../components/Seo'
import Reveal from '../components/Reveal'
import PageIntro from '../components/PageIntro'
import BorderGlow from '../components/BorderGlow'
import { submitBooking, CAREERS_INTEREST, isValidPhone } from '../data/booking'
import { CAREER_CATEGORIES, CAREER_ROLES } from '../data/content'
import { careerRolePath, careerRoleSlug, fetchRoles, findRoleBySlug, roleWorkMode } from '../data/jobs'
import { track } from '../data/analytics'
import {
  ANSWER_MAX, CHARACTER_QUESTIONS, LIKERT, likertLabel, HEXACO_TRAITS, HEXACO_STATEMENT_IDS,
} from '../data/careersApplication'
import {
  readDraft, writeDraft, clearDraft, hasDraftContent, readResumeFile, saveResumeFile, deleteResumeFile,
} from '../data/draftStore'
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
const NOTICE_OPTIONS = ['Immediate', '15 days', '30 days', '60 days', '90 days']
const CTC_HINT = 'Type annual CTC in LPA. Example: 8 LPA. Freshers can enter 0.'
const RELOCATE_OPTIONS = ['Yes', 'No', 'Maybe, depending on the role']
const SOURCE_OPTIONS = ['LinkedIn', 'Company website', 'Employee referral', 'Job portal', 'Social media', 'Other']
const SOURCE_HINT = 'If someone at Team RW told you about this role, choose Employee referral.'
const REFERRAL_HINT = 'Type the Team RW name. This is not a professional reference - those come later.'
const SOURCE_OTHER_HINT = 'A short line is enough. Example: Naukri, a friend outside the team.'

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
const NOT_AVAILABLE = 'Not available'
const PROFILE_TIP = 'A LinkedIn profile & a portfolio help us process your application faster.'
const REFERENCE_HINT = 'Not the Team RW person who referred you.'
const DISCLAIMER_POINTS = [
  'Team RW reviews every application in full.',
  'Fill every field with genuine details. All fields are required.',
]

const AI_TOOL_OPTIONS = [
  'Write an email',
  'Write a letter or note',
  'Create an image',
  'Summarise a document',
  'Research a topic',
  'Draft a presentation',
  'Edit or improve writing',
  'Create a short video or reel',
]

function chosenAiTools(values) {
  const picked = (Array.isArray(values?.aiTools) ? values.aiTools : [])
    .map((v) => String(v || '').trim())
    .filter((v) => v && v !== 'Other')
  const other = String(values?.aiToolsOther || '').trim()
  if (other && !picked.includes(other)) return [...picked, other]
  return picked
}

function focusControl(field) {
  if (!field || typeof document === 'undefined') return
  const el = document.getElementById(field)
  if (!el) return
  el.scrollIntoView({ behavior: 'smooth', block: 'center' })
  if (typeof el.focus === 'function') el.focus({ preventScroll: true })
}

const INITIAL = {
  name: '', email: '', phone: '',
  role: '', experience: '', experienceCustom: '', linkedinUrl: '', portfolioUrl: '',
  currentCtc: '', expectedCtc: '', currentLocation: '', noticePeriod: '', relocation: '', workMode: '',
  applicationSource: '', referredBy: '', applicationSourceOther: '',
  qImpact: '', qDuties: '', qMotivation: '', qIntegrity: '', qSetback: '', qLoyalty: '', qFlexibility: '',
  ref1Name: '', ref1Number: '', ref1Relationship: '', ref2Name: '', ref2Number: '', ref2Relationship: '',
  message: '', privacyConsent: false, disclaimerRead: false,
  socialMediaSavvy: false, aiTools: [], aiToolsOther: '',
}

/** Clamp a persisted step index into range, so a stale draft can't open on a step
 *  that no longer exists (steps get added and removed between releases). */
function safeStep(n) {
  return Math.min(LAST_STEP, Math.max(0, Math.floor(Number(n) || 0)))
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

function TextField({ label, id, values, set, setValues, required, type = 'text', placeholder, wide, invalid, allowMissing, hint }) {
  const na = values[id] === NOT_AVAILABLE
  const filled = String(values[id] || '').trim() !== ''
  const hintId = hint ? `${id}-hint` : undefined
  return (
    <div className={`rw-form-field-wrap${wide ? ' rw-form-field-wrap--wide' : ''}`} style={{ display: 'block' }}>
      <span className="rw-form-q-title">
        {label}
        {required ? <span className="rw-form-req"> *</span> : <span className="rw-form-optional"> (optional)</span>}
      </span>
      <span className="rw-clearable">
        <input
          id={id}
          className={`rw-form-field${invalid ? ' is-invalid' : ''}`}
          type={na ? 'text' : type}
          style={{ marginTop: 10 }}
          placeholder={placeholder}
          value={na ? NOT_AVAILABLE : (values[id] || '')}
          onChange={set(id)}
          disabled={na}
          aria-invalid={invalid || undefined}
          aria-describedby={hintId}
        />
        {filled && !na && (
          <button
            type="button" className="rw-field-clear" tabIndex={-1}
            aria-label={`Clear ${label}`} title={`Clear ${label}`}
            onClick={() => setValues((prev) => ({ ...prev, [id]: '' }))}
          >
            ×
          </button>
        )}
      </span>
      {hint && <span id={hintId} className="rw-form-help">{hint}</span>}
      {allowMissing && (
        <button
          type="button"
          className={`rw-na${na ? ' is-on' : ''}`}
          aria-pressed={na}
          onClick={() => setValues((prev) => ({ ...prev, [id]: na ? '' : NOT_AVAILABLE }))}
        >
          {na ? 'Undo — I have this' : "I don't have this"}
        </button>
      )}
    </div>
  )
}

function SelectField({ label, id, values, set, setValues, options, required, wide, invalid, hint }) {
  const filled = String(values[id] || '').trim() !== ''
  const current = values[id] || ''
  const hintId = hint ? `${id}-hint` : undefined
  return (
    <div className={`rw-form-field-wrap${wide ? ' rw-form-field-wrap--wide' : ''}`}>
      <span className="rw-form-q-title">
        {label}
        {required ? <span className="rw-form-req"> *</span> : <span className="rw-form-optional"> (optional)</span>}
      </span>
      <span className="rw-clearable">
        <select
          id={id}
          className={`rw-form-field${invalid ? ' is-invalid' : ''}`}
          style={{ marginTop: 10, appearance: 'none' }}
          value={current}
          onChange={set(id)}
          aria-invalid={invalid || undefined}
          aria-describedby={hintId}
        >
          <option value="">Select…</option>
          {options.map((o) => <option key={o} value={o}>{o}</option>)}
          {current && !options.includes(current) && <option value={current}>{current}</option>}
        </select>
        {filled && (
          <button
            type="button" className="rw-field-clear" tabIndex={-1}
            aria-label={`Clear ${label}`} title={`Clear ${label}`}
            onClick={() => setValues((prev) => ({ ...prev, [id]: '' }))}
          >
            ×
          </button>
        )}
      </span>
      {hint && <span id={hintId} className="rw-form-help">{hint}</span>}
    </div>
  )
}

function uniqueRolesByTitle(roles, extraTitle) {
  const seen = new Set()
  const out = []
  for (const role of roles || []) {
    const title = String(role.title || '').trim()
    if (!title) continue
    const key = title.toLowerCase()
    if (seen.has(key)) continue
    seen.add(key)
    out.push({ title, category: role.category || 'Other' })
  }
  if (extraTitle && !seen.has(String(extraTitle).toLowerCase())) {
    out.push({ title: extraTitle, category: 'Other' })
  }
  return out
}

function RoleSearchField({ id, roles, value, invalid, onSelect, onClear }) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const [pos, setPos] = useState(null)
  const input = useRef(null)
  const menu = useRef(null)

  const list = useMemo(() => uniqueRolesByTitle(roles, value), [roles, value])
  const groups = useMemo(() => {
    const q = query.trim().toLowerCase()
    const filtered = list.filter((role) => (
      !q
      || role.title.toLowerCase().includes(q)
      || role.category.toLowerCase().includes(q)
    ))
    const grouped = []
    for (const category of CAREER_CATEGORIES) {
      const items = filtered.filter((role) => role.category === category)
      if (items.length) grouped.push({ category, items })
    }
    const rest = filtered.filter((role) => !CAREER_CATEGORIES.includes(role.category))
    if (rest.length) grouped.push({ category: 'Other', items: rest })
    return grouped
  }, [list, query])
  const flat = groups.flatMap((group) => group.items)

  const place = () => {
    const el = input.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const gap = 6
    const below = window.innerHeight - r.bottom - 16
    const above = r.top - 16
    const openUp = below < 280 && above > below
    const maxHeight = Math.min(360, Math.max(160, openUp ? above : below))
    setPos({
      left: Math.max(12, r.left),
      width: r.width,
      maxHeight,
      ...(openUp
        ? { bottom: window.innerHeight - r.top + gap, top: 'auto' }
        : { top: r.bottom + gap, bottom: 'auto' }),
    })
  }

  useLayoutEffect(() => {
    if (!open) return undefined
    place()
    const on = () => place()
    window.addEventListener('resize', on)
    window.addEventListener('scroll', on, true)
    return () => {
      window.removeEventListener('resize', on)
      window.removeEventListener('scroll', on, true)
    }
  }, [open, query, groups.length])

  useEffect(() => {
    if (!open) return undefined
    const onDoc = (e) => {
      if (input.current?.contains(e.target) || menu.current?.contains(e.target)) return
      setOpen(false)
      setQuery('')
    }
    const onKey = (e) => {
      if (e.key !== 'Escape') return
      setOpen(false)
      setQuery('')
    }
    document.addEventListener('mousedown', onDoc)
    window.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDoc)
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  useLayoutEffect(() => {
    if (!open) return
    menu.current?.querySelector('.rw-role-option.is-active')?.scrollIntoView({ block: 'nearest' })
  }, [active, open])

  const pick = (title) => {
    onSelect(title)
    setQuery('')
    setOpen(false)
  }

  const onKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (!open) { setOpen(true); setActive(0); return }
      setActive((i) => Math.min(i + 1, Math.max(flat.length - 1, 0)))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter') {
      if (open && flat[active]) {
        e.preventDefault()
        pick(flat[active].title)
      }
    }
  }

  return (
    <div className="rw-form-field-wrap">
      <span className="rw-form-q-title">Role you are applying for <span className="rw-form-req"> *</span></span>
      <span className="rw-clearable">
        <input
          ref={input}
          id={id}
          className={`rw-form-field${invalid ? ' is-invalid' : ''}`}
          style={{ marginTop: 10 }}
          role="combobox"
          aria-expanded={open}
          aria-autocomplete="list"
          aria-controls={`${id}-list`}
          aria-activedescendant={open && flat[active] ? `${id}-opt-${active}` : undefined}
          autoComplete="off"
          placeholder={open ? 'Type to find a role…' : 'Select or search a role…'}
          value={open ? query : (value || '')}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); setActive(0) }}
          onFocus={() => { setQuery(''); setOpen(true); setActive(0) }}
          onKeyDown={onKeyDown}
          aria-invalid={invalid || undefined}
        />
        {value && !open && (
          <button
            type="button"
            className="rw-field-clear"
            tabIndex={-1}
            aria-label="Clear the role"
            title="Clear the role"
            onClick={() => { onClear(); setQuery(''); input.current?.focus() }}
          >
            ×
          </button>
        )}
      </span>
      {open && pos && createPortal(
        <div
          ref={menu}
          id={`${id}-list`}
          className="rw-role-menu"
          role="listbox"
          style={pos}
        >
          {groups.length === 0 && (
            <div className="rw-role-empty">No roles match that search.</div>
          )}
          {groups.map((group) => (
            <div key={group.category} className="rw-role-group">
              <div className="rw-role-group-label">{group.category}</div>
              {group.items.map((role) => {
                const index = flat.findIndex((item) => item.title === role.title)
                return (
                  <button
                    key={role.title}
                    type="button"
                    id={`${id}-opt-${index}`}
                    role="option"
                    aria-selected={value === role.title}
                    className={`rw-role-option${value === role.title ? ' is-on' : ''}${index === active ? ' is-active' : ''}`}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => pick(role.title)}
                  >
                    {role.title}
                  </button>
                )
              })}
            </div>
          ))}
        </div>,
        document.getElementById('rw-app-shell') || document.body,
      )}
    </div>
  )
}

function AiToolsField({ values, setValues, invalid }) {
  const [open, setOpen] = useState(false)
  const [pos, setPos] = useState(null)
  const btn = useRef(null)
  const menu = useRef(null)
  const picked = Array.isArray(values.aiTools) ? values.aiTools : []
  const otherOn = picked.includes('Other') || Boolean(String(values.aiToolsOther || '').trim())
  const summary = chosenAiTools(values)
  const label = summary.length ? summary.join(', ') : 'Select what you can do with AI…'

  const place = () => {
    const el = btn.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const gap = 6
    const below = window.innerHeight - r.bottom - 16
    const above = r.top - 16
    const openUp = below < 280 && above > below
    const maxHeight = Math.min(400, openUp ? above : below)
    setPos({
      left: Math.max(12, r.left),
      width: r.width,
      maxHeight,
      ...(openUp
        ? { bottom: window.innerHeight - r.top + gap, top: 'auto' }
        : { top: r.bottom + gap, bottom: 'auto' }),
    })
  }

  useLayoutEffect(() => {
    if (!open) return undefined
    place()
    const on = () => place()
    window.addEventListener('resize', on)
    window.addEventListener('scroll', on, true)
    return () => {
      window.removeEventListener('resize', on)
      window.removeEventListener('scroll', on, true)
    }
  }, [open])

  useEffect(() => {
    if (!open) return undefined
    const onDoc = (e) => {
      if (btn.current?.contains(e.target) || menu.current?.contains(e.target)) return
      setOpen(false)
    }
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('mousedown', onDoc)
    window.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDoc)
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  const toggle = (opt) => {
    setValues((prev) => {
      const cur = Array.isArray(prev.aiTools) ? prev.aiTools : []
      const on = cur.includes(opt)
      return {
        ...prev,
        aiTools: on ? cur.filter((x) => x !== opt) : [...cur, opt],
        ...(on && opt === 'Other' ? { aiToolsOther: '' } : {}),
      }
    })
  }

  return (
    <div className="rw-form-field-wrap rw-form-field-wrap--wide">
      <span className="rw-form-q-title">Social media and AI <span className="rw-form-req"> *</span></span>
      <label className="rw-ai-tick" htmlFor="socialMediaSavvy">
        <input
          id="socialMediaSavvy"
          type="checkbox"
          aria-required="true"
          checked={Boolean(values.socialMediaSavvy)}
          onChange={(e) => {
            const on = e.target.checked
            setValues((prev) => ({
              ...prev,
              socialMediaSavvy: on,
              ...(on ? {} : { aiTools: [], aiToolsOther: '' }),
            }))
            if (!on) setOpen(false)
          }}
        />
        <span>I am comfortable on social media and I know how to use AI tools.</span>
      </label>
      {values.socialMediaSavvy && (
        <div className="rw-ai-drop-wrap">
          <button
            ref={btn}
            type="button"
            id="aiTools"
            className={`rw-form-field rw-ai-drop-btn${invalid ? ' is-invalid' : ''}`}
            aria-expanded={open}
            aria-haspopup="listbox"
            onClick={() => setOpen((v) => !v)}
          >
            <span>{label}</span>
            <span className="rw-ai-drop-caret" aria-hidden>{open ? '▴' : '▾'}</span>
          </button>
          {open && pos && createPortal(
            <div
              ref={menu}
              className="rw-ai-drop"
              role="listbox"
              aria-multiselectable="true"
              style={pos}
            >
              {AI_TOOL_OPTIONS.map((opt) => (
                <label key={opt} className={`rw-form-check${picked.includes(opt) ? ' is-on' : ''}`}>
                  <input type="checkbox" checked={picked.includes(opt)} onChange={() => toggle(opt)} />
                  <span>{opt}</span>
                </label>
              ))}
              <label className={`rw-form-check rw-form-check--wide${otherOn ? ' is-on' : ''}`}>
                <input type="checkbox" checked={otherOn} onChange={() => toggle('Other')} />
                <span>Other — write your own</span>
              </label>
            </div>,
            document.getElementById('rw-app-shell') || document.body,
          )}
          {otherOn && (
            <input
              className="rw-form-field"
              style={{ marginTop: 8 }}
              placeholder="e.g. Edit product photos, write WhatsApp replies"
              value={values.aiToolsOther || ''}
              onChange={(e) => setValues((prev) => ({
                ...prev,
                aiToolsOther: e.target.value,
                aiTools: (Array.isArray(prev.aiTools) ? prev.aiTools : []).includes('Other')
                  ? prev.aiTools
                  : [...(Array.isArray(prev.aiTools) ? prev.aiTools : []), 'Other'],
              }))}
            />
          )}
        </div>
      )}
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
  const { roleSlug } = useParams()
  const { search } = useLocation()
  const params = useMemo(() => new URLSearchParams(search), [search])
  const legacySlug = !roleSlug ? careerRoleSlug(params.get('role')) : ''
  const slugKey = roleSlug || ''
  const [slugState, setSlugState] = useState(() => {
    const role = findRoleBySlug(CAREER_ROLES, slugKey)
    return { slug: slugKey, role, checked: !slugKey || Boolean(role) }
  })
  if (slugState.slug !== slugKey) {
    const role = findRoleBySlug(CAREER_ROLES, slugKey)
    setSlugState({ slug: slugKey, role, checked: !slugKey || Boolean(role) })
  }
  const slugRole = slugState.slug === slugKey ? slugState.role : findRoleBySlug(CAREER_ROLES, slugKey)
  const slugChecked = slugState.slug === slugKey ? slugState.checked : Boolean(slugRole)
  const presetRole = slugRole?.title || (!roleSlug ? (params.get('role') || '') : '')
  const presetJobId = slugRole?.id || (!roleSlug ? (params.get('jobId') || '') : '')

  // The text half of the draft is synchronous, so it can seed the lazy state
  // initialisers below and be on screen at first paint — no empty-then-populated
  // flash, and no chance of an in-progress edit being clobbered by a later read.
  const draft = useMemo(() => {
    const loaded = readDraft()
    return loaded && hasDraftContent(loaded) ? loaded : null
  }, [])

  const [values, setValues] = useState(() => ({
    ...INITIAL,
    ...(draft ? draft.values : {}),
    role: presetRole || draft?.values?.role || '',
    aiTools: Array.isArray(draft?.values?.aiTools) ? draft.values.aiTools : [],
  }))
  const [hex, setHex] = useState(() => draft?.hex || {})
  const [resume, setResume] = useState(null)
  const [openRoles, setOpenRoles] = useState(CAREER_ROLES)
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')
  const [invalidField, setInvalidField] = useState('')
  const [firstName, setFirstName] = useState('')
  const [step, setStep] = useState(() => safeStep(draft?.step))
  const [reached, setReached] = useState(() => safeStep(Math.max(draft?.reached || 0, draft?.step || 0)))
  const [dir, setDir] = useState('fwd') // slide direction for the step transition
  const [restored, setRestored] = useState(() => Boolean(draft))
  // Bumped only by "start over", so the scroll effect below can also re-anchor
  // when the form grows back under a candidate who was scrolled at the bottom.
  const [viewNonce, setViewNonce] = useState(0)
  const [showDisclaimer, setShowDisclaimer] = useState(() => !draft?.values?.disclaimerRead)
  const [disclaimerTick, setDisclaimerTick] = useState(false)
  const honeypot = useRef('')
  const formTopRef = useRef(null)
  const successTopRef = useRef(null)
  const firstView = useRef(true)

  // IndexedDB serialises transactions per connection and each write here opens
  // its own, so a save and a delete fired back to back could land out of order and
  // resurrect a resume the candidate had just removed. One promise chain per
  // session removes the race.
  const resumeQueue = useRef(null)
  function queueResumeWrite(op) {
    resumeQueue.current = (resumeQueue.current || Promise.resolve()).then(op, op)
    return resumeQueue.current
  }

  const set = (id) => (e) => {
    setValues((prev) => ({ ...prev, [id]: e.target.value }))
    if (invalidField === id) { setInvalidField(''); setError('') }
  }


  useEffect(() => {
    let live = true
    fetchRoles().then((rows) => {
      if (!live) return
      setOpenRoles(rows)
      if (roleSlug) {
        const role = findRoleBySlug(rows, roleSlug) || findRoleBySlug(CAREER_ROLES, roleSlug)
        setSlugState({ slug: roleSlug, role, checked: true })
      }
    })
    return () => { live = false }
  }, [roleSlug])

  useEffect(() => {
    if (presetRole) setValues((prev) => ({ ...prev, role: presetRole }))
  }, [presetRole])

  const workMode = roleWorkMode(values.role, openRoles)
  useEffect(() => {
    if (!values.role || values.workMode === workMode.value) return
    setValues((prev) => ({ ...prev, workMode: workMode.value }))
  }, [values.role, values.workMode, workMode.value])

  useEffect(() => {
    const source = values.applicationSource
    setValues((prev) => {
      const referredBy = source === 'Employee referral' ? prev.referredBy : ''
      const applicationSourceOther = source === 'Other' ? prev.applicationSourceOther : ''
      if (referredBy === prev.referredBy && applicationSourceOther === prev.applicationSourceOther) return prev
      return { ...prev, referredBy, applicationSourceOther }
    })
  }, [values.applicationSource])

  useEffect(() => { track('careers_apply_view') }, [])

  // The resume is stored as a blob and rebuilt into a File, so it can only arrive
  // after first paint. Two things must not happen here: a late read overwriting a
  // file the candidate just picked, and a read resurrecting one they just removed.
  // The mirror ref covers the first, `restoredResume` latches the second so the
  // read can never be re-armed by a state change. Mount-only, deliberately.
  const resumeMirror = useRef(null)
  const restoredResume = useRef(false)
  useEffect(() => { resumeMirror.current = resume }, [resume])

  useEffect(() => {
    let live = true
    readResumeFile().then((file) => {
      if (!live || restoredResume.current || resumeMirror.current) return
      restoredResume.current = true
      if (file) setResume(file)
    })
    return () => { live = false }
  }, [])

  // Debounced so a fast typist isn't writing on every keystroke. writeDraft is a
  // no-op for an all-empty form, so wiping the form doesn't leave an empty shell
  // behind for the next visit to "restore". The `done` guard matters: once the
  // application is sent the draft is cleared, and a late write from this effect
  // would put the candidate's answers and resume back on the device.
  useEffect(() => {
    if (status === 'done') return
    const id = setTimeout(() => writeDraft({ values, hex, step, reached }), 400)
    return () => clearTimeout(id)
  }, [values, hex, step, reached, status])

  /* Re-anchor the viewport whenever the page swaps between the form and the
     confirmation. The submit path had nothing: goTo() only handles step changes,
     and by the time the success panel renders, formTopRef is already unmounted
     with the form. The last step is the tallest in the wizard, so candidates are
     normally scrolled well down it — the swap then happens off-screen and they
     land on empty space or the tail of the confirmation instead of the top of it.
     AssessmentForm and CoachingPurchase already scroll on send; this was the one
     form that didn't. Skipped on mount so a normal page load isn't yanked. */
  useEffect(() => {
    if (firstView.current) { firstView.current = false; return }
    const el = status === 'done' ? successTopRef.current : formTopRef.current
    if (!el) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' })
  }, [status, viewNonce])

  const setResumeFile = (file) => {
    if (!file) { clearResume(); return }
    if (!/\.(pdf|docx?|DOC|DOCX|PDF)$/.test(file.name)) { setError('Resume must be a PDF, DOC or DOCX.'); return }
    if (file.size > RESUME_MAX) { setError('That resume is over 5MB. Please attach a smaller file.'); return }
    setError('')
    setInvalidField('')
    setResume(file)
    queueResumeWrite(() => saveResumeFile(file))
  }

  function clearResume() {
    setResume(null)
    queueResumeWrite(() => deleteResumeFile())
  }

  /** Wipe the saved draft and every field. Used by "start over" and on submit. */
  function resetEverything() {
    // clearDraft() covers the resume too, so the extra delete would be redundant.
    clearDraft()
    setValues({ ...INITIAL, role: presetRole })
    setHex({})
    setResume(null)
    setError('')
    setInvalidField('')
    setStatus('idle')
    setFirstName('')
    setStep(0)
    setReached(0)
    setDir('back')
    setRestored(false)
    setViewNonce((n) => n + 1)
    setShowDisclaimer(true)
    setDisclaimerTick(false)
  }

  function acceptDisclaimer() {
    if (!disclaimerTick) {
      setInvalidField('disclaimerRead')
      setError('Please tick that you have read this before you start.')
      focusControl('disclaimerRead')
      return
    }
    setValues((prev) => ({ ...prev, disclaimerRead: true }))
    setShowDisclaimer(false)
    setInvalidField('')
    setError('')
  }

  useEffect(() => {
    if (!showDisclaimer || status === 'done') return undefined
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.getElementById('disclaimerRead')?.focus()
    return () => { document.body.style.overflow = prev }
  }, [showDisclaimer, status])

  // `!== undefined`, not truthiness: the neutral answer is 0, which is a valid choice.
  const hexComplete = HEXACO_STATEMENT_IDS.every((id) => hex[id] !== undefined)

  /** Validate one step; returns { message, field } or null when the step is complete. */
  function validateStep(i) {
    const need = (id, label) => {
      if (!String(values[id] || '').trim()) return { field: id, message: `Please provide ${label}.` }
      return null
    }
    if (i === 0) {
      if (!values.disclaimerRead) {
        return { field: 'disclaimerRead', message: 'Please read the note above and tick that you have read it.' }
      }
      const req = [
        ['name', 'your name'], ['phone', 'your phone number'], ['email', 'your email'],
        ['role', 'the role'], ['linkedinUrl', 'your LinkedIn profile, or choose Not available'],
        ['portfolioUrl', 'your portfolio, or choose Not available'], ['experience', 'your experience level'],
      ]
      for (const [f, l] of req) {
        const miss = need(f, l)
        if (miss) return miss
      }
      if (!isValidPhone(values.phone)) return { field: 'phone', message: 'Please enter a valid 10-digit phone number.' }
      if (values.experience === 'Other' && !values.experienceCustom.trim()) {
        return { field: 'experienceCustom', message: 'Please describe your experience.' }
      }
      if (!values.socialMediaSavvy) {
        return { field: 'socialMediaSavvy', message: 'Please confirm you are comfortable on social media and with AI tools.' }
      }
      if (!chosenAiTools(values).length) {
        return { field: 'aiTools', message: 'Please select what you can do with AI, or write your own.' }
      }
    }
    if (i === 1) {
      const req = [
        ['currentCtc', 'current CTC'], ['expectedCtc', 'expected CTC'], ['currentLocation', 'current location'],
        ['noticePeriod', 'notice period'], ['relocation', 'relocation preference'],
        ['workMode', 'work mode'], ['applicationSource', 'how you heard about us'],
      ]
      for (const [f, l] of req) {
        const miss = need(f, l)
        if (miss) return miss
      }
      if (values.applicationSource === 'Employee referral' && !String(values.referredBy || '').trim()) {
        return { field: 'referredBy', message: 'Please type who on Team RW referred you.' }
      }
      if (values.applicationSource === 'Other' && !String(values.applicationSourceOther || '').trim()) {
        return { field: 'applicationSourceOther', message: 'Please tell us how you heard about us.' }
      }
    }
    if (i === 2) {
      for (const q of CHARACTER_QUESTIONS) {
        if (!String(values[q.id] || '').trim()) return { field: q.id, message: `Please answer: “${q.label}”.` }
      }
    }
    if (i === 3) {
      const first = HEXACO_STATEMENT_IDS.find((id) => hex[id] === undefined)
      if (first) return { field: `hex-${first}`, message: 'Please answer every statement in the assessment before continuing.' }
    }
    if (i === 4) {
      const refs = [
        ['ref1Name', 'reference 1 name, or choose Not available'],
        ['ref1Number', 'reference 1 number, or choose Not available'],
        ['ref1Relationship', 'reference 1 relationship, or choose Not available'],
        ['ref2Name', 'reference 2 name, or choose Not available'],
        ['ref2Number', 'reference 2 number, or choose Not available'],
        ['ref2Relationship', 'reference 2 relationship, or choose Not available'],
      ]
      for (const [f, l] of refs) {
        const miss = need(f, l)
        if (miss) return miss
      }
      if (!resume) return { field: 'resume', message: 'Please attach your resume.' }
      if (!String(values.message || '').trim()) return { field: 'message', message: 'Please add anything else we should know, even a short line.' }
      if (!values.privacyConsent) return { field: 'privacyConsent', message: 'Please give consent to proceed.' }
    }
    return null
  }

  const showFieldError = (err, afterPaint = false) => {
    setError(err.message)
    setInvalidField(err.field || '')
    setTimeout(() => focusControl(err.field), afterPaint ? 320 : 50)
  }

  const goTo = (i, keepError = false) => {
    if (!keepError) { setError(''); setInvalidField('') }
    setDir(i > step ? 'fwd' : 'back')
    setStep(i)
    setReached((r) => Math.max(r, i))
    if (!keepError) {
      requestAnimationFrame(() => formTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
    }
  }

  const next = () => {
    const err = validateStep(step)
    if (err) { showFieldError(err); return }
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
      if (err) {
        goTo(i, true)
        showFieldError(err, i !== step)
        return
      }
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
      // The response carries a reference number, but it stays internal: HR sees it
      // in the notification email and in the admin panel. Nothing here needs it.
      await submitBooking(payload)
      setFirstName(String(values.name || '').trim().split(/\s+/)[0] || '')
      // It's submitted, so the draft has done its job — clear it now rather than
      // leaving a completed application (and the applicant's resume blob, with
      // their name and contact details in it) sitting on the device.
      clearDraft()
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

  const applyPath = slugRole ? careerRolePath(slugRole.title) : '/careers/apply'

  if (legacySlug) return <Navigate to={`/careers/${legacySlug}`} replace />
  if (roleSlug && slugChecked && !slugRole) return <Navigate to="/careers/apply" replace />

  return (
    <>
      <Seo
        route={applyPath}
        title={slugRole ? `Apply for ${slugRole.title} | Rajiv Williams` : undefined}
        description={slugRole ? `Apply for the ${slugRole.title} role with Team Rajiv Williams in Hyderabad.` : undefined}
      />
      {showDisclaimer && status !== 'done' && createPortal(
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="rw-apply-disclaimer-title"
          className="rw-apply-disclaimer-overlay"
        >
          <div className="rw-apply-disclaimer-modal rw-modal-card">
            <p className="rw-apply-disclaimer-kicker">Please read before you start</p>
            <h2 id="rw-apply-disclaimer-title" className="rw-apply-disclaimer-title">This form is reviewed in full.</h2>
            <ul>
              {DISCLAIMER_POINTS.map((line) => <li key={line}>{line}</li>)}
            </ul>
            <label className="rw-apply-disclaimer-check" htmlFor="disclaimerRead">
              <input
                id="disclaimerRead"
                type="checkbox"
                aria-required="true"
                checked={disclaimerTick}
                onChange={(e) => {
                  setDisclaimerTick(e.target.checked)
                  if (invalidField === 'disclaimerRead') { setInvalidField(''); setError('') }
                }}
              />
              <span>I have read this. I will fill every field with genuine details.</span>
            </label>
            {error && invalidField === 'disclaimerRead' && (
              <p role="alert" className="rw-apply-disclaimer-error">{error}</p>
            )}
            <button type="button" className="rw-cta rw-cta--live rw-apply-disclaimer-go" style={ctaCopper} onClick={acceptDisclaimer}>
              START THE FORM <span className="rw-cta-arrow" aria-hidden>→</span>
            </button>
          </div>
        </div>,
        document.getElementById('rw-app-shell') || document.body,
      )}

      <div inert={showDisclaimer && status !== 'done' ? true : undefined}>
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
            /* Wrapped rather than put on the Reveal itself: Reveal keeps its own
               internal ref for the in-view observer and does not forward one, so
               the scroll anchor has to sit on a plain element outside it. */
            <div ref={successTopRef} style={{ scrollMarginTop: 90 }}>
              <Reveal delay={100} style={{ textAlign: 'center', paddingTop: 'clamp(40px,6vw,60px)' }}>
              {/* The thumbs-up replaces the old tick ring: it carries the same
                  "we got it" signal. Shown unconditionally, not tied to the
                  assessment, which is now scored for the hiring team only. */}
              <SuccessAnimation size={148} />

              {/* The reference number used to lead this screen. It is internal
                  now (HR email and admin only): the candidate cannot act on it,
                  they can already identify their application by name and email,
                  and a serial number reads like a support ticket rather than the
                  personal reply this site promises. So the eyebrow carries the
                  weight instead — it is the confirmation, and the thank-you is
                  the headline beneath it. */}
              <div style={{ ...eyebrow, fontSize: fs('clamp(11px,1.4vw,12px)'), letterSpacing: '.28em', color: 'var(--copper)', marginTop: 28 }}>
                APPLICATION RECEIVED
              </div>

              <h3 style={{ fontFamily: serif, fontWeight: 400, fontSize: fs('clamp(26px,3.4vw,38px)'), color: 'var(--ink)', marginTop: 14, letterSpacing: '-.01em' }}>
                Thank you{firstName ? `, ${firstName}` : ''}.
              </h3>
              <p style={{ ...note, marginTop: 16, marginLeft: 'auto', marginRight: 'auto', maxWidth: '34em' }}>
                Someone from the team reads every one personally. If we see a fit, you will hear from us on the number or email you gave us within a couple of working days.
              </p>

              <div style={{ display: 'flex', justifyContent: 'center', gap: 20, flexWrap: 'wrap', marginTop: 32 }}>
                <a className="rw-cta" style={{ ...ctaCopper }} href={WHATSAPP} target="_blank" rel="noreferrer">WHATSAPP THE TEAM</a>
                <Link to="/careers" className="rw-cta" style={{ ...ctaCopper, background: 'transparent', color: 'var(--ink)', border: '1px solid var(--line)' }}>BACK TO CAREERS</Link>
              </div>
              </Reveal>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ marginTop: 'clamp(24px,3vw,32px)' }}>
              {/* Honeypot — humans never see this. */}
              <input ref={honeypot} type="text" name="website_hp" tabIndex={-1} autoComplete="off" aria-hidden="true"
                style={{ position: 'absolute', left: '-9999px', width: 1, height: 1 }} />

              <div ref={formTopRef} style={{ scrollMarginTop: 90 }}>
                <Stepper steps={STEP_META} current={step} reached={reached} onJump={jumpTo} />
              </div>

              {/* Saved-as-you-go, said out loud. A candidate who knows their answers
                  are safe will type freely; one who suspects they might not will
                  hoard them. The same row is the way back to a blank form. */}
              <div className="rw-draft-note" style={{ fontFamily: text }}>
                <span className="rw-draft-note-text">
                  {restored
                    ? 'We kept what you had already entered on this device. Pick up where you left off.'
                    : 'Your answers are kept on this device as you go, so a refresh or a dropped connection will not lose your form.'}
                </span>
                <button type="button" className="rw-draft-clear" onClick={resetEverything}>
                  START OVER
                </button>
              </div>

              {step === 0 && (
                <Section key="about" panel={dir} eyebrow="ABOUT YOU">
                  <TextField label="Full name" id="name" values={values} set={set} setValues={setValues} required invalid={invalidField === 'name'} placeholder="Your name" />
                  <TextField label="Phone" id="phone" values={values} set={set} setValues={setValues} required invalid={invalidField === 'phone'} type="tel" placeholder="10-digit mobile" />
                  <TextField label="Email" id="email" values={values} set={set} setValues={setValues} required invalid={invalidField === 'email'} type="email" placeholder="you@email.com" />
                  <RoleSearchField
                    id="role"
                    roles={openRoles}
                    value={values.role}
                    invalid={invalidField === 'role'}
                    onSelect={(title) => {
                      setValues((prev) => ({ ...prev, role: title }))
                      if (invalidField === 'role') { setInvalidField(''); setError('') }
                    }}
                    onClear={() => setValues((prev) => ({ ...prev, role: '' }))}
                  />
                  <TextField label="LinkedIn profile" id="linkedinUrl" values={values} set={set} setValues={setValues} required allowMissing invalid={invalidField === 'linkedinUrl'} type="url" placeholder="https://linkedin.com/in/your-name" />
                  <TextField label="Portfolio or website" id="portfolioUrl" values={values} set={set} setValues={setValues} required allowMissing invalid={invalidField === 'portfolioUrl'} type="url" placeholder="https://yourportfolio.com" />
                  <p className="rw-form-tip">
                    <span className="rw-form-tip-kicker">Tip</span>
                    {PROFILE_TIP}
                  </p>
                  <AiToolsField values={values} setValues={setValues} invalid={invalidField === 'aiTools' || invalidField === 'socialMediaSavvy'} />
                  <SelectField label="Experience level" id="experience" values={values} set={set} setValues={setValues} options={EXPERIENCE_LEVELS} required wide invalid={invalidField === 'experience'} />
                  {values.experience === 'Other' && (
                    <TextField label="Your experience" id="experienceCustom" values={values} set={set} setValues={setValues} required invalid={invalidField === 'experienceCustom'} placeholder="e.g. 18 months in luxury retail" wide />
                  )}
                </Section>
              )}

              {step === 1 && (
                <Section key="career" panel={dir} eyebrow="CAREER DETAILS">
                  <TextField label="Current CTC" id="currentCtc" values={values} set={set} setValues={setValues} required invalid={invalidField === 'currentCtc'} placeholder="e.g. 8 LPA" hint={CTC_HINT} />
                  <TextField label="Expected CTC" id="expectedCtc" values={values} set={set} setValues={setValues} required invalid={invalidField === 'expectedCtc'} placeholder="e.g. 10 LPA" hint={CTC_HINT} />
                  <TextField label="Current location" id="currentLocation" values={values} set={set} setValues={setValues} required invalid={invalidField === 'currentLocation'} placeholder="City, state" />
                  <SelectField label="Notice period" id="noticePeriod" values={values} set={set} setValues={setValues} options={NOTICE_OPTIONS} required invalid={invalidField === 'noticePeriod'} />
                  <SelectField label="Open to relocate" id="relocation" values={values} set={set} setValues={setValues} options={RELOCATE_OPTIONS} required invalid={invalidField === 'relocation'} />
                  <SelectField label="Preferred work mode" id="workMode" values={values} set={set} setValues={setValues} options={workMode.options} required invalid={invalidField === 'workMode'} hint={workMode.hint} />
                  <SelectField label="How did you hear about us?" id="applicationSource" values={values} set={set} setValues={setValues} options={SOURCE_OPTIONS} required invalid={invalidField === 'applicationSource'} hint={SOURCE_HINT} />
                  {values.applicationSource === 'Employee referral' && (
                    <TextField label="Who referred you?" id="referredBy" values={values} set={set} setValues={setValues} required invalid={invalidField === 'referredBy'} placeholder="Team RW name" hint={REFERRAL_HINT} />
                  )}
                  {values.applicationSource === 'Other' && (
                    <TextField label="Please specify" id="applicationSourceOther" values={values} set={set} setValues={setValues} required invalid={invalidField === 'applicationSourceOther'} placeholder="e.g. Naukri, a friend outside the team" hint={SOURCE_OTHER_HINT} />
                  )}
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
                          <span className="rw-form-req"> *</span>
                        </span>
                        <span className="rw-clearable">
                          <textarea
                            id={q.id}
                            className={`rw-form-field${invalidField === q.id ? ' is-invalid' : ''}`}
                            rows={3} maxLength={ANSWER_MAX}
                            style={{ marginTop: 10, resize: 'vertical' }}
                            placeholder={q.placeholder} value={val} onChange={set(q.id)}
                            aria-invalid={invalidField === q.id || undefined}
                          />
                          {val.trim() !== '' && (
                            <button
                              type="button" className="rw-field-clear" tabIndex={-1}
                              aria-label={`Clear: ${q.label}`} title="Clear this answer"
                              onClick={() => setValues((prev) => ({ ...prev, [q.id]: '' }))}
                            >
                              ×
                            </button>
                          )}
                        </span>
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
                        <p style={{ fontFamily: mono, fontSize: fs('11px'), letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--faded)', margin: '8px 0 12px' }}>{trait.key}</p>
                        {trait.statements.map((s) => (
                          <div key={s.id} id={`hex-${s.id}`} tabIndex={-1} className={`rw-likert${invalidField === `hex-${s.id}` ? ' is-invalid' : ''}`}>
                            <p className="rw-likert-text" style={{ fontFamily: text }}>{s.text}</p>
                            <div className="rw-likert-scale" role="group" aria-label={s.text}>
                              {LIKERT.map((opt) => {
                                const on = Number(hex[s.id]) === opt.v
                                return (
                                  <button
                                    key={opt.v} type="button" title={opt.label} aria-pressed={on}
                                    className={`rw-likert-dot${on ? ' is-on' : ''}`}
                                    style={{ fontFamily: mono }}
                                    onClick={() => {
                                      if (invalidField === `hex-${s.id}`) { setInvalidField(''); setError('') }
                                      setHex((prev) => {
                                        const next = { ...prev }
                                        if (on) delete next[s.id]
                                        else next[s.id] = opt.v
                                        return next
                                      })
                                    }}
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
                    <Section eyebrow="REFERENCES" title="A former manager or colleague. They must have agreed to be contacted.">
                    <TextField label="Reference 1 name" id="ref1Name" values={values} set={set} setValues={setValues} required allowMissing invalid={invalidField === 'ref1Name'} placeholder="Full name" />
                    <TextField label="Reference 1 number" id="ref1Number" values={values} set={set} setValues={setValues} required allowMissing invalid={invalidField === 'ref1Number'} type="tel" placeholder="Mobile number" />
                    <TextField label="Reference 1 relationship" id="ref1Relationship" values={values} set={set} setValues={setValues} required allowMissing wide invalid={invalidField === 'ref1Relationship'} placeholder="Former manager, colleague…" hint={REFERENCE_HINT} />
                    <TextField label="Reference 2 name" id="ref2Name" values={values} set={set} setValues={setValues} required allowMissing invalid={invalidField === 'ref2Name'} placeholder="Full name" />
                    <TextField label="Reference 2 number" id="ref2Number" values={values} set={set} setValues={setValues} required allowMissing invalid={invalidField === 'ref2Number'} type="tel" placeholder="Mobile number" />
                    <TextField label="Reference 2 relationship" id="ref2Relationship" values={values} set={set} setValues={setValues} required allowMissing wide invalid={invalidField === 'ref2Relationship'} placeholder="Former manager, colleague…" hint={REFERENCE_HINT} />
                  </Section>

                  <Section eyebrow="RESUME">
                    <div id="resume" tabIndex={-1} className="rw-form-field-wrap rw-form-field-wrap--wide">
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
                          <button type="button" className="rw-file-remove" onClick={clearResume} aria-label={`Remove ${resume.name}`} title="Remove this resume">×</button>
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
                      <span className="rw-form-q-title">Anything else we should know? <span className="rw-form-req"> *</span></span>
                      <span className="rw-clearable">
                        <textarea id="message" className={`rw-form-field${invalidField === 'message' ? ' is-invalid' : ''}`} rows={3} style={{ marginTop: 10, resize: 'vertical' }}
                          placeholder="Anything about your experience, skills or situation that helps us read your application."
                          value={values.message} onChange={set('message')}
                          aria-invalid={invalidField === 'message' || undefined} />
                        {String(values.message || '').trim() !== '' && (
                          <button
                            type="button" className="rw-field-clear" tabIndex={-1}
                            aria-label="Clear anything else we should know" title="Clear this"
                            onClick={() => setValues((prev) => ({ ...prev, message: '' }))}
                          >
                            ×
                          </button>
                        )}
                      </span>
                    </label>
                  </Section>

                  {/* The step gate blocks a submit without this, so it carries the same
                      required marker as every other field — the one gap was that
                      the asterisk lived on the panel titles and this control sits
                      outside the panel. Title above, control below, as elsewhere.
                      aria-required covers screen readers without handing the
                      checkbox to native browser validation, which would fight
                      the per-step messages. */}
                  <div className="rw-consent" style={{ marginTop: 24 }}>
                    <span className="rw-consent-title">Consent to proceed <span className="rw-form-req">*</span></span>
                    <label className="rw-career-consent">
                      <input id="privacyConsent" type="checkbox" aria-required="true" checked={values.privacyConsent} onChange={(e) => { setValues((p) => ({ ...p, privacyConsent: e.target.checked })); if (invalidField === 'privacyConsent') { setInvalidField(''); setError('') } }} />
                      <span>I confirm that the details in this application are accurate, and I consent to Team Rajiv Williams using them for recruitment and selection.</span>
                    </label>
                  </div>
                </div>
              )}

              {error && (
                <p role="alert" style={{ fontFamily: text, fontWeight: 300, fontSize: fs('14px'), color: 'var(--copper)', marginTop: 18 }}>{error}</p>
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
      </div>
    </>
  )
}
