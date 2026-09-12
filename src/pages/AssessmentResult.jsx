import { useMemo, useState } from 'react'
import { BookButton } from '../components/BookingModal'
import Footer from '../components/Footer'
import Header from '../components/Header'
import Reveal from '../components/Reveal'
import Seo from '../components/Seo'
import SectionHead, { SectionAside } from '../components/SectionHead'
import { KRISAH_ASSESSMENT_URL } from '../data/content'
import { FOOTER_LINKS, mono, serif } from '../theme'
import { container, ctaCopper, ctaInline, eyebrow, note, sectionHeading, sectionRule } from '../styles'

/**
 * The post-interview catalogue. KRISAH's back button lands here.
 *
 * PLACEHOLDER CATALOG — replace `COURSE_CATALOG` wholesale with the final
 * 16 courses (8 Coaching + 8 Consulting) once the list is provided.
 * Structure per card: track | duration | title | outcome.
 */
const COURSE_CATALOG = [
  { track: 'Coaching', duration: '90–120 min', title: 'High Ticket Sales Mastery', outcome: 'The foundations: buyer psychology, authority, and first high ticketing routines.', to: '/coaching' },
  { track: 'Coaching', duration: '90–120 min', title: 'Luxury Sales Mastery', outcome: 'Positioning and conversation for the mid-to-luxury buyer.', to: '/coaching' },
  { track: 'Coaching', duration: '90–120 min', title: 'One-to-One Mentoring', outcome: 'Personal, six-month development for CXOs, senior leadership and aspiring closers.', to: '/coaching' },
  { track: 'Consulting', duration: '90–120 min', title: 'Audit & Discovery', outcome: 'Reading the pipeline end to end before a single recommendation is made.', to: '/consulting' },
  { track: 'Consulting', duration: '90–120 min', title: 'Process Design', outcome: 'The playbook rebuilt around conversation, not discounting.', to: '/consulting' },
  { track: 'Consulting', duration: '90–120 min', title: 'Refinement & Scale', outcome: 'Measuring what moves and scaling the channels that prove out.', to: '/consulting' },
]

const FILTERS = ['All', 'Coaching', 'Consulting']

export default function AssessmentResult() {
  const [track, setTrack] = useState('All')
  const [query, setQuery] = useState('')

  const catalog = useMemo(() => {
    const q = query.trim().toLowerCase()
    return COURSE_CATALOG.filter((c) => {
      if (track !== 'All' && c.track !== track) return false
      if (!q) return true
      return `${c.title} ${c.outcome}`.toLowerCase().includes(q)
    })
  }, [track, query])

  return (
    <>
      <Seo route="/assessment/result" />
      <Header />

      {/* Thank-you band — this is where KRISAH's back button lands */}
      <section style={{ ...sectionRule, borderBottom: '1px solid var(--line)' }}>
        <div className="rw-pad" style={{ ...container, maxWidth: 880, padding: 'clamp(80px,10vw,110px) 40px', textAlign: 'center' }}>
          <Reveal style={{ ...eyebrow, marginBottom: 20 }}>YOU'VE COMPLETED YOUR INTERVIEW</Reveal>
          <Reveal as="h1" delay={80} style={{ ...sectionHeading, fontSize: 'clamp(30px,4.2vw,52px)', lineHeight: 1.1 }}>
            Now pick the room <span style={{ fontStyle: 'italic', color: 'var(--copper)' }}>you</span> want to rehearse in.
          </Reveal>
          <Reveal as="p" delay={160} style={{ ...note, marginTop: 18, marginLeft: 'auto', marginRight: 'auto', maxWidth: '30em', fontSize: 'clamp(16px,1.7vw,18px)', lineHeight: 1.6 }}>
            Your report shows where the gaps are. The sixteen courses below, ninety to one hundred and twenty minutes each, are the structured, specific way to close them.
          </Reveal>
          <Reveal delay={220} style={{ marginTop: 34, display: 'flex', gap: 34, justifyContent: 'center', flexWrap: 'wrap', fontFamily: mono, fontSize: 11, letterSpacing: '.14em', color: 'var(--faded)' }}>
            <span>16 COURSES</span>
            <span>90–120 MIN EACH</span>
            <span>COACHING + CONSULTING</span>
          </Reveal>
        </div>
      </section>

      {/* Catalogue */}
      <section className="rw-pad" style={{ ...container, ...sectionRule, padding: 'clamp(80px,10vw,110px) 40px' }}>
        <SectionHead
          eyebrow="AFTER YOUR REPORT" titleWidth="13em"
          title="Built around the shape of your score."
          aside={<SectionAside>Same programme catalogue as the coaching and consulting tracks, filtered for the gaps an assessment usually turns up first.</SectionAside>}
        />

        {/* Filters + search */}
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', marginTop: 44, paddingBottom: 24, borderBottom: '1px solid var(--line)' }}>
          <div className="rw-chips">
            {FILTERS.map((f) => (
              <button
                key={f}
                type="button"
                className={`rw-chip${track === f ? ' is-on' : ''}`}
                style={{ fontFamily: mono }}
                onClick={() => setTrack(f)}
              >
                {f.toUpperCase()}
              </button>
            ))}
          </div>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="SEARCH TITLES…"
            aria-label="Search courses"
            style={{
              fontFamily: mono, fontSize: 11, letterSpacing: '.12em',
              color: 'var(--ink)', background: 'transparent',
              border: '1px solid var(--line)', padding: '10px 14px', outline: 'none',
              width: 'min(220px, 100%)', textTransform: 'uppercase',
            }}
          />
        </div>

        {/* Cards */}
        <div className="rw-grid-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 20, marginTop: 32 }}>
          {catalog.map((course, i) => (
            <Reveal key={`${course.track}-${course.title}`} delay={(i % 2) * 80} className="rw-figure"
              style={{ border: '1px solid var(--line)', padding: 'clamp(26px,3.4vw,36px)', display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                <span style={{ fontFamily: mono, fontSize: 11, letterSpacing: '.14em', color: 'var(--copper)' }}>{course.track.toUpperCase()}</span>
                <span style={{ fontFamily: mono, fontSize: 11, letterSpacing: '.08em', color: 'var(--faded)' }}>· {course.duration}</span>
              </div>
              <h3 style={{ fontFamily: serif, fontSize: 'clamp(22px,2.5vw,28px)', color: 'var(--ink)',
                borderTop: '1px solid var(--line)', paddingTop: 16 }}>{course.title}</h3>
              <p style={{ ...note, fontSize: 15, lineHeight: 1.55 }}>
                {course.outcome}
              </p>
              <div style={{ marginTop: 'auto', paddingTop: 16, display: 'flex', gap: 18, alignItems: 'center', flexWrap: 'wrap' }}>
                <BookButton interest={course.track} specular>JOIN THIS COURSE</BookButton>
                <a href={course.to} className="rw-inline-cta" style={{ ...ctaInline, fontFamily: mono, fontSize: 12 }}>
                  Full track →
                </a>
              </div>
            </Reveal>
          ))}
          {catalog.length === 0 && (
            <div style={{ gridColumn: '1 / -1', padding: '60px 0', textAlign: 'center', fontFamily: mono, fontSize: 12, letterSpacing: '.14em', color: 'var(--faded)' }}>
              NO COURSES MATCH “{query.toUpperCase()}” YET. THE FULL 16-COURSE CATALOGUE LANDS HERE.
            </div>
          )}
        </div>

        {catalog.length > 0 && (
          <p style={{ ...note, marginTop: 32, textAlign: 'center', fontFamily: mono, fontSize: 11, letterSpacing: '.14em', color: 'var(--faded)' }}>
            {catalog.length} OF {COURSE_CATALOG.length} · {track.toUpperCase()}{query ? ` · MATCHING “${query.toUpperCase()}”` : ''}
          </p>
        )}
      </section>

      {/* Not ready for a course? */}
      <section style={{ ...sectionRule, background: 'var(--chip)' }}>
        <div className="rw-pad" style={{ ...container, maxWidth: 880, padding: 'clamp(70px,9vw,100px) 40px', textAlign: 'center' }}>
          <Reveal as="h2" style={{ ...sectionHeading, fontSize: 'clamp(26px,3.4vw,42px)', lineHeight: 1.12 }}>
            Take it again in a month and watch the score move.
          </Reveal>
          <Reveal as="p" delay={120} style={{ ...note, marginTop: 16, marginLeft: 'auto', marginRight: 'auto', maxWidth: '30em', fontSize: 16, lineHeight: 1.6 }}>
            The assessment is free and open anytime. Re-run it before you rehearse and after. Measure the delta.
          </Reveal>
          <Reveal delay={200} style={{ marginTop: 30, display: 'flex', gap: 18, flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
            <a href={KRISAH_ASSESSMENT_URL} target="_blank" rel="noopener noreferrer" style={ctaCopper}>
              RETAKING ASSESSMENT →
            </a>
            <BookButton interest="Coaching" specular>OR BOOK A CALL FIRST</BookButton>
          </Reveal>
        </div>
      </section>

      <Footer links={FOOTER_LINKS} />
    </>
  )
}