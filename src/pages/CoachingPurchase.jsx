import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import ClosingCTA from '../components/ClosingCTA'
import CtaButton from '../components/CtaButton'
import { CenteredHead } from '../components/SectionHead'
import Footer from '../components/Footer'
import Header from '../components/Header'
import Reveal from '../components/Reveal'
import Seo from '../components/Seo'
import { BookButton } from '../components/BookingModal'
import { track } from '../data/analytics'
import { isValidPhone, toPhoneDigits } from '../data/booking'
import {
  COACHING_MODULES,
  getCoachingScenario,
  orderRecommendedModules,
  recommendationCopy,
  recommendationFor,
} from '../data/coachingModules'
import { moduleRecommendationReason } from '../data/coachingCategories'
import {
  MODULE_BASE_PRICE,
  PACKAGES,
  calculatePricing,
  formatINR,
  getPackageById,
  labelForCount,
} from '../data/pricing'
import { payForModules } from '../data/paymentService'
import useScoreData from '../hooks/useScoreData'
import { FOOTER_LINKS, mono, serif } from '../theme'
import { container, ctaCopper, eyebrow, note, sectionHeading, sectionRule } from '../styles'
import '../form/form.css'
import './coaching-purchase.css'

const STEP_INDEX = { selection: 0, details: 1, review: 2, status: 3 }
const STEPS = ['selection', 'details', 'review', 'status']
const STEP_ITEMS = [
  { key: 'selection', label: 'Select Modules' },
  { key: 'details', label: 'Your Details' },
  { key: 'review', label: 'Review Purchase' },
]

/* ---------- Small presentational pieces ---------- */

function Stepper({ current }) {
  return (
    <div className="rw-pur-steps" role="list" aria-label="Purchase progress">
      {STEP_ITEMS.map((item, i) => {
        const on = item.key === current
        const done = STEP_INDEX[item.key] < STEP_INDEX[current]
        return (
          <span key={item.key} role="listitem" className={`rw-pur-step${on ? ' is-on' : ''}`}>
            <span className="rw-pur-step-num">{done ? '\u2713' : String(i + 1).padStart(2, '0')}</span>
            {item.label}
          </span>
        )
      })}
    </div>
  )
}

function PriceSummary({ pricing, modules, modeLabel }) {
  return (
    <div className="rw-pur-summary">
      <div className="rw-pur-summary-inner">
        <div className="rw-pur-summary-head">
          <span style={{ fontFamily: mono, fontSize: 11, letterSpacing: '.16em', color: 'var(--ink)' }}>
            YOUR SELECTION
          </span>
          <span className="rw-pur-summary-count">{labelForCount(pricing.count)}</span>
        </div>

        {modeLabel && (
          <div className="rw-pur-save-note" style={{ marginTop: 14 }}>{modeLabel}</div>
        )}

        {modules.length > 0 ? (
          <div className="rw-pur-summary-list">
            {modules.map((m) => (
              <div key={m.id} className="rw-pur-summary-item">
                <span className="rw-pur-summary-item-num">{m.n}</span>
                <span>{m.title}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="rw-pur-reason" style={{ margin: '18px 0' }}>
            Your selection appears here as you add modules.
          </p>
        )}

        <div className="rw-pur-rows">
          <div className="rw-pur-row">
            <span>Price per module</span>
            <b>{formatINR(pricing.unitPrice)}</b>
          </div>
          <div className="rw-pur-row">
            <span>Modules</span>
            <b>{pricing.count}</b>
          </div>
          <div className="rw-pur-row">
            <span>Base amount</span>
            <b>{formatINR(pricing.baseAmount)}</b>
          </div>
          {pricing.discountPercent > 0 && (
            <div className="rw-pur-row rw-pur-row--discount">
              <span>Discount (&#8722;{pricing.discountPercent}%)</span>
              <b>&#8722;{formatINR(pricing.discountAmount)}</b>
            </div>
          )}
        </div>

        <div className="rw-pur-total">
          <span className="rw-pur-total-label">Payable</span>
          <span className="rw-pur-total-amount">{formatINR(pricing.payableAmount)}</span>
        </div>
      </div>
    </div>
  )
}

/* Helpers ---------------------------------------------------------------- */

function parseModuleIds(raw) {
  return (raw || '')
    .split(',')
    .map((s) => Number(s.trim()))
    .filter((n) => Number.isInteger(n) && COACHING_MODULES.some((m) => m.id === n))
}

/* The scenario's ranked order, extended so a fixed package never comes up short. */
function fullRankedIds(sc) {
  const ranked = orderRecommendedModules(sc, true)
  const seen = new Set(ranked)
  const rest = COACHING_MODULES.map((m) => m.id).filter((id) => !seen.has(id))
  return [...ranked, ...rest]
}

/* -------------------------------------------------------------------------- */

export default function CoachingPurchase() {
  const [params, setParams] = useSearchParams()
  const scoreData = useScoreData()

  const scenario = useMemo(
    () => getCoachingScenario(`/coaching/result/${params.get('scenario') ?? ''}`),
    [params],
  )

  /* Score-driven recommendation: overall <= 40 → the full 16-module curriculum,
     otherwise the targeted starting points. */
  const rec = useMemo(() => recommendationFor(scenario, scoreData), [scenario, scoreData])

  /* Seed once from the URL (direct links from the result page / KRISAH). */
  const [selected, setSelected] = useState(() => {
    const modulesParam = params.get('modules')
    if (modulesParam) return parseModuleIds(modulesParam)
    const pkgParam = params.get('package')
    if (pkgParam) {
      const pkg = getPackageById(pkgParam)
      if (pkg) return fullRankedIds(scenario).slice(0, pkg.count)
    }
    if (params.get('mode') === 'custom') return []
    return rec.ids
  })
  const [mode, setMode] = useState(() => {
    if (params.get('modules')) return 'custom'
    if (params.get('package')) return 'packages'
    if (params.get('mode') === 'custom') return 'custom'
    return 'recommended'
  })
  const [packageId, setPackageId] = useState(() => params.get('package') || null)
  const [customer, setCustomer] = useState({ name: '', email: '', phone: '' })
  const [submitting, setSubmitting] = useState(false)
  const [status, setStatus] = useState(null)
  const [expandedIds, setExpandedIds] = useState(() => new Set())

  const stepParam = params.get('step')
  const step = STEPS.includes(stepParam) ? stepParam : 'selection'

  useEffect(() => { track('purchase_view') }, [])

  function goto(nextStep) {
    const next = new URLSearchParams(params)
    next.set('step', nextStep)
    setParams(next, { replace: true })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  /* Step guards: you cannot land on a later step with an empty selection, and
     the status step needs a recorded result to render. */
  useEffect(() => {
    const needsSelection = selected.length === 0 && step !== 'selection'
    const needsResult = step === 'status' && !status
    if (needsSelection || needsResult) goto('selection')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, status, selected.length])

  const selectedModules = useMemo(
    () => selected.map((id) => COACHING_MODULES.find((m) => m.id === id)).filter(Boolean),
    [selected],
  )
  const pricing = useMemo(() => calculatePricing(selected.length), [selected.length])

  const activePackage = mode === 'packages' ? getPackageById(packageId) : null
  const modeLabel = useMemo(() => {
    if (mode === 'packages') return activePackage ? `Fixed Packages · ${activePackage.label}` : 'Fixed Packages'
    if (mode === 'custom') return 'Custom Selection'
    return rec.type === 'complete_curriculum' ? 'Complete Curriculum · All 16' : 'Recommended for You'
  }, [mode, activePackage, rec.type])

  function toggleModule(id) {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
    track('purchase_select_module', { id })
  }

  function toggleExpand(id) {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function selectPackage(pkg) {
    setPackageId(pkg.id)
    setSelected(fullRankedIds(scenario).slice(0, pkg.count))
    track('purchase_package_select', { package: pkg.id, count: pkg.count })
  }

  function selectAll() {
    setSelected(COACHING_MODULES.map((m) => m.id))
    track('purchase_select_all')
  }

  function clearSelection() {
    setSelected([])
    track('purchase_clear_selection')
  }

  /* Details validation */
  const nameOk = customer.name.trim().length >= 2
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email.trim())
  const phoneOk = isValidPhone(customer.phone)
  const detailsOk = nameOk && emailOk && phoneOk
  const left = 3 - [nameOk, emailOk, phoneOk].filter(Boolean).length
  const setField = (field) => (e) => setCustomer((c) => ({ ...c, [field]: e.target.value }))

  async function confirmPurchase() {
    if (submitting) return
    setSubmitting(true)
    track('purchase_review', { count: pricing.count, payable: pricing.payableAmount, mode })

    const result = await payForModules({
      modules: selectedModules.map((m) => ({ id: m.id, title: m.title, category: m.group })),
      count: pricing.count,
      pricing,
      customer: {
        name: customer.name.trim(),
        email: customer.email.trim(),
        phone: toPhoneDigits(customer.phone),
      },
    })

    setStatus(result)
    setSubmitting(false)
    track('purchase_status', { status: result.status })

    // A cancelled Checkout modal (customer backed out, didn't decline) returns them to
    // review with everything still filled in, rather than a dead-end status screen.
    if (result.status === 'cancelled') {
      goto('review')
      return
    }
    goto('status')
  }

  const tabs = [
    { id: 'recommended', label: 'Recommended for You' },
    { id: 'packages', label: 'Fixed Packages' },
    { id: 'custom', label: 'Custom Selection' },
  ]

  function renderSelectionPanel() {
    if (mode === 'packages') {
      return (
        <div className="rw-pur-packages" style={{ marginTop: 26 }}>
          {PACKAGES.map((pkg) => {
            const on = activePackage?.id === pkg.id
            const p = calculatePricing(pkg.count)
            const included = fullRankedIds(scenario).slice(0, pkg.count)
            const listed = included.slice(0, 4)
            const rest = pkg.count - listed.length
            return (
              <button key={pkg.id} type="button" aria-pressed={on} className={`rw-pur-package${on ? ' is-on' : ''}`} onClick={() => selectPackage(pkg)}>
                <div className="rw-pur-package-top">
                  <div style={{ textAlign: 'left' }}>
                    <span className="rw-pur-chip">{pkg.label.toUpperCase()}</span>
                    <div className="rw-pur-package-price" style={{ marginTop: 14 }}>{formatINR(p.payableAmount)}</div>
                    <div className="rw-pur-package-save" style={{ marginTop: 6 }}>
                      {p.discountPercent > 0
                        ? `SAVE ${p.discountPercent}% (${formatINR(p.discountAmount)})`
                        : 'STANDARD PRICE'}
                      {' · '}{labelForCount(pkg.count)}
                    </div>
                  </div>
                  <span className="rw-pur-card-check">&#10003;</span>
                </div>
                <div className="rw-pur-package-list" style={{ textAlign: 'left', marginTop: 12 }}>{pkg.blurb}</div>
                {on && (
                  <div className="rw-pur-package-list" style={{ textAlign: 'left', borderTop: '1px solid var(--line)', paddingTop: 12, display: 'flex', flexDirection: 'column', gap: 6 }} data-testid="package-included">
                    {listed.map((id) => {
                      const m = COACHING_MODULES.find((x) => x.id === id)
                      return m ? <span key={m.id} style={{ color: 'var(--ink)' }}>{m.n} · {m.title}</span> : null
                    })}
                    {rest > 0 && <span style={{ color: 'var(--copper)' }}>+ {rest} more in this package</span>}
                  </div>
                )}
              </button>
            )
          })}
        </div>
      )
    }

    /* Recommended (default) and Custom Selection share one checklist picker:
       every module is listed and selectable; the score-driven recommended set
       is flagged with the badge below and, on the default link, pre-selected. */
    const isRecommendedMode = mode === 'recommended'
    return (
      <>
        {isRecommendedMode && (
          <div className="rw-pur-copy" style={{ marginTop: 26, border: '1px solid rgba(195,155,83,.28)', background: 'var(--card)', padding: '16px 20px' }}>
            <span className="rw-pur-chip" style={{ marginRight: 10 }}>{rec.type === 'complete_curriculum' ? 'COMPLETE CURRICULUM' : 'RECOMMENDED FOR YOU'}</span>
            <span style={{ ...note, fontSize: 15, lineHeight: 1.5, color: 'var(--ink)' }}>{recommendationCopy(rec.type)}</span>
          </div>
        )}

        <div className="rw-pur-toolbar" style={{ marginTop: 26 }}>
          <span className="rw-pur-reason">
            <b style={{ color: 'var(--ink)', fontWeight: 400 }}>{selected.length}</b> of 16 selected
          </span>
          <div className="rw-pur-toolbar-actions">
            <button type="button" className="rw-form-back" onClick={selectAll}>SELECT ALL 16</button>
            <button type="button" className="rw-form-back" onClick={clearSelection}>CLEAR SELECTION</button>
          </div>
        </div>

        <div className="rw-pur-picker">
          {COACHING_MODULES.map((mod) => {
            const sel = selected.includes(mod.id)
            const isRec = rec.ids.includes(mod.id)
            // In Custom Selection, the score-based recommendation isn't shown anywhere else on
            // the page (unlike Recommended mode, which has its own banner), so it needs its own
            // chip here rather than relying on the subtitle text, which the ellipsis can hide.
            const showPriorityChip = isRec && !isRecommendedMode
            const open = expandedIds.has(mod.id)
            return (
              <div key={mod.id} className={`rw-pur-pick${sel ? ' is-on' : ''}`}>
                <div className="rw-pur-pick-row">
                  <button type="button" className="rw-pur-pick-toggle" aria-pressed={sel} onClick={() => toggleModule(mod.id)}>
                    <span className="rw-pur-pick-num">{mod.n}</span>
                    <span className="rw-pur-pick-meta">
                      <span style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                        <span className="rw-pur-pick-title">{mod.title}</span>
                        {showPriorityChip && (
                          <span className="rw-pur-chip" style={{ fontSize: 8, padding: '3px 8px' }}>PRIORITY FOCUS</span>
                        )}
                      </span>
                      <span className="rw-pur-pick-sub">{mod.group.toUpperCase()} · 90&#8211;120 MIN · {formatINR(MODULE_BASE_PRICE)}</span>
                    </span>
                    <span className={`rw-pur-pick-check${sel ? ' is-on' : ''}`}>&#10003;</span>
                  </button>
                  <button type="button" className="rw-pur-pick-details" aria-expanded={open} onClick={() => toggleExpand(mod.id)}>
                    {open ? 'HIDE DETAILS' : 'DETAILS'} &#8599;
                  </button>
                </div>
                {open && (
                  <div className="rw-pur-pick-detail">
                    <p className="rw-pur-reason">{isRec ? 'RECOMMENDED · ' : ''}{moduleRecommendationReason(mod, scenario, scoreData, rec.type)}</p>
                    <p className="rw-pur-reason">{mod.focus}</p>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </>
    )
  }

  return (
    <>
      <Seo route="/coaching/purchase" />
      <Header />

      {/* Hero */}
      <section style={{ ...sectionRule, borderBottom: '1px solid var(--line)', position: 'relative', overflow: 'hidden' }}>
        <Reveal>
          <div className="rw-pad" style={{ ...container, padding: 'clamp(56px,7vw,84px) 40px', textAlign: 'center', position: 'relative', zIndex: 1 }}>
            <div style={{ ...eyebrow, marginBottom: 18 }}>COACHING · SELECT &amp; PURCHASE</div>
            <div style={{ ...sectionHeading, fontSize: 'clamp(30px,4.4vw,52px)', lineHeight: 1.08 }}>
              Choose how you want to grow.
            </div>
            <p style={{ ...note, marginTop: 14, marginLeft: 'auto', marginRight: 'auto', maxWidth: '30em', fontSize: 17, lineHeight: 1.6 }}>
              Every module is one focused 90&#8211;120 minute coaching area. Build your selection, watch the price update live, and pay securely to confirm.
            </p>
            {step !== 'status' && <Stepper current={step} />}
          </div>
        </Reveal>
      </section>

      {/* Checkout body */}
      <section className="rw-pad" style={{ ...container, padding: 'clamp(48px,6vw,72px) 40px' }}>
        <div className="rw-pur-layout">
          <div className="rw-pur-main" style={step === 'status' ? { gridColumn: '1 / -1' } : undefined}>
            {step === 'selection' && (
              <>
                <CenteredHead eyebrow="SELECT MODULES" title="Pick the coaching that fits." intro="Add the areas you want to work on. The price updates with every change." />
                <div className="rw-pur-tabs" role="tablist" aria-label="Selection mode">
                  {tabs.map((t) => (
                    <button
                      key={t.id}
                      role="tab"
                      aria-selected={mode === t.id}
                      className={`rw-pur-tab${mode === t.id ? ' is-on' : ''}`}
                      onClick={() => {
                        setMode(t.id)
                        track('purchase_mode', { mode: t.id })
                      }}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
                {renderSelectionPanel()}
                <div className="rw-pur-toolbar" style={{ borderTop: '1px solid var(--line)', paddingTop: 22, marginTop: 30 }}>
                  <span className="rw-pur-reason">
                    {selected.length === 0
                      ? 'Nothing selected yet. Add one or more modules to continue.'
                      : `${labelForCount(selected.length)} selected · ${formatINR(pricing.payableAmount)} payable${pricing.discountPercent ? ` · ${pricing.discountPercent}% off applied` : ''}`}
                  </span>
                  <div className="rw-pur-toolbar-actions">
                    <a className="rw-form-back" href="/coaching" style={{ textDecoration: 'none' }}>&#8592; COACHING</a>
                    <button
                      type="button"
                      className="rw-cta"
                      style={{ ...ctaCopper, opacity: selected.length === 0 ? 0.45 : 1, cursor: selected.length === 0 ? 'not-allowed' : 'pointer' }}
                      disabled={selected.length === 0}
                      onClick={() => goto('details')}
                    >
                      CONTINUE &#8594;
                    </button>
                  </div>
                </div>
              </>
            )}

            {step === 'details' && (
              <>
                <CenteredHead eyebrow="YOUR DETAILS" title="Where should we keep your record?" intro="Payment confirmation and your receipt go to these details. Nothing is charged on this page." />
                <div className="rw-pur-form-wrap" style={{ margin: '0 auto' }}>
                  <div className="rw-form-panel" style={{ marginTop: 34 }}>
                    <label className="rw-form-field-wrap">
                      <span className="rw-form-q-title">Full name <span className="rw-form-req">*</span></span>
                      <div className="rw-form-controls">
                        <input className="rw-form-field" type="text" value={customer.name} onChange={setField('name')} placeholder="As you'd like us to address you" />
                      </div>
                    </label>
                    <label className="rw-form-field-wrap">
                      <span className="rw-form-q-title">Email <span className="rw-form-req">*</span></span>
                      <div className="rw-form-controls">
                        <input className="rw-form-field" type="email" value={customer.email} onChange={setField('email')} placeholder="you@example.com" />
                      </div>
                    </label>
                    <label className="rw-form-field-wrap rw-form-field-wrap--wide">
                      <span className="rw-form-q-title">Phone <span className="rw-form-req">*</span></span>
                      <div className="rw-form-controls">
                        <input className="rw-form-field" type="tel" value={customer.phone} onChange={setField('phone')} placeholder="10-digit mobile number" />
                      </div>
                    </label>
                  </div>
                  <div className="rw-pur-toolbar" style={{ borderTop: '1px solid var(--line)', paddingTop: 22 }}>
                    <span className="rw-pur-reason">
                      {left === 0 ? 'All details look good.' : `${left} required field${left === 1 ? '' : 's'} remaining`}
                    </span>
                    <div className="rw-pur-toolbar-actions">
                      <button type="button" className="rw-form-back" onClick={() => goto('selection')}>&#8592; SELECTION</button>
                      <button
                        type="button"
                        className="rw-cta"
                        style={{ ...ctaCopper, opacity: detailsOk ? 1 : 0.45, cursor: detailsOk ? 'pointer' : 'not-allowed' }}
                        disabled={!detailsOk}
                        onClick={() => goto('review')}
                      >
                        CONTINUE TO REVIEW &#8594;
                      </button>
                    </div>
                  </div>
                  <p className="rw-pur-form-note rw-pur-reason">We use your details only to reach you about this request.</p>
                </div>
              </>
            )}

            {step === 'review' && (
              <>
                <CenteredHead eyebrow="REVIEW PURCHASE" title="Review Purchase" intro="Take a last look. Confirming opens secure payment via Razorpay. Nothing is charged until you complete it there." />
                <div className="rw-pur-recap">
                  <div className="rw-pur-block">
                    <div className="rw-pur-block-title">YOUR SELECTION · {labelForCount(selected.length)}</div>
                    <div className="rw-pur-block-body">
                      {selectedModules.map((m) => (
                        <div key={m.id} className="rw-pur-line">
                          <span>{m.n} · {m.title}</span>
                          <b>{formatINR(pricing.unitPrice)}</b>
                        </div>
                      ))}
                      <div className="rw-pur-line"><span>Mode</span><b>{modeLabel}</b></div>
                    </div>
                  </div>

                  <div className="rw-pur-block">
                    <div className="rw-pur-block-title">PRICE</div>
                    <div className="rw-pur-block-body">
                      <div className="rw-pur-line"><span>Price per module</span><b>{formatINR(pricing.unitPrice)}</b></div>
                      <div className="rw-pur-line"><span>Base amount</span><b>{formatINR(pricing.baseAmount)}</b></div>
                      {pricing.discountPercent > 0 && (
                        <div className="rw-pur-line" style={{ color: 'var(--copper)' }}>
                          <span>Discount (&#8722;{pricing.discountPercent}%)</span>
                          <b>{formatINR(pricing.discountAmount)}</b>
                        </div>
                      )}
                      <div className="rw-pur-line">
                        <span style={{ textTransform: 'uppercase', letterSpacing: '.12em', color: 'var(--ink)' }}>Payable</span>
                        <b style={{ fontFamily: serif, fontSize: 22, color: 'var(--copper)' }}>{formatINR(pricing.payableAmount)}</b>
                      </div>
                    </div>
                  </div>

                  <div className="rw-pur-block">
                    <div className="rw-pur-block-title">YOUR DETAILS</div>
                    <div className="rw-pur-block-body">
                      <div className="rw-pur-line"><span>Full name</span><b>{customer.name.trim()}</b></div>
                      <div className="rw-pur-line"><span>Email</span><b>{customer.email.trim()}</b></div>
                      <div className="rw-pur-line"><span>Phone</span><b>+91 {toPhoneDigits(customer.phone)}</b></div>
                    </div>
                  </div>
                </div>

                <div className="rw-pur-toolbar" style={{ borderTop: '1px solid var(--line)', paddingTop: 22, marginTop: 30 }}>
                  <span className="rw-pur-reason">{submitting ? 'Opening secure payment…' : 'Pay by card, UPI, netbanking or wallet. Handled by Razorpay, not stored on this site.'}</span>
                  <div className="rw-pur-toolbar-actions">
                    <button type="button" className="rw-form-back" disabled={submitting} onClick={() => goto('details')}>&#8592; DETAILS</button>
                    <button type="button" className="rw-cta rw-cta--live" style={ctaCopper} disabled={submitting} onClick={confirmPurchase}>
                      {submitting ? 'OPENING PAYMENT…' : `PAY ${formatINR(pricing.payableAmount)} →`}
                    </button>
                  </div>
                </div>
              </>
            )}

            {step === 'status' && status && (
              <div className="rw-pur-status">
                <div className="rw-pur-ring">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
                    {status.status === 'completed'
                      ? <path d="M4 12.5 9.5 18 20 6.5" />
                      : <path d="M6 6 18 18M18 6 6 18" />}
                  </svg>
                </div>
                <div style={{ ...eyebrow, marginTop: 28 }}>{status.status === 'completed' ? 'PAYMENT RECEIVED' : 'PAYMENT NOT COMPLETED'}</div>
                <h2 style={{ ...sectionHeading, marginTop: 10 }}>{status.status === 'completed' ? 'You’re in.' : 'That payment did not go through.'}</h2>
                <p style={{ ...note, marginTop: 16, marginLeft: 'auto', marginRight: 'auto', maxWidth: '34em', fontSize: 17, lineHeight: 1.6 }}>
                  {status.status === 'completed'
                    ? 'Payment received and your modules are confirmed. Our team will reach out to schedule your first session.'
                    : (status.message || 'No charge was made. You can try again, or reach out and we will take the payment directly.')}
                </p>
                {status.status === 'completed' && (
                  <div className="rw-pur-status-chip">
                    <span>ORDER {status.orderId ?? '\u2014'}</span>
                    <span>{labelForCount(selected.length)}</span>
                    <span>{formatINR(pricing.payableAmount)} PAID</span>
                  </div>
                )}
                <div style={{ marginTop: 34, display: 'flex', gap: 18, flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
                  <CtaButton variant="outline" href="/assessment">VIEW ASSESSMENT</CtaButton>
                  <CtaButton variant="outline" href="/coaching/result">RETURN TO RESULTS</CtaButton>
                  {status.status !== 'completed' && (
                    <button type="button" className="rw-cta" style={ctaCopper} onClick={() => goto('review')}>TRY AGAIN &#8594;</button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Live price summary — persistent through selection, details and review */}
          {step !== 'status' && (
            <aside className="rw-pur-side">
              <PriceSummary pricing={pricing} modules={selectedModules} modeLabel={modeLabel} />
            </aside>
          )}
        </div>

        {/* Transparent pricing footnote, so the maths never looks hidden */}
        <div className="rw-pur-footnote">
          <span>MODULE PRICE {formatINR(MODULE_BASE_PRICE)} EACH</span>
          <span>1&#8211;4 MODULES &#8212; 0% OFF</span>
          <span>5&#8211;9 MODULES &#8212; 5% OFF</span>
          <span>10&#8211;15 MODULES &#8212; 10% OFF</span>
          <span>ALL 16 &#8212; 15% OFF</span>
        </div>
      </section>

      {/* Closing */}
      <ClosingCTA chip title="Decided on your starting point?" titleStyle={{ maxWidth: '16em' }}>
        <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
          <CtaButton variant="outline" href="/coaching/result">REVIEW YOUR RESULT &#8594;</CtaButton>
          <BookButton interest="Coaching" specular>ASK THE RW TEAM FIRST</BookButton>
        </div>
      </ClosingCTA>

      <Footer links={FOOTER_LINKS} />
    </>
  )
}