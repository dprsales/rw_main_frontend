import { useState } from 'react'
import { checkEmail, forgotPassword } from '../api'
import { useListingAuth } from '../AuthContext'
import { ErrorNote } from './ui'

const EMAIL_RX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

function PasswordInput({ value, onChange, placeholder, autoComplete, autoFocus }) {
  const [show, setShow] = useState(false)
  return (
    <div className="flex overflow-hidden rounded-md border border-line bg-night focus-within:border-gold-500">
      <input
        type={show ? 'text' : 'password'}
        className="w-full bg-transparent px-3.5 py-3 text-sm text-ink outline-none placeholder:text-faded/70"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        autoFocus={autoFocus}
      />
      <button type="button" onClick={() => setShow((s) => !s)} className="px-3.5 text-xs text-faded hover:text-gold-300">
        {show ? 'Hide' : 'Show'}
      </button>
    </div>
  )
}

function strength(pw) {
  let s = 0
  if (pw.length >= 8) s++
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) s++
  if (/\d/.test(pw)) s++
  if (/[^A-Za-z0-9]/.test(pw) || pw.length >= 12) s++
  return s
}

/**
 * Replaces the old "mobile number + OTP" card:
 *   1. email + city           → check if the email already has an account
 *   2a. new email             → create password (+ name, optional mobile)
 *   2b. existing email        → enter password (or reset it by email)
 */
export default function AuthCard({ data, update, onAuthed, mode = 'listing' }) {
  const accountMode = mode === 'account'
  const { register, login } = useListingAuth()
  const [stage, setStage] = useState('email') // email | create | login | forgot
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [name, setName] = useState('')
  const [mobile, setMobile] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  const email = (data.email || '').trim().toLowerCase()
  const canContinue = EMAIL_RX.test(email) && (accountMode || (data.listingType && data.city?.trim()))

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

  const onContinue = (e) => {
    e.preventDefault()
    if (!canContinue) return
    run(async () => {
      const { exists } = await checkEmail(email)
      setPassword('')
      setConfirm('')
      setStage(exists ? 'login' : 'create')
    })
  }

  const onCreate = (e) => {
    e.preventDefault()
    if (password.length < 8) return setError('Password must be at least 8 characters.')
    if (password !== confirm) return setError('Passwords do not match.')
    if (mobile && !/^\d{10}$/.test(mobile)) return setError('Mobile must be a 10 digit number.')
    run(async () => {
      await register({ email, password, name: name.trim(), mobile, city: (data.city || '').trim() || undefined })
      onAuthed()
    })
  }

  const onLogin = (e) => {
    e.preventDefault()
    if (!password) return setError('Please enter your password.')
    run(async () => {
      await login(email, password)
      onAuthed()
    })
  }

  const onForgot = () =>
    run(async () => {
      const res = await forgotPassword(email)
      setNotice(res.message)
    })

  const pwScore = strength(password)
  const header = (title, sub) => (
    <>
      <p className="eyebrow">{accountMode ? 'My account' : 'List your property · free'}</p>
      <h2 className="mt-2 font-serif text-3xl text-ink">{title}</h2>
      <p className="mb-6 mt-1 text-sm text-faded">{sub}</p>
    </>
  )
  const emailLine = (
    <p className="mb-5 flex items-center justify-between gap-2 rounded-md border border-line bg-night/50 px-3 py-2.5 text-sm">
      <span className="truncate text-ink">{email}</span>
      <button type="button" className="shrink-0 text-xs font-medium text-gold-300 hover:underline" onClick={() => { setStage('email'); setError(''); setNotice('') }}>
        Change
      </button>
    </p>
  )

  return (
    <div className="card w-full p-6 sm:p-8">
      {stage === 'email' && (
        <form onSubmit={onContinue} noValidate>
          {accountMode
            ? header('Log in', 'Use your email and password to open your dashboard. New here? We will help you create an account.')
            : header('Get started', 'Takes less than 2 minutes.')}

          {!accountMode && (<>
          <label className="field-label">I want to</label>
          <div className="mb-5 flex gap-3">
            {['Sell', 'Rent / Lease'].map((opt) => (
              <button key={opt} type="button" onClick={() => update('listingType', opt === 'Sell' ? 'Sale' : 'Rent')}
                className={`toggle-btn ${(data.listingType === 'Rent') === (opt !== 'Sell') ? 'active' : ''}`}>
                {opt}
              </button>
            ))}
          </div>

          </>)}

          <label className="field-label" htmlFor="sy-email">Email address</label>
          <input id="sy-email" type="email" className="field-input mb-5" placeholder="you@example.com" autoComplete="email"
            value={data.email || ''} onChange={(e) => update('email', e.target.value)} />

          {!accountMode && (<>
          <label className="field-label" htmlFor="sy-city">City</label>
          <input id="sy-city" className="field-input mb-6" placeholder="e.g. Hyderabad" value={data.city || ''}
            onChange={(e) => update('city', e.target.value)} />
          </>)}

          <ErrorNote>{error}</ErrorNote>
          <button type="submit" className="btn-primary mt-4 w-full" disabled={!canContinue || loading}>
            {loading ? <><span className="spinner" /> Checking…</> : 'Continue →'}
          </button>
          <p className="mt-4 text-center text-[11px] text-faded">By continuing you agree to our terms. Your details are kept private.</p>
        </form>
      )}

      {stage === 'create' && (
        <form onSubmit={onCreate} noValidate>
          {header('Create your password', 'New here — set a password so you can log in any time to track your listings.')}
          {emailLine}

          <label className="field-label">Full name</label>
          <input className="field-input mb-4" placeholder="Your name or company" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} />

          <label className="field-label">Mobile <span className="font-normal text-faded">(optional)</span></label>
          <div className="mb-4 flex overflow-hidden rounded-md border border-line bg-night focus-within:border-gold-500">
            <span className="flex items-center border-r border-line px-3 text-sm text-faded">+91</span>
            <input className="w-full bg-transparent px-3.5 py-3 text-sm text-ink outline-none placeholder:text-faded/70" inputMode="numeric"
              maxLength={10} placeholder="10 digit number" value={mobile} onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))} />
          </div>

          <label className="field-label">Create password</label>
          <PasswordInput value={password} onChange={setPassword} placeholder="At least 8 characters" autoComplete="new-password" autoFocus />
          <div className="mb-4 mt-2 flex gap-1">
            {[0, 1, 2, 3].map((i) => (
              <span key={i} className={`h-1 flex-1 rounded-full ${i < pwScore ? (pwScore < 2 ? 'bg-red-400' : pwScore < 3 ? 'bg-amber-400' : 'bg-emerald-400') : 'bg-chip'}`} />
            ))}
          </div>

          <label className="field-label">Confirm password</label>
          <PasswordInput value={confirm} onChange={setConfirm} placeholder="Re-enter password" autoComplete="new-password" />
          {confirm && confirm !== password && <p className="mt-1.5 text-xs text-red-300">Passwords do not match</p>}

          <ErrorNote>{error}</ErrorNote>
          <button type="submit" className="btn-primary mt-5 w-full" disabled={loading || password.length < 8 || password !== confirm}>
            {loading ? <><span className="spinner" /> Creating account…</> : 'Create account & continue →'}
          </button>
        </form>
      )}

      {stage === 'login' && (
        <form onSubmit={onLogin} noValidate>
          {header('Welcome back', 'Log in with the password you created.')}
          {emailLine}

          <label className="field-label">Password</label>
          <PasswordInput value={password} onChange={setPassword} placeholder="Your password" autoComplete="current-password" autoFocus />
          <div className="mt-2 text-right">
            <button type="button" onClick={() => { setStage('forgot'); setError(''); setNotice('') }} className="text-xs text-gold-300 hover:underline">
              Forgot password?
            </button>
          </div>

          <ErrorNote>{error}</ErrorNote>
          <button type="submit" className="btn-primary mt-5 w-full" disabled={loading || !password}>
            {loading ? <><span className="spinner" /> Logging in…</> : 'Log in & continue →'}
          </button>
        </form>
      )}

      {stage === 'forgot' && (
        <div>
          {header('Reset your password', "We'll email you a secure link to set a new password.")}
          {emailLine}
          <ErrorNote>{error}</ErrorNote>
          {notice && <p className="mb-2 rounded-md border border-emerald-400/30 bg-emerald-400/10 px-3 py-2 text-sm text-emerald-300">{notice}</p>}
          <button type="button" className="btn-primary mt-3 w-full" disabled={loading} onClick={onForgot}>
            {loading ? <><span className="spinner" /> Sending…</> : 'Email me a reset link'}
          </button>
          <button type="button" className="btn-secondary mt-3 w-full" onClick={() => setStage('login')}>Back to log in</button>
        </div>
      )}
    </div>
  )
}
