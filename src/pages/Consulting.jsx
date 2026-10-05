import { memo, useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin'
import sessionImage from '../assets/site/consulting-desk.webp'
import signature from '../assets/site/gold2.png'
import monogram from '../assets/site/rw-logo-ccr.png'
import hydMark from '../assets/site/hyd-04.svg'
import Footer from '../components/Footer'
import Header from '../components/Header'
import ImageSlot from '../components/ImageSlot'
import Seo from '../components/Seo'
import { BookButton } from '../components/BookingModal'
import CtaButton from '../components/CtaButton'
import Reveal from '../components/Reveal'
import ClosingCTA from '../components/ClosingCTA'
import RelatedReading from '../components/RelatedReading'
import PullQuote from '../components/PullQuote'
import SectionHead, { SectionAside } from '../components/SectionHead'
import { DEVELOPER_SHIFTS, ECOSYSTEM, SUPPORT_SERVICES } from '../data/content'
import { FOOTER_LINKS, mono, serif, text } from '../theme'
import { fs, ctaCopper, ctaInline,
  container, eyebrow,
  note, sectionHeading, sectionRule,
} from '../styles'

const MISSION = 'Team RW is out on a mission to revolutionize how the Hyderabad real estate industry conducts itself, and how it is perceived.'

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

/** The four ecosystem phases. Only one card is open at a time: hovering peeks a card
 *  open, clicking pins it (any other collapses), and a click anywhere outside the grid
 *  collapses it again — so the section never becomes a wall of open bullets. */
function PhaseGrid({ items }) {
  const [pinned, setPinned] = useState(null) // clicked-open card; survives mouse-leave
  const [hover, setHover] = useState(null)   // peek-open card while the cursor is on it
  const gridRef = useRef(null)

  // A click or tap anywhere outside the grid collapses the pinned card.
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
          /* A pinned card stays open; hovering any other card previews its points too.
             Clicking that preview transfers the pinned state to the new card. */
          expanded={pinned === i || hover === i}
          onToggle={() => {
            // Clicking an already-pinned card (or its "Read less") collapses it — and
            // we drop the hover peek too, so the cursor still resting on the card can't
            // immediately re-open it. Clicking any other card just pins that one.
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

/** One ecosystem phase card. The whole card is the click target (pins/unpins); its
 *  points live in an always-mounted collapse wrapper so they animate open/closed. */
function PhaseCard({ flow, index, delay, active, expanded, onToggle, onHover, onLeave }) {
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

        {/* Clicks inside don't bubble to the card's toggle, so reading a point never
            collapses the card. */}
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
        {active ? 'Hide details' : 'View details'}<i className="rw-phase-toggle-arrow" aria-hidden>{active ? '−' : '+'}</i>
      </button>
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
            onFocus={() => setActive(i)}
            onClick={() => setActive(i)}
            aria-pressed={i === active}
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

      {/* Consulting hero. Mirrors the Coaching hero: the boardroom photograph sits on
          .rw-consulting-hero::before in global.css under a left-weighted scrim, so all copy
          sits on the dark side and the scale model stays clear on the right. */}
      <section id="top" className="rw-consulting-hero">
        <div className="rw-consulting-hero-copy rw-pad">
          <Reveal className="rw-consulting-hero-eyebrow" style={{ fontFamily: mono }}>
            CONSULTING · FOR DEVELOPERS, SALES LEADERSHIP &amp; TOP CLOSERS
          </Reveal>

          <Reveal as="h1" delay={80} className="rw-consulting-hero-title" style={{ fontFamily: serif }}>
            <span>₹2,700+ Cr sold, quietly.</span>
            <span className="rw-consulting-hero-title-italic">Built for absorption, not brochures.</span>
          </Reveal>

          <Reveal as="p" delay={150} className="rw-consulting-hero-subhead" style={{ fontFamily: text }}>
            Business process consulting for real-estate developers &amp; sales organizations.
          </Reveal>

          <Reveal as="p" delay={190} className="rw-consulting-hero-lede" style={{ fontFamily: text }}>
            Team RW advises real-estate developers on how inventory actually sells. Engagements are few,
            structured &amp; measured in absorption.
          </Reveal>

          <Reveal delay={220} className="rw-hero-actions">
            <BookButton
              interest="Consulting"
              className="rw-cta rw-hero-book"
              style={ctaCopper}
            >
              REQUEST A SALES CONSULTATION
            </BookButton>
            {/* Same row as the request button; align-items: center is vertical, not a centered hero. */}
            <CtaButton
              variant="secondary"
              to="/start?who=developer"
              arrow="→"
              className="rw-hero-fit"
            >
              Not sure? Find your fit
            </CtaButton>
          </Reveal>
        </div>
      </section>

      {/* Wide feature image */}
      

      {/* The mission, then the quote it runs on - signed. */}
      <section style={{ ...sectionRule, borderBottom: '1px solid var(--line)', background: 'var(--chip)' }}>
        <div className="rw-pad" style={{ ...container, padding: 'clamp(80px,10vw,120px) 40px' }}>
          <div className="rw-split" style={{ display: 'grid', gridTemplateColumns: '.36fr .64fr', gap: 56 }}>
            <Reveal style={{ ...eyebrow, fontSize: fs('clamp(15px,1.6vw,19px)'), letterSpacing: '.22em' }}>THE MISSION</Reveal>
            <Reveal delay={100}>
              <h2 style={{ ...sectionHeading, fontSize: fs('clamp(28px,3.4vw,42px)'), lineHeight: 1.24, maxWidth: '19em' }}>
                {MISSION}
              </h2>
            </Reveal>
          </div>

          <Reveal delay={200} className="rw-mission-quote">
            <p style={{ fontFamily: serif, fontStyle: 'italic', fontSize: fs('clamp(26px,3vw,38px)'), lineHeight: 1.3, color: 'var(--ink)', maxWidth: '20em' }}>
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
            <h2 style={{ ...sectionHeading, fontSize: fs('clamp(26px,3vw,38px)'), lineHeight: 1.15, maxWidth: '15em' }}>
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
              <h3 style={{ ...sectionHeading, fontSize: fs('clamp(26px,3vw,38px)'), lineHeight: 1.15, maxWidth: '15em' }}>
                Four phases. We audit what exists and build what does not, into{' '}
                <span style={{ fontStyle: 'italic', color: 'var(--copper)' }}>controlled, predictable revenue.</span>
              </h3>
            </Reveal>
          </div>

          <PhaseGrid items={ECOSYSTEM} />
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
          <Reveal as="p" delay={140} style={{ ...note, marginTop: 26, fontSize: fs('clamp(16px,1.7vw,18px)'), lineHeight: 1.6, maxWidth: '44em' }}>
            The product was right, but the sales machine was not. Over one quarter, the CP network was rebuilt from 40 dormant partners to 260 active ones, the pricing ladder was re-sequenced by tower, and the site team was retrained on qualification before pitch. Absorption tripled in ninety days. The developer&apos;s name stays private, which is exactly the point of hiring this way.
          </Reveal>
          <div className="rw-grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 32, marginTop: 'clamp(34px,4vw,52px)' }}>
            {[
              { v: '3×', l: 'ABSORPTION IN 90 DAYS' },
              { v: '5x', l: 'Revenue Growth' },
              { v: '260', l: 'ACTIVE CHANNEL PARTNERS' },
            ].map((stat, i) => (
              <Reveal key={stat.l} delay={i * 90} style={{ borderTop: '1px solid var(--line)', paddingTop: 22 }}>
                <div style={{ fontFamily: serif, fontSize: fs('clamp(34px,4vw,52px)'), lineHeight: 1, color: 'var(--copper)' }}>{stat.v}</div>
                <div style={{ marginTop: 12, fontFamily: mono, fontSize: fs('11px'), letterSpacing: '.16em', color: 'var(--faded)' }}>{stat.l}</div>
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

      <RelatedReading service="consulting" title="Reading for sales leaders & teams." />

      <ClosingCTA id="talk" chip title="If the inventory is right and the velocity is wrong, talk.">
        <CtaButton variant="outline" href="/form/consulting">TELL US ABOUT YOUR BUSINESS</CtaButton>
      </ClosingCTA>

      <Footer links={FOOTER_LINKS} />
    </>
  )
}
