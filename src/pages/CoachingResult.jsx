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
  recommendationFor,
  scenarioKeyFromPath,
} from '../data/coachingModules'
import { MODULE_BASE_PRICE, calculatePricing, formatINR } from '../data/pricing'
import { KRISAH_ASSESSMENT_URL } from '../data/content'
import { useLang } from '../i18n/LangProvider'
import {
  moduleFocus,
  moduleGroup,
  moduleTitle,
  recommendationCopyT,
  scenarioArea,
  scenarioBandTitle,
} from '../i18n/coachCheckout'
import { FOOTER_LINKS, mono, serif } from '../theme'
import { fs, container, ctaInline, eyebrow, note, sectionHeading, sectionRule } from '../styles'
import goldWatermark from '../assets/site/rw-logo-ccr.png'

const chipStyle = {
  fontFamily: mono,
  fontSize: fs('9px'),
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
  const { t } = useLang()
  const { pathname } = useLocation()
  const [searchParams] = useSearchParams()
  const scenario = getCoachingScenario(pathname)
  const scenarioKey = scenarioKeyFromPath(pathname)
  const scoreData = useScoreData()
  const scrollToId = useSmoothScroll()

  const isDefault = scenario.scoreBand === 'default-40'
  const bandKey = scenarioKey === 'default' || !scenarioKey ? 'default' : scenarioKey

  const rec = recommendationFor(scenario, scoreData)
  const isComplete = rec.type === 'complete_curriculum'

  const catalogue = COACHING_MODULES.map((m) => ({
    ...m,
    tag: isComplete
      ? t('cresult.tag.complete')
      : PRESET_MODULE_IDS.includes(m.id)
        ? t('cresult.tag.priority')
        : null,
  }))
  const firstPriorities = scenario.developmentAreas.map((area, i) => scenarioArea(t, bandKey, i, area))

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

      <section style={{ ...sectionRule, borderBottom: '1px solid var(--line)', position: 'relative', overflow: 'hidden' }}>
        <img src={goldWatermark} alt="" aria-hidden className="rw-watermark is-right" />
        <div className="rw-pad" style={{ ...container, maxWidth: 880, padding: 'var(--rw-sy) 40px', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <Reveal style={{ ...eyebrow, marginBottom: 20 }}>{t('cresult.eyebrow')}</Reveal>
          <Reveal as="h1" delay={80} style={{ ...sectionHeading, fontSize: fs('clamp(32px,4.6vw,56px)'), lineHeight: 1.08 }}>
            {t('cresult.h1')}
          </Reveal>

          <Reveal delay={140} style={{ marginTop: 30 }}>
            <div style={{ display: 'inline-flex', flexDirection: 'column', gap: 6, border: '1px solid var(--line)', background: 'var(--chip)', padding: 'clamp(22px,3vw,34px) clamp(28px,4vw,44px)' }}>
              <div style={{ fontFamily: mono, fontSize: fs('11px'), letterSpacing: '.16em', color: 'var(--faded)' }}>{t('cresult.scoreLabel')}</div>
              <div style={{ fontFamily: serif, fontSize: fs('clamp(44px,6vw,68px)'), color: 'var(--ink)', lineHeight: 1 }}>{scenario.scoreLabel}</div>
            </div>
          </Reveal>

          <Reveal as="p" delay={200} style={{ ...note, marginTop: 22, marginLeft: 'auto', marginRight: 'auto', maxWidth: '32em', fontSize: fs('clamp(16px,1.7vw,18px)'), lineHeight: 1.6 }}>
            {t('cresult.lede')}
          </Reveal>
          {isDefault && (
            <Reveal as="p" delay={220} style={{ ...note, marginTop: 10, marginLeft: 'auto', marginRight: 'auto', maxWidth: '32em', fontSize: fs('14px'), lineHeight: 1.6, color: 'var(--faded)' }}>
              {t('cresult.pending')}
            </Reveal>
          )}

          <Reveal delay={260} style={{ marginTop: 34, display: 'flex', gap: 18, flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
            <CtaButton href="#plan" live onClick={() => track('coaching_result_cta', { target: 'plan', scenario: scenario.scoreBand })}>
              {isComplete ? t('cresult.cta.planComplete') : t('cresult.cta.planTargeted')}
            </CtaButton>
            <CtaButton variant="outline" href="/assessment" onClick={() => track('coaching_result_cta', { target: 'view-assessment' })}>
              {t('cresult.cta.assessment')}
            </CtaButton>
            <BookButton interest="Coaching" specular>{t('cresult.cta.book')}</BookButton>
          </Reveal>

          <Reveal delay={320} style={{ marginTop: 26, fontFamily: mono, fontSize: fs('10px'), letterSpacing: '.14em', color: 'var(--faded)' }}>
            {t('cresult.krisah')}
          </Reveal>
        </div>
      </section>

      <section style={{ ...sectionRule, borderBottom: '1px solid var(--line)', background: 'var(--chip)' }}>
        <div className="rw-pad" style={{ ...container, padding: 'var(--rw-sy-sm) 40px' }}>
          <SectionHead
            eyebrow={t('cresult.glance.eyebrow')} titleWidth="16em"
            title={t('cresult.glance.title')}
            aside={<SectionAside>{t('cresult.glance.aside')}</SectionAside>}
          />
          <div style={{ marginTop: 44 }}>
            <ScoreResult
              scenario={{ ...scenario, bandTitle: scenarioBandTitle(t, bandKey, scenario.bandTitle) }}
              scoreData={scoreData}
              delay={120}
            />
          </div>
        </div>
      </section>

      <section id="plan" className="rw-pad" style={{ ...container, padding: 'var(--rw-sy-lg) 40px' }}>
        <CenteredHead
          eyebrow={isComplete ? t('cresult.plan.eyebrowComplete') : t('cresult.plan.eyebrowTargeted')}
          title={isComplete ? t('cresult.plan.titleComplete') : t('cresult.plan.titleTargeted')}
          intro={recommendationCopyT(t, rec.type)}
        />

        <div style={{ marginTop: 34, textAlign: 'center' }}>
          <div style={{ fontFamily: mono, fontSize: fs('10px'), letterSpacing: '.16em', color: 'var(--copper)' }}>
            {t('cresult.plan.priority')}
          </div>
          <div style={{ marginTop: 14, display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
            {firstPriorities.map((area, i) => (
              <span key={`${bandKey}-${i}`} style={{ border: '1px solid var(--line)', background: 'var(--chip)', padding: '9px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontFamily: mono, fontSize: fs('10px'), letterSpacing: '.1em', color: 'var(--copper)' }}>{String(i + 1).padStart(2, '0')}</span>
                <span style={{ ...note, fontSize: fs('14px'), color: 'var(--ink)', lineHeight: 1.4 }}>{area}</span>
              </span>
            ))}
          </div>
        </div>

        <div style={{ marginTop: 44, border: '1px solid var(--line)', background: 'var(--card)' }}>
          {catalogue.map((module, i) => (
            <Reveal key={module.id} delay={Math.min(i, 6) * 40} style={LIST_ROW_STYLE}>
              <span style={{ fontFamily: mono, fontSize: fs('11px'), letterSpacing: '.12em', color: module.tag ? 'var(--copper)' : 'var(--faded)', width: 34, flexShrink: 0 }}>
                {module.n}
              </span>
              <div style={{ flex: 1, minWidth: 'min(420px, 70%)' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap' }}>
                  <span style={{ fontFamily: serif, fontSize: fs('clamp(18px,2vw,22px)'), color: 'var(--ink)', lineHeight: 1.25 }}>{moduleTitle(t, module)}</span>
                  {module.tag && <span style={chipStyle}>{module.tag}</span>}
                </div>
                <p style={{ ...note, fontSize: fs('14px'), lineHeight: 1.5, marginTop: 6, maxWidth: '46em' }}>{moduleFocus(t, module)}</p>
                <div style={{ fontFamily: mono, fontSize: fs('9px'), letterSpacing: '.12em', color: 'var(--faded)', marginTop: 8 }}>
                  {t('cresult.meta', { group: moduleGroup(t, module.group), price: formatINR(MODULE_BASE_PRICE) })}
                </div>
              </div>
              <CtaButton
                variant="outline"
                href={moduleLink(module.id)}
                onClick={() => track('coaching_result_cta', { target: 'select-module', module: module.id })}
                style={{ fontSize: fs('11px'), height: 40, padding: '0 16px', flexShrink: 0 }}
              >
                {t('cresult.select')}
              </CtaButton>
            </Reveal>
          ))}
        </div>
      </section>

      <section style={{ ...sectionRule, borderBottom: '1px solid var(--line)', background: 'var(--chip)', position: 'relative', overflow: 'hidden' }}>
        <img src={goldWatermark} alt="" aria-hidden className="rw-watermark is-left" />
        <div className="rw-pad" style={{ ...container, padding: 'var(--rw-sy) 40px', position: 'relative', zIndex: 1 }}>
          <SectionHead
            eyebrow={t('cresult.buy.eyebrow')} titleWidth="15em"
            title={<>{t('cresult.buy.title.a')}<span style={{ color: 'var(--copper)' }}>{t('cresult.buy.title.b')}</span></>}
            aside={<SectionAside>{t('cresult.buy.aside', { price: formatINR(calculatePricing(1).payableAmount) })}</SectionAside>}
          />

          <div style={{ marginTop: 44, border: '1px solid rgba(195,155,83,.28)', background: 'var(--card)', maxWidth: 680, position: 'relative' }}>
            <div aria-hidden style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'var(--gold-gradient)' }} />
            <div style={{ padding: 'clamp(24px,3vw,34px)' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
                <div>
                  <div style={{ fontFamily: serif, fontSize: fs('clamp(20px,2.4vw,26px)'), color: 'var(--ink)' }}>
                    {isComplete ? t('cresult.buy.cardComplete') : t('cresult.buy.cardTargeted')}
                  </div>
                  <div style={{ ...note, fontSize: fs('14px'), marginTop: 6 }}>
                    {isComplete ? t('cresult.buy.bodyComplete') : t('cresult.buy.bodyTargeted')}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: serif, fontSize: fs('30px'), color: 'var(--copper)', lineHeight: 1 }}>{formatINR(recPricing.payableAmount)}</div>
                  <div style={{ fontFamily: mono, fontSize: fs('10px'), letterSpacing: '.12em', color: 'var(--faded)', marginTop: 4 }}>
                    {recPricing.discountPercent ? t('cresult.buy.save', { pct: recPricing.discountPercent }) : ''}
                    {isComplete ? t('cresult.buy.all16') : t('cresult.buy.nModules', { n: rec.ids.length })}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 14, marginTop: 24, flexWrap: 'wrap', alignItems: 'center' }}>
                <CtaButton href={purchaseLink} live onClick={() => track('coaching_result_cta', { target: 'buy-recommended', scenario: scenario.scoreBand })}>
                  {isComplete ? t('cresult.buy.ctaComplete') : t('cresult.buy.ctaTargeted')}
                </CtaButton>
                <CtaButton variant="outline" href={customLink}>
                  {t('cresult.buy.custom')}
                </CtaButton>
              </div>
              <div style={{ marginTop: 22, fontFamily: mono, fontSize: fs('11px'), letterSpacing: '.1em', color: 'var(--faded)' }}>
                {t('cresult.buy.tiers')}
              </div>
            </div>
          </div>
        </div>
      </section>

      <ClosingCTA
        chip
        title={t('cresult.close.title')}
        titleStyle={{ maxWidth: '16em' }}
      >
        <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
          <CtaButton href={KRISAH_ASSESSMENT_URL} target="_blank" rel="noopener noreferrer" live onClick={() => track('krisah_assessment_start', { location: 'coaching-result-retake' })}>
            {t('cresult.close.retake')} <span className="rw-cta-arrow">→</span>
          </CtaButton>
          <BookButton interest="Coaching" specular>{t('cresult.close.book')}</BookButton>
          <button type="button" onClick={() => scrollToId('plan')} className="rw-inline-cta" style={ctaInline}>
            {t('cresult.close.review')}
          </button>
        </div>
      </ClosingCTA>

      <Footer links={FOOTER_LINKS} />
    </>
  )
}
