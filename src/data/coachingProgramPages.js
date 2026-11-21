/**
 * Simple coaching programme landings linked from /coaching cards and the header submenu.
 * Paths match the shareable URLs Team RW asked for.
 *
 * Audience is builders, developers, and senior sales people who already have skill.
 * Copy must show the edge they do not already get from experience alone.
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
    objectPosition: '68% 42%',
    lede: 'You already sell. This is the edge that holds premium price and closes luxury buyers on trust.',
    proof: 'For developers and luxury real-estate sales professionals who already close, and want the top of the market.',
    processTitle: 'What you sharpen',
    process: [
      {
        heading: 'Luxury buyer psychology',
        line: 'How serious luxury buyers decide when features and brochures are not enough.',
      },
      {
        heading: 'Premium positioning',
        line: 'Hold value when the market, the channel, or the buyer pushes for discount.',
      },
      {
        heading: 'Trust and rapport',
        line: 'Authority in the room that scripts and product tours cannot replace.',
      },
      {
        heading: 'High-value negotiation and closing',
        line: 'Close crore inventory without giving the deal away.',
      },
    ],
  },
  {
    path: '/highticketsales',
    slug: 'highticketsales',
    eyebrow: 'Sales Coaching · Programme II',
    titleLines: ['High Ticket', 'Sales Mastery'],
    objectPosition: '62% 40%',
    lede: 'You already work a high-ticket pipeline. This turns more of those deals into closes.',
    proof: 'For developers and real-estate sales professionals who sell large tickets and want cleaner conversion.',
    processTitle: 'What you sharpen',
    process: [
      {
        heading: 'Client psychology',
        line: 'Why strong buyers stall, and how to move them without pressure theatre.',
      },
      {
        heading: 'Objection handling',
        line: 'Turn the objections that kill high-ticket deals into clear next steps.',
      },
      {
        heading: 'Negotiation',
        line: 'Protect ticket and margin when the buyer is experienced too.',
      },
      {
        heading: 'Confidence and high-value closing',
        line: 'Repeatable closes when the number is large and the room is sharp.',
      },
    ],
  },
  {
    path: '/one-to-one',
    slug: 'one-to-one',
    eyebrow: 'Sales Coaching · Programme III',
    titleLines: ['One-to-One', 'Mentoring'],
    objectPosition: '58% 38%',
    /* One-to-One points locked to Rajiv sir call wording. */
    lede: '1-to-1 mentoring on your live deals, leadership priorities, and next actions.',
    proof: 'For CXOs, senior leadership, and aspiring sales professionals.',
    processTitle: 'What you work on',
    process: [
      {
        heading: 'Strategy and gap analysis',
        line: 'Work through your live deals and leadership priorities.',
      },
      {
        heading: 'Identify key areas',
        line: 'Focus on the priorities that must not be ignored.',
      },
      {
        heading: 'Targeted mentoring',
        line: 'Mentoring shaped around your situation.',
      },
      {
        heading: 'Strategic execution plan',
        line: 'Step-by-step guidance you can run the same week.',
      },
    ],
  },
]

export const COACHING_PROGRAM_PAGES = COACHING_PROGRAMS.map((program, index) => {
  const extra = EXTRAS[index]
  return {
    ...program,
    ...extra,
    description: extra.lede || program.description,
    audience: extra.proof || program.audience,
    cover: COVERS[index],
    index,
  }
})

export function coachingProgramByPath(pathname = '') {
  const path = String(pathname || '').replace(/\/$/, '') || '/'
  return COACHING_PROGRAM_PAGES.find((row) => row.path === path) || null
}

export function coachingProgramPathByIndex(index) {
  return COACHING_PROGRAM_PATHS[index] || '/coaching'
}
