/** Per-route <head> management (no react-helmet). Usage: <Seo route="/coaching" /> or pass title/description. */
import { useEffect } from 'react'
import { DEFAULT_SEO, ROUTE_SEO, SITE } from '../data/seo-config'

function setMeta(selector, attrs, content) {
  if (content == null) return
  let el = document.head.querySelector(selector)
  if (!el) {
    el = document.createElement('meta')
    for (const [key, value] of Object.entries(attrs)) el.setAttribute(key, value)
    document.head.appendChild(el)
  }
  el.setAttribute('content', String(content))
}

function setLink(rel, href) {
  if (!href) return
  let el = document.head.querySelector(`link[rel="${rel}"]`)
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

export default function Seo({ route, title, description, image, noindex, jsonLd }) {
  const config = route ? ROUTE_SEO[route] : null
  const resolvedTitle = title || config?.title || DEFAULT_SEO.title
  const resolvedDesc = description || config?.description || DEFAULT_SEO.description
  const resolvedImage = image || config?.ogImage || SITE.ogImage
  const resolvedNoindex = noindex ?? config?.noindex ?? false
  const canonical = SITE.url + (route || (typeof window !== 'undefined' ? window.location.pathname : '/'))

  useEffect(() => {
    document.title = resolvedTitle

    setMeta('meta[name="description"]', { name: 'description' }, resolvedDesc)
    setMeta(
      'meta[name="robots"]',
      { name: 'robots' },
      resolvedNoindex ? 'noindex,nofollow' : 'index,follow,max-image-preview:large',
    )

    setMeta('meta[property="og:title"]', { property: 'og:title' }, resolvedTitle)
    setMeta('meta[property="og:description"]', { property: 'og:description' }, resolvedDesc)
    setMeta('meta[property="og:type"]', { property: 'og:type' }, 'website')
    setMeta('meta[property="og:url"]', { property: 'og:url' }, canonical)
    setMeta('meta[property="og:site_name"]', { property: 'og:site_name' }, SITE.name)
    setMeta('meta[property="og:locale"]', { property: 'og:locale' }, SITE.locale)
    setMeta(
      'meta[property="og:image"]',
      { property: 'og:image' },
      resolvedImage?.startsWith('http') ? resolvedImage : SITE.url + resolvedImage,
    )

    setMeta('meta[name="twitter:card"]', { name: 'twitter:card' }, 'summary_large_image')
    setMeta('meta[name="twitter:title"]', { name: 'twitter:title' }, resolvedTitle)
    setMeta('meta[name="twitter:description"]', { name: 'twitter:description' }, resolvedDesc)

    setLink('canonical', canonical)
  }, [resolvedTitle, resolvedDesc, resolvedImage, resolvedNoindex, canonical])

  useEffect(() => {
    if (!jsonLd) return
    const id = 'rw-jsonld-route'
    document.getElementById(id)?.remove()
    const script = document.createElement('script')
    script.id = id
    script.type = 'application/ld+json'
    script.textContent = JSON.stringify(jsonLd)
    document.head.appendChild(script)
    return () => document.getElementById(id)?.remove()
  }, [jsonLd])

  return null
}
