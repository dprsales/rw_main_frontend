import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import ListingsShell from '../components/ListingsShell'
import ListingCard, { ListingCardSkeleton } from '../components/ListingCard'
import { Select } from '../components/ui'
import { getApprovedProjects, getFacets } from '../api'
import { BHK_OPTIONS, BUDGET_OPTIONS, PROPERTY_TYPES, SORT_OPTIONS } from '../options'

const PAGE_SIZE = 12
const FILTER_KEYS = ['q', 'city', 'listingType', 'propertyType', 'bhk', 'budget', 'possession', 'furnishing', 'sort']

export default function ListingsPage({ embedded = false }) {
  const [params, setParams] = useSearchParams()
  const filters = useMemo(() => Object.fromEntries(FILTER_KEYS.map((k) => [k, params.get(k) || ''])), [params])
  const [search, setSearch] = useState(filters.q)
  const [items, setItems] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState('')
  const [facets, setFacets] = useState(null)
  const [layout, setLayout] = useState('grid')
  const abortRef = useRef(null)

  useEffect(() => { getFacets().then(setFacets).catch(() => {}) }, [])
  useEffect(() => { setSearch(filters.q) }, [filters.q])

  const query = (p) => {
    const budget = BUDGET_OPTIONS[Number(filters.budget)] || BUDGET_OPTIONS[0]
    return {
      q: filters.q,
      city: filters.city,
      listingType: filters.listingType,
      propertyType: filters.propertyType,
      bhk: filters.bhk,
      possession: filters.possession,
      furnishing: filters.furnishing,
      minPrice: budget.min,
      maxPrice: budget.max,
      sort: filters.sort || 'newest',
      page: p,
      limit: PAGE_SIZE,
    }
  }

  useEffect(() => {
    abortRef.current?.abort()
    const ctrl = new AbortController()
    abortRef.current = ctrl
    setLoading(true)
    setError('')
    getApprovedProjects(query(1), { signal: ctrl.signal })
      .then((res) => {
        setItems(res.items || [])
        setTotal(res.total || 0)
        setPages(res.pages || 1)
        setPage(1)
      })
      .catch((err) => { if (err.name !== 'AbortError') setError(err.message) })
      .finally(() => { if (!ctrl.signal.aborted) setLoading(false) })
    return () => ctrl.abort()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters])

  const loadMore = async () => {
    setLoadingMore(true)
    try {
      const res = await getApprovedProjects(query(page + 1))
      setItems((cur) => [...cur, ...(res.items || [])])
      setPage(page + 1)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoadingMore(false)
    }
  }

  const setFilter = (key, value) => {
    const next = new URLSearchParams(params)
    if (value === '' || value === undefined || value === null || next.get(key) === String(value)) next.delete(key)
    else next.set(key, value)
    setParams(next, { replace: true })
  }
  const clearAll = () => setParams(new URLSearchParams(), { replace: true })
  const activeCount = FILTER_KEYS.filter((k) => k !== 'sort' && filters[k]).length

  const propertyTypes = facets?.propertyTypes?.length ? facets.propertyTypes : PROPERTY_TYPES
  const bhks = facets?.bhks?.length ? BHK_OPTIONS.filter((b) => facets.bhks.includes(b)) : BHK_OPTIONS.slice(2, 10)

  // Active filters shown as removable chips
  const chips = [
    filters.q && ['q', `“${filters.q}”`],
    filters.propertyType && ['propertyType', filters.propertyType],
    filters.bhk && ['bhk', filters.bhk],
    filters.budget && ['budget', BUDGET_OPTIONS[Number(filters.budget)]?.label],
    filters.possession && ['possession', filters.possession],
    filters.furnishing && ['furnishing', filters.furnishing],
  ].filter(Boolean)

  const shell = embedded ? 'section' : ListingsShell
  const Shell = shell

  return (
    <Shell {...(embedded ? { id: 'listings', className: 'scroll-mt-[var(--rw-header-h,76px)] border-t border-line' } : { title: 'Verified property listings in Hyderabad | RW Realty', description: 'Browse verified apartments, villas and plots. Every listing is reviewed by the RW Realty team before it goes live.' })}>
      {/* Compact hero + search */}
      <section className="relative border-b border-line">
        <div className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(50% 90% at 85% 0%, rgba(195,155,83,0.16) 0%, rgba(11,10,9,0) 70%)' }} />
        <div className="relative mx-auto max-w-[1440px] px-4 pb-5 pt-7 sm:px-8 sm:pt-9">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
            <div>
              <p className="eyebrow">{embedded ? 'Buy, sell, rent' : 'RW Realty · Verified projects'}</p>
              {embedded ? (
                <h2 className="mt-2 font-serif text-4xl font-normal leading-[1.05] text-ink sm:text-5xl">
                  Listed properties
                </h2>
              ) : (
                <h1 className="mt-2 font-serif text-4xl font-normal leading-[1.05] text-ink sm:text-5xl">
                  Homes worth the address, <em className="gold-text">verified.</em>
                </h1>
              )}
            </div>
            <p className="max-w-xs text-sm font-light text-faded sm:pb-1 sm:text-right">
              Every property is reviewed and approved by our team before it goes live.
            </p>
          </div>

          <form
            onSubmit={(e) => { e.preventDefault(); setFilter('q', search.trim()) }}
            className="mt-5 flex flex-col gap-2 rounded-xl border border-line bg-panel p-1.5 shadow-card sm:flex-row"
          >
            <div className="flex rounded-lg bg-night p-1">
              {[['', 'All'], ['Sale', 'Buy'], ['Rent', 'Rent']].map(([v, l]) => (
                <button key={l} type="button" onClick={() => setFilter('listingType', v)}
                  className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${(filters.listingType || '') === v ? 'bg-gold-500 text-night' : 'text-faded hover:text-ink'}`}>
                  {l}
                </button>
              ))}
            </div>
            <select value={filters.city} onChange={(e) => setFilter('city', e.target.value)}
              className="rounded-lg bg-night px-4 py-2.5 text-sm text-ink outline-none sm:w-44">
              <option value="">All cities</option>
              {(facets?.cities || []).map((c) => <option key={c}>{c}</option>)}
            </select>
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search locality, project or keyword…"
              className="min-w-0 flex-1 rounded-lg bg-night px-4 py-2.5 text-sm text-ink outline-none placeholder:text-faded/70" />
            <button className="btn-primary !rounded-lg !py-2.5">Search</button>
          </form>

          {facets?.localities?.length > 0 && (
            <div className="mt-3 flex items-center gap-2 overflow-x-auto text-xs scrollbar-none">
              <span className="shrink-0 text-faded">Popular:</span>
              {facets.localities.slice(0, 10).map((l) => (
                <button key={l} onClick={() => setFilter('q', l)}
                  className={`shrink-0 rounded-full border px-3 py-1 transition-colors ${filters.q === l ? 'border-gold-500 bg-gold-500/15 text-gold-300' : 'border-line text-faded hover:border-gold-500/60 hover:text-ink'}`}>{l}</button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Sticky filter bar — dropdowns replace the tall sidebar */}
      <div className="sticky top-[var(--rw-header-h,76px)] z-30 border-b border-line bg-night/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1440px] items-center gap-2 overflow-x-auto px-4 py-2.5 scrollbar-none sm:px-8 lg:flex-wrap lg:overflow-visible">
          <p className="mr-1 shrink-0 whitespace-nowrap text-sm text-faded">
            {loading ? 'Searching…' : <><span className="font-serif text-2xl text-ink">{total}</span> {total === 1 ? 'property' : 'properties'}</>}
          </p>
          <FilterSelect label="Property type" value={filters.propertyType} options={propertyTypes} onChange={(v) => setFilter('propertyType', v)} />
          <FilterSelect label="BHK" value={filters.bhk} options={bhks} onChange={(v) => setFilter('bhk', v)} />
          <FilterSelect label="Budget" value={filters.budget} options={BUDGET_OPTIONS.slice(1).map((b, i) => ({ value: String(i + 1), label: b.label }))} onChange={(v) => setFilter('budget', v)} />
          <FilterSelect label="Possession" value={filters.possession} options={['Ready To Move', 'Under Construction']} onChange={(v) => setFilter('possession', v)} />
          <FilterSelect label="Furnishing" value={filters.furnishing} options={['Furnished', 'Semi-Furnished', 'Unfurnished']} onChange={(v) => setFilter('furnishing', v)} />
          {activeCount > 0 && <button onClick={clearAll} className="shrink-0 whitespace-nowrap text-xs text-gold-300 hover:underline">Clear all</button>}

          <div className="ml-auto flex shrink-0 items-center gap-2">
            <Select value={filters.sort === 'newest' ? '' : filters.sort} placeholder="Newest first"
              options={SORT_OPTIONS.filter((s) => s.value !== 'newest')} onChange={(v) => setFilter('sort', v)}
              className="!w-auto !py-1.5 !text-[13px]" aria-label="Sort" />
            <div className="hidden rounded-md border border-line p-0.5 sm:flex">
              {[['grid', '▦'], ['row', '☰']].map(([v, icon]) => (
                <button key={v} aria-label={`${v} view`} onClick={() => setLayout(v)}
                  className={`rounded px-2.5 py-1 text-sm ${layout === v ? 'bg-gold-500 text-night' : 'text-faded'}`}>{icon}</button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1440px] px-4 py-5 sm:px-8">
        {chips.length > 0 && (
          <div className="mb-4 flex flex-wrap items-center gap-2">
            {chips.map(([key, label]) => (
              <button key={key} onClick={() => setFilter(key, '')}
                className="flex items-center gap-1.5 rounded-full border border-gold-500/40 bg-gold-500/10 px-3 py-1 text-xs text-gold-300 hover:bg-gold-500/20">
                {label} <span aria-hidden>×</span>
              </button>
            ))}
          </div>
        )}

        {error && <p className="mb-4 rounded-md border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-300">{error}</p>}

        <div className={layout === 'grid' ? 'grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4' : 'space-y-4'}>
          {loading
            ? Array.from({ length: 8 }).map((_, i) => <ListingCardSkeleton key={i} />)
            : items.map((p) => <ListingCard key={p._id} project={p} layout={layout} />)}
        </div>

        {!loading && !error && items.length === 0 && (
          <div className="card p-10 text-center">
            <p className="font-serif text-3xl text-ink">No properties match yet</p>
            <p className="mt-2 text-sm text-faded">
              {activeCount ? 'Try removing a filter or two.' : "Approved listings will appear here as soon as they're verified."}
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              {activeCount > 0 && <button className="btn-secondary" onClick={clearAll}>Clear filters</button>}
              {embedded
                ? <a href="#list-form" className="btn-primary">List your property</a>
                : <Link to="/list-property" className="btn-primary">List your property</Link>}
            </div>
          </div>
        )}

        {!loading && page < pages && (
          <div className="mt-6 flex justify-center">
            <button onClick={loadMore} disabled={loadingMore} className="btn-secondary">
              {loadingMore ? <><span className="spinner" /> Loading…</> : `Show more (${total - items.length} left)`}
            </button>
          </div>
        )}

        {!embedded && (
          <div className="mt-8 flex flex-col items-start justify-between gap-3 rounded-xl border border-gold-500/30 bg-gradient-to-br from-gold-500/10 to-transparent px-6 py-5 sm:flex-row sm:items-center">
            <div>
              <p className="font-serif text-2xl text-ink">Own a property or a project?</p>
              <p className="text-sm text-faded">List it free. Verified in 24 hours and shown to serious buyers.</p>
            </div>
            <Link to="/list-property" className="btn-primary shrink-0">List your property →</Link>
          </div>
        )}
      </div>
    </Shell>
  )
}

/** Compact dropdown that turns gold when a value is chosen. */
function FilterSelect({ label, value, options, onChange }) {
  return (
    <Select
      value={value || ''}
      placeholder={label}
      options={options}
      onChange={onChange}
      aria-label={label}
      className={`!w-auto shrink-0 !rounded-full !py-1.5 !pl-3.5 !text-[13px] ${value ? '!border-gold-500/70 !bg-gold-500/10 !text-gold-300' : ''}`}
    />
  )
}
