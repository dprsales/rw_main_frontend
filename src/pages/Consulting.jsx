import { useState } from 'react'
import sessionImage from '../assets/site/consulting-desk.webp'
import Footer from '../components/Footer'
import Header from '../components/Header'
import ImageSlot from '../components/ImageSlot'
import Seo from '../components/Seo'
import { BookButton } from '../components/BookingModal'
import Reveal from '../components/Reveal'
import ClosingCTA from '../components/ClosingCTA'
import PageIntro from '../components/PageIntro'
import PullQuote from '../components/PullQuote'
import SectionHead, { SectionAside } from '../components/SectionHead'
import { DEVELOPER_SHIFTS, ECOSYSTEM, SUPPORT_SERVICES } from '../data/content'
import { FOOTER_LINKS, mono, serif, text } from '../theme'
import {
  container, ctaCopper, ctaInk, eyebrow,
  note, sectionHeading, sectionRule,
} from '../styles'

/** Mission and vision, stated as a numbered creed. */
const CREED = [
  {
    n: '01', label: 'The mission',
    text: 'To build structured sales ecosystems that turn demand into predictable revenue for real estate developers.',
  },
  {
    n: '02', label: 'The vision',
    text: 'To redefine luxury real estate sales through sharper positioning, stronger systems, and execution that ensures consistent cash flow.',
  },
]

const HEADLINE = [
  { text: '₹2,700 crore of ' },
  { text: 'inventory moved. ' },
  { br: true },
  { text: 'Quietly.', italic: true, copper: true },
]

/** One row of the challenge ledger: the developer's problem paired with what replaces it. */
function Shift({ shift }) {
  return (
    <Reveal className="rw-shift">
      <span className="rw-shift-n" style={{ fontFamily: mono }}>{shift.n}</span>

      <span className="rw-shift-from" style={{ fontFamily: serif }}>
        {shift.from}
        <span className="rw-shift-strike" aria-hidden />
      </span>

      <span className="rw-shift-arrow" aria-hidden>→</span>

      <span className="rw-shift-to">
        <span style={{ fontFamily: serif }} className="rw-shift-to-title">{shift.to}</span>
        <span style={{ fontFamily: serif }} className="rw-shift-note">{shift.note}</span>
      </span>
    </Reveal>
  )
}

/** One phase of the ecosystem, as a compact card rather than a scroll-tall rail row. */
function PhaseCard({ flow, index, delay }) {
  return (
    <Reveal delay={delay} className="rw-phase-card">
      <span className="rw-phase-num" style={{ fontFamily: serif }} aria-hidden>
        {String(index + 1).padStart(2, '0')}
      </span>
      <span style={{ display: 'block', marginTop: 6, fontFamily: mono, fontSize: 11, letterSpacing: '.22em', color: 'var(--copper)' }}>PHASE {flow.phase}</span>
      <h4 style={{ ...sectionHeading, marginTop: 10, fontSize: 'clamp(21px,1.9vw,25px)', lineHeight: 1.12 }}>
        {flow.title}
      </h4>
      <p style={{ ...note, marginTop: 8, fontSize: 14, lineHeight: 1.5 }}>
        {flow.line}
      </p>
      <ul className="rw-phase-points">
        {flow.points.map((point) => (
          <li key={point} style={{ fontFamily: text }}>{point}</li>
        ))}
      </ul>
    </Reveal>
  )
}

/** "& More" support services as a chip cloud; hovering/tapping a chip reveals its description. */
function SupportCloud() {
  const [active, setActive] = useState(0)
  const service = SUPPORT_SERVICES[active]

  return (
    <div>
      <div className="rw-chips">
        {SUPPORT_SERVICES.map((svc, i) => (
          <button
            key={svc.title}
            type="button"
            className={`rw-chip${i === active ? ' is-on' : ''}`}
            style={{ fontFamily: mono }}
            onMouseEnter={() => setActive(i)}
            onFocus={() => setActive(i)}
            onClick={() => setActive(i)}
          >
            {svc.title}
          </button>
        ))}
      </div>

      <div className="rw-chip-caption">
        <span className="rw-chip-caption-num" style={{ fontFamily: mono }}>
          {String(active + 1).padStart(2, '0')} / {String(SUPPORT_SERVICES.length).padStart(2, '0')}
        </span>
        {/* Re-keyed so each change re-runs the fade-in. */}
        <p key={active} className="rw-chip-caption-text" style={{ fontFamily: serif }}>
          <span className="rw-chip-caption-label" style={{ fontFamily: mono }}>{service.title}</span>
          {service.desc}
        </p>
      </div>
    </div>
  )
}

export default function Consulting() {
  return (
    <>
      <Seo route="/consulting" />
      <Header />

      {/* Intro */}
      <PageIntro
        eyebrow="CONSULTING · FOR DEVELOPERS, SENIOR SALES LEADERSHIP & TOP CLOSERS"
        headline={HEADLINE}
        headlineStyle={{ fontSize: 'clamp(40px,5.2vw,78px)', lineHeight: 1.05 }}
        lede="Consulting · for developers, senior sales leadership & top closers."
        ledeStyle={{ fontSize: 'clamp(18px,2.2vw,22px)' }}
        intro="Rajiv Williams advises developers on the part of the business the brochure never fixes: how the inventory actually sells. Engagements are few, structured, and measured in absorption."
        introStyle={{ maxWidth: '38em' }}
        padding="80px 40px 40px"
        cta={<BookButton interest="Consulting" style={ctaCopper}>REQUEST A SALES CONSULTATION</BookButton>}
      />

      {/* Wide feature image */}
      <section className="rw-pad" style={{ ...container, paddingBottom: 'clamp(20px,4vw,40px)' }}>
        <Reveal className="rw-figure" style={{ border: '1px solid var(--line)', overflow: 'hidden' }}>
          <div style={{ aspectRatio: '21/9' }}>
            <ImageSlot
              src={sessionImage}
              alt="Rajiv Williams at his desk beside the RW backdrop"
              placeholder="Working with a developer team"
              caption="pics/ — session or site"
              position="center 32%"
            />
          </div>
        </Reveal>
      </section>

      {/* Mission / vision, as a two-part creed rather than two labelled columns. */}
      <section style={{ ...sectionRule, borderBottom: '1px solid var(--line)', background: 'var(--chip)' }}>
        <div className="rw-pad" style={{ ...container, padding: 'clamp(80px,10vw,120px) 40px' }}>
          <Reveal style={{ ...eyebrow, letterSpacing: '.26em' }}>WHAT WE ARE BUILDING TOWARD</Reveal>

          <div className="rw-creed">
            {CREED.map((c, i) => (
              <Reveal key={c.label} delay={i * 120} className="rw-creed-item">
                <span className="rw-creed-numeral" style={{ fontFamily: serif }} aria-hidden>{c.n}</span>
                <span className="rw-creed-label" style={{ fontFamily: serif }}>{c.label}</span>
                <p className="rw-creed-text" style={{ fontFamily: serif }}>{c.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Developer challenge — a ledger of what each problem is replaced by. */}
      <section id="challenge" className="rw-pad" style={{ ...container, padding: 'clamp(90px,11vw,120px) 40px' }}>
        <div className="rw-split" style={{ display: 'grid', gridTemplateColumns: '.36fr .64fr', gap: 56, marginBottom: 'clamp(48px,6vw,72px)' }}>
          <Reveal style={{ ...eyebrow, letterSpacing: '.24em' }}>THE DEVELOPER CHALLENGE</Reveal>
          <Reveal delay={100}>
            <h2 style={{ ...sectionHeading, fontSize: 'clamp(26px,3vw,38px)', lineHeight: 1.15, maxWidth: '15em' }}>
              Four problems every developer knows —{' '}
              <span style={{ fontStyle: 'italic', color: 'var(--copper)' }}>and what replaces each one.</span>
            </h2>
          </Reveal>
        </div>

        <div className="rw-shifts">
          {DEVELOPER_SHIFTS.map((shift) => (
            <Shift key={shift.n} shift={shift} />
          ))}
        </div>
      </section>

      {/* Sales ecosystem model */}
      <section id="model" style={{ ...sectionRule, background: 'var(--chip)', overflow: 'hidden' }}>
        <div className="rw-pad" style={{ ...container, padding: 'clamp(90px,11vw,120px) 40px' }}>
          <div className="rw-split" style={{ display: 'grid', gridTemplateColumns: '.36fr .64fr', gap: 56, marginBottom: 'clamp(56px,7vw,90px)' }}>
            <Reveal style={{ ...eyebrow, letterSpacing: '.24em' }}>OUR CONSULTING FRAMEWORK</Reveal>
            <Reveal delay={100}>
              <h3 style={{ ...sectionHeading, fontSize: 'clamp(26px,3vw,38px)', lineHeight: 1.15, maxWidth: '15em' }}>
                Four phases — we audit what exists and build what does not, into{' '}
                <span style={{ fontStyle: 'italic', color: 'var(--copper)' }}>controlled, predictable revenue.</span>
              </h3>
            </Reveal>
          </div>

          <div className="rw-phase-grid">
            {ECOSYSTEM.map((flow, i) => (
              <PhaseCard key={flow.phase} flow={flow} index={i} delay={(i % 2) * 90} />
            ))}
          </div>
        </div>
      </section>

      {/* & More — additional strategic support services */}
      <section id="support" className="rw-pad" style={{ ...container, padding: 'clamp(90px,11vw,120px) 40px' }}>
        <SectionHead
          eyebrow="& MORE" tracking=".24em" titleWidth="12em"
          title="Strategic support, beyond the framework."
          aside={<SectionAside width="24em">Additional services designed to strengthen visibility, accelerate sales movement, and improve operational efficiency.</SectionAside>}
        />

        <Reveal delay={80}>
          <SupportCloud />
        </Reveal>
      </section>

      {/* One engagement, anonymised — the case study, with its three numbers. */}
      <section id="engagement" style={{ ...sectionRule, background: 'var(--chip)' }}>
        <div className="rw-pad" style={{ ...container, padding: 'clamp(80px,10vw,110px) 40px' }}>
          <Reveal style={{ ...eyebrow, letterSpacing: '.24em', marginBottom: 14 }}>ONE ENGAGEMENT, ANONYMISED</Reveal>
          <Reveal as="h2" delay={80} style={{ ...sectionHeading, maxWidth: '16em' }}>
            A West Hyderabad launch, stalled at 22% sold.
          </Reveal>
          <Reveal as="p" delay={140} style={{ ...note, marginTop: 26, fontSize: 'clamp(16px,1.7vw,18px)', lineHeight: 1.6, maxWidth: '44em' }}>
            The product was right; the sales machine was not. Over one quarter: the CP network was rebuilt from 40 dormant partners to 260 active ones, the pricing ladder was re-sequenced by tower, and the site team was retrained on qualification before pitch. Absorption tripled in ninety days. The developer&apos;s name stays private — which is exactly the point of hiring this way.
          </Reveal>
          <div className="rw-grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 32, marginTop: 'clamp(34px,4vw,52px)' }}>
            {[
              { v: '3×', l: 'ABSORPTION IN 90 DAYS' },
              { v: '5x', l: 'Revenue Growth' },
              { v: '260', l: 'ACTIVE CHANNEL PARTNERS' },
            ].map((stat, i) => (
              <Reveal key={stat.l} delay={i * 90} style={{ borderTop: '1px solid var(--line)', paddingTop: 22 }}>
                <div style={{ fontFamily: serif, fontSize: 'clamp(34px,4vw,52px)', lineHeight: 1, color: 'var(--copper)' }}>{stat.v}</div>
                <div style={{ marginTop: 12, fontFamily: mono, fontSize: 11, letterSpacing: '.16em', color: 'var(--faded)' }}>{stat.l}</div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section style={sectionRule}>
        <div className="rw-pad" style={{ maxWidth: 900, margin: '0 auto', padding: 'clamp(90px,12vw,130px) 40px', textAlign: 'center' }}>
          <Reveal>
            <PullQuote name="SANDEEP KYLAS">
              “I had the privilege of consulting with Rajiv for a real estate matter in Hyderabad, and I couldn't have asked for a better advisor. I wholeheartedly recommend him to anyone seeking expert real estate consultation.”
            </PullQuote>
          </Reveal>
        </div>
      </section>

      <ClosingCTA id="talk" chip title="If the inventory is right and the velocity is wrong, talk.">
        <BookButton interest="Consulting" style={ctaInk}>REQUEST A SALES CONSULTATION</BookButton>
      </ClosingCTA>

      <Footer links={FOOTER_LINKS} />
    </>
  )
}
