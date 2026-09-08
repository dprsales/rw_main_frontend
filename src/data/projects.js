/** Project detail feed, served by `GET /projects/:slug`; images load from the DPR CDN like the blog feed's. */
import { cdn, getProjects, getProjectBySlug } from './api'

// content.js project names mapped to their API slug; names absent here have no detail page yet.
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

/** Fetch one project's full detail by slug; rejects so the page can show a "not found" state. */
export async function fetchProject(slug) {
  return getProjectBySlug(slug)
}

/** Merge the live project index into `PROJECT_SLUGS`; never rejects, curated entries keep their slug. */
export async function fetchProjectSlugs() {
  let list
  try {
    list = await getProjects()
  } catch {
    return PROJECT_SLUGS
  }

  const rows = Array.isArray(list) ? list : list?.projects
  if (!Array.isArray(rows)) return PROJECT_SLUGS

  const known = new Map(Object.keys(PROJECT_SLUGS).map((name) => [name.toLowerCase(), name]))
  const merged = { ...PROJECT_SLUGS }
  for (const row of rows) {
    const title = row?.title?.trim()
    const slug = row?.slug?.trim()
    if (!title || !slug) continue
    const curated = known.get(title.toLowerCase())
    // Only add genuinely new titles; a backend rename can't orphan a curated name.
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
