import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import AssessmentForm from '../form/AssessmentForm'
import { ASSESSMENT_TRACKS } from '../form/tracks'
import { submitSaleLead } from '../data/api'
import { crmDeliveryOf, errorCategory, newId, track } from '../data/analytics'
import { headerOffset, useSmoothScroll } from '../hooks/useSmoothScroll'
import '../form/form.css'

/** Only keep prefill values that exist on this track's questions. */
function sanitizePrefill(trackKey, raw = {}) {
  const questions = ASSESSMENT_TRACKS[trackKey]?.questions || []
  const out = {}
  for (const [id, value] of Object.entries(raw || {})) {
    if (value == null || value === '') continue
    const q = questions.find((x) => x.id === id)
    if (!q) continue
    if (q.options) {
      if (Array.isArray(value)) {
        const kept = value.filter((v) => q.options.includes(v))
        if (kept.length) out[id] = kept
      } else if (q.options.includes(value)) {
        out[id] = value
      }
      continue
    }
    out[id] = value
  }
  return out
}

/** Finder answers → this track's question ids when the option exists. */
function prefillFromFinder(trackKey, finder) {
  if (!finder) return {}
  const wanted = {
    role: { developer: 'Builder / Developer', sales_leader: 'Sales Head', sales_pro: 'Sales Executive' }[finder.who],
  }
  return sanitizePrefill(trackKey, wanted)
}

/**
 * Coaching / Consulting / Realty enquiry form embedded at the bottom of the
 * landing page (replaces the old ClosingCTA band). Anchor: #enquire.
 */
export default function ServiceLandingForm({ trackKey }) {
  const { state, hash } = useLocation()
  const scrollToId = useSmoothScroll()
  const finder = state?.prefill?.finder || null
  const attemptId = state?.attemptId
  const valid = ASSESSMENT_TRACKS[trackKey] ? trackKey : null
  const rawRoutePrefill = state?.prefill && typeof state.prefill === 'object'
    ? Object.fromEntries(Object.entries(state.prefill).filter(([key]) => key !== 'finder'))
    : {}
  const routePrefill = valid
    ? sanitizePrefill(valid, {
        ...prefillFromFinder(valid, finder),
        ...rawRoutePrefill,
      })
    : {}
  const prefillKey = valid
    ? `${valid}:${routePrefill.goal || ''}:${Array.isArray(routePrefill.role) ? routePrefill.role.join(',') : (routePrefill.role || '')}`
    : 'none'

  const leadContext = () => ({
    flow: 'assessment_form',
    source: finder ? 'guided_finder' : 'landing_form',
    track: valid,
    recommendedService: finder?.recommendedService,
    visitorType: finder?.who,
    attemptId,
    page: `/${trackKey}`,
  })

  const submissionRef = useRef(null)
  useEffect(() => {
    if ((submissionRef.current?.track ?? null) === valid) return
    submissionRef.current = valid ? { track: valid, id: newId(), attempts: 0, started: false, accepted: false } : null
    if (valid) track('lead_form_viewed', leadContext())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [valid])

  const [headerH, setHeaderH] = useState(0)
  useEffect(() => {
    const measure = () => setHeaderH(headerOffset())
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  useEffect(() => {
    if (hash !== '#enquire') return undefined
    const t = window.setTimeout(() => scrollToId('enquire'), 80)
    return () => window.clearTimeout(t)
  }, [hash, scrollToId])

  if (!valid) return null

  return (
    <section
      id="enquire"
      className="rw-landing-form"
      aria-label="Enquiry form"
      style={{ borderTop: '1px solid var(--line)', background: 'var(--chip)' }}
    >
      <AssessmentForm
        key={prefillKey}
        embedded
        initialTrack={valid}
        stickyOffset={headerH}
        prefill={routePrefill}
        extraAnswers={finder ? { finder } : {}}
        onFirstInput={() => {
          const sub = submissionRef.current
          if (!sub || sub.started) return
          sub.started = true
          track('lead_started', { ...leadContext(), submissionId: sub.id })
        }}
        onSubmit={async (payload) => {
          const sub = submissionRef.current || { id: newId(), attempts: 0 }
          sub.attempts += 1
          let result
          try {
            result = await submitSaleLead(payload)
          } catch (err) {
            track('lead_submission_failed', {
              ...leadContext(),
              submissionId: sub.id,
              submitAttempt: sub.attempts,
              errorCategory: errorCategory(err),
            })
            throw err
          }
          if (!sub.accepted) {
            sub.accepted = true
            track('lead_submitted', {
              ...leadContext(),
              submissionId: sub.id,
              submitAttempt: sub.attempts,
              crmDelivery: crmDeliveryOf(result),
            })
          }
          return result
        }}
      />
    </section>
  )
}
