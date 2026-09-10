import { memo, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin'
import sessionImage from '../assets/site/consulting-desk.webp'
import signature from '../assets/site/gold2.png'
import monogram from '../assets/site/gold1.png'
import hydMark from '../assets/site/hyd-04.svg'
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
  container, eyebrow,
  note, sectionHeading, sectionRule,
} from '../styles'

const MISSION = 'Team RW is out on a mission to revolutionize how the Hyderabad real estate industry conducts itself, and how it is perceived.'

const HEADLINE = [
  { text: '₹2,700+ cr ' },
  { text: 'sold, quietly.' },
  { br: true },
  { text: ' Built on a proven sales process', italic: true, copper: true },
]

const ACRONYM = 'S.M.A.R.T.'

gsap.registerPlugin(ScrambleTextPlugin)

/**
 * Scrambles into its full phrase on hover/focus via GSAP's ScrambleTextPlugin.
 * Uses useRef + direct gsap.to rather than React state since the plugin drives the DOM
 * text node itself; memoized so a parent re-render can't reset it mid-animation.
 * Hover target is a size-stable wrapper separate from the growing text, else the
 * element grows out from under the cursor and mouseenter/leave loop forever.
 */
const AcronymScramble = memo(function AcronymScramble({ short, full }) {
  const ref = useRef(null)

  const scrambleTo = (value, duration) => {
    gsap.to(ref.current, {
      duration, ease: 'none', overwrite: true,
      scrambleText: { text: value, chars: 'upperCase', speed: 0.45 },
    })
  }

  return (
    <span
      className="rw-acronym"
      tabIndex={0}
      onMouseEnter={() => scrambleTo(full, 0.9)}
      onMouseLeave={() => scrambleTo(short, 0.7)}
      onFocus={() => scrambleTo(full, 0.9)}
      onBlur={() => scrambleTo(short, 0.7)}
    >
      <span className="rw-acronym-sizer" aria-hidden>{short}</span>
      <span ref={ref} className="rw-acronym-live">{short}</span>
    </span>
  )
})

/** The note's acronym, split out to carry its own scramble hover target (see `AcronymScramble`). */
function NoteText({ note, expand }) {
  if (!expand || !note.includes(ACRONYM)) return note
  const [before, after] = note.split(ACRONYM)
  return (
    <>
      {before}
      <AcronymScramble short={ACRONYM} full={expand} />
      {after}
    </>
  )
}

/** One row of the challenge ledger: problem on the left, its replacement on the right. */
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
        <span style={{ fontFamily: serif }} className="rw-shift-note">
          <NoteText note={shift.note} expand={shift.noteExpand} />
        </span>
      </span>
    </Reveal>
  )
}

/** One ecosystem phase as a compact card; points stay behind a "Read more" toggle
 *  so the grid reads as four short cards, not a wall of bullets. */
function PhaseCard({ flow, index, delay }) {
  const [open, setOpen] = useState(false)

  return (
    <Reveal delay={delay} className="rw-phase-card">
      <span className="rw-phase-num" style={{ fontFamily: serif }} aria-hidden>
        {String(index + 1).padStart(2, '0')}
      </span>
      <h4 style={{ ...sectionHeading, marginTop: 10, fontSize: 'clamp(21px,1.9vw,25px)', lineHeight: 1.12 }}>
        {flow.title}
      </h4>
      <p style={{ ...note, marginTop: 8, fontSize: 14, lineHeight: 1.5 }}>
        {flow.line}
      </p>

      <button
        type="button"
        className="rw-phase-toggle"
        style={{ fontFamily: mono }}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        {open ? 'Read less' : 'Read more'}<i className="rw-phase-toggle-arrow" aria-hidden>{open ? '−' : '+'}</i>
      </button>

      {open && (
        <div className="rw-phase-points-wrap">
          <img src={monogram} alt="" aria-hidden className="rw-phase-watermark" />
          <ul className="rw-phase-points">
            {flow.points.map((point) => (
              <li key={point} style={{ fontFamily: text }}>{point}</li>
            ))}
          </ul>
        </div>
      )}
    </Reveal>
  )
}

/** "& More" services as a chip cloud; one description revealed at a time avoids a wall of text. */
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
        eyebrow="CONSULTING · FOR DEVELOPERS, SALES LEADERSHIP & TOP CLOSERS"
        headline={HEADLINE}
        headlineStyle={{ fontSize: 'clamp(40px,5.2vw,78px)', lineHeight: 1.05 }}
        lede="Consulting · for developers, sales leadership & top closers."
        ledeStyle={{ fontSize: 'clamp(18px,2.2vw,22px)' }}
        intro="Team RW advises developers on the part of the business the brochure never fixes: how the inventory actually sells. Engagements are few, structured, and measured in absorption."
        introStyle={{ maxWidth: '38em' }}
        padding="80px 40px 40px"
        cta={<BookButton interest="Consulting" specular>REQUEST A SALES CONSULTATION</BookButton>}
      />

      {/* Wide feature image */}
      <section className="rw-pad" style={{ ...container, paddingBottom: 'clamp(20px,4vw,40px)' }}>
        <Reveal className="rw-figure" style={{ border: '1px solid var(--line)', overflow: 'hidden' }}>
          <div style={{ aspectRatio: '21/9' }}>
            <ImageSlot
              src={sessionImage}
              alt="Rajiv Williams at his desk beside the RW backdrop"
              placeholder="Working with a developer team"
              caption="pics/ · session or site"
              position="center 32%"
            />
          </div>
        </Reveal>
      </section>

      {/* The mission, then the quote it runs on - signed. */}
      <section style={{ ...sectionRule, borderBottom: '1px solid var(--line)', background: 'var(--chip)' }}>
        <div className="rw-pad" style={{ ...container, padding: 'clamp(80px,10vw,120px) 40px' }}>
          <div className="rw-split" style={{ display: 'grid', gridTemplateColumns: '.36fr .64fr', gap: 56 }}>
            <Reveal style={{ ...eyebrow, fontSize: 'clamp(15px,1.6vw,19px)', letterSpacing: '.22em' }}>THE MISSION</Reveal>
            <Reveal delay={100}>
              <h2 style={{ ...sectionHeading, fontSize: 'clamp(28px,3.4vw,42px)', lineHeight: 1.24, maxWidth: '19em' }}>
                {MISSION}
              </h2>
            </Reveal>
          </div>

          <Reveal delay={200} className="rw-mission-quote">
            <p style={{ fontFamily: serif, fontStyle: 'italic', fontSize: 'clamp(26px,3vw,38px)', lineHeight: 1.3, color: 'var(--ink)', maxWidth: '20em' }}>
              &ldquo;If everybody must eat, somebody must sell.&rdquo;
            </p>
            <img src={signature} alt="Rajiv Williams" className="rw-mission-signature" />
          </Reveal>
        </div>
      </section>

      {/* Developer challenge - a ledger of what each problem is replaced by. */}
      <section id="challenge" className="rw-pad" style={{ ...container, padding: 'clamp(90px,11vw,120px) 40px' }}>
        <div className="rw-split" style={{ display: 'grid', gridTemplateColumns: '.36fr .64fr', gap: 56, marginBottom: 'clamp(48px,6vw,72px)' }}>
          <Reveal style={{ ...eyebrow, letterSpacing: '.24em' }}>THE DEVELOPER CHALLENGE</Reveal>
          <Reveal delay={100}>
            <h2 style={{ ...sectionHeading, fontSize: 'clamp(26px,3vw,38px)', lineHeight: 1.15, maxWidth: '15em' }}>
              Four problems every developer knows {' '}
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
                Four phases: we audit what exists and build what does not, into{' '}
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

      {/* & More - additional strategic support services */}
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

      {/* One engagement, anonymised - the case study, with its three numbers. */}
      <section id="engagement" style={{ ...sectionRule, background: 'var(--chip)' }}>
        <div className="rw-pad" style={{ ...container, padding: 'clamp(80px,10vw,110px) 40px' }}>
          <Reveal style={{ ...eyebrow, letterSpacing: '.24em', marginBottom: 14 }}>ONE ENGAGEMENT, ANONYMISED</Reveal>
          <Reveal as="h2" delay={80} style={{ ...sectionHeading, maxWidth: '16em' }}>
            A West Hyderabad launch, stalled at 22% sold.
          </Reveal>
          <Reveal as="p" delay={140} style={{ ...note, marginTop: 26, fontSize: 'clamp(16px,1.7vw,18px)', lineHeight: 1.6, maxWidth: '44em' }}>
            The product was right; the sales machine was not. Over one quarter: the CP network was rebuilt from 40 dormant partners to 260 active ones, the pricing ladder was re-sequenced by tower, and the site team was retrained on qualification before pitch. Absorption tripled in ninety days. The developer&apos;s name stays private, which is exactly the point of hiring this way.
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
      <section style={{ ...sectionRule, position: 'relative', overflow: 'hidden' }}>
        <img src={hydMark} alt="" aria-hidden className="rw-watermark is-right" />
        <div className="rw-pad" style={{ maxWidth: 900, margin: '0 auto', padding: 'clamp(90px,12vw,130px) 40px', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <Reveal>
            <PullQuote name="SANDEEP KYLAS">
              “I had the privilege of consulting with Rajiv for a real estate matter in Hyderabad, and I couldn't have asked for a better advisor. I wholeheartedly recommend him to anyone seeking expert real estate consultation.”
            </PullQuote>
          </Reveal>
        </div>
      </section>

      <ClosingCTA id="talk" chip title="If the inventory is right and the velocity is wrong, talk.">
        <BookButton interest="Consulting" specular>REQUEST A SALES CONSULTATION</BookButton>
      </ClosingCTA>

      <Footer links={FOOTER_LINKS} />
    </>
  )
}
