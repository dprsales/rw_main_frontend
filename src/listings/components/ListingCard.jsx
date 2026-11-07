import { useState } from 'react'
import { Link } from 'react-router-dom'
import { VerifiedBadge } from './ui'
import { formatPrice, imgUrl, isRent, listingTitle, perSqft, timeAgo } from '../format'
import { useLang } from '../../i18n/LangProvider'

const isFresh = (iso) => iso && Date.now() - new Date(iso).getTime() < 7 * 86400000

/** Compact property card: photo, price overlay, key specs, selling points, CTA. */
export default function ListingCard({ project, layout = 'grid' }) {
  const { t } = useLang()
  const d = project.details || {}
  const images = (d.images || []).map(imgUrl).filter(Boolean)
  const [idx, setIdx] = useState(0)
  const href = `/realty/listings/${project.slug || project._id}`
  const title = d.oneLineDescription || project.title || listingTitle(project)
  const rate = perSqft(project)
  const rent = isRent(project)
  const posted = project.approvedAt || project.createdAt
  const isPlot = d.propertyTypes?.[0] === 'Plot'
  const notes = (d.negativeHighlights?.length || 0) + (d.negativeNote ? 1 : 0)
  const row = layout === 'row'

  const step = (e, dir) => {
    e.preventDefault()
    e.stopPropagation()
    setIdx((i) => (i + dir + images.length) % images.length)
  }

  return (
    <Link
      to={href}
      className={`group card flex overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:border-gold-500/40 hover:shadow-lift ${row ? 'flex-col md:flex-row' : 'flex-col'}`}
    >
      {/* photo */}
      <div className={`relative shrink-0 overflow-hidden bg-chip ${row ? 'aspect-[16/11] md:aspect-auto md:w-[300px] lg:w-[340px]' : 'aspect-[16/11]'}`}>
        {images.length ? (
          <img src={images[idx]} alt={title} loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
        ) : (
          <div className="flex h-full w-full items-center justify-center font-serif text-xl text-faded">No photo</div>
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/5 to-black/30" />

        <div className="absolute left-2.5 top-2.5 flex flex-col items-start gap-1.5">
          <VerifiedBadge />
          {d.priceAdvantages?.[0] && (
            <span className="rounded-full bg-emerald-500/90 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white shadow">
              🏷️ {d.priceAdvantages[0]}
            </span>
          )}
        </div>
        <div className="absolute right-2.5 top-2.5 flex items-center gap-1.5">
          {isFresh(posted) && (
            <span className="rounded-full bg-gold-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-night">New</span>
          )}
          <span className="rounded-full bg-night/80 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-ink backdrop-blur">
            {rent ? 'Rent' : 'Sale'}
          </span>
        </div>

        {images.length > 1 && (
          <>
            <button type="button" aria-label="Previous photo" onClick={(e) => step(e, -1)}
              className="absolute left-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-night/70 text-ink opacity-0 transition-opacity hover:bg-night group-hover:opacity-100">‹</button>
            <button type="button" aria-label="Next photo" onClick={(e) => step(e, 1)}
              className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-night/70 text-ink opacity-0 transition-opacity hover:bg-night group-hover:opacity-100">›</button>
            <span className="absolute bottom-2.5 right-2.5 rounded bg-night/75 px-1.5 py-0.5 text-[11px] text-ink">📷 {idx + 1}/{images.length}</span>
          </>
        )}
        <div className="absolute bottom-2.5 left-3">
          <p className="font-serif text-[26px] font-medium leading-none text-white drop-shadow">{formatPrice(d.price, { perMonth: rent })}</p>
          {rate && <p className="mt-1 text-[11px] text-white/80">{rate}</p>}
        </div>
      </div>

      {/* body */}
      <div className="flex flex-1 flex-col p-4">
        <p className="truncate text-[10px] uppercase tracking-[0.16em] text-gold-500">
          {[project.propertyType || d.propertyTypes?.[0], d.possessionStatus].filter(Boolean).join(' · ')}
        </p>
        <h3 className="mt-1 line-clamp-2 font-serif text-xl leading-snug text-ink">{title}</h3>
        <p className="mt-1 truncate text-[13px] text-faded">📍 {[d.projectName, d.locality, project.city].filter(Boolean).slice(0, 3).join(', ')}</p>

        <div className="mt-3 grid grid-cols-3 divide-x divide-line rounded-md border border-line bg-night/40 text-center">
          <Spec label={t('listings.spec.config')} value={isPlot ? t('listings.spec.plot') : d.bhk} />
          <Spec label={t('listings.spec.area')} value={d.areaSize ? `${d.areaSize} ${d.areaUnit || 'sq.ft'}` : null} />
          <Spec label={t('listings.spec.furnish')} value={d.furnishingStatus} />
        </div>

        {(d.propertyHighlights?.length > 0 || notes > 0) && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {(d.propertyHighlights || []).slice(0, 2).map((h) => (
              <span key={h} className="max-w-full truncate rounded-full border border-gold-500/40 bg-gold-500/10 px-2.5 py-0.5 text-[11px] text-gold-300">✦ {h}</span>
            ))}
            {d.propertyHighlights?.length > 2 && <span className="rounded-full px-1.5 py-0.5 text-[11px] text-faded">+{d.propertyHighlights.length - 2}</span>}
            {notes > 0 && (
              <span title="Seller has disclosed points to note" className="rounded-full border border-amber-400/40 px-2.5 py-0.5 text-[11px] text-amber-300">⚠ {notes} to note</span>
            )}
          </div>
        )}

        <div className="mt-auto flex items-center justify-between pt-3.5">
          <span className="text-[11px] text-faded">Posted {timeAgo(posted)}</span>
          <span className="text-[13px] font-medium text-gold-300 transition-transform group-hover:translate-x-1">View details →</span>
        </div>
      </div>
    </Link>
  )
}

function Spec({ label, value }) {
  return (
    <div className="px-1.5 py-2">
      <p className="text-[9px] uppercase tracking-[0.14em] text-faded">{label}</p>
      <p className="mt-0.5 truncate text-[13px] text-ink">{value || '—'}</p>
    </div>
  )
}

export function ListingCardSkeleton() {
  return (
    <div className="card overflow-hidden">
      <div className="skeleton aspect-[16/11]" />
      <div className="space-y-2.5 p-4">
        <div className="skeleton h-3 w-1/3 rounded" />
        <div className="skeleton h-5 w-4/5 rounded" />
        <div className="skeleton h-3.5 w-1/2 rounded" />
        <div className="skeleton h-11 w-full rounded" />
      </div>
    </div>
  )
}
