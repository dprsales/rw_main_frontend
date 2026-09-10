/**
 * Live blog feed. Posts are authored on the DPR platform; each card links out
 * to where the post already lives (`posturl` - LinkedIn Pulse), so there are
 * no on-site article routes. Images are root-relative Bunny CDN paths, served
 * from the CDN origin (not the API host) - `cdn()` handles that.
 */
import { cdn, getBlogs } from './api'

const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']

/** Map one API blog record onto the shape `Gallery` expects for a link-out card. */
function toCard(blog) {
  const created = new Date(blog.createdAt)
  const dated = Number.isNaN(created.getTime())
    ? null
    : `${MONTHS[created.getMonth()]} ${created.getFullYear()}`
  return {
    src: cdn(blog.imageurl),
    alt: blog.title,
    title: blog.title,
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
    .map(toCard)
    .filter((card) => card.href)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
}
