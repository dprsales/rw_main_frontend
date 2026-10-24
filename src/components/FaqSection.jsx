import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import Reveal from './Reveal'
import { sectionHeading } from '../styles'

/**
 * Quiet FAQ accordion: every question stays visible, one answer is open.
 * The first starts open so the row is obviously tappable.
 */
export default function FaqSection({ items, title = 'FAQs', id, more }) {
  const [open, setOpen] = useState(0)
  const headingId = id ? `${id}-title` : 'rw-faq-title'

  return (
    <section className="rw-faq" id={id} aria-labelledby={headingId}>
      <div className="rw-pad rw-faq-wrap">
        <Reveal as="h2" id={headingId} style={{ ...sectionHeading, color: 'var(--copper)', marginBottom: more ? 12 : 36 }}>
          {title}
        </Reveal>
        {more && <div className="rw-faq-more-wrap">{more}</div>}
        <div className="rw-faq-list">
          {items.map((item, i) => {
            const isOpen = open === i
            const answerId = `${headingId}-a-${i}`
            return (
              <div key={item.q} className={`rw-faq-item${isOpen ? ' is-open' : ''}`}>
                <button
                  type="button"
                  className="rw-faq-q"
                  aria-expanded={isOpen}
                  aria-controls={answerId}
                  onClick={() => setOpen(isOpen ? -1 : i)}
                >
                  <span>{item.q}</span>
                  <ChevronDown className="rw-faq-caret" size={18} strokeWidth={1.75} aria-hidden="true" />
                </button>
                <div className="rw-faq-a" id={answerId} aria-hidden={!isOpen}>
                  <div>
                    <p>{item.a}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
