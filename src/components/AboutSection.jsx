import Reveal from './Reveal'
import { fs, body, container, eyebrow, sectionHeadingLg } from '../styles'

/** Text-only About: the portrait moved up to the Portfolio hero, so the heading sits
 *  left and the story right; .rw-split stacks them on smaller screens. */
export default function AboutSection() {
  return (
    <section id="about" className="rw-pad" style={{ ...container, padding: 'clamp(80px,10vw,120px) 40px' }}>
      <div className="rw-split" style={{ display: 'grid', gridTemplateColumns: '.9fr 1.1fr', gap: 'clamp(32px,6vw,90px)', alignItems: 'start' }}>
        <div>
          <Reveal style={{ ...eyebrow, letterSpacing: '.24em', marginBottom: 22 }}>ABOUT &nbsp;/&nbsp; (01)</Reveal>
          <Reveal as="h2" style={{ ...sectionHeadingLg, fontSize: fs('clamp(34px,4.6vw,62px)'), lineHeight: 1.02 }}>
            Practitioner first.<br />Everything else follows.
          </Reveal>
        </div>
        <div style={{ paddingTop: 'clamp(0px,3vw,44px)' }}>
          <Reveal as="p" delay={120} style={{ ...body, margin: 0, maxWidth: '37em' }}>
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
