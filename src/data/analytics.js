// analytics.js — central event funnel for GA4/GTM.
// No tracker is loaded on the site yet, so events are pushed onto `window.dataLayer`
// only when GTM/GA creates it; nothing leaks to a network otherwise. To wire GA4
// later, drop the gtag container once and every track() call here starts flowing.

export function track(eventName, params = {}) {
  try {
    if (typeof window === 'undefined') return
    const base = { event: eventName, ts: new Date().toISOString() }
    if (Array.isArray(window.dataLayer)) window.dataLayer.push({ ...base, ...params })
  } catch {
    // analytics must never break the page
  }
}