import { useMemo } from 'react'
import portraitImage from '../assets/site/rw-realty-hero.png'
import hydMark from '../assets/site/hyd-01.svg'
import Seo from '../components/Seo'
import hraLogo from '../assets/site/logo-hra.png'
import narLogo from '../assets/site/logo-nar.png'
import dezignShark from '../assets/site/LOGOS/dezign-shark.svg'
import happeningHyderabad from '../assets/site/LOGOS/happening-hyderabad.svg'
import tgreraLogo from '../assets/site/LOGOS/tgrera.svg'
import {
  LOGO_MAX_H, LOGO_MAX_W, LOGO_NEEDS_DARK, LOGO_SCALE, ORG_LOGOS, ORGS_WITH_LOGO,
} from '../data/organisations'
import CountUp from '../components/CountUp'
import AboutSection from '../components/AboutSection'
import ExperienceSection from '../components/ExperienceSection'
import WhyTeamRwSection from '../components/WhyTeamRwSection'
import Footer from '../components/Footer'
import GlimpsesSection from '../components/GlimpsesSection'
import Header from '../components/Header'
import ImageSlot from '../components/ImageSlot'
import SignatureOverlay from '../components/SignatureOverlay'
import { BookButton } from '../components/BookingModal'
import Reveal from '../components/Reveal'
import RiseText from '../components/RiseText'
import ClosingCTA from '../components/ClosingCTA'
import SectionHead, { SectionCount } from '../components/SectionHead'
import TeamSection from '../components/TeamSection'
import { useTilt } from '../hooks/useTilt'
import { useLang } from '../i18n/LangProvider'
import { associationRoleKey } from '../i18n/pages'
import {
  ASSOCIATIONS,
  PORTFOLIO_TESTIMONIALS,
} from '../data/content'
import { FOOTER_LINKS, mono, serif, text } from '../theme'
import { fs,
  container, eyebrow, eyebrowFaded,
  sectionHeadingSm, sectionRule,
} from '../styles'

/* Logos for ASSOCIATIONS, matched by index. */
const ASSOC_LOGOS = [hraLogo, narLogo, tgreraLogo, dezignShark, happeningHyderabad]

const ASSOC_ITEMS = ASSOCIATIONS
  .map((assoc, i) => ({ ...assoc, logo: ASSOC_LOGOS[i] }))

export default function Portfolio() {
  const tilt = useTilt({ max: 4 })
  const { t } = useLang()

  const headline = useMemo(() => [
    { text: t('portfolio.h1.a') },
    { text: t('portfolio.h1.b') },
    { text: t('portfolio.h1.c'), italic: true, copper: true },
  ], [t])

  const trackRecord = useMemo(() => [
    { value: <CountUp to={2700} prefix="₹" suffix=" Cr" />, label: t('portfolio.stat.0') },
    { value: <CountUp to={1200} />, label: t('portfolio.stat.1') },
    { value: <CountUp to={16} suffix="+" />, label: t('portfolio.stat.2') },
  ], [t])

  const voices = useMemo(() => PORTFOLIO_TESTIMONIALS.map((voice, i) => ({
    ...voice,
    text: t(`portfolio.voice.${i}`),
    role: t(`portfolio.voice.${i}.role`),
  })), [t])

  const leadVoice = voices.find((voice) => voice.highlight) || voices[0]
  const restVoices = voices.filter((voice) => voice !== leadVoice)

  return (
    <>
      <Seo route="/about" />
      <Header />

      {/* Intro */}
      <section id="top" className="rw-pad" style={{ ...container, padding: '80px 40px 56px' }}>
        <div className="rw-split" style={{ display: 'grid', gridTemplateColumns: '1.05fr .95fr', gap: 56, alignItems: 'center' }}>
          <div>
            <Reveal style={{ ...eyebrow, marginBottom: 30 }}>{t('portfolio.eyebrow')}</Reveal>
            <h1 style={{ fontFamily: serif, fontWeight: 400, fontSize: fs('clamp(48px,6.4vw,98px)'), lineHeight: .96, letterSpacing: '-.01em', color: 'var(--ink)', maxWidth: '13em' }}>
              <RiseText lines={headline} step={0.085} />
            </h1>
            <Reveal as="p" delay={140} style={{ marginTop: 32, maxWidth: '34em', fontFamily: text, fontWeight: 300, fontSize: fs('clamp(17px,1.9vw,21px)'), lineHeight: 1.55, color: 'var(--faded)' }}>
              {t('portfolio.lede.1')}<span style={{ color: 'var(--copper)', fontWeight: 500 }}>{t('portfolio.lede.2')}</span>{t('portfolio.lede.3')}
            </Reveal>
          </div>

          <Reveal delay={140} style={{ position: 'relative' }}>
            <div
              ref={tilt.ref} onPointerMove={tilt.onPointerMove} onPointerLeave={tilt.onPointerLeave}
              className="rw-frame"
              style={{ ...tilt.style, aspectRatio: '4/5', border: '1px solid var(--line)', overflow: 'hidden' }}
            >
              {/* The About section's portrait (with its signature) now leads the page. */}
              <ImageSlot src={portraitImage} alt="Rajiv Williams" placeholder="Portrait of Rajiv" caption="pics/ · office or studio" position="45% 28%" />
              <SignatureOverlay />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Track record */}
      <section style={{ ...sectionRule, borderBottom: '1px solid var(--line)', background: 'var(--chip)', position: 'relative', overflow: 'hidden' }}>
        <img src={hydMark} alt="" aria-hidden className="rw-watermark is-left" />
        <div className="rw-pad" style={{ ...container, position: 'relative', zIndex: 1 }}>
          {/* Dividers drawn in CSS (.rw-stat) since only the stylesheet knows the wrap column count. */}
          <div className="rw-grid-4 rw-stats" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)' }}>
            {trackRecord.map((stat, i) => (
              <Reveal key={stat.label} delay={i * 80} className="rw-stat">
                <div style={{ fontFamily: serif, fontSize: fs('clamp(36px,4.2vw,54px)'), lineHeight: 1, color: 'var(--ink)' }}>{stat.value}</div>
                <div style={{ fontFamily: mono, fontSize: fs('11px'), letterSpacing: '.16em', color: 'var(--faded)', marginTop: 14 }}>{stat.label}</div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Same mosaic as home; no through-link since you're already on the portfolio. */}
      {/* <GlimpsesSection showCta={false} linkTo={null} /> */}

      <AboutSection />

      <WhyTeamRwSection />

      <ExperienceSection />

      <TeamSection />

      {/* Testimonials wall: one line pulled out large, rest layer beneath as a denser grid. */}
      <section id="voices" className="rw-pad" style={{ ...container, padding: 'var(--rw-sy) 40px' }}>
        <SectionHead
          eyebrow={t('portfolio.voices.eyebrow')} faded size="lg" space={34}
          title={t('portfolio.voices.title')}
          aside={(
            <SectionCount>
              {t('portfolio.voices.count', { n: String(PORTFOLIO_TESTIMONIALS.length).padStart(2, '0') })}
            </SectionCount>
          )}
        />

        {/* One voice leads at scale; multiple large quotes gave the eye no entry point. */}
        {leadVoice && (
          <Reveal
            style={{
              borderTop: '2px solid var(--copper)',
              padding: 'clamp(30px,3.4vw,44px) 0 clamp(30px,3.4vw,42px)',
              marginBottom: 'clamp(30px,3.4vw,44px)',
            }}
          >
            {/* ~26em keeps line length comfortable without stranding empty space on desktop. */}
            <p style={{ fontFamily: text, fontWeight: 400, fontSize: fs('clamp(18px,1.5vw,22px)'), lineHeight: 1.55, color: 'var(--ink)', margin: 0, maxWidth: '34em' }}>
              “{leadVoice.text}”
            </p>
            {/* Attribution under the quote: a second column left a tall void beside shorter quotes. */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 'clamp(22px,2.4vw,30px)' }}>
              <span aria-hidden style={{ width: 34, height: 1, background: 'var(--copper)', flexShrink: 0 }} />
              <div>
                <div style={{ fontFamily: mono, fontSize: fs('13px'), letterSpacing: '.08em', color: 'var(--copper)' }}>{leadVoice.name}</div>
                {leadVoice.role && (
                  <div style={{ marginTop: 5, fontFamily: mono, fontSize: fs('11px'), letterSpacing: '.04em', lineHeight: 1.5, color: 'var(--faded)' }}>{leadVoice.role}</div>
                )}
              </div>
            </div>
          </Reveal>
        )}

        {/* Six voices by default; showing all ran the section to nearly 2,000px. */}
        <div className="rw-voice-grid">
          {restVoices.slice(0, 6).map((voice, i) => (
            <Reveal key={voice.name} delay={(i % 3) * 80} className="rw-voice-card">
              <p style={{ fontFamily: text, fontWeight: 400, fontSize: fs('15px'), lineHeight: 1.6, color: 'var(--ink)', margin: 0 }}>
                “{voice.text}”
              </p>
              <div className="rw-voice-attrib">
                <div style={{ fontFamily: mono, fontSize: fs('11px'), letterSpacing: '.06em', color: 'var(--copper)' }}>{voice.name}</div>
                {voice.role && <div style={{ marginTop: 4, fontFamily: mono, fontSize: fs('10px'), letterSpacing: '.04em', lineHeight: 1.5, color: 'var(--faded)' }}>{voice.role}</div>}
              </div>
            </Reveal>
          ))}
        </div>

        {restVoices.length > 6 && (
          <Reveal style={{ display: 'flex', justifyContent: 'center', marginTop: 'clamp(24px,2.6vw,34px)' }}>
            <a
              href="https://www.linkedin.com/in/rajivwilliams/details/recommendations/"
              target="_blank"
              rel="noreferrer"
              className="rw-outline-btn"
              style={{
                fontFamily: mono, fontSize: fs('11px'), letterSpacing: '.14em', color: 'var(--ink)',
                background: 'none', border: '1px solid var(--line)', padding: '13px 26px',
                cursor: 'pointer', transition: 'background .3s, color .3s, border-color .3s',
                display: 'inline-block',
              }}
            >
              {t('portfolio.voices.more')}
            </a>
          </Reveal>
        )}
      </section>

      {/* Organisations we've worked with - a typographic name wall. */}
      <section id="organisations" style={{ ...sectionRule, borderBottom: '1px solid var(--line)' }}>
        <div className="rw-pad" style={{ ...container, padding: 'var(--rw-sy) 40px' }}>
          <Reveal style={{ ...eyebrowFaded, marginBottom: 14 }}>{t('portfolio.orgs.eyebrow')}</Reveal>
          <Reveal delay={80} as="h2" style={{ ...sectionHeadingSm, maxWidth: '14em' }}>
            {t('portfolio.orgs.title')}
          </Reveal>
          {/* Frosted-glass tiles, dark - white artwork logos only read against a dark tile. */}
          <div className="rw-orgs" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 10, marginTop: 'clamp(34px,4vw,52px)' }}>
            {ORGS_WITH_LOGO.map((org, i) => {
              const scale = LOGO_SCALE[org] || 1
              const onDark = LOGO_NEEDS_DARK.has(org)
              return (
                <Reveal
                  key={org}
                  delay={(i % 5) * 60}
                  style={{
                    aspectRatio: '3 / 2', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
                    background: onDark ? 'rgba(20,18,16,0.55)' : 'rgba(242,239,233,0.90)',
                    backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)',
                    border: '1px solid rgba(242,239,233,0.18)', borderRadius: 4,
                  }}
                >
                  <img
                    src={ORG_LOGOS[org]}
                    alt={org}
                    loading="lazy"
                    style={{ maxWidth: `${LOGO_MAX_W * scale}%`, maxHeight: `${LOGO_MAX_H * scale}%`, objectFit: 'contain' }}
                  />
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>

      {/* Credentials + associations */}
      <section id="credentials" style={{ ...sectionRule, background: 'var(--chip)' }}>
        <div className="rw-pad" style={{ ...container, padding: 'var(--rw-sy) 40px' }}>
          <Reveal style={{ ...eyebrowFaded, marginBottom: 26 }}>{t('portfolio.creds')}</Reveal>

          <div className="rw-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            {ASSOC_ITEMS.map((assoc, i) => (
              <Reveal
                key={assoc.name}
                delay={i * 90}
                as={assoc.href ? 'a' : 'div'}
                href={assoc.href}
                target={assoc.href ? '_blank' : undefined}
                rel={assoc.href ? 'noreferrer' : undefined}
                className="rw-assoc-card"
                style={{ display: 'flex', alignItems: 'center', gap: 'clamp(14px,2vw,20px)', flexWrap: 'wrap', border: '1px solid var(--line)', padding: 'clamp(16px,2vw,22px)', background: 'var(--bg)', textDecoration: 'none' }}
              >
                {/* Fixed-width, non-shrinking, leaving the name ~90px to wrap on a small phone. */}
                <div className="rw-logo rw-assoc-logo" style={{ width: 'clamp(96px,26vw,132px)', height: 44, flexShrink: 0 }}>
                  <ImageSlot
                    src={assoc.logo}
                    alt={assoc.name}
                    placeholder="Logo"
                    caption="assoc."
                    spec="Transparent PNG or SVG · ≥400px wide · flattens to one colour"
                    fit="contain"
                  />
                </div>
                <div>
                  <div style={{ fontFamily: serif, fontSize: fs('20px'), color: 'var(--ink)' }}>
                    {assoc.name}
                    {assoc.href && <span aria-hidden style={{ marginLeft: 8, color: 'var(--copper)' }}>↗</span>}
                  </div>
                  <div style={{ marginTop: 4, fontFamily: mono, fontSize: fs('11px'), letterSpacing: '.08em', color: 'var(--copper)' }}>{t(associationRoleKey(assoc.role) || assoc.role)}</div>
                  {assoc.desc && (
                    <div style={{ marginTop: 6, fontFamily: text, fontSize: fs('13px'), lineHeight: 1.45, color: 'var(--faded)' }}>{t('about.assoc.hh')}</div>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <ClosingCTA
        pad="clamp(90px,12vw,130px)" titleStyle={{ fontStyle: 'italic' }}
        title={t('portfolio.close')}
      >
        <BookButton to="/realty/form" specular>{t('portfolio.book')}</BookButton>
      </ClosingCTA>

      <Footer chip links={FOOTER_LINKS} />
    </>
  )
}
