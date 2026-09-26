import { forwardRef, useCallback, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { BookButton } from './BookingModal'
import BorderGlow from './BorderGlow'
import CtaButton from './CtaButton'
import FinderSteps from './FinderSteps'
import Reveal from './Reveal'
import { track } from '../data/analytics'
import { useFinder } from '../hooks/useFinder'
import { eyebrow, sectionHeadingLg, body } from '../styles'
import './GuidedFinder.css'

/** Same cursor-tracked gold edge the careers cards use (CAREER_GLOW in Careers.jsx). */
const FINDER_GLOW = {
  backgroundColor: 'var(--card)',
  glowColor: '41 82 71',
  colors: ['#C39B53', '#E8C97A', '#A67C3D'],
  borderRadius: 4,
  glowRadius: 24,
  fillOpacity: 0.22,
  animated: false,
}

/**
 * "Find the right fit" — one question at a time, then a recommendation card that
 * hands off to the existing booking modal or the existing /form questionnaire.
 * The same questions also run inside the booking modal (see BookingModal.jsx).
 *
 *   variant   'inline' (a section on Home) | 'page' (/start)
 *   seed      { who } pre-answers Q1, e.g. from a service page link
 *   location  analytics label ('home' | 'start')
 */
export default function GuidedFinder({ variant = 'inline', seed = {}, location = 'home' }) {
  const navigate = useNavigate()
  const finder = useFinder({ seed, location })
  const { answers, stepIndex, done, result, guidance, back, restart } = finder
  const cardRef = useRef(null)
  const rootRef = useRef(null)
  const openedRef = useRef(false)

  // finder_opened once, when the section is actually seen.
  useEffect(() => {
    const el = rootRef.current
    if (!el || openedRef.current) return
    const fire = () => {
      if (openedRef.current) return
      openedRef.current = true
      track('finder_opened', { location, seed: seed.who })
    }
    if (variant === 'page' || typeof IntersectionObserver === 'undefined') { fire(); return }
    const io = new IntersectionObserver((entries) => { if (entries.some((e) => e.isIntersecting)) { fire(); io.disconnect() } }, { threshold: 0.3 })
    io.observe(el)
    return () => io.disconnect()
  }, [variant, location, seed.who])

  // Keep the section in view as it changes height between steps; focus the result when it lands.
  useEffect(() => {
    if (done) cardRef.current?.focus({ preventScroll: true })
    if (rootRef.current && rootRef.current.getBoundingClientRect().top < 0) {
      rootRef.current.scrollIntoView({ block: 'start', behavior: 'smooth' })
    }
  }, [finder.current, done])

  const startOver = useCallback(() => {
    restart()
    rootRef.current?.scrollIntoView({ block: 'start', behavior: 'smooth' })
  }, [restart])

  const browseServices = () => {
    if (variant === 'inline') {
      document.getElementById('services')?.scrollIntoView({ block: 'start', behavior: 'smooth' })
    } else {
      navigate('/', { state: { scrollTo: 'services' } })
    }
  }

  const deepPath = () => {
    track('finder_service_click', { recommendedService: result.outcome.key, target: 'form', location })
    navigate(`/form/${result.outcome.formTrack}`, { state: { prefill: { finder: { ...answers, recommendedService: result.outcome.key, rule: result.rule } } } })
  }

  return (
    <section
      id="finder"
      ref={rootRef}
      className={`rw-finder rw-pad ${variant === 'page' ? 'rw-finder--page' : ''}`}
      style={{ padding: variant === 'page' ? '80px 40px clamp(80px,10vw,120px)' : 'clamp(72px,9vw,110px) 40px', borderTop: variant === 'inline' ? '1px solid var(--line)' : 'none' }}
      aria-labelledby="finder-heading"
    >
      <div className="rw-finder-inner">
        <div className="rw-finder-lead">
          <Reveal style={{ ...eyebrow, marginBottom: 22 }}>FIND THE RIGHT FIT</Reveal>
          <Reveal as={variant === 'page' ? 'h1' : 'h2'} id="finder-heading" delay={80} style={{ ...sectionHeadingLg, fontSize: 'clamp(28px,3.1vw,44px)', lineHeight: 1.08 }}>
            Tell us who you are. <span style={{ fontStyle: 'italic', color: 'var(--copper)' }}>We&rsquo;ll point you in right direction.</span>
          </Reveal>
          <Reveal as="p" delay={140} style={{ ...body, marginTop: 22, maxWidth: '30em' }}>
            One to three taps, no typing. You can change an answer at any point, or skip this and book a call directly.
          </Reveal>
        </div>

        <div className="rw-finder-stage" aria-live="polite">
          <FinderSteps finder={finder} onStartOver={startOver}>
            <div className="rw-finder-links">
              {stepIndex > 0 && <CtaButton variant="secondary" arrow="←" onClick={back}>Back</CtaButton>}
              <BookButton specular source="finder_skip" skipQuestions> BOOK A CALL</BookButton>
              <CtaButton variant="secondary" arrow="→" onClick={browseServices}>BROWSE SERVICES </CtaButton>
            </div>
          </FinderSteps>

          {done && result && (
            <ResultCard
              ref={cardRef}
              result={result}
              guidance={{ ...guidance, onEdit: startOver }}
              onDeepPath={deepPath}
              onBrowse={browseServices}
              location={location}
            />
          )}
        </div>
      </div>
    </section>
  )
}

const ResultCard = forwardRef(function ResultCard({ result, guidance, onDeepPath, onBrowse, location }, ref) {
  const { outcome, reason, secondary, candidates } = result
  const isCall = outcome.key === 'strategy_call'
  const isBrowse = outcome.key === 'realty_portfolio'
  const title = isCall && candidates.length
    ? candidates.map((c) => c.name).join(' or ')
    : outcome.name

  const bookPreset = {
    interest: outcome.interest,
    guidance,
    source: 'guided_finder',
    eyebrow: isCall ? 'BOOK A STRATEGY CALL' : `BOOK A STRATEGY CALL · ${outcome.name.toUpperCase()}`,
  }

  return (
    <BorderGlow {...FINDER_GLOW} className="rw-finder-card-glow">
    <div className="rw-finder-card" role="region" aria-label="Our recommendation">
      <div className="rw-finder-card-eyebrow">BASED ON YOUR ANSWERS</div>
      <h3 ref={ref} tabIndex={-1} className="rw-finder-card-title">{title}</h3>
      <p className="rw-finder-card-reason">{reason}</p>

      <div className="rw-finder-card-actions">
        <BookButton specular {...bookPreset}>BOOK A STRATEGY CALL</BookButton>
        {outcome.formTrack && (
          <CtaButton variant="outline" onClick={onDeepPath}>TELL US MORE FIRST</CtaButton>
        )}
        {isBrowse && (
          <CtaButton variant="outline" href={outcome.to} onClick={() => track('finder_service_click', { recommendedService: outcome.key, target: 'browse', location })}>
            BROWSE THE PROJECTS
          </CtaButton>
        )}
      </div>

      {/* Ways onward that are not a booking: read about the service, the assessment, or all three services. */}
      <div className="rw-finder-card-secondary">
        {outcome.to && !isBrowse && (
          <CtaButton variant="secondary" to={outcome.to} arrow="→"
            onClick={() => track('finder_service_click', { recommendedService: outcome.key, target: 'page', location })}>
            {outcome.cta}
          </CtaButton>
        )}
        {secondary && (
          <CtaButton variant="secondary" to={secondary.to} arrow="→"
            onClick={() => track('finder_service_click', { recommendedService: outcome.key, target: 'secondary', location })}>
            {secondary.label}
          </CtaButton>
        )}
        <CtaButton variant="secondary" arrow="→" onClick={onBrowse}>BROWSE SERVICES </CtaButton>
      </div>
    </div>
    </BorderGlow>
  )
})
