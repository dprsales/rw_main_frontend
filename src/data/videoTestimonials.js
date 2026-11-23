/** Client films on Home. Hosted on YouTube so plays count as channel views. */

export const VIDEO_TESTIMONIALS = [
  {
    id: 'voice-01',
    youtubeId: 'UuYKoSKsxpw',
    labelKey: 'home.videos.item.0',
    roleKey: 'home.videos.item.0.role',
  },
  {
    id: 'voice-02',
    youtubeId: 'nQAzqAWt1K8',
    labelKey: 'home.videos.item.1',
    roleKey: 'home.videos.item.1.role',
  },
  {
    id: 'voice-03',
    youtubeId: 'H0cYxCe6cUQ',
    labelKey: 'home.videos.item.2',
    roleKey: 'home.videos.item.2.role',
  },
  {
    id: 'voice-04',
    youtubeId: 'FKdbI-a10o4',
    labelKey: 'home.videos.item.3',
    roleKey: 'home.videos.item.3.role',
  },
  {
    id: 'voice-05',
    youtubeId: '-MTAe0tHYG8',
    labelKey: 'home.videos.item.4',
    roleKey: 'home.videos.item.4.role',
  },
  {
    id: 'voice-06',
    youtubeId: 'GPeMlNJlqJI',
    labelKey: 'home.videos.item.5',
    roleKey: 'home.videos.item.5.role',
  },
]

export function youtubeThumb(id, quality = 'hqdefault') {
  return `https://i.ytimg.com/vi/${id}/${quality}.jpg`
}

export function youtubeEmbedSrc(id, { autoplay = false } = {}) {
  const params = new URLSearchParams({
    rel: '0',
    modestbranding: '1',
    playsinline: '1',
  })
  if (autoplay) params.set('autoplay', '1')
  return `https://www.youtube-nocookie.com/embed/${id}?${params.toString()}`
}
