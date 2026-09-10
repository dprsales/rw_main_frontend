import { note } from '../styles'

/** Copper mid-dot + line, shared by Coaching's features and Careers' requirements lists. */
export default function Bullet({ children, style }) {
  return (
    <div style={{ ...note, fontSize: 15, lineHeight: 1.45, color: 'var(--ink)', display: 'flex', gap: 8, ...style }}>
      <span style={{ color: 'var(--copper)' }}>·</span>{children}
    </div>
  )
}
