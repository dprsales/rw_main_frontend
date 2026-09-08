import { useEffect, useState } from 'react'
import teamImage from '../assets/site/team-group.jpg'
import cultureImage from '../assets/site/whiteboard-session.jpg'
import Footer from '../components/Footer'
import Header from '../components/Header'
import ImageSlot from '../components/ImageSlot'
import Seo from '../components/Seo'
import { BookButton } from '../components/BookingModal'
import Reveal from '../components/Reveal'
import AchieveGrid from '../components/AchieveGrid'
import ClosingCTA from '../components/ClosingCTA'
import PageIntro from '../components/PageIntro'
import SectionHead, { CenteredHead, SectionAside } from '../components/SectionHead'
import { useSmoothScroll } from '../hooks/useSmoothScroll'
import { CAREER_CATEGORIES, CAREER_CULTURE, CAREER_HOOK, CAREER_PROCESS, CAREER_REASONS, CAREER_ROLES } from '../data/content'
import { fetchRoles } from '../data/jobs'
import { FOOTER_LINKS, mono, serif, text } from '../theme'
import {
  container, ctaCard, ctaCopper, ctaInline, eyebrow,
  note, sectionHeading, sectionRule,
} from '../styles'

const HEADLINE = [
  { text: 'Anyone can sell a flat. ' },
  { br: true },
  { text: 'We are hiring people who can hold a room.', italic: true, copper: true },
]

// Applications go through the booking form, same as every other CTA, with the role in the message.
const APPLY_INTEREST = 'Joining the team'

const ALL = 'All'
const LEVELS = ['All', 'Executive', 'Manager', 'Head']
const ROLES_PER_PAGE = 6

function roleLevel(role) {
  if (role.level?.toLowerCase().includes('senior')) return 'Head'
  if (role.level?.toLowerCase().includes('mid')) return 'Manager'
  return 'Executive'
}

function RoleIcon({ type }) {
  const paths = type === 'location'
    ? <><path d="M12 21s6-5.2 6-11a6 6 0 1 0-12 0c0 5.8 6 11 6 11Z" /><circle cx="12" cy="10" r="2" /></>
    : <path d="M4 8h16v11H4zM9 8V5h6v3M4 12h16" />
  return <svg className="rw-role-meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>{paths}</svg>
}

export default function Careers() {
  const scrollToId = useSmoothScroll()
  const [filter, setFilter] = useState(ALL)
  const [levelFilter, setLevelFilter] = useState(ALL)
  const [visibleCount, setVisibleCount] = useState(ROLES_PER_PAGE)

  // Seeded with the curated list, replaced if the jobs endpoint answers; fetchRoles never rejects.
  const [openRoles, setOpenRoles] = useState(CAREER_ROLES)

  useEffect(() => {
    let live = true
    fetchRoles().then((rows) => { if (live) setOpenRoles(rows) })
    return () => { live = false }
  }, [])

  // Any API category not in the curated list still needs a tab, or its roles are unreachable.
  const categories = [...new Set([...CAREER_CATEGORIES, ...openRoles.map((r) => r.category)])]

  // Only categories with an open role get a tab.
  const tabs = [ALL, ...categories.filter((c) => openRoles.some((r) => r.category === c))]
  const roles = openRoles.filter((role) => {
    const matchesCategory = filter === ALL || role.category === filter
    const matchesLevel = levelFilter === ALL || roleLevel(role) === levelFilter
    return matchesCategory && matchesLevel
  })
  const visibleRoles = roles.slice(0, visibleCount)
  const roleOptions = openRoles.map((role) => role.title)

  return (
    <>
      <Seo route="/careers" />
      <Header />

      {/* Intro */}
      <PageIntro
        eyebrow="CAREERS · TEAM RAJIV WILLIAMS"
        headline={HEADLINE}
        lede="A small floor, selling Hyderabad’s luxury inventory."
        intro="We hire for judgement and follow-through, then train the rest. If you have been carrying a target and want the ticket size to match the effort, this is the room."
        cta={<>
          <BookButton interest={APPLY_INTEREST} roleOptions={roleOptions} style={ctaCopper}>APPLY TO THE TEAM</BookButton>
          <button type="button" onClick={() => scrollToId('roles')} className="rw-inline-cta" style={ctaInline}>
            See open roles →
          </button>
        </>}
      />

      {/* Statement band */}
      <section style={{ ...sectionRule, borderBottom: '1px solid var(--line)', background: 'var(--card)' }}>
        <div className="rw-pad" style={{ ...container, padding: 'clamp(64px,8vw,96px) 40px', textAlign: 'center' }}>
          <Reveal as="p" style={{ ...sectionHeading, fontSize: 'clamp(26px,3.4vw,44px)', lineHeight: 1.12 }}>
            {CAREER_HOOK.lead}
          </Reveal>
          <Reveal as="p" delay={120} style={{ ...sectionHeading, fontSize: 'clamp(26px,3.4vw,44px)', lineHeight: 1.12, fontStyle: 'italic', color: 'var(--copper)', marginTop: 10 }}>
            {CAREER_HOOK.accent}
          </Reveal>
        </div>
      </section>

      {/* Why here */}
      <section id="why" style={{ ...sectionRule, borderBottom: '1px solid var(--line)', background: 'var(--chip)' }}>
        <div className="rw-pad" style={{ ...container, padding: 'clamp(80px,10vw,110px) 40px' }}>
          <SectionHead
            eyebrow="WHY HERE" titleWidth="11em"
            title="A floor built like a practice."
            aside={<SectionAside>The same frameworks Rajiv runs with developer sales teams are what you are trained on in your first fortnight.</SectionAside>}
          />

          <AchieveGrid items={CAREER_REASONS} className="rw-reason-grid" stagger={4} />
        </div>
      </section>

      {/* Life on the floor */}
      <section className="rw-pad" style={{ ...container, padding: 'clamp(80px,10vw,110px) 40px' }}>
        <div className="rw-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(28px,4vw,64px)', alignItems: 'center' }}>
          <Reveal className="rw-figure" style={{ border: '1px solid var(--line)', aspectRatio: '4/3' }}>
            {/* <ImageSlot
              src={teamImage}
              alt="Team Rajiv Williams after a sales floor session"
              placeholder="Team Rajiv Williams"
              caption="The floor"
              spec="Landscape 4:3 · ≥1800px wide · the team mid-session, faces engaged"
              tag="HYDERABAD"
              position="center 35%"
            /> */}
          </Reveal>
          <Reveal delay={120}>
            <div style={{ ...eyebrow, marginBottom: 16 }}>WHAT THE WORK LOOKS LIKE</div>
            <h2 style={{ ...sectionHeading, fontSize: 'clamp(26px,3.2vw,40px)', lineHeight: 1.08 }}>
              Fewer leads. Longer conversations. Larger cheques.
            </h2>
            <p style={{ ...note, marginTop: 18, fontSize: 'clamp(16px,1.7vw,18px)', lineHeight: 1.6 }}>
              Mandates are exclusive, so the inventory you carry is yours to know completely. Mornings are pipeline review, afternoons are site visits, and the deals that matter are worked jointly — nobody is left alone with a negotiation they have not been prepared for.
            </p>
            <p style={{ ...note, marginTop: 14, fontSize: 'clamp(16px,1.7vw,18px)', lineHeight: 1.6 }}>
              What we ask for is discipline between calls. What we do not ask for is volume dialling.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Culture — full-bleed plate, copy sitting over it */}
      <section style={{ position: 'relative', minHeight: 'clamp(420px,62vh,620px)', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
        <img
          src={cultureImage}
          alt="A working session on the Team Rajiv Williams floor"
          loading="lazy"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 35%' }}
        />
        {/* Dark wash so light body text stays readable over the mid-tone photo. */}
        <div aria-hidden style={{ position: 'absolute', inset: 0, background: 'linear-gradient(rgba(11,10,9,.55), rgba(11,10,9,.82))' }} />

        <div className="rw-pad" style={{ ...container, position: 'relative', zIndex: 2, padding: 'clamp(70px,9vw,110px) 40px', textAlign: 'center' }}>
          <Reveal style={{ ...eyebrow, marginBottom: 16 }}>{CAREER_CULTURE.eyebrow}</Reveal>
          <Reveal as="h2" delay={80} style={{ ...sectionHeading, lineHeight: 1.06, maxWidth: '13em', margin: '0 auto' }}>
            {CAREER_CULTURE.title}
          </Reveal>
          <Reveal as="p" delay={140} style={{ ...note, marginTop: 18, marginLeft: 'auto', marginRight: 'auto', maxWidth: '38em', fontSize: 'clamp(16px,1.7vw,19px)', lineHeight: 1.6 }}>
            {CAREER_CULTURE.body}
          </Reveal>
          <Reveal delay={200} style={{ marginTop: 30 }}>
            <button type="button" onClick={() => scrollToId('roles')} className="rw-inline-cta" style={ctaInline}>
              {CAREER_CULTURE.cta} →
            </button>
          </Reveal>
        </div>
      </section>

      {/* Open roles */}
      <section id="roles" style={{ ...sectionRule, background: 'var(--chip)' }}>
        <div className="rw-pad" style={{ ...container, padding: 'clamp(90px,11vw,130px) 40px' }}>
          <CenteredHead
            eyebrow="OPEN ROLES"
            title="Where we are hiring right now"
            intro="Every role is Hyderabad-based and on the floor. If none of these fit but you belong here, apply anyway and say why."
          />

          {openRoles.length > 0 && (
            <Reveal delay={80} style={{ marginTop: 38, display: 'flex', justifyContent: 'center' }}>
              <div className="rw-tabs" role="tablist" aria-label="Filter roles by team">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    role="tab"
                    aria-selected={filter === tab}
                    onClick={() => { setFilter(tab); setVisibleCount(ROLES_PER_PAGE) }}
                    className={`rw-tab${filter === tab ? ' is-on' : ''}`}
                    style={{ fontFamily: mono, fontSize: 12, letterSpacing: '.12em', textTransform: 'uppercase' }}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </Reveal>
          )}

          {openRoles.length > 0 && (
            <Reveal delay={120} style={{ marginTop: 18, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
              <span className="rw-level-label">LEVEL</span>
              <div className="rw-level-tabs" role="tablist" aria-label="Filter roles by level">
                {LEVELS.map((level) => (
                  <button
                    key={level}
                    type="button"
                    role="tab"
                    aria-selected={levelFilter === level}
                    onClick={() => { setLevelFilter(level); setVisibleCount(ROLES_PER_PAGE) }}
                    className={`rw-level-tab${levelFilter === level ? ' is-on' : ''}`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </Reveal>
          )}

          {openRoles.length === 0 ? (
            <Reveal style={{ marginTop: 48, textAlign: 'center', border: '1px solid var(--line)', padding: 'clamp(36px,6vw,64px)' }}>
              <div style={{ fontFamily: serif, fontSize: 'clamp(22px,2.6vw,28px)', color: 'var(--ink)' }}>No open positions this month.</div>
              <p style={{ ...note, marginTop: 12 }}>
                Strong profiles are kept on file and called first when a seat opens.
              </p>
              <BookButton interest={APPLY_INTEREST} roleOptions={roleOptions} style={{ ...ctaCopper, marginTop: 26 }}>SEND YOUR PROFILE</BookButton>
            </Reveal>
          ) : (
            <div className="rw-careers-grid" style={{ marginTop: 42 }}>
              {visibleRoles.map((role, i) => {
                const roleId = role.id || role.title
                return (
                  <Reveal key={roleId} delay={(i % 3) * 70} className="rw-role-card">
                    <article className="rw-role-row">
                      <div className="rw-role-card-main">
                        <span className="rw-role-level">{roleLevel(role)}</span>
                        <div className="rw-role-title">{role.title}</div>
                      </div>
                      <div className="rw-role-summary">
                        <div className="rw-role-meta">
                          <span><RoleIcon type="briefcase" /> Full-time</span>
                          <span><RoleIcon type="location" /> {role.location || 'Hyderabad'}</span>
                          <span>{role.experience}</span>
                        </div>
                        <p>{role.description}</p>
                      </div>
                      <BookButton className="rw-role-apply" interest={APPLY_INTEREST} role={role.title} jobId={role.id} roleOptions={roleOptions} style={{ ...ctaCard, marginTop: 0 }}>
                        APPLY NOW <span aria-hidden>→</span>
                      </BookButton>
                    </article>
                  </Reveal>
                )
              })}
            </div>
          )}

          {roles.length > visibleCount && (
            <div className="rw-load-more-wrap">
              <button type="button" className="rw-load-more" onClick={() => setVisibleCount((count) => count + ROLES_PER_PAGE)}>
                <span>LOAD MORE</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                  <path d="M12 5v14M6 13l6 6 6-6" />
                </svg>
              </button>
              <span className="rw-load-more-count">Showing {visibleRoles.length} of {roles.length}</span>
            </div>
          )}
        </div>
      </section>

      {/* Process */}
      <section id="process" className="rw-pad" style={{ ...container, ...sectionRule, padding: 'clamp(80px,10vw,110px) 40px' }}>
        <Reveal style={{ ...eyebrow, marginBottom: 16 }}>HOW HIRING RUNS</Reveal>
        <Reveal as="h2" delay={80} style={{ ...sectionHeading, maxWidth: '14em' }}>
          Four steps, about two weeks.
        </Reveal>

        {/* One rail across desktop, stacking to a vertical rail on a phone. */}
        <div className="rw-track" style={{ marginTop: 'clamp(44px,6vw,72px)' }}>
          <div className="rw-track-steps">
            {CAREER_PROCESS.map((step, i) => (
              <Reveal key={step.n} delay={i * 90} className="rw-track-step" style={{ textAlign: 'center' }}>
                <div className="rw-track-node" style={{ fontFamily: mono, fontSize: 13, letterSpacing: '.08em' }}>
                  {i === CAREER_PROCESS.length - 1 ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
                      <path d="M4 12.5 9.5 18 20 6.5" />
                    </svg>
                  ) : step.n}
                </div>
                <div>
                  <div style={{ marginTop: 22, fontFamily: serif, fontSize: 'clamp(21px,2.4vw,27px)', color: 'var(--ink)' }}>{step.title}</div>
                  <div style={{ ...note, marginTop: 8, marginLeft: 'auto', marginRight: 'auto', maxWidth: '20em', fontSize: 16, lineHeight: 1.5 }}>{step.body}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <ClosingCTA title="Tell us what you have closed, and what you want to be closing a year from now." titleStyle={{ maxWidth: '15em' }}>
        <BookButton interest={APPLY_INTEREST} roleOptions={roleOptions} style={ctaCopper}>APPLY TO THE TEAM</BookButton>
      </ClosingCTA>

      <Footer links={FOOTER_LINKS} />
    </>
  )
}
