/**
 * Draft persistence for the careers application form.
 *
 * This form asks for ten minutes of someone's time, so a refresh, a dropped
 * connection or a closed tab must not cost them the lot. Two stores, because
 * the two kinds of data are not the same shape:
 *
 *  - localStorage for the text, select and assessment answers. Small,
 *    synchronous, survives a reload for free.
 *  - IndexedDB for the resume. A File/Blob cannot be JSON-serialised, and up to
 *    5MB will not sit comfortably in localStorage (the usual 5MB budget is per
 *    origin, shared with everything else on the site).
 *
 * On return the blob is rebuilt into a real File so the candidate can submit
 * straight away, replace it, or remove it — the same three options they had
 * before the refresh.
 *
 * The draft is wiped the moment the application submits, and by the "start
 * over" control. Every call is wrapped: a full, disabled or unavailable store
 * degrades to "nothing is saved" rather than breaking the form. Losing the draft
 * is recoverable by the applicant, breaking the form is not.
 */

const DRAFT_KEY = 'rw.careersApply.draft.v1'
const DB_NAME = 'rw-application-drafts'
const DB_VERSION = 1
const FILE_STORE = 'files'
const RESUME_ID = 'careers-resume'

/** Keep a stale draft from resurfacing months later — 14 days. */
const DRAFT_MAX_AGE_MS = 14 * 24 * 60 * 60 * 1000

const isString = (v) => typeof v === 'string'
const isBool = (v) => typeof v === 'boolean'
const isNum = (v) => typeof v === 'number' && Number.isFinite(v)

/**
 * Read the saved draft, or null when there is nothing usable.
 *
 * Shape is validated field by field rather than trusted wholesale — this is
 * attacker-writable storage in the sense that any script on the origin (or a
 * future edit to INITIAL) can change it, and a half-valid draft would render
 * as an uncontrolled input and then vanish on submit.
 */
export function readDraft() {
  let raw
  try {
    raw = localStorage.getItem(DRAFT_KEY)
  } catch {
    return null // storage disabled (private mode, blocked cookies) — run without a draft
  }
  if (!raw) return null

  let parsed
  try {
    parsed = JSON.parse(raw)
  } catch {
    return null
  }
  if (!parsed || typeof parsed !== 'object') return null

  const { values, hex, step, reached, savedAt } = parsed

  if (isNum(savedAt) && Date.now() - savedAt > DRAFT_MAX_AGE_MS) {
    clearDraft()
    return null
  }
  if (!values || typeof values !== 'object') return null

  const cleanValues = {}
  for (const [k, v] of Object.entries(values)) {
    if (isString(v)) cleanValues[k] = v
    else if (isBool(v)) cleanValues[k] = v
  }

  const cleanHex = {}
  if (hex && typeof hex === 'object') {
    for (const [k, v] of Object.entries(hex)) if (isNum(v)) cleanHex[k] = v
  }

  return {
    values: cleanValues,
    hex: cleanHex,
    step: isNum(step) ? step : 0,
    reached: isNum(reached) ? reached : 0,
    savedAt: isNum(savedAt) ? savedAt : Date.now(),
  }
}

/** True when a draft carries anything worth restoring. Guards both the read and
 *  the write, so an emptied form doesn't leave a hollow shell to "restore". */
export function hasDraftContent(draft) {
  if (!draft) return false
  const { values = {}, hex = {} } = draft
  const anyValue = Object.values(values).some((v) => (typeof v === 'boolean' ? v : String(v ?? '').trim() !== ''))
  const anyAnswer = Object.keys(hex).length > 0
  return anyValue || anyAnswer
}

export function writeDraft({ values, hex, step, reached }) {
  const payload = { values, hex, step, reached }
  try {
    if (!hasDraftContent(payload)) {
      localStorage.removeItem(DRAFT_KEY)
      return
    }
    localStorage.setItem(
      DRAFT_KEY,
      JSON.stringify({ ...payload, savedAt: Date.now() }),
    )
  } catch {
    // Quota exceeded or storage blocked. The form keeps working, it just stops
    // surviving a refresh — nothing here is worth failing a submission over.
  }
}

/** Wipe both halves of the draft. Returns a promise so callers can await the file delete. */
export function clearDraft() {
  try {
    localStorage.removeItem(DRAFT_KEY)
  } catch {
    /* nothing to do — the file delete below is the part that can actually fail */
  }
  return deleteResumeFile()
}

/* --- Resume, in IndexedDB ---------------------------------------------------- */

function openDb() {
  return new Promise((resolve, reject) => {
    let req
    try {
      req = indexedDB.open(DB_NAME, DB_VERSION)
    } catch (err) {
      reject(err)
      return
    }
    req.onupgradeneeded = () => {
      const db = req.result
      if (!db.objectStoreNames.contains(FILE_STORE)) db.createObjectStore(FILE_STORE)
    }
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
    req.onblocked = () => reject(new Error('indexeddb blocked'))
  })
}

function withStore(mode, run) {
  return openDb().then(
    (db) =>
      new Promise((resolve, reject) => {
        let tx
        try {
          tx = db.transaction(FILE_STORE, mode)
        } catch (err) {
          db.close()
          reject(err)
          return
        }
        const req = run(tx.objectStore(FILE_STORE))
        tx.oncomplete = () => { db.close(); resolve(req?.result) }
        tx.onerror = () => { db.close(); reject(tx.error) }
        tx.onabort = () => { db.close(); reject(tx.error) }
      }),
  )
}

/** Persist the resume. The Blob is stored by reference, not copied into a string. */
export async function saveResumeFile(file) {
  if (!file) return deleteResumeFile()
  try {
    await withStore('readwrite', (store) =>
      store.put({ name: file.name, type: file.type, blob: file }, RESUME_ID))
    return true
  } catch {
    return false // resume simply won't survive a refresh this time
  }
}

/**
 * Rebuild the stored resume as a real File, so the existing multipart upload
 * path works untouched. Returns null when there is nothing stored, or when the
 * record cannot be trusted (missing blob, so a null `File.name` in the preview).
 */
export async function readResumeFile() {
  try {
    const rec = await withStore('readonly', (store) => store.get(RESUME_ID))
    if (!rec || !rec.blob || !rec.name) return null
    if (typeof rec.blob.arrayBuffer !== 'function' && typeof rec.blob.text !== 'function') return null
    const blob = rec.blob.slice ? rec.blob : new Blob([rec.blob])
    return new File([blob], rec.name, { type: rec.type || blob.type || '' })
  } catch {
    return null
  }
}

export async function deleteResumeFile() {
  try {
    await withStore('readwrite', (store) => store.delete(RESUME_ID))
    return true
  } catch {
    return false
  }
}
