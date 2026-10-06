// analytics.js — central event funnel for the GA4 tag in index.html (G-DNY8TXTM7G).
// Page views go out from that tag. These calls send the named events (Finder, leads,
// purchases) to the same property. Nothing here includes name, phone, email, or free text.

export function track(eventName, params = {}) {
  try {
    if (typeof window === 'undefined') return
    const base = { event: eventName, ts: new Date().toISOString() }
    if (Array.isArray(window.dataLayer)) window.dataLayer.push({ ...base, ...params })
    if (typeof window.gtag === 'function') window.gtag('event', eventName, params)
  } catch {
    // analytics must never break the page
  }
}

/** Opaque correlation ID for Finder attempts and form submissions. Never derived from visitor data. */
export function newId() {
  try {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID()
  } catch { /* fall through */ }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
}

/** Bounded error category for *_failed events — never the raw message or response body. */
export function errorCategory(err) {
  const status = err?.status
  if (status === 0) return 'network'
  if (status === 408) return 'timeout'
  if (status === 429) return 'rate_limited'
  if (status === 400 || status === 422) return 'validation'
  if (typeof status === 'number' && status >= 500) return 'server'
  return 'unknown_outcome'
}

/** CRM delivery status only when the API explicitly reports it. */
export const crmDeliveryOf = (result) =>
  (result?.kenytStatus === 'success' || result?.kenytStatus === 'failed') ? result.kenytStatus : undefined
