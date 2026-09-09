/** Open roles for the careers page: `fetchRoles` never rejects, falls back to static `CAREER_ROLES`. */
import { getJobs } from './api'
import { CAREER_ROLES } from './content'

// API category codes mapped to the display names the careers page filters on.
const CATEGORY_LABELS = {
  sales: 'Sales',
  sm: 'Business Development',
  dm: 'Business Development',
  marketing: 'Business Development',
  'business development': 'Business Development',
  businessdevelopment: 'Business Development',
  bd: 'Business Development',
  mgd: 'Operations',
  hr: 'Client Relations',
  developer: 'Business Development',
}

/** Map one API job record onto the card shape the careers grid renders. */
function toRole(job) {
  const title = job?.jobTitle?.trim() || job?.title?.trim()
  if (!title) return null

  const location = job.location?.trim() || 'Hyderabad'
  const rawCategory = job.category?.trim() || ''
  const responsibilities = job.roleResponsibilities || job.responsibilities || []

  return {
    id: job._id,
    title,
    // Composed since the API has no field for the engagement line.
    type: `FULL-TIME · ${location.toUpperCase()}`,
    category: CATEGORY_LABELS[rawCategory.toLowerCase()] || rawCategory || 'Sales',
    level: job.level?.trim() || 'Open role',
    experience: job.experience?.trim() || 'Experience varies',
    location,
    description: job.description?.trim() || job.desc?.trim() || '',
    requirements: Array.isArray(responsibilities) ? responsibilities.filter(Boolean) : [],
  }
}

/** Live open roles, falling back to the curated list; never rejects. */
export async function fetchRoles() {
  let jobs
  try {
    jobs = await getJobs()
  } catch {
    return CAREER_ROLES
  }

  const rows = (Array.isArray(jobs) ? jobs : jobs?.jobs)?.filter((job) => {
    const title = (job?.jobTitle || job?.title || '').toLowerCase()
    return !title.includes('channel partner')
  })
  if (!Array.isArray(rows)) return CAREER_ROLES

  const mapped = rows.map(toRole).filter(Boolean)
  // Empty API result is ambiguous, so keep the curated list rather than showing nothing.
  return mapped.length >= 10 ? mapped.slice(0, 10) : CAREER_ROLES
}
