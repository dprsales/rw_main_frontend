import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SCORE_DIMENSIONS } from '../data/coachingCategories'

/**
 * Reads optional KRISAH score data from the URL on /coaching/result and
 * /coaching/purchase:
 *
 *   ?score=48                            overall Interview Readiness score (0–100)
 *   ?categories=content:84,structure:66  per-dimension scores
 *
 * The site does not receive automatic score data today — KRISAH redirect params
 * are not wired yet — so this returns null and the flow runs on the route's
 * scenario band instead. Returns a plain object or null; never invents numbers.
 */
function parseDimensions(raw) {
  if (!raw) return []
  const dims = []
  for (const part of raw.split(',')) {
    const [key, value] = part.split(':')
    const def = key ? SCORE_DIMENSIONS.find((d) => d.key === key.trim().toLowerCase()) : null
    const num = Number(String(value ?? '').trim())
    if (def && Number.isFinite(num)) {
      dims.push({
        key: def.key,
        label: def.label,
        short: def.short,
        value: Math.min(100, Math.max(0, num)),
      })
    }
  }
  return dims
}

export default function useScoreData() {
  const [params] = useSearchParams()

  return useMemo(() => {
    const overallRaw = params.get('score')
    const overall = overallRaw == null ? null : Number(overallRaw)
    const dimensions = parseDimensions(params.get('categories'))

    if (overall == null && dimensions.length === 0) return null
    return {
      overall:
        overall != null && Number.isFinite(overall) ? Math.min(100, Math.max(0, overall)) : null,
      dimensions,
    }
  }, [params])
}