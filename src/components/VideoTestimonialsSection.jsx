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

/**
 * Home: Dribbble-style spotlight film rail.
 * Center active film, narrow side strips with vertical names + neighbor arrows.
 */
export default function VideoTestimonialsSection() {
  const { t } = useLang()
  const labelId = useId()
  const items = VIDEO_TESTIMONIALS
  const rootRef = useRef(null)
  const len = items.length

  const [active, setActive] = useState(0)
  const [playing, setPlaying] = useState(false)

  const wrap = useCallback((i) => ((i % len) + len) % len, [len])

  const go = useCallback((i) => {
    setPlaying(false)
    setActive(wrap(i))
  }, [wrap])

  const step = useCallback((dir) => go(active + dir), [active, go])

  useEffect(() => {
    const root = rootRef.current
    if (!root || typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver(
      ([entry]) => { if (!entry.isIntersecting) setPlaying(false) },
      { threshold: 0.05 },
    )
    io.observe(root)
    return () => io.disconnect()
  }, [])

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

      </div>
    </section>
  )
}
