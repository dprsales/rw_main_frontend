import { useEffect, useMemo, useState } from 'react'
import { Download, ExternalLink, Search } from 'lucide-react'
import Footer from '../components/Footer'
import Header from '../components/Header'
import PageIntro from '../components/PageIntro'
import Reveal from '../components/Reveal'
import Seo from '../components/Seo'
import { useLang } from '../i18n/LangProvider'
import {
  CAROUSELS,
  driveDownloadUrl,
  driveThumbCandidates,
  driveViewUrl,
} from '../data/carousels'
import { FOOTER_LINKS, mono } from '../theme'
import { container, fs, note } from '../styles'

/** Public gallery ships October 2026 only. */
const OCTOBER = CAROUSELS.filter((item) => item.month === '2026-10')

function probeThumb(id) {
  const urls = driveThumbCandidates(id)
  return new Promise((resolve) => {
    let i = 0
    const tryNext = () => {
      if (i >= urls.length) {
        resolve(null)
        return
      }
      const url = urls[i++]
      const img = new Image()
      img.referrerPolicy = 'no-referrer'
      img.onload = () => {
        if (img.naturalWidth < 40 || img.naturalHeight < 40) tryNext()
        else resolve(url)
      }
      img.onerror = tryNext
      img.src = url
    }
    tryNext()
  })
}

function CarouselCard({ item, thumb, t }) {
  const view = driveViewUrl(item.id)
  const download = driveDownloadUrl(item.id)

  return (
    <article className="rw-cl-card">
      <a
        className="rw-cl-thumb"
        href={view}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${t('cl.view')}: ${item.title}`}
      >
        <img
          src={thumb}
          alt=""
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
        />
        <span className="rw-cl-date">{item.date}</span>
      </a>

      <div className="rw-cl-body">
        <h3 className="rw-cl-title">{item.title}</h3>
        <p className="rw-cl-meta">
          <span>{item.sizeLabel}</span>
          <span aria-hidden="true">·</span>
          <span>PDF</span>
        </p>
        <div className="rw-cl-actions">
          <a href={view} target="_blank" rel="noopener noreferrer" className="rw-cl-btn is-view">
            <ExternalLink size={14} strokeWidth={1.8} aria-hidden="true" />
            {t('cl.view')}
          </a>
          <a href={download} className="rw-cl-btn is-dl" download>
            <Download size={14} strokeWidth={1.8} aria-hidden="true" />
            {t('cl.download')}
          </a>
        </div>
      </div>
    </article>
  )
}

export default function ContentLibrary() {
  const { t } = useLang()
  const [query, setQuery] = useState('')
  const [thumbs, setThumbs] = useState({})
  const [probing, setProbing] = useState(true)

  useEffect(() => {
    let alive = true
    ;(async () => {
      const map = {}
      const batchSize = 8
      for (let i = 0; i < OCTOBER.length; i += batchSize) {
        if (!alive) return
        const slice = OCTOBER.slice(i, i + batchSize)
        const results = await Promise.all(slice.map(async (item) => [item.id, await probeThumb(item.id)]))
        for (const [id, url] of results) {
          if (url) map[id] = url
        }
        if (alive) setThumbs({ ...map })
      }
      if (alive) {
        setThumbs({ ...map })
        setProbing(false)
      }
    })()
    return () => { alive = false }
  }, [])

  const headline = useMemo(() => [
    { text: t('cl.h1.a') },
    { br: true },
    { text: t('cl.h1.b'), italic: true, copper: true },
  ], [t])

  const visibleCatalog = useMemo(
    () => OCTOBER.filter((item) => thumbs[item.id]),
    [thumbs],
  )

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return visibleCatalog
    return visibleCatalog.filter((item) => (
      item.title.toLowerCase().includes(q) || item.date.includes(q) || item.name.toLowerCase().includes(q)
    ))
  }, [visibleCatalog, query])

  return (
    <>
      <Seo route="/content-library" />
      <Header />

      <PageIntro
        eyebrow={t('cl.eyebrow')}
        headline={headline}
        lede={t('cl.lede')}
        intro={t('cl.intro')}
      />

      <section className="rw-pad rw-cl-section" style={{ ...container, padding: '10px 40px var(--rw-sy-lg)' }}>
        <div className="rw-cl-toolbar">
          <label className="rw-cl-search">
            <Search size={16} strokeWidth={1.7} aria-hidden="true" />
            <span className="sr-only">{t('cl.search')}</span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('cl.searchPh')}
              style={{ fontFamily: mono, fontSize: fs('13px') }}
            />
          </label>
        </div>

        <p className="rw-cl-showing" style={{ ...note, fontFamily: mono, fontSize: fs('12px'), letterSpacing: '.08em' }}>
          {probing && visibleCatalog.length === 0
            ? t('cl.loading')
            : t('cl.showing', { n: filtered.length, total: visibleCatalog.length })}
        </p>

        {probing && filtered.length === 0 ? (
          <p style={{ ...note, fontFamily: mono, fontSize: fs('13px'), letterSpacing: '.08em', marginTop: 28 }}>
            {t('cl.loading')}
          </p>
        ) : filtered.length === 0 ? (
          <p style={{ ...note, fontFamily: mono, fontSize: fs('13px'), letterSpacing: '.08em', marginTop: 28 }}>
            {t('cl.empty')}
          </p>
        ) : (
          <Reveal delay={60}>
            <div className="rw-cl-grid">
              {filtered.map((item) => (
                <CarouselCard key={item.id} item={item} thumb={thumbs[item.id]} t={t} />
              ))}
            </div>
          </Reveal>
        )}
      </section>

      <Footer links={FOOTER_LINKS} />
    </>
  )
}
