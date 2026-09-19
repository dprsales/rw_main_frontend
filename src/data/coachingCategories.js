/**
 * Score → module mapping for the coaching result and purchase flow.
 *
 * The six assessment dimensions are the scoring model behind every result (see
 * /assessment). Each of the sixteen coaching modules is linked to the
 * dimension(s) its delivery most directly strengthens. When a real score
 * payload is supplied (overall % plus per-dimension %) the recommendation
 * cards reference the actual value; otherwise they fall back to the route
 * scenario's band wording. Values are never invented here.
 */
import { PRESET_MODULE_IDS } from './coachingModules'

export const SCORE_DIMENSIONS = [
  { key: 'content', label: 'What you know', short: 'Knowledge' },
  { key: 'structure', label: 'How you structure answers', short: 'Structure' },
  { key: 'communication', label: 'How you communicate', short: 'Communication' },
  { key: 'confidence', label: 'How you carry yourself', short: 'Confidence' },
  { key: 'relevance', label: 'How relevant you stay', short: 'Relevance' },
  { key: 'objections', label: 'How you handle objections', short: 'Objections' },
]

export const DIMENSION_BY_KEY = Object.fromEntries(
  SCORE_DIMENSIONS.map((d) => [d.key, d]),
)

/** moduleId → the dimension(s) its coaching most directly strengthens. Central and configurable. */
export const MODULE_SCORE_LINK = {
  1: ['content', 'communication'],
  2: ['confidence', 'communication'],
  3: ['communication', 'structure'],
  4: ['content'],
  5: ['communication'],
  6: ['relevance'],
  7: ['objections'],
  8: ['confidence'],
  9: ['relevance'],
  10: ['structure'],
  11: ['objections', 'confidence'],
  12: ['communication'],
  13: ['relevance'],
  14: ['confidence'],
  15: ['structure'],
  16: ['objections', 'relevance'],
}

/** Primary score dimension for a module, e.g. { key: 'objections', short: 'Objections' }. */
export function moduleDimension(mod, index = 0) {
  const links = MODULE_SCORE_LINK[mod?.id]
  const key = links?.[index] ?? links?.[0]
  return key ? (DIMENSION_BY_KEY[key] ?? null) : null
}

/**
 * Customer-facing "why this module" line.
 * - Complete curriculum mode (overall <= 40): the module is part of the full 16.
 * - With real per-dimension scores: "Your score in Objections: 39%. A priority area…"
 * - Without scores: preset modules get the starting-point line, everyone else the development line.
 */
export function moduleRecommendationReason(mod, scenario, scoreData, type) {
  if (type === 'complete_curriculum') {
    return 'Part of the complete 16-module curriculum — layered development across every key coaching area.'
  }
  const dim = moduleDimension(mod)
  const dimScore = dim && scoreData?.dimensions?.find((d) => d.key === dim.key)

  if (dimScore && typeof dimScore.value === 'number') {
    return `Your score in ${dim.short}: ${dimScore.value}%. A priority area from your report.`
  }
  if (!scenario || scenario.scoreBand === 'default-40') {
    return 'A recommended starting point, matched to where your result points.'
  }
  if (PRESET_MODULE_IDS.includes(mod.id)) {
    return 'A recommended starting point, matched to your result.'
  }
  return 'Builds the skills this module teaches — the areas your result called out.'
}

/** Small chip label for a recommendation: "Complete curriculum" when all 16 are recommended. */
export function modulePriorityLabel(mod, type) {
  if (type === 'complete_curriculum') return 'Complete curriculum'
  return PRESET_MODULE_IDS.includes(mod.id) ? 'Priority focus' : 'Suggested development'
}