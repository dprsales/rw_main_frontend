import { useState } from 'react'
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import ListingsShell from '../components/ListingsShell'
import AuthCard from '../components/AuthCard'
import { useListingAuth } from '../AuthContext'

/** Only allow in-site redirects after login (prevents open-redirects via ?next=). */
function safeNext(raw) {
  if (!raw || !raw.startsWith('/') || raw.startsWith('//')) return '/list-property/dashboard'
  if (raw.startsWith('/list-property/login')) return '/list-property/dashboard'
  return raw
}

export default function LoginPage() {
  const { user, ready } = useListingAuth()
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const next = safeNext(params.get('next'))
  const [data, setData] = useState({ email: '' })
  const update = (k, v) => setData((d) => ({ ...d, [k]: v }))

  if (ready && user) return <Navigate to={next} replace />

  return (
    <ListingsShell title="Log in | RW Realty" noindex>
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(55% 60% at 80% 0%, rgba(195,155,83,0.14) 0%, rgba(11,10,9,0) 70%)' }} />
        <div className="relative mx-auto grid max-w-[1100px] grid-cols-1 items-center gap-12 px-5 py-16 sm:px-10 lg:grid-cols-[1fr_440px] lg:py-24">
          <div>
            <p className="eyebrow">Builder & owner account</p>
            <h1 className="mt-4 font-serif text-5xl font-normal leading-[1.04] text-ink sm:text-6xl">
              Welcome back to your <em className="gold-text">dashboard.</em>
            </h1>
            <ul className="mt-8 space-y-3 text-sm text-ink">
              {['Track every listing — pending, live or needing changes', 'See views and how many buyers have enquired', 'List a new property in a few minutes'].map((t) => (
                <li key={t} className="flex items-center gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-gold-500/40 text-[11px] text-gold-300">✓</span>
                  {t}
                </li>
              ))}
            </ul>
            <p className="mt-8 text-sm text-faded">
              Just browsing? <Link to="/list-property#listings" className="text-gold-300 hover:underline">See listed properties →</Link>
            </p>
          </div>
          {!ready ? (
            <div className="card skeleton h-[380px]" />
          ) : (
            <AuthCard mode="account" data={data} update={update} onAuthed={() => navigate(next, { replace: true })} />
          )}
        </div>
      </div>
    </ListingsShell>
  )
}
