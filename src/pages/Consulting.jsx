import { useEffect, useMemo, useRef, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import signature from '../assets/site/gold2.png'
import monogram from '../assets/site/rw-logo-ccr.png'
import hydMark from '../assets/site/hyd-04.svg'
import Footer from '../components/Footer'
import Header from '../components/Header'
import Seo from '../components/Seo'
import { BookButton } from '../components/BookingModal'
import CtaButton from '../components/CtaButton'
import Reveal from '../components/Reveal'
import ClosingCTA from '../components/ClosingCTA'
import PullQuote from '../components/PullQuote'
import { useLang } from '../i18n/LangProvider'
import { ECOSYSTEM } from '../data/content'
import { FOOTER_LINKS, mono, serif, text } from '../theme'
import { fs, ctaCopper,
  container, eyebrow,
  note, sectionHeading, sectionRule,
} from '../styles'

function PhaseGrid({ items, hideLabel, showLabel }) {
  const [pinned, setPinned] = useState(null)
  const [hover, setHover] = useState(null)
  const gridRef = useRef(null)

  useEffect(() => {
    if (pinned === null) return
    const onDown = (e) => {
      if (gridRef.current && !gridRef.current.contains(e.target)) setPinned(null)
    }
    document.addEventListener('pointerdown', onDown)
    return () => document.removeEventListener('pointerdown', onDown)
  }, [pinned])

  return (
    <div className="rw-phase-grid" ref={gridRef}>
      {items.map((flow, i) => (
        <PhaseCard
          key={flow.phase}
          flow={flow}
          index={i}
          delay={(i % 2) * 90}
          active={pinned === i}
          expanded={pinned === i || hover === i}
          hideLabel={hideLabel}
          showLabel={showLabel}
          onToggle={() => {
            if (pinned === i) { setPinned(null); setHover(null) }
            else { setPinned(i); setHover(null) }
          }}
          onHover={() => setHover(i)}
          onLeave={() => setHover((h) => (h === i ? null : h))}
        />
      ))}
    </div>
  )
}

function PhaseCard({ flow, index, delay, active, expanded, onToggle, onHover, onLeave, hideLabel, showLabel }) {
  return (
    <Reveal
      delay={delay}
      className={`rw-phase-card${active ? ' is-active' : ''}${expanded ? ' is-open' : ''}`}
      role="button"
      tabIndex={0}
      aria-expanded={expanded}
      onClick={onToggle}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onToggle() }
      }}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      <span className="rw-phase-num" style={{ fontFamily: serif }} aria-hidden>
        {String(index + 1).padStart(2, '0')}
      </span>
      <h4 style={{ ...sectionHeading, marginTop: 10, fontSize: fs('clamp(21px,1.9vw,25px)'), lineHeight: 1.12 }}>
        {flow.title}
      </h4>

      <div className="rw-phase-body">
        <p className="rw-phase-line" style={{ ...note, marginTop: 8, fontSize: fs('14px'), lineHeight: 1.5 }}>
          {flow.line}
        </p>

        <div className="rw-phase-collapse" onClick={(e) => e.stopPropagation()}>
          <div className="rw-phase-collapse-inner">
            <div className="rw-phase-points-wrap">
              <img src={monogram} alt="" aria-hidden className="rw-phase-watermark" />
              <ul className="rw-phase-points">
                {flow.points.map((point) => (
                  <li key={point} style={{ fontFamily: text }}>{point}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <button
        type="button"
        className="rw-phase-toggle"
        style={{ fontFamily: mono }}
        onClick={(e) => { e.stopPropagation(); onToggle() }}
        aria-expanded={expanded}
      >
        {active ? hideLabel : showLabel}<i className="rw-phase-toggle-arrow" aria-hidden>{active ? '−' : '+'}</i>
      </button>
    </Reveal>
  )
}

export default function Consulting() {
  const { hash } = useLocation()
  const { t } = useLang()

  const ecosystem = useMemo(() => ECOSYSTEM.map((flow, i) => ({
    ...flow,
    title: t(`consult.eco.${i}.title`),
    line: t(`consult.eco.${i}.line`),
    points: flow.points.map((_, j) => t(`consult.eco.${i}.p.${j}`)),
  })), [t])

  const stats = useMemo(() => [
    { v: '3×', l: t('consult.stat.0') },
    { v: '5x', l: t('consult.stat.1') },
    { v: '260', l: t('consult.stat.2') },
  ], [t])

  if (hash === '#investment-advisory') return <Navigate to="/project-hyderabad" replace />

  return (
    <>
      <Seo route="/consulting" />
      <Header />

      <section id="top" className="rw-consulting-hero">
        <div className="rw-consulting-hero-copy rw-pad">
          <Reveal className="rw-consulting-hero-eyebrow" style={{ fontFamily: mono }}>
            {t('consult.hero.eyebrow')}
          </Reveal>

          <Reveal as="h1" delay={80} className="rw-consulting-hero-title" style={{ fontFamily: serif }}>
            <span>{t('consult.hero.title.1')}</span>
            <span className="rw-consulting-hero-title-italic">{t('consult.hero.title.2')}</span>
          </Reveal>

          <Reveal as="p" delay={150} className="rw-consulting-hero-subhead" style={{ fontFamily: text }}>
            {t('consult.hero.sub')}
          </Reveal>

          <Reveal as="p" delay={190} className="rw-consulting-hero-lede" style={{ fontFamily: text }}>
            {t('consult.hero.lede')}
          </Reveal>

          <Reveal delay={220} className="rw-hero-actions">
            <BookButton
              interest="Consulting"
              className="rw-cta rw-hero-book"
              style={ctaCopper}
            >
              {t('consult.hero.book')}
            </BookButton>
            <CtaButton
              variant="secondary"
              to="/start?who=developer"
              arrow="→"
              className="rw-hero-fit"
            >
              {t('consult.hero.fit')}
            </CtaButton>
          </Reveal>
        </div>
      </section>

      <section style={{ ...sectionRule, borderBottom: '1px solid var(--line)', background: 'var(--chip)' }}>
        <div className="rw-pad" style={{ ...container, padding: 'var(--rw-sy-lg) 40px' }}>
          <div className="rw-split" style={{ display: 'grid', gridTemplateColumns: '.36fr .64fr', gap: 56 }}>
            <Reveal style={{ ...eyebrow, fontSize: fs('clamp(15px,1.6vw,19px)'), letterSpacing: '.22em' }}>{t('consult.mission.eyebrow')}</Reveal>
            <Reveal delay={100}>
              <h2 style={{ ...sectionHeading, fontSize: fs('clamp(28px,3.4vw,42px)'), lineHeight: 1.24, maxWidth: '19em' }}>
                {t('consult.mission')}
              </h2>
            </Reveal>
          </div>

          <Reveal delay={200} className="rw-mission-quote">
            <p style={{ fontFamily: serif, fontStyle: 'italic', fontSize: fs('clamp(26px,3vw,38px)'), lineHeight: 1.3, color: 'var(--ink)', maxWidth: '20em' }}>
              {t('consult.mission.quote')}
            </p>
            <img src={signature} alt="Rajiv Williams" className="rw-mission-signature" />
          </Reveal>
        </div>
      </section>

      <section id="model" style={{ ...sectionRule, background: 'var(--chip)', overflow: 'hidden' }}>
        <div className="rw-pad" style={{ ...container, padding: 'var(--rw-sy-lg) 40px' }}>
          <div className="rw-split" style={{ display: 'grid', gridTemplateColumns: '.36fr .64fr', gap: 56, marginBottom: 'clamp(56px,7vw,90px)' }}>
            <Reveal style={{ ...eyebrow, letterSpacing: '.24em' }}>{t('consult.model.eyebrow')}</Reveal>
            <Reveal delay={100}>
              <h3 style={{ ...sectionHeading, fontSize: fs('clamp(26px,3vw,38px)'), lineHeight: 1.15, maxWidth: '15em' }}>
                {t('consult.model.title.a')}
                <span style={{ fontStyle: 'italic', color: 'var(--copper)' }}>{t('consult.model.title.b')}</span>
              </h3>
            </Reveal>
          </div>

          <PhaseGrid
            items={ecosystem}
            hideLabel={t('consult.phase.hide')}
            showLabel={t('consult.phase.show')}
          />
        </div>
      </section>

      <section id="engagement" style={{ ...sectionRule, background: 'var(--chip)' }}>
        <div className="rw-pad" style={{ ...container, padding: 'var(--rw-sy) 40px' }}>
          <Reveal style={{ ...eyebrow, letterSpacing: '.24em', marginBottom: 14 }}>{t('consult.case.eyebrow')}</Reveal>
          <Reveal as="h2" delay={80} style={{ ...sectionHeading, maxWidth: '16em' }}>
            {t('consult.case.title')}
          </Reveal>
          <Reveal as="p" delay={140} style={{ ...note, marginTop: 26, fontSize: fs('clamp(16px,1.7vw,18px)'), lineHeight: 1.6, maxWidth: '44em' }}>
            {t('consult.case.body')}
          </Reveal>
          <div className="rw-grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 32, marginTop: 'clamp(34px,4vw,52px)' }}>
            {stats.map((stat, i) => (
              <Reveal key={stat.l} delay={i * 90} style={{ borderTop: '1px solid var(--line)', paddingTop: 22 }}>
                <div style={{ fontFamily: serif, fontSize: fs('clamp(34px,4vw,52px)'), lineHeight: 1, color: 'var(--copper)' }}>{stat.v}</div>
                <div style={{ marginTop: 12, fontFamily: mono, fontSize: fs('11px'), letterSpacing: '.16em', color: 'var(--faded)' }}>{stat.l}</div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section style={{ ...sectionRule, position: 'relative', overflow: 'hidden' }}>
        <img src={hydMark} alt="" aria-hidden className="rw-watermark is-right" />
        <div className="rw-pad" style={{ maxWidth: 900, margin: '0 auto', padding: 'clamp(90px,12vw,130px) 40px', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <Reveal>
            <PullQuote name="SANDEEP KYLAS">
              {t('consult.test')}
            </PullQuote>
          </Reveal>
        </div>
      </section>

      <ClosingCTA id="talk" chip title={t('consult.close.title')}>
        <CtaButton variant="outline" href="/form/consulting">{t('consult.close.cta')}</CtaButton>
      </ClosingCTA>

      <Footer links={FOOTER_LINKS} />
    </>
  )
}
