import { useEffect, useState } from 'react'
import { BookButton } from '../components/BookingModal'
import Footer from '../components/Footer'
import Header from '../components/Header'
import Reveal from '../components/Reveal'
import CtaButton from '../components/CtaButton'
import Seo from '../components/Seo'
import SectionHead, { SectionAside } from '../components/SectionHead'
import useCtaEntrance from '../hooks/useCtaEntrance'
import { getErrorMessage, submitSaleLead } from '../data/api'
import { track } from '../data/analytics'
import goldWatermark from '../assets/site/gold1.png'
import goldLockup from '../assets/site/gold.png'
import { KRISAH_ASSESSMENT_URL } from '../data/content'
import { FOOTER_LINKS, mono, serif } from '../theme'
import { container, eyebrow, note, sectionHeading, sectionRule } from '../styles'

/**
 * Landing page for KRISAH's back button after the interview. It carries no
 * unapproved content: the sixteen areas of specialisation are listed once the
 * founder's curated titles and grouping land (see ASSESSMENT-GAPS-CHECKLIST).
 * Until then the page states the write-up — not a printed catalogue — to avoid
 * publishing any data that has not been signed off.
 */

const fieldStyle = {
  display: 'flex', flexDirection: 'column', gap: 8, flex: '1 1 220px',
}

const fieldInputStyle = {
  fontFamily: mono, fontSize: 11, letterSpacing: '.12em',
  color: 'var(--ink)', background: 'transparent',
  border: '1px solid var(--line)', padding: '0 14px', outline: 'none',
  width: '100%', height: 48, boxSizing: 'border-box', textTransform: 'uppercase',
}

const fieldLabelStyle = {
  fontFamily: mono, fontSize: 10, letterSpacing: '.14em', color: 'var(--faded)',
}

export default function AssessmentResult() {
  const retakeRef = useCtaEntrance({ delay: 0.1 })
  const sendRef = useCtaEntrance({ delay: 0.15 })

  const [cap, setCap] = useState({ name: '', email: '' })
  const [capStatus, setCapStatus] = useState('idle') // idle | sending | ok | error
  const [capMsg, setCapMsg] = useState('')

  useEffect(() => {
    track('assessment_result_view')
  }, [])

  async function submitCapture(e) {
    e.preventDefault()
    const email = cap.email.trim()
    if (!email) return
    setCapStatus('sending')
    try {
      await submitSaleLead({
        track: 'assessment-email-capture',
        name: cap.name.trim(),
        email,
        source: 'AI assessment result',
        submittedAt: new Date().toISOString(),
      })
      setCapStatus('ok')
      track('assessment_lead_captured', { method: 'email' })
    } catch (err) {
      setCapStatus('error')
      setCapMsg(getErrorMessage(err))
    }
  }

  const scrollToCapture = () =>
    document.getElementById('capture')?.scrollIntoView({ behavior: 'smooth' })

  return (
    <>
      <Seo route="/assessment/result" />
      <Header />

      {/* Welcome band — this is where KRISAH's back button lands */}
      <section style={{ ...sectionRule, borderBottom: '1px solid var(--line)', position: 'relative', overflow: 'hidden' }}>
        <img src={goldWatermark} alt="" aria-hidden className="rw-watermark is-right" />
        <div className="rw-pad" style={{ ...container, maxWidth: 880, padding: 'clamp(80px,10vw,110px) 40px', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <Reveal style={{ ...eyebrow, marginBottom: 20 }}>YOU'VE COMPLETED YOUR INTERVIEW</Reveal>
          <Reveal as="h1" delay={80} style={{ ...sectionHeading, fontSize: 'clamp(30px,4.2vw,52px)', lineHeight: 1.1 }}>
            Welcome back. Your interview is complete.
          </Reveal>
          <Reveal as="p" delay={160} style={{ ...note, marginTop: 18, marginLeft: 'auto', marginRight: 'auto', maxWidth: '30em', fontSize: 'clamp(16px,1.7vw,18px)', lineHeight: 1.6 }}>
            In about twenty-five minutes, an AI interviewer read how you structure, pace, and hold your answers across six dimensions. Your scored report is yours to keep, free of charge. We work in sixteen areas of specialisation, ninety to one hundred and twenty minutes each, and we will point you at the ones your report turns up.
          </Reveal>
          <Reveal delay={220} style={{ marginTop: 34, display: 'flex', gap: 34, justifyContent: 'center', flexWrap: 'wrap', fontFamily: mono, fontSize: 11, letterSpacing: '.14em', color: 'var(--faded)' }}>
            <span>16 AREAS</span>
            <span>90–120 MIN EACH</span>
            <span>OF SPECIALISATION</span>
          </Reveal>
          <Reveal delay={280} style={{ marginTop: 22, fontFamily: mono, fontSize: 10, letterSpacing: '.16em', color: 'var(--copper)' }}>
            CONDUCTED WITH KRISAH · BY RAJIV WILLIAMS
          </Reveal>
          <Reveal delay={340} style={{ marginTop: 32, display: 'flex', gap: 18, flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
            <CtaButton variant="gold" onClick={scrollToCapture}>
              GET YOUR PERSONAL WRITE-UP →
            </CtaButton>
            <BookButton interest="Coaching" specular>OR BOOK A CALL</BookButton>
          </Reveal>
        </div>
      </section>

      {/* The sixteen areas — the curated list ships with the write-up */}
      <section id="capture" className="rw-pad" style={{ ...container, ...sectionRule, padding: 'clamp(80px,10vw,110px) 40px' }}>
        <SectionHead
          eyebrow="AFTER YOUR REPORT" titleWidth="14em"
          title="Sixteen areas of specialisation."
          aside={<SectionAside>Curated by the RW team, ninety to one hundred and twenty minutes each, and matched to the gaps an interview usually turns up first.</SectionAside>}
        />

        <Reveal className="rw-figure" style={{ border: '1px solid var(--line)', padding: 'clamp(28px,4vw,40px)', marginTop: 44 }}>
          {capStatus === 'ok' ? (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: mono, fontSize: 10, letterSpacing: '.16em', color: 'var(--copper)' }}>DONE</div>
              <h3 style={{ fontFamily: serif, fontSize: 'clamp(22px,2.6vw,30px)', color: 'var(--ink)', marginTop: 12 }}>
                The full write-up is on its way{cap.name.trim() ? `, ${cap.name.trim()}` : ''}.
              </h3>
              <p style={{ ...note, marginTop: 10, fontSize: 15, lineHeight: 1.55 }}>
                We will send it to {cap.email.trim()} with the complete report, where your gaps sit, and how the sixteen areas map to them.
              </p>
            </div>
          ) : (
            <div>
              <div style={{ fontFamily: mono, fontSize: 10, letterSpacing: '.16em', color: 'var(--copper)' }}>KEEP YOUR REPORT</div>
              <h3 style={{ fontFamily: serif, fontSize: 'clamp(22px,2.6vw,30px)', color: 'var(--ink)', marginTop: 4 }}>
                The full list of the sixteen areas arrives with your write-up.
              </h3>
              <p style={{ ...note, fontSize: 15, lineHeight: 1.55, marginTop: 10, marginBottom: 22 }}>
                Tell us where to send it, and we will follow up with the complete report, your gaps, and the exact areas they map to. No spam, no sequences.
              </p>
              <form onSubmit={submitCapture} style={{ display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'flex-end' }}>
                <label style={fieldStyle}>
                  <span style={fieldLabelStyle}>EMAIL</span>
                  <input
                    type="email"
                    required
                    value={cap.email}
                    onChange={(e) => setCap((c) => ({ ...c, email: e.target.value }))}
                    placeholder="YOU@COMPANY.COM"
                    aria-label="Email address"
                    style={fieldInputStyle}
                  />
                </label>
                <label style={fieldStyle}>
                  <span style={fieldLabelStyle}>NAME (OPTIONAL)</span>
                  <input
                    type="text"
                    value={cap.name}
                    onChange={(e) => setCap((c) => ({ ...c, name: e.target.value }))}
                    placeholder="FULL NAME"
                    aria-label="Your name"
                    style={fieldInputStyle}
                  />
                </label>
                <CtaButton ref={sendRef} type="submit" variant="gold" disabled={capStatus === 'sending'} style={{ fontFamily: mono, cursor: capStatus === 'sending' ? 'wait' : 'pointer' }}>
                  {capStatus === 'sending' ? 'SENDING…' : 'SEND MY REPORT'}
                </CtaButton>
              </form>
              {capStatus === 'error' && (
                <p style={{ ...note, marginTop: 14, fontSize: 13, lineHeight: 1.5, color: '#d9826b' }}>{capMsg}</p>
              )}
            </div>
          )}
        </Reveal>
      </section>

      {/* Not ready to book? */}
      <section style={{ ...sectionRule, background: 'var(--chip)' }}>
        <div className="rw-pad" style={{ ...container, maxWidth: 880, padding: 'clamp(70px,9vw,100px) 40px', textAlign: 'center' }}>
          <Reveal style={{ marginBottom: 22, display: 'flex', justifyContent: 'center' }}>
            <img
              src={goldLockup}
              alt="Rajiv Williams"
              style={{ height: 'clamp(72px, 11vw, 120px)', width: 'auto', objectFit: 'contain', mixBlendMode: 'screen' }}
            />
          </Reveal>
          <Reveal as="h2" style={{ ...sectionHeading, fontSize: 'clamp(26px,3.4vw,42px)', lineHeight: 1.12 }}>
            Take it again in a month and watch the score move.
          </Reveal>
          <Reveal as="p" delay={120} style={{ ...note, marginTop: 16, marginLeft: 'auto', marginRight: 'auto', maxWidth: '30em', fontSize: 16, lineHeight: 1.6 }}>
            The assessment is complimentary and open anytime. Re-run it before you rehearse and after. Measure the delta.
          </Reveal>
          <Reveal delay={200} style={{ marginTop: 30, display: 'flex', gap: 18, flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
            <CtaButton ref={retakeRef} href={KRISAH_ASSESSMENT_URL} target="_blank" rel="noopener noreferrer" live onClick={() => track('krisah_assessment_start', { location: 'retake' })}>
              RETAKING ASSESSMENT <span className="rw-cta-arrow">→</span>
            </CtaButton>
            <BookButton interest="Coaching" specular>OR BOOK A CALL FIRST</BookButton>
          </Reveal>
        </div>
      </section>

      <Footer links={FOOTER_LINKS} />
    </>
  )
}