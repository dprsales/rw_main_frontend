/**
 * Coaching result data — the single source of truth for the route-based
 * KRISAH integration. One config object per scenario, one module catalogue,
 * one preset list. No UI component hardcodes these values.
 *
 * Route contract (to be confirmed with KRISAH before production):
 *   /coaching/result            → default scenario (40%, prototype)
 *   /coaching/result/1          → 0%–40%
 *   /coaching/result/2          → 40%–50%
 *   /coaching/result/3          → 50%–60%
 *   /coaching/result/4          → 60% or above
 *   /coaching/result/low        → alias for 1
 *   /coaching/result/developing → alias for 2
 *   /coaching/result/intermediate → alias for 3
 *   /coaching/result/advanced   → alias for 4
 *   anything else               → safe fallback to default
 */

/* ---------------------------------------------------------------------------
 * 1. THE SIXTEEN AREAS OF SPECIALISATION
 * Titles are the founder-approved specialisations. Tags drive the band-based
 * ordering below; focus is the one-line "what it builds" shown on the cards.
 * ------------------------------------------------------------------------- */
export const COACHING_MODULES = [
  {
    id: 1, n: '01',
    title: 'High-Impact Property Presentation Skills',
    tags: ['presentation', 'property', 'communication'],
    focus: 'Show a property so it sells itself — structure, story, and the staged walkthrough.',
    group: 'Presentation & Practical Selling',
  },
  {
    id: 2, n: '02',
    title: 'First Impressions & Ice Breakers',
    tags: ['rapport', 'opening', 'confidence'],
    focus: 'Open a high-ticket conversation with presence instead of small talk.',
    group: 'Communication & Rapport',
  },
  {
    id: 3, n: '03',
    title: 'Messaging Skills & Information Delivery',
    tags: ['messaging', 'information', 'communication'],
    focus: 'Say the right thing at the right pacing — no information dumping over value.',
    group: 'Communication & Rapport',
  },
  {
    id: 4, n: '04',
    title: 'Understanding the Mid-to-Luxury Buyer Mindset',
    tags: ['buyer mindset', 'psychology', 'luxury'],
    focus: 'Read what a premium buyer is really buying: status, safety, sequence, certainty.',
    group: 'Foundation & Mindset',
  },
  {
    id: 5, n: '05',
    title: 'NLP Techniques for Sales Influence',
    tags: ['influence', 'persuasion', 'NLP'],
    focus: 'Language and listening patterns that position you as the person they say yes to.',
    group: 'Communication & Rapport',
  },
  {
    id: 6, n: '06',
    title: 'Handling New, Cold & Digital Leads',
    tags: ['lead handling', 'cold leads', 'digital leads'],
    focus: 'Turn a cold hello or an imported digital lead into a real conversation within minutes.',
    group: 'Lead Handling & Conversion',
  },
  {
    id: 7, n: '07',
    title: 'Objection Handling — Price, Location & Delays',
    tags: ['objections', 'price', 'location', 'delays'],
    focus: 'Meet price, location, and timing objections without defaulting to discount.',
    group: 'Objection Handling & Client Management',
  },
  {
    id: 8, n: '08',
    title: 'Emotional Intelligence in Sales Conversations',
    tags: ['EQ', 'empathy', 'emotional intelligence'],
    focus: 'Stay composed and attuned under pressure so the conversation never escalates.',
    group: 'Foundation & Mindset',
  },
  {
    id: 9, n: '09',
    title: 'Strategic Follow-Ups for Conversion',
    tags: ['follow-up', 'nurturing', 'conversion'],
    focus: 'A follow-up system that keeps momentum without ever sounding like a pest.',
    group: 'Lead Handling & Conversion',
  },
  {
    id: 10, n: '10',
    title: 'Site Visit Conversions & Closing Techniques',
    tags: ['site visit', 'closing', 'conversion'],
    focus: 'Turn the site visit into a decision day, with controlled closing sequences.',
    group: 'Lead Handling & Conversion',
  },
  {
    id: 11, n: '11',
    title: 'Handling High-Involvement Clients & Families',
    tags: ['families', 'high involvement', 'client handling'],
    focus: 'Manage a room full of decision-makers and keep every voice moving the same way.',
    group: 'Objection Handling & Client Management',
  },
  {
    id: 12, n: '12',
    title: 'Advanced Rapport & Trust Building',
    tags: ['trust', 'rapport', 'relationship'],
    focus: 'The long-horizon layer — repeat buyers, referrals, and relationships that follow you.',
    group: 'Communication & Rapport',
  },
  {
    id: 13, n: '13',
    title: 'CRM Discipline & Lead Pipeline Management',
    tags: ['CRM', 'pipeline', 'discipline'],
    focus: 'Turn your database into a repeatable revenue engine with real pipeline visibility.',
    group: 'Process & Pipeline Management',
  },
  {
    id: 14, n: '14',
    title: 'Confidence Building for High-Ticket Sales',
    tags: ['confidence', 'high-ticket', 'self-belief'],
    focus: 'Hold a premium conversation like it is yours to command — pricing and all.',
    group: 'Foundation & Mindset',
  },
  {
    id: 15, n: '15',
    title: 'Live Deal Coaching & Simulation',
    tags: ['simulation', 'practical', 'deal coaching'],
    focus: 'Rehearse a live deal with the RW team before you step into the real room.',
    group: 'Presentation & Practical Selling',
  },
  {
    id: 16, n: '16',
    title: 'Structured Negotiation Techniques',
    tags: ['negotiation', 'structure', 'deal terms'],
    focus: 'Move from discount pressure to structured terms — trade value, never just price.',
    group: 'Lead Handling & Conversion',
  },
]

/* ---------------------------------------------------------------------------
 * 2. THE FIVE RECOMMENDED STARTING POINTS (always shown first)
 * One central array — the confirmed starting points, in the order they display.
 * Change this list in one place and every route re-orders around it.
 * ------------------------------------------------------------------------- */
export const PRESET_MODULE_IDS = [1, 12, 10, 16, 14]

/* ---------------------------------------------------------------------------
 * 3. ROUTE → SCENARIO CONFIGURATION
 * The single object the route parser reads. Keys are the path segments after
 * /coaching/result/. `default` is the fallback for any missing or invalid key.
 * ------------------------------------------------------------------------- */
export const coachingResultScenarios = {
  default: {
    route: '/coaching/result',
    displayScore: 40,
    scoreBand: 'default-40',
    scoreLabel: '40%',
    bandTitle: 'Your starting plan.',
    showAllModules: true,
    showPresetModules: true,
    recommendationMode: 'broad',
    focusTags: ['rapport', 'communication', 'presentation', 'confidence'],
    developmentAreas: [
      'First impressions and how you open a conversation',
      'How clearly your info lands — pace, structure, no dump',
      'The confidence you carry into a high-ticket price conversation',
    ],
  },
  '1': {
    route: '/coaching/result/1',
    displayScore: 39,
    scoreBand: 'below-40',
    scoreLabel: '0%–40%',
    bandTitle: 'Foundations first.',
    showAllModules: true,
    showPresetModules: true,
    recommendationMode: 'foundational',
    focusTags: ['confidence', 'rapport', 'communication', 'presentation', 'EQ'],
    developmentAreas: [
      'Foundation and mindset — confidence, EQ, first impressions',
      'How you structure and deliver information',
      'The basics of a premium, high-ticket presence',
    ],
  },
  '2': {
    route: '/coaching/result/2',
    displayScore: 49,
    scoreBand: 'below-50',
    scoreLabel: '40%–50%',
    bandTitle: 'Priority improvement areas.',
    showAllModules: true,
    showPresetModules: true,
    recommendationMode: 'priority-gaps',
    focusTags: ['lead handling', 'follow-up', 'conversion', 'objections', 'CRM'],
    developmentAreas: [
      'Lead handling — cold, new and digital leads',
      'Follow-up systems that hold momentum',
      'Objection handling around price, location and delays',
    ],
  },
  '3': {
    route: '/coaching/result/3',
    displayScore: 59,
    scoreBand: 'below-60',
    scoreLabel: '50%–60%',
    bandTitle: 'Gap-based progression.',
    showAllModules: true,
    showPresetModules: true,
    recommendationMode: 'gap-based',
    focusTags: ['site visit', 'closing', 'conversion', 'negotiation', 'simulation'],
    developmentAreas: [
      'Site visits that convert instead of tour',
      'Structured closing and negotiation sequences',
      'Live-deal pressure rehearsal before the real room',
    ],
  },
  '4': {
    route: '/coaching/result/4',
    displayScore: 60,
    scoreBand: '60-plus',
    scoreLabel: 'Above 60%',
    bandTitle: 'Advanced refinement.',
    showAllModules: true,
    showPresetModules: true,
    recommendationMode: 'intelligent-targeted',
    focusTags: ['buyer mindset', 'psychology', 'influence', 'families', 'trust', 'high involvement'],
    developmentAreas: [
      'The mid-to-luxury buyer psychology, deeper',
      'Advanced rapport, trust and long-horizon relationships',
      'High-involvement clients and families — leading the room',
    ],
  },
}

/* Named aliases so KRISAH can choose clearer words over numbers if preferred. */
const SCENARIO_ALIASES = {
  low: '1',
  developing: '2',
  intermediate: '3',
  advanced: '4',
  default: 'default',
}

/**
 * Reads a pathname and resolves the scenario key. Unknown routes fall back to
 * 'default' so the page can never 500 on a malformed URL.
 */
export function scenarioKeyFromPath(pathname) {
  const match = pathname.match(/^\/coaching\/result(?:\.html)?\/?([^/]*)\/?$/)
  if (!match || !match[1]) return 'default'
  const seg = match[1]
  if (coachingResultScenarios[seg]) return seg
  return SCENARIO_ALIASES[seg] ?? 'default'
}

/** The resolved scenario configuration, always non-null. */
export function getCoachingScenario(pathname) {
  const key = scenarioKeyFromPath(pathname)
  return coachingResultScenarios[key] ?? coachingResultScenarios.default
}

/* ---------------------------------------------------------------------------
 * 4. RECOMMENDATION ENGINE
 * Layer A (preset, always first) → Layer B (band-ordered) → Layer C (catalogue,
 * only when the scenario wants it). Deduplicated by module id.
 * ------------------------------------------------------------------------- */
export function orderRecommendedModules(scenario, asIds = false) {
  const preset = PRESET_MODULE_IDS.filter((id) =>
    COACHING_MODULES.some((m) => m.id === id),
  )

  const focus = (scenario?.focusTags ?? []).map((t) => t.toLowerCase())

  const score = (m) => {
    const matchCount = m.tags.filter((t) => focus.includes(t.toLowerCase())).length
    const presetRank = preset.indexOf(m.id)
    if (presetRank !== -1) return -1000 + presetRank
    return -matchCount
  }

  const ranked = [...COACHING_MODULES]
    .sort((a, b) => score(a) - score(b) || a.id - b.id)
    .map((m) => m.id)

  const final = scenario.showAllModules ? ranked : ranked.filter((id) => preset.includes(id))

  return asIds ? final : final.map((id) => COACHING_MODULES.find((m) => m.id === id))
}

/* ---------------------------------------------------------------------------
 * 5. SCORE-DRIVEN RECOMMENDATION RULE
 * The business rule from the MD:
 *   overall <= 40  → recommend ALL 16 modules (complete curriculum)
 *   otherwise      → the targeted starting-point set
 * The overall used is the real ?score value when KRISAH sends one; without a
 * real score the scenario's displayScore (the band the route maps to) decides,
 * so the default 40% route recommends the full curriculum.
 * ------------------------------------------------------------------------- */
export function recommendationFor(scenario, scoreData) {
  const overall = scoreData?.overall != null ? Number(scoreData.overall) : (scenario?.displayScore ?? 40)
  const complete = overall <= 40
  return {
    overall,
    type: complete ? 'complete_curriculum' : 'targeted_recommendation',
    ids: complete
      ? COACHING_MODULES.map((m) => m.id)
      : PRESET_MODULE_IDS.filter((id) => COACHING_MODULES.some((m) => m.id === id)),
  }
}

/** Customer-facing line for each recommendation mode. */
export function recommendationCopy(type) {
  return type === 'complete_curriculum'
    ? 'Based on your assessment score, we recommend the complete 16-module coaching curriculum to support development across all key areas.'
    : 'A focused set of starting points, matched directly to your result.'
}