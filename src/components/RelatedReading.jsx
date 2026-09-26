import { useEffect, useState } from 'react'
import Gallery from './Gallery'
import SectionHead, { SectionCount } from './SectionHead'
import { RELATED_READING, fetchBlogsOnce, pickBySlug } from '../data/blogs'
import { container } from '../styles'

/**
 * "Related reading" — three hand-picked articles for one service page, in the same
 * link-out cards as the home "Writing" feed. Renders nothing while loading, if the
 * feed fails, or if none of the chosen posts are still published.
 *
 *   service  'coaching' | 'consulting' | 'realty' (key of RELATED_READING)
 */
export default function RelatedReading({ service, title = 'Related reading.' }) {
  const [items, setItems] = useState([])

  useEffect(() => {
    let alive = true
    fetchBlogsOnce()
      .then((cards) => { if (alive) setItems(pickBySlug(cards, RELATED_READING[service] || [])) })
      .catch(() => {})
    return () => { alive = false }
  }, [service])

  if (!items.length) return null

  return (
    <section className="rw-pad" style={{ ...container, padding: 'clamp(80px,10vw,110px) 40px' }} aria-label="Related reading">
      <SectionHead
        eyebrow="FROM THE WRITING" faded titleWidth="13em" space={34}
        title={title}
        aside={<SectionCount>CLICK ANY POST TO READ ↗</SectionCount>}
      />
      <Gallery items={items.map((item) => ({ ...item, wide: false }))} />
    </section>
  )
}
