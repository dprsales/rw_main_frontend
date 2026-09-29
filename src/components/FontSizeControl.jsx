import { useEffect, useState } from 'react'
import { mono } from '../theme'

/**
 * Whole-site text-size control: three A's of increasing size (Small / Medium / Large).
 *
 * Small is the site's existing/default type scale. Medium and Large increase only
 * font sizes (not page zoom or spacing) and are persisted between visits. The
 * shared tokens use `--rw-fs`; the DOM pass below also covers legacy page styles and
 * inline font sizes so the setting works consistently across every route.
 */
const STORAGE_KEY = 'rw-fs-level'
const SCALE = [1, 1.12, 1.24] // Small/default, Medium, Large

// Elements that have been given a scaled inline size. We retain the authored inline
// value so selecting Small restores the original CSS exactly.
const scaledElements = new Map()

function restoreScaledElements() {
  scaledElements.forEach((record, element) => {
    if (element.isConnected) element.style.fontSize = record.inlineFontSize
    else scaledElements.delete(element)
  })
}

function applyDocumentScale(level) {
  const scale = SCALE[level] || SCALE[0]

  // Route changes remove nodes while the control remains mounted. Drop those
  // records so the shared map does not retain old page trees.
  scaledElements.forEach((record, element) => {
    if (!element.isConnected) scaledElements.delete(element)
  })

  // Small means the original site size. Do not leave overrides behind when the
  // visitor returns to the default setting.
  if (scale === 1) {
    restoreScaledElements()
    return
  }

  document.querySelectorAll('*').forEach((element) => {
    // Keep the selector buttons and wheel navigation at their designed UI sizes.
    // The wheel has its own viewport-aware typography and should not be treated as
    // ordinary page copy (especially on desktop/laptop screens).
    if (element.closest('.rw-fs-control, .rw-wheel-menu')) {
      const record = scaledElements.get(element)
      if (record) {
        element.style.fontSize = record.inlineFontSize
        scaledElements.delete(element)
      }
      return
    }

    let record = scaledElements.get(element)
    if (!record) {
      const computed = Number.parseFloat(window.getComputedStyle(element).fontSize)
      if (!Number.isFinite(computed) || computed <= 0) return
      record = {
        inlineFontSize: element.style.fontSize,
        baseFontSize: computed / scale,
      }
      scaledElements.set(element, record)
    }

    element.style.fontSize = `calc(${record.baseFontSize}px * var(--rw-fs, 1))`
  })
}

function readLevel() {
  try {
    const v = parseInt(localStorage.getItem(STORAGE_KEY), 10)
    return v === 1 || v === 2 ? v : 0
  } catch {
    return 0
  }
}

const OPTIONS = [
  { size: 12, label: 'Small text size (default)' },
  { size: 15, label: 'Medium text size' },
  { size: 18, label: 'Large text size' },
]

export default function FontSizeControl() {
  const [level, setLevel] = useState(readLevel)

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, String(level)) } catch { /* storage blocked */ }
    document.documentElement.style.setProperty('--rw-fs', String(SCALE[level]))

    // Tokenized styles update from the variable; this pass catches older inline/CSS
    // font sizes too, including numeric content and components on other pages.
    applyDocumentScale(level)

    let resizeTimer
    const handleResize = () => {
      window.clearTimeout(resizeTimer)
      resizeTimer = window.setTimeout(() => {
        if (SCALE[level] === 1) return

        // Re-read responsive CSS at the new viewport width before scaling it. This
        // prevents a resize from freezing a font at the previous breakpoint size.
        restoreScaledElements()
        scaledElements.forEach((record, element) => {
          if (!element.isConnected) return
          const computed = Number.parseFloat(window.getComputedStyle(element).fontSize)
          if (Number.isFinite(computed) && computed > 0) record.baseFontSize = computed / SCALE[level]
        })
        applyDocumentScale(level)
      }, 120)
    }

    const observer = new MutationObserver(() => applyDocumentScale(level))
    if (document.body) observer.observe(document.body, { childList: true, subtree: true })
    window.addEventListener('resize', handleResize, { passive: true })

    return () => {
      window.clearTimeout(resizeTimer)
      observer.disconnect()
      window.removeEventListener('resize', handleResize)
    }
  }, [level])

  return (
    <div className="rw-fs-control" role="group" aria-label="Text size">
      {OPTIONS.map((opt, i) => (
        <button
          key={i}
          type="button"
          className={`rw-fs-btn${level === i ? ' is-on' : ''}`}
          style={{ fontFamily: mono, fontSize: opt.size }}
          aria-pressed={level === i}
          aria-label={opt.label}
          title={opt.label}
          disabled={level === i}
          onClick={() => setLevel(i)}
        >
          A
        </button>
      ))}
    </div>
  )
}
