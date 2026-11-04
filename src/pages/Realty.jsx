import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import skylineImage from '../assets/site/skyline.png'
import priyankaImage from '../assets/site/panda.png'
import priyankaSignature from '../assets/site/panda-sign.png'
import iraLogo from '../assets/site/LOGOS/ira.svg'
import landmarkLogo from '../assets/site/LOGOS/landmark.svg'
import sriAdityaLogo from '../assets/site/LOGOS/sri-aditya.svg'
import suchirindiaLogo from '../assets/site/LOGOS/suchirindia.svg'
import trilightLogo from '../assets/site/LOGOS/trilight.svg'
import vamsiramLogo from '../assets/site/LOGOS/vamsiram.svg'
import zuariLogo from '../assets/site/LOGOS/zuari.svg'
import Footer from '../components/Footer'
import Header from '../components/Header'
import LogoLoop from '../components/LogoLoop'
import Seo from '../components/Seo'
import { BookButton } from '../components/BookingModal'
import CtaButton from '../components/CtaButton'
import Reveal from '../components/Reveal'
import RiseText from '../components/RiseText'
import ClosingCTA from '../components/ClosingCTA'
import SectionHead, { SectionAside } from '../components/SectionHead'
import ApprovedListingsSection from '../listings/components/ApprovedListingsSection'
import { useInView } from '../hooks/useInView'
import { useLang } from '../i18n/LangProvider'
import { MANDATE_SCOPE } from '../data/content'
import { FOOTER_LINKS, mono, serif, text } from '../theme'
import { fs, ctaCopper,
  body, container, eyebrow, headLink,
  intro, lede, pageHeading, sectionHeading, sectionRule,
} from '../styles'

const CLIENT_MARKS = [
  { name: 'Vamsiram', src: vamsiramLogo, dark: true },
  { name: 'Zuari Infraworld', src: zuariLogo, dark: true },
  { name: 'Landmark Group', src: landmarkLogo, dark: true },
  { name: 'IRA', src: iraLogo, dark: true },
  { name: 'Suchirindia', src: suchirindiaLogo, dark: true },
  { name: 'Sri Aditya', src: sriAdityaLogo, dark: true },
  { name: 'The Trilight', src: trilightLogo, dark: true },
]

const strongInBody = { fontWeight: 500, color: 'var(--ink)' }

function SignatureReveal() {
  const [ref, inView] = useInView({ rootMargin: '0px 0px -10% 0px' })

  return (
    <span ref={ref} className={`rw-realty-signature-reveal${inView ? ' is-drawn' : ''}`}>
      <img
        className="rw-realty-signature"
        src={priyankaSignature}
        alt="Priyanka Panda"
        width="2071"
        height="759"
      />
    </span>
  )
}

export default function Realty() {
  const { t } = useLang()

  const headline = useMemo(() => [
    { text: t('realty.hero.h1.a') },
    { br: true },
    { text: t('realty.hero.h1.b'), italic: true, copper: true },
  ], [t])

  const scope = useMemo(() => MANDATE_SCOPE.map((item, i) => ({
    ...item,
    title: t(`realty.scope.${i}`),
  })), [t])

  const economics = useMemo(() => [0, 1, 2].map((i) => ({
    n: String(i + 1).padStart(2, '0'),
    title: t(`realty.econ.${i}.title`),
    body: t(`realty.econ.${i}.body`),
  })), [t])

  return (
    <>
      <Seo route="/realty" />
      <Header />

      <section id="top" className="rw-pad rw-realty-hero">
        <div className="rw-realty-hero-grid">
          <div className="rw-realty-hero-copy">
            <Reveal style={{ ...eyebrow, marginBottom: 30 }}>{t('realty.hero.eyebrow')}</Reveal>

            <h1 className="rw-realty-hero-title" style={{ ...pageHeading, fontSize: undefined, lineHeight: 1, maxWidth: '14em' }}>
              <RiseText lines={headline} step={0.12} />
            </h1>

            <Reveal as="p" delay={110} style={{ ...lede, marginTop: 24, fontStyle: 'italic' }}>
              {t('realty.hero.lede')}
            </Reveal>

            <Reveal
              as="p"
              delay={140}
              className="rw-realty-hero-description"
              style={{
                ...intro,
                marginTop: 20,
                maxWidth: '38em',
                fontSize: undefined,
              }}
            >
              {t('realty.hero.intro.1')}
              <b>{t('realty.hero.intro.2')}</b>
              {t('realty.hero.intro.3')}
              <b>{t('realty.hero.intro.4')}</b>
              {t('realty.hero.intro.5')}
              <b>{t('realty.hero.intro.6')}</b>
              {t('realty.hero.intro.7')}
              <b>{t('realty.hero.intro.8')}</b>
              {t('realty.hero.intro.9')}
            </Reveal>

            <Reveal delay={220} className="rw-realty-hero-actions">
              <BookButton
                interest="RW Realty mandate"
                className="rw-cta rw-hero-book"
                style={ctaCopper}
                eyebrow={t('realty.hero.book.eyebrow')}
                title={t('realty.hero.book.title')}
                subtitle={t('realty.hero.book.sub')}
              >
                {t('realty.hero.book')}
              </BookButton>
              <CtaButton variant="secondary" to="/start?who=developer" arrow="→">
                {t('realty.hero.fit')}
              </CtaButton>
            </Reveal>
          </div>

          <figure className="rw-realty-portrait rw-realty-portrait-frame">
            <div className="rw-realty-portrait-media">
              <img
                className="rw-realty-portrait-image"
                src={priyankaImage}
                alt="Priyanka Panda"
                width="1016"
                height="1548"
                fetchPriority="high"
              />
            </div>
            <figcaption className="rw-realty-portrait-caption">
              <SignatureReveal />
              <span className="rw-realty-portrait-role" style={{ fontFamily: mono }}>{t('realty.role')}</span>
            </figcaption>
          </figure>
        </div>
      </section>

      <section id="scope" style={{ ...sectionRule, borderBottom: '1px solid var(--line)', background: 'var(--chip)' }}>
        <div className="rw-pad" style={{ ...container, padding: 'var(--rw-sy) 40px' }}>
          <SectionHead
            eyebrow={t('realty.scope.eyebrow')} tracking=".24em" titleWidth="12em"
            title={t('realty.scope.title')}
            aside={<SectionAside>{t('realty.scope.aside')}</SectionAside>}
          />

          <div className="rw-matrix">
            {scope.map((item, i) => (
              <Reveal key={item.n} delay={(i % 4) * 80} className="rw-matrix-cell">
                <span className="rw-matrix-num" style={{ fontFamily: mono }}>{item.n}</span>
                <div className="rw-matrix-title" style={{ fontFamily: serif }}>{item.title}</div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="why" className="rw-pad rw-why-section" style={{ ...container, padding: 'var(--rw-sy-lg) 40px', position: 'relative', overflow: 'hidden' }}>
        <img src={skylineImage} alt="" aria-hidden className="rw-why-watermark" />
        <div className="rw-split" style={{ position: 'relative', zIndex: 1, display: 'grid', gridTemplateColumns: '.36fr .64fr', gap: 56 }}>
          <Reveal style={{ ...eyebrow, letterSpacing: '.24em' }}>{t('realty.why.eyebrow')}</Reveal>
          <div>
            <Reveal as="h2" style={{ ...sectionHeading, fontSize: fs('clamp(30px,3.8vw,48px)'), lineHeight: 1.06, maxWidth: '16em' }}>
              {t('realty.why.title')}
            </Reveal>
            <Reveal as="p" delay={120} style={{ ...body, marginTop: 26, maxWidth: '35em' }}>
              {t('realty.why.p1')}
            </Reveal>
            <Reveal as="p" delay={200} style={{ marginTop: 24, fontFamily: serif, fontStyle: 'italic', fontSize: fs('clamp(16px,1.7vw,18px)'), lineHeight: 1.55, color: 'var(--ink)', maxWidth: '35em' }}>
              {t('realty.why.p2')}
            </Reveal>
          </div>
        </div>
      </section>

      <section id="mandate-article" style={{ ...sectionRule, borderBottom: '1px solid var(--line)', background: 'var(--card)' }}>
        <div className="rw-pad" style={{ ...container, padding: 'var(--rw-sy-lg) 40px' }}>
          <div className="rw-split" style={{ display: 'grid', gridTemplateColumns: '.36fr .64fr', gap: 56 }}>
            <div className="rw-sticky-aside">
              <div style={{ ...eyebrow, letterSpacing: '.24em' }}>{t('realty.case.eyebrow')}</div>
              <h2 style={{ ...sectionHeading, fontSize: fs('clamp(28px,3.2vw,40px)'), lineHeight: 1.08, marginTop: 18, maxWidth: '11em' }}>
                {t('realty.case.title')}
              </h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 22, maxWidth: '42em' }}>
              <Reveal as="p" delay={100} style={body}>
                {t('realty.case.lead')}
              </Reveal>
              <Reveal delay={112} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  { l: 'A', text: t('realty.case.a') },
                  { l: 'B', text: <><b style={strongInBody}>{t('realty.case.b.1')}</b>{t('realty.case.b.2')}</> },
                  { l: 'C', text: t('realty.case.c') },
                ].map((item) => (
                  <div key={item.l} style={{ display: 'flex', gap: 14, alignItems: 'baseline' }}>
                    <span style={{ fontFamily: mono, fontSize: fs('12px'), letterSpacing: '.1em', color: 'var(--copper)', flexShrink: 0 }}>{item.l}</span>
                    <span style={body}>{item.text}</span>
                  </div>
                ))}
              </Reveal>
              <Reveal as="p" delay={130} style={body}>
                {t('realty.case.body')}
                <b style={{ ...strongInBody, textTransform: 'uppercase' }}>{t('realty.case.body.strong')}</b>
                {t('realty.case.body.2')}
                <b style={strongInBody}>{t('realty.case.body.partner')}</b>
                {t('realty.case.body.3')}
              </Reveal>
            </div>
          </div>

          <div className="rw-econ-grid rw-econ-grid--wide">
            {economics.map((item, i) => (
              <Reveal key={item.n} delay={160 + i * 60} className="rw-econ-cell">
                <span className="rw-econ-num" style={{ fontFamily: mono }}>{item.n}</span>
                <div className="rw-econ-title" style={{ fontFamily: serif }}>{item.title}</div>
                <p className="rw-econ-body" style={{ fontFamily: text }}>{item.body}</p>
              </Reveal>
            ))}
          </div>

          <div className="rw-mandate-close">
            <Reveal as="p" delay={340} style={{ ...body, color: 'var(--ink)', maxWidth: '36em' }}>
              {t('realty.case.close')}
            </Reveal>
            <Reveal delay={380}>
              <BookButton
                interest="RW Realty mandate"
                className="rw-cta rw-hero-book"
                style={ctaCopper}
                eyebrow={t('realty.hero.book.eyebrow')}
                title={t('realty.case.book.title')}
                subtitle={t('realty.case.book.sub')}
              >
                {t('realty.hero.book')}
              </BookButton>
            </Reveal>
          </div>
        </div>
      </section>

      <section id="clients" style={{ ...sectionRule, borderBottom: '1px solid var(--line)', background: 'var(--chip)' }}>
        <div className="rw-pad" style={{ ...container, padding: 'var(--rw-sy) 40px' }}>
          <SectionHead
            eyebrow={t('realty.clients.eyebrow')} faded size="sm" space={30}
            title={t('realty.clients.title')}
            aside={(
              <Link to="/realty/portfolio" className="rw-nav-link" style={headLink}>
                {t('realty.clients.portfolio')}
              </Link>
            )}
          />
          <Reveal>
            <LogoLoop
              logos={CLIENT_MARKS.map((mark) => ({ src: mark.src, alt: mark.name, scale: mark.scale, dark: mark.dark }))}
              speed={42}
              direction="left"
              gap={12}
              hoverSpeed={0}
              fadeOut
              fadeOutColor="var(--chip)"
              ariaLabel={t('realty.clients.aria')}
              className="rw-logoloop"
              renderItem={(item) => (
                <div className={`rw-loop-tile${item.dark ? ' is-dark' : ''}`}>
                  <img
                    src={item.src}
                    alt={item.alt}
                    draggable={false}
                    style={{ maxWidth: `${82 * (item.scale || 1)}%`, maxHeight: `${62 * (item.scale || 1)}%` }}
                  />
                </div>
              )}
            />
          </Reveal>
        </div>
      </section>

      <ApprovedListingsSection />

      <ClosingCTA title={t('realty.close.title')}>
        <CtaButton variant="outline" href="/form/realty">{t('realty.close.cta')}</CtaButton>
      </ClosingCTA>

      <Footer chip links={FOOTER_LINKS} />
    </>
  )
}
