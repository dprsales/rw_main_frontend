import { useCallback, useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Footer from '../components/Footer'
import Header from '../components/Header'
import PageIntro from '../components/PageIntro'
import Reveal from '../components/Reveal'
import Seo from '../components/Seo'
import { useLang } from '../i18n/LangProvider'
import { useSmoothScroll } from '../hooks/useSmoothScroll'
import {
  GALLERY_SECTIONS,
  formatViewCount,
  gallerySectionById,
  mapGalleryPhoto,
  youtubeEmbedUrl,
  youtubeThumbUrl,
  youtubeWatchUrl,
} from '../data/gallery'
import { fetchGalleryPhotos } from '../data/api'
import { FOOTER_LINKS, mono } from '../theme'
import { container, eyebrow, fs, note } from '../styles'

function VideoCard({ video, featured, t }) {
  const [playing, setPlaying] = useState(false)
  const views = formatViewCount(video.views)
  const meta = video.likes
    ? t('gallery.metaLikes', { views, likes: video.likes })
    : t('gallery.metaViews', { views })

  return (
    <article className={`rw-yt-card${featured ? ' is-featured' : ''}`}>
      <div className="rw-yt-frame">
        {playing ? (
          <iframe
            title={video.title}
            src={youtubeEmbedUrl(video.id)}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            loading="lazy"
          />
        ) : (
          <button
            type="button"
            className="rw-yt-poster"
            onClick={() => setPlaying(true)}
            aria-label={t('gallery.play', { title: video.title })}
          >
            <img src={youtubeThumbUrl(video.id)} alt="" loading="lazy" decoding="async" />
            <span className="rw-yt-play" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
                <path d="M8 5.5v13l11-6.5L8 5.5Z" />
              </svg>
            </span>
            {video.long ? <span className="rw-yt-badge">{t('gallery.long')}</span> : null}
          </button>
        )}
      </div>
      <div className="rw-yt-body">
        <h3 className="rw-yt-title">
          <a href={youtubeWatchUrl(video.id)} target="_blank" rel="noreferrer">
            {video.title}
          </a>
        </h3>
        <p className="rw-yt-meta">{meta}</p>
      </div>
    </article>
  )
}

function YoutubeBlock({ items, t }) {
  const featured = items.find((row) => row.long) || items[0]
  const rest = items.filter((row) => row.id !== featured?.id)
  if (!featured) return null

  return (
    <div className="rw-yt-grid">
      <Reveal delay={80} className="rw-yt-featured">
        <VideoCard video={featured} featured t={t} />
      </Reveal>
      {rest.map((video, i) => (
        <Reveal key={video.id} delay={100 + (i % 3) * 50}>
          <VideoCard video={video} t={t} />
        </Reveal>
      ))}
    </div>
  )
}

function ImagesBlock({ items, emptyKey, t }) {
  const [open, setOpen] = useState(null)
  const close = useCallback(() => setOpen(null), [])
  const move = useCallback(
    (dir) =>
      setOpen((i) => (i === null ? i : (i + dir + items.length) % items.length)),
    [items.length],
  )

  useEffect(() => {
    if (open === null) return
    const onKey = (e) => {
      if (e.key === 'Escape') close()
      else if (e.key === 'ArrowRight') move(1)
      else if (e.key === 'ArrowLeft') move(-1)
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [open, close, move])

  if (!items?.length) {
    return (
      <Reveal>
        <p className="rw-gallery-empty" style={{ ...note, fontFamily: mono, fontSize: fs('14px') }}>
          {t(emptyKey || 'gallery.team.empty')}
        </p>
      </Reveal>
    )
  }

  const active = open === null ? null : items[open]

  return (
    <>
      <div className="rw-side-grid">
        {items.map((item, i) => (
          <Reveal key={item.id || item.src || i} delay={(i % 3) * 50}>
            <button
              type="button"
              className="rw-side-card"
              onClick={() => setOpen(i)}
              aria-label={t('gallery.preview', { title: item.title || item.alt || 'photo' })}
            >
              <figure className="rw-side-figure">
                <img src={item.src} alt={item.alt || item.title || ''} loading="lazy" decoding="async" />
                {(item.title || item.caption) && (
                  <figcaption className="rw-side-caption">
                    {item.title ? <span className="rw-side-title">{item.title}</span> : null}
                    {item.caption ? <span className="rw-side-note">{item.caption}</span> : null}
                  </figcaption>
                )}
              </figure>
            </button>
          </Reveal>
        ))}
      </div>

      {active ? (
        <div className="rw-side-lightbox" onClick={close} role="dialog" aria-modal="true">
          <button type="button" className="rw-side-lightbox-btn is-close" onClick={close} aria-label={t('gallery.close')}>
            ✕
          </button>
          <div className="rw-side-lightbox-stage" onClick={(e) => e.stopPropagation()}>
            <img src={active.src} alt={active.alt || active.title || ''} />
            <div className="rw-side-lightbox-bar">
              <div className="rw-side-lightbox-copy">
                {active.title ? <div className="rw-side-lightbox-title">{active.title}</div> : null}
                {active.caption ? <p className="rw-side-lightbox-note">{active.caption}</p> : null}
              </div>
              <div className="rw-side-lightbox-actions">
                <span className="rw-side-lightbox-count">
                  {String(open + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}
                </span>
                <button type="button" className="rw-side-lightbox-btn" onClick={() => move(-1)} aria-label={t('gallery.prev')}>
                  ←
                </button>
                <button type="button" className="rw-side-lightbox-btn" onClick={() => move(1)} aria-label={t('gallery.next')}>
                  →
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}

function SectionBody({ section, t }) {
  if (section.type === 'youtube') return <YoutubeBlock items={section.items} t={t} />
  if (section.type === 'images') return <ImagesBlock items={section.items} emptyKey={section.emptyKey} t={t} />
  return null
}

export default function Gallery() {
  const { t } = useLang()
  const { hash } = useLocation()
  const navigate = useNavigate()
  const scrollToId = useSmoothScroll()
  const hashId = String(hash || '').replace(/^#/, '')
  const initial = gallerySectionById(hashId).id
  const [active, setActive] = useState(initial)
  const [teamPhotos, setTeamPhotos] = useState([])

  useEffect(() => {
    setActive(gallerySectionById(hashId).id)
  }, [hashId])

  useEffect(() => {
    let cancelled = false
    fetchGalleryPhotos()
      .then((rows) => {
        if (cancelled) return
        const list = Array.isArray(rows) ? rows : rows?.data || []
        setTeamPhotos(list.map(mapGalleryPhoto).filter(Boolean))
      })
      .catch(() => {
        if (!cancelled) setTeamPhotos([])
      })
    return () => {
      cancelled = true
    }
  }, [])

  const sections = useMemo(
    () =>
      GALLERY_SECTIONS.map((row) =>
        row.id === 'team' ? { ...row, items: teamPhotos } : row,
      ),
    [teamPhotos],
  )

  const openSection = (id) => {
    setActive(id)
    navigate(`/gallery#${id}`, { replace: true })
    window.requestAnimationFrame(() => scrollToId(id))
  }

  return (
    <>
      <Seo route="/gallery" />
      <Header />

      <PageIntro
        eyebrow={t('gallery.eyebrow')}
        headline={[{ text: t('gallery.h1.a') }, { text: t('gallery.h1.b'), italic: true, copper: true }]}
        lede={t('gallery.lede')}
      />

      <div className="rw-pad" style={{ ...container, padding: '0 40px 18px' }}>
        <Reveal>
          <div className="rw-gallery-tabs" role="tablist" aria-label={t('gallery.tabs')}>
            {sections.map((row) => (
              <button
                key={row.id}
                type="button"
                role="tab"
                aria-selected={active === row.id}
                className={`rw-gallery-tab${active === row.id ? ' is-on' : ''}`}
                onClick={() => openSection(row.id)}
              >
                {t(row.labelKey)}
              </button>
            ))}
          </div>
        </Reveal>
      </div>

      {sections.map((row) => (
        <section
          key={row.id}
          id={row.id}
          hidden={active !== row.id}
          className="rw-pad rw-gallery-section"
          style={{ ...container, padding: '10px 40px var(--rw-sy-lg)' }}
        >
          <Reveal style={{ ...eyebrow, marginBottom: 14 }}>{t(row.eyebrowKey)}</Reveal>
          <Reveal as="h2" delay={60} className="rw-yt-heading">
            {t(row.titleKey)}
          </Reveal>
          <Reveal as="p" delay={100} style={{ ...note, marginTop: 12, maxWidth: '42em' }}>
            {t(row.introKey)}
          </Reveal>
          <div style={{ marginTop: 36 }}>
            <SectionBody section={row} t={t} />
          </div>
        </section>
      ))}

      <Footer links={FOOTER_LINKS} />
    </>
  )
}
