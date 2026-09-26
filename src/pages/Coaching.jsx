import { useEffect, useRef, useState } from 'react'
import goalsImage from '../assets/site/whiteboard-goals.png'
import luxuryImage from '../assets/site/plate-desk.png'
import mentoringImage from '../assets/site/plate-reading.png'
import monogram from '../assets/site/gold1.png'
import hydMark from '../assets/site/hyd-03.svg'
import CountUp from '../components/CountUp'
import Footer from '../components/Footer'
import Header from '../components/Header'
import PageIntro from '../components/PageIntro'
import Seo from '../components/Seo'
import { BookButton } from '../components/BookingModal'
import CtaButton from '../components/CtaButton'
import Reveal from '../components/Reveal'
import AchieveGrid from '../components/AchieveGrid'
import Bullet from '../components/Bullet'
import ClosingCTA from '../components/ClosingCTA'
import RelatedReading from '../components/RelatedReading'
import PullQuote from '../components/PullQuote'
import SectionHead, { CenteredHead, SectionAside } from '../components/SectionHead'
import { useSmoothScroll } from '../hooks/useSmoothScroll'
import { ACHIEVE, ASSESSMENT_AREAS, COACHING_PROGRAMS, COACHING_TESTIMONIALS, CURRICULUM } from '../data/content'
import { track } from '../data/analytics'
import { FOOTER_LINKS, mono, serif, text } from '../theme'
import {
  container, ctaCopper, ctaInline, eyebrow,
  note, sectionRule, statLabel,
} from '../styles'
import {
  ArrowRight, Award, Brain, ChevronDown, Compass, Crown, Gem, Handshake, HeartHandshake,
  MessagesSquare, ShieldCheck, Target, Trophy, UserRoundSearch,
} from 'lucide-react'

const HEADLINE = [
  { text: 'Stop competing ' },
  { text: 'on commission. ' },
  { br: true },
  { text: 'Start operating in the high-value segment.', italic: true, copper: true },
]

/** Covers for COACHING_PROGRAMS, matched by index. */
const PROGRAM_COVERS = [
  { src: goalsImage, alt: 'Rajiv running a closing framework at the whiteboard' },
  { src: luxuryImage, alt: 'Rajiv, Luxury Sales Mastery programme' },
  { src: mentoringImage, alt: 'Rajiv, One-to-One Mentoring programme' },
]

/** One icon per COACHING_PROGRAMS feature, matched by index (decorative only). */
const PROGRAM_ICONS = [
  [Brain, ShieldCheck, Handshake, Trophy],                   // psychology · objections · negotiation · closing
  [Gem, Crown, HeartHandshake, Award],                       // luxury buyer · premium positioning · trust · high-value close
  [UserRoundSearch, MessagesSquare, Target, Compass],        // assessment · strategy talk · targeted mentoring · action guidance
]

/**
 * A compact program card: who it's for, title, one focus line and Apply stay visible.
 * "What's included" slides up over the photo — on hover/focus with a pointer, or by
 * tapping the toggle on touch screens — so nothing is hover-only and cards never
 * change height. (Outcome line and "Nth Opportunity" label stay in content.js but
 * are not shown: they repeated the list and meant little to visitors.)
 */
function ProgramCard({ program, index }) {
  const [open, setOpen] = useState(false)
  const cardRef = useRef(null)
  const listId = `program-${index}-included`

  // Pinned open: a click/tap anywhere outside the card, or Esc, closes it again.
  useEffect(() => {
    if (!open) return
    const onDown = (e) => { if (!cardRef.current?.contains(e.target)) setOpen(false) }
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('pointerdown', onDown)
    document.addEventListener('keydown', onKey)
    return () => { document.removeEventListener('pointerdown', onDown); document.removeEventListener('keydown', onKey) }
  }, [open])

  // Clicking the card pins/unpins the details; its own buttons (Apply, toggle) keep their jobs.
  const onCardClick = (e) => { if (!e.target.closest('button, a')) setOpen((v) => !v) }

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions -- keyboard users get the same list via focus and the toggle
    <article ref={cardRef} className={`rw-program${open ? ' is-open' : ''}`} onClick={onCardClick}>
      <div className="rw-program-media">
        <img src={PROGRAM_COVERS[index]?.src} alt={PROGRAM_COVERS[index]?.alt} loading="lazy" />
        <span className="rw-program-numeral" style={{ fontFamily: serif }} aria-hidden>{program.k}</span>
        {program.features?.length > 0 && (
          <div className="rw-program-included" id={listId}>
            <div className="rw-program-included-label" style={{ fontFamily: mono }}>WHAT'S INCLUDED</div>
            <ul className="rw-program-features" style={{ fontFamily: text }}>
              {program.features.map((feature, j) => {
                const Icon = PROGRAM_ICONS[index]?.[j]
                return (
                  <li key={feature}>
                    <span className="rw-program-icon" aria-hidden>{Icon && <Icon size={16} strokeWidth={1.6} />}</span>
                    {feature}
                  </li>
                )
              })}
            </ul>
          </div>
        )}
      </div>

      <div className="rw-program-body">
        {program.audience && <span className="rw-program-kicker" style={{ fontFamily: mono }}>{program.audience}</span>}
        <h3 className="rw-program-title" style={{ fontFamily: serif }}>{program.title}</h3>
        <p className="rw-program-desc" style={{ fontFamily: text }}>{program.description}</p>
        {program.features?.length > 0 && (
          <button
            type="button" className="rw-program-toggle" style={{ fontFamily: mono }}
            aria-expanded={open} aria-controls={listId} onClick={() => setOpen((v) => !v)}
          >
            {open ? 'Hide details' : "What's included"}
            <ChevronDown size={14} strokeWidth={1.8} aria-hidden />
          </button>
        )}
        <BookButton interest="Coaching" className="rw-cta rw-program-cta" style={ctaCopper}>
          APPLY NOW <ArrowRight size={16} strokeWidth={1.8} aria-hidden />
        </BookButton>
      </div>
    </article>
  )
}

/** Syllabus as a pill cloud: hovering a category reveals its detail panel, same
 *  hover-to-reveal idiom as Consulting's "& More" chip cloud. */
function SyllabusCloud({ categories }) {
  const [active, setActive] = useState(null)
  const cat = active === null ? null : categories[active]

  return (
    <div onMouseLeave={() => setActive(null)}>
      <div className="rw-chips">
        {categories.map((c, i) => (
          <button
            key={c.n}
            type="button"
            className={`rw-chip${active === i ? ' is-on' : ''}`}
            style={{ fontFamily: mono }}
            onMouseEnter={() => setActive(i)}
            onFocus={() => setActive(i)}
          >
            {c.n} · {c.title}
          </button>
        ))}
      </div>

      <div className={`rw-syllabus-panel${cat ? ' is-active' : ''}`}>
        {cat && (
          <>
            <img src={monogram} alt="" aria-hidden className="rw-syllabus-watermark" />
            <div key={active} className="rw-syllabus-panel-body">
              <div className="rw-syllabus-num" style={{ fontFamily: mono }} aria-hidden>{cat.n}</div>
              <h3 className="rw-syllabus-title" style={{ fontFamily: serif }}>{cat.title}</h3>
              <div className="rw-syllabus-panel-groups">
                {cat.groups.map((group) => (
                  <div key={group.label} className="rw-syllabus-group">
                    <div className="rw-syllabus-group-label" style={{ fontFamily: mono }}>{group.label}</div>
                    <div className="rw-syllabus-items">
                      {group.items.map((item) => (
                        <Bullet key={item} style={{ fontFamily: text }}>{item}</Bullet>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
        {!cat && <div className="rw-syllabus-hint" style={{ fontFamily: mono }}>Hover a category above to see what it covers.</div>}
      </div>
    </div>
  )
}

export default function Coaching() {
  const scrollToId = useSmoothScroll()

  return (
    <>
      <Seo route="/coaching" />
      <Header />

      {/* Intro */}
      <PageIntro
        eyebrow="COACHING · FOR DEVELOPERS, SENIOR SALES LEADERSHIP & TOP CLOSERS"
        headline={HEADLINE}
        lede="For developers, senior sales leadership, and top sales closers who are done with volume games."
        intro="What changes: your ticket size, your client register, and how the market treats your word."
        cta={<>
          <BookButton interest="Coaching" specular>BOOK A STRATEGY CALL</BookButton>
          <button type="button" onClick={() => scrollToId('premium-programs')} className="rw-inline-cta" style={ctaInline}>
            Explore coaching programs →
          </button>
          <CtaButton variant="secondary" to="/start?who=sales_pro" arrow="→">Not sure? Find your fit</CtaButton>
        </>}
        extra={
          <Reveal delay={120} style={{ marginTop: 48, display: 'flex', gap: 56, flexWrap: 'wrap', borderTop: '1px solid var(--line)', paddingTop: 26 }}>
            <div>
              <div style={{ fontFamily: serif, fontSize: 'clamp(28px,3.4vw,34px)', color: 'var(--ink)' }}>₹2,700 Cr+</div>
              <div style={{ ...statLabel, marginTop: 8 }}>GENERATED FOR DEVELOPER BRANDS</div>
            </div>
            <div>
              <div style={{ fontFamily: serif, fontSize: 'clamp(28px,3.4vw,34px)', color: 'var(--ink)' }}><CountUp to={15} suffix="+" duration={1400} /></div>
              <div style={{ ...statLabel, marginTop: 8 }}>YEARS AT THE TOP</div>
            </div>
          </Reveal>
        }
      />

      {/* Assessment — the KRISAH-powered scored interview, explained before the ask.
          Was a bare "START ASSESSMENT" button in the hero with no context; moved here
          with the content from the standalone assessment landing page so the CTA has
          a reason behind it. */}
      <section id="assessment" className="rw-pad" style={{ ...container, padding: 'clamp(90px,11vw,130px) 40px' }}>
        <div className="rw-grid-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 56, alignItems: 'start' }}>
          <Reveal>
            <div style={{ ...eyebrow, marginBottom: 18 }}>THE ASSESSMENT</div>
            <h2 style={{ fontFamily: serif, fontWeight: 400, fontSize: 'clamp(28px,3.6vw,42px)', lineHeight: 1.1, color: 'var(--ink)', maxWidth: '14em' }}>
              A live AI interview that measures what actually matters.
            </h2>
            <p style={{ ...note, marginTop: 22, fontSize: 16, lineHeight: 1.6 }}>
              I have partnered with KRISAH, an AI-powered assessment platform, to bring a scored sales assessment to real estate professionals across India.
            </p>
            <p style={{ ...note, marginTop: 16, fontSize: 16, lineHeight: 1.6 }}>
              It is a live AI interview, asking the kinds of questions a serious employer or buyer would ask, and scoring your performance across six areas.
            </p>
            <p style={{ ...note, marginTop: 16, fontSize: 16, lineHeight: 1.6 }}>
              You get a full scored report after your session. I review it before our first coaching call, so we start from what the data shows, not what I assume.
            </p>
            <div style={{ marginTop: 32 }}>
              <CtaButton href="/assesment" live onClick={() => track('assessment_page_click', { location: 'coaching-assessment-section' })}>
                TAKE YOUR FREE ASSESSMENT <span className="rw-cta-arrow">→</span>
              </CtaButton>
            </div>
          </Reveal>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {ASSESSMENT_AREAS.map((area, i) => (
              <Reveal key={area.n} delay={i * 70} style={{ display: 'flex', gap: 18, borderTop: '1px solid var(--line)', paddingTop: 12 }}>
                <span style={{ fontFamily: serif, fontSize: 22, color: 'var(--copper)', lineHeight: 1, flexShrink: 0, width: 28 }}>{area.n}</span>
                <div>
                  <div style={{ fontFamily: serif, fontSize: 18, color: 'var(--ink)', lineHeight: 1.3 }}>{area.title}</div>
                  <p style={{ ...note, marginTop: 4, fontSize: 14, lineHeight: 1.5 }}>{area.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* What you'll achieve - numbered outcome cards */}
      <section style={{ ...sectionRule, borderBottom: '1px solid var(--line)', background: 'var(--chip)' }}>
        <div className="rw-pad" style={{ ...container, padding: 'clamp(80px,10vw,110px) 40px' }}>
          <SectionHead
            eyebrow="WHAT CHANGES" titleWidth="11em"
            title="Outcomes, not certificates."
            aside={<SectionAside>Your pipeline becomes the syllabus. Nothing theoretical survives the first session.</SectionAside>}
          />

          <AchieveGrid items={ACHIEVE} className="rw-achieve-grid" arrows />
        </div>
      </section>

      {/* Premium programs */}
      <section id="premium-programs" className="rw-pad" style={{ ...container, padding: 'clamp(90px,11vw,130px) 40px' }}>
        <CenteredHead
          eyebrow="THREE WAYS IN"
          title={<><span style={{ color: 'var(--copper)' }}>Three</span> ways to work together</>}
          intro="Each session runs 90–120 minutes. The application is the filter: if the fit is right, you will hear back within two working days."
        />

        <div className="rw-grid-3 rw-programs">
          {COACHING_PROGRAMS.map((program, i) => (
            <Reveal key={program.title} delay={i * 90} className="rw-program-wrap">
              <ProgramCard program={program} index={i} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* Curriculum - the full syllabus, as six numbered category cards */}
      <section id="curriculum" className="rw-pad" style={{ ...sectionRule, background: 'var(--chip)' }}>
        <div style={{ ...container, padding: 'clamp(90px,11vw,130px) 40px' }}>
          <SectionHead
            eyebrow="THE SYLLABUS" titleWidth="15em"
            title="Sales upskilling, and the personality behind it."
            aside={<SectionAside width="24em">Eighteen skills in six categories, sequenced from first impressions to closed deals. Nothing here is theory; each line is drilled against your own pipeline.</SectionAside>}
          />

          <SyllabusCloud categories={CURRICULUM} />
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ ...sectionRule, background: 'var(--chip)', position: 'relative', overflow: 'hidden' }}>
        <img src={hydMark} alt="" aria-hidden className="rw-watermark is-left" />
        <div className="rw-pad" style={{ maxWidth: 1000, margin: '0 auto', padding: 'clamp(80px,10vw,110px) 40px', position: 'relative', zIndex: 1 }}>
          {COACHING_TESTIMONIALS.map((t, i) => (
            <Reveal key={t.name} delay={i * 90} style={{ borderTop: '1px solid var(--line)', padding: '36px 0', textAlign: 'center' }}>
              <PullQuote as="p" size="clamp(20px,2.4vw,26px)" lineHeight={1.4} space={18} name={t.name}>
                “{t.text}”
              </PullQuote>
            </Reveal>
          ))}
        </div>
      </section>

      <RelatedReading service="coaching" title="Reading for sellers." />

      <ClosingCTA title="The application is the filter. Serious applications get serious answers." titleStyle={{ maxWidth: '15em' }}>
        <CtaButton variant="outline" href="/form/coaching">TELL US ABOUT YOUR COACHING NEEDS</CtaButton>
      </ClosingCTA>

      <Footer links={FOOTER_LINKS} />
    </>
  )
}
