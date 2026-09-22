import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { track } from '../data/analytics'
import { CHALLENGES, WHO, needsGoal, recommend } from '../data/guidance'

/**
 * State machine for the "Find the right fit" questions, shared by the inline
 * finder section and the booking modal. Owns the answers, which steps apply to
 * the chosen persona, the recommendation, and the finder_* analytics events.
 *
 *   seed      { who } pre-answers Q1
 *   location  analytics label ('home' | 'start' | 'modal')
 */
export function useFinder({ seed = {}, location = 'home' } = {}) {
  const [answers, setAnswers] = useState(() => (WHO.some((w) => w.key === seed.who) ? { who: seed.who } : {}))

  // Which questions this persona sees. Developers always get Q3 so their count is
  // known up front; a sales leader's Q3 depends on Q2.
  const steps = useMemo(() => {
    const list = ['who']
    if (answers.who && CHALLENGES[answers.who]) list.push('challenge')
    if (answers.who && needsGoal(answers.who, answers.challenge)) list.push('goal')
    return list
  }, [answers])
  const current = steps.find((s) => !answers[s]) || null   // null → all answered
  const stepIndex = current ? steps.indexOf(current) : steps.length
  const done = !current && Boolean(answers.who)
  const result = useMemo(() => (done ? recommend(answers) : null), [done, answers])

  useEffect(() => {
    if (!result) return
    track('finder_completed', { visitorType: answers.who, challenge: answers.challenge, goal: answers.goal, steps: steps.length, location })
    track('finder_recommendation', { visitorType: answers.who, challenge: answers.challenge, goal: answers.goal, recommendedService: result.outcome.key, rule: result.rule, location })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result])

  // Abandonment: left with at least one answer and no recommendation.
  const answersRef = useRef(answers)
  answersRef.current = answers
  const doneRef = useRef(done)
  doneRef.current = done
  useEffect(() => {
    const abandon = () => {
      const a = answersRef.current
      if (!doneRef.current && a.who) track('finder_abandoned', { lastStep: Object.keys(a).length, visitorType: a.who, location })
    }
    const onHide = () => { if (document.visibilityState === 'hidden') abandon() }
    document.addEventListener('visibilitychange', onHide)
    return () => { document.removeEventListener('visibilitychange', onHide); abandon() }
  }, [location])

  const answer = useCallback((key, value) => {
    track('finder_step', { step: ['who', 'challenge', 'goal'].indexOf(key) + 1, key, value, location })
    setAnswers((prev) => {
      const next = { ...prev, [key]: value }
      // Changing an earlier answer invalidates the later ones.
      if (key === 'who') { delete next.challenge; delete next.goal }
      if (key === 'challenge') delete next.goal
      return next
    })
  }, [location])

  /** Drop the answer for `key` and everything after it (chips, Back). */
  const editStep = useCallback((key) => setAnswers((prev) => {
    const order = ['who', 'challenge', 'goal']
    const next = { ...prev }
    for (const s of order.slice(order.indexOf(key))) delete next[s]
    return next
  }), [])

  const back = useCallback(() => {
    const prevStep = steps[Math.max(0, stepIndex - 1)]
    editStep(prevStep)
  }, [steps, stepIndex, editStep])

  const restart = useCallback(() => setAnswers({}), [])

  /** What the booking modal / lead payload carries. */
  const guidance = result ? {
    who: answers.who, challenge: answers.challenge, goal: answers.goal,
    recommended: result.outcome.key === 'strategy_call' ? undefined : result.outcome.name,
    recommendedKey: result.outcome.key,
  } : null

  return { answers, steps, current, stepIndex, done, result, guidance, answer, editStep, back, restart }
}
