/** Booking / lead submission: every CTA posts to `/leads`, except careers apps (multipart to `/applications`). */
import { createApplication, getErrorMessage, sendWhatsAppConfirmation, submitLead } from './api'

/** Interest value the careers page presets — the branch into `/applications`. */
export const CAREERS_INTEREST = 'Joining the team'

// POST /leads only requires name, email, type and phoneNumber; rest folds into the message.

/** Form interest values mapped to the API's narrower `type` set; unmapped values fall back to `contact`. */
const LEAD_TYPE = {
  'Coaching': 'coaching',
  'Consulting': 'contact',
  'RW Realty mandate': 'project',
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

function toLead(form) {
  const notes = []
  if (form.interest) notes.push(`Interested in: ${form.interest}`)
  if (form.role) notes.push(`Role: ${form.role}`)
  if (form.message?.trim()) notes.push(form.message.trim())

  return {
    type: LEAD_TYPE[form.interest] || DEFAULT_LEAD_TYPE,
    name: form.name?.trim(),
    email: form.email?.trim(),
    phoneNumber: toPhoneDigits(form.phone),
    message: notes.join('\n'),
  }
}

/** Submit the booking modal; WhatsApp confirmation failures are logged, not surfaced. */
export async function submitBooking(form) {
  if (form.interest === CAREERS_INTEREST) {
    return submitApplication(form)
  }

  const lead = toLead(form)
  const result = await submitLead(lead)

  if (lead.phoneNumber) {
    try {
      await sendWhatsAppConfirmation({
        firstName: lead.name?.split(' ')[0] || 'there',
        sessionTitle: form.interest || 'Strategy call',
        sessionDate: 'To be confirmed',
        sessionTime: 'To be confirmed',
        venueOrPlace: 'Hyderabad',
        phoneNumber: lead.phoneNumber,
      })
    } catch (err) {
      // Non-blocking by design.
      console.error('[booking] WhatsApp confirmation failed:', getErrorMessage(err))
    }
  }

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
  ;['currentCtc', 'expectedCtc', 'currentLocation', 'noticePeriod', 'relocation', 'workMode', 'ref1Name', 'ref1Number', 'ref2Name', 'ref2Number'].forEach((field) => {
    if (form[field]?.trim()) fd.append(field, form[field].trim())
  })
  if (form.linkedinUrl?.trim()) fd.append('linkedinUrl', form.linkedinUrl.trim())
  if (form.portfolioUrl?.trim()) fd.append('portfolioUrl', form.portfolioUrl.trim())
  if (form.resume) fd.append('resume', form.resume)

  return (await createApplication(fd)) ?? { ok: true }
}
