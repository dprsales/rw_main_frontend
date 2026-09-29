import { useEffect, useState } from 'react'
import { mono } from '../theme'

/**
 * Whole-site text-size control: three A's of increasing size (Default / Large / Larger).
 *
 * Scales FONT SIZE ONLY (not the layout, unlike page zoom) by setting the `--rw-fs`
 * multiplier on the document root. The site's type flows through the shared tokens in
 * styles.js, whose font sizes are `calc(var(--rw-fs, 1) * …)`, so raising the multiplier
 * enlarges every token-driven heading and paragraph at once. The chosen level persists
 * in localStorage and is applied pre-paint by a small inline script in index.html, so a
 * returning visitor never sees a flash at the default size.
 */
const STORAGE_KEY = 'rw-fs-level'
const SCALE = [1, 1.12, 1.24] // Default, Large, Larger

function readLevel() {
  try {
    const v = parseInt(localStorage.getItem(STORAGE_KEY), 10)
    return v === 1 || v === 2 ? v : 0
  } catch {
    return 0
  }
}

const OPTIONS = [
  { size: 12, label: 'Default text size' },
  { size: 15, label: 'Large text size' },
  { size: 18, label: 'Larger text size' },
]

export default function FontSizeControl() {
  const [level, setLevel] = useState(readLevel)

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, String(level)) } catch { /* storage blocked */ }
    // Set on documentElement so every token's calc(var(--rw-fs) * …) inherits it, even
    // through inline styles deep in the tree.
    document.documentElement.style.setProperty('--rw-fs', String(SCALE[level]))
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
          onClick={() => setLevel(i)}
        >
          A
        </button>
      ))}
    </div>
  )
}
