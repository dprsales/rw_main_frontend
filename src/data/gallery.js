/**
 * Gallery page catalogue.
 * YouTube stays curated here. Our photos load from the API (admin uploads).
 */

import { cdn } from './api'

/* Ordered by YouTube views (highest first). Featured = first / long. */
export const GALLERY_VIDEOS = [
  {
    id: 'PBkZL6vEG_I',
    title: 'Hyderabad real estate future trends and where to invest',
    views: 204085,
    long: true,
  },
  {
    id: '7cWmf_thsrc',
    title: 'Does Hyderabad deserve ₹177 crore per acre? Sandip Patnaik',
  },
  {
    id: 'G98oAxBOFmI',
    title: 'PVR Developers with Rajiv Williams at TREDA Property Show 2021',
    views: 11528,
  },
  {
    id: 'Qvc4VFeDIU0',
    title: 'Hyderabad real estate present situation and where to invest',
    views: 8157,
  },
  {
    id: 'cuUIFfK5CAw',
    title: 'Land rates in Hyderabad after 5 years: Rajiv Williams interview',
    views: 3696,
  },
  {
    id: 'ifFX7VviGKM',
    title: 'Musi revival project required? Insights Podcast 04 by Giridhari Homes',
    views: 1455,
  },
  {
    id: 'cRI4pNmt-v0',
    title: 'PVR Developers with Rajiv Williams at TREDA Property Show 2019',
    views: 1194,
  },
  {
    id: 'kkEWiubmfMg',
    title: 'Donald Trump impact on Hyderabad real estate and land rates',
    views: 1171,
  },
  {
    id: 'nb_1F_oWIqU',
    title: 'Exclusive interview with Rajiv Williams on KrunchTV',
    views: 1141,
  },
  {
    id: 'Wmn7DzXjvXM',
    title: 'Exploring Miyapur to Bachupally X Roads and latest developments in Miyapur',
    views: 1117,
  },
  {
    id: 'qNgZS3hAEQI',
    title: 'Realty Radar with Rajiv Williams exclusive promo',
    views: 435,
  },
  {
    id: 'NtPhVzYLOm0',
    title: 'Real Estate Mentor: Miyapur Bachupally overview',
    views: 44,
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

export function youtubeEmbedUrl(id, { autoplay = true } = {}) {
  // Use youtube.com (not nocookie). Autoplay only after the poster click so sound is allowed.
  const params = new URLSearchParams({
    rel: '0',
    modestbranding: '1',
    playsinline: '1',
    enablejsapi: '1',
  })
  if (autoplay) params.set('autoplay', '1')
  return `https://www.youtube.com/embed/${id}?${params.toString()}`
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
    alt: row.alt || row.title || 'Our gallery photo',
  }
}
