import { useMemo, useState } from 'react'
import skylineImage from '../assets/site/skyline.png'
import goldWatermark from '../assets/site/rw-logo-ccr.png'
import Footer from '../components/Footer'
import Header from '../components/Header'
import ImageSlot from '../components/ImageSlot'
import PageIntro from '../components/PageIntro'
import Seo from '../components/Seo'
import Reveal from '../components/Reveal'
import PullQuote from '../components/PullQuote'
import CtaButton from '../components/CtaButton'
import ClosingCTA from '../components/ClosingCTA'
import SectionHead, { CenteredHead, SectionAside } from '../components/SectionHead'
import { BookButton } from '../components/BookingModal'
import AssessmentStartModal from '../components/AssessmentStartModal'
import useCtaEntrance from '../hooks/useCtaEntrance'
import { useInView } from '../hooks/useInView'
import { useLang } from '../i18n/LangProvider'
import { FOOTER_LINKS, mono, serif } from '../theme'
import { fs,
  container, eyebrow, note, sectionHeading, sectionRule, statLabel,
} from '../styles'
import krisahHero from '../assets/site/krisah-hero.png'
import krisahHeroMobile from '../assets/site/krisah-hero-mobile.png'
import krisahInterviewVisual from '../assets/site/krisah-interview-left-visual.png'

/* Indicative sample scores — labels come from the language file. */
const SAMPLE_VALS = [84, 66, 76, 72, 60, 68]
const STEP_NS = ['01', '02', '03', '04']
const AREA_NS = ['01', '02', '03', '04', '05', '06']

export default function Assessment() {
  const { t } = useLang()
  const heroCtaRef = useCtaEntrance({ delay: 0.4 })
  const headline = useMemo(() => [
    { text: t('assess.h1.a') },
    { br: true },
    { text: t('assess.h1.b'), italic: true, copper: true },
  ], [t])
  const trust = useMemo(() => [0, 1, 2].map((i) => t(`assess.trust.${i}`)), [t])
  const steps = useMemo(() => STEP_NS.map((n, i) => ({
    n, title: t(`assess.step.${i}.title`), body: t(`assess.step.${i}.body`),
  })), [t])
  const areas = useMemo(() => AREA_NS.map((n, i) => ({
    n, title: t(`assess.area.${i}.title`), line: t(`assess.area.${i}.line`),
  })), [t])
  const bars = useMemo(() => SAMPLE_VALS.map((val, i) => ({
    label: t(`assess.bar.${i}`), val,
  })), [t])
  const [stepsRef, stepsInView] = useInView({ rootMargin: '0px 0px -18% 0px' })
  const [startFrom, setStartFrom] = useState('')

  return (
    <>
      <Seo route="/assessment" />
      <Header />

      {/* Intro */}
      <div
        className="rw-assessment-hero"
        style={{
          '--krisah-hero-desktop': `url(${krisahHero})`,
          '--krisah-hero-mobile': `url(${krisahHeroMobile})`,
        }}
      >
        <PageIntro
          eyebrow={t('assess.eyebrow')}
          headline={headline}
          lede={t('assess.lede')}
          intro={t('assess.intro')}
          cta={<>
            <CtaButton ref={heroCtaRef} live onClick={() => setStartFrom('hero')}>
              {t('assess.start')} <span className="rw-cta-arrow">→</span>
            </CtaButton>
            <CtaButton variant="outline" onClick={() => document.getElementById('how')?.scrollIntoView({ behavior: 'smooth' })}>
              {t('assess.howCta')}
            </CtaButton>
          </>}
          extra={
            <Reveal delay={120} style={{ marginTop: 48, borderTop: '1px solid var(--line)', paddingTop: 26 }}>
              <div style={{ display: 'flex', gap: 56, flexWrap: 'wrap' }}>
                <div>
                  <div style={{ fontFamily: serif, fontSize: fs('clamp(28px,3.4vw,34px)'), color: 'var(--ink)' }}>{t('assess.stat.0')}</div>
                  <div style={{ ...statLabel, marginTop: 8 }}>{t('assess.stat.0b')}</div>
                </div>
                <div>
                  <div style={{ fontFamily: serif, fontSize: fs('clamp(28px,3.4vw,34px)'), color: 'var(--ink)' }}>{t('assess.stat.1')}</div>
                  <div style={{ ...statLabel, marginTop: 8 }}>{t('assess.stat.1b')}</div>
                </div>
                <div>
                  <div style={{ fontFamily: serif, fontSize: fs('clamp(28px,3.4vw,34px)'), color: 'var(--ink)' }}>{t('assess.stat.2')}</div>
                  <div style={{ ...statLabel, marginTop: 8 }}>{t('assess.stat.2b')}</div>
                </div>
                <div>
                  <div style={{ fontFamily: serif, fontSize: fs('clamp(28px,3.4vw,34px)'), color: 'var(--ink)' }}>{t('assess.stat.3')}</div>
                  <div style={{ ...statLabel, marginTop: 8 }}>{t('assess.stat.3b')}</div>
                </div>
              </div>
              <div style={{ marginTop: 22, display: 'flex', gap: 28, flexWrap: 'wrap', fontFamily: mono, fontSize: fs('11px'), letterSpacing: '.14em', color: 'var(--faded)' }}>
                {trust.map((item) => <span key={item}>{item}</span>)}
              </div>
            </Reveal>
          }
        />
      </div>

      {/* Team statement — "we" voice, RW Team; skyline photo lifted so the gold linework reads */}
      <section style={{ ...sectionRule, borderBottom: '1px solid var(--line)', position: 'relative', overflow: 'hidden' }}>
        <img
          src={skylineImage}
          alt=""
          aria-hidden
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            objectFit: 'cover', objectPosition: 'center bottom',
            opacity: 1,
          }}
        />
        <div aria-hidden style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(11,10,9,.55) 0%, rgba(11,10,9,.22) 45%, rgba(11,10,9,.62) 100%)' }} />
        <div className="rw-pad" style={{ ...container, padding: 'clamp(64px,8vw,96px) 40px', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <Reveal style={{ ...eyebrow, marginBottom: 16 }}>{t('assess.team')}</Reveal>
          <Reveal as="p" className="rw-te-display" style={{ ...sectionHeading, fontSize: fs('clamp(26px,3.4vw,44px)'), lineHeight: 1.12 }}>
            {t('assess.stand.a')}
          </Reveal>
          <Reveal as="p" className="rw-te-display" delay={120} style={{ ...sectionHeading, fontSize: fs('clamp(26px,3.4vw,44px)'), lineHeight: 1.12, fontStyle: 'italic', color: 'var(--copper)', marginTop: 12 }}>
            {t('assess.stand.b')}
          </Reveal>
          <Reveal as="p" delay={200} style={{ ...note, marginTop: 20, marginLeft: 'auto', marginRight: 'auto', maxWidth: '32em', fontSize: fs('clamp(16px,1.7vw,18px)'), lineHeight: 1.6, color: 'var(--ink)', textShadow: '0 1px 20px rgba(11,10,9,.6), 0 0 2px rgba(11,10,9,.8)' }}>
            {t('assess.stand.body')}
          </Reveal>
        </div>
      </section>

      {/* The session + how it runs — one section keeps the page tight */}
      <section id="how" style={{ ...sectionRule, borderBottom: '1px solid var(--line)' }}>
        <div className="rw-pad" style={{ ...container, padding: 'clamp(80px,10vw,110px) 40px' }}>
          <div className="rw-grid-2 rw-assessment-session-grid">
            <Reveal delay={120} className="rw-assessment-session-content">
              <div style={{ ...eyebrow, fontSize: fs('clamp(14px,1vw,18px)'), marginBottom: 20 }}>{t('assess.session.eyebrow')}</div>
              <h2 style={{ ...sectionHeading, fontSize: fs('clamp(30px,3.4vw,52px)'), lineHeight: 1.08 }}>
                {t('assess.session.title')}
              </h2>
              <p style={{ ...note, marginTop: 24, fontSize: fs('clamp(17px,1.35vw,22px)'), lineHeight: 1.62 }}>
                {t('assess.session.p1')}
              </p>
              <p style={{ ...note, marginTop: 20, fontSize: fs('clamp(17px,1.35vw,22px)'), lineHeight: 1.62 }}>
                {t('assess.session.p2')}
              </p>
            </Reveal>
            <Reveal className="rw-figure rw-assessment-session-visual">
              <ImageSlot
                src={krisahInterviewVisual}
                fit="contain"
                alt={t('assess.session.alt')}
              />
            </Reveal>
          </div>

          {/* How it runs — the same rail as the Careers process; one track across desktop, vertical on a phone. */}
          <div style={{ marginTop: 'clamp(56px,7vw,88px)', paddingTop: 'clamp(44px,6vw,64px)', borderTop: '1px solid var(--line)' }}>
            <Reveal style={{ ...eyebrow, marginBottom: 16 }}>{t('assess.run.eyebrow')}</Reveal>
            <Reveal as="h2" delay={80} style={{ ...sectionHeading, maxWidth: '14em' }}>
              {t('assess.run.title')}
            </Reveal>

            <div ref={stepsRef} className={`rw-track${stepsInView ? ' is-in' : ''}`} style={{ marginTop: 'clamp(44px,6vw,72px)' }}>
              <div className="rw-track-steps">
                {steps.map((step, i) => (
                  <Reveal key={step.n} delay={i * 90} className="rw-track-step" style={{ textAlign: 'center' }}>
                    <div className="rw-track-node" style={{ fontFamily: mono, fontSize: fs('13px'), letterSpacing: '.08em' }}>{step.n}</div>
                    <div>
                      <div style={{ marginTop: 22, fontFamily: serif, fontSize: fs('clamp(21px,2.4vw,27px)'), color: 'var(--ink)' }}>{step.title}</div>
                      <div style={{ ...note, marginTop: 8, marginLeft: 'auto', marginRight: 'auto', maxWidth: '22em', fontSize: fs('16px'), lineHeight: 1.5 }}>{step.body}</div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What the report shows — six dimensions + a sample report card */}
      <section style={{ ...sectionRule, borderBottom: '1px solid var(--line)', background: 'var(--chip)', position: 'relative', overflow: 'hidden' }}>
        <img src={goldWatermark} alt="" aria-hidden className="rw-watermark is-left" />
        <div className="rw-pad" style={{ ...container, padding: 'clamp(80px,10vw,110px) 40px', position: 'relative' }}>
          <SectionHead
            eyebrow={t('assess.report.eyebrow')} titleWidth="12em"
            title={t('assess.report.title')}
            aside={<SectionAside>{t('assess.report.aside')}</SectionAside>}
          />

          <div className="rw-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(28px,4vw,64px)', alignItems: 'start', marginTop: 12 }}>
            <div>
              {areas.map((area, i) => (
                <Reveal key={area.n} delay={i * 50} style={{ display: 'flex', gap: 18, padding: '15px 0', borderBottom: '1px solid var(--line)' }}>
                  <div style={{ fontFamily: serif, fontSize: fs('clamp(20px,2vw,24px)'), color: 'var(--copper)', flexShrink: 0, width: '2em' }}>{area.n}</div>
                  <div>
                    <div style={{ fontFamily: serif, fontSize: fs('clamp(18px,2vw,22px)'), color: 'var(--ink)' }}>{area.title}</div>
                    <div style={{ ...note, marginTop: 4, fontSize: fs('15px'), lineHeight: 1.5 }}>{area.line}</div>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal delay={140} className="rw-figure">
              <div style={{ border: '1px solid rgba(195,155,83,.28)', background: 'var(--card)', position: 'relative' }}>
                <div aria-hidden style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'var(--gold-gradient)' }} />
                <div style={{ padding: 'clamp(22px,3vw,32px)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12 }}>
                    <div>
                      <div style={{ fontFamily: mono, fontSize: fs('10px'), letterSpacing: '.16em', color: 'var(--copper)' }}>{t('assess.sample.kicker')}</div>
                      <div style={{ fontFamily: serif, fontSize: fs('17px'), color: 'var(--ink)', marginTop: 2 }}>{t('assess.sample.title')}</div>
                    </div>
                    <div style={{ fontFamily: mono, fontSize: fs('9px'), letterSpacing: '.1em', color: 'var(--faded)' }}>{t('assess.sample.tag')}</div>
                  </div>

                  <div style={{ textAlign: 'center', margin: '20px 0 18px' }}>
                    <div style={{ fontFamily: serif, fontSize: fs('clamp(48px,6vw,64px)'), color: 'var(--copper)', lineHeight: 1 }}>71</div>
                    <div style={{ fontFamily: mono, fontSize: fs('10px'), letterSpacing: '.16em', color: 'var(--faded)', marginTop: 6 }}>{t('assess.sample.of')}</div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {bars.map((bar) => (
                      <div key={bar.label}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                          <span style={{ fontFamily: mono, fontSize: fs('10px'), letterSpacing: '.08em', color: 'var(--faded)' }}>{bar.label}</span>
                          <span style={{ fontFamily: mono, fontSize: fs('11px'), color: 'var(--copper)' }}>{bar.val}</span>
                        </div>
                        <div style={{ height: 2, background: 'var(--chip)', marginTop: 5 }}>
                          <div style={{ height: '100%', width: `${bar.val}%`, background: 'var(--gold-gradient)' }} />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div style={{ marginTop: 20, paddingTop: 14, borderTop: '1px solid var(--line)', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span aria-hidden style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--copper)', flexShrink: 0 }} />
                    <span style={{ fontFamily: mono, fontSize: fs('9px'), letterSpacing: '.06em', color: 'var(--faded)' }}>{t('assess.sample.note')}</span>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* What happens after */}
      <section className="rw-pad" style={{ ...container, ...sectionRule, padding: 'clamp(80px,10vw,110px) 40px' }}>
        <CenteredHead
          eyebrow={t('assess.after.eyebrow')}
          title={<><span style={{ color: 'var(--copper)' }}>{t('assess.after.a')}</span>{t('assess.after.b')}</>}
          intro={t('assess.after.intro')}
        />
        <Reveal delay={140} style={{ marginTop: 34, display: 'flex', gap: 22, justifyContent: 'center', flexWrap: 'wrap', alignItems: 'center' }}>
          <CtaButton variant="outline" href="/assessment/result">{t('assess.after.cta')}</CtaButton>
          <CtaButton variant="outline" href="/coaching">{t('assess.after.coaching')}</CtaButton>
        </Reveal>
      </section>

      {/* A note from the team — reassurance, placed right before the ask so the last
          thing a candidate reads before clicking through is a human voice, not FAQ copy.
          Team voice, not Rajiv alone, matching how the rest of the site frames this. */}
      <section style={{ ...sectionRule, position: 'relative', overflow: 'hidden' }}>
        <img
          src={goldWatermark}
          alt=""
          aria-hidden
          style={{
            position: 'absolute', left: '50%', top: '50%',
            width: 'clamp(260px,38vw,500px)', height: 'auto',
            transform: 'translate(-50%, -50%)', opacity: 0.055,
            pointerEvents: 'none', userSelect: 'none',
          }}
        />
        <div className="rw-pad" style={{ maxWidth: 720, margin: '0 auto', padding: 'clamp(70px,9vw,100px) 40px', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <Reveal style={{ ...eyebrow, marginBottom: 24 }}>{t('assess.note.eyebrow')}</Reveal>
          <Reveal delay={100}>
            <PullQuote size="clamp(21px,2.6vw,28px)" lineHeight={1.5}>
              {t('assess.note.quote')}
            </PullQuote>
          </Reveal>
        </div>
      </section>

      {/* Closing — the offer */}
      <ClosingCTA title={t('assess.close')} titleStyle={{ maxWidth: '15em' }}>
        <div>
          <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
            <CtaButton live onClick={() => setStartFrom('closing')}>
              {t('assess.start')} <span className="rw-cta-arrow">→</span>
            </CtaButton>
            <BookButton to="/coaching/form" interest="Coaching" specular>{t('assess.orCall')}</BookButton>
          </div>
          <p style={{ ...note, marginTop: 22, fontFamily: mono, fontSize: fs('11px'), letterSpacing: '.14em', color: 'var(--faded)' }}>
            {t('assess.fine')}
          </p>
        </div>
      </ClosingCTA>

      <Footer links={FOOTER_LINKS} />
      {startFrom && <AssessmentStartModal location={startFrom} onClose={() => setStartFrom('')} />}
    </>
  )
}
