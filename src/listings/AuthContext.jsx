import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import * as api from './api'

const AuthContext = createContext(null)

/** Holds the logged-in owner/builder (email + OTP login, JWT in localStorage). */
export function ListingAuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let live = true
    if (!api.tokenStore.get()) {
      setReady(true)
      return
    }
    api
      .getMe()
      .then((me) => live && setUser(me))
      .catch(() => api.tokenStore.set(''))
      .finally(() => live && setReady(true))
    return () => { live = false }
  }, [])

  const acceptSession = useCallback(({ token, user: u }) => {
    api.tokenStore.set(token)
    setUser(u)
    return u
  }, [])

  const value = useMemo(
    () => ({
      user,
      ready,
      isLoggedIn: !!user,
      requestOtp: (payload) => api.requestOtp(payload),
      verifyOtp: async (email, code) => acceptSession(await api.verifyOtp(email, code)),
      logout: () => {
        api.tokenStore.set('')
        setUser(null)
      },
      setUser,
    }),
    [user, ready, acceptSession],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useListingAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useListingAuth must be used inside <ListingAuthProvider>')
  return ctx
}
