/**
 * guidance.js — the "Find the right fit" finder: questions, options and the
 * recommendation table. Pure data plus one lookup; no React, no fetch.
 *
 * Flow: Q1 (who) → Q2 (what's in the way; options depend on Q1; skipped for
 * investor / not sure) → Q3 (what would help; a tie-breaker asked only when two
 * or more services still fit) → one of five outcomes.
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
  { key: 'sales_leader', label: 'Sales head / manager' },
  { key: 'sales_pro', label: 'Sales professional' },
  { key: 'investor', label: 'Investor / Buyer' },
]

// Q2 — options depend on Q1. Personas not listed here skip the question.

export const CHALLENGES = {
  developer: [
    { key: 'unsold_inventory', label: "Inventory isn't moving" },
    { key: 'slow_sales', label: 'Sales are slower than they should be' },
    { key: 'team_performance', label: 'My sales team underperforms' },
    { key: 'no_sales_setup', label: 'No sales team or process yet' },
    { key: 'positioning', label: 'Wrong buyers, wrong price perception' },
    { key: 'other', label: 'Something else' },
  ],
  sales_leader: [
    { key: 'team_performance', label: 'Team underperforms' },
    { key: 'low_closing', label: "Leads don't convert" },
    { key: 'process_crm', label: 'No process or CRM discipline' },
    { key: 'positioning', label: 'Project positioning' },
    { key: 'other', label: 'Something else' },
  ],
  sales_pro: [
    { key: 'low_closing', label: "I don't close enough" },
    { key: 'luxury_skills', label: 'I want to move into luxury' },
    { key: 'career_growth', label: 'I want to grow faster' },
    { key: 'other', label: 'Something else' },
  ],
}

// Q3 — the tie-breaker. Same wording everywhere; `hand_over` is developer-only,
// and `train_team` is hidden when there is no team to train.

export const GOALS = [
  { key: 'train_team', label: 'Train the team we have' },
  { key: 'fix_process', label: 'Rebuild how sales is run — process, structure, CRM' },
  { key: 'hand_over', label: 'Hand sales to a dedicated external team', only: ['developer'] },
]

/** Q3 is asked only for these (who, challenge) combinations. */
export function needsGoal(who, challenge) {
  if (who === 'developer') return true
  if (who === 'sales_leader') return challenge === 'team_performance' || challenge === 'other'
  return false
}

/** Q3 options for a given (who, challenge). */
export function goalOptions(who, challenge) {
  return GOALS.filter((g) => {
    if (g.only && !g.only.includes(who)) return false
    if (g.key === 'train_team' && challenge === 'no_sales_setup') return false
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
    to: '/realty/portfolio',
    formTrack: null,
    interest: 'Something else',
    cta: 'Browse the projects',
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
    reason: "You're on the buying side. RW Realty's mandated projects are the place to start." },
  { id: 'R2', who: 'unsure', challenge: '*', goal: '*', outcome: 'strategy_call',
    reason: "Let's work out the right fit on a short call." },

  { id: 'R3', who: 'sales_pro', challenge: 'low_closing', goal: '*', outcome: 'coaching',
    reason: 'Coaching is a practical starting point for reviewing and strengthening how you handle and close opportunities.' },
  { id: 'R4', who: 'sales_pro', challenge: '*', goal: '*', outcome: 'coaching',
    reason: 'Coaching is the individual track. The assessment can help identify where to begin.',
    secondary: { label: 'Take the assessment first', to: '/assessment' } },

  { id: 'R5', who: 'sales_leader', challenge: 'low_closing', goal: '*', outcome: 'coaching',
    reason: 'Coaching is a practical starting point for reviewing and strengthening how the team handles and closes opportunities.' },
  { id: 'R6', who: 'sales_leader', challenge: 'process_crm', goal: '*', outcome: 'consulting',
    reason: 'Consulting is the relevant starting point for reviewing pipeline discipline, sales process and CRM structure.' },
  { id: 'R7', who: 'sales_leader', challenge: 'positioning', goal: '*', outcome: 'consulting',
    reason: 'Project positioning often needs changes beyond the sales floor. Consulting can examine the wider sales operation.' },
  { id: 'R8', who: 'sales_leader', challenge: '*', goal: 'train_team', outcome: 'coaching',
    reason: "You want the existing team performing. That's coaching." },
  { id: 'R9', who: 'sales_leader', challenge: '*', goal: 'fix_process', outcome: 'consulting',
    reason: "You want the operation rebuilt around the team. That's consulting." },
  { id: 'R10', who: 'sales_leader', challenge: '*', goal: 'unsure', outcome: 'strategy_call',
    reason: 'Coaching or consulting — a short strategy call can help clarify the right fit.',
    candidates: ['coaching', 'consulting'] },

  { id: 'R11', who: 'developer', challenge: '*', goal: 'train_team', outcome: 'coaching',
    reason: 'You want to keep the existing team and strengthen its closing skills. Coaching is the relevant starting point.' },
  { id: 'R12', who: 'developer', challenge: '*', goal: 'fix_process', outcome: 'consulting',
    reason: 'You want to review how sales is run across process, structure and CRM. Consulting is the relevant starting point.' },
  { id: 'R13', who: 'developer', challenge: '*', goal: 'hand_over', outcome: 'realty',
    reason: 'You build, RW Realty sells — strategy, onsite team and funnel, end to end.' },
  { id: 'R14', who: 'developer', challenge: '*', goal: 'unsure', outcome: 'strategy_call',
    reason: 'Consulting or a mandate — depends on how much you want to keep in-house.',
    candidates: ['consulting', 'realty'] },
]

const FALLBACK = {
  id: 'fallback',
  outcome: 'strategy_call',
  reason: "Let's work out the right fit on a short call.",
}

const matches = (ruleValue, value) => ruleValue === '*' || ruleValue === (value ?? null)

/**
 * answers: { who, challenge?, goal? } → { rule, outcome, reason, secondary?, candidates? }
 * Never throws; unknown or missing answers resolve to the strategy call.
 */
export function recommend(answers = {}) {
  const { who, challenge, goal } = answers
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
    const personaMatch = who && CHALLENGES[who]?.find((c) => c.key === value)
    if (personaMatch) return personaMatch.label
    for (const list of Object.values(CHALLENGES)) {
      const hit = list.find((c) => c.key === value)
      if (hit) return hit.label
    }
    return value
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
      if (!needsGoal(w.key, c.key)) { out.push({ who: w.key, challenge: c.key }); continue }
      for (const g of goalOptions(w.key, c.key)) out.push({ who: w.key, challenge: c.key, goal: g.key })
    }
  }
  return out
}
