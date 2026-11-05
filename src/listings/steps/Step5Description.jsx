import { useEffect, useRef, useState } from 'react'
import { ErrorNote, StepCard } from '../components/ui'
import { COMMISSION_TERMS_TEXT } from '../commission'

const TEMPLATES = [
  (d) =>
    `Spacious ${d.bhk || ''} ${d.propertyTypes?.[0] || 'property'} available for ${
      d.listingType === 'Rent' ? 'rent' : 'sale'
    } in ${d.locality || 'a prime location'}, ${d.city || ''}. Thoughtfully designed with ${
      (d.amenities && Object.values(d.amenities).flat().length) || 'great'
    } amenities, this home offers comfort, connectivity and everyday convenience for the whole family.`,
  (d) =>
    `A ${(d.furnishingStatus || 'well-maintained').toLowerCase()} ${d.bhk || ''} home in ${d.locality || 'the heart of the city'}${
      d.facing ? `, ${d.facing.toLowerCase()} facing` : ''
    }. Close to schools, hospitals and everyday essentials. Ideal for buyers looking for a ${
      d.possessionStatus === 'Under Construction' ? 'future-ready investment' : 'move-in-ready space'
    } with strong appreciation potential.`,
  (d) =>
    `Rare opportunity to own a ${d.bhk || ''} ${d.propertyTypes?.[0] || 'home'} in ${d.locality ? `${d.locality}, ` : ''}${d.city || 'the city'}. ${
      d.propertyHighlights?.length ? `${d.propertyHighlights.slice(0, 3).join(', ')}. ` : ''
    }${d.priceAdvantages?.length ? `${d.priceAdvantages[0]}. ` : ''}Contact now to schedule a site visit.`,
]

export default function Step5Description({ data, update, onSubmit, onPrev, submitting, submitError, user, editing }) {
  const [showOptions, setShowOptions] = useState(false)
  const [termsHint, setTermsHint] = useState(false)
  const termsRef = useRef(null)
  const words = (data.oneLineDescription || '').trim().split(/\s+/).filter(Boolean).length
  const descWords = (data.description || '').trim().split(/\s+/).filter(Boolean).length
  const accepted = !!data.commissionAccepted
  const fieldsOk = !!(data.oneLineDescription && words <= 20 && data.description)
  const canSubmit = fieldsOk && accepted && !submitting

  useEffect(() => {
    if (accepted) setTermsHint(false)
  }, [accepted])

  const trySubmit = () => {
    if (submitting) return
    if (!fieldsOk) return
    if (!accepted) {
      setTermsHint(true)
      termsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }
    onSubmit()
  }

  return (
    <StepCard
      step={5}
      title={editing ? 'Description & save' : 'Description & review'}
      subtitle="A catchy title increases views by up to 37%."
      footer={
        <>
          <button type="button" className="btn-secondary" onClick={onPrev} disabled={submitting}>← Previous</button>
          <button type="button" className="btn-primary" disabled={!fieldsOk || submitting} onClick={trySubmit}>
            {submitting ? (<><span className="spinner" /> {editing ? 'Saving…' : 'Submitting…'}</>) : editing ? 'Save changes' : 'Submit for verification'}
          </button>
        </>
      }
    >
      <div className="mb-4">
        <label className="field-label">One line title <span className="text-gold-500">*</span></label>
        <input className="field-input" maxLength={160} placeholder="e.g. Sky-high 3 BHK with skyline views in Kokapet"
          value={data.oneLineDescription || ''} onChange={(e) => update('oneLineDescription', e.target.value)} />
        <div className="mt-1.5 flex items-center justify-between text-xs">
          <span className={words > 20 ? 'text-red-300' : 'text-faded'}>{words}/20 words</span>
        </div>
      </div>

      <div className="mb-4">
        <label className="field-label">Property description <span className="text-gold-500">*</span></label>
        <textarea className="field-input h-36 resize-y leading-relaxed" maxLength={5000}
          placeholder="Describe the layout, condition, nearby landmarks and why a buyer would love it…"
          value={data.description || ''} onChange={(e) => update('description', e.target.value)} />
        <p className={`mt-1.5 text-xs ${descWords >= 25 ? 'text-emerald-300' : 'text-faded'}`}>
          {descWords} words · write 25–30+ words for better ranking
        </p>
      </div>

      <div className="mb-4 rounded-md border border-line bg-night/40 p-4">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-medium text-ink">✨ Need help writing?</p>
          <button type="button" onClick={() => setShowOptions((s) => !s)} className="text-sm text-gold-300 hover:underline">
            {showOptions ? 'Hide suggestions' : 'Suggest descriptions'}
          </button>
        </div>
        {showOptions && (
          <div className="mt-4 space-y-2">
            {TEMPLATES.map((fn, i) => (
              <button key={i} type="button" onClick={() => update('description', fn(data).replace(/\s+/g, ' ').trim())}
                className="block w-full rounded-md border border-line bg-panel p-3 text-left text-xs leading-relaxed text-faded hover:border-gold-500/60 hover:text-ink">
                {fn(data).replace(/\s+/g, ' ').trim()}
              </button>
            ))}
          </div>
        )}
      </div>

      <div
        ref={termsRef}
        className={`mb-4 rounded-md border p-4 ${
          termsHint && !accepted
            ? 'border-red-400/50 bg-red-400/10'
            : 'border-gold-500/35 bg-gold-500/[0.06]'
        }`}
      >
        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-gold-300">Partnership terms · required</p>
        <p className="mt-2 text-sm leading-relaxed text-faded">
          How it works: listing and verification are free. Buyer enquiries come to you. Only if a sale closes with Team RW’s support does a professional fee apply: 3% of the total sale value. Tick the box below to continue.
        </p>
        <ul className="mt-3 list-disc space-y-1.5 pl-5 text-xs leading-relaxed text-faded">
          <li>You confirm you are authorised to list this property and that details and media are accurate.</li>
          <li>Team RW may verify, approve, reject or remove a listing. Going live is not a guarantee of sale or enquiries.</li>
          <li>The 3% professional fee applies only when a sale completes with Team RW’s support. Invoice timing and GST follow the written confirmation at mandate or closing.</li>
          <li>
            By continuing you also agree to our{' '}
            <a className="text-gold-300 underline-offset-2 hover:underline" href="/terms" target="_blank" rel="noreferrer">Terms of Use</a>
            {' '}and{' '}
            <a className="text-gold-300 underline-offset-2 hover:underline" href="/privacy-policy" target="_blank" rel="noreferrer">Privacy Policy</a>.
          </li>
        </ul>
        <label className="mt-4 flex cursor-pointer items-start gap-3 rounded-md border border-line bg-night/50 p-3">
          <input
            type="checkbox"
            className="mt-1 h-5 w-5 shrink-0 accent-[#C39B53]"
            checked={accepted}
            onChange={(e) => update('commissionAccepted', e.target.checked)}
            disabled={submitting}
            aria-required="true"
          />
          <span className="text-sm leading-relaxed text-ink">
            <span className="font-medium text-gold-300">Required. </span>
            {COMMISSION_TERMS_TEXT}
          </span>
        </label>
        {(termsHint && !accepted) && (
          <p className="mt-2 text-xs text-red-300">Please tick the partnership terms checkbox above, then submit again.</p>
        )}
        {!accepted && !termsHint && (
          <p className="mt-2 text-xs text-faded">Tick the checkbox to enable a successful submit.</p>
        )}
      </div>

      <p className="text-xs text-faded">
        {editing ? 'Check the live preview on the right, then save.' : 'Check the live preview on the right'}
        {!editing && user?.email ? <> · we will email <span className="text-ink">{user.email}</span> as soon as it is approved.</> : !editing ? '.' : ''}
      </p>
      <ErrorNote>{submitError}</ErrorNote>
    </StepCard>
  )
}
