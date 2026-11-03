import { MultiSelect, Select, StepCard, StepField } from '../components/ui'
import MediaUploader from '../components/MediaUploader'
import {
  FLOORING_OPTIONS, LOCATION_ADVANTAGES, NEARBY_OPTIONS, NEGATIVE_HIGHLIGHTS,
  OWNERSHIP_TYPES, PRICE_ADVANTAGES, PROPERTY_HIGHLIGHTS,
} from '../options'

export default function Step3Media({ data, update, onNext, onPrev }) {
  const hasImage = (data.images || []).length > 0
  const setNearby = (key, v) => update('locationAdvantages', { ...(data.locationAdvantages || {}), [key]: v ? [v] : [] })

  return (
    <StepCard
      step={3}
      title="Media & highlights"
      subtitle="Photos upload to our CDN instantly. Highlights show on your preview card."
      footer={
        <>
          <button className="btn-secondary" onClick={onPrev}>← Previous</button>
          <div className="flex items-center gap-3">
            {!hasImage && <span className="text-xs text-amber-300">Add at least 1 photo</span>}
            <button className="btn-primary" disabled={!hasImage} onClick={onNext}>Next →</button>
          </div>
        </>
      }
    >
      <div className="grid grid-cols-1 gap-x-4 lg:grid-cols-[3fr_2fr]">
        <StepField label="Photos" required>
          <MediaUploader kind="image" value={data.images || []} onChange={(v) => update('images', v)} />
        </StepField>
        <StepField label="Video walkthrough">
          <MediaUploader kind="video" value={data.videos || []} onChange={(v) => update('videos', v)} />
        </StepField>
      </div>

      <p className="eyebrow mb-3 mt-1">✦ Selling points</p>
      <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-3">
        <StepField label="Property highlights" hint="Pick what makes it special.">
          <MultiSelect options={PROPERTY_HIGHLIGHTS} value={data.propertyHighlights || []} placeholder="Vaastu, corner unit…" onChange={(v) => update('propertyHighlights', v)} />
        </StepField>
        <StepField label="Price advantages" hint="Shown as a green tag on your card.">
          <MultiSelect options={PRICE_ADVANTAGES} value={data.priceAdvantages || []} placeholder="Below market value…" onChange={(v) => update('priceAdvantages', v)} />
        </StepField>
        <StepField label="Ownership type">
          <Select value={data.ownershipType} options={OWNERSHIP_TYPES} onChange={(v) => update('ownershipType', v)} />
        </StepField>
      </div>

      <div className="mb-4 rounded-lg border border-amber-400/25 bg-amber-400/[0.05] p-4">
        <p className="text-sm font-medium text-amber-200">⚠ Negative highlights <span className="font-normal text-faded">— optional, but honest listings attract serious buyers</span></p>
        <div className="mt-3 grid grid-cols-1 gap-x-4 sm:grid-cols-2">
          <StepField label="Things buyers should know" className="!mb-2 sm:!mb-0">
            <MultiSelect options={NEGATIVE_HIGHLIGHTS} value={data.negativeHighlights || []} placeholder="Select any that apply" onChange={(v) => update('negativeHighlights', v)} />
          </StepField>
          <StepField label="Anything else to disclose?" className="!mb-0">
            <input className="field-input" maxLength={200} placeholder="e.g. Metro station 2 km away, under construction"
              value={data.negativeNote || ''} onChange={(e) => update('negativeNote', e.target.value)} />
          </StepField>
        </div>
      </div>

      <p className="eyebrow mb-3 mt-1">📍 Nearby</p>
      <div className="grid grid-cols-2 gap-x-4 sm:grid-cols-4">
        {LOCATION_ADVANTAGES.map((adv) => (
          <StepField key={adv.key} label={`${adv.icon} ${adv.label}`}>
            <Select value={data.locationAdvantages?.[adv.key]?.[0]} options={NEARBY_OPTIONS} placeholder="Distance" onChange={(v) => setNearby(adv.key, v)} />
          </StepField>
        ))}
      </div>

      <p className="eyebrow mb-3 mt-1">Unit details</p>
      <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-3">
        <StepField label="Flooring">
          <Select value={data.flooring} options={FLOORING_OPTIONS} placeholder="Select flooring" onChange={(v) => update('flooring', v)} />
        </StepField>
        <StepField label="Tower / Block">
          <input className="field-input" placeholder="Tower / Block" value={data.tower || ''} onChange={(e) => update('tower', e.target.value)} />
        </StepField>
        <StepField label="Unit no">
          <input className="field-input" placeholder="Unit no" value={data.unitNo || ''} onChange={(e) => update('unitNo', e.target.value)} />
        </StepField>
      </div>
      <label className="-mt-1 flex items-center gap-2.5 text-sm text-faded">
        <input type="checkbox" checked={!!data.keepPrivate} onChange={(e) => update('keepPrivate', e.target.checked)} className="h-4 w-4 accent-[#C39B53]" />
        Keep tower & unit number private (only our team sees them)
      </label>
    </StepCard>
  )
}
