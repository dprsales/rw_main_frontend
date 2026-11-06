import { useEffect, useState } from 'react'
import { BookButton } from '../components/BookingModal'
import Footer from '../components/Footer'
import Header from '../components/Header'
import Reveal from '../components/Reveal'
import CtaButton from '../components/CtaButton'
import Seo from '../components/Seo'
import SectionHead, { SectionAside } from '../components/SectionHead'
import useCtaEntrance from '../hooks/useCtaEntrance'
import { useLang } from '../i18n/LangProvider'
import { getErrorMessage, submitSaleLead } from '../data/api'
import { track } from '../data/analytics'
import goldWatermark from '../assets/site/rw-logo-ccr.png'
import goldLockup from '../assets/site/gold.png'
import { KRISAH_ASSESSMENT_URL } from '../data/content'
import { FOOTER_LINKS, mono, serif } from '../theme'
import { fs, container, eyebrow, note, sectionHeading, sectionRule } from '../styles'

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
  fontFamily: mono, fontSize: fs('11px'), letterSpacing: '.12em',
  color: 'var(--ink)', background: 'transparent',
  border: '1px solid var(--line)', padding: '0 14px', outline: 'none',
  width: '100%', height: 48, boxSizing: 'border-box', textTransform: 'uppercase',
}

const fieldLabelStyle = {
  fontFamily: mono, fontSize: fs('10px'), letterSpacing: '.14em', color: 'var(--faded)',
}

export default function AssessmentResult() {
  const { t } = useLang()
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
          <Reveal style={{ ...eyebrow, marginBottom: 20 }}>{t('result.eyebrow')}</Reveal>
          <Reveal as="h1" delay={80} style={{ ...sectionHeading, fontSize: fs('clamp(30px,4.2vw,52px)'), lineHeight: 1.1 }}>
            {t('result.title')}
          </Reveal>
          <Reveal as="p" delay={160} style={{ ...note, marginTop: 18, marginLeft: 'auto', marginRight: 'auto', maxWidth: '30em', fontSize: fs('clamp(16px,1.7vw,18px)'), lineHeight: 1.6 }}>
            {t('result.body')}
          </Reveal>
          <Reveal delay={220} style={{ marginTop: 34, display: 'flex', gap: 34, justifyContent: 'center', flexWrap: 'wrap', fontFamily: mono, fontSize: fs('11px'), letterSpacing: '.14em', color: 'var(--faded)' }}>
            <span>{t('result.meta.0')}</span>
            <span>{t('result.meta.1')}</span>
            <span>{t('result.meta.2')}</span>
          </Reveal>
          <Reveal delay={280} style={{ marginTop: 22, fontFamily: mono, fontSize: fs('10px'), letterSpacing: '.16em', color: 'var(--copper)' }}>
            {t('result.by')}
          </Reveal>
          <Reveal delay={340} style={{ marginTop: 32, display: 'flex', gap: 18, flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
            <CtaButton variant="gold" onClick={scrollToCapture}>
              {t('result.writeup')}
            </CtaButton>
            <BookButton interest="Coaching" specular>{t('result.call')}</BookButton>
          </Reveal>
        </div>
      </section>

      {/* The sixteen areas — the curated list ships with the write-up */}
      <section id="capture" className="rw-pad" style={{ ...container, ...sectionRule, padding: 'clamp(80px,10vw,110px) 40px' }}>
        <SectionHead
          eyebrow={t('result.after.eyebrow')} titleWidth="14em"
          title={t('result.after.title')}
          aside={<SectionAside>{t('result.after.aside')}</SectionAside>}
        />

        <Reveal className="rw-figure" style={{ border: '1px solid var(--line)', padding: 'clamp(28px,4vw,40px)', marginTop: 44 }}>
          {capStatus === 'ok' ? (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: mono, fontSize: fs('10px'), letterSpacing: '.16em', color: 'var(--copper)' }}>{t('result.done')}</div>
              <h3 style={{ fontFamily: serif, fontSize: fs('clamp(22px,2.6vw,30px)'), color: 'var(--ink)', marginTop: 12 }}>
                {t('result.sent', { name: cap.name.trim() ? `, ${cap.name.trim()}` : '' })}
              </h3>
              <p style={{ ...note, marginTop: 10, fontSize: fs('15px'), lineHeight: 1.55 }}>
                {t('result.sentBody', { email: cap.email.trim() })}
              </p>
            </div>
          ) : (
            <div>
              <div style={{ fontFamily: mono, fontSize: fs('10px'), letterSpacing: '.16em', color: 'var(--copper)' }}>{t('result.keep')}</div>
              <h3 style={{ fontFamily: serif, fontSize: fs('clamp(22px,2.6vw,30px)'), color: 'var(--ink)', marginTop: 4 }}>
                {t('result.formTitle')}
              </h3>
              <p style={{ ...note, fontSize: fs('15px'), lineHeight: 1.55, marginTop: 10, marginBottom: 22 }}>
                {t('result.formBody')}
              </p>
              <form onSubmit={submitCapture} style={{ display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'flex-end' }}>
                <label style={fieldStyle}>
                  <span style={fieldLabelStyle}>{t('result.email')}</span>
                  <input
                    type="email"
                    required
                    value={cap.email}
                    onChange={(e) => setCap((c) => ({ ...c, email: e.target.value }))}
                    placeholder={t('result.emailPh')}
                    aria-label={t('result.emailAria')}
                    style={fieldInputStyle}
                  />
                </label>
                <label style={fieldStyle}>
                  <span style={fieldLabelStyle}>{t('result.name')}</span>
                  <input
                    type="text"
                    value={cap.name}
                    onChange={(e) => setCap((c) => ({ ...c, name: e.target.value }))}
                    placeholder={t('result.namePh')}
                    aria-label={t('result.nameAria')}
                    style={fieldInputStyle}
                  />
                </label>
                <CtaButton ref={sendRef} type="submit" variant="gold" disabled={capStatus === 'sending'} style={{ fontFamily: mono, cursor: capStatus === 'sending' ? 'wait' : 'pointer' }}>
                  {capStatus === 'sending' ? t('apply.sending') : t('result.send')}
                </CtaButton>
              </form>
              {capStatus === 'error' && (
                <p style={{ ...note, marginTop: 14, fontSize: fs('13px'), lineHeight: 1.5, color: '#d9826b' }}>{capMsg}</p>
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
              alt={t('result.by')}
              style={{ height: 'clamp(72px, 11vw, 120px)', width: 'auto', objectFit: 'contain', mixBlendMode: 'screen' }}
            />
          </Reveal>
          <Reveal as="h2" style={{ ...sectionHeading, fontSize: fs('clamp(26px,3.4vw,42px)'), lineHeight: 1.12 }}>
            {t('result.retakeTitle')}
          </Reveal>
          <Reveal as="p" delay={120} style={{ ...note, marginTop: 16, marginLeft: 'auto', marginRight: 'auto', maxWidth: '30em', fontSize: fs('16px'), lineHeight: 1.6 }}>
            {t('result.retakeBody')}
          </Reveal>
          <Reveal delay={200} style={{ marginTop: 30, display: 'flex', gap: 18, flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
            <CtaButton ref={retakeRef} href={KRISAH_ASSESSMENT_URL} target="_blank" rel="noopener noreferrer" live onClick={() => track('krisah_assessment_start', { location: 'retake' })}>
              {t('result.retake')} <span className="rw-cta-arrow">→</span>
            </CtaButton>
            <BookButton interest="Coaching" specular>{t('assess.orCall')}</BookButton>
          </Reveal>
        </div>
      </section>

      <Footer links={FOOTER_LINKS} />
    </>
  )
}
