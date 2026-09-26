import portraitImage from '../assets/site/portrait-rajiv.png'
import ImageSlot from './ImageSlot'
import Reveal from './Reveal'
import SignatureOverlay from './SignatureOverlay'
import { useTilt } from '../hooks/useTilt'
import { body, container, eyebrow, sectionHeadingLg } from '../styles'

export default function AboutSection() {
  const tilt = useTilt({ max: 5 })

  return (
    <section id="about" className="rw-pad" style={{ ...container, padding: 'clamp(90px,11vw,130px) 40px' }}>
      <div className="rw-split" style={{ display: 'grid', gridTemplateColumns: '.44fr .56fr', gap: 60, alignItems: 'center' }}>
        <Reveal delay={120} style={{ position: 'relative' }}>
          <div
            ref={tilt.ref}
            onPointerMove={tilt.onPointerMove}
            onPointerLeave={tilt.onPointerLeave}
            className="rw-frame"
            style={{ ...tilt.style, aspectRatio: '4/5', border: '1px solid var(--line)', overflow: 'hidden', background: 'var(--chip)' }}
          >
            <ImageSlot src={portraitImage} alt="Rajiv Williams" placeholder="Portrait of Rajiv" caption="pics/ · office or studio" position="45% 28%" />
            <SignatureOverlay />
          </div>
        </Reveal>
        <div>
          <Reveal style={{ ...eyebrow, letterSpacing: '.24em', marginBottom: 22 }}>ABOUT &nbsp;/&nbsp; (01)</Reveal>
          <Reveal as="h2" style={{ ...sectionHeadingLg, fontSize: 'clamp(34px,4.6vw,62px)', lineHeight: 1.02 }}>
            Practitioner first.<br />Everything else follows.
          </Reveal>
          <Reveal as="p" delay={120} style={{ ...body, marginTop: 30, maxWidth: '37em' }}>
            Over fifteen years of live deals, and still counting. Everything Rajiv shares was earned in the market first. That single fact decides everything on this page.
          </Reveal>
          <Reveal as="p" delay={200} style={{ ...body, marginTop: 20, maxWidth: '37em' }}>
            In a business built on trust, Rajiv Williams believes reputation is the only asset that compounds forever and every deal is judged against it.
          </Reveal>
        </div>
      </div>
    </section>
  )
}
