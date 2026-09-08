import Reveal from './Reveal'
import { eyebrow, eyebrowFaded, note, sectionHeading, sectionHeadingLg, sectionHeadingSm } from '../styles'
import { mono, serif } from '../theme'

// Shared section-opening patterns, factored out of near-identical inline copies on every page.

const HEADING = { lg: sectionHeadingLg, md: sectionHeading, sm: sectionHeadingSm }

// Eyebrow and heading on the left, optional aside on the right; `aside` is a node since call sites vary.
export default function SectionHead({
  eyebrow: kicker,
  faded = false,
  tracking,
  title,
  size = 'md',
  titleWidth,
  aside,
  space = 'clamp(34px,4vw,54px)',
  delay = 0,
}) {
  return (
    <Reveal
      delay={delay}
      style={{
        display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
        gap: 24, flexWrap: 'wrap', marginBottom: space,
      }}
    >
      <div>
        {kicker && (
          <div style={{ ...(faded ? eyebrowFaded : eyebrow), ...(tracking && { letterSpacing: tracking }), marginBottom: 14 }}>
            {kicker}
          </div>
        )}
        <h2 style={{ ...HEADING[size], ...(titleWidth && { maxWidth: titleWidth }) }}>{title}</h2>
      </div>
      {aside}
    </Reveal>
  )
}

// Centred variant for full-width list sections (Coaching's programmes, Careers' roles); heading is a div, not h2.
export function CenteredHead({ eyebrow: kicker, title, intro }) {
  return (
    <Reveal style={{ textAlign: 'center', marginBottom: 20 }}>
      <div style={{ ...eyebrow, letterSpacing: '.24em' }}>{kicker}</div>
      <div style={{ marginTop: 16, fontFamily: serif, fontSize: 'clamp(28px,3.4vw,42px)', color: 'var(--ink)' }}>
        {title}
      </div>
      {intro && (
        <div style={{ ...note, marginTop: 14, fontSize: 'clamp(16px,1.7vw,18px)', maxWidth: '40em', marginLeft: 'auto', marginRight: 'auto' }}>
          {intro}
        </div>
      )}
    </Reveal>
  )
}

/** The supporting paragraph that most `aside` slots want. */
export function SectionAside({ children, width = '22em', style }) {
  return <p style={{ ...note, maxWidth: width, ...style }}>{children}</p>
}

/** The small mono line some sections use as an aside — a count, a location. */
export function SectionCount({ children }) {
  return <p style={{ fontFamily: mono, fontSize: 11, letterSpacing: '.1em', color: 'var(--faded)' }}>{children}</p>
}
