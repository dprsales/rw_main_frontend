import { useEffect, useRef } from 'react'
import { CHALLENGES, WHO, goalOptions, labelFor } from '../data/guidance'
import './GuidedFinder.css'

const TITLES = {
  who: 'Choose what best describes you',
  challenge: 'What’s the biggest challenge right now?',
  goal: 'What would help most?',
}

/**
 * The question stepper: answered chips, step rail, one question at a time.
 * Purely presentational — state comes from useFinder(). Used full-size in the
 * inline finder and `compact` inside the booking modal.
 *
 *   finder    the object returned by useFinder()
 *   compact   tighter type and spacing for the modal
 *   children  rendered under the question (Back / skip / secondary actions)
 */
export default function FinderSteps({ finder, compact = false, onStartOver, children }) {
  const { answers, steps, current, stepIndex, done, answer, editStep } = finder
  const legendRef = useRef(null)

  // Focus follows the step so keyboard and screen-reader users land on the new question.
  useEffect(() => {
    legendRef.current?.focus({ preventScroll: true })
  }, [current])

  const options =
    current === 'who' ? WHO
    : current === 'challenge' ? CHALLENGES[answers.who]
    : current === 'goal' ? goalOptions(answers.who, answers.challenge)
    : []

  const totalLabel = answers.who ? `${Math.min(stepIndex + 1, steps.length)} / ${steps.length}` : '1'

  return (
    <div className={`rw-finder-steps${compact ? ' is-compact' : ''}`}>
      {answers.who && (
        <div className="rw-guidance-chips">
          {steps.filter((s) => answers[s]).map((s) => (
            <button key={s} type="button" className="rw-guidance-chip is-step" onClick={() => editStep(s)} aria-label={`Change answer: ${labelFor(s, answers[s])}`}>
              {labelFor(s, answers[s])}
            </button>
          ))}
          {done && onStartOver && <button type="button" className="rw-guidance-chip is-edit" onClick={onStartOver}>start over</button>}
        </div>
      )}

      {!done && (
        <>
          <div className="rw-finder-rail">
            <span>STEP {totalLabel}</span>
            <span className="rw-finder-segments" aria-hidden="true">
              {steps.map((s, i) => <span key={s} className={`rw-finder-segment${i < stepIndex ? ' is-done' : ''}`} />)}
              {!answers.who && <><span className="rw-finder-segment" /><span className="rw-finder-segment" /></>}
            </span>
          </div>

          <fieldset>
            <legend ref={legendRef} tabIndex={-1} className="rw-finder-legend">{TITLES[current]}</legend>
            <div className="rw-finder-pills">
              {options.map((o) => (
                <button key={o.key} type="button" className="rw-finder-pill" aria-pressed="false" onClick={() => answer(current, o.key)}>
                  {o.label}
                </button>
              ))}
            </div>
          </fieldset>

          {children}
        </>
      )}
    </div>
  )
}
