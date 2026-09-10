import { serif } from '../theme'

// The ticker never wraps, so type must shrink with viewport or phones see barely two words.
const strip = {
  display: 'flex', alignItems: 'center',
  gap: 'clamp(16px,3vw,30px)', paddingRight: 'clamp(16px,3vw,30px)',
  fontFamily: serif, fontStyle: 'italic', fontSize: 'clamp(19px,3.2vw,30px)',
  color: 'var(--ink)', whiteSpace: 'nowrap',
}

/** Infinite horizontal ticker. The content is duplicated so the loop is seamless. */
export default function Marquee({ items, speed = 34 }) {
  const strand = (key) => (
    <div key={key} style={strip} aria-hidden={key === 'clone'}>
      {items.map((text, i) => (
        <span key={i} style={{ display: 'contents' }}>
          <span>{text}</span>
          <span style={{ color: 'var(--copper)', fontStyle: 'normal' }}>✦</span>
        </span>
      ))}
    </div>
  )

  return (
    <section
      style={{
        borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)',
        overflow: 'hidden', padding: 'clamp(16px,2.6vw,26px) 0', background: 'var(--chip)',
      }}
    >
      <div style={{ display: 'flex', width: 'max-content', animation: `rw-marquee ${speed}s linear infinite` }}>
        {strand('a')}
        {strand('clone')}
      </div>
    </section>
  )
}
