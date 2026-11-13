import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import heroImage from '../assets/site/hero-rajiv.webp'
import heroCoaching from '../assets/site/hero-slider-coaching.png'
import heroConsulting from '../assets/site/hero-slider-consulting.jpg'
import heroRealty from '../assets/site/hero-slider-realty.jpg'
import wayCoachingPoster from '../assets/site/way-coaching.jpg'
import wayConsultingPoster from '../assets/site/way-consulting.jpg'
import wayMandatePoster from '../assets/site/way-mandate.jpg'
import hraLogo from '../assets/site/logo-hra.png'
import narLogo from '../assets/site/logo-nar.png'
import founderSignature from '../assets/site/founder-sign.png'
import Footer from '../components/Footer'
import Gallery from '../components/Gallery'
import GuidedFinder from '../components/GuidedFinder'
import GlimpsesSection from '../components/GlimpsesSection'
import Seo from '../components/Seo'
import Header from '../components/Header'
import { Skeleton } from 'boneyard-js/react'
import { BookButton } from '../components/BookingModal'
import CtaButton from '../components/CtaButton'
import LogoLoop from '../components/LogoLoop'
import Reveal from '../components/Reveal'
import FoldText from '../components/FoldText'
import StrokeText from '../components/StrokeText'
import SectionHead, { SectionAside, SectionCount } from '../components/SectionHead'
import SupportCloud from '../components/SupportCloud'
import { useParallax } from '../hooks/useParallax'
import { useInView } from '../hooks/useInView'
import { useSmoothScroll } from '../hooks/useSmoothScroll'
import { BLOGS, HOME_TESTIMONIALS, WAYS } from '../data/content'
import { LOGO_MAX_H, LOGO_MAX_W, orgLogoLoopItems } from '../data/organisations'
import { useLang } from '../i18n/LangProvider'
import { HOME_FEATURED, featureFirst, fetchBlogsOnce } from '../data/blogs'
import { HOME_FOOTER_LINKS, jost, mono, serif, text } from '../theme'
import { fs,
  body, container, ctaCopper, ctaInk, ctaInline,
  sectionHeading, sectionHeadingLg, sectionRule,
} from '../styles'



/* Blog posts as Gallery cards, each a link-out; every fifth card runs wide.
   Static set from content.js is the fallback until the live feed responds. */
const withRhythm = (posts) => posts.map((post, i) => ({ ...post, wide: i % 5 === 0 }))
const FALLBACK_BLOG_ITEMS = withRhythm(BLOGS)
const HOME_BLOG_COUNT = 5

/* Mirrors the .rw-gallery card grid so there's zero layout shift when real posts arrive. */
function BlogFeedSkeleton({ count = HOME_BLOG_COUNT }) {
  return (
    <div className="rw-gallery" aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={`rw-figure${i % 5 === 0 ? ' rw-figure-wide' : ''}`} style={{ border: '1px solid var(--line)', overflow: 'hidden' }}>
          <div className="rw-skel" style={{ aspectRatio: i % 5 === 0 ? '16/9' : '4/3' }} />
          <div style={{ padding: '18px 20px 22px', borderTop: '1px solid var(--line)' }}>
            <div className="rw-skel" style={{ height: 18, width: '85%' }} />
            <div className="rw-skel" style={{ height: 11, width: '40%', marginTop: 12 }} />
          </div>
        </div>
      ))}
    </div>
  )
}

const TESTIMONIAL_KEYS = ['home.t1', 'home.t2', 'home.t3']

function HeroTitle({ lang, t, slide }) {
  const line1 = slide ? t(`home.slide.${slide.id}.line1`) : t('home.line1')
  const line2 = slide ? t(`home.slide.${slide.id}.line2`) : t('home.line2')
  if (lang === 'te') {
    return (
      <>
        <span className="rw-hero-te-line">{line1}</span>
        <span className="rw-hero-te-line is-accent">{line2}</span>
      </>
    )
  }
  return (
    <>
      <StrokeText
        key={`${slide?.id || 'lead'}-1`}
        text={line1}
        strokeColor="#F2EFE9"
        fillColor="#F2EFE9"
        strokeWidth={1.1}
        drawDuration={1.4}
        fillDelay={0.1}
        stagger={0.02}
        trigger="mount"
        fillMode="wipe"
        fontSize={90}
        fontWeight={400}
        letterSpacing={-1}
        className="rw-hero-stroke-line"
      />
      <StrokeText
        key={`${slide?.id || 'lead'}-2`}
        text={line2}
        strokeColor="#E8C97A"
        fillColor="#C39B53"
        strokeWidth={1.1}
        drawDuration={1.4}
        fillDelay={0.1}
        stagger={0.02}
        trigger="mount"
        fillMode="wipe"
        fontSize={90}
        fontWeight={400}
        letterSpacing={-1}
        reverse
        className="stroke-text--italic rw-hero-stroke-line"
        style={{ marginTop: '.05em' }}
      />
    </>
  )
}

function WayMedia({ cover }) {
  return (
    <span className="rw-way-media">
      <img src={cover.src} alt={cover.alt} loading="lazy" decoding="async" />
    </span>
  )
}

/** Infographic covers for the three service cards, in WAYS order. */
const WAY_COVERS = [
  {
    src: wayCoachingPoster,
    alt: 'People Growth: Listen, Advise, Negotiate, Close',
  },
  {
    src: wayConsultingPoster,
    alt: 'Sales System: Audit, Design, Implement, Scale',
  },
  {
    src: wayMandatePoster,
    alt: 'End-to-End Ownership: Leads through Closure',
  },
]

/** Rajiv's gold signature at the end of the hero meta row, beside the HRA/NAR
 *  logos — reuses the exact Realty signature reveal (same "draw-on" sweep). */
function FounderSignature() {
  const [ref, inView] = useInView({ rootMargin: '0px 0px -10% 0px' })
  return (
    <div className="rw-hero-sign">
      <span ref={ref} className={`rw-realty-signature-reveal${inView ? ' is-drawn' : ''}`}>
        <img className="rw-realty-signature" src={founderSignature} alt="Rajiv Williams" />
      </span>
    </div>
  )
}

/* Service plates: coaching boardroom, consulting session, golden-hour towers. */
const HERO_SLIDES = [
  {
    id: 'lead',
    image: heroImage,
    alt: 'Rajiv Williams',
    imgClass: 'rw-hero-img--lead',
  },
  {
    id: 'coaching',
    image: heroCoaching,
    alt: 'Coach presenting a sales-progress pipeline to a luxury boardroom',
    imgClass: 'rw-hero-img--coaching',
    eyebrow: 'FOR DEVELOPERS · SALES LEADERSHIP · TOP CLOSERS',
    line1: 'Sales',
    line2: 'Coaching',
    lede: '1,200 professionals coached. Value your team as much as your customers.',
    to: '/coaching',
    cta: 'Explore Sales Coaching',
  },
  {
    id: 'consulting',
    image: heroConsulting,
    alt: 'Consultant presenting sales performance to a developer leadership pair',
    imgClass: 'rw-hero-img--bridge',
    eyebrow: 'FOR DEVELOPERS · SALES LEADERSHIP · TOP CLOSERS',
    line1: 'Sales',
    line2: 'Consulting',
    lede: '₹2,700+ Cr sold, quietly. Built for absorption, not brochures.',
    to: '/consulting',
    cta: 'Explore Sales Consulting',
  },
  {
    id: 'realty',
    image: heroRealty,
    alt: 'Young family receiving house keys from a salesperson at a luxury villa',
    imgClass: 'rw-hero-img--sky',
    eyebrow: 'END-TO-END SALES MANDATE',
    line1: 'Sales',
    line2: 'Mandates',
    lede: 'We take ownership of the sale—from strategy to closure.',
    to: '/realty',
    cta: 'Explore Sales Mandate',
  },
]

function HeroCinematic() {
  const { lang, t } = useLang()
  const { targetRef, targetStyle, container: parallax } = useParallax()
  const [active, setActive] = useState(0)
  const [reduced, setReduced] = useState(false)
  const [paused, setPaused] = useState(false)
  const touchX = useRef(null)
  const total = HERO_SLIDES.length
  const slide = HERO_SLIDES[active]
  const go = (n) => setActive((n + total) % total)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReduced(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    if (reduced || paused) return
    const timer = setInterval(() => go(active + 1), 5000)
    return () => clearInterval(timer)
  }, [active, reduced, paused])

  return (
    <section
      id="home"
      className={`rw-hero${active > 0 ? ' rw-hero--night' : ''}`}
      aria-roledescription="carousel"
      aria-label={t('home.heroAria')}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setPaused(false)
      }}
      onTouchStart={(e) => { touchX.current = e.changedTouches[0].clientX }}
      onTouchEnd={(e) => {
        const start = touchX.current
        if (start == null) return
        const dx = e.changedTouches[0].clientX - start
        if (Math.abs(dx) > 48) go(active + (dx < 0 ? 1 : -1))
        touchX.current = null
      }}
    >
      <div className="rw-hero-media" {...parallax}>
        <div ref={targetRef} className="rw-hero-photo rw-hero-photo-stack" style={targetStyle}>
          {HERO_SLIDES.map((item, i) => (
            <picture
              key={item.id}
              className={`rw-hero-img ${item.imgClass} ${i === active ? 'is-on' : ''}`}
            >
              <img
                src={item.image}
                alt={t(`home.alt.${item.id}`)}
                width={item.id === 'lead' ? 1179 : 3840}
                height={item.id === 'lead' ? 717 : 2160}
                sizes="100vw"
                loading={i === 0 ? 'eager' : 'lazy'}
                decoding={i === 0 ? 'sync' : 'async'}
                fetchPriority={i === 0 ? 'high' : 'low'}
              />
            </picture>
          ))}
        </div>
        <div aria-hidden className="rw-hero-scrim" />
        <div aria-hidden className="rw-hero-fade" />
      </div>

      <div className="rw-hero-copy">
        <div className={`rw-hero-panel ${active === 0 ? 'is-on' : ''}`}>
          <FoldText
            key={lang}
            text={t('home.eyebrow')}
            splitBy="word"
            hinge="top"
            trigger="mount"
            duration={0.6}
            stagger={0.06}
            fontSize={15}
            fontWeight={400}
            color="var(--copper)"
            className="rw-hero-eyebrow"
            style={{ fontFamily: mono, letterSpacing: '.3em', marginBottom: 30 }}
          />

          <h1 style={{ fontFamily: serif, lineHeight: .98, letterSpacing: '-.01em' }}>
            <HeroTitle lang={lang} t={t} />
          </h1>

          <p style={{ ...body, margin: '32px 0 0', maxWidth: '34em', fontSize: fs('clamp(16px,1.6vw,19px)'), lineHeight: 1.6, color: 'rgba(234,241,249,.82)' }}>
            {t('home.lede')}
          </p>

          <div className="rw-hero-actions">
            <BookButton to="/form" className="rw-cta" style={ctaCopper}>{t('mega.bookStrategy')}</BookButton>
            <Link to="/about" className="rw-inline-cta" style={{ ...ctaInline, color: '#F2EFE9' }}>
              {t('home.story')}
            </Link>
          </div>

          <div className="rw-hero-meta" style={{ marginTop: 40, paddingTop: 24, borderTop: '1px solid rgba(234,241,249,.22)', display: 'flex', alignItems: 'center', gap: 20, fontFamily: mono, fontSize: fs('11px'), letterSpacing: '.14em', color: 'rgba(234,241,249,.7)', flexWrap: 'wrap' }}>
            <span>{t('home.tgrera')}</span>
            <span className="rw-hero-meta-sep" style={{ opacity: 0.5 }}>|</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 14 }}>
              {t('home.member')}
              <img
                src={hraLogo}
                alt={t('home.alt.hra')}
                style={{ height: 26, width: 'auto', objectFit: 'contain', filter: 'brightness(0) invert(1)', opacity: 1, alignSelf: 'center' }}
              />
              <img
                src={narLogo}
                alt={t('home.alt.nar')}
                style={{ height: 26, width: 'auto', objectFit: 'contain', filter: 'brightness(0) invert(1)', opacity: 1, alignSelf: 'center' }}
              />
            </span>
            <FounderSignature />
          </div>
        </div>

        <div className={`rw-hero-panel ${active > 0 ? 'is-on' : ''}`}>
          {active > 0 && (
            <>
              <p className="rw-hero-eyebrow" style={{ fontFamily: mono, letterSpacing: '.3em', marginBottom: 30, color: 'var(--copper)' }}>
                {t(`home.slide.${slide.id}.eyebrow`)}
              </p>
              <h2 style={{ fontFamily: serif, lineHeight: .98, letterSpacing: '-.01em' }}>
                <HeroTitle lang={lang} t={t} slide={slide} />
              </h2>
              <p style={{ ...body, margin: '32px 0 0', maxWidth: '34em', fontSize: fs('clamp(16px,1.6vw,19px)'), lineHeight: 1.6, color: 'rgba(234,241,249,.82)' }}>
                {t(`home.slide.${slide.id}.lede`)}
              </p>
              <div className="rw-hero-actions">
                <BookButton
                  to={slide.id === 'coaching' ? '/coaching/form' : slide.id === 'consulting' ? '/consulting/form' : '/realty/form'}
                  className="rw-cta"
                  style={ctaCopper}
                >
                  {t(`home.slide.${slide.id}.book`)}
                </BookButton>
                <CtaButton to={slide.to} variant="secondary" arrow="→" className="rw-hero-explore">{t(`home.slide.${slide.id}.cta`)}</CtaButton>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="rw-hero-slider" role="group" aria-label={t('home.slidesAria')}>
        <button type="button" className="rw-hero-slider-btn" aria-label={t('home.prevSlide')} onClick={() => go(active - 1)}>‹</button>
        <div className="rw-hero-slider-dots">
          {HERO_SLIDES.map((item, i) => (
            <button
              key={item.id}
              type="button"
              className={`rw-hero-slider-dot${i === active ? ' is-on' : ''}`}
              aria-label={t('home.goSlide', { n: i + 1 })}
              aria-current={i === active ? 'true' : undefined}
              onClick={() => go(i)}
            />
          ))}
        </div>
        <button type="button" className="rw-hero-slider-btn" aria-label={t('home.nextSlide')} onClick={() => go(active + 1)}>›</button>
      </div>
    </section>
  )
}

export default function Home() {
  const { t } = useLang()
  const scrollToId = useSmoothScroll()
  const navigate = useNavigate()
  const location = useLocation()

  // /start sends "browse the three services" back here with a target section.
  useEffect(() => {
    const target = location.state?.scrollTo
    if (!target) return
    const id = requestAnimationFrame(() => scrollToId(target))
    return () => cancelAnimationFrame(id)
  }, [location.state, scrollToId])

  // Live blog feed: one featured post per vertical, then newest first; falls back to the static set on failure.
  // `visibleCount` grows a page at a time on "Load more".
  const [allBlogs, setAllBlogs] = useState(FALLBACK_BLOG_ITEMS)
  const [visibleCount, setVisibleCount] = useState(HOME_BLOG_COUNT)
  const [loadingBlogs, setLoadingBlogs] = useState(true)
  useEffect(() => {
    let alive = true
    fetchBlogsOnce()
      .then((cards) => {
        if (alive && cards.length) setAllBlogs(featureFirst(cards, HOME_FEATURED))
      })
      .catch(() => {})
      .finally(() => { if (alive) setLoadingBlogs(false) })
    return () => { alive = false }
  }, [])
  const blogItems = useMemo(() => withRhythm(allBlogs.slice(0, visibleCount)), [allBlogs, visibleCount])
  const hasMoreBlogs = !loadingBlogs && visibleCount < allBlogs.length

  return (
    <>
      <Seo route="/" />
      <Header />

      <HeroCinematic />


      {/* Philosophy */}
      {/* <section style={{ ...sectionRule, borderBottom: '1px solid var(--line)', background: 'var(--chip)' }}>
        <div className="rw-pad" style={{ maxWidth: 1000, margin: '0 auto', padding: 'clamp(80px,11vw,130px) 40px', textAlign: 'center' }}>
          <Reveal as="h2" style={{ ...sectionHeadingLg, fontSize: fs('clamp(30px,4.2vw,56px)'), lineHeight: 1.1 }}>
He helps developers and their sales teams<br />
            <span style={{ fontStyle: 'italic', color: 'var(--copper)' }}>sell homes in Hyderabad.</span>
          </Reveal>
          <Reveal as="p" delay={160} style={{ ...body, margin: '34px auto 0', fontSize: fs('19px'), lineHeight: 1.65, maxWidth: '44em' }}>
            That is the work. He has done it for years, and he gives each developer and each team the same attention.
          </Reveal>
        </div>
      </section> */}

      {/* Guided finder sits at the decision point: right before the three service cards it chooses between.
          The same questions also open first inside the booking modal, so every lead is qualified either way. */}
      <GuidedFinder variant="inline" location="home" className="rw-finder--home" />

      {/* Three ways in */}
      <section id="services" className="rw-ways-section" style={sectionRule}>
        <div className="rw-pad" style={container}>
          <Reveal style={{ padding: '54px 0 4px', fontFamily: mono, fontSize: fs('12px'), letterSpacing: '.26em', color: 'var(--faded)' }}>
            {t('home.ways')}
          </Reveal>
          <div className="rw-grid-3 rw-ways">
            {WAYS.map((way, i) => {
              const slideId = ['coaching', 'consulting', 'realty'][i]
              return (
                <Reveal
                  key={way.title}
                  as="button"
                  delay={i * 90}
                  type="button"
                  className="rw-way"
                  onClick={() => navigate(way.to)}
                >
                  <WayMedia
                    cover={{
                      ...WAY_COVERS[i],
                      alt: t(`home.way.alt.${i + 1}`),
                    }}
                  />
                  <span className="rw-way-body">
                    <span className="rw-way-meta">
                      <span className="rw-way-numeral" style={{ fontFamily: serif }} aria-hidden>{way.k}</span>
                      <span className="rw-way-service-name">
                        {t(`home.slide.${slideId}.line1`)} {t(`home.slide.${slideId}.line2`)}
                      </span>
                    </span>
                    <span className="rw-way-title">{t(`home.way.${i + 1}.title`)}</span>
                    <span className="rw-way-line">{t(`home.way.${i + 1}.line`)}</span>
                  </span>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>

      {/* Organisations / partners trust strip (same logos as About). */}
      <section id="organisations" className="rw-home-orgs" style={{ ...sectionRule, borderBottom: '1px solid var(--line)', background: 'var(--chip)' }}>
        <div className="rw-pad" style={{ ...container, padding: 'clamp(40px, 5vw, 64px) 40px' }}>
          <Reveal style={{ fontFamily: mono, fontSize: fs('11px'), letterSpacing: '.22em', color: 'var(--faded)', marginBottom: 14 }}>
            {t('home.orgs.eyebrow')}
          </Reveal>
          <Reveal delay={60} as="h2" style={{ ...sectionHeading, maxWidth: '16em', marginBottom: 'clamp(24px, 3vw, 36px)' }}>
            {t('home.orgs.title')}
          </Reveal>
          <Reveal delay={100}>
            <LogoLoop
              logos={orgLogoLoopItems()}
              speed={40}
              direction="left"
              gap={12}
              hoverSpeed={0}
              fadeOut
              fadeOutColor="var(--chip)"
              ariaLabel={t('home.orgs.aria')}
              className="rw-logoloop"
              renderItem={(item) => (
                <div className={`rw-loop-tile${item.dark ? ' is-dark' : ''}`}>
                  <img
                    src={item.src}
                    alt={item.alt}
                    draggable={false}
                    style={{ maxWidth: `${LOGO_MAX_W * (item.scale || 1)}%`, maxHeight: `${LOGO_MAX_H * (item.scale || 1)}%` }}
                  />
                </div>
              )}
            />
          </Reveal>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="rw-pad rw-home-voices" style={{ ...container, padding: 'clamp(40px, 5vw, 64px) 40px clamp(28px, 3vw, 40px)' }}>
        <Reveal style={{ borderBottom: '1px solid var(--line)', paddingBottom: 22 }}>
          <h2 style={sectionHeading}>{t('home.words')}</h2>
        </Reveal>
        <div className="rw-grid-3 rw-home-voices-grid">
          {HOME_TESTIMONIALS.map((item, i) => (
            <Reveal key={item.name} delay={i * 90} className="rw-home-voice">
              <p className="rw-home-voice-quote">“{t(TESTIMONIAL_KEYS[i])}”</p>
              <div className="rw-home-voice-name">{item.name}</div>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="support" className="rw-pad" style={{ ...container, padding: 'clamp(28px, 3.5vw, 44px) 40px var(--rw-sy-lg)' }}>
        <SectionHead
          eyebrow={t('home.more.eyebrow')} tracking=".24em" titleWidth="12em"
          title={t('home.more.title')}
          aside={<SectionAside width="24em">{t('home.more.aside')}</SectionAside>}
        />

        <Reveal delay={80}>
          <SupportCloud />
        </Reveal>
      </section>

      <Footer links={HOME_FOOTER_LINKS} />
    </>
  )
}
