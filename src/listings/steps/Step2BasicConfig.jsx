import { MonthYearSelect, MultiSelect, Select, StepCard, StepField } from '../components/ui'
import { AGE_OPTIONS, BALCONY_OPTIONS, COUNT_OPTIONS, COUNT_OPTIONS_NA, MONTHS, POSSESSION_OPTIONS, yearOptions } from '../options'

export default function Step2BasicConfig({ data, update, onNext, onPrev }) {
  const uc = data.possessionStatus === 'Under Construction'
  return (
    <StepCard
      step={2}
      title="Basic configuration"
      subtitle="Possession, age, bathrooms and parking."
      footer={
        <>
          <button className="btn-secondary" onClick={onPrev}>← Previous</button>
          <div className="flex items-center gap-3">
            {!data.possessionStatus && <span className="text-xs text-faded">Select possession status</span>}
            <button className="btn-primary" disabled={!data.possessionStatus} onClick={onNext}>Next →</button>
          </div>
        </>
      }
    >
      <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-3">
        <StepField label="Possession status" required>
          <Select value={data.possessionStatus} options={POSSESSION_OPTIONS} onChange={(v) => update('possessionStatus', v)} />
        </StepField>
        {uc ? (
          <StepField label="Expected possession">
            <MonthYearSelect value={data.possessionDate} months={MONTHS} years={yearOptions()} onChange={(v) => update('possessionDate', v)} />
          </StepField>
        ) : (
          <StepField label="Age of property (yrs)">
            <Select value={data.propertyAge} options={AGE_OPTIONS} onChange={(v) => update('propertyAge', v)} />
          </StepField>
        )}
        <StepField label="Bathrooms">
          <Select value={data.bathrooms} options={COUNT_OPTIONS} onChange={(v) => update('bathrooms', v)} />
        </StepField>

        <StepField label="Covered parking">
          <Select value={data.coveredParking} options={COUNT_OPTIONS_NA} onChange={(v) => update('coveredParking', v)} />
        </StepField>
        <StepField label="Open parking">
          <Select value={data.openParking} options={COUNT_OPTIONS_NA} onChange={(v) => update('openParking', v)} />
        </StepField>
        <StepField label="Balcony">
          <MultiSelect options={BALCONY_OPTIONS} value={data.balcony || []} placeholder="Select balcony type" onChange={(v) => update('balcony', v)} />
        </StepField>

        <StepField label="RERA number" hint="Optional — shown as a trust signal." className="sm:col-span-3">
          <input className="field-input sm:max-w-sm" placeholder="e.g. P02400001234" value={data.reraNumber || ''}
            onChange={(e) => update('reraNumber', e.target.value)} />
        </StepField>
      </div>
    </StepCard>
  )
}
