// api.js — single source of truth for every backend call. JS port of api-kit/api.ts;
// keep in sync if the kit updates. See api-kit/API-GUIDE.md for endpoint reference.

// 1. CONFIG
// Vite replaces `import.meta.env.VITE_*` statically, so names must appear literally
// (no computed lookup). Fallbacks let the site work before .env exists.
const viteEnv = import.meta.env || {}

export const API_BASE = viteEnv.VITE_API_BASE_URL || 'https://api.rajivwilliams.com'
export const BLOG_BASE = viteEnv.VITE_BLOG_BASE_URL || 'https://blog.dprprop.com'
export const BLOG_CLIENT_ID = viteEnv.VITE_BLOG_CLIENT_ID || '6814779c33c366561f26aec9'
export const CDN_BASE = viteEnv.VITE_STORAGE_DN_URL || 'https://dprstorage.b-cdn.net'

// Prefixes a CDN-relative image path; absolute URLs pass through, 'NA' becomes undefined.
export function cdn(path) {
  if (!path || path === 'NA') return undefined
  if (/^https?:\/\//i.test(path)) return path
  return `${CDN_BASE}${path.startsWith('/') ? '' : '/'}${path}`
}

// 2. HTTP CLIENT

export class ApiError extends Error {
  constructor(message, status, body = null) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.body = body
  }
}

// Pluggable auth; unused on the public site since every route below is open.
let getAuthToken = () => undefined
export function setAuthTokenGetter(fn) {
  getAuthToken = fn
}

// Without a timeout an unreachable host hangs the spinner for a minute+. Read paths use less.
const DEFAULT_TIMEOUT_MS = 20_000

async function request(path, opts = {}) {
  const {
    method = 'GET',
    body,
    base = API_BASE,
    timeoutMs = DEFAULT_TIMEOUT_MS,
    headers = {},
    signal,
  } = opts

  const isFormData = typeof FormData !== 'undefined' && body instanceof FormData

  const finalHeaders = { Accept: 'application/json, text/plain, */*', ...headers }
  // Skip Content-Type for FormData — the browser sets its own multipart boundary.
  if (body !== undefined && !isFormData) finalHeaders['Content-Type'] = 'application/json'

  const token = getAuthToken()
  if (token) finalHeaders.Authorization = `Bearer ${token}`

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  if (signal) signal.addEventListener('abort', () => controller.abort(), { once: true })

  let res
  try {
    res = await fetch(`${base}${path}`, {
      method,
      headers: finalHeaders,
      body: body === undefined ? undefined : isFormData ? body : JSON.stringify(body),
      signal: controller.signal,
    })
  } catch (err) {
    if (err?.name === 'AbortError') throw new ApiError('Request timed out', 408)
    throw new ApiError('Network error — check your connection', 0)
  } finally {
    clearTimeout(timer)
  }

  const raw = await res.text()
  let parsed = null
  try {
    parsed = raw ? JSON.parse(raw) : null
  } catch {
    parsed = raw
  }

  if (!res.ok) {
    const msg =
      (parsed && typeof parsed === 'object' && (parsed.message || parsed.error)) ||
      `Request failed (${res.status})`
    throw new ApiError(msg, res.status, parsed)
  }

  return parsed
}

// Turns any thrown error into a string that is safe to show a user.
export function getErrorMessage(err) {
  if (err instanceof ApiError) {
    if (err.status === 0) return 'Network error — please check your connection and try again.'
    if (err.status === 408) return 'That took too long. Please try again.'
    if (err.status === 429) return 'Too many attempts. Please try again in a minute.'
    return err.message
  }
  if (err instanceof Error) return err.message
  return 'Something went wrong. Please try again.'
}

// 3. PROJECTS
// `GET /projects` is untested/unused by the old frontend; callers fall back to content.js.

// Reads are backgrounded behind existing content, so they get a shorter timeout than forms.
const READ_TIMEOUT_MS = 9000

export const getProjects = (opts) =>
  request('/projects', { timeoutMs: READ_TIMEOUT_MS, ...opts })

export const getProjectsPaginated = (page = 1, limit = 12, opts) =>
  request(`/projects?page=${page}&limit=${limit}`, { timeoutMs: READ_TIMEOUT_MS, ...opts })

export const getProjectBySlug = (slug, opts) =>
  request(`/projects/${encodeURIComponent(slug)}`, { timeoutMs: READ_TIMEOUT_MS, ...opts })

// 4. BLOG — external DPR CMS, different host

// Blog feed hits BLOG_BASE, not API_BASE. Image paths need `cdn()`.
export const getBlogs = (opts) =>
  request(`/clients/${BLOG_CLIENT_ID}/blogs`, {
    base: BLOG_BASE,
    timeoutMs: READ_TIMEOUT_MS,
    ...opts,
  }).then((r) => r?.blogs ?? [])

// 5. LEADS & FORMS
// `/leads` is the generic, most-used route. There is no `/booking` route — use this instead.

export const submitLead = (data) => request('/leads', { method: 'POST', body: data })

export const submitMentoringLead = (data) =>
  request('/mentoringleads', { method: 'POST', body: data })

export const submitIndividualMentoring = (data) =>
  request('/individualmentoringform', { method: 'POST', body: data })

export const submitOrganizationalMentoring = (data) =>
  request('/organizationalmentoringform', { method: 'POST', body: data })

export const submitHighTicketCloser = (data) =>
  request('/highticketcloserform', { method: 'POST', body: data })

export const submitLuxurySalesMastery = (data) =>
  request('/luxurysalesmastery', { method: 'POST', body: data })

export const submitSalesArchitecture = (data) =>
  request('/salesarchitecturemasterclass', { method: 'POST', body: data })

// Carries PAN/Aadhaar/passport — never log this payload or put it in analytics.
export const submitTribhujaDigital = (data) =>
  request('/tribhujadigitalform', { method: 'POST', body: data })

// 6. WHATSAPP — session confirmation, sent through the backend proxy

// Sender identity shown to recipients; not secret.
const WHATSAPP_SENDER_NUMBER = '7997992886'
const WHATSAPP_SENDER_NAME = 'Rajiv Williams'

// Sends the session_confirmation template via the proxy (which holds the API key, unlike
// the old bundle). Throws on failure instead of faking success — treat as non-blocking at call site.
export const sendWhatsAppConfirmation = (data) => {
  const phoneNumber = data.phoneNumber.startsWith('+')
    ? data.phoneNumber
    : `+91${data.phoneNumber.replace(/^0+/, '')}`

  return request('/send-whatsapp', {
    method: 'POST',
    body: {
      phoneNumber,
      templateName: 'session_confirmation',
      templateData: [
        { name: '1', value: data.firstName },
        { name: '2', value: data.sessionTitle },
        { name: '3', value: data.sessionDate },
        { name: '4', value: data.sessionTime },
        { name: '5', value: data.venueOrPlace },
        { name: '6', value: data.supportContact ?? '9549546568' },
      ],
      senderNumber: WHATSAPP_SENDER_NUMBER,
      senderName: WHATSAPP_SENDER_NAME,
    },
  })
}

// 7. JOBS & APPLICATIONS — careers page
// Untested: routes exist but the old careers page used a hardcoded array with no submit handler.

export const getJobs = (opts) => request('/jobs', { timeoutMs: READ_TIMEOUT_MS, ...opts })

export const getJobById = (id, opts) =>
  request(`/jobs/${encodeURIComponent(id)}`, { timeoutMs: READ_TIMEOUT_MS, ...opts })

// Takes a FormData so the résumé file can ride along as multipart.
export const createApplication = (formData) =>
  request('/applications', { method: 'POST', body: formData })
