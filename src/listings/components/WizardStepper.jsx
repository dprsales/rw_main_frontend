import { WIZARD_STEPS } from '../options'

/** Compact horizontal stepper — frees the full width for the form + live preview. */
export default function WizardStepper({ currentStep, maxStep = currentStep, onStepClick, onBack, title = 'List your property' }) {
  const progress = Math.round(((currentStep - 1) / (WIZARD_STEPS.length - 1)) * 100)
  return (
    <div className="card px-4 py-3 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
        <div className="flex items-center gap-3">
          {onBack && (
            <button onClick={onBack} className="text-xs font-medium text-faded hover:text-gold-300">‹ My listings</button>
          )}
          <p className="font-serif text-xl text-ink">{title}</p>
        </div>
        <p className="text-[11px] text-faded">{progress}% complete · <span className="text-gold-300">* required</span></p>
      </div>

      <ol className="mt-3 flex items-center">
        {WIZARD_STEPS.map((step, idx) => {
          const done = step.id < currentStep
          const active = step.id === currentStep
          const clickable = !!onStepClick && step.id <= maxStep && !active
          const last = idx === WIZARD_STEPS.length - 1
          return (
            <li key={step.id} className={`flex items-center ${last ? '' : 'flex-1'}`}>
              <button type="button" disabled={!clickable} onClick={() => onStepClick(step.id)}
                className="flex items-center gap-2 text-left" style={{ cursor: clickable ? 'pointer' : 'default' }}
                aria-current={active ? 'step' : undefined}>
                <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold transition-colors ${
                  done || active ? 'bg-gold-500 text-night' : 'border border-line bg-chip text-faded'}`}>
                  {done ? '✓' : step.id}
                </span>
                <span className={`${active ? 'inline' : 'hidden'} whitespace-nowrap text-sm md:inline ${active ? 'font-semibold text-ink' : done ? 'text-ink' : 'text-faded'}`}>
                  {step.label}
                </span>
              </button>
              {!last && <span className={`mx-2 h-px min-w-[12px] flex-1 ${done ? 'bg-gold-500' : 'bg-line'}`} />}
            </li>
          )
        })}
      </ol>
    </div>
  )
}
