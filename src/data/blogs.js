/**
 * Live blog feed. Posts are authored on the DPR platform; each card links out
 * to where the post already lives (`posturl` - LinkedIn Pulse), so there are
 * no on-site article routes. Images are root-relative Bunny CDN paths, served
 * from the CDN origin (not the API host) - `cdn()` handles that.
 *
 * Curation below only affects this website — nothing is changed in the CMS or on
 * LinkedIn. Everything is matched by the post's stable `slug`, never by title.
 * (T19, see ARTICLE_TO_SERVICE_AUDIT.md.)
 */
import { cdn, getBlogs } from './api'

const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']

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

/**
 * "Related reading" on each service page (order = display order). Each list matches what
 * that page sells: Coaching = an individual's selling skill; Consulting = the developer's
 * sales team, process and leadership; Realty = sales mandates and luxury positioning
 * (developer-facing, not home-buyer advice).
 */
export const RELATED_READING = {
  coaching: [
    'what-billionaires-teach-us-about-negotiation-and-client-psychology',
    'the-hidden-rules-of-luxury-sales-what-the-ultra-wealthy-won-t-tell-you',
    'the-real-reason-buyers-compare-you-with-cheaper-projects',
  ],
  consulting: [
    'why-real-estate-sales-teams-lose-deals-in-2025-and-how-to-win-smarter',
    'if-your-sales-team-can-t-explain-value-price-will-always-be-the-problem',
    'the-leader-s-blind-spot-how-bias-quietly-damages-sales-teams',
  ],
  realty: [
    'why-most-developers-fail-at-luxury-positioning-and-how-the-winners-stand-apart',
    'would-the-1-fall-for-a-billboard-then-why-should-you',
    'why-high-end-residences-are-selling-like-hotcakes-despite-economic-uncertainty',
  ],
}

/** Very long headlines (a full sentence) read badly on a card; the CMS's SEO title is the short form. */
const LONG_TITLE = 90
const cardTitle = (blog) => (blog.title?.length > LONG_TITLE && blog.metaTitle ? blog.metaTitle : blog.title)

/** Map one API blog record onto the shape `Gallery` expects for a link-out card. */
function toCard(blog) {
  const created = new Date(blog.createdAt)
  const dated = Number.isNaN(created.getTime())
    ? null
    : `${MONTHS[created.getMonth()]} ${created.getFullYear()}`
  const title = cardTitle(blog)
  return {
    slug: blog.slug,
    src: cdn(blog.imageurl),
    alt: title,
    title,
    meta: dated,
    desc: blog.metaDescription,
    href: blog.posturl,
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
