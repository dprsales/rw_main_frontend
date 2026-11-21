import { Link } from 'react-router-dom'
import ListingsShell from '../components/ListingsShell'

/** Old password-reset links still land here; sign-in is email code only now. */
export default function ResetPasswordPage() {
  return (
    <ListingsShell title="Sign in | RW Realty" noindex>
      <div className="mx-auto flex min-h-[70vh] max-w-md items-center px-4 py-16">
        <div className="card w-full p-8">
          <p className="eyebrow">Account access</p>
          <h1 className="mt-2 font-serif text-3xl text-ink">Password not needed</h1>
          <p className="mt-4 text-sm text-faded">
            Listing accounts now sign in with a one-time code sent to your email. You do not need a password.
          </p>
          <Link to="/listings/login" className="btn-primary mt-6 block w-full text-center">
            Email me a login code →
          </Link>
          <Link to="/listings" className="mt-5 block text-center text-xs text-gold-300 hover:underline">
            Back to listings
          </Link>
        </div>
      </div>
    </ListingsShell>
  )
}
