import { sysCredit } from '../data/credits'

/** Build credit, kept transparent (not clipped/hidden) so text drag-select still picks it up. */
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
