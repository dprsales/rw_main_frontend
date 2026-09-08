import { attribution } from '../styles'
import { serif } from '../theme'

// Centred testimonial quote; renders a blockquote unless as="p" is passed.
export default function PullQuote({
  children,
  name,
  as: Tag = 'blockquote',
  size = 'clamp(24px,3vw,34px)',
  lineHeight = 1.35,
  space = 26,
  color = 'var(--ink)',
  nameStyle,
}) {
  return (
    <>
      <Tag style={{ fontFamily: serif, fontWeight: 400, fontStyle: 'italic', fontSize: size, lineHeight, color, margin: 0 }}>
        {children}
      </Tag>
      {name && <div style={{ ...attribution, marginTop: space, ...nameStyle }}>{name}</div>}
    </>
  )
}
