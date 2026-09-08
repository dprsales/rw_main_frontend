import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import heroImage from '../assets/site/hero-rajiv.webp'
import backdropImage from '../assets/site/branded-backdrop.webp'
import deskImage from '../assets/site/desk-work.webp'
import portraitImage from '../assets/site/portrait-rajiv.webp'
import whiteboardImage from '../assets/site/whiteboard-session.jpg'
import hraLogo from '../assets/site/logo-hra.png'
import narLogo from '../assets/site/logo-nar.png'
import Footer from '../components/Footer'
import Gallery from '../components/Gallery'
import GlimpsesSection from '../components/GlimpsesSection'
import Seo from '../components/Seo'
import Header from '../components/Header'
import ImageSlot from '../components/ImageSlot'
import { Skeleton } from 'boneyard-js/react'
import { BookButton } from '../components/BookingModal'
import Marquee from '../components/Marquee'
import Reveal from '../components/Reveal'
import RiseText from '../components/RiseText'
import PullQuote from '../components/PullQuote'
import SectionHead, { SectionCount } from '../components/SectionHead'
import SignatureOverlay from '../components/SignatureOverlay'
import { useParallax } from '../hooks/useParallax'
import { useSmoothScroll } from '../hooks/useSmoothScroll'
import { useTilt } from '../hooks/useTilt'
import { BLOGS, HERO_COPY, HOME_TESTIMONIALS, MARQUEE_ITEMS, WAYS } from '../data/content'
import { fetchBlogs } from '../data/blogs'
import { HOME_FOOTER_LINKS, mono, serif, text } from '../theme'
import {
  body, container, ctaCopper, ctaInk, ctaInline, eyebrow,
  sectionHeading, sectionHeadingLg, sectionRule,
} from '../styles'



const HERO_LINES = [
  { text: 'The specialist who' },
  { text: 'moves markets.', italic: true, copper: true },
]

// Blog posts as Gallery cards; every fifth card runs wide. Fallback shown until the live feed loads.
const withRhythm = (posts) => posts.map((post, i) => ({ ...post, wide: i % 5 === 0 }))
const FALLBACK_BLOG_ITEMS = withRhythm(BLOGS)
const HOME_BLOG_COUNT = 5

// Loading skeleton mirroring the gallery grid, so real posts cause zero layout shift.
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

// A tilting, revealing image frame — used for editorial portraits.
function TiltFrame({ ratio = '4/5', children, style }) {
  const tilt = useTilt({ max: 5 })
  return (
    <Reveal delay={120} style={{ position: 'relative', ...style }}>
      <div
        ref={tilt.ref}
        onPointerMove={tilt.onPointerMove}
        onPointerLeave={tilt.onPointerLeave}
        className="rw-frame"
        style={{ ...tilt.style, aspectRatio: ratio, border: '1px solid var(--line)', overflow: 'hidden', background: 'var(--chip)' }}
      >
        {children}
      </div>
    </Reveal>
  )
}

// Covers for the three service cards, in WAYS order.
const WAY_COVERS = [
  { src: whiteboardImage, alt: 'Rajiv coaching at the whiteboard' },
  { src: deskImage, alt: 'Reviewing sales structures at the desk' },
  { src: backdropImage, alt: 'Rajiv beside the RW backdrop' },
]

function HeroCinematic({ onStory }) {
  const { targetRef, targetStyle, container: parallax } = useParallax()

  return (
    // Hero layout lives in global.css — two compositions (desktop overlay / phone stack).
    <section id="home" className="rw-hero">

      {/* Desktop: full-bleed banner behind copy. Phone: framed portrait above copy (global.css). */}
      <div className="rw-hero-media" {...parallax}>
        <div ref={targetRef} className="rw-hero-photo" style={targetStyle}>
          <img className="rw-hero-img" src={heroImage} alt="Rajiv Williams" />
        </div>
        {/* Protects copy over the photograph; overlay composition only. */}
        <div aria-hidden className="rw-hero-scrim" />
        {/* Soft bottom fade grounds the frame against the page. */}
        <div aria-hidden className="rw-hero-fade" />
      </div>

      <div className="rw-hero-copy">
        {/* Tight tracking here keeps "HYDERABAD" from orphaning below ~500px. */}
        <Reveal className="rw-hero-eyebrow" style={{ ...eyebrow, letterSpacing: '.3em', marginBottom: 30, color: 'var(--copper)' }}>
          RAJIV WILLIAMS · HYDERABAD REAL ESTATE
        </Reveal>

        <h1 style={{ fontFamily: serif, fontWeight: 400, fontSize: 'clamp(44px,4.8vw,92px)', lineHeight: .98, letterSpacing: '-.01em', color: '#F2EFE9' }}>
          <RiseText lines={HERO_LINES} block />
        </h1>

        <Reveal as="p" delay={140} style={{ ...body, margin: '32px 0 0', maxWidth: '34em', fontSize: 'clamp(16px,1.6vw,19px)', lineHeight: 1.6, color: 'rgba(234,241,249,.82)' }}>
          {HERO_COPY}
        </Reveal>

        <Reveal delay={240} style={{ marginTop: 36, display: 'flex', alignItems: 'center', gap: 'clamp(14px,2.4vw,24px)', flexWrap: 'wrap' }}>
          <BookButton style={ctaCopper}>BOOK A STRATEGY CALL</BookButton>
          <button type="button" onClick={onStory} className="rw-inline-cta" style={{ ...ctaInline, color: '#F2EFE9' }}>
            The story →
          </button>
        </Reveal>

        {/* Separator rules drop below the breakpoint, where the list stacks instead (.rw-hero-meta). */}
        <Reveal delay={400} className="rw-hero-meta" style={{ marginTop: 40, paddingTop: 24, borderTop: '1px solid rgba(234,241,249,.22)', display: 'flex', gap: 20, fontFamily: mono, fontSize: 11, letterSpacing: '.14em', color: 'rgba(234,241,249,.7)', flexWrap: 'wrap' }}>
          <span>TGRERA REGISTERED REALTOR</span>
          <span className="rw-hero-meta-sep" style={{ opacity: 0.5 }}>|</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 14 }}>
            MEMBER —
            <img
              src={hraLogo}
              alt="Hyderabad Realtors' Association"
              style={{ height: 26, width: 'auto', objectFit: 'contain', filter: 'brightness(0) invert(1)', opacity: 1, alignSelf: 'center' }}
            />
            <img
              src={narLogo}
              alt="National Association of Realtors"
              style={{ height: 26, width: 'auto', objectFit: 'contain', filter: 'brightness(0) invert(1)', opacity: 1, alignSelf: 'center' }}
            />
          </span>
          <span className="rw-hero-meta-sep" style={{ opacity: 0.5 }}>|</span>
        </Reveal>
      </div>
    </section>
  )
}

export default function Home() {
  const scrollToId = useSmoothScroll()
  const navigate = useNavigate()
  const goStory = () => scrollToId('about')

  // Live blog feed; falls back to the static set on failure. "Load more" grows visibleCount.
  const [allBlogs, setAllBlogs] = useState(FALLBACK_BLOG_ITEMS)
  const [visibleCount, setVisibleCount] = useState(HOME_BLOG_COUNT)
  const [loadingBlogs, setLoadingBlogs] = useState(true)
  useEffect(() => {
    let alive = true
    fetchBlogs()
      .then((cards) => {
        if (alive && cards.length) setAllBlogs(cards)
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

      <HeroCinematic onStory={goStory} />

      {/* Philosophy */}
      <section style={{ ...sectionRule, borderBottom: '1px solid var(--line)', background: 'var(--chip)' }}>
        <div className="rw-pad" style={{ maxWidth: 1000, margin: '0 auto', padding: 'clamp(80px,11vw,130px) 40px', textAlign: 'center' }}>
          <Reveal as="h2" style={{ ...sectionHeadingLg, fontSize: 'clamp(30px,4.2vw,56px)', lineHeight: 1.1 }}>
He doesn&apos;t wait for the market to move.<br />
            <span style={{ fontStyle: 'italic', color: 'var(--copper)' }}>He moves it every single day.</span>
          </Reveal>
          <Reveal as="p" delay={160} style={{ ...body, margin: '34px auto 0', fontSize: 19, lineHeight: 1.65, maxWidth: '44em' }}>
            Years spent solving the industry's toughest problems have shaped a singular mission: to define what real estate in
            Hyderabad becomes next. It's the standard he carries into every client he works with.
          </Reveal>
        </div>
      </section>

      {/* About */}
      <section id="about" className="rw-pad" style={{ ...container, padding: 'clamp(90px,11vw,130px) 40px' }}>
        <div className="rw-split" style={{ display: 'grid', gridTemplateColumns: '.44fr .56fr', gap: 60, alignItems: 'center' }}>
          <TiltFrame ratio="4/5">
            <ImageSlot src={portraitImage} alt="Rajiv Williams" placeholder="Portrait of Rajiv" caption="pics/ — office or studio" position="64% 28%" />
            <SignatureOverlay />
          </TiltFrame>
          <div>
            <Reveal style={{ ...eyebrow, letterSpacing: '.24em', marginBottom: 22 }}>ABOUT &nbsp;/&nbsp; (01)</Reveal>
            <Reveal as="h2" style={{ ...sectionHeadingLg, fontSize: 'clamp(34px,4.6vw,62px)', lineHeight: 1.02 }}>
              Practitioner first.<br />Everything else follows.
            </Reveal>
            <Reveal as="p" delay={120} style={{ ...body, marginTop: 30, maxWidth: '37em' }}>
              Fifteen years of live deals, and still counting. Everything Rajiv shares was earned in the market first. That single fact decides everything on this page.
            </Reveal>
            <Reveal as="p" delay={200} style={{ ...body, marginTop: 20, maxWidth: '37em' }}>
              In a business built on trust, Rajiv believes reputation is the only asset that compounds forever and every deal is judged against it.
            </Reveal>
          </div>
        </div>
      </section>

      {/* Three ways in */}
      <section style={sectionRule}>
        <div className="rw-pad" style={container}>
          <Reveal style={{ padding: '54px 0 4px', fontFamily: mono, fontSize: 12, letterSpacing: '.26em', color: 'var(--faded)' }}>
            THREE WAYS IN
          </Reveal>
          <div className="rw-grid-3 rw-ways" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', columnGap: 44 }}>
            {WAYS.map((way, i) => (
              <Reveal
                key={way.title}
                as="button"
                delay={i * 90}
                type="button"
                className="rw-way"
                onClick={() => navigate(way.to)}
                style={{
                  textAlign: 'left', background: 'none', border: 'none',
                  cursor: 'pointer', padding: 0, display: 'flex',
                  flexDirection: 'column', color: 'var(--ink)',
                }}
              >
                <span className="rw-way-media">
                  <img src={WAY_COVERS[i].src} alt={WAY_COVERS[i].alt} loading="lazy" />
                  <span className="rw-way-numeral" style={{ fontFamily: serif }} aria-hidden>{way.k}</span>
                </span>

                <span className="rw-way-body">
                  <span style={{ fontFamily: mono, fontSize: 11, letterSpacing: '.18em', color: 'var(--copper)' }}>{way.kicker}</span>
                  <span style={{ fontFamily: serif, fontSize: 'clamp(24px,1.9vw,29px)', lineHeight: 1.1, letterSpacing: '-.01em' }}>{way.title}</span>
                  <span style={{ fontFamily: text, fontWeight: 300, fontSize: 17, lineHeight: 1.5, color: 'var(--faded)' }}>{way.line}</span>
                  <span className="rw-way-cta" style={{ fontFamily: mono, fontSize: 12, letterSpacing: '.14em' }}>
                    {way.ctaLabel}<i className="rw-way-arrow" aria-hidden>→</i>
                  </span>
                </span>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <Marquee items={MARQUEE_ITEMS} />

      {/* Glimpses — a teaser strip that links through to the portfolio */}
      <GlimpsesSection />

      {/* Blogs: card grid links out to each post; hidden once loaded with nothing to show. */}
      {(loadingBlogs || allBlogs.length > 0) && (
      <section id="blogs" className="rw-pad" style={{ ...container, padding: 'clamp(90px,11vw,120px) 40px' }}>
        <SectionHead
          eyebrow="WRITING" faded size="lg" titleWidth="13em" space={34}
          title="Readings from a live market."
          aside={<SectionCount>CLICK ANY POST TO READ ↗</SectionCount>}
        />
        <Skeleton loading={loadingBlogs} name="blog-feed" transition={300} fallback={<BlogFeedSkeleton />}>
          <Gallery items={blogItems} />
        </Skeleton>
        {hasMoreBlogs && (
          <Reveal style={{ display: 'flex', justifyContent: 'center', marginTop: 44 }}>
            <button
              type="button"
              onClick={() => setVisibleCount((n) => n + HOME_BLOG_COUNT)}
              style={{ ...ctaInk, cursor: 'pointer' }}
            >
              Load more
              <span style={{ fontFamily: mono, fontSize: 11, letterSpacing: '.1em', opacity: 0.7, marginLeft: 10 }}>
                {blogItems.length} / {allBlogs.length}
              </span>
            </button>
          </Reveal>
        )}
      </section>
      )}

      {/* Testimonials */}
      <section id="testimonials" className="rw-pad" style={{ ...container, padding: 'clamp(90px,11vw,120px) 40px' }}>
        <Reveal style={{ borderBottom: '1px solid var(--line)', paddingBottom: 22 }}>
          <h2 style={sectionHeading}>In their words</h2>
        </Reveal>
        <div className="rw-grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', columnGap: 44 }}>
          {HOME_TESTIMONIALS.map((t, i) => (
            <Reveal key={t.name} delay={i * 90} style={{ borderTop: '1px solid var(--line)', padding: '34px 0 8px', display: 'flex', flexDirection: 'column', gap: 20 }}>
              <p style={{ fontFamily: serif, fontSize: 18, lineHeight: 1.55, color: 'var(--ink)' }}>“{t.text}”</p>
              <div style={{ fontFamily: mono, fontSize: 12, letterSpacing: '.06em', color: 'var(--copper)' }}>{t.name}</div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Quote / apply */}
      <section id="apply" style={{ ...sectionRule, background: 'var(--chip)' }}>
        <div className="rw-pad" style={{ maxWidth: 1000, margin: '0 auto', padding: 'clamp(90px,12vw,140px) 40px', textAlign: 'center' }}>
          <Reveal>
            <PullQuote
              size="clamp(28px,3.8vw,48px)" lineHeight={1.24} space={30}
              name="— RAJIV" nameStyle={{ letterSpacing: '.24em' }}
            >
              &ldquo;I never stopped selling. That is the whole method — everything I pass on was closed first, shared second.&rdquo;
            </PullQuote>
          </Reveal>
          <Reveal delay={220} style={{ marginTop: 46 }}>
            <BookButton style={ctaInk}>BOOK A STRATEGY CALL</BookButton>
          </Reveal>
        </div>
      </section>

      <Footer links={HOME_FOOTER_LINKS} />
    </>
  )
}
