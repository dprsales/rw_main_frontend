/**
 * Coaching purchase pricing — the single source of truth for every number on
 * the checkout flow. No component hardcodes a price or a discount: change the
 * tier table here and the whole flow re-prices itself.
 *
 *   module price       ₹5,000 each
 *   1–4 modules        0%  discount
 *   5–9 modules        5%  discount
 *   10–15 modules      10% discount
 *   16 modules         15% discount
 */

export const MODULE_BASE_PRICE = 5000
export const CURRENCY = 'INR'

/** Ordered discount tiers. The first tier whose [min,max] contains the count wins. */
export const DISCOUNT_TIERS = [
  { min: 16, max: 16, percent: 15 },
  { min: 10, max: 15, percent: 10 },
  { min: 5, max: 9, percent: 5 },
  { min: 1, max: 4, percent: 0 },
]

/** The discount percentage that applies to a given module count. */
export function getDiscountPercent(count) {
  const n = Math.max(0, Math.floor(count || 0))
  const tier = DISCOUNT_TIERS.find((t) => n >= t.min && n <= t.max)
  return tier ? tier.percent : 0
}

/**
 * Full price breakdown for a selection of `count` modules. All amounts are
 * integers (no paisa precision in the Indian retail units used here), so the
 * discount can never drift with floating-point maths.
 */
export function calculatePricing(count) {
  const n = Math.max(0, Math.floor(count || 0))
  const baseAmount = n * MODULE_BASE_PRICE
  const discountPercent = getDiscountPercent(n)
  const discountAmount = Math.round((baseAmount * discountPercent) / 100)
  return {
    count: n,
    unitPrice: MODULE_BASE_PRICE,
    baseAmount,
    discountPercent,
    discountAmount,
    payableAmount: baseAmount - discountAmount,
  }
}

/** Currency string in Indian grouping, e.g. "₹23,750". */
export function formatINR(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: CURRENCY,
    maximumFractionDigits: 0,
  }).format(amount)
}

/** "1 Module" / "5 Modules" label for an arbitrary selection count. */
export function labelForCount(count) {
  return `${count} Module${count === 1 ? '' : 's'}`
}

/** The four fixed packages offered on the checkout. `count` is what pricing keys on. */
export const PACKAGES = [
  {
    id: 'single',
    label: 'Single Module',
    count: 1,
    blurb: 'One focused coaching area, matched to your result.',
  },
  {
    id: 'five',
    label: '5 Module Package',
    count: 5,
    blurb: 'A structured first plan of five recommended areas.',
  },
  {
    id: 'ten',
    label: '10 Module Package',
    count: 10,
    blurb: 'Broad, deep development across ten coaching areas.',
  },
  {
    id: 'complete',
    label: 'Complete 16 Module',
    count: 16,
    blurb: 'The full specialisation — all sixteen coaching areas.',
  },
]

export function getPackageById(id) {
  return PACKAGES.find((p) => p.id === id) ?? null
}