import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { activeHiringCampaigns } from '../data/content'
import { careerRolePath } from '../data/jobs'
import { openHiringModal } from './HiringModal'

const ROTATE_MS = 6000

/** Time-bound hiring rail. Hidden when every campaign in `HIRING_CAMPAIGNS` has expired. */
export default function HiringBanner() {
  const campaigns = activeHiringCampaigns()
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (campaigns.length < 2) return
    const id = window.setInterval(() => {
      setIndex((n) => (n + 1) % campaigns.length)
    }, ROTATE_MS)
    return () => window.clearInterval(id)
  }, [campaigns.length])

  if (!campaigns.length) return null

  const row = campaigns[index % campaigns.length]
  const href = careerRolePath(row.title)

  return (
    <div className="rw-hire-bar" role="region" aria-label="Urgent hiring">
      <div className="rw-hire-bar-inner">
        <span className="rw-hire-tag">Urgent hiring</span>
        <button type="button" className="rw-hire-copy" key={row.title} onClick={openHiringModal}>
          <strong>{row.title}</strong>
          {row.location ? <span className="rw-hire-meta"> · {row.location}</span> : null}
          {row.line ? <span className="rw-hire-line"> — {row.line}</span> : null}
        </button>
        <Link className="rw-hire-go" to={href}>Apply now</Link>
        {campaigns.length > 1 && (
          <div className="rw-hire-dots" role="group" aria-label="Hiring slides">
            {campaigns.map((item, i) => (
              <button
                key={item.title}
                type="button"
                className={`rw-hire-dot${i === index ? ' is-on' : ''}`}
                aria-label={`Show ${item.title}`}
                aria-current={i === index ? 'true' : undefined}
                onClick={() => setIndex(i)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
