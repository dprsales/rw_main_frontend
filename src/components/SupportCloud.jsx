import { useCallback, useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { SUPPORT_SERVICES } from '../data/content'
import { useLang } from '../i18n/LangProvider'
import { mono, serif } from '../theme'

/** Support services as a chip cloud. Desktop wraps; mobile is a rail with scroll cues. */
export default function SupportCloud() {
  const { t } = useLang()
  const [active, setActive] = useState(0)
  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(false)
  const [overflow, setOverflow] = useState(false)
  const [progress, setProgress] = useState(0)
  const [hintSeen, setHintSeen] = useState(false)
  const chipRefs = useRef([])
  const railRef = useRef(null)

  const syncRail = useCallback(() => {
    const rail = railRef.current
    if (!rail) return
    const max = Math.max(0, rail.scrollWidth - rail.clientWidth)
    const left = rail.scrollLeft
    setOverflow(max > 8)
    setCanPrev(left > 4)
    setCanNext(left < max - 4)
    setProgress(max > 0 ? left / max : 0)
    if (left > 12) setHintSeen(true)
  }, [])

  useEffect(() => {
    const rail = railRef.current
    if (!rail) return undefined
    syncRail()
    rail.addEventListener('scroll', syncRail, { passive: true })
    window.addEventListener('resize', syncRail)
    return () => {
      rail.removeEventListener('scroll', syncRail)
      window.removeEventListener('resize', syncRail)
    }
  }, [syncRail])

  useEffect(() => {
    const el = chipRefs.current[active]
    const rail = railRef.current
    if (!el || !rail) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const left = el.offsetLeft - (rail.clientWidth - el.offsetWidth) / 2
    rail.scrollTo({ left: Math.max(0, left), behavior: reduced ? 'auto' : 'smooth' })
  }, [active])

  const step = (dir) => {
    setActive((i) => Math.min(SUPPORT_SERVICES.length - 1, Math.max(0, i + dir)))
    setHintSeen(true)
  }

  const total = SUPPORT_SERVICES.length
  const showHint = overflow && !hintSeen && canNext

  return (
    <div className="rw-support-cloud">
      <div
        className={[
          'rw-chips-shell',
          overflow ? 'is-overflow' : '',
          canPrev ? 'can-left' : '',
          canNext ? 'can-right' : '',
        ].filter(Boolean).join(' ')}
      >
        <div
          ref={railRef}
          className="rw-chips"
          role="group"
          aria-label={t('home.more.title')}
        >
          {SUPPORT_SERVICES.map((svc, i) => (
            <button
              key={svc.title}
              type="button"
              ref={(node) => { chipRefs.current[i] = node }}
              className={`rw-chip${i === active ? ' is-on' : ''}`}
              style={{ fontFamily: mono }}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              onClick={() => setActive(i)}
              aria-pressed={i === active}
            >
              {t(`home.more.${i}.title`)}
            </button>
          ))}
        </div>

        <div className="rw-chips-chrome" hidden={!overflow}>
          <button
            type="button"
            className="rw-chips-nav"
            onClick={() => step(-1)}
            disabled={!canPrev && active === 0}
            aria-label={t('home.more.prev')}
          >
            <ChevronLeft size={18} strokeWidth={1.75} aria-hidden="true" />
          </button>

          <p className="rw-chips-hint" style={{ fontFamily: mono }} aria-live="polite">
            {showHint ? t('home.more.swipe') : t('home.more.position', {
              n: String(active + 1).padStart(2, '0'),
              total: String(total).padStart(2, '0'),
            })}
          </p>

          <button
            type="button"
            className={`rw-chips-nav${canNext || active < total - 1 ? ' is-pulse' : ''}`}
            onClick={() => step(1)}
            disabled={!canNext && active === total - 1}
            aria-label={t('home.more.next')}
          >
            <ChevronRight size={18} strokeWidth={1.75} aria-hidden="true" />
          </button>
        </div>

        <div
          className="rw-chips-progress"
          hidden={!overflow}
          role="presentation"
          aria-hidden="true"
        >
          <span style={{ transform: `scaleX(${Math.max(0.12, progress || 0.12)})` }} />
        </div>
      </div>

      <div className="rw-chip-caption" aria-live="polite">
        <span className="rw-chip-caption-num" style={{ fontFamily: mono }}>
          {String(active + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
        </span>
        <div className="rw-chip-caption-stack">
          {SUPPORT_SERVICES.map((svc, i) => (
            <p
              key={svc.title}
              className={`rw-chip-caption-text${i === active ? ' is-on' : ''}`}
              style={{ fontFamily: serif }}
              aria-hidden={i !== active}
            >
              <span className="rw-chip-caption-label" style={{ fontFamily: mono }}>{t(`home.more.${i}.title`)}</span>
              {t(`home.more.${i}.desc`)}
            </p>
          ))}
        </div>
      </div>
    </div>
  )
}
