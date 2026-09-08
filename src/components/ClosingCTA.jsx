import Reveal from './Reveal'
import { closingHeading } from '../styles'

/** Closing band: centred heading plus a CTA button passed as children (buttons vary per page). */
export default function ClosingCTA({
  id = 'apply',
  chip = false,
  title,
  titleStyle,
  width = 900,
  pad = 'clamp(90px,11vw,120px)',
  children,
}) {
  return (
    <section id={id} style={{ borderTop: '1px solid var(--line)', ...(chip && { background: 'var(--chip)' }) }}>
      <div className="rw-pad" style={{ maxWidth: width, margin: '0 auto', padding: `${pad} 40px`, textAlign: 'center' }}>
        <Reveal as="h2" style={{ ...closingHeading, ...titleStyle }}>{title}</Reveal>
        <Reveal delay={140} style={{ marginTop: 38 }}>{children}</Reveal>
      </div>
    </section>
  )
}
