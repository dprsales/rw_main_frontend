import { useEffect, useState } from 'react'
import { VerifiedBadge } from './ui'
import { formatPrice, imgUrl, isRent, listingStrength, listingTitle, perSqft, sellingPoints } from '../format'

/**
 * Live buyer-facing preview. Updates on every keystroke so the builder sees
 * exactly how the card will look — plus auto-generated "why buyers will love it"
 * points and an honest "good to know" list built from the negative highlights.
 */
export default function PreviewCard({ data }) {
  const d = data || {}
  const images = (d.images || []).map(imgUrl).filter(Boolean)
  const [idx, setIdx] = useState(0)
  useEffect(() => { if (idx >= images.length) setIdx(0) }, [images.length, idx])

  const listing = { details: d, city: d.city, listingType: d.listingType }
  const rent = isRent(listing)
  const isPlot = d.propertyTypes?.[0] === 'Plot'
  const title = d.oneLineDescription || listingTitle(listing)
  const rate = perSqft(listing)
  const points = sellingPoints(d, d.listingType).slice(0, 6)
  const negatives = [...(d.negativeHighlights || []), ...(d.negativeNote ? [d.negativeNote] : [])]
  const { score, next } = listingStrength(d)
  const priceAdv = d.priceAdvantages?.[0]

  return (
    <aside className="lg:sticky lg:top-28">
      <p className="mb-2 flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.2em] text-gold-500">
        <span className="live-dot h-2 w-2 rounded-full bg-emerald-400" /> Live preview · how buyers see it
      </p>

      <div className="card overflow-hidden">
        {/* photo */}
        <div className="relative aspect-[16/10] bg-chip">
          {images.length ? (
            <img src={images[idx]} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-1 text-faded"
              style={{ background: 'radial-gradient(70% 70% at 50% 40%, rgba(195,155,83,.14), transparent)' }}>
              <span className="text-3xl">🖼️</span>
              <span className="text-xs">Your cover photo appears here</span>
            </div>
          )}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/25" />
          <VerifiedBadge className="absolute left-3 top-3" />
          <span className="absolute right-3 top-3 rounded-full bg-night/80 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-ink backdrop-blur">
            For {rent ? 'Rent' : 'Sale'}
          </span>
          {priceAdv && (
            <span className="absolute left-3 top-11 rounded-full bg-emerald-500/90 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white shadow">
              🏷️ {priceAdv}
            </span>
          )}
          {images.length > 1 && (
            <>
              <button type="button" aria-label="Previous photo" onClick={() => setIdx((i) => (i - 1 + images.length) % images.length)}
                className="absolute left-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-night/70 text-ink hover:bg-night">‹</button>
              <button type="button" aria-label="Next photo" onClick={() => setIdx((i) => (i + 1) % images.length)}
                className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-night/70 text-ink hover:bg-night">›</button>
              <span className="absolute bottom-3 right-3 rounded bg-night/75 px-2 py-0.5 text-[11px] text-ink">📷 {idx + 1}/{images.length}</span>
            </>
          )}
          <div className="absolute bottom-3 left-3">
            <p className="font-serif text-2xl leading-none text-white drop-shadow">{formatPrice(d.price, { perMonth: rent })}</p>
            {rate && <p className="mt-1 text-[11px] text-white/80">{rate}</p>}
          </div>
        </div>

        {/* body */}
        <div className="p-4">
          <p className="text-[10px] uppercase tracking-[0.16em] text-gold-500">
            {[d.propertyTypes?.[0], d.possessionStatus].filter(Boolean).join(' · ') || 'Property type · Possession'}
          </p>
          <h3 className="mt-1 line-clamp-2 font-serif text-xl leading-snug text-ink">{title}</h3>
          <p className="mt-1 text-xs text-faded">📍 {[d.locality, d.city].filter(Boolean).join(', ') || 'Locality, City'}</p>

          <div className="mt-3 grid grid-cols-3 divide-x divide-line rounded-md border border-line bg-night/40 text-center">
            {[
              ['Config', isPlot ? 'Plot' : d.bhk],
              ['Area', d.areaSize && `${d.areaSize} ${d.areaUnit || 'sq.ft'}`],
              ['Furnish', d.furnishingStatus],
            ].map(([k, v]) => (
              <div key={k} className="px-1.5 py-2">
                <p className="text-[9px] uppercase tracking-[0.14em] text-faded">{k}</p>
                <p className="mt-0.5 truncate text-[13px] text-ink">{v || '—'}</p>
              </div>
            ))}
          </div>

          {/* why buyers will love it */}
          <div className="mt-3 rounded-md border border-gold-500/30 bg-gold-500/[0.06] p-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gold-300">✨ Why buyers will love it</p>
            {points.length ? (
              <ul className="mt-2 grid grid-cols-1 gap-x-3 gap-y-1.5 text-[13px] text-ink sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                {points.map((p) => (
                  <li key={p.text} className="flex items-start gap-1.5"><span className="shrink-0">{p.icon}</span><span className="leading-snug">{p.text}</span></li>
                ))}
              </ul>
            ) : (
              <p className="mt-1.5 text-xs text-faded">Fill in possession, highlights, amenities and nearby places — standout points appear here automatically.</p>
            )}
          </div>

          {/* honest disclosure */}
          {negatives.length > 0 && (
            <div className="mt-2.5 rounded-md border border-amber-400/30 bg-amber-400/[0.06] p-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-amber-300">⚠ Good to know</p>
              <ul className="mt-1.5 space-y-1 text-xs text-amber-100/90">
                {negatives.slice(0, 5).map((n) => <li key={n}>· {n}</li>)}
                {negatives.length > 5 && <li className="text-amber-300/80">+{negatives.length - 5} more</li>}
              </ul>
            </div>
          )}
        </div>

        {/* strength */}
        <div className="border-t border-line bg-night/40 px-4 py-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-faded">Listing strength</span>
            <span className="font-semibold text-gold-300">{score}/100</span>
          </div>
          <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-chip">
            <div className="h-full rounded-full transition-all duration-500" style={{ width: `${score}%`, background: 'linear-gradient(90deg,#A67C3D,#E8C97A,#C39B53)' }} />
          </div>
          {next && <p className="mt-1.5 text-[11px] text-faded">Next boost: <span className="text-ink">{next.label}</span> — {next.tip}</p>}
        </div>
      </div>
    </aside>
  )
}
