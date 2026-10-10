import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import Reveal from './Reveal'
import { sectionHeading } from '../styles'

/**
 * Quiet FAQ accordion: every question stays visible, one answer is open.
 * The first starts open so the row is obviously tappable.
 */
export default function FaqSection({ items }) {
  const [open, setOpen] = useState(0)

  return (
    <section className="rw-faq" aria-labelledby="rw-faq-title">
      <div className="rw-pad rw-faq-wrap">
        <Reveal as="h2" id="rw-faq-title" style={{ ...sectionHeading, maxWidth: '16em', marginBottom: 36 }}>Frequently asked questions.</Reveal>
        <div className="rw-faq-list">
          {items.map((item, i) => {
            const isOpen = open === i
            return (
              <div key={item.q} className={`rw-faq-item${isOpen ? ' is-open' : ''}`}>
                <button
                  type="button"
                  className="rw-faq-q"
                  aria-expanded={isOpen}
                  aria-controls={`faq-a-${i}`}
                  onClick={() => setOpen(isOpen ? -1 : i)}
                >
                  <span>{item.q}</span>
                  <ChevronDown className="rw-faq-caret" size={18} strokeWidth={1.75} aria-hidden="true" />
                </button>
                <div className="rw-faq-a" id={`faq-a-${i}`} aria-hidden={!isOpen}>
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
