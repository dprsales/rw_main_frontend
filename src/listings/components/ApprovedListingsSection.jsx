import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import ListingCard, { ListingCardSkeleton } from './ListingCard'
import { getApprovedProjects } from '../api'
import { useLang } from '../../i18n/LangProvider'

/**
 * "Verified listings" strip for the RW Realty page — sits below the territory map.
 * As soon as the admin approves a builder's project it appears here (newest first).
 */
export default function ApprovedListingsSection({ limit = 6 }) {
  const { t } = useLang()
  const [items, setItems] = useState(null)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    let live = true
    getApprovedProjects({ limit, sort: 'newest' })
      .then((res) => { if (live) { setItems(res.items || []); setTotal(res.total || 0) } })
      .catch(() => live && setItems([]))
    return () => { live = false }
  }, [limit])

  return (
    <section id="listings" className="sy-root" style={{ borderTop: '1px solid var(--line)', minHeight: 0 }}>
      <div className="mx-auto max-w-[1320px] px-4 py-12 sm:px-8 sm:py-16">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-[15px] tracking-[0.22em] text-faded">{t('listings.eyebrow')}</p>
            <h2 className="mt-3 max-w-[14em] font-serif text-4xl font-normal leading-none text-ink sm:text-5xl">
              {t('listings.title')}
            </h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to="/list-property#listings" className="btn-secondary">
              {total ? t('listings.viewAll', { n: total }) : t('listings.viewAllEmpty')}
            </Link>
            <Link to="/list-property" className="btn-primary">{t('listings.listCta')}</Link>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items === null
            ? Array.from({ length: 3 }).map((_, i) => <ListingCardSkeleton key={i} />)
            : items.map((p) => <ListingCard key={p._id} project={p} />)}
        </div>

        {items?.length === 0 && (
          <div className="card mt-2 p-10 text-center">
            <p className="font-serif text-2xl text-ink">{t('listings.emptyTitle')}</p>
            <p className="mt-2 text-sm text-faded">{t('listings.emptyBody')}</p>
          </div>
        )}
      </div>
    </section>
  )
}
