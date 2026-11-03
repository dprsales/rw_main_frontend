import { MultiSelect, Select, StepCard, StepField } from '../components/ui'
import {
  AMENITY_GROUPS, AMENITY_OPTIONS, FACING_OPTIONS, FURNISHING_OPTIONS, POWER_BACKUP_OPTIONS,
  ROAD_UNITS, TOTAL_FLOOR_OPTIONS, TRANSACTION_OPTIONS, VIEW_OPTIONS, floorOptions,
} from '../options'

export default function Step4DetailedConfig({ data, update, onNext, onPrev }) {
  const roadMax = (data.roadWidthUnit || 'Feet') === 'Feet' ? 300 : 100
  const roadError = data.roadWidth && Number(data.roadWidth) > roadMax ? `Max ${roadMax} ${data.roadWidthUnit || 'Feet'}` : ''
  const setTotal = (v) => {
    update('totalFloors', v)
    if (v && data.floorNumber && Number(data.floorNumber) > Number(v)) update('floorNumber', '')
  }

  return (
    <StepCard
      step={4}
      title="Detailed configuration"
      subtitle="Furnishing, orientation, floors and amenities."
      footer={
        <>
          <button className="btn-secondary" onClick={onPrev}>← Previous</button>
          <div className="flex items-center gap-3">
            {!data.furnishingStatus && <span className="text-xs text-faded">Select furnishing status</span>}
            <button className="btn-primary" disabled={!data.furnishingStatus || !!roadError} onClick={onNext}>Next →</button>
          </div>
        </>
      }
    >
      <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-3">
        <StepField label="Furnishing status" required>
          <Select value={data.furnishingStatus} options={FURNISHING_OPTIONS} onChange={(v) => update('furnishingStatus', v)} />
        </StepField>
        <StepField label="Power back-up">
          <Select value={data.powerBackup} options={POWER_BACKUP_OPTIONS} onChange={(v) => update('powerBackup', v)} />
        </StepField>
        <StepField label="Transaction type">
          <Select value={data.transactionType} options={TRANSACTION_OPTIONS} onChange={(v) => update('transactionType', v)} />
        </StepField>

        <StepField label="Facing">
          <Select value={data.facing} options={FACING_OPTIONS} placeholder="Select facing" onChange={(v) => update('facing', v)} />
        </StepField>
        <StepField label="View">
          <Select value={data.view} options={VIEW_OPTIONS} placeholder="Select view" onChange={(v) => update('view', v)} />
        </StepField>
        <StepField label="Connecting road width" error={!!roadError} hint={roadError || `Max ${roadMax} ${data.roadWidthUnit || 'Feet'}`}>
          <div className="flex gap-2">
            <input className={`field-input ${roadError ? 'is-invalid' : ''}`} inputMode="numeric" placeholder="Width" value={data.roadWidth || ''}
              onChange={(e) => update('roadWidth', e.target.value.replace(/[^0-9.]/g, ''))} />
            <Select className="!w-28 shrink-0" value={data.roadWidthUnit || 'Feet'} options={ROAD_UNITS} placeholder="Unit" onChange={(v) => update('roadWidthUnit', v || 'Feet')} />
          </div>
        </StepField>

        <StepField label="Total floors">
          <Select value={data.totalFloors} options={TOTAL_FLOOR_OPTIONS} placeholder="Total floors" onChange={setTotal} />
        </StepField>
        <StepField label="Floor number">
          <Select value={data.floorNumber} options={floorOptions(data.totalFloors)} placeholder="Floor" onChange={(v) => update('floorNumber', v)} />
        </StepField>
      </div>

      <p className="eyebrow mb-3 mt-1">Amenities</p>
      <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-3">
        {AMENITY_GROUPS.map((group) => (
          <StepField key={group.key} label={`${group.icon} ${group.label}`}>
            <MultiSelect options={AMENITY_OPTIONS[group.key]} value={data.amenities?.[group.key] || []} placeholder={`Select ${group.label.toLowerCase()}`}
              onChange={(v) => update('amenities', { ...(data.amenities || {}), [group.key]: v })} />
          </StepField>
        ))}
      </div>
    </StepCard>
  )
}
