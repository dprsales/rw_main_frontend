/** Live blog feed: posts link out to LinkedIn Pulse via `posturl`; images load from the DPR CDN via `cdn()`. */
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

/** Fetch published blogs, newest first, mapped to card shape. */
export async function fetchBlogs() {
  const blogs = await getBlogs()
  return blogs
    .map(toCard)
    .filter((card) => card.href)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
}
