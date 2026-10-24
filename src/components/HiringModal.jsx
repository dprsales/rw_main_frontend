import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link, useLocation } from 'react-router-dom'
import hireFinanceBanner from '../assets/site/hiring-finance-account-manager.jpg'
import CtaButton from './CtaButton'
import { activeHiringCampaigns } from '../data/content'
import { careerRolePath } from '../data/jobs'

export const HIRE_OPEN = 'rw-open-hire'

export function openHiringModal() {
  window.dispatchEvent(new CustomEvent(HIRE_OPEN))
}

function seenKey(row) {
  return `rw-hire-seen-${row?.until || row?.title || 'open'}`
}

function wasSeen(row) {
  try { return window.sessionStorage.getItem(seenKey(row)) === '1' } catch { return false }
}

function markSeen(row) {
  try { window.sessionStorage.setItem(seenKey(row), '1') } catch { /* private mode */ }
}

function loaderBlocking() {
  const el = document.querySelector('.rw-site-loader')
  return !!(el && !el.classList.contains('is-leaving'))
}

/** First-visit hiring poster. Close for the session; header rail can open it again. */
export default function HiringModal() {
  const campaigns = activeHiringCampaigns()
  const row = campaigns[0]
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)
  const href = row ? careerRolePath(row.title) : '/careers'

  const close = () => {
    if (row) markSeen(row)
    setOpen(false)
  }

  useEffect(() => {
    const onOpen = () => setOpen(true)
    window.addEventListener(HIRE_OPEN, onOpen)
    return () => window.removeEventListener(HIRE_OPEN, onOpen)
  }, [])

  useEffect(() => {
    if (!row || pathname.startsWith('/careers/')) return
    if (wasSeen(row)) return

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
  }, [row, pathname])

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
          <img src={hireFinanceBanner} alt={`${row.title} — apply now`} />
        </Link>
        <div className="rw-hire-modal-actions">
          <CtaButton to={href} className="rw-cta" onClick={close}>APPLY NOW</CtaButton>
          <CtaButton type="button" variant="secondary" onClick={close}>Continue to site</CtaButton>
        </div>
      </div>
    </div>,
    shell,
  )
}
