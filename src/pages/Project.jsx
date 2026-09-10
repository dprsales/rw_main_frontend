import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import CountUp from '../components/CountUp'
import Footer from '../components/Footer'
import Gallery from '../components/Gallery'
import Header from '../components/Header'
import Reveal from '../components/Reveal'
import RiseText from '../components/RiseText'
import Seo from '../components/Seo'
import { BookButton } from '../components/BookingModal'
import { useParallax } from '../hooks/useParallax'
import { useTilt } from '../hooks/useTilt'
import { fetchProject, flattenGallery, projectImage } from '../data/projects'
import { projectSeo } from '../data/seo-config'
import { PROJECT_FOOTER_LINKS, mono, serif, text } from '../theme'
import { body, container, ctaInk, eyebrow, pageHeading, sectionRule } from '../styles'

/* ₹9,500 → "₹9,500". The API gives a plain number. */
const rupees = (n) => (typeof n === 'number' ? `₹${n.toLocaleString('en-IN')}` : n)

/* Break a sentence into `n` roughly balanced lines; the last line takes the copper accent. */
function splitLines(str, n = 3) {
  const words = String(str || '').trim().split(/\s+/).filter(Boolean)
  if (!words.length) return []
  const per = Math.ceil(words.length / n)
  const lines = []
  for (let i = 0; i < words.length; i += per) lines.push(words.slice(i, i + per).join(' '))
  return lines.map((textLine, i) => ({
    text: i === lines.length - 1 ? textLine : textLine + ' ',
    italic: i === lines.length - 1,
    copper: i === lines.length - 1,
  }))
}

/* Parse an API stat string into an animatable value; only clean integers count up. */
function StatValue({ raw }) {
  const m = String(raw ?? '').match(/^(\D*)([\d,]+(?:\.\d+)?)(.*)$/)
  const style = { fontFamily: serif, fontSize: 'clamp(30px,4.2vw,58px)', lineHeight: .95, letterSpacing: '-.02em', color: 'var(--copper)' }
  if (m) {
    const prefix = m[1] || ''
    const numStr = m[2]
    const suffix = m[3] || ''
    const isInteger = !numStr.includes('.')
    if (isInteger) {
      const to = parseInt(numStr.replace(/,/g, ''), 10)
      return <div style={style}><CountUp to={to} prefix={prefix} suffix={suffix} duration={1800} /></div>
    }
  }
  return <div style={style}>{raw}</div>
}

/** A titled section wrapper - eyebrow, big heading, then children. */
function Section({ id, eyebrow: kicker, title, intro, chip = false, bleed = false, children }) {
  // API heading fields vary from a tight headline to a full paragraph; long titles drop to prose scale.
  const isParagraph = typeof title === 'string' && title.trim().length > 72
  const titleStyle = isParagraph
    ? { fontFamily: serif, fontWeight: 400, fontSize: 'clamp(21px,2.3vw,30px)', letterSpacing: '-.01em', lineHeight: 1.32, color: 'var(--ink)', maxWidth: '32em' }
    : { fontFamily: serif, fontWeight: 400, fontSize: 'clamp(30px,3.4vw,46px)', letterSpacing: '-.015em', lineHeight: 1.08, color: 'var(--ink)', maxWidth: '15em' }
  return (
    <section id={id} style={{ ...sectionRule, ...(chip ? { background: 'var(--chip)' } : {}) }}>
      <div className="rw-pad" style={{ ...container, padding: 'clamp(80px,11vw,140px) 40px' }}>
        {(kicker || title) && (
          <Reveal style={{ marginBottom: 'clamp(36px,5vw,64px)' }}>
            {kicker && <div style={{ ...eyebrow, marginBottom: 18 }}>{kicker}</div>}
            {title && (
              // maxWidth in `em` scales with the heading's own font, not the base 16px.
              <h2 style={titleStyle}>
                {title}
              </h2>
            )}
            {intro && <p style={{ ...body, marginTop: 24, maxWidth: '38em' }}>{intro}</p>}
          </Reveal>
        )}
        {bleed ? <div className="rw-bleed">{children}</div> : children}
      </div>
    </section>
  )
}

function ProjectHero({ hero, details, name }) {
  const { targetRef, targetStyle, container: parallax } = useParallax({ strength: 22 })
  const bg = projectImage(hero?.backgroundimage) || projectImage(hero?.projectimage)
  const logo = projectImage(hero?.projectlogo)
  const bhk = details?.bhk?.length ? `${details.bhk.join(', ')} BHK` : null
  const sqft = details?.sqft?.length ? `${details.sqft.join(' – ')} sq.ft.` : null
  const lines = splitLines(hero?.h1, 3)

  const facts = [
    ['CONFIGURATION', bhk],
    ['SIZES', sqft],
    ['PRICE', details?.sftPrice ? `${rupees(details.sftPrice)}/sq.ft.` : null],
    ['UNITS', details?.units],
    ['TOWERS', details?.towers],
  ].filter(([, v]) => v)

  return (
    <section className="rw-projx-hero" {...parallax}>
      {bg && (
        <div aria-hidden className="rw-projx-kb">
          <div ref={targetRef} style={{ ...targetStyle, width: '100%', height: '100%' }}>
            <img src={bg} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(11,10,9,.55) 0%, rgba(11,10,9,.28) 34%, rgba(11,10,9,.72) 78%, rgba(11,10,9,.96) 100%)' }} />
        </div>
      )}

      {/* Not scroll-gated: a 100svh hero can push facts/CTA past the reveal-trigger line,
          leaving them invisible on load; instead it fades up via .rw-projx-in. */}
      <div className="rw-pad rw-projx-content" style={{ position: 'relative', zIndex: 1, ...container, width: '100%', padding: 'clamp(96px,12vw,132px) 40px clamp(56px,6vw,76px)' }}>
        <Link to="/realty" className="rw-nav-link rw-projx-in" style={{ fontFamily: mono, fontSize: 11, letterSpacing: '.16em', color: 'rgba(234,241,249,.72)' }}>
          ← RW REALTY
        </Link>

        {(hero?.loc || details?.location) && (
          <div className="rw-projx-in" style={{ ...eyebrow, letterSpacing: '.28em', marginTop: 22, color: 'var(--copper)', animationDelay: '.08s' }}>
            {(hero?.loc || details?.location).trim()}{details?.propertyType ? ` · ${details.propertyType}` : ''}
          </div>
        )}

        {logo
          ? <div className="rw-projx-in" style={{ marginTop: 20, animationDelay: '.14s' }}><img src={logo} alt={name} style={{ height: 'clamp(52px,7vw,96px)', width: 'auto', maxWidth: 'min(84%, 420px)', objectFit: 'contain' }} /></div>
          : <h1 style={{ marginTop: 16, fontFamily: serif, fontWeight: 400, fontSize: 'clamp(48px,9vw,120px)', lineHeight: .92, letterSpacing: '-.02em', color: '#F2EFE9' }}>{name}</h1>}

        {lines.length > 0 && (
          <h2 style={{ marginTop: 'clamp(16px,2.2vw,28px)', fontFamily: serif, fontWeight: 400, fontSize: 'clamp(28px,4.4vw,58px)', lineHeight: 1.03, letterSpacing: '-.02em', color: '#F2EFE9', maxWidth: '16em' }}>
            <RiseText lines={lines} block baseDelay={0.2} step={0.12} />
          </h2>
        )}

        {facts.length > 0 && (
          <div className="rw-projx-in" style={{ marginTop: 'clamp(30px,3.6vw,44px)', paddingTop: 26, borderTop: '1px solid rgba(234,241,249,.22)', display: 'flex', gap: 'clamp(22px,4vw,52px)', flexWrap: 'wrap', animationDelay: '.5s' }}>
            {facts.map(([label, value]) => (
              <div key={label}>
                <div style={{ fontFamily: serif, fontSize: 'clamp(18px,2.1vw,26px)', color: '#F2EFE9', lineHeight: 1.05 }}>{value}</div>
                <div style={{ ...eyebrow, fontSize: 10, letterSpacing: '.16em', color: 'rgba(234,241,249,.58)', marginTop: 8 }}>{label}</div>
              </div>
            ))}
          </div>
        )}

        <div className="rw-projx-in" style={{ marginTop: 'clamp(26px,3vw,38px)', display: 'flex', gap: 18, alignItems: 'center', flexWrap: 'wrap', animationDelay: '.6s' }}>
          <BookButton interest="RW Realty mandate" specular>ENQUIRE ABOUT {(name || 'THIS PROJECT').toUpperCase()}</BookButton>
          {hero?.rera && <span style={{ fontFamily: mono, fontSize: 11, letterSpacing: '.12em', color: 'rgba(234,241,249,.6)' }}>RERA {hero.rera}</span>}
        </div>
      </div>

      <div aria-hidden className="rw-projx-cue" style={{ position: 'absolute', left: '50%', bottom: 22, transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, color: 'rgba(234,241,249,.7)', zIndex: 1 }}>
        <span style={{ fontFamily: mono, fontSize: 9, letterSpacing: '.22em' }}>SCROLL</span>
        <span style={{ width: 1, height: 30, background: 'linear-gradient(rgba(234,241,249,.7), transparent)' }} />
      </div>
    </section>
  )
}

/** Large tilting feature image. */
function FeatureImage({ src, alt, ratio = '4/5' }) {
  const tilt = useTilt({ max: 4 })
  return (
    <Reveal delay={120} className="rw-frame" style={{ position: 'relative' }}>
      <div ref={tilt.ref} onPointerMove={tilt.onPointerMove} onPointerLeave={tilt.onPointerLeave} style={{ ...tilt.style, aspectRatio: ratio, border: '1px solid var(--line)', overflow: 'hidden', background: 'var(--chip)' }}>
        <img src={src} alt={alt} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
      </div>
    </Reveal>
  )
}

export default function Project() {
  const { slug } = useParams()
  const [data, setData] = useState(null)
  const [state, setState] = useState('loading') // loading | ready | error

  useEffect(() => {
    let alive = true
    setState('loading')
    setData(null)
    fetchProject(slug)
      .then((json) => { if (alive) { setData(json); setState('ready') } })
      .catch(() => { if (alive) setState('error') })
    return () => { alive = false }
  }, [slug])

  const name = data?.projectdetails?.title?.trim() || data?.herosection?.h1 || 'Project'
  const area = data?.herosection?.loc || data?.projectdetails?.location
  const summary = data?.aboutsection?.des || data?.projectdetails?.description

  return (
    <>
      {data ? <Seo {...projectSeo({ title: name, area })} description={summary || undefined} /> : null}
      <Header />

      {state === 'loading' && (
        <div className="rw-pad" style={{ ...container, minHeight: '80vh', display: 'grid', placeItems: 'center', padding: '120px 40px' }}>
          <div style={{ ...eyebrow, color: 'var(--faded)' }}>LOADING PROJECT…</div>
        </div>
      )}

      {state === 'error' && (
        <div className="rw-pad" style={{ ...container, minHeight: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', gap: 22, padding: '120px 40px' }}>
          <div style={{ ...eyebrow }}>PROJECT UNAVAILABLE</div>
          <h1 style={{ ...pageHeading, fontSize: 'clamp(34px,5vw,64px)', letterSpacing: '-.02em', maxWidth: '13em' }}>
            We couldn’t load this project right now.
          </h1>
          <p style={{ ...body, maxWidth: '32em' }}>The listing may have moved, or the connection dropped. Explore the full portfolio, or reach out and we’ll send the details directly.</p>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginTop: 8 }}>
            <Link to="/realty/portfolio" style={ctaInk}>View the portfolio</Link>
            <BookButton interest="RW Realty mandate" specular>Request details</BookButton>
          </div>
        </div>
      )}

      {state === 'ready' && data && <ProjectBody data={data} name={name} />}

      <Footer chip links={PROJECT_FOOTER_LINKS} />
    </>
  )
}

function ProjectBody({ data, name }) {
  const { projectdetails: details, herosection: hero, aboutsection: about, gallerysection: gallery, layout, floorplans, amenities, connectedliving: connect } = data

  const aboutImages = (about?.images || []).map((x) => projectImage(x.img)).filter(Boolean)
  const aboutStats = about?.highlights || []
  const interior = flattenGallery(gallery?.interior).map(projectImage).filter(Boolean)
  const exterior = flattenGallery(gallery?.exterior).map(projectImage).filter(Boolean)
  const galleryItems = [
    ...exterior.map((src, i) => ({ src, title: `Exterior ${String(i + 1).padStart(2, '0')}`, wide: i % 5 === 0 })),
    ...interior.map((src, i) => ({ src, title: `Interior ${String(i + 1).padStart(2, '0')}` })),
  ]
  const layoutImg = projectImage(layout?.img)
  const amenityItems = amenities?.data || []
  const connectImg = projectImage(connect?.locationimage)
  const connectGroups = connect?.data || []
  const floorplanUnits = floorplans?.data || []
  const closingImg = exterior[0] || projectImage(hero?.projectimage) || projectImage(hero?.backgroundimage)

  return (
    <>
      <ProjectHero hero={hero} details={details} name={name} />

      {/* About + oversized stat band */}
      {(about?.des || details?.description || aboutStats.length > 0) && (
        <Section id="about" eyebrow="THE RESIDENCE" title={`About ${name}.`}>
          <div className="rw-split" style={{ display: 'grid', gridTemplateColumns: aboutImages.length ? '1.05fr .95fr' : '1fr', gap: 'clamp(36px,6vw,80px)', alignItems: 'center' }}>
            <Reveal as="p" style={{ fontFamily: serif, fontWeight: 400, fontSize: 'clamp(21px,2.6vw,34px)', lineHeight: 1.34, letterSpacing: '-.01em', color: 'var(--ink)', maxWidth: '18em' }}>
              {about?.des || details?.description}
            </Reveal>
            {aboutImages[0] && <FeatureImage src={aboutImages[0]} alt={name} ratio="4/5" />}
          </div>

          {aboutStats.length > 0 && (
            <div className="rw-projx-stats" style={{ marginTop: 'clamp(48px,6vw,80px)' }}>
              {aboutStats.map((s, i) => (
                <Reveal key={i} delay={(i % 4) * 100} className="rw-projx-stat">
                  <StatValue raw={s.h1} />
                  <div style={{ ...eyebrow, fontSize: 10, color: 'var(--faded)', marginTop: 16 }}>{s.d1}</div>
                </Reveal>
              ))}
            </div>
          )}

          {aboutImages.length > 1 && (
            <div className="rw-proj-about-imgs" style={{ marginTop: 'clamp(36px,4.4vw,56px)', display: 'grid', gridTemplateColumns: `repeat(${Math.min(aboutImages.length - 1, 3)}, 1fr)`, gap: 'clamp(12px,1.6vw,20px)' }}>
              {aboutImages.slice(1).map((src, i) => (
                <Reveal key={src} delay={(i % 3) * 90} className="rw-figure" style={{ aspectRatio: '3/4', border: '1px solid var(--line)', overflow: 'hidden' }}>
                  <img src={src} alt="" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                </Reveal>
              ))}
            </div>
          )}
        </Section>
      )}

      {/* Design / layout */}
      {(layout?.highlights?.length || layoutImg) && (
        <Section id="layout" chip eyebrow="THE DESIGN" title={layout?.d1}>
          <div className="rw-split" style={{ display: 'grid', gridTemplateColumns: layoutImg ? '.5fr .5fr' : '1fr', gap: 'clamp(36px,6vw,72px)', alignItems: 'center' }}>
            {layoutImg && (
              <Reveal className="rw-frame" style={{ border: '1px solid var(--line)', overflow: 'hidden', background: 'var(--bg)' }}>
                <img src={layoutImg} alt={`${name} master layout`} loading="lazy" style={{ width: '100%', height: 'auto', display: 'block' }} />
              </Reveal>
            )}
            <div>
              {(layout?.highlights || []).map((h, i) => (
                <Reveal key={i} delay={(i % 8) * 60} style={{ display: 'flex', gap: 20, padding: 'clamp(16px,1.8vw,22px) 0', borderTop: '1px solid var(--line)' }}>
                  <span style={{ fontFamily: serif, fontStyle: 'italic', fontSize: 'clamp(20px,2vw,26px)', color: 'var(--copper)', flexShrink: 0, lineHeight: 1 }}>{String(i + 1).padStart(2, '0')}</span>
                  <span style={{ fontFamily: text, fontWeight: 300, fontSize: 'clamp(15px,1.6vw,18px)', lineHeight: 1.5, color: 'var(--ink)' }}>{h}</span>
                </Reveal>
              ))}
            </div>
          </div>
        </Section>
      )}

      {/* Gallery - full-bleed */}
      {galleryItems.length > 0 && (
        <Section id="gallery" eyebrow="GALLERY" title="Inside &amp; out.">
          <Gallery items={galleryItems} />
        </Section>
      )}

      {/* Floor plans */}
      {floorplanUnits.length > 0 && (
        <Section id="floorplans" chip eyebrow="FLOOR PLANS" title="Unit plans &amp; configurations.">
          <div className="rw-proj-floorplans" style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(floorplanUnits.length, 3)}, 1fr)`, gap: 'clamp(18px,2.4vw,30px)' }}>
            {floorplanUnits.map((u, i) => {
              const img = projectImage(u.floorplanimage)
              return (
                <Reveal key={u.gid || i} delay={(i % 3) * 100} className="rw-figure" style={{ border: '1px solid var(--line)', background: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>
                  {img && (
                    <div style={{ aspectRatio: '1/1', overflow: 'hidden', background: '#fff' }}>
                      <img src={img} alt={`Unit ${u.gid} floor plan`} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }} />
                    </div>
                  )}
                  <div style={{ padding: 'clamp(20px,2.2vw,28px)', borderTop: '1px solid var(--line)', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 16 }}>
                    <div>
                      <div style={{ fontFamily: serif, fontSize: 'clamp(22px,2.2vw,28px)', color: 'var(--ink)' }}>{u.bhk} BHK</div>
                      {u.facing && <div style={{ ...eyebrow, fontSize: 13, letterSpacing: '.1em', color: 'var(--faded)', marginTop: 10 }}>{String(u.facing).toUpperCase()} FACING</div>}
                    </div>
                    {u.sft && <div style={{ fontFamily: mono, fontSize: 13, letterSpacing: '.06em', color: 'var(--copper)' }}>{u.sft} sq.ft.</div>}
                  </div>
                </Reveal>
              )
            })}
          </div>
        </Section>
      )}

      {/* Amenities */}
      {amenityItems.length > 0 && (
        <Section id="amenities" eyebrow="AMENITIES" title="Life above the city." intro={amenities?.d1}>
          <div className="rw-proj-amenities" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 'clamp(12px,1.4vw,18px)' }}>
            {amenityItems.map((a, i) => {
              const logo = projectImage(a.logo)
              return (
                <Reveal key={i} delay={(i % 6) * 60} className="rw-projx-amenity" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 16, padding: 'clamp(28px,3vw,40px) 16px', border: '1px solid var(--line)', background: 'var(--card)' }}>
                  {logo && (
                    <div style={{ width: 46, height: 46, display: 'grid', placeItems: 'center' }}>
                      <img className="rw-projx-amenity-icon" src={logo} alt="" loading="lazy" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', filter: 'var(--logo-filter)', transition: 'filter .4s ease' }} />
                    </div>
                  )}
                  <span className="rw-projx-amenity-label" style={{ fontFamily: mono, fontSize: 11, letterSpacing: '.12em', color: 'var(--ink)', lineHeight: 1.4, transition: 'color .4s ease' }}>{(a.h1 || '').trim()}</span>
                </Reveal>
              )
            })}
          </div>
        </Section>
      )}

      {/* Connected living */}
      {(connectGroups.length > 0 || connectImg) && (
        <Section id="connectivity" chip eyebrow="CONNECTED LIVING" title="Everything, minutes away.">
          <div className="rw-split" style={{ display: 'grid', gridTemplateColumns: connectImg ? '.5fr .5fr' : '1fr', gap: 'clamp(36px,6vw,72px)', alignItems: 'start' }}>
            {connectImg && (
              <Reveal className="rw-frame" style={{ border: '1px solid var(--line)', overflow: 'hidden', background: 'var(--bg)' }}>
                <img src={connectImg} alt={`${name} location`} loading="lazy" style={{ width: '100%', height: 'auto', display: 'block' }} />
              </Reveal>
            )}
            <div style={{ display: 'grid', gap: 'clamp(26px,3.4vw,40px)' }}>
              {connectGroups.map((g, gi) => (
                <Reveal key={gi} delay={(gi % 4) * 90}>
                  <div style={{ ...eyebrow, marginBottom: 16 }}>{g.type}</div>
                  <ul style={{ listStyle: 'none' }}>
                    {(g.data || []).map((p, pi) => (
                      <li key={pi} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 16, padding: '13px 0', borderTop: '1px solid var(--line)' }}>
                        <span style={{ fontFamily: serif, fontSize: 'clamp(16px,1.7vw,19px)', color: 'var(--ink)' }}>{p.h1}</span>
                        {p.time != null && <span style={{ fontFamily: mono, fontSize: 12, letterSpacing: '.06em', color: 'var(--copper)', flexShrink: 0 }}>{p.time} min</span>}
                      </li>
                    ))}
                  </ul>
                </Reveal>
              ))}
            </div>
          </div>
        </Section>
      )}

      {/* Closing CTA - full-bleed image with the invitation over it */}
      <section style={{ position: 'relative', overflow: 'hidden', background: 'var(--bg)' }}>
        {closingImg && (
          <div aria-hidden style={{ position: 'absolute', inset: 0 }}>
            <img src={closingImg} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(11,10,9,.72), rgba(11,10,9,.86))' }} />
          </div>
        )}
        <div className="rw-pad" style={{ position: 'relative', zIndex: 1, maxWidth: 900, margin: '0 auto', padding: 'clamp(100px,14vw,180px) 40px', textAlign: 'center' }}>
          <Reveal as="h2" style={{ fontFamily: serif, fontWeight: 400, fontSize: 'clamp(34px,5vw,68px)', lineHeight: 1.04, letterSpacing: '-.02em', color: '#F2EFE9', maxWidth: '15em', margin: '0 auto' }}>
            Interested in {name}?<br />Let’s talk numbers &amp; availability.
          </Reveal>
          <Reveal delay={140} style={{ marginTop: 44 }}>
            <BookButton interest="RW Realty mandate" specular>BOOK A STRATEGY CALL</BookButton>
          </Reveal>
        </div>
      </section>
    </>
  )
}
