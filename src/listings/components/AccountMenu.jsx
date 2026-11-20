import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useListingAuth } from '../AuthContext'

function initials(user) {
  const src = (user?.name || user?.email || '?').trim()
  const parts = src.split(/[\s@._-]+/).filter(Boolean)
  return ((parts[0]?.[0] || '') + (parts[1]?.[0] || '')).toUpperCase() || '?'
}

/**
 * Header account control — one action only.
 * Logged out: gold CTA to list (auth happens on that path). Avoids a generic "Log in" that feels odd on a marketing site.
 * Logged in: compact avatar menu.
 */
export default function AccountMenu() {
  const { user, ready, logout } = useListingAuth()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const { pathname } = useLocation()
  const navigate = useNavigate()

  useEffect(() => { setOpen(false) }, [pathname])

  useEffect(() => {
    if (!open) return undefined
    const onClick = (e) => { if (!ref.current?.contains(e.target)) setOpen(false) }
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('mousedown', onClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  if (!ready) {
    return (
      <span className="rw-cta rw-header-login" style={{ opacity: 0.35, pointerEvents: 'none' }} aria-hidden>
        List a property
      </span>
    )
  }

  if (!user) {
    return (
      <Link
        to="/listings/login?next=%2Flistings"
        className="rw-cta rw-header-login"
        aria-label="List a property"
      >
        List a property
      </Link>
    )
  }

  return (
    <div ref={ref} style={{ position: 'relative', flexShrink: 0 }}>
      <button
        type="button"
        className="rw-header-account"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <span className="rw-header-account-avatar">{initials(user)}</span>
        <span className="rw-header-account-name">{user.name || user.email.split('@')[0]}</span>
      </button>

      {open && (
        <div className="rw-header-account-menu" role="menu">
          <div className="rw-header-account-meta">
            <strong>{user.name || 'My account'}</strong>
            <span>{user.email}</span>
          </div>
          <Link role="menuitem" to="/listings/dashboard" onClick={() => setOpen(false)}>My listings</Link>
          <Link role="menuitem" to="/listings" onClick={() => setOpen(false)}>Buy, Sell, Rent</Link>
          <button
            type="button"
            role="menuitem"
            className="rw-header-account-logout"
            onClick={() => { logout(); setOpen(false); navigate('/listings') }}
          >
            Log out
          </button>
        </div>
      )}
    </div>
  )
}
