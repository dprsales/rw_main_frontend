/**
 * Simple coaching programme landings linked from /coaching cards and the header submenu.
 * Paths match the shareable URLs Team RW asked for (improve copy/layout later).
 */
import goalsImage from '../assets/site/whiteboard-goals.png'
import luxuryImage from '../assets/site/plate-desk.png'
import mentoringImage from '../assets/site/plate-reading.png'
import { COACHING_PROGRAMS } from './content'

export const COACHING_PROGRAM_PATHS = [
  '/luxarysales',
  '/highticketsales',
  '/one-to-one',
]

const COVERS = [luxuryImage, goalsImage, mentoringImage]

const EXTRAS = [
  {
    path: '/luxarysales',
    slug: 'luxarysales',
    eyebrow: 'Sales Coaching · Programme I',
    titleLines: ['Luxury Sales', 'Mastery'],
    /* Keep the face in the clear zone below the sticky header. */
    objectPosition: '78% 26%',
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
    objectPosition: '82% 24%',
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
    objectPosition: '84% 22%',
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
