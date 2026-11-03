/** Display helpers shared by the listing pages. */
import { LOCATION_ADVANTAGES } from './options'

export function parsePrice(input) {
  if (input === undefined || input === null || input === '') return undefined
  if (typeof input === 'number') return Number.isFinite(input) ? input : undefined
  const s = String(input).toLowerCase().replace(/,/g, '').trim()
  const num = parseFloat(s.replace(/[^0-9.]/g, ''))
  if (!Number.isFinite(num)) return undefined
  if (/(cr|crore)/.test(s)) return num * 1e7
  if (/(l|lac|lakh)/.test(s)) return num * 1e5
  if (/k\b/.test(s)) return num * 1e3
  return num
}

const trim = (n) => n.toFixed(2).replace(/\.?0+$/, '')

/** ₹1.85 Cr · ₹85 L · ₹45,000 */
export function formatPrice(input, { perMonth = false } = {}) {
  const n = parsePrice(input)
  if (n === undefined) return 'Price on request'
  let out
  if (n >= 1e7) out = `₹${trim(n / 1e7)} Cr`
  else if (n >= 1e5) out = `₹${trim(n / 1e5)} L`
  else out = `₹${Math.round(n).toLocaleString('en-IN')}`
  return perMonth ? `${out}/mo` : out
}

export const isRent = (p) => /rent/i.test(p?.listingType || p?.details?.listingType || '')

export function listingTitle(p) {
  const d = p?.details || p || {}
  const type = d.propertyTypes?.[0] || p?.propertyType || 'Property'
  const bhk = type === 'Plot' ? '' : d.bhk || ''
  const action = isRent(p) ? 'Rent' : 'Sale'
  const where = [d.locality, p?.city || d.city].filter(Boolean).join(', ')
  return `${bhk} ${type} For ${action}${where ? ` in ${where}` : ''}`.replace(/\s+/g, ' ').trim()
}

export const imgUrl = (i) => (typeof i === 'string' ? i : i?.url)

export function perSqft(p) {
  const price = parsePrice(p?.details?.price)
  const area = parseFloat(p?.details?.areaSize)
  if (!price || !area || isRent(p) || (p?.details?.areaUnit && p.details.areaUnit !== 'sq.ft')) return null
  return `₹${Math.round(price / area).toLocaleString('en-IN')}/sq.ft`
}

export function timeAgo(iso) {
  if (!iso) return ''
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
  if (s < 60) return 'just now'
  const m = Math.floor(s / 60)
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  const d = Math.floor(h / 24)
  if (d < 30) return `${d}d ago`
  return new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

export function formatDate(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

export const monthLabel = (ym) => {
  if (!ym) return ''
  const dt = new Date(`${ym}-01`)
  return Number.isNaN(dt.getTime()) ? '' : dt.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })
}
export const floorLabel = (f) => (String(f) === '0' ? 'Ground' : f)

/** Eye-catching, buyer-facing points auto-generated from what the builder filled in. */
export function sellingPoints(d = {}, listingType) {
  const pts = []
  if (d.possessionStatus === 'Ready To Move') pts.push({ icon: '🔑', text: 'Ready to move in — no waiting' })
  else if (d.possessionStatus === 'Under Construction') {
    pts.push({ icon: '🏗️', text: d.possessionDate ? `Possession by ${monthLabel(d.possessionDate)}` : 'Under construction — flexible payment' })
  }
  const rate = perSqft({ details: d, listingType: listingType || d.listingType })
  if (rate) pts.push({ icon: '💰', text: `Priced at ${rate}` })
  ;(d.priceAdvantages || []).slice(0, 2).forEach((t) => pts.push({ icon: '🏷️', text: t }))
  ;(d.propertyHighlights || []).slice(0, 3).forEach((t) => pts.push({ icon: '✦', text: t }))
  if (d.facing) pts.push({ icon: '🧭', text: `${d.facing} facing` })
  if (d.view) pts.push({ icon: '🌅', text: d.view })
  LOCATION_ADVANTAGES.filter((l) => d.locationAdvantages?.[l.key]?.includes('< 1 km'))
    .slice(0, 2)
    .forEach((l) => pts.push({ icon: l.icon, text: `${l.label} within 1 km` }))
  const amenityList = Object.values(d.amenities || {}).flat()
  if (amenityList.length >= 4) pts.push({ icon: '🏊', text: `${amenityList.length} amenities incl. ${amenityList.slice(0, 2).join(', ')}` })
  if (d.reraNumber) pts.push({ icon: '🛡️', text: 'RERA registered' })
  if (d.floorNumber && d.totalFloors && Number(d.floorNumber) / Number(d.totalFloors) >= 0.6) {
    pts.push({ icon: '🏙️', text: `High floor (${d.floorNumber}/${d.totalFloors})` })
  }
  return pts
}

/** 0–100 listing quality score + what to add next. */
export function listingStrength(d = {}) {
  const words = (s) => (s || '').trim().split(/\s+/).filter(Boolean).length
  const checks = [
    { label: 'Photos', ok: (d.images || []).length >= 5, tip: `${(d.images || []).length} added — 5+ gets more clicks` },
    { label: 'Video walkthrough', ok: (d.videos || []).length > 0, tip: 'Videos convert 35% more' },
    { label: 'Catchy title', ok: words(d.oneLineDescription) >= 4, tip: 'A 5–15 word title gets more views' },
    { label: 'Detailed description', ok: words(d.description) >= 25, tip: '25+ words ranks better' },
    { label: 'Amenities', ok: Object.values(d.amenities || {}).flat().length > 0, tip: 'Helps buyers judge lifestyle' },
    { label: 'Location advantages', ok: Object.values(d.locationAdvantages || {}).flat().length > 0, tip: 'Builds location trust' },
    { label: 'Property highlights', ok: (d.propertyHighlights || []).length > 0, tip: 'Pick what makes it special' },
    { label: 'RERA number', ok: !!d.reraNumber, tip: 'A strong trust signal' },
  ]
  const score = Math.round((checks.filter((c) => c.ok).length / checks.length) * 100)
  return { score, checks, next: checks.find((c) => !c.ok) }
}
