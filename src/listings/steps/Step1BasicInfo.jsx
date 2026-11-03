import { useState } from 'react'
import { MultiSelect, Select, SelectOrOther, StepCard, StepField } from '../components/ui'
import {
  ADDITIONAL_SPACE_OPTIONS, AREA_TYPES, AREA_UNITS, BHK_OPTIONS, BUILDING_TYPES, CITY_OPTIONS,
  LISTING_TYPES, LOCALITIES, PRICE_TYPES, PROPERTY_TYPES,
} from '../options'
import { formatPrice, parsePrice } from '../format'

export default function Step1BasicInfo({ data, update, onNext }) {
  const [attempted, setAttempted] = useState(false)
  const rent = data.listingType === 'Rent'
  const isPlot = data.propertyTypes?.[0] === 'Plot'
  const localities = LOCALITIES[data.city]

  const required = [
    ['listingType', 'listing type', !!data.listingType],
    ['propertyType', 'property type', !!data.propertyTypes?.length],
    ['city', 'city', !!data.city],
    ['locality', 'locality', !!data.locality],
    ['bhk', 'BHK', isPlot || !!data.bhk],
    ['areaSize', 'area', !!data.areaSize],
    ['price', 'price', !!parsePrice(data.price)],
  ]
  const missing = required.filter(([, , ok]) => !ok)
  const bad = (key) => attempted && missing.some(([k]) => k === key)

  const next = () => {
    if (missing.length) {
      setAttempted(true)
      return
    }
    onNext()
  }

  return (
    <StepCard
      step={1}
      title="Basic info"
      subtitle="What are you listing, and where? Everything here is a quick dropdown."
      footer={
        <>
          <span className={`text-xs ${attempted && missing.length ? 'text-red-300' : 'text-faded'}`}>
            {missing.length ? `Still needed: ${missing.map(([, l]) => l).join(', ')}` : 'Looks good — continue.'}
          </span>
          <button className="btn-primary" onClick={next}>Next →</button>
        </>
      }
    >
      <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-3">
        <StepField label="Listing type" required>
          <Select value={data.listingType} options={LISTING_TYPES.map((v) => ({ value: v, label: v === 'Sale' ? 'Sell' : 'Rent / Lease' }))}
            invalid={bad('listingType')} onChange={(v) => update('listingType', v)} />
        </StepField>
        <StepField label="Building type">
          <Select value={data.buildingType} options={BUILDING_TYPES} onChange={(v) => update('buildingType', v)} />
        </StepField>
        <StepField label="Property type" required>
          <Select value={data.propertyTypes?.[0]} options={PROPERTY_TYPES} invalid={bad('propertyType')}
            onChange={(v) => update('propertyTypes', v ? [v] : [])} />
        </StepField>

        <StepField label="City" required>
          <SelectOrOther value={data.city} options={CITY_OPTIONS} placeholder="Select city" otherPlaceholder="Type your city"
            invalid={bad('city')} onChange={(v) => { update('city', v); if (v !== data.city) update('locality', '') }} />
        </StepField>
        <StepField label="Locality / Society" required>
          {localities ? (
            <SelectOrOther key={data.city} value={data.locality} options={localities} placeholder="Select locality"
              otherPlaceholder="Type locality" invalid={bad('locality')} onChange={(v) => update('locality', v)} />
          ) : (
            <input className={`field-input ${bad('locality') ? 'is-invalid' : ''}`} placeholder={data.city ? 'Type locality' : 'Select a city first'}
              value={data.locality || ''} onChange={(e) => update('locality', e.target.value)} />
          )}
        </StepField>
        <StepField label="Project name">
          <input className="field-input" placeholder="e.g. Greenspace Celestial" value={data.projectName || ''}
            onChange={(e) => update('projectName', e.target.value)} />
        </StepField>

        {!isPlot && (
          <StepField label="BHK" required>
            <Select value={data.bhk} options={BHK_OPTIONS} placeholder="Select BHK" invalid={bad('bhk')} onChange={(v) => update('bhk', v)} />
          </StepField>
        )}
        {!isPlot && (
          <StepField label="Additional spaces">
            <MultiSelect options={ADDITIONAL_SPACE_OPTIONS} value={data.additionalSpaces || []} placeholder="Pooja room, study…"
              onChange={(v) => update('additionalSpaces', v)} />
          </StepField>
        )}
        <StepField label="Price type" className={isPlot ? 'sm:col-span-3' : ''}>
          <Select value={data.priceType} options={PRICE_TYPES} onChange={(v) => update('priceType', v)} />
        </StepField>

        <StepField label="Area size" required>
          <input className={`field-input ${bad('areaSize') ? 'is-invalid' : ''}`} inputMode="decimal" placeholder="e.g. 1850" value={data.areaSize || ''}
            onChange={(e) => update('areaSize', e.target.value.replace(/[^0-9.]/g, ''))} />
        </StepField>
        <StepField label="Area unit">
          <Select value={data.areaUnit || 'sq.ft'} options={AREA_UNITS} placeholder="Unit" onChange={(v) => update('areaUnit', v || 'sq.ft')} />
        </StepField>
        <StepField label="Area type">
          <Select value={data.areaType || 'Carpet Area'} options={AREA_TYPES} placeholder="Area type" onChange={(v) => update('areaType', v || 'Carpet Area')} />
        </StepField>

        <StepField
          className="sm:col-span-3"
          label={rent ? 'Monthly rent' : 'Price'}
          required
          error={bad('price')}
          hint={parsePrice(data.price)
            ? `Shown to buyers as ${formatPrice(data.price, { perMonth: rent })}`
            : 'Type 8500000, or shorthand like "85 L" or "1.2 Cr".'}
        >
          <div className={`flex overflow-hidden rounded-md border bg-night focus-within:border-gold-500 sm:max-w-sm ${bad('price') ? 'border-red-400' : 'border-line'}`}>
            <span className="flex items-center border-r border-line px-3.5 text-sm text-gold-500">₹</span>
            <input className="w-full bg-transparent px-3.5 py-2.5 text-sm text-ink outline-none placeholder:text-faded/70"
              placeholder={rent ? 'e.g. 45000' : 'e.g. 1.85 Cr'} value={data.price || ''} onChange={(e) => update('price', e.target.value)} />
          </div>
        </StepField>
      </div>
    </StepCard>
  )
}
