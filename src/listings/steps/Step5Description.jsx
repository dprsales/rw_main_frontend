import { useState } from 'react'
import { ErrorNote, StepCard } from '../components/ui'

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
    } — close to schools, hospitals and everyday essentials. Ideal for buyers looking for a ${
      d.possessionStatus === 'Under Construction' ? 'future-ready investment' : 'move-in-ready space'
    } with strong appreciation potential.`,
  (d) =>
    `Rare opportunity to own a ${d.bhk || ''} ${d.propertyTypes?.[0] || 'home'} in ${d.locality ? `${d.locality}, ` : ''}${d.city || 'the city'}. ${
      d.propertyHighlights?.length ? `${d.propertyHighlights.slice(0, 3).join(', ')}. ` : ''
    }${d.priceAdvantages?.length ? `${d.priceAdvantages[0]}. ` : ''}Contact now to schedule a site visit.`,
]

export default function Step5Description({ data, update, onSubmit, onPrev, submitting, submitError, user, editing }) {
  const [showOptions, setShowOptions] = useState(false)
  const words = (data.oneLineDescription || '').trim().split(/\s+/).filter(Boolean).length
  const descWords = (data.description || '').trim().split(/\s+/).filter(Boolean).length
  const canSubmit = data.oneLineDescription && words <= 20 && data.description && !submitting

  return (
    <StepCard
      step={5}
      title={editing ? 'Description & save' : 'Description & review'}
      subtitle="A catchy title increases views by up to 37%."
      footer={
        <>
          <button className="btn-secondary" onClick={onPrev} disabled={submitting}>← Previous</button>
          <button className="btn-primary" disabled={!canSubmit} onClick={onSubmit}>
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

      <p className="text-xs text-faded">
        {editing ? 'Check the live preview on the right, then save.' : 'Check the live preview on the right'}
        {!editing && user?.email ? <> — we'll email <span className="text-ink">{user.email}</span> as soon as it's approved.</> : !editing ? '.' : ''}
      </p>
      <ErrorNote>{submitError}</ErrorNote>
    </StepCard>
  )
}
