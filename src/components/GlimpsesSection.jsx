import { Link } from 'react-router-dom'
import ImageSlot from './ImageSlot'
import Reveal from './Reveal'
import plateWhiteboardImage from '../assets/site/plate-whiteboard.jpg'
import plateTeamImage from '../assets/site/plate-team.jpg'
import plateDeskImage from '../assets/site/plate-desk.jpg'
import plateReadingImage from '../assets/site/plate-reading.jpg'
import SectionHead from './SectionHead'
import { container, headLink } from '../styles'

// Glimpses mosaic; on Portfolio pass linkTo={null} and showCta={false} to avoid self-linking.
const GLIMPSES = [
  { tag: 'FIG 01', src: plateWhiteboardImage, alt: 'Rajiv running a session at the whiteboard', placeholder: 'Mentoring', caption: 'Training session', position: 'center 32%' },
  { tag: 'FIG 02', src: plateDeskImage, alt: 'Rajiv working at his desk', placeholder: 'At the desk', caption: 'Between calls', position: 'center 30%' },
  // Only vertical portrait in the set — needs a tall frame.
  { tag: 'FIG 03', src: plateReadingImage, alt: 'Rajiv preparing before a session', placeholder: 'Preparation', caption: 'Before the room', position: 'center 30%' },
  // Wide shot, suits the short panoramic strip.
  { tag: 'FIG 04', src: plateTeamImage, alt: 'The Rajiv Williams team', placeholder: 'The team', caption: 'Hyderabad office', position: 'center 32%' },
]

export default function GlimpsesSection({ showCta = true, linkTo = '/realty/portfolio' }) {
  const frameStyle = { display: 'block', height: '100%', border: '1px solid var(--line)', overflow: 'hidden' }

  return (
    <section className="rw-pad" style={{ ...container, padding: 'clamp(80px,10vw,110px) 40px' }}>
      <SectionHead
        eyebrow="GLIMPSES" size="sm" space={30}
        title="Where the work happens."
        aside={showCta && linkTo && (
          <Link to={linkTo} className="rw-nav-link" style={headLink}>
            VIEW FULL PORTFOLIO →
          </Link>
        )}
      />
      <div className="rw-glimpses">
        {GLIMPSES.map((g, i) => {
          const inner = <ImageSlot src={g.src} alt={g.alt} placeholder={g.placeholder} caption={g.caption} tag={g.tag} position={g.position} />
          return (
            <Reveal key={g.tag} delay={i * 80} className="rw-glimpse">
              {linkTo
                ? <Link to={linkTo} className="rw-figure" data-cursor="hot" style={frameStyle}>{inner}</Link>
                : <div className="rw-figure" style={frameStyle}>{inner}</div>}
            </Reveal>
          )
        })}
      </div>
    </section>
  )
}
