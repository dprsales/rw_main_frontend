import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import ListingsShell from '../components/ListingsShell'
import { ErrorNote } from '../components/ui'
import { useListingAuth } from '../AuthContext'

export default function ResetPasswordPage() {
  const [params] = useSearchParams()
  const token = params.get('token') || ''
  const { resetPassword } = useListingAuth()
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    if (password.length < 8) return setError('Password must be at least 8 characters.')
    if (password !== confirm) return setError('Passwords do not match.')
    setError('')
    setLoading(true)
    try {
      await resetPassword(token, password)
      navigate('/list-property/dashboard', { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <ListingsShell title="Reset password | RW Realty" noindex>
      <div className="mx-auto flex min-h-[70vh] max-w-md items-center px-4 py-16">
        <form onSubmit={submit} className="card w-full p-8">
          <p className="eyebrow">Account security</p>
          <h1 className="mt-2 font-serif text-3xl text-ink">Create a new password</h1>
          {!token ? (
            <p className="mt-4 text-sm text-red-300">This link is missing its token. Please use the link from your email.</p>
          ) : (
            <>
              <label className="field-label mt-6">New password</label>
              <input type="password" className="field-input" autoComplete="new-password" placeholder="At least 8 characters"
                value={password} onChange={(e) => setPassword(e.target.value)} />
              <label className="field-label mt-4">Confirm password</label>
              <input type="password" className="field-input" autoComplete="new-password" placeholder="Re-enter password"
                value={confirm} onChange={(e) => setConfirm(e.target.value)} />
              <ErrorNote>{error}</ErrorNote>
              <button className="btn-primary mt-6 w-full" disabled={loading}>
                {loading ? <><span className="spinner" /> Saving…</> : 'Save password & log in'}
              </button>
            </>
          )}
          <Link to="/list-property" className="mt-5 block text-center text-xs text-gold-300 hover:underline">Back to log in</Link>
        </form>
      </div>
    </ListingsShell>
  )
}
