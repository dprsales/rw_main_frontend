import ExperienceSection from '../components/ExperienceSection'
import Footer from '../components/Footer'
import Header from '../components/Header'
import PageIntro from '../components/PageIntro'
import Seo from '../components/Seo'
import { BookButton } from '../components/BookingModal'
import Reveal from '../components/Reveal'
import ClosingCTA from '../components/ClosingCTA'
import hydMark from '../assets/site/hyd-01.svg'
import { ASSOCIATIONS, CREDENTIALS } from '../data/content'
import { FOOTER_LINKS, mono } from '../theme'
import { container, eyebrowFaded, sectionRule } from '../styles'

const HEADLINE = [
  { text: 'Practitioner first. ' },
  { br: true },
  { text: 'Teacher because of it.', italic: true, copper: true },
]

export default function About() {
  return (
    <>
      <Seo route="/about" />
      <Header />

      <PageIntro
        eyebrow="ABOUT · RAJIV WILLIAMS"
        headline={HEADLINE}
        lede="Fifteen years of live deals, and still counting."
        intro="Everything taught here was earned in the market first, and taught second. The practice and the teaching run in parallel — mornings in the market, afternoons with cohorts and boardrooms."
        cta={<BookButton interest="About" specular>APPLY TO WORK WITH RAJIV</BookButton>}
      />

      <ExperienceSection />

      {/* Credentials & associations */}
      <section id="credentials" style={{ ...sectionRule, background: 'var(--chip)', position: 'relative', overflow: 'hidden' }}>
        <img src={hydMark} alt="" aria-hidden className="rw-watermark is-right" />
        <div className="rw-pad" style={{ ...container, padding: 'clamp(80px,10vw,110px) 40px', position: 'relative', zIndex: 1 }}>
          <Reveal style={{ ...eyebrowFaded, marginBottom: 26 }}>CREDENTIALS &amp; MEMBERSHIPS</Reveal>

          <div className="rw-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40 }}>
            <div>
              {CREDENTIALS.map((c) => (
                <div key={c} style={{ borderTop: '1px solid var(--line)', padding: '16px 0', fontFamily: mono, fontSize: 13, letterSpacing: '.02em', color: 'var(--ink)' }}>
                  {c}
                </div>
              ))}
            </div>
            <div>
              {ASSOCIATIONS.map((a) => (
                <div key={a.name} style={{ borderTop: '1px solid var(--line)', padding: '16px 0' }}>
                  <div style={{ fontFamily: mono, fontSize: 13, letterSpacing: '.02em', color: 'var(--ink)' }}>
                    {a.name} <span style={{ color: 'var(--faded)' }}>· {a.role}</span>
                  </div>
                  {a.desc && <div style={{ marginTop: 4, fontFamily: mono, fontSize: 11, color: 'var(--faded)' }}>{a.desc}</div>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <ClosingCTA title="The story is the credential. The work is the proof." titleStyle={{ maxWidth: '15em' }}>
        <BookButton interest="About" specular>APPLY TO WORK WITH RAJIV</BookButton>
      </ClosingCTA>

      <Footer links={FOOTER_LINKS} />
    </>
  )
}
