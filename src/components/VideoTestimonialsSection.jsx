import { useCallback, useEffect, useId, useRef, useState } from 'react'
import SectionHead from './SectionHead'
import {
  VIDEO_TESTIMONIALS,
  youtubeEmbedSrc,
  youtubeThumb,
} from '../data/videoTestimonials'
import { useLang } from '../i18n/LangProvider'
import { mono } from '../theme'
import { container, sectionRule } from '../styles'
import lockup from '../assets/site/gold1.png'

const SWIPE_MIN = 48

function Chevron({ dir = 'next' }) {
  return (
    <svg width="18" height="18" viewBox="0 0 16 16" fill="none" aria-hidden>
      {dir === 'prev' ? (
        <path d="M10 3.2 5.6 8 10 12.8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      ) : (
        <path d="M6 3.2 10.4 8 6 12.8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      )}
    </svg>
  )
}

/**
 * Home: Dribbble-style spotlight film slider.
 * Centre active film, narrow side strips, prev/next + swipe + dots.
 */
export default function VideoTestimonialsSection() {
  const { t } = useLang()
  const labelId = useId()
  const items = VIDEO_TESTIMONIALS
  const rootRef = useRef(null)
  const stageRef = useRef(null)
  const swipeRef = useRef({ x: 0, y: 0, active: false })
  const len = items.length

  const [active, setActive] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [paused, setPaused] = useState(false)
  const [reduced, setReduced] = useState(false)
  const [inView, setInView] = useState(true)

  const wrap = useCallback((i) => ((i % len) + len) % len, [len])

  const go = useCallback((i) => {
    setPlaying(false)
    setActive(wrap(i))
  }, [wrap])

  const step = useCallback((dir) => go(active + dir), [active, go])

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReduced(mq.matches)
    sync()
    mq.addEventListener?.('change', sync)
    return () => mq.removeEventListener?.('change', sync)
  }, [])

  useEffect(() => {
    const root = rootRef.current
    if (!root || typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting)
        if (!entry.isIntersecting) setPlaying(false)
      },
      { threshold: 0.2 },
    )
    io.observe(root)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (reduced || paused || playing || !inView) return
    const timer = window.setTimeout(() => step(1), 2000)
    return () => window.clearTimeout(timer)
  }, [active, reduced, paused, playing, inView, step])

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const onKey = (e) => {
      if (!root.contains(document.activeElement)) return
      if (e.key === 'ArrowLeft') { e.preventDefault(); step(-1) }
      if (e.key === 'ArrowRight') { e.preventDefault(); step(1) }
    }
    root.addEventListener('keydown', onKey)
    return () => root.removeEventListener('keydown', onKey)
  }, [step])

  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return

    const onStart = (e) => {
      if (e.target.closest('button, a, iframe, input, textarea')) return
      const point = e.touches ? e.touches[0] : e
      swipeRef.current = { x: point.clientX, y: point.clientY, active: true }
    }

    const onEnd = (e) => {
      if (!swipeRef.current.active) return
      swipeRef.current.active = false
      const point = e.changedTouches ? e.changedTouches[0] : e
      const dx = point.clientX - swipeRef.current.x
      const dy = point.clientY - swipeRef.current.y
      if (Math.abs(dx) < SWIPE_MIN || Math.abs(dx) < Math.abs(dy)) return
      step(dx < 0 ? 1 : -1)
    }

    stage.addEventListener('touchstart', onStart, { passive: true })
    stage.addEventListener('touchend', onEnd, { passive: true })
    stage.addEventListener('pointerdown', onStart)
    stage.addEventListener('pointerup', onEnd)
    return () => {
      stage.removeEventListener('touchstart', onStart)
      stage.removeEventListener('touchend', onEnd)
      stage.removeEventListener('pointerdown', onStart)
      stage.removeEventListener('pointerup', onEnd)
    }
  }, [step])

  const slots = [-2, -1, 0, 1, 2]
  const activeItem = items[active]
  const activeName = t(activeItem.labelKey)
  const activeRole = t(activeItem.roleKey)

  return (
    <section
      id="video-voices"
      ref={rootRef}
      className="rw-film-band"
      style={{ ...sectionRule, borderTop: 'none' }}
      aria-labelledby={labelId}
      aria-roledescription="carousel"
      tabIndex={0}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setPaused(false)
      }}
    >
      <div className="rw-pad" style={{ ...container, padding: 'clamp(48px, 6vw, 88px) 40px' }}>
        <div className="rw-film-head">
          <div className="rw-film-head-copy">
            <SectionHead
              eyebrow={t('home.videos.eyebrow')}
              title={t('home.videos.title.a')}
              titleAccent={t('home.videos.title.b')}
              titleWidth="14em"
              space={16}
            />
            <p className="rw-film-lede" id={labelId}>
              {t('home.videos.lede')}
            </p>
          </div>
          <div className="rw-film-toolbar">
            <span className="rw-film-count" style={{ fontFamily: mono }}>
              {String(active + 1).padStart(2, '0')}
              <span className="rw-film-count-sep">/</span>
              {String(len).padStart(2, '0')}
            </span>
          </div>
        </div>

        <div className="rw-film-stage" ref={stageRef}>
          <div className="rw-film-spotlight" role="list" aria-label={t('home.videos.rail')}>
            {slots.map((offset) => {
              const index = wrap(active + offset)
              const item = items[index]
              const name = t(item.labelKey)
              const role = t(item.roleKey)
              const isActive = offset === 0
              const side = offset < 0 ? 'left' : offset > 0 ? 'right' : 'center'
              const depth = Math.abs(offset)

              if (isActive) {
                return (
                  <article
                    key={`active-${item.id}`}
                    className={`rw-film-card rw-film-card--active${playing ? ' is-playing' : ''}`}
                    role="listitem"
                    aria-current="true"
                  >
                    <div className="rw-film-frame">
                      {playing ? (
                        <iframe
                          className="rw-film-media rw-film-embed"
                          src={youtubeEmbedSrc(item.youtubeId, { autoplay: true })}
                          title={`${activeName}, ${activeRole}`}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                          loading="lazy"
                          referrerPolicy="strict-origin-when-cross-origin"
                        />
                      ) : (
                        <>
                          <img
                            className="rw-film-media rw-film-thumb"
                            src={youtubeThumb(item.youtubeId, 'hqdefault')}
                            alt=""
                            loading="lazy"
                            decoding="async"
                          />
                          <button
                            type="button"
                            className="rw-film-play"
                            aria-label={t('home.videos.play', { n: String(active + 1) })}
                            onClick={() => setPlaying(true)}
                          >
                            <span className="rw-film-play-ring">
                              <span className="rw-film-play-glyph" aria-hidden />
                            </span>
                          </button>
                        </>
                      )}
                      <div className="rw-film-active-meta" style={{ fontFamily: mono }}>
                        <div className="rw-film-active-copy">
                          <span className="rw-film-active-name">{activeName}</span>
                          <span className="rw-film-active-role">{activeRole}</span>
                        </div>
                        <img
                          className="rw-film-active-mark"
                          src={lockup}
                          alt=""
                          aria-hidden
                        />
                      </div>
                      <div className="rw-film-progress" aria-hidden>
                        <span className={`rw-film-progress-bar${playing ? ' is-on' : ''}`} />
                      </div>
                    </div>
                  </article>
                )
              }

              return (
                <button
                  key={`${side}-${depth}-${item.id}`}
                  type="button"
                  className={`rw-film-card rw-film-card--side rw-film-card--${side} rw-film-card--d${depth}`}
                  role="listitem"
                  aria-label={`${name}, ${role}. ${offset < 0 ? t('home.videos.prev') : t('home.videos.next')}`}
                  onClick={() => go(index)}
                >
                  <img
                    className="rw-film-media rw-film-thumb"
                    src={youtubeThumb(item.youtubeId, 'hqdefault')}
                    alt=""
                    loading="lazy"
                    decoding="async"
                  />
                  <span className="rw-film-side-shade" aria-hidden />
                  <span className="rw-film-side-name" style={{ fontFamily: mono }}>
                    {name}
                  </span>
                </button>
              )
            })}
          </div>

          <div className="rw-film-slider-nav" role="group" aria-label={t('home.videos.nav')}>
            <button
              type="button"
              className="rw-film-nav-btn"
              aria-label={t('home.videos.prev')}
              onClick={() => step(-1)}
            >
              <Chevron dir="prev" />
            </button>
            <div className="rw-film-dots" role="tablist" aria-label={t('home.videos.rail')}>
              {items.map((item, i) => (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  className={`rw-film-dot${i === active ? ' is-on' : ''}`}
                  aria-selected={i === active}
                  aria-label={`${t(item.labelKey)}, ${String(i + 1).padStart(2, '0')} of ${String(len).padStart(2, '0')}`}
                  onClick={() => go(i)}
                />
              ))}
            </div>
            <button
              type="button"
              className="rw-film-nav-btn"
              aria-label={t('home.videos.next')}
              onClick={() => step(1)}
            >
              <Chevron dir="next" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
