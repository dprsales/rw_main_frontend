import { useEffect, useState } from 'react'
import { Navigate, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import Footer from '../components/Footer'
import Header from '../components/Header'
import Seo from '../components/Seo'
import AssessmentForm from '../form/AssessmentForm'
import { ASSESSMENT_TRACKS } from '../form/tracks'
import { FOOTER_LINKS } from '../theme'
import { submitSaleLead } from '../data/api'

// /form — pre-consultation assessment (logic in src/form/); tracks are paths (/form/coaching etc),
// legacy ?track= links redirect to the path form, and unknown/mis-cased segments normalize below.
export default function Form() {
  const { track: trackParam } = useParams()
  const [params] = useSearchParams()
  const navigate = useNavigate()

  const key = trackParam?.toLowerCase()
  const valid = key && ASSESSMENT_TRACKS[key] ? key : null

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
        onSubmit={submitSaleLead}
        // replace:true — track selection shouldn't be a back-button step.
        onTrackChange={(next) => navigate(next ? `/form/${next}` : '/form', { replace: true })}
      />

      <Footer links={FOOTER_LINKS} />
    </>
  )
}
