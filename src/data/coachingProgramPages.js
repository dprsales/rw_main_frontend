/**
 * Simple coaching programme landings linked from /coaching cards and the header submenu.
 * Paths match the shareable URLs Team RW asked for (improve copy/layout later).
 */
import luxuryImage from '../assets/site/hero-luxury-sales.jpg'
import highTicketImage from '../assets/site/hero-high-ticket-sales.jpg'
import mentoringImage from '../assets/site/hero-one-to-one.jpg'
import { COACHING_PROGRAMS } from './content'

export const COACHING_PROGRAM_PATHS = [
  '/luxarysales',
  '/highticketsales',
  '/one-to-one',
]

const COVERS = [luxuryImage, highTicketImage, mentoringImage]

const EXTRAS = [
  {
    path: '/luxarysales',
    slug: 'luxarysales',
    eyebrow: 'Sales Coaching · Programme I',
    titleLines: ['Luxury Sales', 'Mastery'],
    /* Couple + model sit centre-right; keep them clear of the sticky header. */
    objectPosition: '68% 42%',
    proof: 'For developers and luxury real-estate sales professionals who sell on trust, not discounts.',
    focus: [
      'How luxury buyers decide and what they actually trust',
      'Premium positioning without sounding desperate',
      'Rapport that holds under high ticket pressure',
      'Negotiation and closing for high-value inventory',
    ],
  },
  {
    path: '/highticketsales',
    slug: 'highticketsales',
    eyebrow: 'Sales Coaching · Programme II',
    titleLines: ['High Ticket', 'Sales Mastery'],
    objectPosition: '62% 40%',
    proof: 'For developers and real-estate sales professionals who need cleaner conversion and stronger closes.',
    focus: [
      'Client psychology that drives yes or no',
      'Objection handling that stays calm and clear',
      'Negotiation that protects ticket size',
      'Confidence and consistency on high-value closes',
    ],
  },
  {
    path: '/one-to-one',
    slug: 'one-to-one',
    eyebrow: 'Sales Coaching · Programme III',
    titleLines: ['One-to-One', 'Mentoring'],
    objectPosition: '58% 38%',
    proof: 'For CXOs, senior leadership, and ambitious sales professionals who need personal guidance.',
    focus: [
      'A personal read of where you are stuck',
      'Strategy and gap discussion on your live deals',
      'Targeted mentoring, not a generic classroom script',
      'Clear next actions you can run the same week',
    ],
  },
]

export const COACHING_PROGRAM_PAGES = COACHING_PROGRAMS.map((program, index) => ({
  ...program,
  ...EXTRAS[index],
  cover: COVERS[index],
  index,
}))

export function coachingProgramByPath(pathname = '') {
  const path = String(pathname || '').replace(/\/$/, '') || '/'
  return COACHING_PROGRAM_PAGES.find((row) => row.path === path) || null
}

export function coachingProgramPathByIndex(index) {
  return COACHING_PROGRAM_PATHS[index] || '/coaching'
}
