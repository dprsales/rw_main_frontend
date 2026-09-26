import { useEffect, useRef, useState } from 'react'
import { Navigate, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import Footer from '../components/Footer'
import Header from '../components/Header'
import Seo from '../components/Seo'
import AssessmentForm from '../form/AssessmentForm'
import { ASSESSMENT_TRACKS } from '../form/tracks'
import { FOOTER_LINKS } from '../theme'
import { submitSaleLead } from '../data/api'
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

// /form — pre-consultation assessment (logic in src/form/); tracks are paths (/form/coaching etc),
// legacy ?track= links redirect to the path form, and unknown/mis-cased segments normalize below.
export default function Form() {
  const { track: trackParam } = useParams()
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const { state } = useLocation()
  const finder = state?.prefill?.finder || null
  // Analytics-only correlation from the Finder; deliberately kept out of the lead payload.
  const attemptId = state?.attemptId

  const key = trackParam?.toLowerCase()
  const valid = key && ASSESSMENT_TRACKS[key] ? key : null

  // One submission per questionnaire instance: a new track starts a new submissionId,
  // retries on the same track reuse it (handoff §10.4).
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
    if ((submissionRef.current?.track ?? null) === valid) return   // StrictMode double-invokes effects in dev
    submissionRef.current = valid ? { track: valid, id: newId(), attempts: 0, started: false, accepted: false } : null
    if (valid) track('lead_form_viewed', leadContext())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [valid])

  // Measured header height positions the progress rail; must run before any conditional return below.
  const [headerH, setHeaderH] = useState(0)
  useEffect(() => {
    const measure = () => setHeaderH(document.querySelector('header')?.offsetHeight || 0)
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  // Legacy ?track= is only honoured on bare /form; a path segment takes priority.
  const legacy = params.get('track')?.toLowerCase()
  if (!trackParam && legacy && ASSESSMENT_TRACKS[legacy]) {
    return <Navigate to={`/form/${legacy}`} replace />
  }

  // Normalize casing and unknown tracks onto a canonical URL.
  if (trackParam && key !== trackParam) return <Navigate to={`/form/${key}`} replace />
  if (trackParam && !valid) return <Navigate to="/form" replace />

  return (
    <>
      <Seo route={valid ? `/form/${valid}` : '/form'} />
      <Header />

      <AssessmentForm
        // Keyed by track so switching questionnaires builds a fresh form.
        key={valid || 'picker'}
        initialTrack={valid}
        stickyOffset={headerH}
        prefill={valid ? prefillFromFinder(valid, finder) : {}}
        // The finder's answers ride along so the CRM sees how the visitor got here.
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
            track('lead_submission_failed', { ...leadContext(), submissionId: sub.id, submitAttempt: sub.attempts, errorCategory: errorCategory(err) })
            throw err
          }
          if (!sub.accepted) {
            sub.accepted = true
            // Accepted and saved enquiry — not a confirmed meeting (see handoff §10).
            track('lead_submitted', { ...leadContext(), submissionId: sub.id, submitAttempt: sub.attempts, crmDelivery: crmDeliveryOf(result) })
          }
          return result
        }}
        // Keep Finder context while the visitor compares tracks; the selected URL still controls the questionnaire.
        onTrackChange={(next) => navigate(next ? `/form/${next}` : '/form', {
          replace: true,
          state: finder ? { prefill: { finder }, attemptId } : null,
        })}
      />

      <Footer links={FOOTER_LINKS} />
    </>
  )
}
