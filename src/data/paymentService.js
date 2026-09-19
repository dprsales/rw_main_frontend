/**
 * Payment integration seam for the coaching purchase flow.
 *
 * There is deliberately NO payment gateway wired in yet — no Razorpay, Stripe,
 * PayPal, no amount data sent to any provider, and no secret keys anywhere in
 * this frontend (keys never live in a browser bundle). The checkout ends in an
 * honest "purchase request recorded" state, and a future backend can replace
 * the three placeholder methods below without touching the page logic.
 *
 * Future contract (backend /api/payments/* once it exists):
 *   POST /api/payments/create-order  { modules, count, baseAmount,
 *                                      discountPercent, discountAmount,
 *                                      payableAmount, customer }
 *        -> { orderId, amount, currency, status: 'pending' }
 *   POST /api/payments/verify        { orderId, paymentId }
 *        -> { status: 'completed' | 'pending' | 'failed' }
 *   GET  /api/payments/status/:orderId
 *        -> { status, orderId }
 *
 * The page only ever sends customer details together with the amount summary;
 * all signature handling stays on the server.
 */
import { getErrorMessage } from './api'

/** Flip `enabled: true` (and set a provider) only when a real gateway goes live. */
export const PAYMENT_CONFIG = {
  enabled: false,
  provider: null,
}

const NOT_CONFIGURED_MESSAGE =
  'Payment setup is currently being finalised. Your request has been recorded and our team will contact you regarding the next step.'

function notConfigured(extra = {}) {
  return {
    configured: false,
    status: 'not-configured',
    message: NOT_CONFIGURED_MESSAGE,
    ...extra,
  }
}

/** Create a payment order. Until a gateway is configured this resolves to "not configured". */
export async function createOrder(order) {
  if (!PAYMENT_CONFIG.enabled) return notConfigured({ orderId: null })
  // TODO(backend): POST /api/payments/create-order with `order`, then return the order.
  return notConfigured({ orderId: null })
}

/** Verify a completed payment. Placeholder — never fakes a success response. */
export async function verifyPayment(details) {
  if (!PAYMENT_CONFIG.enabled) return notConfigured()
  // TODO(backend): POST /api/payments/verify with `details`.
  return notConfigured()
}

/** Poll a payment's status. Placeholder — stays "not configured" until a gateway exists. */
export async function getPaymentStatus(orderId) {
  if (!PAYMENT_CONFIG.enabled) return notConfigured({ orderId })
  // TODO(backend): GET /api/payments/status/:orderId.
  return notConfigured({ orderId })
}

function storageKey(orderId) {
  return `rw.coaching.purchase.${orderId}`
}

/**
 * Records the purchase request.
 *
 * With no gateway the record is kept locally in the browser (so the "recorded"
 * wording on the status screen is truthful) and flagged `recordedLocally: true`.
 * Once a backend exists, POST the same payload to /api/payments/... (or the
 * existing /leads route) and flip `recordedLocally` to false.
 *
 * Returns the honest result object the status screen renders from. Never
 * returns a "payment succeeded" shape — a gateway does not exist yet.
 */
export async function submitPurchaseRequest({ orderId, modules, count, pricing, customer }) {
  try {
    if (PAYMENT_CONFIG.enabled) {
      const order = await createOrder({
        modules,
        count,
        baseAmount: pricing.baseAmount,
        discountPercent: pricing.discountPercent,
        discountAmount: pricing.discountAmount,
        payableAmount: pricing.payableAmount,
        customer,
      })
      return { ...order, recorded: true, recordedLocally: false }
    }

    const payload = {
      orderId,
      modules,
      count,
      pricing,
      customer,
      createdAt: new Date().toISOString(),
    }

    try {
      window.localStorage.setItem(storageKey(orderId), JSON.stringify(payload))
    } catch (err) {
      console.warn('[payment] could not keep a local record:', getErrorMessage(err))
    }

    return {
      configured: false,
      status: 'recorded',
      recorded: true,
      recordedLocally: true,
      orderId,
      message: NOT_CONFIGURED_MESSAGE,
    }
  } catch (err) {
    return {
      configured: false,
      status: 'error',
      recorded: false,
      orderId: null,
      message: getErrorMessage(err),
    }
  }
}