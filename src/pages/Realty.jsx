import { Link } from 'react-router-dom'
import skylineImage from '../assets/site/skyline.png'
import priyankaImage from '../assets/site/panda.png'
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
import ProjectsSection from '../components/ProjectsSection'
import ImageSlot from '../components/ImageSlot'
import { BookButton } from '../components/BookingModal'
import Reveal from '../components/Reveal'
import RiseText from '../components/RiseText'
import ClosingCTA from '../components/ClosingCTA'
import SectionHead, { SectionAside } from '../components/SectionHead'
import { MANDATE_SCOPE } from '../data/content'
import { FOOTER_LINKS, mono, serif, text } from '../theme'
import {
  body, container, eyebrow, headLink,
  intro, lede, pageHeading, sectionHeading, sectionRule,
} from '../styles'

/* Short teaser set; Portfolio carries all nineteen. Rohas Ventures has only a bitmap
   (no matching vector mark) so it's left out until one exists. */
const CLIENT_MARKS = [
  { name: 'Vamsiram', src: vamsiramLogo, dark: true },
  { name: 'Zuari Infraworld', src: zuariLogo, dark: true },
  { name: 'Landmark Group', src: landmarkLogo, dark: true },
  { name: 'IRA', src: iraLogo, dark: true },
  { name: 'Suchirindia', src: suchirindiaLogo, dark: true },
  { name: 'Sri Aditya', src: sriAdityaLogo, dark: true },
  { name: 'The Trilight', src: trilightLogo, dark: true },
]

const HEADLINE = [
  { text: 'We take ownership ' },
  { br: true },
  { text: 'of the sale.', italic: true, copper: true },
]

export default function Realty() {
  return (
    <>
      <Seo route="/realty" />
      <Header />

      {/* Intro */}
      <section id="top" className="rw-pad" style={{ ...container, padding: '80px 40px 40px' }}>
        <div className="rw-split" style={{ display: 'grid', gridTemplateColumns: '.58fr .42fr', gap: 60, alignItems: 'center' }}>
          <div>
            <Reveal style={{ ...eyebrow, marginBottom: 30 }}>RW REALTY · MANDATE MODEL</Reveal>

            <h1 style={{ ...pageHeading, fontSize: 'clamp(46px,6vw,92px)', lineHeight: 1, maxWidth: '14em' }}>
              <RiseText lines={HEADLINE} step={0.12} />
            </h1>

            <Reveal as="p" delay={110} style={{ ...lede, marginTop: 24, fontStyle: 'italic' }}>
              “You Build, We Sell.” · Team RW
            </Reveal>

            <Reveal as="p" delay={140} style={{ ...intro, marginTop: 20, maxWidth: '38em', fontSize: 'clamp(17px,1.9vw,21px)' }}>
              For selected projects, Team RW operates through an exclusive mandate model, taking complete ownership of the project's sales strategy and execution. From market positioning and buyer experience to sales management, negotiations, reporting and closures, they work as an embedded sales leadership partner focused on driving stronger project performance in the able leadership of Ms.Priyanka Panda .
            </Reveal>

            <Reveal delay={220} style={{ marginTop: 34 }}>
              <BookButton interest="RW Realty mandate" specular>DISCUSS A MANDATE</BookButton>
            </Reveal>
          </div>

          <Reveal delay={160} style={{ position: 'relative' }}>
            <div className="rw-frame" style={{ aspectRatio: '4/5', border: '1px solid var(--line)', overflow: 'hidden', background: 'var(--chip)' }}>
              <ImageSlot
                src={priyankaImage}
                alt="Priyanka Panda"
                placeholder="Mandate in motion"
                caption="pics/ · signing or site walkthrough"
                tag="FIG 01"
                position="center 20%"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* What the mandate covers - numbered scope cards */}
      <section id="scope" style={{ ...sectionRule, borderBottom: '1px solid var(--line)', background: 'var(--chip)' }}>
        <div className="rw-pad" style={{ ...container, padding: 'clamp(80px,10vw,110px) 40px' }}>
          <SectionHead
            eyebrow="WHAT THE MANDATE COVERS" tracking=".24em" titleWidth="12em"
            title="One team owns the whole funnel."
            aside={<SectionAside>Eight responsibilities we take off your plate: from strategy and pricing through to closure and daily reporting.</SectionAside>}
          />

          <div className="rw-matrix">
            {MANDATE_SCOPE.map((item, i) => (
              <Reveal key={item.n} delay={(i % 4) * 80} className="rw-matrix-cell">
                <span className="rw-matrix-num" style={{ fontFamily: mono }}>{item.n}</span>
                <div className="rw-matrix-title" style={{ fontFamily: serif }}>{item.title}</div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Why this model */}
      <section id="why" className="rw-pad rw-why-section" style={{ ...container, padding: 'clamp(90px,11vw,130px) 40px', position: 'relative', overflow: 'hidden' }}>
        <img src={skylineImage} alt="" aria-hidden className="rw-why-watermark" />
        <div className="rw-split" style={{ position: 'relative', zIndex: 1, display: 'grid', gridTemplateColumns: '.36fr .64fr', gap: 56 }}>
          <Reveal style={{ ...eyebrow, letterSpacing: '.24em' }}>WHY IT WORKS</Reveal>
          <div>
            <Reveal as="h2" style={{ ...sectionHeading, fontSize: 'clamp(30px,3.8vw,48px)', lineHeight: 1.06, maxWidth: '16em' }}>
              One accountable partner, not another vendor to manage.
            </Reveal>
            <Reveal as="p" delay={120} style={{ ...body, marginTop: 26, maxWidth: '35em' }}>
              Most projects split sales across brokers, an in-house team, and a marketing agency, each optimising for a different number. Under the mandate model, one team owns the outcome end to end, with the same discipline used in the coaching room applied directly to your launch.
            </Reveal>
            <Reveal as="p" delay={200} style={{ marginTop: 24, fontFamily: serif, fontStyle: 'italic', fontSize: 'clamp(16px,1.7vw,18px)', lineHeight: 1.55, color: 'var(--ink)', maxWidth: '35em' }}>
              Team RW operates primarily on projects with serious inventory, long-term developer intent, and real ambition. This is not for everyone, and that is by design.
            </Reveal>
          </div>
        </div>
      </section>

      {/* Same "projects behind the numbers" section Portfolio carries, shared from one component. */}
      <ProjectsSection />

      {/* Teaser into the portfolio: projects we hold photography for, not the mandate roster. */}
      <section id="clients" style={{ ...sectionRule, borderBottom: '1px solid var(--line)', background: 'var(--chip)' }}>
        <div className="rw-pad" style={{ ...container, padding: 'clamp(80px,10vw,110px) 40px' }}>
          <SectionHead
            eyebrow="SELECTED CLIENTS" faded size="sm" space={30}
            title="A few of the addresses."
            aside={(
              <Link to="/realty/portfolio" className="rw-nav-link" style={headLink}>
                VIEW FULL PORTFOLIO →
              </Link>
            )}
          />
          {/* `renderItem` gives each tile its own light-or-dark treatment; edge fade matches
              the section background so the loop dissolves rather than stopping at a hard edge. */}
          <Reveal>
            <LogoLoop
              logos={CLIENT_MARKS.map((mark) => ({ src: mark.src, alt: mark.name, scale: mark.scale, dark: mark.dark }))}
              speed={42}
              direction="left"
              gap={12}
              hoverSpeed={0}
              fadeOut
              fadeOutColor="var(--chip)"
              ariaLabel="Selected clients"
              className="rw-logoloop"
              renderItem={(item) => (
                <div className={`rw-loop-tile${item.dark ? ' is-dark' : ''}`}>
                  {/* Eager, not lazy: duplicated copies start off-screen and scroll in immediately. */}
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

      <ClosingCTA title="Mandates are limited to a handful of projects at a time.">
        <BookButton interest="RW Realty mandate" specular>DISCUSS A MANDATE</BookButton>
      </ClosingCTA>

      <Footer chip links={FOOTER_LINKS} />
    </>
  )
}
