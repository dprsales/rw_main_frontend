/**
 * Payment orchestration for the coaching purchase flow — Razorpay Checkout.
 *
 * The backend (`src/payments/`) creates the order and holds the real secret
 * keys; this file only ever sees the publishable key_id Razorpay's own
 * Checkout script needs to open the modal. No amount is trusted from the
 * browser on the way back — /payments/verify and the webhook both re-check
 * the signature server-side before anything is marked paid.
 *
 * Every function here resolves to a result object, never throws to the call
 * site: { status: 'completed' | 'failed' | 'cancelled' | 'error', orderId, message? }.
 * 'cancelled' means the customer closed the Checkout modal without paying —
 * not an error, just an incomplete attempt they can retry.
 */
import { createPaymentOrder, verifyPayment, getPaymentStatus, getErrorMessage } from './api'

export const PAYMENT_CONFIG = {
  enabled: true,
  provider: 'razorpay',
}

const CHECKOUT_SRC = 'https://checkout.razorpay.com/v1/checkout.js'
let checkoutPromise = null

/** Loads Razorpay's Checkout script once; every call after the first reuses the same promise. */
function loadCheckout() {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('Checkout requires a browser.'))
  }
  if (window.Razorpay) return Promise.resolve(window.Razorpay)
  if (checkoutPromise) return checkoutPromise

  checkoutPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = CHECKOUT_SRC
    script.onload = () => (window.Razorpay ? resolve(window.Razorpay) : reject(new Error('Payment gateway failed to load.')))
    script.onerror = () => {
      checkoutPromise = null // let a retry try loading the script again instead of replaying a dead promise
      reject(new Error('Could not reach the payment gateway. Check your connection and try again.'))
    }
    document.body.appendChild(script)
  })
  return checkoutPromise
}

/**
 * Opens Razorpay Checkout for an already-created order and resolves once the
 * flow ends, one way or another — paid, declined, or the customer backed out.
 */
function payWithRazorpay({ orderId, razorpayOrderId, amount, currency, keyId, customer }) {
  return loadCheckout().then(
    (Razorpay) =>
      new Promise((resolve) => {
        const rzp = new Razorpay({
          key: keyId,
          order_id: razorpayOrderId,
          amount,
          currency,
          name: 'Rajiv Williams',
          description: 'Coaching module purchase',
          prefill: { name: customer.name, email: customer.email, contact: customer.phone },
          theme: { color: '#C39B53' },
          handler: (response) => {
            verifyPayment({
              orderId,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            })
              .then((result) => resolve({ status: result.status, orderId: result.orderId }))
              .catch((err) => {
                // Money may already have moved on Razorpay's side even if this call fails —
                // the webhook (server-to-server, not dependent on this browser) is what
                // ultimately reconciles it, so this is reported as unresolved, not failed.
                console.error('[payment] verify call failed after a Razorpay success callback:', err)
                resolve({
                  status: 'error',
                  orderId,
                  message: 'Payment may have gone through, but we could not confirm it here. Contact us with your order id and we will check.',
                })
              })
          },
          modal: {
            ondismiss: () => resolve({ status: 'cancelled', orderId }),
          },
        })

        rzp.on('payment.failed', () => resolve({ status: 'failed', orderId }))
        rzp.open()
      }),
  )
}

/**
 * The one call the purchase page makes: create the order, then open Checkout.
 * Always resolves — see the module comment for the result shape.
 */
export async function payForModules({ modules, count, pricing, customer }) {
  let order
  try {
    order = await createPaymentOrder({
      modules,
      count,
      baseAmount: pricing.baseAmount,
      discountPercent: pricing.discountPercent,
      discountAmount: pricing.discountAmount,
      payableAmount: pricing.payableAmount,
      customer,
    })
  } catch (err) {
    // Never surface the backend's own error text here — it can legitimately say
    // things like "set RAZORPAY_KEY_ID", which is a note for us, not a customer.
    console.error('[payment] create-order failed:', getErrorMessage(err))
    return {
      status: 'error',
      orderId: null,
      message: 'We could not start the payment right now. Please try again, or contact us and we will process it directly.',
    }
  }

  return payWithRazorpay({
    orderId: order.orderId,
    razorpayOrderId: order.razorpayOrderId,
    amount: order.amount,
    currency: order.currency,
    keyId: order.keyId,
    customer,
  })
}

/** For a status page that wants to re-check after the fact (e.g. a page refresh). */
export const getOrderStatus = (orderId) => getPaymentStatus(orderId)
