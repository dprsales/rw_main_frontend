import { useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link, useLocation } from 'react-router-dom'
import hireFinanceBanner from '../assets/site/hiring-finance-account-manager.jpg'
import hireTraineeBanner from '../assets/site/hiring-management-trainee.jpg'
import CtaButton from './CtaButton'
import { activeHiringCampaigns, showHiringRail } from '../data/content'
import { careerRolePath } from '../data/jobs'

export const HIRE_OPEN = 'rw-open-hire'
const SLIDE_MS = 5000

const POSTERS = {
  finance: hireFinanceBanner,
  trainee: hireTraineeBanner,
}

export function openHiringModal(title) {
  window.dispatchEvent(new CustomEvent(HIRE_OPEN, { detail: { title } }))
}

function seenKey(campaigns) {
  return `rw-hire-seen-${campaigns.map((row) => row.until || row.title).join('|') || 'open'}`
}

function wasSeen(campaigns) {
  try { return window.sessionStorage.getItem(seenKey(campaigns)) === '1' } catch { return false }
}

function markSeen(campaigns) {
  try { window.sessionStorage.setItem(seenKey(campaigns), '1') } catch { /* private mode */ }
}

function loaderBlocking() {
  const el = document.querySelector('.rw-site-loader')
  return !!(el && !el.classList.contains('is-leaving'))
}

function posterFor(row) {
  return POSTERS[row?.poster] || hireFinanceBanner
}

/** First-visit hiring poster. Close for the session; header rail can open it again. */
export default function HiringModal() {
  const campaigns = useMemo(() => activeHiringCampaigns(), [])
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)
  const [index, setIndex] = useState(0)
  const row = campaigns[index] || campaigns[0]
  const href = row ? careerRolePath(row.title) : '/careers'

  const close = () => {
    if (campaigns.length) markSeen(campaigns)
    setOpen(false)
  }

  useEffect(() => {
    const onOpen = (event) => {
      const title = event?.detail?.title
      if (title) {
        const hit = campaigns.findIndex((item) => item.title === title)
        if (hit >= 0) setIndex(hit)
      }
      setOpen(true)
    }
    window.addEventListener(HIRE_OPEN, onOpen)
    return () => window.removeEventListener(HIRE_OPEN, onOpen)
  }, [campaigns])

  useEffect(() => {
    if (!campaigns.length || !showHiringRail(pathname)) return
    if (wasSeen(campaigns)) return

    let interval
    const failsafe = window.setTimeout(() => setOpen(true), 6500)
    const tryOpen = () => {
      if (loaderBlocking()) return
      window.clearTimeout(failsafe)
      window.clearInterval(interval)
      setOpen(true)
    }
    if (!loaderBlocking()) {
      const wait = pathname === '/' ? 400 : 200
      const start = window.setTimeout(tryOpen, wait)
      return () => { window.clearTimeout(start); window.clearTimeout(failsafe) }
    }
    interval = window.setInterval(tryOpen, 200)
    return () => { window.clearInterval(interval); window.clearTimeout(failsafe) }
  }, [campaigns, pathname])

  useEffect(() => {
    if (!open || campaigns.length < 2) return
    const id = window.setInterval(() => {
      setIndex((n) => (n + 1) % campaigns.length)
    }, SLIDE_MS)
    return () => window.clearInterval(id)
  }, [open, campaigns.length])

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e) => { if (e.key === 'Escape') close() }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  if (!row || !open) return null

  const shell = document.getElementById('rw-app-shell') || document.body

  return createPortal(
    <div className="rw-hire-modal" role="dialog" aria-modal="true" aria-label="Urgent hiring">
      <button type="button" className="rw-hire-modal-back" aria-label="Close" onClick={close} />
      <div className="rw-hire-modal-card">
        <button type="button" className="rw-hire-modal-x" onClick={close} aria-label="Close">×</button>
        <Link className="rw-hire-modal-poster" to={href} onClick={close}>
          <img key={row.title} src={posterFor(row)} alt={`${row.title} — apply now`} />
        </Link>
        {campaigns.length > 1 && (
          <div className="rw-hire-modal-dots" role="group" aria-label="Hiring slides">
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
        <div className="rw-hire-modal-actions">
          <CtaButton to={href} className="rw-cta" onClick={close}>APPLY NOW</CtaButton>
          <CtaButton type="button" variant="secondary" onClick={close}>Continue to site</CtaButton>
        </div>
      </div>
    </div>,
    shell,
  )
}
