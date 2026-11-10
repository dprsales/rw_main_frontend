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
  PRESET_MODULE_IDS,
  getCoachingScenario,
  orderRecommendedModules,
  recommendationFor,
} from '../data/coachingModules'
import { moduleDimension } from '../data/coachingCategories'
import {
  MODULE_BASE_PRICE,
  PACKAGES,
  calculatePricing,
  formatINR,
  getPackageById,
} from '../data/pricing'
import { payForModules } from '../data/paymentService'
import useScoreData from '../hooks/useScoreData'
import { useLang } from '../i18n/LangProvider'
import {
  labelForCountT,
  moduleFocus,
  moduleGroup,
  moduleTitle,
  packageBlurb,
  packageLabel,
  recommendationCopyT,
} from '../i18n/coachCheckout'
import { FOOTER_LINKS, mono, serif } from '../theme'
import { fs, container, ctaCopper, eyebrow, note, sectionHeading, sectionRule } from '../styles'
import '../form/form.css'
import './coaching-purchase.css'

const STEP_INDEX = { selection: 0, details: 1, review: 2, status: 3 }
const STEPS = ['selection', 'details', 'review', 'status']
const STEP_KEYS = ['selection', 'details', 'review']

function reasonForModule(t, mod, scenario, scoreData, type) {
  if (type === 'complete_curriculum') return t('cpur.reason.complete')
  const dim = moduleDimension(mod)
  const dimScore = dim && scoreData?.dimensions?.find((d) => d.key === dim.key)
  if (dimScore && typeof dimScore.value === 'number') {
    return t('cpur.reason.dim', { name: dim.short, value: dimScore.value })
  }
  if (!scenario || scenario.scoreBand === 'default-40') return t('cpur.reason.default')
  if (PRESET_MODULE_IDS.includes(mod.id)) return t('cpur.reason.preset')
  return t('cpur.reason.other')
}

/* ---------- Small presentational pieces ---------- */

function Stepper({ current, t }) {
  return (
    <div className="rw-pur-steps" role="list" aria-label={t('cpur.steps.aria')}>
      {STEP_KEYS.map((key, i) => {
        const on = key === current
        const done = STEP_INDEX[key] < STEP_INDEX[current]
        return (
          <span key={key} role="listitem" className={`rw-pur-step${on ? ' is-on' : ''}`}>
            <span className="rw-pur-step-num">{done ? '\u2713' : String(i + 1).padStart(2, '0')}</span>
            {t(`cpur.step.${key}`)}
          </span>
        )
      })}
    </div>
  )
}

function PriceSummary({ pricing, modules, modeLabel, t }) {
  return (
    <div className="rw-pur-summary">
      <div className="rw-pur-summary-inner">
        <div className="rw-pur-summary-head">
          <span style={{ fontFamily: mono, fontSize: fs('11px'), letterSpacing: '.16em', color: 'var(--ink)' }}>
            {t('cpur.summary.head')}
          </span>
          <span className="rw-pur-summary-count">{labelForCountT(t, pricing.count)}</span>
        </div>

        {modeLabel && (
          <div className="rw-pur-save-note" style={{ marginTop: 14 }}>{modeLabel}</div>
        )}

        {modules.length > 0 ? (
          <div className="rw-pur-summary-list">
            {modules.map((m) => (
              <div key={m.id} className="rw-pur-summary-item">
                <span className="rw-pur-summary-item-num">{m.n}</span>
                <span>{moduleTitle(t, m)}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="rw-pur-reason" style={{ margin: '18px 0' }}>
            {t('cpur.summary.empty')}
          </p>
        )}

        <div className="rw-pur-rows">
          <div className="rw-pur-row">
            <span>{t('cpur.summary.unit')}</span>
            <b>{formatINR(pricing.unitPrice)}</b>
          </div>
          <div className="rw-pur-row">
            <span>{t('cpur.summary.modules')}</span>
            <b>{pricing.count}</b>
          </div>
          <div className="rw-pur-row">
            <span>{t('cpur.summary.base')}</span>
            <b>{formatINR(pricing.baseAmount)}</b>
          </div>
          {pricing.discountPercent > 0 && (
            <div className="rw-pur-row rw-pur-row--discount">
              <span>{t('cpur.summary.discount', { pct: pricing.discountPercent })}</span>
              <b>&#8722;{formatINR(pricing.discountAmount)}</b>
            </div>
          )}
        </div>

        <div className="rw-pur-total">
          <span className="rw-pur-total-label">{t('cpur.summary.payable')}</span>
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
  const { t } = useLang()
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
    if (mode === 'packages') {
      return activePackage
        ? t('cpur.mode.packagesNamed', { label: packageLabel(t, activePackage) })
        : t('cpur.mode.packages')
    }
    if (mode === 'custom') return t('cpur.mode.custom')
    return rec.type === 'complete_curriculum' ? t('cpur.mode.complete') : t('cpur.mode.recommended')
  }, [mode, activePackage, rec.type, t])

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
    { id: 'recommended', label: t('cpur.tab.recommended') },
    { id: 'packages', label: t('cpur.tab.packages') },
    { id: 'custom', label: t('cpur.tab.custom') },
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
            const pkgName = packageLabel(t, pkg)
            return (
              <button key={pkg.id} type="button" aria-pressed={on} className={`rw-pur-package${on ? ' is-on' : ''}`} onClick={() => selectPackage(pkg)}>
                <div className="rw-pur-package-top">
                  <div style={{ textAlign: 'left' }}>
                    <span className="rw-pur-chip">{pkgName}</span>
                    <div className="rw-pur-package-price" style={{ marginTop: 14 }}>{formatINR(p.payableAmount)}</div>
                    <div className="rw-pur-package-save" style={{ marginTop: 6 }}>
                      {p.discountPercent > 0
                        ? t('cpur.pkg.save', { pct: p.discountPercent, amount: formatINR(p.discountAmount) })
                        : t('cpur.pkg.standard')}
                      {' · '}{labelForCountT(t, pkg.count)}
                    </div>
                  </div>
                  <span className="rw-pur-card-check">&#10003;</span>
                </div>
                <div className="rw-pur-package-list" style={{ textAlign: 'left', marginTop: 12 }}>{packageBlurb(t, pkg)}</div>
                {on && (
                  <div className="rw-pur-package-list" style={{ textAlign: 'left', borderTop: '1px solid var(--line)', paddingTop: 12, display: 'flex', flexDirection: 'column', gap: 6 }} data-testid="package-included">
                    {listed.map((id) => {
                      const m = COACHING_MODULES.find((x) => x.id === id)
                      return m ? <span key={m.id} style={{ color: 'var(--ink)' }}>{m.n} · {moduleTitle(t, m)}</span> : null
                    })}
                    {rest > 0 && <span style={{ color: 'var(--copper)' }}>{t('cpur.pkg.more', { n: rest })}</span>}
                  </div>
                )}
              </button>
            )
          })}
        </div>
      )
    }

    const isRecommendedMode = mode === 'recommended'
    return (
      <>
        {isRecommendedMode && (
          <div className="rw-pur-copy" style={{ marginTop: 26, border: '1px solid rgba(195,155,83,.28)', background: 'var(--card)', padding: '16px 20px' }}>
            <span className="rw-pur-chip" style={{ marginRight: 10 }}>{rec.type === 'complete_curriculum' ? t('cpur.chip.complete') : t('cpur.chip.recommended')}</span>
            <span style={{ ...note, fontSize: fs('15px'), lineHeight: 1.5, color: 'var(--ink)' }}>{recommendationCopyT(t, rec.type)}</span>
          </div>
        )}

        <div className="rw-pur-toolbar" style={{ marginTop: 26 }}>
          <span className="rw-pur-reason">
            {t('cpur.selectedOf', { n: selected.length })}
          </span>
          <div className="rw-pur-toolbar-actions">
            <button type="button" className="rw-form-back" onClick={selectAll}>{t('cpur.selectAll')}</button>
            <button type="button" className="rw-form-back" onClick={clearSelection}>{t('cpur.clear')}</button>
          </div>
        </div>

        <div className="rw-pur-picker">
          {COACHING_MODULES.map((mod) => {
            const sel = selected.includes(mod.id)
            const isRec = rec.ids.includes(mod.id)
            const showPriorityChip = isRec && !isRecommendedMode
            const open = expandedIds.has(mod.id)
            return (
              <div key={mod.id} className={`rw-pur-pick${sel ? ' is-on' : ''}`}>
                <div className="rw-pur-pick-row">
                  <button type="button" className="rw-pur-pick-toggle" aria-pressed={sel} onClick={() => toggleModule(mod.id)}>
                    <span className="rw-pur-pick-num">{mod.n}</span>
                    <span className="rw-pur-pick-meta">
                      <span style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                        <span className="rw-pur-pick-title">{moduleTitle(t, mod)}</span>
                        {showPriorityChip && (
                          <span className="rw-pur-chip" style={{ fontSize: fs('8px'), padding: '3px 8px' }}>{t('cpur.chip.priority')}</span>
                        )}
                      </span>
                      <span className="rw-pur-pick-sub">{t('cpur.meta', { group: moduleGroup(t, mod.group), price: formatINR(MODULE_BASE_PRICE) })}</span>
                    </span>
                    <span className={`rw-pur-pick-check${sel ? ' is-on' : ''}`}>&#10003;</span>
                  </button>
                  <button type="button" className="rw-pur-pick-details" aria-expanded={open} onClick={() => toggleExpand(mod.id)}>
                    {open ? t('cpur.hideDetails') : t('cpur.detailsBtn')} &#8599;
                  </button>
                </div>
                {open && (
                  <div className="rw-pur-pick-detail">
                    <p className="rw-pur-reason">{isRec ? t('cpur.recPrefix') : ''}{reasonForModule(t, mod, scenario, scoreData, rec.type)}</p>
                    <p className="rw-pur-reason">{moduleFocus(t, mod)}</p>
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
          <div className="rw-pad" style={{ ...container, padding: 'var(--rw-sy-sm) 40px', textAlign: 'center', position: 'relative', zIndex: 1 }}>
            <div style={{ ...eyebrow, marginBottom: 18 }}>{t('cpur.eyebrow')}</div>
            <div className="rw-te-display" style={{ ...sectionHeading, fontSize: fs('clamp(30px,4.4vw,52px)'), lineHeight: 1.08 }}>
              {t('cpur.h1')}
            </div>
            <p style={{ ...note, marginTop: 14, marginLeft: 'auto', marginRight: 'auto', maxWidth: '30em', fontSize: fs('17px'), lineHeight: 1.6 }}>
              {t('cpur.lede')}
            </p>
            {step !== 'status' && <Stepper current={step} t={t} />}
          </div>
        </Reveal>
      </section>

      {/* Checkout body */}
      <section className="rw-pad" style={{ ...container, padding: 'clamp(48px,6vw,72px) 40px' }}>
        <div className="rw-pur-layout">
          <div className="rw-pur-main" style={step === 'status' ? { gridColumn: '1 / -1' } : undefined}>
            {step === 'selection' && (
              <>
                <CenteredHead eyebrow={t('cpur.select.eyebrow')} title={t('cpur.select.title')} intro={t('cpur.select.intro')} />
                <div className="rw-pur-tabs" role="tablist" aria-label={t('cpur.tabs.aria')}>
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      role="tab"
                      aria-selected={mode === tab.id}
                      className={`rw-pur-tab${mode === tab.id ? ' is-on' : ''}`}
                      onClick={() => {
                        setMode(tab.id)
                        track('purchase_mode', { mode: tab.id })
                      }}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
                {renderSelectionPanel()}
                <div className="rw-pur-toolbar" style={{ borderTop: '1px solid var(--line)', paddingTop: 22, marginTop: 30 }}>
                  <span className="rw-pur-reason">
                    {selected.length === 0
                      ? t('cpur.emptyContinue')
                      : `${t('cpur.selectedLine', { label: labelForCountT(t, selected.length), price: formatINR(pricing.payableAmount) })}${pricing.discountPercent ? t('cpur.selectedOff', { pct: pricing.discountPercent }) : ''}`}
                  </span>
                  <div className="rw-pur-toolbar-actions">
                    <a className="rw-form-back" href="/coaching" style={{ textDecoration: 'none' }}>{t('cpur.backCoaching')}</a>
                    <button
                      type="button"
                      className="rw-cta"
                      style={{ ...ctaCopper, opacity: selected.length === 0 ? 0.45 : 1, cursor: selected.length === 0 ? 'not-allowed' : 'pointer' }}
                      disabled={selected.length === 0}
                      onClick={() => goto('details')}
                    >
                      {t('cpur.continue')}
                    </button>
                  </div>
                </div>
              </>
            )}

            {step === 'details' && (
              <>
                <CenteredHead eyebrow={t('cpur.details.eyebrow')} title={t('cpur.details.title')} intro={t('cpur.details.intro')} />
                <div className="rw-pur-form-wrap" style={{ margin: '0 auto' }}>
                  <div className="rw-form-panel" style={{ marginTop: 34 }}>
                    <label className="rw-form-field-wrap">
                      <span className="rw-form-q-title">{t('cpur.f.name')} <span className="rw-form-req">*</span></span>
                      <div className="rw-form-controls">
                        <input className="rw-form-field" type="text" value={customer.name} onChange={setField('name')} placeholder={t('cpur.f.namePh')} />
                      </div>
                    </label>
                    <label className="rw-form-field-wrap">
                      <span className="rw-form-q-title">{t('cpur.f.email')} <span className="rw-form-req">*</span></span>
                      <div className="rw-form-controls">
                        <input className="rw-form-field" type="email" value={customer.email} onChange={setField('email')} placeholder={t('cpur.f.emailPh')} />
                      </div>
                    </label>
                    <label className="rw-form-field-wrap rw-form-field-wrap--wide">
                      <span className="rw-form-q-title">{t('cpur.f.phone')} <span className="rw-form-req">*</span></span>
                      <div className="rw-form-controls">
                        <input className="rw-form-field" type="tel" value={customer.phone} onChange={setField('phone')} placeholder={t('cpur.f.phonePh')} />
                      </div>
                    </label>
                  </div>
                  <div className="rw-pur-toolbar" style={{ borderTop: '1px solid var(--line)', paddingTop: 22 }}>
                    <span className="rw-pur-reason">
                      {left === 0 ? t('cpur.details.ok') : left === 1 ? t('cpur.details.leftOne') : t('cpur.details.left', { n: left })}
                    </span>
                    <div className="rw-pur-toolbar-actions">
                      <button type="button" className="rw-form-back" onClick={() => goto('selection')}>{t('cpur.backSelection')}</button>
                      <button
                        type="button"
                        className="rw-cta"
                        style={{ ...ctaCopper, opacity: detailsOk ? 1 : 0.45, cursor: detailsOk ? 'pointer' : 'not-allowed' }}
                        disabled={!detailsOk}
                        onClick={() => goto('review')}
                      >
                        {t('cpur.toReview')}
                      </button>
                    </div>
                  </div>
                  <p className="rw-pur-form-note rw-pur-reason">{t('cpur.privacy')}</p>
                </div>
              </>
            )}

            {step === 'review' && (
              <>
                <CenteredHead eyebrow={t('cpur.review.eyebrow')} title={t('cpur.review.title')} intro={t('cpur.review.intro')} />
                <div className="rw-pur-recap">
                  <div className="rw-pur-block">
                    <div className="rw-pur-block-title">{t('cpur.review.selection', { label: labelForCountT(t, selected.length) })}</div>
                    <div className="rw-pur-block-body">
                      {selectedModules.map((m) => (
                        <div key={m.id} className="rw-pur-line">
                          <span>{m.n} · {moduleTitle(t, m)}</span>
                          <b>{formatINR(pricing.unitPrice)}</b>
                        </div>
                      ))}
                      <div className="rw-pur-line"><span>{t('cpur.review.mode')}</span><b>{modeLabel}</b></div>
                    </div>
                  </div>

                  <div className="rw-pur-block">
                    <div className="rw-pur-block-title">{t('cpur.review.price')}</div>
                    <div className="rw-pur-block-body">
                      <div className="rw-pur-line"><span>{t('cpur.summary.unit')}</span><b>{formatINR(pricing.unitPrice)}</b></div>
                      <div className="rw-pur-line"><span>{t('cpur.summary.base')}</span><b>{formatINR(pricing.baseAmount)}</b></div>
                      {pricing.discountPercent > 0 && (
                        <div className="rw-pur-line" style={{ color: 'var(--copper)' }}>
                          <span>{t('cpur.summary.discount', { pct: pricing.discountPercent })}</span>
                          <b>{formatINR(pricing.discountAmount)}</b>
                        </div>
                      )}
                      <div className="rw-pur-line">
                        <span style={{ textTransform: 'uppercase', letterSpacing: '.12em', color: 'var(--ink)' }}>{t('cpur.summary.payable')}</span>
                        <b style={{ fontFamily: serif, fontSize: fs('22px'), color: 'var(--copper)' }}>{formatINR(pricing.payableAmount)}</b>
                      </div>
                    </div>
                  </div>

                  <div className="rw-pur-block">
                    <div className="rw-pur-block-title">{t('cpur.review.details')}</div>
                    <div className="rw-pur-block-body">
                      <div className="rw-pur-line"><span>{t('cpur.f.name')}</span><b>{customer.name.trim()}</b></div>
                      <div className="rw-pur-line"><span>{t('cpur.f.email')}</span><b>{customer.email.trim()}</b></div>
                      <div className="rw-pur-line"><span>{t('cpur.f.phone')}</span><b>+91 {toPhoneDigits(customer.phone)}</b></div>
                    </div>
                  </div>
                </div>

                <div className="rw-pur-toolbar" style={{ borderTop: '1px solid var(--line)', paddingTop: 22, marginTop: 30 }}>
                  <span className="rw-pur-reason">{submitting ? t('cpur.pay.opening') : t('cpur.pay.hint')}</span>
                  <div className="rw-pur-toolbar-actions">
                    <button type="button" className="rw-form-back" disabled={submitting} onClick={() => goto('details')}>{t('cpur.backDetails')}</button>
                    <button type="button" className="rw-cta rw-cta--live" style={ctaCopper} disabled={submitting} onClick={confirmPurchase}>
                      {submitting ? t('cpur.pay.openingCta') : t('cpur.pay.cta', { amount: formatINR(pricing.payableAmount) })}
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
                <div style={{ ...eyebrow, marginTop: 28 }}>{status.status === 'completed' ? t('cpur.status.okEyebrow') : t('cpur.status.failEyebrow')}</div>
                <h2 style={{ ...sectionHeading, marginTop: 10 }}>{status.status === 'completed' ? t('cpur.status.okTitle') : t('cpur.status.failTitle')}</h2>
                <p style={{ ...note, marginTop: 16, marginLeft: 'auto', marginRight: 'auto', maxWidth: '34em', fontSize: fs('17px'), lineHeight: 1.6 }}>
                  {status.status === 'completed'
                    ? t('cpur.status.okBody')
                    : (status.message || t('cpur.status.failBody'))}
                </p>
                {status.status === 'completed' && (
                  <div className="rw-pur-status-chip">
                    <span>{t('cpur.status.order', { id: status.orderId ?? '\u2014' })}</span>
                    <span>{labelForCountT(t, selected.length)}</span>
                    <span>{t('cpur.status.paid', { amount: formatINR(pricing.payableAmount) })}</span>
                  </div>
                )}
                <div style={{ marginTop: 34, display: 'flex', gap: 18, flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
                  <CtaButton variant="outline" href="/assessment">{t('cpur.status.assessment')}</CtaButton>
                  <CtaButton variant="outline" href="/coaching/result">{t('cpur.status.results')}</CtaButton>
                  {status.status !== 'completed' && (
                    <button type="button" className="rw-cta" style={ctaCopper} onClick={() => goto('review')}>{t('cpur.status.retry')}</button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Live price summary — persistent through selection, details and review */}
          {step !== 'status' && (
            <aside className="rw-pur-side">
              <PriceSummary pricing={pricing} modules={selectedModules} modeLabel={modeLabel} t={t} />
            </aside>
          )}
        </div>

        <div className="rw-pur-footnote">
          <span>{t('cpur.foot.price', { price: formatINR(MODULE_BASE_PRICE) })}</span>
          <span>{t('cpur.foot.t1')}</span>
          <span>{t('cpur.foot.t2')}</span>
          <span>{t('cpur.foot.t3')}</span>
          <span>{t('cpur.foot.t4')}</span>
        </div>
      </section>

      <ClosingCTA chip title={t('cpur.close.title')} titleStyle={{ maxWidth: '16em' }}>
        <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
          <CtaButton variant="outline" href="/coaching/result">{t('cpur.close.result')}</CtaButton>
          <BookButton to="/coaching/form" interest="Coaching" specular>{t('cpur.close.ask')}</BookButton>
        </div>
      </ClosingCTA>

      <Footer links={FOOTER_LINKS} />
    </>
  )
}