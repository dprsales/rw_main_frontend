import { useEffect, useMemo, useRef, useState } from 'react'
import goalsImage from '../assets/site/whiteboard-goals.png'
import luxuryImage from '../assets/site/plate-desk.png'
import mentoringImage from '../assets/site/plate-reading.png'
import monogram from '../assets/site/rw-logo-ccr.png'
import signature from '../assets/site/gold2.png'
import hydMark from '../assets/site/hyd-03.svg'
import Footer from '../components/Footer'
import Header from '../components/Header'
import Seo from '../components/Seo'
import { BookButton } from '../components/BookingModal'
import CtaButton from '../components/CtaButton'
import Reveal from '../components/Reveal'
import AchieveGrid from '../components/AchieveGrid'
import Bullet from '../components/Bullet'
import ClosingCTA from '../components/ClosingCTA'
import PullQuote from '../components/PullQuote'
import SectionHead, { CenteredHead, SectionAside } from '../components/SectionHead'
import { useSmoothScroll } from '../hooks/useSmoothScroll'
import { useLang } from '../i18n/LangProvider'
import { ACHIEVE, ASSESSMENT_AREAS, COACHING_PROGRAMS, COACHING_TESTIMONIALS, CURRICULUM } from '../data/content'
import { track } from '../data/analytics'
import { FOOTER_LINKS, mono, serif, text } from '../theme'
import { fs,
  container, ctaCopper, eyebrow,
  note, sectionRule,
} from '../styles'
import {
  ArrowRight, Award, Brain, ChevronDown, Compass, Crown, Gem, Handshake, HeartHandshake,
  BarChart3, MessagesSquare, ShieldCheck, Target, Trophy, UserRoundSearch, UsersRound,
} from 'lucide-react'

const OUTCOME_ICONS = [BarChart3, UsersRound, Trophy]

/** Covers for COACHING_PROGRAMS, matched by index. */
const PROGRAM_COVERS = [
  { src: luxuryImage },
  { src: goalsImage },
  { src: mentoringImage },
]

/** One icon per COACHING_PROGRAMS feature, matched by index (decorative only). */
const PROGRAM_ICONS = [
  [Gem, Crown, HeartHandshake, Award],
  [Brain, ShieldCheck, Handshake, Trophy],
  [UserRoundSearch, MessagesSquare, Target, Compass],
]

/**
 * A compact program card: who it's for, title, one focus line and Apply stay visible.
 * "What's included" slides up over the photo — on hover/focus with a pointer, or by
 * tapping the toggle on touch screens — so nothing is hover-only and cards never
 * change height.
 */
function ProgramCard({ program, index, labels }) {
  const [open, setOpen] = useState(false)
  const cardRef = useRef(null)
  const listId = `program-${index}-included`

  useEffect(() => {
    if (!open) return
    const onDown = (e) => { if (!cardRef.current?.contains(e.target)) setOpen(false) }
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('pointerdown', onDown)
    document.addEventListener('keydown', onKey)
    return () => { document.removeEventListener('pointerdown', onDown); document.removeEventListener('keydown', onKey) }
  }, [open])

  const onCardClick = (e) => { if (!e.target.closest('button, a')) setOpen((v) => !v) }

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions -- keyboard users get the same list via focus and the toggle
    <article ref={cardRef} className={`rw-program${open ? ' is-open' : ''}`} onClick={onCardClick}>
      <div className="rw-program-media">
        <img src={PROGRAM_COVERS[index]?.src} alt={program.alt} loading="lazy" />
        <span className="rw-program-numeral" style={{ fontFamily: serif }} aria-hidden>{program.k}</span>
        {program.features?.length > 0 && (
          <div className="rw-program-included" id={listId}>
            <div className="rw-program-included-label" style={{ fontFamily: mono }}>{labels.included}</div>
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
            {open ? labels.hide : labels.show}
            <ChevronDown size={14} strokeWidth={1.8} aria-hidden />
          </button>
        )}
        <BookButton interest="Coaching" className="rw-cta rw-program-cta" style={ctaCopper}>
         {labels.learn} <ArrowRight size={16} strokeWidth={1.8} aria-hidden />
        </BookButton>
      </div>
    </article>
  )
}

function SyllabusCloud({ categories, hint }) {
  const [active, setActive] = useState(0)
  const cat = categories[active]

  return (
    <div>
      <div className="rw-chips">
        {categories.map((c, i) => (
          <button
            key={c.n}
            type="button"
            className={`rw-chip${active === i ? ' is-on' : ''}`}
            style={{ fontFamily: mono }}
            aria-pressed={active === i}
            aria-controls="syllabus-panel"
            onMouseEnter={() => setActive(i)}
            onFocus={() => setActive(i)}
            onClick={() => setActive(i)}
          >
            {c.n} · {c.title}
          </button>
        ))}
      </div>

      <div id="syllabus-panel" className={`rw-syllabus-panel${cat ? ' is-active' : ''}`} aria-live="polite">
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
        {!cat && <div className="rw-syllabus-hint" style={{ fontFamily: mono }}>{hint}</div>}
      </div>
    </div>
  )
}

export default function Coaching() {
  const scrollToId = useSmoothScroll()
  const { t } = useLang()

  const outcomes = useMemo(() => [0, 1, 2].map((i) => ({
    Icon: OUTCOME_ICONS[i],
    lines: [t(`coach.outcome.${i}.a`), t(`coach.outcome.${i}.b`)],
  })), [t])

  const assessmentAreas = useMemo(() => ASSESSMENT_AREAS.map((area, i) => ({
    ...area,
    title: t(`coach.assess.${i}.title`),
    desc: t(`coach.assess.${i}.desc`),
  })), [t])

  const achieve = useMemo(() => ACHIEVE.map((_, i) => ({
    title: t(`coach.achieve.${i}.title`),
    body: t(`coach.achieve.${i}.body`),
  })), [t])

  const programs = useMemo(() => COACHING_PROGRAMS.map((program, i) => ({
    ...program,
    audience: t(`coach.program.${i}.audience`),
    title: t(`coach.program.${i}.title`),
    description: t(`coach.program.${i}.desc`),
    features: (program.features || []).map((_, j) => t(`coach.program.${i}.f.${j}`)),
    alt: t(`coach.program.${i}.alt`),
  })), [t])

  const curriculum = useMemo(() => CURRICULUM.map((cat, i) => ({
    ...cat,
    title: t(`coach.cur.${i}.title`),
    groups: cat.groups.map((group, gi) => ({
      label: t(`coach.cur.${i}.g.${gi}.label`),
      items: group.items.map((_, ii) => t(`coach.cur.${i}.g.${gi}.i.${ii}`)),
    })),
  })), [t])

  const testimonials = useMemo(() => COACHING_TESTIMONIALS.map((row, i) => ({
    ...row,
    text: t(`coach.test.${i}`),
  })), [t])

  const programLabels = useMemo(() => ({
    included: t('coach.programs.included'),
    hide: t('coach.programs.hide'),
    show: t('coach.programs.show'),
    learn: t('coach.programs.learn'),
  }), [t])

  return (
    <>
      <Seo route="/coaching" />
      <Header />

      <section id="top" className="rw-coaching-hero">
        <div className="rw-coaching-hero-copy rw-pad">
          <Reveal className="rw-coaching-hero-eyebrow" style={{ fontFamily: mono }}>
            <span>{t('coach.hero.eyebrow.1')}</span>
            <span className="rw-coaching-hero-arrow">→</span>
            <span>{t('coach.hero.eyebrow.2')}</span>
            <span className="rw-coaching-hero-break" aria-hidden="true" />
            <span className="rw-coaching-hero-dot" aria-hidden="true" />
            <span>{t('coach.hero.eyebrow.3')}</span>
            <span className="rw-coaching-hero-dot" aria-hidden="true" />
            <span>{t('coach.hero.eyebrow.4')}</span>
          </Reveal>

          <Reveal as="h1" delay={80} className="rw-coaching-hero-title" style={{ fontFamily: serif }}>
            <span className="rw-coaching-hero-title-gold">{t('coach.hero.title.1')}</span>
            <span className="rw-coaching-hero-title-gold">{t('coach.hero.title.2')}</span>
            <span>{t('coach.hero.title.3')}</span>
          </Reveal>

          <Reveal as="p" delay={150} className="rw-coaching-hero-lede" style={{ fontFamily: text }}>
            {t('coach.hero.lede')}
          </Reveal>

          <Reveal delay={220} className="rw-coaching-hero-outcomes">
            {outcomes.map(({ Icon, lines }) => (
              <div key={lines[0]} className="rw-coaching-hero-outcome">
                <Icon aria-hidden="true" />
                <span style={{ fontFamily: text }}>{lines[0]}<br />{lines[1]}</span>
              </div>
            ))}
          </Reveal>

          <Reveal delay={300} className="rw-coaching-hero-actions">
            <BookButton interest="Coaching" className="rw-cta rw-coaching-hero-book" style={ctaCopper}>
              {t('coach.hero.book')} <span className="rw-cta-arrow">→</span>
            </BookButton>
            <button type="button" onClick={() => scrollToId('premium-programs')} className="rw-coaching-hero-explore">
              {t('coach.hero.explore')} <span aria-hidden="true">→</span>
            </button>
            <CtaButton variant="secondary" to="/start?who=sales_pro" arrow="→">
              {t('coach.hero.fit')}
            </CtaButton>
          </Reveal>
        </div>
      </section>

      <section id="assessment" className="rw-pad" style={{ ...container, padding: 'clamp(64px, 8vw, 96px) 40px' }}>
        <div className="rw-grid-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 64, alignItems: 'center' }}>
          <Reveal>
            <div style={{ ...eyebrow, marginBottom: 18 }}>{t('coach.assess.eyebrow')}</div>
            <h2 style={{ fontFamily: serif, fontWeight: 400, fontSize: fs('clamp(28px,3.6vw,42px)'), lineHeight: 1.1, color: 'var(--ink)', maxWidth: '14em' }}>
              {t('coach.assess.title')}
            </h2>
            <p style={{ ...note, marginTop: 22, fontSize: fs('16px'), lineHeight: 1.6, maxWidth: '34em' }}>
              {t('coach.assess.lede')}
            </p>
            <div style={{ marginTop: 32 }}>
              <CtaButton to="/assessment" live onClick={() => track('assessment_page_click', { location: 'coaching-assessment-section' })}>
                {t('coach.assess.cta')} <span className="rw-cta-arrow">→</span>
              </CtaButton>
            </div>
          </Reveal>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <Reveal>
              <div style={{ ...eyebrow, marginBottom: 4 }}>{t('coach.assess.measures')}</div>
            </Reveal>
            {assessmentAreas.map((area, i) => (
              <Reveal key={area.n} delay={i * 70} style={{ display: 'flex', gap: 18, borderTop: '1px solid var(--line)', paddingTop: 12 }}>
                <span style={{ fontFamily: serif, fontSize: fs('22px'), color: 'var(--copper)', lineHeight: 1, flexShrink: 0, width: 28 }}>{area.n}</span>
                <div>
                  <div style={{ fontFamily: serif, fontSize: fs('18px'), color: 'var(--ink)', lineHeight: 1.3 }}>{area.title}</div>
                  <p style={{ ...note, marginTop: 4, fontSize: fs('14px'), lineHeight: 1.5 }}>{area.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section style={{ ...sectionRule, borderBottom: '1px solid var(--line)', background: 'var(--chip)' }}>
        <div className="rw-pad" style={{ ...container, padding: 'var(--rw-sy) 40px' }}>
          <SectionHead
            eyebrow={t('coach.achieve.eyebrow')} titleWidth="11em"
            title={t('coach.achieve.title')}
            aside={<SectionAside>{t('coach.achieve.aside')}</SectionAside>}
          />

          <AchieveGrid items={achieve} className="rw-achieve-grid" arrows numberPrefix="#" />
        </div>
      </section>

      <section id="premium-programs" className="rw-pad" style={{ ...container, padding: 'var(--rw-sy-lg) 40px' }}>
        <CenteredHead
          eyebrow={t('coach.programs.eyebrow')}
          title={<><span style={{ color: 'var(--copper)' }}>{t('coach.programs.title.a')}</span>{t('coach.programs.title.b')}</>}
          intro={t('coach.programs.intro')}
        />

        <div className="rw-grid-3 rw-programs">
          {programs.map((program, i) => (
            <Reveal key={program.title} delay={i * 90} className="rw-program-wrap">
              <ProgramCard program={program} index={i} labels={programLabels} />
            </Reveal>
          ))}
        </div>

      </section>

      <section id="curriculum" className="rw-pad" style={{ ...sectionRule, background: 'var(--chip)' }}>
        <div style={{ ...container, padding: 'var(--rw-sy-lg) 40px' }}>
          <SectionHead
            eyebrow={t('coach.syllabus.eyebrow')} titleWidth="15em"
            title={t('coach.syllabus.title')}
            aside={<SectionAside width="24em">{t('coach.syllabus.aside')}</SectionAside>}
          />

          <SyllabusCloud categories={curriculum} hint={t('coach.syllabus.hint')} />
        </div>
      </section>

      <section style={{ background: 'var(--bg)', position: 'relative', overflow: 'hidden' }}>
        <img src={hydMark} alt="" aria-hidden className="rw-watermark rw-coaching-testimonial-mark is-left" />
        <div className="rw-pad rw-coaching-testimonials" style={{ maxWidth: 1200, margin: '0 auto', padding: 'var(--rw-sy) 40px', position: 'relative', zIndex: 1 }}>
          {testimonials.map((row, i) => (
            <Reveal key={row.name} delay={i * 90} style={{ padding: '30px 0', textAlign: 'center' }}>
              <PullQuote as="p" size="clamp(16px,1.5vw,20px)" lineHeight={1.5} space={16} name={row.name}>
                “{row.text}”
              </PullQuote>
            </Reveal>
          ))}
        </div>
      </section>

      <section style={{ background: 'var(--chip)', borderTop: '1px solid var(--line)' }}>
        <div className="rw-pad" style={{ maxWidth: 900, margin: '0 auto', padding: 'var(--rw-sy) 40px', textAlign: 'center' }}>
          <Reveal>
            <PullQuote as="p" size="clamp(26px,3.6vw,44px)" lineHeight={1.2}>
              {t('coach.quote')}
            </PullQuote>
            <img
              src={signature}
              alt="Rajiv Williams"
              style={{ display: 'block', width: 'min(220px, 70%)', height: 'auto', margin: '30px auto 0' }}
            />
          </Reveal>
        </div>
      </section>

      <ClosingCTA title={t('coach.close.title')} titleStyle={{ maxWidth: '15em' }}>
        <CtaButton variant="outline" href="/form/coaching">{t('coach.close.cta')}</CtaButton>
      </ClosingCTA>

      <Footer links={FOOTER_LINKS} />
    </>
  )
}
