import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Footer from '../components/Footer'
import Header from '../components/Header'
import Seo from '../components/Seo'
import RiseText from '../components/RiseText'
import Reveal from '../components/Reveal'
import { BookButton } from '../components/BookingModal'
import { FAQ_SECTIONS } from '../data/faqs'
import { FOOTER_LINKS, WHATSAPP } from '../theme'
import { ctaCopper, eyebrow, lede, pageHeading } from '../styles'
import { headerOffset } from '../hooks/useSmoothScroll'

const HEADLINE = [
  { text: 'The questions ' },
  { br: true },
  { text: 'people ask first.', italic: true, copper: true },
]

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ_SECTIONS.flatMap((section) =>
    section.items.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  ),
}

const firstKey = `${FAQ_SECTIONS[0].id}-0`

export default function Faqs() {
  const [active, setActive] = useState(FAQ_SECTIONS[0].id)
  const [openKey, setOpenKey] = useState(firstKey)
  const [waVisible, setWaVisible] = useState(true)
  const sectionRefs = useRef({})

  useEffect(() => {
    document.body.classList.add('rw-faqs-page')
    return () => document.body.classList.remove('rw-faqs-page')
  }, [])

  useEffect(() => {
    const nodes = FAQ_SECTIONS.map((s) => sectionRefs.current[s.id]).filter(Boolean)
    if (!nodes.length) return
    const observer = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
      if (visible[0]?.target.id) setActive(visible[0].target.id)
    }, { rootMargin: '-140px 0px -45% 0px', threshold: [0.15, 0.35, 0.6] })
    nodes.forEach((node) => observer.observe(node))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const footer = document.querySelector('.rw-footer, footer')
    if (!footer) return
    const observer = new IntersectionObserver(([entry]) => {
      setWaVisible(!entry.isIntersecting)
    }, { threshold: 0.12 })
    observer.observe(footer)
    return () => observer.disconnect()
  }, [])

  const goTo = (id) => {
    const el = document.getElementById(id)
    if (!el) return
    setActive(id)
    const extra = window.matchMedia('(max-width: 1023px)').matches ? 56 : 46
    const y = el.getBoundingClientRect().top + window.scrollY - headerOffset() - extra
    window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' })
  }

  return (
    <>
      <Seo route="/faqs" jsonLd={faqJsonLd} />
      <Header />

      <div className="rw-faqs">
        <header className="rw-faqs-hero">
          <Reveal style={{ ...eyebrow, marginBottom: 24 }}>FAQs · TEAM RW</Reveal>
          <h1 style={pageHeading}>
            <RiseText lines={HEADLINE} />
          </h1>
          <Reveal as="p" delay={140} className="rw-faqs-lede" style={lede}>
            Cost, time, who it is for, and what happens next. Read these before you apply or book a call.
          </Reveal>
        </header>

        <nav className="rw-faqs-chips" aria-label="FAQ topics">
          {FAQ_SECTIONS.map((section) => (
            <button
              key={section.id}
              type="button"
              className={`rw-faqs-chip${active === section.id ? ' is-active' : ''}`}
              onClick={() => goTo(section.id)}
            >
              {section.nav} ({section.items.length})
            </button>
          ))}
        </nav>

        <div className="rw-faqs-layout">
          <aside className="rw-faqs-side" aria-label="FAQ categories">
            <nav>
              {FAQ_SECTIONS.map((section) => (
                <button
                  key={section.id}
                  type="button"
                  className={`rw-faqs-cat${active === section.id ? ' is-active' : ''}`}
                  aria-current={active === section.id ? 'true' : undefined}
                  onClick={() => goTo(section.id)}
                >
                  {section.nav} ({section.items.length})
                </button>
              ))}
            </nav>
          </aside>

          <div className="rw-faqs-main">
            {FAQ_SECTIONS.map((section) => (
              <section
                key={section.id}
                id={section.id}
                className="rw-faqs-section"
                ref={(el) => { sectionRefs.current[section.id] = el }}
                aria-labelledby={`${section.id}-title`}
              >
                <h2 id={`${section.id}-title`} className="rw-faqs-title">{section.title}</h2>
                <div className="rw-faqs-list">
                  {section.items.map((item, i) => {
                    const key = `${section.id}-${i}`
                    const isOpen = openKey === key
                    const answerId = `${section.id}-a-${i}`
                    return (
                      <div key={item.q} className={`rw-faqs-item${isOpen ? ' is-open' : ''}`}>
                        <button
                          type="button"
                          className="rw-faqs-q"
                          aria-expanded={isOpen}
                          aria-controls={answerId}
                          onClick={() => setOpenKey(isOpen ? '' : key)}
                        >
                          <span>{item.q}</span>
                          <span className="rw-faqs-plus" aria-hidden="true" />
                        </button>
                        <div className="rw-faqs-a" id={answerId} aria-hidden={!isOpen}>
                          <div>
                            <p>{item.a}</p>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
                <Link to={section.to} className="rw-faqs-more">{section.more} →</Link>
              </section>
            ))}

            <div className="rw-faqs-cta">
              <h2>Didn&apos;t find your answer?</h2>
              <p>Talk to Team RW directly.</p>
              <div className="rw-faqs-cta-actions">
                <BookButton interest="General enquiry" className="rw-cta" style={ctaCopper}>
                  Book a Call
                </BookButton>
                <a href={WHATSAPP} className="rw-faqs-wa-btn" target="_blank" rel="noopener noreferrer">
                  WhatsApp Us
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {waVisible && (
        <a
          href={WHATSAPP}
          className="rw-faqs-float"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="WhatsApp Team RW"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M19.05 4.91A9.82 9.82 0 0 0 12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.86 9.86 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.91-7.02zm-7.01 15.24h-.01a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.18 8.18 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.24 8.23zm4.52-6.16c-.25-.12-1.47-.72-1.7-.81-.23-.08-.39-.12-.56.13-.16.24-.64.8-.79.97-.14.16-.3.18-.55.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.24-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.14.16-.24.25-.41.08-.16.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.42h-.48c-.16 0-.43.06-.65.31-.23.24-.86.85-.86 2.07 0 1.22.88 2.4 1 2.56.12.16 1.77 2.7 4.29 3.79.6.26 1.07.41 1.44.53.6.19 1.16.17 1.59.1.49-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.14-1.18-.06-.1-.23-.16-.48-.28z" />
          </svg>
        </a>
      )}

      <Footer links={FOOTER_LINKS} />
    </>
  )
}
