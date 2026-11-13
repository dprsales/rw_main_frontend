/**
 * guidance.js — the "Find the right fit" finder: questions, options and the
 * recommendation table. Pure data plus one lookup; no React, no fetch.
 *
 * Flow: Q1 (who) → Q2 (what's in the way; options depend on Q1; skipped for
 * investor / not sure; builders and sales heads can pick more than one) → Q3
 * (what would help; a tie-breaker asked only when two or more services still
 * fit) → one of five outcomes.
 *
 * Every reachable answer combination has exactly one row in RULES; anything
 * missing falls back to the strategy call with rule 'fallback' so a gap is
 * visible in analytics rather than silently misrouted. `guidance.test.mjs`
 * enumerates the whole option space and fails if a combination has no row.
 *
 * Wording and routing follow the positioning copy in content.js (WAYS,
 * ECOSYSTEM, MANDATE_SCOPE). "Developer" here is a real-estate developer /
 * builder — the persona every service page addresses.
 */

// Q1 --------------------------------------------------------------------------

export const WHO = [
  { key: 'developer', label: 'Developer / Builder' },
  { key: 'sales_leader', label: 'I lead a sales team' },
  { key: 'sales_pro', label: 'I sell homes' },
  { key: 'investor', label: 'I want to buy a home' },
]

// Q2 — options depend on Q1. Personas not listed here skip the question.
// Builders and sales heads can pick more than one (they often have several
// problems at once). Sales people pick one.

export const CHALLENGES = {
  developer: [
    { key: 'unsold_inventory', label: 'Homes are not selling' },
    { key: 'slow_sales', label: 'Sales are slow' },
    { key: 'team_performance', label: 'My sales team is not doing well' },
    { key: 'no_sales_setup', label: 'No sales team yet' },
    { key: 'positioning', label: "Buyers don't see why our project is special" },
    { key: 'all_of_above', label: 'All of these' },
    { key: 'other', label: 'Something else' },
  ],
  sales_leader: [
    { key: 'team_performance', label: 'Team is not hitting numbers' },
    { key: 'low_closing', label: "People enquire, but they don't buy" },
    { key: 'process_crm', label: 'No clear sales process' },
    { key: 'positioning', label: 'Hard to explain the project / price' },
    { key: 'all_of_above', label: 'All of these' },
    { key: 'other', label: 'Something else' },
  ],
  sales_pro: [
    { key: 'low_closing', label: "I don't close enough deals" },
    { key: 'luxury_skills', label: 'I want to sell bigger homes' },
    { key: 'career_growth', label: 'I want to grow in my job' },
    { key: 'other', label: 'Something else' },
  ],
}

// Q3 — the tie-breaker. Same wording everywhere; `hand_over` is developer-only,
// and `train_team` is hidden when there is no team to train.

export const GOALS = [
  { key: 'train_team', label: 'Train my team' },
  { key: 'fix_process', label: 'Fix my sales pipeline' },
  { key: 'hand_over', label: 'Let RW sell for me', only: ['developer'] },
]

export const challengeList = (value) => {
  if (!value) return []
  return Array.isArray(value) ? value.filter(Boolean) : [value]
}

/** One key for the rules table. Several picks (or "all of these") collapse to `many`. */
export function challengeKey(value) {
  const list = challengeList(value)
  if (list.includes('all_of_above') || list.length > 1) return 'many'
  return list[0] || null
}

export const allowsManyChallenges = (who) => who === 'developer' || who === 'sales_leader'

/** Q3 is asked only for these (who, challenge) combinations. */
export function needsGoal(who, challenge) {
  if (who === 'developer') return true
  if (who === 'sales_leader') {
    if (challengeKey(challenge) === 'many') return false
    const one = challengeKey(challenge)
    return one === 'team_performance' || one === 'other'
  }
  return false
}

/** Q3 options for a given (who, challenge). */
export function goalOptions(who, challenge) {
  const one = challengeKey(challenge)
  return GOALS.filter((g) => {
    if (g.only && !g.only.includes(who)) return false
    if (g.key === 'train_team' && one === 'no_sales_setup') return false
    return true
  })
}

// Outcomes ----------------------------------------------------------------------

/** The five destinations. `interest` is what the booking modal's select shows;
    `leadType` is the /leads `type` (see booking.js LEAD_TYPE). */
export const OUTCOMES = {
  coaching: {
    key: 'coaching',
    name: 'Sales Coaching',
    to: '/coaching',
    formTrack: 'coaching',
    formCta: 'SHARE YOUR COACHING DETAILS',
    interest: 'Sales Coaching',
    cta: 'See how coaching works',
  },
  consulting: {
    key: 'consulting',
    name: 'Sales Consulting',
    to: '/consulting',
    formTrack: 'consulting',
    formCta: 'SHARE YOUR BUSINESS DETAILS',
    interest: 'Sales Consulting',
    cta: 'See how consulting works',
  },
  realty: {
    key: 'realty',
    name: 'Sales Mandate · RW Realty',
    to: '/realty',
    formTrack: 'realty',
    formCta: 'SHARE YOUR PROJECT DETAILS',
    interest: 'Sales Mandates',
    cta: 'See how a mandate works',
  },
  // A destination, not a service: the buyer-facing side of the site.
  realty_portfolio: {
    key: 'realty_portfolio',
    name: 'RW Realty projects',
    to: '/about',
    formTrack: null,
    interest: 'Something else',
    cta: 'About Team RW',
  },
  strategy_call: {
    key: 'strategy_call',
    name: 'A strategy call',
    to: null,
    formTrack: null,
    interest: '',
    cta: null,
  },
}

// Rules -------------------------------------------------------------------------
// Matched on (who, challenge, goal); '*' matches any value including none.
// Order only matters where a specific row and a '*' row both apply — the
// specific row is listed first. `reason` is what the card shows.

export const RULES = [
  { id: 'R1', who: 'investor', challenge: '*', goal: '*', outcome: 'realty_portfolio',
    reason: 'You want to buy. Start with the RW Realty projects we sell.' },
  { id: 'R2', who: 'unsure', challenge: '*', goal: '*', outcome: 'strategy_call',
    reason: "A short call will help us pick the right fit together." },

  { id: 'R3', who: 'sales_pro', challenge: 'low_closing', goal: '*', outcome: 'coaching',
    reason: 'Coaching helps you close more deals, one person at a time.' },
  { id: 'R4', who: 'sales_pro', challenge: '*', goal: '*', outcome: 'coaching',
    reason: 'Coaching is for you. A short form helps us see where to start.',
    secondary: { label: 'Take the assessment first', to: '/assessment' } },

  { id: 'R5', who: 'sales_leader', challenge: 'low_closing', goal: '*', outcome: 'coaching',
    reason: 'Coaching helps your team turn more enquiries into sales.' },
  { id: 'R6', who: 'sales_leader', challenge: 'process_crm', goal: '*', outcome: 'consulting',
    reason: 'This is about how sales is run, not one person. Consulting looks at the whole setup.' },
  { id: 'R7', who: 'sales_leader', challenge: 'positioning', goal: '*', outcome: 'consulting',
    reason: 'This is bigger than selling skill. Consulting looks at the whole sales plan.' },
  { id: 'R15', who: 'sales_leader', challenge: 'many', goal: '*', outcome: 'consulting',
    reason: 'You have more than one problem. Consulting looks at the whole picture, not just one skill.' },
  { id: 'R8', who: 'sales_leader', challenge: '*', goal: 'train_team', outcome: 'coaching',
    reason: 'You want your team to sell better. That is coaching.' },
  { id: 'R9', who: 'sales_leader', challenge: '*', goal: 'fix_process', outcome: 'consulting',
    reason: 'You want the whole sales system fixed. That is consulting.' },
  { id: 'R10', who: 'sales_leader', challenge: '*', goal: 'unsure', outcome: 'strategy_call',
    reason: 'Coaching or consulting - a short call will make it clear.',
    candidates: ['coaching', 'consulting'] },

  { id: 'R11', who: 'developer', challenge: '*', goal: 'train_team', outcome: 'coaching',
    reason: 'Keep your team. We will help them sell better. That is coaching.' },
  { id: 'R12', who: 'developer', challenge: '*', goal: 'fix_process', outcome: 'consulting',
    reason: 'Let us look at how sales is run - team, process, and tools. That is consulting.' },
  { id: 'R13', who: 'developer', challenge: '*', goal: 'hand_over', outcome: 'realty',
    reason: 'You build. We sell. That is a sales mandate.' },
  { id: 'R14', who: 'developer', challenge: '*', goal: 'unsure', outcome: 'strategy_call',
    reason: 'Consulting, or we sell for you - a short call will make it clear.',
    candidates: ['consulting', 'realty'] },
]

const FALLBACK = {
  id: 'fallback',
  outcome: 'strategy_call',
  reason: 'A short call will help us pick the right fit together.',
}

const matches = (ruleValue, value) => ruleValue === '*' || ruleValue === (value ?? null)

/**
 * answers: { who, challenge?, goal? } → { rule, outcome, reason, secondary?, candidates? }
 * Never throws; unknown or missing answers resolve to the strategy call.
 */
export function recommend(answers = {}) {
  const { who, goal } = answers
  const challenge = challengeKey(answers.challenge)
  const rule = RULES.find((r) => r.who === who && matches(r.challenge, challenge) && matches(r.goal, goal)) || FALLBACK
  return {
    rule: rule.id,
    outcome: OUTCOMES[rule.outcome],
    reason: rule.reason,
    secondary: rule.secondary || null,
    candidates: (rule.candidates || []).map((k) => OUTCOMES[k]),
  }
}

/** Human labels for the chips and lead message; `who` disambiguates shared challenge keys. */
export function labelFor(key, value, who) {
  if (!value) return ''
  if (key === 'who') return WHO.find((w) => w.key === value)?.label || value
  if (key === 'challenge') {
    const list = challengeList(value)
    if (list.length > 1 || list[0] === 'all_of_above') {
      const all = who && CHALLENGES[who]?.find((c) => c.key === 'all_of_above')
      if (list.includes('all_of_above') && all) return all.label
      return list.map((item) => labelFor('challenge', item, who)).filter(Boolean).join(', ')
    }
    const one = list[0]
    const personaMatch = who && CHALLENGES[who]?.find((c) => c.key === one)
    if (personaMatch) return personaMatch.label
    for (const options of Object.values(CHALLENGES)) {
      const hit = options.find((c) => c.key === one)
      if (hit) return hit.label
    }
    return one
  }
  if (key === 'goal') return GOALS.find((g) => g.key === value)?.label || value
  return value
}

/** Enumerates every reachable (who, challenge, goal) — used by the test and by nothing at runtime. */
export function reachableCombinations() {
  const out = []
  for (const w of WHO) {
    const challenges = CHALLENGES[w.key]
    if (!challenges) { out.push({ who: w.key }); continue }
    for (const c of challenges) {
      if (c.key === 'all_of_above') continue
      if (!needsGoal(w.key, c.key)) { out.push({ who: w.key, challenge: c.key }); continue }
      for (const g of goalOptions(w.key, c.key)) out.push({ who: w.key, challenge: c.key, goal: g.key })
    }
    if (allowsManyChallenges(w.key)) {
      const many = ['all_of_above']
      if (!needsGoal(w.key, many)) out.push({ who: w.key, challenge: many })
      else for (const g of goalOptions(w.key, many)) out.push({ who: w.key, challenge: many, goal: g.key })
    }
  }
  return out
}
