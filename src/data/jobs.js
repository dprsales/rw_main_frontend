/** Open roles for the careers page: `fetchRoles` never rejects, falls back to static `CAREER_ROLES`. */
import { getJobs } from './api'
import { CAREER_ROLES } from './content'

// API category codes mapped to the display names the careers page filters on.
const CATEGORY_LABELS = {
  sales: 'Sales',
  sm: 'Marketing',
  dm: 'Marketing',
  marketing: 'Marketing',
  'business development': 'Marketing',
  businessdevelopment: 'Marketing',
  bd: 'Marketing',
  mgd: 'Operations',
  hr: 'Operations',
  developer: 'Marketing',
  freelancer: 'Freelancer',
  freelance: 'Freelancer',
}

/** Map one API job record onto the card shape the careers grid renders. */
function toRole(job) {
  const title = job?.jobTitle?.trim() || job?.title?.trim()
  if (!title) return null

  const rawCategory = job.category?.trim() || ''
  const category = CATEGORY_LABELS[rawCategory.toLowerCase()] || rawCategory || 'Sales'
  const freelance = category === 'Freelancer'
  const location = job.location?.trim() || (freelance ? 'Remote' : 'Hyderabad')
  const responsibilities = job.roleResponsibilities || job.responsibilities || []

  return {
    id: job._id,
    title,
    // Composed since the API has no field for the engagement line.
    type: freelance ? `FREELANCE · ${location.toUpperCase()}` : `FULL-TIME · ${location.toUpperCase()}`,
    category,
    level: job.level?.trim() || 'Open role',
    experience: job.experience?.trim() || 'Experience varies',
    location,
    description: job.description?.trim() || job.desc?.trim() || '',
    requirements: Array.isArray(responsibilities) ? responsibilities.filter(Boolean) : [],
  }
}

/** "Content Strategist" → "contentstrategist". Letters and digits only, lowercased. */
export function careerRoleSlug(title) {
  return String(title || '').toLowerCase().replace(/[^a-z0-9]/g, '')
}

/** Public apply URL for one open role. */
export function careerRolePath(title) {
  const slug = careerRoleSlug(title)
  return slug ? `/careers/${slug}` : '/careers/apply'
}

export function findRoleBySlug(roles, slug) {
  const key = String(slug || '').toLowerCase()
  if (!key) return null
  return (roles || []).find((role) => careerRoleSlug(role.title) === key) || null
}

/** Work mode follows the role: freelancer seats are remote; Sales, Marketing, and Operations are onsite. */
export function roleWorkMode(title, roles = CAREER_ROLES) {
  const list = Array.isArray(roles) && roles.length ? roles : CAREER_ROLES
  const role = list.find((item) => item.title === title) || CAREER_ROLES.find((item) => item.title === title)
  if ((role?.category || '').toLowerCase() === 'freelancer') {
    return {
      options: ['Remote'],
      value: 'Remote',
      hint: 'This role is completely remote.',
    }
  }
  return {
    options: ['Onsite (in office)'],
    value: 'Onsite (in office)',
    hint: 'This role is completely onsite.',
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

  const rows = Array.isArray(jobs) ? jobs : jobs?.jobs
  if (!Array.isArray(rows)) return CAREER_ROLES

  const mapped = rows.map(toRole).filter(Boolean)
  // Empty API result is ambiguous, so keep the curated list rather than showing nothing.
  const listed = mapped.length >= 10 ? mapped.slice(0, 10) : CAREER_ROLES
  return withCuratedSalesHeads(listed)
}

/** Seats that must stay on the careers page even when the live feed is a full set of other jobs. */
const CURATED_SALES_HEADS = [
  'Channel Partner Closing Sales Manager',
  'Asst. Channel Sales Manager - Commercial',
  'Asst. Channel Sales Manager - Residential',
  'Asst. Sourcing Manager - Commercial',
  'Asst. Sourcing Manager - Residential',
  'Channel Partner Sourcing Head',
  'Channel Partner Closing Sales Head',
  'Assistant General Manager',
  'General Manager',
  'Associate Vice President',
  'Vice President',
  'Senior Vice President',
  'Finance & Account Manager',
]

function roleIdentity(role) {
  return `${(role.title || '').toLowerCase()}|${(role.category || '').toLowerCase()}`
}

function withCuratedSalesHeads(roles) {
  const have = new Set((roles || []).map(roleIdentity))
  const extra = CAREER_ROLES.filter((role) => {
    const keep = CURATED_SALES_HEADS.includes(role.title) || role.category === 'Freelancer'
    return keep && !have.has(roleIdentity(role))
  })
  return extra.length ? [...roles, ...extra] : roles
}
