import { note } from '../styles'

/** One item in a feature/requirement list: copper mid-dot then the line. */
export default function Bullet({ children, style }) {
  return (
    <div style={{ ...note, fontSize: 15, lineHeight: 1.45, color: 'var(--ink)', display: 'flex', gap: 8, ...style }}>
      <span style={{ color: 'var(--copper)' }}>·</span>{children}
    </div>
  )
}
