import { useLocation, useSearchParams } from 'react-router-dom'
import { BookButton } from '../components/BookingModal'
import ClosingCTA from '../components/ClosingCTA'
import Footer from '../components/Footer'
import Header from '../components/Header'
import Reveal from '../components/Reveal'
import ScoreResult from '../components/ScoreResult'
import SectionHead, { CenteredHead, SectionAside } from '../components/SectionHead'
import Seo from '../components/Seo'
import CtaButton from '../components/CtaButton'
import { useSmoothScroll } from '../hooks/useSmoothScroll'
import useScoreData from '../hooks/useScoreData'
import { track } from '../data/analytics'
import {
  COACHING_MODULES,
  PRESET_MODULE_IDS,
  getCoachingScenario,
  recommendationCopy,
  recommendationFor,
  scenarioKeyFromPath,
} from '../data/coachingModules'
import { MODULE_BASE_PRICE, calculatePricing, formatINR } from '../data/pricing'
import { KRISAH_ASSESSMENT_URL } from '../data/content'
import { FOOTER_LINKS, mono, serif } from '../theme'
import { container, ctaInline, eyebrow, note, sectionHeading, sectionRule } from '../styles'
import goldWatermark from '../assets/site/gold1.png'

const chipStyle = {
  fontFamily: mono,
  fontSize: 9,
  letterSpacing: '.12em',
  color: 'var(--copper)',
  border: '1px solid rgba(195,155,83,.35)',
  borderRadius: 999,
  padding: '4px 10px',
  whiteSpace: 'nowrap',
}

const LIST_ROW_STYLE = {
  borderBottom: '1px solid var(--line)',
  padding: '22px 24px',
  display: 'flex',
  alignItems: 'center',
  gap: 20,
  flexWrap: 'wrap',
}

export default function CoachingResult() {
  const { pathname } = useLocation()
  const [searchParams] = useSearchParams()
  const scenario = getCoachingScenario(pathname)
  const scenarioKey = scenarioKeyFromPath(pathname)
  const scoreData = useScoreData()
  const scrollToId = useSmoothScroll()

  const isDefault = scenario.scoreBand === 'default-40'

  /* Score-driven recommendation: overall <= 40 → the full 16-module curriculum,
     otherwise the targeted starting points. */
  const rec = recommendationFor(scenario, scoreData)
  const isComplete = rec.type === 'complete_curriculum'

  /* ONE catalogue, shown once. Each row carries the tag that makes it clear
     whether the module is part of the recommendation — nothing is listed twice. */
  const catalogue = COACHING_MODULES.map((m) => ({
    ...m,
    tag: isComplete
      ? 'COMPLETE CURRICULUM'
      : PRESET_MODULE_IDS.includes(m.id)
        ? 'PRIORITY FOCUS'
        : null,
  }))
  const firstPriorities = scenario.developmentAreas

  /* Purchase affordances — prices always come from the shared pricing utility.
     The recommended purchase seeds the score-driven rule on the checkout page,
     and any real score params from KRISAH are forwarded so it stays consistent. */
  const recPricing = calculatePricing(rec.ids.length)
  const forwardedScore = []
  const scoreParam = searchParams.get('score')
  if (scoreParam) forwardedScore.push(`score=${encodeURIComponent(scoreParam)}`)
  const categoriesParam = searchParams.get('categories')
  if (categoriesParam) forwardedScore.push(`categories=${encodeURIComponent(categoriesParam)}`)
  const purchaseLink = `/coaching/purchase?scenario=${scenarioKey}${forwardedScore.length ? `&${forwardedScore.join('&')}` : ''}`
  const customLink = `/coaching/purchase?scenario=${scenarioKey}&mode=custom`
  const moduleLink = (id) => `/coaching/purchase?modules=${id}&scenario=${scenarioKey}`

  return (
    <>
      <Seo route="/coaching/result" />
      <Header />

      {/* Result hero — where KRISAH's back button lands */}
      <section style={{ ...sectionRule, borderBottom: '1px solid var(--line)', position: 'relative', overflow: 'hidden' }}>
        <img src={goldWatermark} alt="" aria-hidden className="rw-watermark is-right" />
        <div className="rw-pad" style={{ ...container, maxWidth: 880, padding: 'clamp(80px,10vw,110px) 40px', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <Reveal style={{ ...eyebrow, marginBottom: 20 }}>YOUR COACHING ASSESSMENT RESULT</Reveal>
          <Reveal as="h1" delay={80} style={{ ...sectionHeading, fontSize: 'clamp(32px,4.6vw,56px)', lineHeight: 1.08 }}>
            Your next level starts here.
          </Reveal>

          {/* Assessment score */}
          <Reveal delay={140} style={{ marginTop: 30 }}>
            <div style={{ display: 'inline-flex', flexDirection: 'column', gap: 6, border: '1px solid var(--line)', background: 'var(--chip)', padding: 'clamp(22px,3vw,34px) clamp(28px,4vw,44px)' }}>
              <div style={{ fontFamily: mono, fontSize: 11, letterSpacing: '.16em', color: 'var(--faded)' }}>YOUR ASSESSMENT SCORE</div>
              <div style={{ fontFamily: serif, fontSize: 'clamp(44px,6vw,68px)', color: 'var(--ink)', lineHeight: 1 }}>{scenario.scoreLabel}</div>
            </div>
          </Reveal>

          <Reveal as="p" delay={200} style={{ ...note, marginTop: 22, marginLeft: 'auto', marginRight: 'auto', maxWidth: '32em', fontSize: 'clamp(16px,1.7vw,18px)', lineHeight: 1.6 }}>
            Discover the coaching areas that can make the greatest impact on your professional growth.
          </Reveal>
          {isDefault && (
            <Reveal as="p" delay={220} style={{ ...note, marginTop: 10, marginLeft: 'auto', marginRight: 'auto', maxWidth: '32em', fontSize: 14, lineHeight: 1.6, color: 'var(--faded)' }}>
              Your assessment is still being finalised. These starting points are ready while your detailed report comes through.
            </Reveal>
          )}

          <Reveal delay={260} style={{ marginTop: 34, display: 'flex', gap: 18, flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
            <CtaButton href="#plan" live onClick={() => track('coaching_result_cta', { target: 'plan', scenario: scenario.scoreBand })}>
              {isComplete ? 'YOUR RECOMMENDED CURRICULUM →' : 'YOUR RECOMMENDED STARTING POINTS →'}
            </CtaButton>
            <CtaButton variant="outline" href="/assessment" onClick={() => track('coaching_result_cta', { target: 'view-assessment' })}>
              VIEW ASSESSMENT
            </CtaButton>
            <BookButton interest="Coaching" specular>OR BOOK A CALL</BookButton>
          </Reveal>

          <Reveal delay={320} style={{ marginTop: 26, fontFamily: mono, fontSize: 10, letterSpacing: '.14em', color: 'var(--faded)' }}>
            CONDUCTED WITH KRISAH · BY RAJIV WILLIAMS
          </Reveal>
        </div>
      </section>

      {/* Score at a glance */}
      <section style={{ ...sectionRule, borderBottom: '1px solid var(--line)', background: 'var(--chip)' }}>
        <div className="rw-pad" style={{ ...container, padding: 'clamp(56px,7vw,84px) 40px' }}>
          <SectionHead
            eyebrow="SCORE AT A GLANCE" titleWidth="16em"
            title="What your score means."
            aside={<SectionAside>The read on your result, and the plan that follows from it, in plain language.</SectionAside>}
          />
          <div style={{ marginTop: 44 }}>
            <ScoreResult scenario={scenario} scoreData={scoreData} delay={120} />
          </div>
        </div>
      </section>

      {/* Your development plan — every module appears exactly once */}
      <section id="plan" className="rw-pad" style={{ ...container, padding: 'clamp(90px,11vw,130px) 40px' }}>
        <CenteredHead
          eyebrow={isComplete ? 'YOUR RECOMMENDED CURRICULUM' : 'YOUR RECOMMENDED STARTING POINTS'}
          title={isComplete ? 'Your recommended coaching curriculum.' : 'Your Recommended Starting Points'}
          intro={recommendationCopy(rec.type)}
        />

        {/* Priority areas, shown once */}
        <div style={{ marginTop: 34, textAlign: 'center' }}>
          <div style={{ fontFamily: mono, fontSize: 10, letterSpacing: '.16em', color: 'var(--copper)' }}>
            PRIORITY AREAS TO START WITH
          </div>
          <div style={{ marginTop: 14, display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
            {firstPriorities.map((area, i) => (
              <span key={area} style={{ border: '1px solid var(--line)', background: 'var(--chip)', padding: '9px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontFamily: mono, fontSize: 10, letterSpacing: '.1em', color: 'var(--copper)' }}>{String(i + 1).padStart(2, '0')}</span>
                <span style={{ ...note, fontSize: 14, color: 'var(--ink)', lineHeight: 1.4 }}>{area}</span>
              </span>
            ))}
          </div>
        </div>

        <div style={{ marginTop: 44, border: '1px solid var(--line)', background: 'var(--card)' }}>
          {catalogue.map((module, i) => (
            <Reveal key={module.id} delay={Math.min(i, 6) * 40} style={LIST_ROW_STYLE}>
              <span style={{ fontFamily: mono, fontSize: 11, letterSpacing: '.12em', color: module.tag ? 'var(--copper)' : 'var(--faded)', width: 34, flexShrink: 0 }}>
                {module.n}
              </span>
              <div style={{ flex: 1, minWidth: 'min(420px, 70%)' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' }}>
                  <span style={{ fontFamily: serif, fontSize: 'clamp(18px,2vw,22px)', color: 'var(--ink)', lineHeight: 1.25 }}>{module.title}</span>
                  {module.tag && <span style={chipStyle}>{module.tag}</span>}
                </div>
                <p style={{ ...note, fontSize: 14, lineHeight: 1.5, marginTop: 6, maxWidth: '46em' }}>{module.focus}</p>
                <div style={{ fontFamily: mono, fontSize: 9, letterSpacing: '.12em', color: 'var(--faded)', marginTop: 8 }}>
                  {module.group.toUpperCase()} · 90&#8211;120 MIN · {formatINR(MODULE_BASE_PRICE)}
                </div>
              </div>
              <CtaButton
                variant="outline"
                href={moduleLink(module.id)}
                onClick={() => track('coaching_result_cta', { target: 'select-module', module: module.id })}
                style={{ fontSize: 11, height: 40, padding: '0 16px', flexShrink: 0 }}
              >
                SELECT MODULE →
              </CtaButton>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Buy coaching — recommended set or a custom selection, priced live */}
      <section style={{ ...sectionRule, borderBottom: '1px solid var(--line)', background: 'var(--chip)', position: 'relative', overflow: 'hidden' }}>
        <img src={goldWatermark} alt="" aria-hidden className="rw-watermark is-left" />
        <div className="rw-pad" style={{ ...container, padding: 'clamp(80px,10vw,110px) 40px', position: 'relative', zIndex: 1 }}>
          <SectionHead
            eyebrow="BUY YOUR COACHING" titleWidth="15em"
            title={<>Turn your result into <span style={{ color: 'var(--copper)' }}>a plan.</span></>}
            aside={<SectionAside>Every module is {formatINR(calculatePricing(1).payableAmount)}. Larger selections carry a built-in discount, and the price updates live as you choose.</SectionAside>}
          />

          <div style={{ marginTop: 44, border: '1px solid rgba(195,155,83,.28)', background: 'var(--card)', maxWidth: 680, position: 'relative' }}>
            <div aria-hidden style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'var(--gold-gradient)' }} />
            <div style={{ padding: 'clamp(24px,3vw,34px)' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
                <div>
                  <div style={{ fontFamily: serif, fontSize: 'clamp(20px,2.4vw,26px)', color: 'var(--ink)' }}>
                    {isComplete ? 'Buy the Complete Curriculum' : 'Buy Recommended Modules'}
                  </div>
                  <div style={{ ...note, fontSize: 14, marginTop: 6 }}>
                    {isComplete
                      ? 'The full 16-module coaching curriculum, matched to your score and priced at the full-selection discount.'
                      : 'The five coaching starting points matched to your result.'}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: serif, fontSize: 30, color: 'var(--copper)', lineHeight: 1 }}>{formatINR(recPricing.payableAmount)}</div>
                  <div style={{ fontFamily: mono, fontSize: 10, letterSpacing: '.12em', color: 'var(--faded)', marginTop: 4 }}>
                    {recPricing.discountPercent ? `SAVE ${recPricing.discountPercent}% · ` : ''}{isComplete ? 'ALL 16 MODULES' : `${rec.ids.length} MODULES`}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 14, marginTop: 24, flexWrap: 'wrap', alignItems: 'center' }}>
                <CtaButton href={purchaseLink} live onClick={() => track('coaching_result_cta', { target: 'buy-recommended', scenario: scenario.scoreBand })}>
                  {isComplete ? 'BUY COMPLETE CURRICULUM →' : 'BUY RECOMMENDED MODULES →'}
                </CtaButton>
                <CtaButton variant="outline" href={customLink}>
                  CUSTOM SELECTION →
                </CtaButton>
              </div>
              <div style={{ marginTop: 22, fontFamily: mono, fontSize: 11, letterSpacing: '.1em', color: 'var(--faded)' }}>
                1–4 MODULES · 0% OFF&nbsp;&nbsp;&nbsp;5–9 · 5%&nbsp;&nbsp;&nbsp;10–15 · 10%&nbsp;&nbsp;&nbsp;ALL 16 · 15%
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Turn your assessment into action */}
      <ClosingCTA
        chip
        title="Turn your assessment into action."
        titleStyle={{ maxWidth: '16em' }}
      >
        <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
          <CtaButton href={KRISAH_ASSESSMENT_URL} target="_blank" rel="noopener noreferrer" live onClick={() => track('krisah_assessment_start', { location: 'coaching-result-retake' })}>
            RETAKING ASSESSMENT <span className="rw-cta-arrow">→</span>
          </CtaButton>
          <BookButton interest="Coaching" specular>OR BOOK A CALL FIRST</BookButton>
          <button type="button" onClick={() => scrollToId('plan')} className="rw-inline-cta" style={ctaInline}>
            Review your plan →
          </button>
        </div>
      </ClosingCTA>

      <Footer links={FOOTER_LINKS} />
    </>
  )
}