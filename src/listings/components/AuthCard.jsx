import { useEffect, useRef, useState } from 'react'
import { checkEmail, requestOtp } from '../api'
import { useListingAuth } from '../AuthContext'
import { ErrorNote } from './ui'

const EMAIL_RX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

/**
 * Passwordless listing auth (email + Gmail code):
 *   1. email (+ city / sell-rent for listing mode)
 *   2a. new email   → name + optional mobile → send code
 *   2b. existing    → send code
 *   3. enter 6-digit code from email
 */
export default function AuthCard({ data, update, onAuthed, mode = 'listing' }) {
  const accountMode = mode === 'account'
  const { verifyOtp } = useListingAuth()
  const [stage, setStage] = useState('email') // email | details | code
  const [isNew, setIsNew] = useState(false)
  const [name, setName] = useState('')
  const [mobile, setMobile] = useState('')
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [resendIn, setResendIn] = useState(0)
  const codeRef = useRef(null)

  const email = (data.email || '').trim().toLowerCase()
  const canContinue = EMAIL_RX.test(email) && (accountMode || (data.listingType && data.city?.trim()))

  useEffect(() => {
    if (resendIn <= 0) return undefined
    const t = setTimeout(() => setResendIn((n) => n - 1), 1000)
    return () => clearTimeout(t)
  }, [resendIn])

  useEffect(() => {
    if (stage === 'code') codeRef.current?.focus()
  }, [stage])

  const run = async (fn) => {
    if (loading) return
    setError('')
    setNotice('')
    setLoading(true)
    try {
      await fn()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const sendCode = async ({ forNew }) => {
    const res = await requestOtp({
      email,
      name: forNew ? name.trim() : undefined,
      mobile: forNew && mobile ? mobile : undefined,
      city: (data.city || '').trim() || undefined,
    })
    setNotice(res.message)
    setCode('')
    setStage('code')
    setResendIn(30)
  }

  const onContinue = (e) => {
    e.preventDefault()
    if (!canContinue) return
    run(async () => {
      const { exists } = await checkEmail(email)
      setIsNew(!exists)
      if (exists) {
        await sendCode({ forNew: false })
      } else {
        setStage('details')
      }
    })
  }

  const onDetails = (e) => {
    e.preventDefault()
    if (!name.trim()) return setError('Please enter your name.')
    if (mobile && !/^\d{10}$/.test(mobile)) return setError('Mobile must be a 10 digit number.')
    run(async () => {
      await sendCode({ forNew: true })
    })
  }

  const onVerify = (e) => {
    e.preventDefault()
    if (!/^\d{6}$/.test(code)) return setError('Enter the 6-digit code from your email.')
    run(async () => {
      await verifyOtp(email, code)
      onAuthed()
    })
  }

  const onResend = () => {
    if (resendIn > 0) return
    run(async () => {
      await sendCode({ forNew: isNew })
    })
  }

  const header = (title, sub) => (
    <>
      <p className="eyebrow">{accountMode ? 'My account' : 'Upload property · free'}</p>
      <h2 className="mt-2 font-serif text-3xl text-ink">{title}</h2>
      <p className="mb-6 mt-1 text-sm text-faded">{sub}</p>
    </>
  )

  const emailLine = (
    <p className="mb-5 flex items-center justify-between gap-2 rounded-md border border-line bg-night/50 px-3 py-2.5 text-sm">
      <span className="truncate text-ink">{email}</span>
      <button
        type="button"
        className="shrink-0 text-xs font-medium text-gold-300 hover:underline"
        onClick={() => {
          setStage('email')
          setError('')
          setNotice('')
          setCode('')
        }}
      >
        Change
      </button>
    </p>
  )

  return (
    <div className="card w-full p-6 sm:p-8">
      {stage === 'email' && (
        <form onSubmit={onContinue} noValidate>
          {accountMode
            ? header('Log in', 'We email you a one-time code. No password to remember.')
            : header('Upload your property', 'Enter your details, then we email you a login code. No password to set.')}

          {!accountMode && (
            <>
              <label className="field-label">I want to</label>
              <div className="mb-5 flex gap-3">
                {['Sell', 'Rent / Lease'].map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => update('listingType', opt === 'Sell' ? 'Sale' : 'Rent')}
                    className={`toggle-btn ${(data.listingType === 'Rent') === (opt !== 'Sell') ? 'active' : ''}`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </>
          )}

          <label className="field-label" htmlFor="sy-email">Email address</label>
          <input
            id="sy-email"
            type="email"
            className="field-input mb-5"
            placeholder="you@example.com"
            autoComplete="email"
            value={data.email || ''}
            onChange={(e) => update('email', e.target.value)}
          />

          {!accountMode && (
            <>
              <label className="field-label" htmlFor="sy-city">City</label>
              <input
                id="sy-city"
                className="field-input mb-6"
                placeholder="e.g. Hyderabad"
                value={data.city || ''}
                onChange={(e) => update('city', e.target.value)}
              />
            </>
          )}

          <ErrorNote>{error}</ErrorNote>
          <button type="submit" className="btn-primary mt-4 w-full" disabled={!canContinue || loading}>
            {loading ? <><span className="spinner" /> Checking…</> : 'Continue →'}
          </button>
          <p className="mt-4 text-center text-[11px] text-faded">
            By continuing you agree to our terms. Your details are kept private.
          </p>
        </form>
      )}

      {stage === 'details' && (
        <form onSubmit={onDetails} noValidate>
          {header('Almost there', 'Tell us who you are. We will email a login code to finish.')}
          {emailLine}

          <label className="field-label">Full name</label>
          <input
            className="field-input mb-4"
            placeholder="Your name or company"
            autoComplete="name"
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <label className="field-label">
            Mobile <span className="font-normal text-faded">(optional)</span>
          </label>
          <div className="mb-4 flex overflow-hidden rounded-md border border-line bg-night focus-within:border-gold-500">
            <span className="flex items-center border-r border-line px-3 text-sm text-faded">+91</span>
            <input
              className="w-full bg-transparent px-3.5 py-3 text-sm text-ink outline-none placeholder:text-faded/70"
              inputMode="numeric"
              maxLength={10}
              placeholder="10 digit number"
              value={mobile}
              onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
            />
          </div>

          <ErrorNote>{error}</ErrorNote>
          <button type="submit" className="btn-primary mt-5 w-full" disabled={loading || !name.trim()}>
            {loading ? <><span className="spinner" /> Sending code…</> : 'Email me a login code →'}
          </button>
        </form>
      )}

      {stage === 'code' && (
        <form onSubmit={onVerify} noValidate>
          {header(
            isNew ? 'Check your email' : 'Welcome back',
            `Enter the 6-digit code we sent to your inbox. No password needed.`,
          )}
          {emailLine}

          {notice && (
            <p className="mb-4 rounded-md border border-emerald-400/30 bg-emerald-400/10 px-3 py-2 text-sm text-emerald-300">
              {notice}
            </p>
          )}

          <label className="field-label" htmlFor="sy-otp">Login code</label>
          <input
            ref={codeRef}
            id="sy-otp"
            className="field-input mb-2 tracking-[0.35em] text-center text-lg font-medium"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            placeholder="••••••"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
          />
          <p className="mb-4 text-xs text-faded">Code expires in 10 minutes. Check spam if you do not see it.</p>

          <ErrorNote>{error}</ErrorNote>
          <button type="submit" className="btn-primary mt-2 w-full" disabled={loading || code.length !== 6}>
            {loading ? <><span className="spinner" /> Verifying…</> : 'Verify & continue →'}
          </button>
          <button
            type="button"
            className="btn-secondary mt-3 w-full"
            disabled={loading || resendIn > 0}
            onClick={onResend}
          >
            {resendIn > 0 ? `Resend code in ${resendIn}s` : 'Resend code'}
          </button>
        </form>
      )}
    </div>
  )
}
