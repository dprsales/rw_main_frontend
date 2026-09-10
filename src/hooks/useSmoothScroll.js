import { useCallback } from 'react'

const HEADER_OFFSET = 74

/** Returns scrollToId(id) - smooth-scrolls a section under the sticky header. */
export function useSmoothScroll() {
  return useCallback((id) => {
    const el = document.getElementById(id)
    if (!el) return
    const y = el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET
    window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' })
  }, [])
}
