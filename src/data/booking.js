/** Booking / lead submission: every CTA posts to `/leads`, except careers apps (multipart to `/applications`). */
import { createApplication, submitLead } from './api'
import { labelFor } from './guidance'

/** Interest value the careers page presets — the branch into `/applications`. */
export const CAREERS_INTEREST = 'Joining Team RW'

/** The booking modal's "I'm interested in" options. Keys here must match LEAD_TYPE below. */
export const INTERESTS = ['Sales Coaching', 'Sales Consulting', 'Sales Mandates', CAREERS_INTEREST, 'Something else']

// POST /leads only requires name, email, type and phoneNumber; the rest is optional.

/** Form interest values mapped to the API's narrower `type` set; unmapped values fall back to `contact`.
    Page presets (`interest="Coaching"` etc.) are listed too so older call sites keep their type. */
const LEAD_TYPE = {
  'Sales Coaching': 'coaching',
  'Coaching': 'coaching',
  'Sales Consulting': 'contact',
  'Consulting': 'contact',
  // A mandate enquiry is a developer lead, not a buyer's interest in a listing — `project` is for the latter.
  'Sales Mandates': 'contact',
  'RW Realty mandate': 'contact',
  [CAREERS_INTEREST]: 'contact',
  'Something else': 'contact',
}
const DEFAULT_LEAD_TYPE = 'contact'

/** Normalize any phone input to the bare 10 digits the API wants (keeps the last 10 if longer). */
export function toPhoneDigits(raw) {
  const digits = String(raw ?? '').replace(/\D/g, '')
  return digits.length > 10 ? digits.slice(-10) : digits
}

/** The API's rule, stated once so the form and the submit path agree. */
export const isValidPhone = (raw) => toPhoneDigits(raw).length === 10

/** One line the CRM notes can carry even where structured fields aren't read. */
export function guidanceSummary(g) {
  if (!g) return ''
  const parts = [
    g.who && `Visitor: ${labelFor('who', g.who)}`,
    g.challenge && `Challenge: ${labelFor('challenge', g.challenge, g.who)}`,
    g.goal && `Wants: ${labelFor('goal', g.goal)}`,
    g.recommended && `Recommended: ${g.recommended}`,
  ].filter(Boolean)
  return parts.join(' · ')
}

function toLead(form) {
  const notes = []
  if (form.interest) notes.push(`Interested in: ${form.interest}`)
  if (form.company?.trim()) notes.push(`Company: ${form.company.trim()}`)
  if (form.role) notes.push(`Role: ${form.role}`)
  const summary = guidanceSummary(form.guidance)
  if (summary) notes.push(summary)
  if (form.message?.trim()) notes.push(form.message.trim())

  const g = form.guidance || {}
  return {
    type: LEAD_TYPE[form.interest] || DEFAULT_LEAD_TYPE,
    name: form.name?.trim(),
    email: form.email?.trim(),
    phoneNumber: toPhoneDigits(form.phone),
    message: notes.join('\n'),
    // Structured copies of the same facts, for filtering in admin/CRM. All optional server-side.
    source: form.source || (g.who ? 'guided_finder' : 'site_cta'),
    ...(form.company?.trim() && { company: form.company.trim() }),
    ...(g.who && { visitorType: g.who }),
    ...(g.challenge && { challenge: g.challenge }),
    ...(g.goal && { goal: g.goal }),
    ...(g.recommendedKey && { recommendedService: g.recommendedKey }),
    // Honeypot: real visitors never see this field; bots fill it and the server drops the request.
    ...(form.website && { website: form.website }),
  }
}

/** Submit the booking modal. Resolves with the API body (`{ message, repeat? }`). */
export async function submitBooking(form) {
  if (form.interest === CAREERS_INTEREST) {
    return submitApplication(form)
  }
  const result = await submitLead(toLead(form))
  return result ?? { ok: true }
}

// Careers application: multipart with résumé, different fields than /leads.
async function submitApplication(form) {
  const fd = new FormData()
  fd.append('jobTitle', form.role?.trim() || form.interest || 'General application')
  fd.append('name', form.name?.trim() || '')
  fd.append('email', form.email?.trim() || '')
  fd.append('number', toPhoneDigits(form.phone))
  fd.append('coverLetter', form.message?.trim() || 'Resume attached.')
  if (form.jobId) fd.append('jobId', form.jobId)
  const experience = form.experience === 'Other' ? form.experienceCustom : form.experience
  if (experience?.trim()) fd.append('experience', experience.trim())
  ;['currentCtc', 'expectedCtc', 'currentLocation', 'noticePeriod', 'relocation', 'workMode', 'applicationSource', 'ref1Name', 'ref1Number', 'ref1Relationship', 'ref2Name', 'ref2Number', 'ref2Relationship'].forEach((field) => {
    if (form[field]?.trim()) fd.append(field, form[field].trim())
  })
  fd.append('privacyConsent', form.privacyConsent ? 'true' : 'false')
  if (form.linkedinUrl?.trim()) fd.append('linkedinUrl', form.linkedinUrl.trim())
  if (form.portfolioUrl?.trim()) fd.append('portfolioUrl', form.portfolioUrl.trim())
  if (form.resume) fd.append('resume', form.resume)

  return (await createApplication(fd)) ?? { ok: true }
}
