import { mono } from '../theme'

const CheckIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden>
    <path d="M4 12.5 9.5 18 20 6.5" />
  </svg>
)

/** Same numbered tracker as careers apply: gold line, check on done, locked ahead. */
export default function BriefStepper({ steps, current, reached, onJump, ariaLabel = 'Brief steps' }) {
  return (
    <div className="rw-stepper" role="list" aria-label={ariaLabel}>
      {steps.map((s, i) => {
        const state = i < current ? 'done' : i === current ? 'active' : 'todo'
        const clickable = i <= reached && i !== current
        const label = s.label
        return (
          <div key={s.id || s.key || label} className={`rw-step rw-step--${state}`} role="listitem">
            {i > 0 && <span className={`rw-step-line${i <= current ? ' is-filled' : ''}`} aria-hidden />}
            <button
              type="button"
              className="rw-step-dot"
              disabled={!clickable}
              aria-current={state === 'active' ? 'step' : undefined}
              aria-label={`Step ${i + 1} of ${steps.length} · ${label}`}
              onClick={() => clickable && onJump(i)}
            >
              {state === 'done' ? <CheckIcon /> : i + 1}
            </button>
            <span className="rw-step-label" style={{ fontFamily: mono }}>{label}</span>
          </div>
        )
      })}
    </div>
  )
}
