import { useEffect, useRef, useState } from 'react'
import CtaButton from './CtaButton'
import { allowsManyChallenges, CHALLENGES, WHO, challengeList, goalOptions } from '../data/guidance'
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
 *   children  skip / book action on the same row as Back and Continue
 */
export default function FinderSteps({ finder, compact = false, onStartOver, children }) {
  const { t } = useLang()
  const { answers, steps, current, stepIndex, done, answer, editStep } = finder
  const many = current === 'challenge' && allowsManyChallenges(answers.who)
  const [picks, setPicks] = useState([])
  const [otherOpen, setOtherOpen] = useState(false)
  const [otherNote, setOtherNote] = useState('')
  const otherRef = useRef(null)
  const sawOther = useRef(false)

  useEffect(() => {
    const list = challengeList(answers.challenge)
    setPicks(many ? list : [])
    setOtherOpen(!many && current === 'challenge' && list.includes('other'))
    setOtherNote(answers.challengeNote || '')
  }, [many, current, answers.who, answers.challenge, answers.challengeNote])

  const options =
    current === 'who' ? WHO
    : current === 'challenge' ? CHALLENGES[answers.who]
    : current === 'goal' ? goalOptions(answers.who, answers.challenge)
    : []

  const issueKeys = (CHALLENGES[answers.who] || [])
    .filter((o) => o.key !== 'all_of_above' && o.key !== 'other')
    .map((o) => o.key)

  const wantsOther = current === 'challenge' && (many ? picks.includes('other') : otherOpen)
  const showContinue = many || otherOpen
  const canContinue = many
    ? picks.length > 0 && (!picks.includes('other') || Boolean(otherNote.trim()))
    : otherOpen && Boolean(otherNote.trim())

  useEffect(() => {
    if (wantsOther && !sawOther.current) otherRef.current?.focus()
    sawOther.current = wantsOther
  }, [wantsOther])

  const totalLabel = answers.who ? `${Math.min(stepIndex + 1, steps.length)} / ${steps.length}` : '1'
  const questionKey = current === 'challenge' && answers.who
    ? `finder.q.challenge.${answers.who}`
    : `finder.q.${current}`

  function isOn(key) {
    if (picks.includes('all_of_above')) return key !== 'other'
    return picks.includes(key)
  }

  function toggle(key) {
    if (key === 'all_of_above') {
      setPicks((prev) => (prev.includes('all_of_above') ? [] : ['all_of_above']))
      return
    }
    if (key === 'other') {
      setPicks((prev) => (prev.includes('other') ? [] : ['other']))
      return
    }
    setPicks((prev) => {
      const listed = prev.filter((item) => item !== 'all_of_above' && item !== 'other')
      const next = listed.includes(key)
        ? listed.filter((item) => item !== key)
        : [...listed, key]
      const issuesOn = next.filter((item) => issueKeys.includes(item))
      if (issueKeys.length > 0 && issuesOn.length === issueKeys.length) return ['all_of_above']
      return next
    })
  }

  function pickSingle(key) {
    if (key === 'other') {
      setOtherOpen(true)
      return
    }
    setOtherOpen(false)
    setOtherNote('')
    answer(current, key)
  }

  function commitChallenge() {
    const note = otherNote.trim()
    const list = many ? picks : ['other']
    if (list.length === 0) return
    if (list.includes('other') && !note) return
    const value = list.length === 1 && list[0] !== 'all_of_above' ? list[0] : list
    answer('challenge', value, list.includes('other') ? { note } : {})
  }

  return (
    <div className={`rw-finder-steps${compact ? ' is-compact' : ''}`}>
      {answers.who && (
        <div className="rw-guidance-chips">
          {steps.filter((s) => answers[s]).map((s) => (
            <button key={s} type="button" className="rw-guidance-chip is-step" onClick={() => editStep(s)} aria-label={t('finder.change', { label: finderLabel(t, s, answers[s], answers.who, answers.challengeNote) })}>
              {finderLabel(t, s, answers[s], answers.who, answers.challengeNote)}
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
            <legend className="rw-finder-legend">{t(questionKey)}</legend>
            {many && <p className="rw-finder-help">{t('finder.help.many')}</p>}
            <div className="rw-finder-pills">
              {options.map((o) => {
                const on = many ? isOn(o.key) : (otherOpen && o.key === 'other')
                return (
                  <button
                    key={o.key}
                    type="button"
                    className="rw-finder-pill"
                    aria-pressed={on}
                    onClick={() => (many ? toggle(o.key) : pickSingle(o.key))}
                  >
                    {finderLabel(t, current, o.key, answers.who)}
                  </button>
                )
              })}
            </div>
            {wantsOther && (
              <label className="rw-finder-other">
                <span className="rw-finder-other-label">{t('finder.other.prompt')}</span>
                <textarea
                  ref={otherRef}
                  className="rw-finder-other-field"
                  rows={3}
                  maxLength={280}
                  value={otherNote}
                  onChange={(e) => setOtherNote(e.target.value)}
                  placeholder={t('finder.other.placeholder')}
                />
              </label>
            )}
          </fieldset>

          <div className="rw-finder-links">
            {stepIndex > 0 && (
              <CtaButton variant="secondary" arrow="←" onClick={finder.back}>{t('cta.back')}</CtaButton>
            )}
            {showContinue && (
              <CtaButton disabled={!canContinue} onClick={commitChallenge}>
                {t('finder.continue')}
              </CtaButton>
            )}
            {children}
          </div>
        </>
      )}
    </div>
  )
}
