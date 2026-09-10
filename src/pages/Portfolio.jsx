import coverImage from '../assets/site/AI_Image copy.jpg'
import hydMark from '../assets/site/hyd-01.svg'
import Seo from '../components/Seo'
import hraLogo from '../assets/site/logo-hra.png'
import narLogo from '../assets/site/logo-nar.png'
import anantha from '../assets/site/LOGOS/anantha.svg'
import avani from '../assets/site/LOGOS/avani.svg'
import blueFin from '../assets/site/LOGOS/blue-fin.svg'
import cascadesNeopolis from '../assets/site/LOGOS/cascades-neopolis.svg'
import celestial from '../assets/site/LOGOS/celestial.svg'
import dezignShark from '../assets/site/LOGOS/dezign-shark.svg'
import eInfra from '../assets/site/LOGOS/e-infra.svg'
import gangothri from '../assets/site/LOGOS/gangothri.svg'
import haneesh from '../assets/site/LOGOS/haneesh.svg'
import happeningHyderabad from '../assets/site/LOGOS/happening-hyderabad.svg'
import ira from '../assets/site/LOGOS/ira.svg'
import kolla from '../assets/site/LOGOS/kolla.svg'
import landmark from '../assets/site/LOGOS/landmark.svg'
import navanaami from '../assets/site/LOGOS/navanaami.svg'
import nesta from '../assets/site/LOGOS/nesta.svg'
import promenadeVillas from '../assets/site/LOGOS/promenade-villas.svg'
import radhaSpaces from '../assets/site/LOGOS/radha-spaces.svg'
import rohas from '../assets/site/LOGOS/rohas.svg'
import sriAditya from '../assets/site/LOGOS/sri-aditya.svg'
import suchirindia from '../assets/site/LOGOS/suchirindia.svg'
import tejase from '../assets/site/LOGOS/tejase.svg'
import tgreraLogo from '../assets/site/LOGOS/tgrera.svg'
import trilight from '../assets/site/LOGOS/trilight.svg'
import vamsiram from '../assets/site/LOGOS/vamsiram.svg'
import vamsiramHomes from '../assets/site/LOGOS/vamsiram-homes.svg'
import vibrant from '../assets/site/LOGOS/vibrant.svg'
import zuari from '../assets/site/LOGOS/zuari.svg'
import CountUp from '../components/CountUp'
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
import TeamSection from '../components/TeamSection'
import { useTilt } from '../hooks/useTilt'
import {
  ASSOCIATIONS,
  ORGANISATIONS_WORKED, PORTFOLIO_TESTIMONIALS,
} from '../data/content'
import { FOOTER_LINKS, mono, serif, text } from '../theme'
import {
  container, eyebrow, eyebrowFaded,
  sectionHeadingSm, sectionRule,
} from '../styles'

const HEADLINE = [
  { text: 'The room, ' },
  { text: 'not just the ' },
  { text: 'résumé.', italic: true, copper: true },
]

/* Logos for ASSOCIATIONS, matched by index. */
const ASSOC_LOGOS = [hraLogo, narLogo, tgreraLogo, dezignShark, happeningHyderabad]

const ASSOC_ITEMS = ASSOCIATIONS
  .map((assoc, i) => ({ ...assoc, logo: ASSOC_LOGOS[i] }))

/* Client logos keyed by name; names absent here fall back to a wordmark tile. */
const ORG_LOGOS = {
  'Vamsiram': vamsiram,
  'Vamsiram Homes': vamsiramHomes,
  'The Cascades Neopolis': cascadesNeopolis,
  'The Trilight': trilight,
  'Sri Aditya': sriAditya,
  'Blue Fin Realty': blueFin,
  'IRA': ira,
  'Zuari Infraworld': zuari,
  'Landmark Group': landmark,
  'Suchirindia': suchirindia,
  'Kolla': kolla,
  // 'Nesta Developers': nesta,
  // 'Tejase Developers': tejase,
  'Haneesh Constructions': haneesh,
  'Vibrant Developers': vibrant,
  'Anantha Projects': anantha,
  // 'Avani': avani,
  'Gangothri': gangothri,
  'Rohas Ventures': rohas,
  'e-Infra': eInfra,
  'Celestial': celestial,
  'Navanaami': navanaami,
  'Promenade Villas': promenadeVillas,
  'Radha Spaces': radhaSpaces,
}

/* Optical-size correction for logos still on original bitmap canvases; tuned by eye. */
const LOGO_SCALE = {}

/* Capping width/height separately keeps wordmarks and monograms at comparable area. */
const LOGO_MAX_W = 82
const LOGO_MAX_H = 62

/* Every logo is white artwork on transparency, so every tile runs dark. */
const LOGO_NEEDS_DARK = new Set([
  'Vamsiram', 'Vamsiram Homes', 'The Cascades Neopolis', 'The Trilight', 'Sri Aditya', 'Blue Fin Realty',
  'IRA', 'Zuari Infraworld', 'Landmark Group', 'Suchirindia', 'Kolla',
  'Nesta Developers', 'Tejase Developers', 'Haneesh Constructions',
  'Vibrant Developers', 'Anantha Projects', 'Avani', 'Gangothri', 'Rohas Ventures', 'e-Infra',
  'Celestial', 'Navanaami', 'Promenade Villas', 'Radha Spaces',
])

/* Only organisations with a supplied logo are shown; rest appear once artwork arrives. */
const ORGS_WITH_LOGO = ORGANISATIONS_WORKED.filter((org) => ORG_LOGOS[org])

const TRACK_RECORD = [
  // { value: <CountUp to={500} suffix="+" />, label: 'PROFESSIONALS MENTORED' },
  // { value: <CountUp to={30} suffix="+" />, label: 'LUXURY PROJECTS REPRESENTED' },
  // { value: <CountUp to={15} suffix="+" />, label: 'YEARS IN LUXURY REAL ESTATE' },
  // { value: '4.9/5', label: 'CLIENT RATING' },
]

/* The first flagged voice leads the section at scale; the rest fill the wall beneath it. */
const LEAD_VOICE = PORTFOLIO_TESTIMONIALS.find((t) => t.highlight) || PORTFOLIO_TESTIMONIALS[0]
const REST_VOICES = PORTFOLIO_TESTIMONIALS.filter((t) => t !== LEAD_VOICE)

export default function Portfolio() {
  const tilt = useTilt({ max: 4 })

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
              Where RW shows up: mentoring sessions, developer launches, industry gatherings and the conversations that shape Hyderabad&apos;s luxury real estate market.
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
                caption="pics/ · studio or office"
                spec="Portrait 4:5 · ≥1600px tall · shot vertical, not cropped from landscape"
                position="center 22%"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Track record */}
      <section style={{ ...sectionRule, borderBottom: '1px solid var(--line)', background: 'var(--chip)', position: 'relative', overflow: 'hidden' }}>
        <img src={hydMark} alt="" aria-hidden className="rw-watermark is-left" />
        <div className="rw-pad" style={{ ...container, position: 'relative', zIndex: 1 }}>
          {/* Dividers drawn in CSS (.rw-stat) since only the stylesheet knows the wrap column count. */}
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

      {/* Same mosaic as home; no through-link since you're already on the portfolio. */}
      {/* <GlimpsesSection showCta={false} linkTo={null} /> */}

      <ExperienceSection />

      <TeamSection />

      {/* Testimonials wall: one line pulled out large, rest layer beneath as a denser grid. */}
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

        {/* One voice leads at scale; multiple large quotes gave the eye no entry point. */}
        {LEAD_VOICE && (
          <Reveal
            style={{
              borderTop: '2px solid var(--copper)',
              padding: 'clamp(30px,3.4vw,44px) 0 clamp(30px,3.4vw,42px)',
              marginBottom: 'clamp(30px,3.4vw,44px)',
            }}
          >
            {/* ~26em keeps line length comfortable without stranding empty space on desktop. */}
            <p style={{ fontFamily: serif, fontStyle: 'italic', fontSize: 'clamp(21px,2.3vw,31px)', lineHeight: 1.36, color: 'var(--ink)', margin: 0, maxWidth: '26em' }}>
              “{LEAD_VOICE.text}”
            </p>
            {/* Attribution under the quote: a second column left a tall void beside shorter quotes. */}
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

        {/* Six voices by default; showing all ran the section to nearly 2,000px. */}
        <div className="rw-voice-grid">
          {REST_VOICES.slice(0, 6).map((t, i) => (
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
            <a
              href="https://www.linkedin.com/in/rajivwilliams/details/recommendations/"
              target="_blank"
              rel="noreferrer"
              className="rw-outline-btn"
              style={{
                fontFamily: mono, fontSize: 11, letterSpacing: '.14em', color: 'var(--ink)',
                background: 'none', border: '1px solid var(--line)', padding: '13px 26px',
                cursor: 'pointer', transition: 'background .3s, color .3s, border-color .3s',
                display: 'inline-block',
              }}
            >
              SHOW ALL MORE VOICES ↗
            </a>
          </Reveal>
        )}
      </section>

      {/* Organisations we've worked with - a typographic name wall. */}
      <section id="organisations" style={{ ...sectionRule, borderBottom: '1px solid var(--line)' }}>
        <div className="rw-pad" style={{ ...container, padding: 'clamp(80px,10vw,110px) 40px' }}>
          <Reveal style={{ ...eyebrowFaded, marginBottom: 14 }}>ORGANISATIONS WE&apos;VE WORKED WITH</Reveal>
          <Reveal delay={80} as="h2" style={{ ...sectionHeadingSm, maxWidth: '14em' }}>
            Trusted across Hyderabad&apos;s luxury realestate market.
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
        <div className="rw-pad" style={{ ...container, padding: 'clamp(80px,10vw,110px) 40px' }}>
          <Reveal style={{ ...eyebrowFaded, marginBottom: 26 }}>CREDENTIALS &amp; MEMBERSHIPS</Reveal>

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
        <BookButton specular>BOOK A STRATEGY CALL</BookButton>
      </ClosingCTA>

      <Footer chip links={FOOTER_LINKS} />
    </>
  )
}
