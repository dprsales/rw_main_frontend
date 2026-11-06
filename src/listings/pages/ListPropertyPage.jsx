import { useEffect, useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import ListingsShell from '../components/ListingsShell'
import AuthCard from '../components/AuthCard'
import WizardStepper from '../components/WizardStepper'
import PreviewCard from '../components/PreviewCard'
import { StatusBadge } from '../components/ui'
import Step1BasicInfo from '../steps/Step1BasicInfo'
import Step2BasicConfig from '../steps/Step2BasicConfig'
import Step3Media from '../steps/Step3Media'
import Step4DetailedConfig from '../steps/Step4DetailedConfig'
import Step5Description from '../steps/Step5Description'
import { useListingAuth } from '../AuthContext'
import { getMyListing, getMyListings, submitProperty, updateProperty } from '../api'
import { formatPrice, imgUrl, listingStrength, listingTitle } from '../format'
import { LISTING_CONSENTS } from '../commission'
import ListingsPage from './ListingsPage'

const DRAFT_KEY = 'rw_listing_draft'
const INITIAL = { listingType: 'Sale', city: '', email: '', areaUnit: 'sq.ft', areaType: 'Carpet Area' }

const FEATURES = [
  'Free to list and verify. Professional fee only if a sale closes with Team RW',
  'Every listing verified by our team before it goes live',
  'Team RW handles every buyer enquiry and introduces you when there is a serious match',
]
const STATS = [
  { value: '24 hrs', label: 'Verification' },
  { value: '100%', label: 'Verified listings' },
  { value: 'Free', label: 'To list' },
  { value: '3%', label: 'On successful sale' },
]

function loadDraft() {
  try {
    const raw = localStorage.getItem(DRAFT_KEY)
    return raw ? { ...INITIAL, ...JSON.parse(raw) } : INITIAL
  } catch {
    return INITIAL
  }
}

export default function ListPropertyPage() {
  const { user, ready, isLoggedIn } = useListingAuth()
  const navigate = useNavigate()
  const { id } = useParams()
  const editing = !!id
  const [screen, setScreen] = useState(editing ? 'loading' : 'landing') // loading | landing | wizard | success
  const [step, setStep] = useState(1)
  const [maxStep, setMaxStep] = useState(editing ? 5 : 1)
  const [data, setData] = useState(() => (editing ? INITIAL : loadDraft()))
  const [editInfo, setEditInfo] = useState(null)
  const [loadError, setLoadError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [submitted, setSubmitted] = useState(null)
  const [mine, setMine] = useState(null)

  // Keep a draft so a refresh doesn't lose the wizard (new listings only)
  useEffect(() => {
    if (editing) return
    try { localStorage.setItem(DRAFT_KEY, JSON.stringify(data)) } catch { /* ignore */ }
  }, [data, editing])

  // Edit mode: load the builder's listing into the wizard
  useEffect(() => {
    if (!editing || !user) return undefined
    let alive = true
    getMyListing(id)
      .then((l) => {
        if (!alive) return
        const saved = l.listingConsents || {}
        setData({
          ...INITIAL,
          ...l.details,
          city: l.city,
          listingType: l.listingType,
          commissionAccepted: !!l.commissionAccepted,
          displayOnWebsite: !!saved.displayOnWebsite,
          useDetails: !!saved.useDetails,
          useMedia: !!saved.useMedia,
          runAds: !!saved.runAds,
        })
        setEditInfo({ status: l.status, reason: l.rejectionReason, slug: l.slug })
        setScreen('wizard')
      })
      .catch((err) => alive && setLoadError(err.message))
    return () => { alive = false }
  }, [editing, id, user])

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }) }, [step, screen])

  useEffect(() => {
    if (!isLoggedIn || screen !== 'landing') return undefined
    let alive = true
    getMyListings()
      .then((rows) => { if (alive) setMine(rows || []) })
      .catch(() => { if (alive) setMine([]) })
    return () => { alive = false }
  }, [isLoggedIn, screen])

  const update = (field, value) => setData((prev) => ({ ...prev, [field]: value }))
  const goToStep = (n) => {
    setStep(n)
    setMaxStep((m) => Math.max(m, n))
  }

  const startWizard = () => {
    setData((d) => ({ ...d, city: d.city || user?.city || '' }))
    setScreen('wizard')
  }

  const handleSubmit = async () => {
    setSubmitError('')
    const listingConsents = {
      displayOnWebsite: !!data.displayOnWebsite,
      useDetails: !!data.useDetails,
      useMedia: !!data.useMedia,
      runAds: !!data.runAds,
    }
    if (LISTING_CONSENTS.some((item) => !listingConsents[item.key]) || !data.commissionAccepted) {
      setSubmitError('Please tick every publish permission and the partnership terms before submitting.')
      return
    }
    setSubmitting(true)
    try {
      const { email, commissionAccepted, displayOnWebsite, useDetails, useMedia, runAds, ...details } = data
      if (!/^\d{4}-\d{2}$/.test(details.possessionDate || '')) delete details.possessionDate
      const payload = {
        city: data.city.trim(),
        listingType: data.listingType,
        commissionAccepted: true,
        listingConsents,
        details: { ...details, images: (data.images || []).map(imgUrl), videos: (data.videos || []).map(imgUrl) },
      }
      const res = editing ? await updateProperty(id, payload) : await submitProperty(payload)
      setSubmitted(res)
      setScreen('success')
      if (!editing) { try { localStorage.removeItem(DRAFT_KEY) } catch { /* ignore */ } }
    } catch (err) {
      if (err.status === 401) {
        setSubmitError('Your session expired. Please log in again — your details are saved.')
        if (editing) navigate(`/list-property/login?next=${encodeURIComponent(`/list-property/edit/${id}`)}`)
        else setScreen('landing')
      } else setSubmitError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const listAnother = () => {
    setData({ ...INITIAL, city: data.city, listingType: data.listingType })
    setStep(1)
    setMaxStep(1)
    setSubmitted(null)
    setScreen('wizard')
  }

  if (editing && ready && !user) {
    return <Navigate to={`/list-property/login?next=${encodeURIComponent(`/list-property/edit/${id}`)}`} replace />
  }

  return (
    <ListingsShell title="List your property — free | RW Realty" description="List your property for free. Verified within 24 hours and shown to serious buyers.">
      {screen === 'landing' && (
        <>
        <section className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(60% 55% at 85% 0%, rgba(195,155,83,0.14) 0%, rgba(11,10,9,0) 70%)' }} />
          <div id="list-form" className="relative mx-auto grid max-w-[1320px] scroll-mt-[var(--rw-header-h,76px)] grid-cols-1 gap-12 px-5 pb-12 pt-14 sm:px-10 lg:grid-cols-[1.1fr_0.9fr] lg:pt-20">
            <div>
              <p className="eyebrow">RW Realty · Owner & builder listings</p>
              <h1 className="mt-5 font-serif text-5xl font-normal leading-[1.02] text-ink sm:text-6xl lg:text-7xl">
                Sell or rent faster.
                <br />
                <em className="gold-text not-italic">100% free.</em>
              </h1>
              <p className="mt-6 max-w-md text-base font-light leading-relaxed text-faded sm:text-lg">
                List your property in a few minutes. Our team verifies it, then it goes live on the Projects page for serious buyers and tenants.
              </p>
              <ul className="mt-8 space-y-3">
                {FEATURES.map((f) => (
                  <li key={f} className="flex items-center gap-3 text-sm text-ink">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-gold-500/40 text-[11px] text-gold-300">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <div className="mt-10 grid grid-cols-2 overflow-hidden rounded-lg border border-line sm:grid-cols-4">
                {STATS.map((s, i) => (
                  <div key={s.label} className={`bg-panel px-4 py-5 ${i ? 'sm:border-l sm:border-line' : ''}`}>
                    <p className="font-serif text-2xl text-gold-300">{s.value}</p>
                    <p className="mt-1 text-[11px] uppercase tracking-[0.14em] text-faded">{s.label}</p>
                  </div>
                ))}
              </div>
              <a href="#listings" className="mt-8 inline-block text-sm text-gold-300 hover:underline">
                Browse listed properties ↓
              </a>
            </div>

            <div className="w-full lg:max-w-[440px] lg:justify-self-end">
              {!ready ? (
                <div className="card skeleton h-[460px]" />
              ) : isLoggedIn ? (
                <div className="card p-8">
                  <p className="eyebrow">Welcome back</p>
                  <h2 className="mt-2 font-serif text-3xl text-ink">{user.name || user.email}</h2>
                  <p className="mt-1 text-sm text-faded">Logged in as {user.email}</p>
                  <p className="mt-4 text-sm leading-relaxed text-faded">
                    {mine == null
                      ? 'Checking your listings…'
                      : mine.length === 0
                        ? 'You have no listings yet. The homes below are live listings from every owner.'
                        : `You have ${mine.length} ${mine.length === 1 ? 'listing' : 'listings'} (${mine.filter((l) => l.status === 'approved').length} live). Those stay under My listings. The homes below are the public market.`}
                  </p>
                  {submitError && <p className="mt-4 text-sm text-red-300">{submitError}</p>}
                  <button className="btn-primary mt-7 w-full" onClick={startWizard}>
                    {data.images?.length || data.locality ? 'Continue your draft →' : 'Start a new listing →'}
                  </button>
                  <button className="btn-secondary mt-3 w-full" onClick={() => navigate('/list-property/dashboard')}>My listings</button>
                </div>
              ) : (
                <AuthCard data={data} update={update} onAuthed={startWizard} />
              )}
            </div>
          </div>
        </section>
        <ListingsPage embedded />
        </>
      )}

      {screen === 'loading' && (
        <div className="mx-auto max-w-xl px-5 py-24 text-center">
          {loadError ? (
            <>
              <p className="font-serif text-3xl text-ink">Couldn't open this listing</p>
              <p className="mt-2 text-sm text-red-300">{loadError}</p>
              <Link to="/list-property/dashboard" className="btn-primary mt-6">Back to my listings</Link>
            </>
          ) : (
            <div className="card skeleton mx-auto h-64 max-w-3xl" />
          )}
        </div>
      )}

      {screen === 'wizard' && (
        <div className="mx-auto max-w-[1280px] px-4 py-6 sm:px-8">
          <WizardStepper title={editing ? 'Edit your listing' : 'List your property'} currentStep={step} maxStep={maxStep}
            onStepClick={goToStep} onBack={() => navigate('/list-property/dashboard')} />

          {editing && editInfo && (
            <p className={`mt-3 rounded-md border px-4 py-2.5 text-xs leading-relaxed ${
              editInfo.status === 'rejected' ? 'border-red-400/30 bg-red-400/10 text-red-200' : 'border-gold-500/30 bg-gold-500/[0.07] text-gold-300'}`}>
              {editInfo.status === 'approved' && '✏️ You are editing a live listing. Saved changes appear on the website and our team is notified.'}
              {editInfo.status === 'pending' && '✏️ This listing is awaiting verification. Saving sends the updated version to our team.'}
              {editInfo.status === 'rejected' && `✏️ Not approved${editInfo.reason ? `: ${editInfo.reason}` : '.'} Fix the details and save to resubmit for verification.`}
            </p>
          )}

          <div className="mt-4 grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_390px] lg:items-start">
            <div className="min-w-0">
              {step === 1 && <Step1BasicInfo data={data} update={update} onNext={() => goToStep(2)} />}
              {step === 2 && <Step2BasicConfig data={data} update={update} onNext={() => goToStep(3)} onPrev={() => setStep(1)} />}
              {step === 3 && <Step3Media data={data} update={update} onNext={() => goToStep(4)} onPrev={() => setStep(2)} />}
              {step === 4 && <Step4DetailedConfig data={data} update={update} onNext={() => goToStep(5)} onPrev={() => setStep(3)} />}
              {step === 5 && (
                <Step5Description data={data} update={update} onSubmit={handleSubmit} onPrev={() => setStep(4)}
                  submitting={submitting} submitError={submitError} user={user} editing={editing} />
              )}
            </div>
            <PreviewCard data={data} />
          </div>
        </div>
      )}

      {screen === 'success' && submitted && (
        <SuccessView listing={submitted} edited={editing} email={user?.email} onListAnother={listAnother} onDashboard={() => navigate('/list-property/dashboard')} />
      )}
    </ListingsShell>
  )
}

function SuccessView({ listing, edited, email, onListAnother, onDashboard }) {
  const d = listing.details || {}
  const cover = imgUrl(d.images?.[0])
  const { score, checks } = listingStrength(d)
  const live = listing.status === 'approved'

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-8">
      <div className="card flex flex-col items-start gap-4 border-emerald-400/30 p-6 sm:flex-row sm:items-center sm:p-8">
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-emerald-400/40 bg-emerald-400/10 text-2xl text-emerald-300">✓</span>
        <div>
          <h1 className="font-serif text-3xl text-ink sm:text-4xl">
            {edited ? (live ? 'Changes saved — your listing is still live!' : 'Changes saved and sent for verification!') : 'Thank you - your listing is submitted!'}
          </h1>
          <p className="mt-1 text-sm text-faded">
            {edited
              ? live
                ? 'Your updates are already visible to buyers on the Projects page. Our team has been notified.'
                : <>Our team will re-verify it within 24 hours. We'll email <span className="text-ink">{email}</span> once it's live.</>
              : <>Our team will verify it within 24 hours. We've emailed a copy to <span className="text-ink">{email}</span> and will email you again the moment it's approved and live.</>}
          </p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1fr]">
        <div className="card overflow-hidden">
          {cover && <img src={cover} alt="" className="aspect-[16/10] w-full object-cover" />}
          <div className="p-6">
            <StatusBadge status={listing.status} />
            <p className="mt-3 font-serif text-2xl text-ink">{d.oneLineDescription || listing.title}</p>
            <p className="mt-1 text-sm text-faded">{listing.title || listingTitle(listing)}</p>
            <p className="gold-text mt-3 font-serif text-3xl">{formatPrice(d.price, { perMonth: listing.listingType === 'Rent' })}</p>
            <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
              {[['Config', d.bhk || d.propertyTypes?.[0]], ['Area', d.areaSize && `${d.areaSize} ${d.areaUnit || 'sq.ft'}`], ['Status', d.possessionStatus]].map(([k, v]) => (
                <div key={k} className="rounded-md border border-line bg-night/40 p-2">
                  <p className="text-[10px] uppercase tracking-wider text-faded">{k}</p>
                  <p className="mt-0.5 text-ink">{v || '—'}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <p className="font-serif text-2xl text-ink">Listing score</p>
            <p className="gold-text font-serif text-3xl">{score}/100</p>
          </div>
          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-chip">
            <div className="h-full rounded-full" style={{ width: `${score}%`, background: 'linear-gradient(90deg,#A67C3D,#E8C97A,#C39B53)' }} />
          </div>
          <ul className="mt-5 space-y-2">
            {checks.map((c) => (
              <li key={c.label} className="flex items-center gap-3 rounded-md border border-line bg-night/40 px-3 py-2">
                <span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs ${c.ok ? 'bg-emerald-400/15 text-emerald-300' : 'bg-chip text-faded'}`}>{c.ok ? '✓' : '+'}</span>
                <div>
                  <p className="text-sm text-ink">{c.label}</p>
                  <p className="text-xs text-faded">{c.tip}</p>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-6 flex flex-wrap gap-3">
            <button className="btn-primary" onClick={onDashboard}>Go to my listings</button>
            {!edited && <button className="btn-secondary" onClick={onListAnother}>+ List another property</button>}
          </div>
        </div>
      </div>
    </div>
  )
}
