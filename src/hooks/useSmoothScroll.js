import { useCallback } from 'react'

export const HEADER_OFFSET = 74

/** Live sticky-header height, including the hiring rail when it is up. */
export function headerOffset() {
  if (typeof document === 'undefined') return HEADER_OFFSET
  const n = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--rw-header-h'))
  return Number.isFinite(n) && n > 0 ? n : HEADER_OFFSET
}

/** Returns scrollToId(id) - smooth-scrolls a section under the sticky header. */
export function useSmoothScroll() {
  return useCallback((id) => {
    const el = document.getElementById(id)
    if (!el) return
    const y = el.getBoundingClientRect().top + window.scrollY - headerOffset()
    window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' })
  }, [])
}
