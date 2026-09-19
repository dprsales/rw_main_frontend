/**
 * Project detail feed. Each project's full page is authored on the DPR
 * platform and served via `GET /projects/:slug` (CORS-open). Images come
 * back as root-relative CDN paths, same as the blog feed.
 */
import { cdn, getProjectsPaginated, getProjectBySlug } from './api'

/* content.js PROJECTS names mapped to their API slug. Names absent here have
 * no published detail page yet, so the map shows plain text, not a dead link. */
export const PROJECT_SLUGS = {
  'Acasa': 'acasasimchah',
  'Amaris': 'amaris',
  'Promenade Villas': 'promenadevillas',
  'Aparna One': 'aparna-one',
  'Niche': 'niche-by-vamsiram-homes',
  'Palatium': 'palatium',
  'Rainbow Waters': 'prestige-vaishnaoi-rainbow-waters',
  'Megaleio': 'megaleio',
  'Villa Verde': 'villaverde',
  'MSN One': 'msn-one',
  'Skymarq': 'skymarq',
  'CINQ': 'cinq',
  'Sylvanor': 'sylvanor-by-bluefin',
  'Iris': 'iris',
  'Trilight': 'trilight',
  'Skyline': 'skyline',
  'Songs of the Sun': 'songs-of-the-sun',
  'Rise With 9': 'rise-with-9',
  'Bayleaf': 'bayleaf',
  'Yula Globus': 'yulaglobus',
  'Sage': 'sage',
  'Bridge Epsilon': 'bridge-epsilon',
  'Allura': 'northstar-allura',
  'Luxury Park II': 'sreenidhi-luxury-park',
  'The Twins': 'twins',
  'Cascades': 'thecascades',
  'Bliss in the Woods': 'blissinthewoods',
  'Mirai Mist': 'mirai-mist',
}

/** Resolve a CDN path (or absolute URL) from the API to a loadable image URL. */
export const projectImage = cdn

/** Fetch one project's full detail by slug. Rejects on error/timeout so the page can show "not found". */
export async function fetchProject(slug) {
  return getProjectBySlug(slug)
}

/**
 * Fetch the live project index and merge it into `PROJECT_SLUGS`. `GET
 * /projects` is untested, so this never rejects - failure returns the map
 * unchanged; success makes newly published projects linkable automatically.
 * Matched against the curated list case-insensitively; known entries keep their hand-checked slug.
 */
export async function fetchAllProjects() {
  const rows = []
  try {
    // `GET /projects` paginates server-side, defaulting to limit 10 — page
    // through the whole index so every published project is represented.
    const LIMIT = 100
    const first = await getProjectsPaginated(1, LIMIT)
    const read = (res) => (Array.isArray(res) ? res : res?.projects) || []
    const totalItems = first?.pagination?.totalItems ?? read(first).length
    rows.push(...read(first))
    const totalPages = Math.ceil(totalItems / LIMIT)
    for (let page = 2; page <= totalPages; page++) {
      const res = await getProjectsPaginated(page, LIMIT)
      rows.push(...read(res))
    }
  } catch {
    return rows
  }
  return rows
}

export async function fetchProjectSlugs() {
  const rows = await fetchAllProjects()
  if (!rows.length) return PROJECT_SLUGS

  const known = new Map(Object.keys(PROJECT_SLUGS).map((name) => [name.toLowerCase(), name]))
  const merged = { ...PROJECT_SLUGS }
  for (const row of rows) {
    const title = row?.title?.trim()
    const slug = row?.slug?.trim()
    if (!title || !slug) continue
    const curated = known.get(title.toLowerCase())
    // Only genuinely new titles are added, so a backend rename can't orphan a curated name.
    if (!curated) merged[title] = slug
  }
  return merged
}

/** Flatten the gallery's column/row buckets ({c0r0:[...], c0r1:[...]}) to a list. */
export function flattenGallery(bucket) {
  if (!bucket) return []
  return Object.values(bucket)
    .flat()
    .filter(Boolean)
}
