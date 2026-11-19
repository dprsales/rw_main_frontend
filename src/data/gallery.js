/**
 * Gallery page catalogue.
 * YouTube stays curated here. Team RW photos load from the API (admin uploads).
 */

import { cdn } from './api'

export const GALLERY_VIDEOS = [
  {
    id: 'CTpEfcr75Cw',
    title: 'Why Real Estate Sales Are Failing in 2025',
    views: 2283,
    long: true,
  },
  {
    id: '1ecMsauChwo',
    title: 'Struggling with Rejection on Sales Calls?',
    views: 1680,
  },
  {
    id: '4wrRC5QtlnY',
    title: 'If conversions are low, the real issue is inside the process',
    views: 1437,
  },
  {
    id: 'VsNn1C6EQRI',
    title: 'Sales Leadership and Revenue Systems',
    views: 1416,
  },
  {
    id: 'paoZ7WJlVu4',
    title: 'Why Your Revenue Feels Emotional',
    views: 1184,
  },
  {
    id: 'y7g168G7l4U',
    title: 'Best Negotiation Techniques',
    views: 1076,
  },
  {
    id: 'QBGhlYtCdFE',
    title: 'How to Handle "Price Is Too High" Objections',
    views: 1064,
    likes: 24,
  },
  {
    id: 'ILHklE5qf3E',
    title: "If your sales calls feel chaotic, it's the structure",
    views: 1049,
  },
  {
    id: 'Mr3vNiiTmdo',
    title: 'Founder Doing Sales? Build Sales Systems',
    views: 1034,
  },
  {
    id: 'FUmQPBfwaF0',
    title: 'Real Estate Marketing Is Getting Out of Hand',
    views: 666,
  },
]

/**
 * Sections shown on /gallery.
 * - youtube: static curated list
 * - images: filled at runtime from GET /gallery-photos
 */
export const GALLERY_SECTIONS = [
  {
    id: 'youtube',
    type: 'youtube',
    items: GALLERY_VIDEOS,
    labelKey: 'gallery.tab.youtube',
    eyebrowKey: 'gallery.youtube.eyebrow',
    titleKey: 'gallery.youtube.title',
    introKey: 'gallery.youtube.intro',
  },
  {
    id: 'team',
    type: 'images',
    items: [],
    labelKey: 'gallery.tab.team',
    eyebrowKey: 'gallery.team.eyebrow',
    titleKey: 'gallery.team.title',
    introKey: 'gallery.team.intro',
    emptyKey: 'gallery.team.empty',
  },
]

export function youtubeWatchUrl(id) {
  return `https://www.youtube.com/watch?v=${id}`
}

export function youtubeEmbedUrl(id) {
  return `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`
}

export function youtubeThumbUrl(id) {
  return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`
}

export function formatViewCount(n) {
  return new Intl.NumberFormat('en-IN').format(n)
}

export function gallerySectionById(id) {
  return GALLERY_SECTIONS.find((row) => row.id === id) || GALLERY_SECTIONS[0]
}

export function mapGalleryPhoto(row) {
  if (!row?.url) return null
  return {
    id: row._id || row.id || row.url,
    src: cdn(row.url),
    title: row.title || '',
    caption: row.caption || '',
    alt: row.alt || row.title || 'Team RW gallery photo',
  }
}
