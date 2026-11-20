import { Link, Navigate, useLocation } from 'react-router-dom'
import Footer from '../components/Footer'
import Header from '../components/Header'
import Seo from '../components/Seo'
import Reveal from '../components/Reveal'
import { BookButton } from '../components/BookingModal'
import { coachingProgramByPath } from '../data/coachingProgramPages'
import { FOOTER_LINKS, mono, serif, text } from '../theme'
import { ctaCopper } from '../styles'
import './coaching-program.css'

/**
 * Shared simple landing for Luxury / High Ticket / One-to-One.
 * Hero → included → outcome → enquire CTA. Expand with deeper content later.
 */
export default function CoachingProgram() {
  const { pathname } = useLocation()
  const program = coachingProgramByPath(pathname)

  if (!program) return <Navigate to="/coaching" replace />

  const seoRoute = program.path
  const enquireTo = '/coaching#enquire'

  return (
    <>
      <Seo route={seoRoute} />
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
              <p className="rw-cp-lede" style={{ fontFamily: text }}>{program.description}</p>
              <p className="rw-cp-proof" style={{ fontFamily: text }}>{program.proof}</p>
              <div className="rw-cp-actions">
                <BookButton to={enquireTo} interest="Coaching" className="rw-cta" style={ctaCopper}>
                  Enquire about this programme <span className="rw-cta-arrow">→</span>
                </BookButton>
                <Link to="/coaching#premium-programs" className="rw-cp-secondary">
                  All three ways in
                </Link>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="rw-cp-section">
          <div className="rw-cp-grid">
            <Reveal>
              <p className="rw-cp-eyebrow" style={{ fontFamily: mono }}>What you work on</p>
              <h2 className="rw-cp-h2" style={{ fontFamily: serif }}>Included in this programme</h2>
              <p className="rw-cp-note" style={{ fontFamily: text }}>{program.outcome}</p>
              <div className="rw-cp-meta">
                <div className="rw-cp-meta-card">
                  <p className="rw-cp-meta-label" style={{ fontFamily: mono }}>Who it is for</p>
                  <p className="rw-cp-meta-value" style={{ fontFamily: text }}>{program.audience}</p>
                </div>
                <div className="rw-cp-meta-card">
                  <p className="rw-cp-meta-label" style={{ fontFamily: mono }}>Session</p>
                  <p className="rw-cp-meta-value" style={{ fontFamily: text }}>{program.session}</p>
                </div>
              </div>
            </Reveal>

            <Reveal delay={100}>
              <ol className="rw-cp-list">
                {program.focus.map((line, i) => (
                  <li key={line}>
                    <span className="rw-cp-list-num" style={{ fontFamily: mono }}>{String(i + 1).padStart(2, '0')}</span>
                    <span style={{ fontFamily: text }}>{line}</span>
                  </li>
                ))}
              </ol>
            </Reveal>
          </div>
        </section>

        <section className="rw-cp-section is-chip">
          <div className="rw-cp-section-inner">
            <Reveal>
              <p className="rw-cp-eyebrow" style={{ fontFamily: mono }}>Also covered</p>
              <h2 className="rw-cp-h2" style={{ fontFamily: serif }}>Core focus areas</h2>
              <ul className="rw-cp-list" style={{ marginTop: 28 }}>
                {program.features.map((feature, i) => (
                  <li key={feature}>
                    <span className="rw-cp-list-num" style={{ fontFamily: mono }}>{String(i + 1).padStart(2, '0')}</span>
                    <span style={{ fontFamily: text }}>{feature}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </section>

        <section className="rw-cp-cta-band rw-pad">
          <Reveal className="rw-cp-cta-stack">
            <h2 className="rw-cp-h2" style={{ fontFamily: serif }}>Ready to talk this through?</h2>
            <p className="rw-cp-note" style={{ fontFamily: text }}>
              Tell Team RW where you are stuck. We will point you to the right programme or a one-to-one path.
            </p>
            <div className="rw-cp-actions">
              <BookButton to={enquireTo} interest="Coaching" className="rw-cta" style={ctaCopper}>
                Talk to Team RW <span className="rw-cta-arrow">→</span>
              </BookButton>
              <Link to="/assessment" className="rw-cp-secondary">
                Take the assessment
              </Link>
            </div>
          </Reveal>
        </section>
      </main>

      <Footer links={FOOTER_LINKS} />
    </>
  )
}
