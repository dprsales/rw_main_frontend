import { useEffect, useRef, useState } from 'react'
import { Navigate, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import Footer from '../components/Footer'
import Header from '../components/Header'
import Seo from '../components/Seo'
import AssessmentForm from '../form/AssessmentForm'
import { ASSESSMENT_TRACKS } from '../form/tracks'
import { FOOTER_LINKS } from '../theme'
import { submitSaleLead } from '../data/api'
import { formPathForTrack, formReturnPath } from '../data/booking'
import { crmDeliveryOf, errorCategory, newId, track } from '../data/analytics'

/** Finder answers → this track's own question ids, only where the option label exists in the track. */
function prefillFromFinder(trackKey, finder) {
  if (!finder) return {}
  const questions = ASSESSMENT_TRACKS[trackKey]?.questions || []
  const wanted = {
    role: { developer: 'Builder / Developer', sales_leader: 'Sales Head', sales_pro: 'Sales Executive' }[finder.who],
  }
  const out = {}
  for (const [id, value] of Object.entries(wanted)) {
    const q = questions.find((x) => x.id === id)
    if (q && value && q.options?.includes(value)) out[id] = value
  }
  return out
}

/**
 * Service forms live at `/coaching/form`, `/consulting/form`, `/realty/form`.
 * `/form` is the track picker. Legacy `/form/:track` redirects here.
 */
export default function Form({ forcedTrack = null }) {
  const { track: trackParam } = useParams()
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const { state, pathname } = useLocation()
  const finder = state?.prefill?.finder || null
  const attemptId = state?.attemptId
  const from = state?.from

  const key = (forcedTrack || trackParam || '').toLowerCase() || null
  const valid = key && ASSESSMENT_TRACKS[key] ? key : null

  const leadContext = () => ({
    flow: 'assessment_form',
    source: finder ? 'guided_finder' : 'form',
    track: valid,
    recommendedService: finder?.recommendedService,
    visitorType: finder?.who,
    attemptId,
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
    const measure = () => setHeaderH(document.querySelector('header')?.offsetHeight || 0)
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  // Legacy ?track= on bare /form → /{track}/form
  const legacy = params.get('track')?.toLowerCase()
  if (!forcedTrack && !trackParam && legacy && ASSESSMENT_TRACKS[legacy]) {
    return <Navigate to={formPathForTrack(legacy)} replace state={state} />
  }

  // Legacy /form/:track → /{track}/form
  if (!forcedTrack && trackParam) {
    if (ASSESSMENT_TRACKS[key]) {
      return <Navigate to={formPathForTrack(key)} replace state={state} />
    }
    return <Navigate to="/form" replace />
  }

  const seoRoute = valid ? formPathForTrack(valid) : '/form'
  const returnTo = formReturnPath(valid, from)

  return (
    <>
      <Seo route={seoRoute} />
      <Header />

      <AssessmentForm
        key={valid || 'picker'}
        initialTrack={valid}
        stickyOffset={headerH}
        prefill={valid ? prefillFromFinder(valid, finder) : {}}
        extraAnswers={finder ? { finder } : {}}
        returnTo={returnTo}
        onBack={() => navigate(returnTo)}
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
            track('lead_submission_failed', { ...leadContext(), submissionId: sub.id, submitAttempt: sub.attempts, errorCategory: errorCategory(err) })
            throw err
          }
          if (!sub.accepted) {
            sub.accepted = true
            track('lead_submitted', { ...leadContext(), submissionId: sub.id, submitAttempt: sub.attempts, crmDelivery: crmDeliveryOf(result) })
          }
          return result
        }}
        onTrackChange={(next) => navigate(next ? formPathForTrack(next) : '/form', {
          replace: true,
          state: {
            ...(finder ? { prefill: { finder }, attemptId } : {}),
            from: from || pathname,
          },
        })}
      />

      <Footer links={FOOTER_LINKS} />
    </>
  )
}
