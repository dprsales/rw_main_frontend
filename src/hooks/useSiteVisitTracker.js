import { useEffect } from 'react'
import { recordSiteVisit } from '../data/api'

const VISITOR_ID_KEY = 'rw_visitor_id'

/** Persisted in localStorage, not a cookie — survives across sessions/tabs so the
 * same person doesn't count as a new visitor tomorrow, but never leaves the browser
 * and carries no personal data. A private window or cleared storage looks like a new
 * visitor, same trade-off every cookieless counter makes. */
function getVisitorId() {
  try {
    let id = localStorage.getItem(VISITOR_ID_KEY)
    if (!id) {
      id = crypto.randomUUID()
      localStorage.setItem(VISITOR_ID_KEY, id)
    }
    return id
  } catch {
    return null // Storage blocked (private mode, disabled cookies) — skip tracking rather than crash.
  }
}

/**
 * Pings the backend once per app load (not per in-app route change — App.jsx mounts
 * this once at the top, above <Routes>). The backend dedupes by (visitorId, date), so
 * this only ever needs to fire once; a second ping the same day is a harmless no-op.
 */
export function useSiteVisitTracker() {
  useEffect(() => {
    const visitorId = getVisitorId()
    if (!visitorId) return
    recordSiteVisit({
      visitorId,
      path: window.location.pathname,
      referrer: document.referrer || '',
    }).catch(() => {
      // Tracking must never surface an error to the visitor.
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
