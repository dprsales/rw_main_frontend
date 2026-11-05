import { useEffect, useState } from 'react'
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import ListingsShell from '../components/ListingsShell'
import { StatusBadge } from '../components/ui'
import { useListingAuth } from '../AuthContext'
import { deleteListing, getListingEnquiries, getMyListings, updateMe } from '../api'
import { ErrorNote } from '../components/ui'
import { formatDate, formatPrice, imgUrl, listingTitle, timeAgo } from '../format'

export default function DashboardPage() {
  const { user, ready, logout } = useListingAuth()
  const navigate = useNavigate()
  const [params, setParams] = useSearchParams()
  const tab = params.get('tab') === 'profile' ? 'profile' : 'listings'
  const setTab = (t) => setParams(t === 'profile' ? { tab: 'profile' } : {}, { replace: true })
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('all')

  const load = () => {
    setLoading(true)
    setError('')
    getMyListings()
      .then((res) => setListings(res || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => { if (user) load() }, [user])

  if (ready && !user) return <Navigate to="/list-property/login?next=%2Flist-property%2Fdashboard" replace />

  const counts = {
    all: listings.length,
    approved: listings.filter((l) => l.status === 'approved').length,
    pending: listings.filter((l) => l.status === 'pending').length,
    rejected: listings.filter((l) => l.status === 'rejected').length,
  }
  const enquiries = listings.reduce((s, l) => s + (l.enquiryCount || 0), 0)
  const shown = filter === 'all' ? listings : listings.filter((l) => l.status === filter)

  const remove = async (id) => {
    if (!window.confirm('Delete this listing permanently? Photos are removed too. Use this to clear test listings before go-live.')) return
    try {
      await deleteListing(id)
      setListings((ls) => ls.filter((l) => l._id !== id))
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <ListingsShell title="My listings | RW Realty" noindex>
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">My dashboard</p>
            <h1 className="mt-2 font-serif text-4xl text-ink sm:text-5xl">Welcome{user?.name ? `, ${user.name.split(' ')[0]}` : ''}</h1>
            <p className="mt-1 text-sm text-faded">{user?.name ? `${user.name} · ` : ''}{user?.email}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to="/list-property" className="btn-primary">+ Add property</Link>
            <button className="btn-secondary" onClick={() => { logout(); navigate('/list-property') }}>Log out</button>
          </div>
        </div>

        <div className="mt-8 flex gap-6 border-b border-line">
          {[['listings', 'My listings'], ['profile', 'Profile']].map(([k, label]) => (
            <button key={k} onClick={() => setTab(k)}
              className={`-mb-px border-b-2 pb-3 text-sm transition-colors ${tab === k ? 'border-gold-500 text-ink' : 'border-transparent text-faded hover:text-ink'}`}>
              {label}
            </button>
          ))}
        </div>

        {tab === 'profile' && <ProfilePanel />}

        {tab === 'listings' && (<>
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            ['Total listings', counts.all],
            ['Live', counts.approved],
            ['Pending approval', counts.pending],
            ['Buyer enquiries', enquiries],
          ].map(([label, value]) => (
            <div key={label} className="card p-5">
              <p className="font-serif text-4xl text-gold-300">{value}</p>
              <p className="mt-1 text-[11px] uppercase tracking-[0.14em] text-faded">{label}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 flex gap-2 overflow-x-auto scrollbar-none">
          {['all', 'approved', 'pending', 'rejected'].map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`chip whitespace-nowrap capitalize ${filter === f ? 'selected' : ''}`}>
              {f === 'approved' ? 'Live' : f} · {counts[f]}
            </button>
          ))}
        </div>

        <div className="mt-6 space-y-4">
          {loading && [0, 1].map((i) => <div key={i} className="card skeleton h-40" />)}
          {error && <p className="text-sm text-red-300">{error}</p>}
          {!loading && !error && shown.length === 0 && (
            <div className="card p-10 text-center">
              <p className="font-serif text-2xl text-ink">No listings here yet</p>
              <p className="mt-1 text-sm text-faded">List your first property — it's free and verified within 24 hours.</p>
              <Link to="/list-property" className="btn-primary mt-6">List a property</Link>
            </div>
          )}
          {!loading && shown.map((l) => <ListingRow key={l._id} listing={l} onDelete={() => remove(l._id)} />)}
        </div>
        </>)}
      </div>
    </ListingsShell>
  )
}

function ListingRow({ listing, onDelete }) {
  const d = listing.details || {}
  const cover = imgUrl(d.images?.[0])
  const [open, setOpen] = useState(false)
  const [enquiries, setEnquiries] = useState(null)

  const toggleEnquiries = () => {
    setOpen((o) => !o)
    if (!enquiries) getListingEnquiries(listing._id).then(setEnquiries).catch(() => setEnquiries([]))
  }

  return (
    <div className="card overflow-hidden">
      <div className="flex flex-col gap-5 p-5 sm:flex-row">
        <div className="aspect-[4/3] w-full shrink-0 overflow-hidden rounded-md bg-chip sm:w-52">
          {cover ? <img src={cover} alt="" className="h-full w-full object-cover" /> : null}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <StatusBadge status={listing.status} />
            <span className="text-xs text-faded">Posted {formatDate(listing.createdAt)}</span>
          </div>
          <p className="mt-3 font-serif text-2xl leading-snug text-ink">{d.oneLineDescription || listing.title}</p>
          <p className="mt-1 text-sm text-faded">{listing.title || listingTitle(listing)}</p>
          <p className="gold-text mt-2 font-serif text-2xl">{formatPrice(d.price, { perMonth: listing.listingType === 'Rent' })}</p>

          {listing.status === 'pending' && (
            <p className="mt-3 text-xs text-faded">Awaiting admin verification — you'll get an email as soon as it's reviewed.</p>
          )}
          {listing.status === 'rejected' && (
            <p className="mt-3 rounded-md border border-red-400/30 bg-red-400/10 px-3 py-2 text-xs text-red-300">
              Not approved{listing.rejectionReason ? `: ${listing.rejectionReason}` : '.'} Click Edit to fix it and resubmit.
            </p>
          )}
          {listing.updatedAt && listing.createdAt && new Date(listing.updatedAt) - new Date(listing.createdAt) > 60000 && (
            <p className="mt-1 text-[11px] text-faded">Last edited {timeAgo(listing.updatedAt)}</p>
          )}
          {listing.status === 'approved' && (
            <p className="mt-3 text-xs text-faded">
              Live since {timeAgo(listing.approvedAt)} · 👁 {listing.views || 0} views · ✉️ {listing.enquiryCount || 0} enquiries
            </p>
          )}
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2 border-t border-line px-5 py-3">
        {listing.status === 'approved' && (
          <Link to={`/realty/listings/${listing.slug || listing._id}`} className="btn-secondary !px-4 !py-2 !text-xs">View live listing ↗</Link>
        )}
        <Link to={`/list-property/edit/${listing._id}`} className="btn-primary !px-4 !py-2 !text-xs">
          ✏️ Edit {listing.status === 'approved' ? 'live listing' : 'listing'}
        </Link>
        <button onClick={toggleEnquiries} className="btn-secondary !px-4 !py-2 !text-xs">
          {open ? 'Hide' : 'Show'} enquiries ({listing.enquiryCount || 0})
        </button>
        <button onClick={onDelete} className="ml-auto text-xs text-red-300 hover:underline">Delete</button>
      </div>
      {open && (
        <div className="border-t border-line bg-night/40 px-5 py-4">
          {!enquiries && <p className="text-xs text-faded">Loading…</p>}
          {enquiries?.length === 0 && <p className="text-xs text-faded">No enquiries yet.</p>}
          <ul className="space-y-3">
            {enquiries?.map((e) => (
              <li key={e._id} className="rounded-md border border-line bg-panel p-3 text-sm">
                <div className="flex flex-wrap justify-between gap-2">
                  <span className="text-ink">{e.name}</span>
                  <span className="text-xs text-faded">{timeAgo(e.createdAt)}</span>
                </div>
                <p className="mt-1 text-xs">
                  <a href={`mailto:${e.email}`} className="text-gold-300 hover:underline">{e.email}</a>
                  {e.phone && <> · <a href={`tel:${e.phone}`} className="text-gold-300 hover:underline">{e.phone}</a></>}
                </p>
                {e.message && <p className="mt-2 whitespace-pre-line text-faded">{e.message}</p>}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

function ProfilePanel() {
  const { user, setUser } = useListingAuth()
  const [form, setForm] = useState({ name: user?.name || '', mobile: user?.mobile || '', city: user?.city || '' })
  const [state, setState] = useState({ saving: false, error: '', saved: false })
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: k === 'mobile' ? e.target.value.replace(/\D/g, '').slice(0, 10) : e.target.value }))

  const save = async (e) => {
    e.preventDefault()
    if (form.mobile && form.mobile.length !== 10) return setState({ saving: false, error: 'Mobile must be a 10 digit number.', saved: false })
    setState({ saving: true, error: '', saved: false })
    try {
      const updated = await updateMe(form)
      setUser(updated)
      setState({ saving: false, error: '', saved: true })
    } catch (err) {
      setState({ saving: false, error: err.message, saved: false })
    }
  }

  return (
    <form onSubmit={save} className="card mt-8 max-w-2xl p-6 sm:p-8">
      <p className="font-serif text-2xl text-ink">Profile</p>
      <p className="mt-1 text-sm text-faded">Your name and mobile are shown to our team when you submit a listing.</p>
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="field-label">Email (login)</label>
          <input className="field-input" value={user?.email || ''} disabled />
        </div>
        <div>
          <label className="field-label">Full name</label>
          <input className="field-input" value={form.name} onChange={set('name')} placeholder="Your name or company" />
        </div>
        <div>
          <label className="field-label">Mobile</label>
          <input className="field-input" inputMode="numeric" value={form.mobile} onChange={set('mobile')} placeholder="10 digit number" />
        </div>
        <div>
          <label className="field-label">City</label>
          <input className="field-input" value={form.city} onChange={set('city')} placeholder="e.g. Hyderabad" />
        </div>
      </div>
      <ErrorNote>{state.error}</ErrorNote>
      <div className="mt-6 flex flex-wrap items-center gap-4">
        <button className="btn-primary" disabled={state.saving}>{state.saving ? <><span className="spinner" /> Saving…</> : 'Save changes'}</button>
        {state.saved && <span className="text-sm text-emerald-300">✓ Saved</span>}
      </div>
      <p className="mt-6 text-xs text-faded">To change your password, log out and use “Forgot password?” on the login page.</p>
    </form>
  )
}
