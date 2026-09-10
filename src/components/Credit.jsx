import { sysCredit } from '../data/credits'

/** Build credit, transparent (not display:none) so it stays selectable/copyable in the flow. */
export default function Credit() {
  return (
    <span
      aria-hidden="true"
      style={{
        position: 'absolute', right: 16, bottom: 10,
        maxWidth: '90%',
        color: 'transparent',
        fontSize: 10, lineHeight: 1,
        userSelect: 'text',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
      }}
    >
      {sysCredit}
    </span>
  )
}
