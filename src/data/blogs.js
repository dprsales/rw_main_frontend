/**
 * Live blog feed from our API. A post with body sections opens on /articles/:slug.
 * A post that only has a LinkedIn URL still links out. Images are Bunny CDN paths
 * — `cdn()` handles that. Hidden slugs stay off this website only.
 */
import { cdn, getBlogs } from './api'

/** Off-topic for a sales/real-estate site, or reads as tax advice. Remove a slug to show it again. */
const HIDDEN_ON_SITE = new Set([
  'the-kurnool-tragedy-why-india-needs-a-zero-tolerance-policy-for-drunk-driving',
  'buy-borrow-die-how-the-rich-live-tax-free-and-leave-millions-behind',
  'how-luxury-actually-saves-you-money-when-you-know-how-to-structure-it-right',
])

/** Home "Writing" leads with one strong post per vertical; the rest follow newest-first. */
export const HOME_FEATURED = [
  'the-hidden-rules-of-luxury-sales-what-the-ultra-wealthy-won-t-tell-you',        // Coaching
  'why-real-estate-sales-teams-lose-deals-in-2025-and-how-to-win-smarter',         // Consulting
  'why-most-developers-fail-at-luxury-positioning-and-how-the-winners-stand-apart', // Realty (luxury / mandates)
]

/** Very long headlines (a full sentence) read badly on a card; the CMS's SEO title is the short form. */
const LONG_TITLE = 90
const cardTitle = (blog) => (blog.title?.length > LONG_TITLE && blog.metaTitle ? blog.metaTitle : blog.title)

/** Map one API blog record onto the shape `Gallery` expects for a link-out card. */
function hasBody(blog) {
  return Array.isArray(blog.sections) && blog.sections.some((section) => section?.title || section?.description)
}

function toCard(blog) {
  const title = cardTitle(blog)
  return {
    slug: blog.slug,
    src: cdn(blog.imageurl),
    alt: title,
    title,
    desc: blog.metaDescription,
    href: hasBody(blog) ? `/articles/${blog.slug}` : blog.posturl,
    createdAt: blog.createdAt,
  }
}

/** Fetch published blogs, newest first, mapped to card shape. Rejects on error so callers can fall back. */
export async function fetchBlogs() {
  const blogs = await getBlogs()
  return blogs
    .filter((blog) => !HIDDEN_ON_SITE.has(blog.slug))
    .map(toCard)
    .filter((card) => card.href)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
}

/** One shared request per page load, reused by the home feed and every "Related reading" row. */
let feedPromise = null
export function fetchBlogsOnce() {
  if (!feedPromise) feedPromise = fetchBlogs().catch((err) => { feedPromise = null; throw err })
  return feedPromise
}

/** Cards for `slugs`, in that order; slugs no longer in the feed are skipped. */
export const pickBySlug = (cards, slugs) => slugs.map((slug) => cards.find((c) => c.slug === slug)).filter(Boolean)

/** `slugs` first (in order), then everything else in its existing order. */
export function featureFirst(cards, slugs) {
  const featured = pickBySlug(cards, slugs)
  return [...featured, ...cards.filter((c) => !featured.includes(c))]
}
