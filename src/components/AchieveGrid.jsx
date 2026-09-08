import Reveal from './Reveal'
import { serif } from '../theme'

/** Numbered outcome cards, shared by Coaching and Careers. `stagger` must match the grid's column count. */
export default function AchieveGrid({ items, className, stagger = 3, arrows = false }) {
  return (
    <div className={className}>
      {items.map((item, i) => (
        <Reveal key={item.title} delay={(i % stagger) * 90} style={{ position: 'relative' }}>
          <div className="rw-achieve">
            <span className="rw-achieve-num" style={{ fontFamily: serif }} aria-hidden>
              {String(i + 1).padStart(2, '0')}
            </span>
            <div className="rw-achieve-title" style={{ fontFamily: serif }}>{item.title}</div>
            <div className="rw-achieve-body" style={{ fontFamily: serif }}>{item.body}</div>
          </div>
          {arrows && i < items.length - 1 && (
            <span className="rw-achieve-arrow" aria-hidden="true"><i>→</i></span>
          )}
        </Reveal>
      ))}
    </div>
  )
}
