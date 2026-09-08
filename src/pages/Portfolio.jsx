import { useState } from 'react'
import coverImage from '../assets/site/cover-rajiv.webp'
import Seo from '../components/Seo'
import hraLogo from '../assets/site/logo-hra.png'
import narLogo from '../assets/site/logo-nar.png'
import anantha from '../assets/site/LOGOS/anantha.svg'
import avani from '../assets/site/LOGOS/avani.svg'
import blueFin from '../assets/site/LOGOS/blue-fin.svg'
import eInfra from '../assets/site/LOGOS/e-infra.svg'
import gangothri from '../assets/site/LOGOS/gangothri.svg'
import haneesh from '../assets/site/LOGOS/haneesh.svg'
import ira from '../assets/site/LOGOS/ira.svg'
import kolla from '../assets/site/LOGOS/kolla.svg'
import landmark from '../assets/site/LOGOS/landmark.svg'
import nesta from '../assets/site/LOGOS/nesta.svg'
import sriAditya from '../assets/site/LOGOS/sri-aditya.svg'
import suchirindia from '../assets/site/LOGOS/suchirindia.svg'
import tejase from '../assets/site/LOGOS/tejase.svg'
import trilight from '../assets/site/LOGOS/trilight.svg'
import vamsiram from '../assets/site/LOGOS/vamsiram.svg'
import vamsiramHomes from '../assets/site/LOGOS/vamsiram-homes.svg'
import vibrant from '../assets/site/LOGOS/vibrant.svg'
import zuari from '../assets/site/LOGOS/zuari.svg'
import ExperienceSection from '../components/ExperienceSection'
import Footer from '../components/Footer'
import GlimpsesSection from '../components/GlimpsesSection'
import Header from '../components/Header'
import ImageSlot from '../components/ImageSlot'
import { BookButton } from '../components/BookingModal'
import Reveal from '../components/Reveal'
import RiseText from '../components/RiseText'
import ClosingCTA from '../components/ClosingCTA'
import SectionHead, { SectionCount } from '../components/SectionHead'
import SignatureOverlay from '../components/SignatureOverlay'
import TeamSection from '../components/TeamSection'
import { useTilt } from '../hooks/useTilt'
import {
  ASSOCIATIONS, CREDENTIALS,
  ORGANISATIONS_WORKED, PORTFOLIO_TESTIMONIALS,
} from '../data/content'
import { FOOTER_LINKS, mono, serif, text } from '../theme'
import {
  container, ctaInk, eyebrow, eyebrowFaded,
  sectionHeadingSm, sectionRule,
} from '../styles'

const HEADLINE = [
  { text: 'The room, ' },
  { text: 'not just the ' },
  { text: 'résumé.', italic: true, copper: true },
]

// Logos for ASSOCIATIONS by index; undefined slots fall back to ImageSlot's placeholder.
const ASSOC_LOGOS = [hraLogo, narLogo, undefined, undefined]

// Client logos keyed by name in ORGANISATIONS_WORKED; names without a logo fall back to a wordmark tile.
const ORG_LOGOS = {
  'Vamsiram': vamsiram,
  'Vamsiram Homes': vamsiramHomes,
  'The Trilight': trilight,
  'Sri Aditya': sriAditya,
  'Blue Fin Realty': blueFin,
  'IRA': ira,
  'Zuari Infraworld': zuari,
  'Landmark Group': landmark,
  'Suchirindia': suchirindia,
  'Kolla': kolla,
  'Nesta Developers': nesta,
  'Tejase Developers': tejase,
  'Haneesh Constructions': haneesh,
  'Vibrant Developers': vibrant,
  'Anantha Projects': anantha,
  'Avani': avani,
  'Gangothri': gangothri,
  'e-Infra': eInfra,
}

// Optical-size correction for logos still on original bitmap canvases; tuned by eye.
const LOGO_SCALE = {}

// Separate width/height caps keep wide wordmarks and square monograms at comparable area.
const LOGO_MAX_W = 82
const LOGO_MAX_H = 62

// Every logo is white artwork on transparency, so every tile needs a dark background.
const LOGO_NEEDS_DARK = new Set([
  'Vamsiram', 'Vamsiram Homes', 'The Trilight', 'Sri Aditya', 'Blue Fin Realty',
  'IRA', 'Zuari Infraworld', 'Landmark Group', 'Suchirindia', 'Kolla',
  'Nesta Developers', 'Tejase Developers', 'Haneesh Constructions',
  'Vibrant Developers', 'Anantha Projects', 'Avani', 'Gangothri', 'e-Infra',
])

// Only organisations with a supplied logo are shown.
const ORGS_WITH_LOGO = ORGANISATIONS_WORKED.filter((org) => ORG_LOGOS[org])

const TRACK_RECORD = []

// The first flagged voice leads at scale; the rest fill the wall beneath it.
const LEAD_VOICE = PORTFOLIO_TESTIMONIALS.find((t) => t.highlight) || PORTFOLIO_TESTIMONIALS[0]
const REST_VOICES = PORTFOLIO_TESTIMONIALS.filter((t) => t !== LEAD_VOICE)

export default function Portfolio() {
  const tilt = useTilt({ max: 4 })
  const [showAllVoices, setShowAllVoices] = useState(false)

  return (
    <>
      <Seo route="/realty/portfolio" />
      <Header />

      {/* Intro */}
      <section id="top" className="rw-pad" style={{ ...container, padding: '80px 40px 56px' }}>
        <div className="rw-split" style={{ display: 'grid', gridTemplateColumns: '1.05fr .95fr', gap: 56, alignItems: 'center' }}>
          <div>
            <Reveal style={{ ...eyebrow, marginBottom: 30 }}>PORTFOLIO</Reveal>
            <h1 style={{ fontFamily: serif, fontWeight: 400, fontSize: 'clamp(48px,6.4vw,98px)', lineHeight: .96, letterSpacing: '-.01em', color: 'var(--ink)', maxWidth: '13em' }}>
              <RiseText lines={HEADLINE} step={0.085} />
            </h1>
            <Reveal as="p" delay={140} style={{ marginTop: 32, maxWidth: '34em', fontFamily: text, fontWeight: 300, fontSize: 'clamp(17px,1.9vw,21px)', lineHeight: 1.55, color: 'var(--faded)' }}>
              Where Rajiv shows up — mentoring sessions, developer launches, industry gatherings and the conversations that shape Hyderabad&apos;s luxury real estate market.
            </Reveal>
          </div>

          <Reveal delay={140} style={{ position: 'relative' }}>
            <div
              ref={tilt.ref} onPointerMove={tilt.onPointerMove} onPointerLeave={tilt.onPointerLeave}
              className="rw-frame"
              style={{ ...tilt.style, aspectRatio: '4/5', border: '1px solid var(--line)', overflow: 'hidden' }}
            >
              <ImageSlot
                src={coverImage}
                alt="Rajiv Williams"
                placeholder="Portrait of Rajiv"
                caption="pics/ — studio or office"
                spec="Portrait 4:5 · ≥1600px tall · shot vertical, not cropped from landscape"
                position="center 22%"
              />
              <SignatureOverlay />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Track record */}
      <section style={{ ...sectionRule, borderBottom: '1px solid var(--line)', background: 'var(--chip)' }}>
        <div className="rw-pad" style={container}>
          {/* Dividers between stats are drawn in CSS (.rw-stat), based on wrap column count. */}
          <div className="rw-grid-4 rw-stats" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)' }}>
            {TRACK_RECORD.map((stat, i) => (
              <Reveal key={stat.label} delay={i * 80} className="rw-stat">
                <div style={{ fontFamily: serif, fontSize: 'clamp(36px,4.2vw,54px)', lineHeight: 1, color: 'var(--ink)' }}>{stat.value}</div>
                <div style={{ fontFamily: mono, fontSize: 11, letterSpacing: '.16em', color: 'var(--faded)', marginTop: 14 }}>{stat.label}</div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Same "where the work happens" mosaic as the home page, but tiles don't link here. */}
      <GlimpsesSection showCta={false} linkTo={null} />

      <ExperienceSection />

      <TeamSection />

      {/* Testimonials: one line pulled out large, the rest in a denser grid beneath. */}
      <section id="voices" className="rw-pad" style={{ ...container, padding: 'clamp(80px,10vw,110px) 40px' }}>
        <SectionHead
          eyebrow="WHAT OUR CLIENTS SAY" faded size="lg" space={34}
          title="Results that speak."
          aside={(
            <SectionCount>
              {String(PORTFOLIO_TESTIMONIALS.length).padStart(2, '0')} VOICES · HYDERABAD&apos;S LUXURY MARKET
            </SectionCount>
          )}
        />

        {/* One voice leads at scale so the eye has an entry point. */}
        {LEAD_VOICE && (
          <Reveal
            style={{
              borderTop: '2px solid var(--copper)',
              padding: 'clamp(30px,3.4vw,44px) 0 clamp(30px,3.4vw,42px)',
              marginBottom: 'clamp(30px,3.4vw,44px)',
            }}
          >
            {/* ~26em keeps a comfortable line length without stranding empty space on desktop. */}
            <p style={{ fontFamily: serif, fontStyle: 'italic', fontSize: 'clamp(21px,2.3vw,31px)', lineHeight: 1.36, color: 'var(--ink)', margin: 0, maxWidth: '26em' }}>
              “{LEAD_VOICE.text}”
            </p>
            {/* Attribution sits under the quote rather than a second column, to avoid a tall void. */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 'clamp(22px,2.4vw,30px)' }}>
              <span aria-hidden style={{ width: 34, height: 1, background: 'var(--copper)', flexShrink: 0 }} />
              <div>
                <div style={{ fontFamily: mono, fontSize: 13, letterSpacing: '.08em', color: 'var(--copper)' }}>{LEAD_VOICE.name}</div>
                {LEAD_VOICE.role && (
                  <div style={{ marginTop: 5, fontFamily: mono, fontSize: 11, letterSpacing: '.04em', lineHeight: 1.5, color: 'var(--faded)' }}>{LEAD_VOICE.role}</div>
                )}
              </div>
            </div>
          </Reveal>
        )}

        {/* Six voices by default; showing all of them ran the section too tall. */}
        <div className="rw-voice-grid">
          {(showAllVoices ? REST_VOICES : REST_VOICES.slice(0, 6)).map((t, i) => (
            <Reveal key={t.name} delay={(i % 3) * 80} className="rw-voice-card">
              <p style={{ fontFamily: serif, fontStyle: 'italic', fontSize: 16, lineHeight: 1.55, color: 'var(--ink)', margin: 0 }}>
                “{t.text}”
              </p>
              <div className="rw-voice-attrib">
                <div style={{ fontFamily: mono, fontSize: 11, letterSpacing: '.06em', color: 'var(--copper)' }}>{t.name}</div>
                {t.role && <div style={{ marginTop: 4, fontFamily: mono, fontSize: 10, letterSpacing: '.04em', lineHeight: 1.5, color: 'var(--faded)' }}>{t.role}</div>}
              </div>
            </Reveal>
          ))}
        </div>

        {REST_VOICES.length > 6 && (
          <Reveal style={{ display: 'flex', justifyContent: 'center', marginTop: 'clamp(24px,2.6vw,34px)' }}>
            <button
              type="button"
              className="rw-outline-btn"
              onClick={() => setShowAllVoices((v) => !v)}
              style={{
                fontFamily: mono, fontSize: 11, letterSpacing: '.14em', color: 'var(--ink)',
                background: 'none', border: '1px solid var(--line)', padding: '13px 26px',
                cursor: 'pointer', transition: 'background .3s, color .3s, border-color .3s',
              }}
            >
              {showAllVoices ? 'SHOW FEWER' : `SHOW ALL ${PORTFOLIO_TESTIMONIALS.length} VOICES`}
            </button>
          </Reveal>
        )}
      </section>

      {/* Organisations we've worked with — a typographic name wall. */}
      <section id="organisations" style={{ ...sectionRule, borderBottom: '1px solid var(--line)' }}>
        <div className="rw-pad" style={{ ...container, padding: 'clamp(80px,10vw,110px) 40px' }}>
          <Reveal style={{ ...eyebrowFaded, marginBottom: 14 }}>ORGANISATIONS WE&apos;VE WORKED WITH</Reveal>
          <Reveal delay={80} as="h2" style={{ ...sectionHeadingSm, maxWidth: '14em' }}>
            Trusted across Hyderabad&apos;s luxury market.
          </Reveal>
          {/* Dark frosted-glass tiles, since logos are white artwork on transparency. */}
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
        <div className="rw-pad" style={{ ...container, padding: 'clamp(80px,10vw,110px) 40px' }}>
          <Reveal style={{ ...eyebrowFaded, marginBottom: 26 }}>CREDENTIALS &amp; MEMBERSHIPS</Reveal>
          <Reveal delay={90} style={{ display: 'flex', flexWrap: 'wrap', gap: 14 }}>
            {CREDENTIALS.map((credential) => (
              <span key={credential} className="rw-cred-pill" style={{ fontFamily: serif, fontSize: 20, color: 'var(--ink)', border: '1px solid var(--line)', padding: '12px 22px', borderRadius: 100, background: 'var(--bg)' }}>
                {credential}
              </span>
            ))}
          </Reveal>

          <div className="rw-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginTop: 40 }}>
            {ASSOCIATIONS.map((assoc, i) => (
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
                {/* Fixed-width, non-shrinking logo slot. */}
                <div className="rw-logo rw-assoc-logo" style={{ width: 'clamp(96px,26vw,132px)', height: 44, flexShrink: 0 }}>
                  <ImageSlot
                    src={ASSOC_LOGOS[i]}
                    alt={assoc.name}
                    placeholder="Logo"
                    caption="assoc."
                    spec="Transparent PNG or SVG · ≥400px wide · flattens to one colour"
                    fit="contain"
                  />
                </div>
                <div>
                  <div style={{ fontFamily: serif, fontSize: 20, color: 'var(--ink)' }}>
                    {assoc.name}
                    {assoc.href && <span aria-hidden style={{ marginLeft: 8, color: 'var(--copper)' }}>↗</span>}
                  </div>
                  <div style={{ marginTop: 4, fontFamily: mono, fontSize: 11, letterSpacing: '.08em', color: 'var(--copper)' }}>{assoc.role}</div>
                  {assoc.desc && (
                    <div style={{ marginTop: 6, fontFamily: text, fontSize: 13, lineHeight: 1.45, color: 'var(--faded)' }}>{assoc.desc}</div>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <ClosingCTA
        pad="clamp(90px,12vw,130px)" titleStyle={{ fontStyle: 'italic' }}
        title="Whatever the room, it starts with a conversation."
      >
        <BookButton style={ctaInk}>BOOK A STRATEGY CALL</BookButton>
      </ClosingCTA>

      <Footer chip links={FOOTER_LINKS} />
    </>
  )
}
