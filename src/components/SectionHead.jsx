import Reveal from './Reveal'
import { fs, eyebrow, note, sectionHeading, blockHeading } from '../styles'
import { mono } from '../theme'

/**
 * Site section opener. One pattern only:
 *   copper ALL-CAPS kicker
 *   H2 serif (optional copper italic accent on the end)
 *   optional right slot for a short count or link (not a body paragraph)
 */

const accentStyle = { color: 'var(--copper)', fontStyle: 'italic' }

export default function SectionHead({
  eyebrow: kicker,
  /** @deprecated Ignored. Kickers are always copper for predictability. */
  faded: _faded = false,
  tracking = '.24em',
  title,
  /** Copper italic end of a dual-tone title. Prefer this over nesting spans in `title`. */
  titleAccent,
  titleWidth = '15em',
  aside,
  space = 'clamp(34px,4vw,54px)',
  delay = 0,
  /** @deprecated Size is fixed to H2 sectionHeading. */
  size: _size = 'md',
}) {
  const heading = titleAccent != null && titleAccent !== ''
    ? <>{title}<span style={accentStyle}>{titleAccent}</span></>
    : title

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
          <div className="rw-section-kicker" style={{ ...eyebrow, letterSpacing: tracking, marginBottom: 14 }}>
            {kicker}
          </div>
        )}
        <h2
          className="rw-section-title"
          style={{
            ...sectionHeading,
            maxWidth: titleWidth,
            textWrap: 'balance',
          }}
        >
          {heading}
        </h2>
      </div>
      {aside}
    </Reveal>
  )
}

/**
 * Centred variant for full-width list sections (Coaching programmes, Careers roles).
 */
export function CenteredHead({ eyebrow: kicker, title, titleAccent, intro }) {
  const heading = titleAccent != null && titleAccent !== ''
    ? <>{title}<span style={accentStyle}>{titleAccent}</span></>
    : title

  return (
    <Reveal style={{ textAlign: 'center', marginBottom: 20 }}>
      {kicker && (
        <div className="rw-section-kicker" style={{ ...eyebrow, letterSpacing: '.24em' }}>{kicker}</div>
      )}
      <h2
        className="rw-section-title"
        style={{ ...sectionHeading, marginTop: kicker ? 16 : 0, textWrap: 'balance' }}
      >
        {heading}
      </h2>
      {intro && (
        <div style={{ ...note, marginTop: 14, maxWidth: '40em', marginLeft: 'auto', marginRight: 'auto' }}>
          {intro}
        </div>
      )}
    </Reveal>
  )
}

/** Short aside: count, location, or a single text link. Not a body paragraph. */
export function SectionAside({ children, width = '22em', style }) {
  return <p style={{ ...note, maxWidth: width, ...style }}>{children}</p>
}

/** Small mono line some sections use as an aside. */
export function SectionCount({ children }) {
  return <p style={{ fontFamily: mono, fontSize: fs('11px'), letterSpacing: '.1em', color: 'var(--faded)' }}>{children}</p>
}

export { blockHeading, accentStyle as sectionTitleAccent }
