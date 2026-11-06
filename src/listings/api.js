// Listing API on the same host as the rest of the site (merchandising_backend).
// Auth lives under /listing-auth so it never collides with staff /auth.
import { API_BASE } from '../data/api'

export const LISTINGS_API = (
  import.meta.env.VITE_LISTINGS_API_URL || API_BASE || 'https://api.rajivwilliams.com'
).replace(/\/$/, '')

const TOKEN_KEY = 'rw_listing_token'

export const tokenStore = {
  get() {
    try { return localStorage.getItem(TOKEN_KEY) || '' } catch { return '' }
  },
  set(token) {
    try { token ? localStorage.setItem(TOKEN_KEY, token) : localStorage.removeItem(TOKEN_KEY) } catch { /* private mode */ }
  },
}

export class ListingsApiError extends Error {
  constructor(message, status) {
    super(message)
    this.status = status
  }
}

async function request(path, { method = 'GET', body, auth = false, signal } = {}) {
  const headers = { Accept: 'application/json' }
  if (body !== undefined) headers['Content-Type'] = 'application/json'
  const token = tokenStore.get()
  if (auth || token) {
    if (token) headers.Authorization = `Bearer ${token}`
  }

  let res
  try {
    res = await fetch(`${LISTINGS_API}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
      signal,
    })
  } catch (err) {
    if (err?.name === 'AbortError') throw err
    throw new ListingsApiError('Could not reach the server. Please check your connection.', 0)
  }

  const data = await res.json().catch(() => null)
  if (!res.ok) {
    const msg = Array.isArray(data?.message) ? data.message[0] : data?.message
    if (res.status === 401 && auth) tokenStore.set('')
    throw new ListingsApiError(msg || 'Something went wrong. Please try again.', res.status)
  }
  return data
}

// ---------- listing accounts ----------
export const checkEmail = (email) => request('/listing-auth/check-email', { method: 'POST', body: { email } })
export const register = (payload) => request('/listing-auth/register', { method: 'POST', body: payload })
export const login = (email, password) =>
  request('/listing-auth/login', { method: 'POST', body: { email, password } })
export const forgotPassword = (email) =>
  request('/listing-auth/forgot-password', { method: 'POST', body: { email } })
export const resetPassword = (token, password) =>
  request('/listing-auth/reset-password', { method: 'POST', body: { token, password } })
export const getMe = () => request('/listing-auth/me', { auth: true })
export const updateMe = (payload) =>
  request('/listing-auth/me', { method: 'PATCH', body: payload, auth: true })

// ---------- listings ----------
export const submitProperty = ({ city, listingType, details, commissionAccepted, listingConsents }) =>
  request('/properties', {
    method: 'POST',
    body: { city, listingType, details, commissionAccepted: !!commissionAccepted, listingConsents },
    auth: true,
  })

export const updateProperty = (id, { city, listingType, details, commissionAccepted, listingConsents }) =>
  request(`/properties/${id}`, {
    method: 'PATCH',
    body: { city, listingType, details, commissionAccepted: !!commissionAccepted, listingConsents },
    auth: true,
  })
export const getMyListing = (id) => request(`/properties/mine/${id}`, { auth: true })
export const getMyListings = () => request('/properties/mine', { auth: true })
export const deleteListing = (id) => request(`/properties/${id}`, { method: 'DELETE', auth: true })
export const getListingEnquiries = (id) => request(`/properties/${id}/enquiries`, { auth: true })

/** Public catalogue (approved only). */
export function getApprovedProjects(params = {}, opts = {}) {
  const qs = new URLSearchParams()
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') qs.set(k, v)
  })
  const s = qs.toString()
  return request(`/properties${s ? `?${s}` : ''}`, opts)
}
export const getFacets = () => request('/properties/facets')
export const getProject = (idOrSlug) => request(`/properties/${encodeURIComponent(idOrSlug)}`)
export const sendEnquiry = (idOrSlug, payload) =>
  request(`/properties/${encodeURIComponent(idOrSlug)}/enquiries`, { method: 'POST', body: payload })

/**
 * Uploads files to Bunny via POST /bunny/listing-media. Uses XHR so we get progress events.
 * Resolves to [{ url, path, originalName, size, type }]
 */
export function uploadListingMedia(files, onProgress) {
  return new Promise((resolve, reject) => {
    const form = new FormData()
    files.forEach((f) => form.append('files', f))
    const xhr = new XMLHttpRequest()
    xhr.open('POST', `${LISTINGS_API}/bunny/listing-media`)
    const token = tokenStore.get()
    if (token) xhr.setRequestHeader('Authorization', `Bearer ${token}`)
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) onProgress(Math.round((e.loaded / e.total) * 100))
    }
    xhr.onload = () => {
      let data = null
      try { data = JSON.parse(xhr.responseText) } catch { /* ignore */ }
      if (xhr.status >= 200 && xhr.status < 300) resolve(data)
      else {
        const msg = Array.isArray(data?.message) ? data.message[0] : data?.message
        reject(new ListingsApiError(msg || 'Upload failed. Please try again.', xhr.status))
      }
    }
    xhr.onerror = () => reject(new ListingsApiError('Upload failed — network error.', 0))
    xhr.send(form)
  })
}

export const deleteListingMedia = (path) =>
  request(`/bunny/listing-media?path=${encodeURIComponent(path)}`, { method: 'DELETE', auth: true })
