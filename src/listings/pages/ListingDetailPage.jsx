import { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import ListingsShell from '../components/ListingsShell'
import ListingCard from '../components/ListingCard'
import { ErrorNote, VerifiedBadge } from '../components/ui'
import { getProject, sendEnquiry } from '../api'
import { floorLabel, formatPrice, imgUrl, isRent, listingTitle, perSqft, sellingPoints, timeAgo } from '../format'
import { AMENITY_GROUPS, LOCATION_ADVANTAGES } from '../options'

const OVERVIEW = [
  ['Configuration', (d) => d.bhk],
  ['Property type', (d) => d.propertyTypes?.join(', ')],
  ['Area', (d) => d.areaSize && `${d.areaSize} ${d.areaUnit || 'sq.ft'}${d.areaType ? ` · ${d.areaType}` : ''}`],
  ['Possession', (d) => d.possessionStatus === 'Under Construction' && d.possessionDate ? `By ${new Date(d.possessionDate + '-01').toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}` : d.possessionStatus],
  ['Age of property', (d) => d.propertyAge && `${d.propertyAge} years`],
  ['Furnishing', (d) => d.furnishingStatus],
  ['Bathrooms', (d) => d.bathrooms],
  ['Covered parking', (d) => d.coveredParking],
  ['Open parking', (d) => d.openParking],
  ['Balcony', (d) => d.balcony?.join(', ')],
  ['Facing', (d) => d.facing],
  ['View', (d) => d.view],
  ['Floor', (d) => d.floorNumber !== undefined && d.floorNumber !== '' && `${floorLabel(d.floorNumber)}${d.totalFloors ? ` of ${d.totalFloors}` : ''}`],
  ['Flooring', (d) => d.flooring],
  ['Power back-up', (d) => d.powerBackup],
  ['Transaction', (d) => d.transactionType],
  ['Ownership', (d) => d.ownershipType],
  ['Road width', (d) => d.roadWidth && `${d.roadWidth} ${d.roadWidthUnit || 'Feet'}`],
  ['Tower / Unit', (d) => [d.tower, d.unitNo].filter(Boolean).join(' / ')],
  ['Additional spaces', (d) => d.additionalSpaces?.join(', ')],
  ['Project', (d) => d.projectName],
  ['RERA', (d) => d.reraNumber],
  ['Price type', (d) => d.priceType],
]

export default function ListingDetailPage() {
  const { slug } = useParams()
  const [project, setProject] = useState(null)
  const [error, setError] = useState('')
  const [active, setActive] = useState(0)
  const [lightbox, setLightbox] = useState(false)
  const [tab, setTab] = useState('overview')
  const [more, setMore] = useState(false)
  const [showBar, setShowBar] = useState(true)
  const enquiryRef = useRef(null)

  useEffect(() => {
    setProject(null)
    setError('')
    setActive(0)
    setTab('overview')
    setMore(false)
    getProject(slug).then(setProject).catch((err) => setError(err.message))
  }, [slug])

  const images = (project?.details?.images || []).map(imgUrl).filter(Boolean)

  useEffect(() => {
    if (!lightbox) return undefined
    const onKey = (e) => {
      if (e.key === 'Escape') setLightbox(false)
      if (e.key === 'ArrowRight') setActive((i) => (i + 1) % images.length)
      if (e.key === 'ArrowLeft') setActive((i) => (i - 1 + images.length) % images.length)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightbox, images.length])

  // Hide the mobile "Enquire" bar once the form itself is on screen
  useEffect(() => {
    const el = enquiryRef.current
    if (!el || typeof IntersectionObserver === 'undefined') return undefined
    const io = new IntersectionObserver(([e]) => setShowBar(!e.isIntersecting), { threshold: 0.2 })
    io.observe(el)
    return () => io.disconnect()
  }, [project])

  if (error) {
    return (
      <ListingsShell title="Listing not available | RW Realty" noindex>
        <div className="mx-auto max-w-xl px-5 py-24 text-center">
          <p className="font-serif text-4xl text-ink">This listing isn't available</p>
          <p className="mt-3 text-faded">It may have been sold, removed, or is still awaiting verification.</p>
          <Link to="/list-property#listings" className="btn-primary mt-8">Browse listed properties</Link>
        </div>
      </ListingsShell>
    )
  }

  if (!project) {
    return (
      <ListingsShell title="Loading… | RW Realty">
        <div className="mx-auto max-w-[1320px] px-4 py-6 sm:px-8">
          <div className="skeleton h-[380px] w-full rounded-xl" />
          <div className="skeleton mt-5 h-9 w-2/3 rounded" />
          <div className="skeleton mt-3 h-5 w-1/3 rounded" />
        </div>
      </ListingsShell>
    )
  }

  const d = project.details || {}
  const title = d.oneLineDescription || project.title || listingTitle(project)
  const rent = isRent(project)
  const isPlot = d.propertyTypes?.[0] === 'Plot'
  const overview = OVERVIEW.map(([label, fn]) => [label, fn(d)]).filter(([, v]) => v)
  const amenities = AMENITY_GROUPS.map((g) => [g, d.amenities?.[g.key] || []]).filter(([, list]) => list.length)
  const locations = LOCATION_ADVANTAGES.map((l) => [l, d.locationAdvantages?.[l.key] || []]).filter(([, list]) => list.length)
  const rate = perSqft(project)
  const points = sellingPoints(d, project.listingType).slice(0, 8)
  const negatives = [...(d.negativeHighlights || []), ...(d.negativeNote ? [d.negativeNote] : [])]
  const longDesc = (d.description || '').length > 280

  const tabs = [
    ['overview', 'Overview'],
    overview.length && ['details', `Details`],
    amenities.length && ['amenities', 'Amenities'],
    locations.length && ['nearby', 'Nearby'],
    d.videos?.length && ['video', 'Video'],
  ].filter(Boolean)

  const goEnquire = () => enquiryRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })

  return (
    <ListingsShell title={`${title} | RW Realty`} description={(d.description || project.title || '').slice(0, 160)}>
      <div className="mx-auto max-w-[1320px] px-4 pb-24 pt-4 sm:px-8 lg:pb-10">
        <nav className="mb-3 flex flex-wrap items-center gap-x-1.5 text-xs text-faded">
          <Link to="/realty" className="hover:text-gold-300">RW Realty</Link> <span>/</span>
          <Link to="/list-property#listings" className="hover:text-gold-300">Listed properties</Link> <span>/</span>
          <span className="text-ink">{[d.locality, project.city].filter(Boolean).join(', ')}</span>
        </nav>

        {/* Gallery */}
        <div className="grid grid-cols-1 gap-1.5 overflow-hidden rounded-xl md:grid-cols-4 md:grid-rows-2 md:h-[420px]">
          <button onClick={() => setLightbox(true)} className="relative col-span-1 aspect-[16/10] overflow-hidden bg-chip md:col-span-3 md:row-span-2 md:aspect-auto">
            {images[active] && <img src={images[active]} alt={title} className="h-full w-full object-cover" />}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            <VerifiedBadge className="absolute left-3 top-3" />
            {images.length > 0 && (
              <span className="absolute bottom-3 left-3 rounded-full bg-night/80 px-3 py-1.5 text-xs text-ink backdrop-blur">📷 View all {images.length} photos</span>
            )}
          </button>
          {images.slice(1, 3).map((src, i) => (
            <button key={src} onClick={() => { setActive(i + 1); setLightbox(true) }} className="relative hidden overflow-hidden bg-chip md:block">
              <img src={src} alt="" className="h-full w-full object-cover transition-transform duration-500 hover:scale-105" />
              {i === 1 && images.length > 3 && (
                <span className="absolute inset-0 flex items-center justify-center bg-black/55 font-serif text-3xl text-white">+{images.length - 3}</span>
              )}
            </button>
          ))}
        </div>
        {images.length > 1 && (
          <div className="mt-2 flex gap-2 overflow-x-auto scrollbar-none md:hidden">
            {images.map((src, i) => (
              <button key={src} onClick={() => setActive(i)} className={`h-14 w-[72px] shrink-0 overflow-hidden rounded border-2 ${i === active ? 'border-gold-500' : 'border-transparent'}`}>
                <img src={src} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        )}

        <div className="mt-5 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_350px]">
          <div className="min-w-0">
            {/* Title + price on one row */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <p className="eyebrow">For {rent ? 'Rent' : 'Sale'} · {project.propertyType || d.propertyTypes?.[0]} · Posted {timeAgo(project.approvedAt || project.createdAt)}</p>
                <h1 className="mt-1.5 font-serif text-3xl font-normal leading-tight text-ink sm:text-4xl">{title}</h1>
                <p className="mt-1.5 text-sm text-faded">📍 {[d.projectName, d.locality, project.city].filter(Boolean).join(', ')}</p>
              </div>
              <div className="shrink-0 sm:text-right">
                <p className="gold-text font-serif text-4xl leading-none">{formatPrice(d.price, { perMonth: rent })}</p>
                <p className="mt-1.5 text-xs text-faded">{[rate, d.priceType].filter(Boolean).join(' · ')}</p>
              </div>
            </div>

            {d.priceAdvantages?.length > 0 && (
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {d.priceAdvantages.map((p) => <span key={p} className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs text-emerald-300">🏷️ {p}</span>)}
              </div>
            )}

            {/* Quick facts */}
            <div className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-4">
              {[
                ['Config', isPlot ? 'Plot' : d.bhk],
                ['Area', d.areaSize && `${d.areaSize} ${d.areaUnit || 'sq.ft'}`],
                ['Status', d.possessionStatus],
                ['Furnishing', d.furnishingStatus],
              ].map(([k, v]) => (
                <div key={k} className="bg-panel px-4 py-2.5">
                  <p className="text-[10px] uppercase tracking-[0.16em] text-faded">{k}</p>
                  <p className="mt-0.5 truncate font-serif text-lg text-ink">{v || '—'}</p>
                </div>
              ))}
            </div>

            {/* Tabs */}
            <div role="tablist" className="mt-5 flex gap-1 overflow-x-auto border-b border-line scrollbar-none">
              {tabs.map(([key, label]) => (
                <button key={key} role="tab" aria-selected={tab === key} onClick={() => setTab(key)}
                  className={`-mb-px shrink-0 border-b-2 px-4 py-2.5 text-sm transition-colors ${tab === key ? 'border-gold-500 font-medium text-gold-300' : 'border-transparent text-faded hover:text-ink'}`}>
                  {label}
                  {key === 'amenities' && <span className="ml-1.5 text-[11px] text-faded">{amenities.reduce((n, [, l]) => n + l.length, 0)}</span>}
                </button>
              ))}
            </div>

            <div className="pt-4">
              {tab === 'overview' && (
                <div className="space-y-4">
                  {points.length > 0 && (
                    <div className="rounded-xl border border-gold-500/30 bg-gold-500/[0.06] p-4">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold-300">✨ Why you'll love it</p>
                      <ul className="mt-2.5 grid grid-cols-1 gap-x-6 gap-y-1.5 text-sm text-ink sm:grid-cols-2">
                        {points.map((p) => <li key={p.text} className="flex items-start gap-2"><span>{p.icon}</span>{p.text}</li>)}
                      </ul>
                    </div>
                  )}

                  {d.description && (
                    <div>
                      <p className={`whitespace-pre-line text-[15px] font-light leading-relaxed text-faded ${longDesc && !more ? 'line-clamp-4' : ''}`}>{d.description}</p>
                      {longDesc && (
                        <button onClick={() => setMore((m) => !m)} className="mt-1 text-sm text-gold-300 hover:underline">{more ? 'Show less' : 'Read more'}</button>
                      )}
                    </div>
                  )}

                  {d.propertyHighlights?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {d.propertyHighlights.map((h) => (
                        <span key={h} className="rounded-full border border-gold-500/40 bg-gold-500/10 px-3 py-1 text-[13px] text-gold-300">✦ {h}</span>
                      ))}
                    </div>
                  )}

                  {negatives.length > 0 && (
                    <div className="rounded-xl border border-amber-400/30 bg-amber-400/[0.06] p-4">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-300">⚠ Good to know</p>
                      <p className="mt-1 text-xs text-amber-100/80">Openly disclosed by the seller — no surprises on your site visit.</p>
                      <ul className="mt-2.5 flex flex-wrap gap-1.5">
                        {negatives.map((n) => <li key={n} className="rounded-full border border-amber-400/40 px-3 py-1 text-[13px] text-amber-200">{n}</li>)}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {tab === 'details' && (
                <dl className="grid grid-cols-1 overflow-hidden rounded-lg border border-line sm:grid-cols-2">
                  {overview.map(([label, value]) => (
                    <div key={label} className="flex justify-between gap-4 border-b border-line px-4 py-2.5 text-sm sm:odd:border-r">
                      <dt className="text-faded">{label}</dt>
                      <dd className="text-right text-ink">{value}</dd>
                    </div>
                  ))}
                </dl>
              )}

              {tab === 'amenities' && (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {amenities.map(([g, list]) => (
                    <div key={g.key} className="rounded-lg border border-line bg-panel p-3.5">
                      <p className="text-sm text-ink">{g.icon} {g.label}</p>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {list.map((a) => <span key={a} className="rounded-full border border-line bg-chip px-2.5 py-1 text-xs text-faded">{a}</span>)}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {tab === 'nearby' && (
                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  {locations.map(([l, list]) => (
                    <div key={l.key} className="flex items-center justify-between rounded-lg border border-line bg-panel px-4 py-2.5 text-sm">
                      <span className="text-ink">{l.icon} {l.label}</span>
                      <span className="text-gold-300">{list.join(', ')}</span>
                    </div>
                  ))}
                </div>
              )}

              {tab === 'video' && (
                <div className="space-y-3">
                  {d.videos.map((v) => <video key={imgUrl(v)} src={imgUrl(v)} controls className="w-full rounded-lg border border-line" />)}
                </div>
              )}
            </div>
          </div>

          <aside>
            <div ref={enquiryRef} id="enquiry" className="lg:sticky lg:top-[var(--rw-header-h,76px)] lg:pt-2">
              <EnquiryForm project={project} />
              <p className="mt-3 rounded-lg border border-line px-4 py-3 text-xs leading-relaxed text-faded">
                <span className="text-ink">✓ Verified by RW Realty</span> · Listed by <span className="text-ink">{project.ownerName}</span>. Always visit the site and verify documents before paying.
              </p>
            </div>
          </aside>
        </div>

        {project.similar?.length > 0 && (
          <section className="mt-10">
            <p className="eyebrow">You may also like</p>
            <h2 className="mb-4 mt-1 font-serif text-3xl text-ink">Similar verified properties</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {project.similar.map((p) => <ListingCard key={p._id} project={p} />)}
            </div>
          </section>
        )}
      </div>

      {/* Mobile quick-enquire bar */}
      {showBar && (
        <div className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-between gap-3 border-t border-line bg-night/95 px-4 py-2.5 backdrop-blur lg:hidden">
          <div>
            <p className="gold-text font-serif text-2xl leading-none">{formatPrice(d.price, { perMonth: rent })}</p>
            {rate && <p className="mt-0.5 text-[11px] text-faded">{rate}</p>}
          </div>
          <button onClick={goEnquire} className="btn-primary !px-6 !py-2.5">Enquire now</button>
        </div>
      )}

      {lightbox && images.length > 0 && (
        <div className="fixed inset-0 z-[70] flex flex-col bg-black/95" role="dialog" aria-modal="true">
          <div className="flex items-center justify-between p-4 text-sm text-ink">
            <span>{active + 1} / {images.length}</span>
            <button onClick={() => setLightbox(false)} className="text-3xl leading-none text-ink" aria-label="Close">×</button>
          </div>
          <div className="relative flex flex-1 items-center justify-center px-4">
            <img src={images[active]} alt="" className="max-h-[78vh] max-w-full rounded object-contain" />
            {images.length > 1 && (
              <>
                <button onClick={() => setActive((i) => (i - 1 + images.length) % images.length)} aria-label="Previous"
                  className="absolute left-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-2xl text-white hover:bg-white/20">‹</button>
                <button onClick={() => setActive((i) => (i + 1) % images.length)} aria-label="Next"
                  className="absolute right-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-2xl text-white hover:bg-white/20">›</button>
              </>
            )}
          </div>
          <div className="flex justify-center gap-2 overflow-x-auto p-4 scrollbar-none">
            {images.map((src, i) => (
              <button key={src} onClick={() => setActive(i)} className={`h-14 w-20 shrink-0 overflow-hidden rounded border-2 ${i === active ? 'border-gold-500' : 'border-transparent opacity-60'}`}>
                <img src={src} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}
    </ListingsShell>
  )
}

function EnquiryForm({ project }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: `Hi, I'm interested in this property. Please share more details.` })
  const [state, setState] = useState({ loading: false, error: '', done: '' })
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    if (!form.name.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email)) {
      return setState({ loading: false, error: 'Please enter your name and a valid email.', done: '' })
    }
    setState({ loading: true, error: '', done: '' })
    try {
      const res = await sendEnquiry(project.slug || project._id, form)
      setState({ loading: false, error: '', done: res.message })
    } catch (err) {
      setState({ loading: false, error: err.message, done: '' })
    }
  }

  if (state.done) {
    return (
      <div className="card p-6 text-center">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-emerald-400/40 bg-emerald-400/10 text-xl text-emerald-300">✓</span>
        <p className="mt-3 font-serif text-2xl text-ink">Enquiry sent</p>
        <p className="mt-1.5 text-sm text-faded">{state.done}</p>
      </div>
    )
  }

  return (
    <form onSubmit={submit} className="card p-5" noValidate>
      <p className="font-serif text-2xl text-ink">Interested? Talk to Team RW</p>
      <p className="mt-0.5 text-xs text-faded">Your details go to the Team RW desk. We follow up and connect you with the right person.</p>
      <div className="mt-4 space-y-2.5">
        <input className="field-input" placeholder="Full name" autoComplete="name" value={form.name} onChange={set('name')} />
        <div className="grid grid-cols-2 gap-2.5">
          <input className="field-input" type="email" placeholder="Email" autoComplete="email" value={form.email} onChange={set('email')} />
          <input className="field-input" type="tel" placeholder="Phone (optional)" autoComplete="tel" value={form.phone} onChange={set('phone')} />
        </div>
        <textarea className="field-input h-16 resize-none" value={form.message} onChange={set('message')} maxLength={1000} />
      </div>
      <ErrorNote>{state.error}</ErrorNote>
      <button className="btn-primary mt-3 w-full" disabled={state.loading}>
        {state.loading ? <><span className="spinner" /> Sending…</> : 'Send enquiry'}
      </button>
    </form>
  )
}
