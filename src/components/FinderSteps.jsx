import { useEffect, useRef } from 'react'
import { CHALLENGES, WHO, goalOptions } from '../data/guidance'
import { useLang } from '../i18n/LangProvider'
import { finderLabel } from '../i18n/pages'
import './GuidedFinder.css'

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
  const { t } = useLang()
  const { answers, steps, current, stepIndex, done, answer, editStep } = finder
  const legendRef = useRef(null)
  const mountedRef = useRef(false)

  // Focus follows the step so keyboard and screen-reader users land on the new question.
  // Skipped on first render: Safari can ignore preventScroll and jump a fresh homepage
  // load down to the finder.
  useEffect(() => {
    if (!mountedRef.current) { mountedRef.current = true; return }
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
            <button key={s} type="button" className="rw-guidance-chip is-step" onClick={() => editStep(s)} aria-label={t('finder.change', { label: finderLabel(t, s, answers[s], answers.who) })}>
              {finderLabel(t, s, answers[s], answers.who)}
            </button>
          ))}
          {done && onStartOver && <button type="button" className="rw-guidance-chip is-edit" onClick={onStartOver}>{t('finder.startOver')}</button>}
        </div>
      )}

      {!done && (
        <>
          <div className="rw-finder-rail">
            <span>{t('finder.step')} {totalLabel}</span>
            <span className="rw-finder-segments" aria-hidden="true">
              {steps.map((s, i) => <span key={s} className={`rw-finder-segment${i < stepIndex ? ' is-done' : ''}`} />)}
              {!answers.who && <><span className="rw-finder-segment" /><span className="rw-finder-segment" /></>}
            </span>
          </div>

          <fieldset>
            <legend ref={legendRef} tabIndex={-1} className="rw-finder-legend">{t(`finder.q.${current}`)}</legend>
            <div className="rw-finder-pills">
              {options.map((o) => (
                <button key={o.key} type="button" className="rw-finder-pill" aria-pressed="false" onClick={() => answer(current, o.key)}>
                  {finderLabel(t, current, o.key, answers.who)}
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
