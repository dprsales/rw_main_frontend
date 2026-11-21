import { useEffect, useMemo, useState } from 'react'
import careersHero from '../assets/site/careers-hero.png'
import cultureImage from '../assets/site/the-floor.png'
import Footer from '../components/Footer'
import Header from '../components/Header'
import Seo from '../components/Seo'
import { BookButton } from '../components/BookingModal'
import CtaButton from '../components/CtaButton'
import BorderGlow from '../components/BorderGlow'
import Reveal from '../components/Reveal'
import AchieveGrid from '../components/AchieveGrid'
import PageIntro from '../components/PageIntro'
import SectionHead, { CenteredHead, SectionAside } from '../components/SectionHead'
import { useSmoothScroll } from '../hooks/useSmoothScroll'
import { useLang } from '../i18n/LangProvider'
import { CAREER_CATEGORIES, CAREER_REASONS, CAREER_ROLES, activeHiringCampaigns } from '../data/content'
import { CAREERS_INTEREST } from '../data/booking'
import { CRM_PRIORITY_TITLES, careerRolePath, fetchRoles } from '../data/jobs'
import { FOOTER_LINKS, mono, serif } from '../theme'
import { fs,
  container, ctaCopper, ctaInline, eyebrow,
  note, sectionHeading, sectionRule,
} from '../styles'

// Applications go through the booking form, same as every other CTA; CAREERS_INTEREST switches it into application mode.
const APPLY_INTEREST = CAREERS_INTEREST
const CAREER_GLOW = {
  backgroundColor: 'var(--card)',
  glowColor: '41 82 71',
  colors: ['#C39B53', '#E8C97A', '#A67C3D'],
  borderRadius: 4,
  glowRadius: 24,
  fillOpacity: 0.22,
  animated: false,
}

const ALL = 'All'
const ROLES_PER_PAGE = 6

/* Seniority order: Entry → Junior → Mid → Senior → Manager → Senior Manager → Head → AGM → GM → AVP → VP → Senior VP.
   Matched on keywords, not exact strings, because levels also arrive free-text from the jobs API
   (and use both '-' and '–'). Anything unrecognised ('Open role') sorts last. */
function levelRank(level = '') {
  const l = level.toLowerCase()
  if (l.includes('senior vice president') || l === 'svp') return 14
  if (l.includes('associate vice president') || l === 'avp') return 12
  if (l.includes('vice president') || l === 'vp') return 13
  if (l.includes('assistant general manager') || l === 'agm') return 9
  if (l === 'dgm' || l.includes('deputy general')) return 10
  if (l.includes('general manager') || l === 'gm') return 11
  if (l.includes('head')) return 8
  if (l.includes('senior manager')) return 7
  if (l.includes('manager')) return 6
  if (l.includes('intern')) return 0
  if (l.includes('entry') || l.includes('trainee')) return 1
  if (l.includes('junior')) return 2
  if (l.includes('mid') && l.includes('senior')) return 4
  if (l.includes('mid')) return 3
  if (l.includes('senior')) return 5
  return 99
}
function roleOrder(role) {
  const hiring = activeHiringCampaigns().findIndex((row) => row.title === role.title)
  if (hiring !== -1) return hiring
  if (role.title === 'Social Media Intern') return 10
  const pinned = CRM_PRIORITY_TITLES.indexOf(role.title)
  if (pinned !== -1) return 20 + pinned
  return 100 + levelRank(role.level)
}

function roleEngagement(role, t) {
  if (role.category === 'Freelancer') return t('careers.role.freelance')
  const blob = `${role.type || ''} ${role.level || ''} ${role.title || ''}`.toLowerCase()
  if (blob.includes('intern')) return t('careers.role.internship')
  return t('careers.role.fulltime')
}
const bySeniority = (roles) => [...roles].sort((a, b) => roleOrder(a) - roleOrder(b))

/* One card per job: 'Sr. Sales Executive' and 'Sr Sales Executive' (or 'Senior Sales
   Executive') in the same city are the same opening, whether the repeat comes from the
   curated list or the jobs API. The first one wins; the same title in another city stays. */
const roleKey = (role) => {
  const title = (role.title || '').toLowerCase()
    .replace(/\bsr\b\.?/g, 'senior')
    .replace(/\bjr\b\.?/g, 'junior')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
  return `${title}|${(role.location || '').trim().toLowerCase()}|${(role.category || '').trim().toLowerCase()}`
}
const uniqueRoles = (roles) => {
  const seen = new Set()
  return roles.filter((role) => {
    const key = roleKey(role)
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

function RoleIcon({ type }) {
  const paths = type === 'location'
    ? <><path d="M12 21s6-5.2 6-11a6 6 0 1 0-12 0c0 5.8 6 11 6 11Z" /><circle cx="12" cy="10" r="2" /></>
    : <path d="M4 8h16v11H4zM9 8V5h6v3M4 12h16" />
  return <svg className="rw-role-meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>{paths}</svg>
}

function catLabel(t, tab) {
  if (tab === ALL) return t('careers.filter.all')
  const key = `careers.cat.${tab}`
  const next = t(key)
  return next === key ? tab : next
}

export default function Careers() {
  const { t } = useLang()
  const scrollToId = useSmoothScroll()
  const headline = useMemo(() => [
    { text: t('careers.h1.a') },
    { br: true },
    { text: t('careers.h1.b'), italic: true, copper: true },
  ], [t])
  const reasons = useMemo(() => CAREER_REASONS.map((_, i) => ({
    title: t(`careers.reason.${i}.title`),
    body: t(`careers.reason.${i}.body`),
  })), [t])
  const [filter, setFilter] = useState(ALL)
  const [visibleCount, setVisibleCount] = useState(ROLES_PER_PAGE)

  // Seeded with the curated list, replaced if the jobs endpoint answers; fetchRoles never rejects.
  const [openRoles, setOpenRoles] = useState(() => uniqueRoles(CAREER_ROLES))

  useEffect(() => {
    document.body.classList.add('rw-careers-page')
    return () => document.body.classList.remove('rw-careers-page')
  }, [])

  useEffect(() => {
    let live = true
    fetchRoles().then((rows) => { if (live) setOpenRoles(uniqueRoles(rows)) })
    return () => { live = false }
  }, [])

  // Any API category not in the curated list still needs a tab, or its roles are unreachable.
  const categories = [...new Set([...CAREER_CATEGORIES, ...openRoles.map((r) => r.category)])]

  // Only categories with an open role get a tab.
  const tabs = [ALL, ...categories.filter((c) => openRoles.some((r) => r.category === c))]
  const roles = bySeniority(filter === ALL ? openRoles : openRoles.filter((role) => role.category === filter))
  const visibleRoles = roles.slice(0, visibleCount)
  const roleOptions = openRoles.map((role) => role.title)

  return (
    <>
      <Seo route="/careers" />
      <Header />

      {/* Intro - careers-hero.png sits full-bleed behind the copy. */}
      <section style={{ position: 'relative', overflow: 'hidden' }}>
        <img
          src={careersHero}
          alt=""
          aria-hidden
          fetchPriority="high"
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            objectFit: 'cover', objectPosition: 'center 38%',
            opacity: .34,
          }}
        />
        <div aria-hidden style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(11,10,9,.80) 0%, rgba(11,10,9,.58) 42%, rgba(11,10,9,.92) 100%)' }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <PageIntro
            eyebrow={t('careers.eyebrow')}
            headline={headline}
            lede={t('careers.lede')}
            intro={t('careers.intro')}
            cta={<>
              <CtaButton to="/careers/apply">{t('careers.apply')}</CtaButton>
              <button type="button" onClick={() => scrollToId('roles')} className="rw-inline-cta" style={ctaInline}>
                {t('careers.seeRoles')}
              </button>
            </>}
          />
        </div>
      </section>

      {/* Open roles — first after hero */}
      <section id="roles" style={{ ...sectionRule, background: 'var(--chip)' }}>
        <div className="rw-pad" style={{ ...container, padding: 'var(--rw-sy-lg) 40px' }}>
          <CenteredHead
            eyebrow={t('careers.roles.eyebrow')}
            title={t('careers.roles.title')}
            intro={t('careers.roles.intro')}
          />

          {openRoles.length > 0 && (
            <Reveal delay={80} style={{ marginTop: 38, display: 'flex', justifyContent: 'center' }}>
              <div className="rw-tabs rw-desktop-career-filters" role="tablist" aria-label={t('careers.filter.aria')}>
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    role="tab"
                    aria-selected={filter === tab}
                    onClick={() => { setFilter(tab); setVisibleCount(ROLES_PER_PAGE) }}
                    className={`rw-tab${filter === tab ? ' is-on' : ''}`}
                    style={{ fontFamily: mono, fontSize: fs('12px'), letterSpacing: '.12em', textTransform: 'uppercase' }}
                  >
                    {catLabel(t, tab)}
                  </button>
                ))}
              </div>
            </Reveal>
          )}

          {openRoles.length > 0 && (
            <div className="rw-mobile-career-filters">
              <label>
                <span>{t('careers.filter.dept')}</span>
                <select value={filter} onChange={(event) => { setFilter(event.target.value); setVisibleCount(ROLES_PER_PAGE) }}>
                  {tabs.map((tab) => <option key={tab} value={tab}>{catLabel(t, tab)}</option>)}
                </select>
              </label>
            </div>
          )}

          {openRoles.length === 0 ? (
            <Reveal style={{ marginTop: 48 }}>
              <BorderGlow {...CAREER_GLOW} className="rw-empty-roles-glow">
                <div style={{ textAlign: 'center', padding: 'clamp(36px,6vw,64px)' }}>
                  <div style={{ fontFamily: serif, fontSize: fs('clamp(22px,2.6vw,28px)'), color: 'var(--ink)' }}>{t('careers.empty.title')}</div>
                  <p style={{ ...note, marginTop: 12 }}>
                    {t('careers.empty.body')}
                  </p>
                  <BookButton to="/careers/apply" interest={APPLY_INTEREST} roleOptions={roleOptions} specular style={{ marginTop: 26 }}>{t('careers.empty.cta')}</BookButton>
                </div>
              </BorderGlow>
            </Reveal>
          ) : (
            <div className="rw-careers-grid" style={{ marginTop: 42 }}>
              {visibleRoles.map((role, i) => {
                const roleId = role.id || role.title
                return (
                  <Reveal key={roleId} delay={(i % 3) * 70} className="rw-role-card">
                    <BorderGlow {...CAREER_GLOW} className="rw-role-card-glow">
                      <article className="rw-role-row">
                      <div className="rw-role-card-main">
                        <span className="rw-role-level">{role.level}</span>
                        <div className="rw-role-title">{role.title}</div>
                      </div>
                      <div className="rw-role-summary">
                        <div className="rw-role-meta">
                          <span><RoleIcon type="briefcase" /> {roleEngagement(role, t)}</span>
                          <span><RoleIcon type="location" /> {role.location || (role.category === 'Freelancer' ? t('careers.role.remote') : t('careers.role.hyd'))}</span>
                        </div>
                        <p>{role.description}</p>
                      </div>
                      <BookButton className="rw-role-apply" to={careerRolePath(role.title)} interest={APPLY_INTEREST} role={role.title} jobId={role.id} roleOptions={roleOptions} specular style={{ marginTop: 0 }}>
                        {t('careers.role.apply')} <span aria-hidden>→</span>
                      </BookButton>
                      </article>
                    </BorderGlow>
                  </Reveal>
                )
              })}
            </div>
          )}

          {roles.length > visibleCount && (
            <div className="rw-load-more-wrap">
              <button type="button" className="rw-load-more" onClick={() => setVisibleCount((count) => count + ROLES_PER_PAGE)}>
                <span>{t('careers.more')}</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                  <path d="M12 5v14M6 13l6 6 6-6" />
                </svg>
              </button>
              <span className="rw-load-more-count">{t('careers.showing', { shown: visibleRoles.length, total: roles.length })}</span>
            </div>
          )}
        </div>
      </section>

      {/* Why here — after open roles */}
      <section id="why" style={{ ...sectionRule, borderBottom: '1px solid var(--line)' }}>
        <div className="rw-pad" style={{ ...container, padding: 'var(--rw-sy) 40px' }}>
          <SectionHead
            eyebrow={t('careers.why.eyebrow')} titleWidth="11em"
            title={t('careers.why.title')}
            aside={<SectionAside>{t('careers.why.aside')}</SectionAside>}
          />

          <AchieveGrid items={reasons} className="rw-reason-grid" stagger={4} />
        </div>
      </section>

      {/* Culture band at bottom, with apply CTA (replaces old ClosingCTA) */}
      <section id="apply" style={{ position: 'relative', minHeight: 'clamp(420px,62vh,620px)', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
        <img
          src={cultureImage}
          alt={t('careers.culture.alt')}
          loading="lazy"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 35%' }}
        />
        <div aria-hidden style={{ position: 'absolute', inset: 0, background: 'linear-gradient(rgba(11,10,9,.55), rgba(11,10,9,.82))' }} />

        <div className="rw-pad" style={{ ...container, position: 'relative', zIndex: 2, padding: 'var(--rw-sy) 40px', textAlign: 'center' }}>
          <Reveal style={{ ...eyebrow, marginBottom: 16 }}>{t('careers.culture.eyebrow')}</Reveal>
          <Reveal as="h2" delay={80} style={{ ...sectionHeading, lineHeight: 1.06, maxWidth: '13em', margin: '0 auto' }}>
            {t('careers.culture.title')}
          </Reveal>
          <Reveal as="p" delay={140} style={{ ...note, marginTop: 18, marginLeft: 'auto', marginRight: 'auto', maxWidth: '38em', fontSize: fs('clamp(16px,1.7vw,19px)'), lineHeight: 1.6 }}>
            {t('careers.culture.body')}
          </Reveal>
          <Reveal delay={200} style={{ marginTop: 30, display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 16 }}>
            <CtaButton to="/careers/apply" style={ctaCopper}>{t('careers.apply')}</CtaButton>
          </Reveal>
        </div>
      </section>

      <Footer links={FOOTER_LINKS} />
    </>
  )
}
