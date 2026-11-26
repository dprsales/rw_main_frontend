import { Link, Navigate, useLocation } from 'react-router-dom'
import Footer from '../components/Footer'
import Header from '../components/Header'
import Seo from '../components/Seo'
import Reveal from '../components/Reveal'
import { BookButton } from '../components/BookingModal'
import { coachingProgramByPath } from '../data/coachingProgramPages'
import { FOOTER_LINKS, jost, mono, serif, text } from '../theme'
import { ctaCopper } from '../styles'
import './coaching-program.css'

/**
 * Shared landing for Luxury / High Ticket / One-to-One.
 * Hero (short) → who/session → process steps → enquire.
 */
export default function CoachingProgram() {
  const { pathname } = useLocation()
  const program = coachingProgramByPath(pathname)

  if (!program) return <Navigate to="/coaching" replace />

  const enquireTo = '/coaching#enquire'
  const process = program.process || []
  /* Same coaching form for all three; preselect this programme on the goal field. */
  const enquireState = { prefill: { goal: program.title } }

  return (
    <>
      <Seo route={program.path} />
      <Header />

      <main className="rw-cp">
        <section className="rw-cp-hero" aria-labelledby="cp-hero-title">
          <div className="rw-cp-hero-media" aria-hidden="true">
            <img
              src={program.cover}
              alt=""
              style={program.objectPosition ? { objectPosition: program.objectPosition } : undefined}
            />
          </div>
          <div className="rw-cp-hero-copy rw-pad">
            <Reveal className="rw-cp-hero-stack">
              <p className="rw-cp-eyebrow" style={{ fontFamily: mono }}>{program.eyebrow}</p>
              <h1 id="cp-hero-title" className="rw-cp-title" style={{ fontFamily: serif }}>
                {(program.titleLines || [program.title]).map((line) => (
                  <span key={line} className="rw-cp-title-gold">{line}</span>
                ))}
              </h1>
              <p className="rw-cp-lede" style={{ fontFamily: text }}>{program.lede || program.description}</p>
              <div className="rw-cp-actions">
                <BookButton
                  to={enquireTo}
                  state={enquireState}
                  interest="Coaching"
                  className="rw-cta"
                  style={ctaCopper}
                >
                  Enquire about this programme <span className="rw-cta-arrow">→</span>
                </BookButton>
                <Link to="/coaching#premium-programs" className="rw-cp-secondary">
                  ← Back to coaching
                </Link>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="rw-cp-section">
          <div className="rw-cp-grid">
            <Reveal>
              <p className="rw-cp-eyebrow" style={{ fontFamily: mono }}>Built for</p>
              <h2 className="rw-cp-h2" style={{ fontFamily: serif }}>Who this is for</h2>
              <p className="rw-cp-note" style={{ fontFamily: text }}>{program.proof || program.audience}</p>
              <div className="rw-cp-meta">
                <div className="rw-cp-meta-card">
                  <p className="rw-cp-meta-label" style={{ fontFamily: mono }}>Session</p>
                  <p className="rw-cp-meta-value" style={{ fontFamily: text }}>{program.session}</p>
                </div>
                <div className="rw-cp-meta-card">
                  <p className="rw-cp-meta-label" style={{ fontFamily: mono }}>What you leave with</p>
                  <p className="rw-cp-meta-value" style={{ fontFamily: text }}>{program.outcome}</p>
                </div>
              </div>
            </Reveal>

            <Reveal delay={80}>
              <p className="rw-cp-eyebrow" style={{ fontFamily: mono }}>The difference</p>
              <h2 className="rw-cp-h2" style={{ fontFamily: serif }}>{program.processTitle || 'What you sharpen'}</h2>
              <ol className="rw-cp-process">
                {process.map((step, i) => (
                  <li key={step.heading}>
                    <span className="rw-cp-list-num" style={{ fontFamily: mono }}>{String(i + 1).padStart(2, '0')}</span>
                    <div className="rw-cp-process-body">
                      <p className="rw-cp-process-heading" style={{ fontFamily: jost }}>{step.heading}</p>
                      <p className="rw-cp-process-line" style={{ fontFamily: text }}>{step.line}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </Reveal>
          </div>
        </section>

        <section className="rw-cp-cta-band rw-pad">
          <Reveal className="rw-cp-cta-stack">
            <h2 className="rw-cp-h2" style={{ fontFamily: serif }}>Ready for the next level?</h2>
            <p className="rw-cp-note" style={{ fontFamily: text }}>
              Talk with us about the right programme for you or your sales leadership.
            </p>
            <div className="rw-cp-actions">
              <BookButton
                to={enquireTo}
                state={enquireState}
                interest="Coaching"
                className="rw-cta"
                style={ctaCopper}
              >
                Enquire now <span className="rw-cta-arrow">→</span>
              </BookButton>
              <Link to="/coaching#premium-programs" className="rw-cp-secondary">
                ← Back to coaching
              </Link>
            </div>
          </Reveal>
        </section>
      </main>

      <Footer links={FOOTER_LINKS} />
    </>
  )
}
