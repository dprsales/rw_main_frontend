/**
 * Per-route SEO metadata. `Seo.jsx` reads this and writes tags into <head> on
 * navigation. Keep titles under ~60 chars, descriptions under ~155 - Google truncates past that.
 */

export const SITE = {
  name: 'Rajiv Williams',
  url: 'https://www.rajivwilliams.com',
  locale: 'en_IN',
  ogImage: '/og-default.jpg', // 1200x630 — add this to public/
  twitter: '', // '@handle' if one exists
}

export const ROUTE_SEO = {
  '/': {
    title: 'Luxury Real Estate Sales Mentor in Hyderabad | Rajiv Williams',
    description:
      '₹2,700 Cr generated across 15 years in Hyderabad luxury real estate. Coaching for realtors, consulting for developers, and exclusive sales mandates.',
  },
  '/coaching': {
    title: 'Luxury Real Estate Sales Coaching in Hyderabad | Rajiv Williams',
    description:
      'Twelve-week cohorts, team training for sales floors, and six-month 1:1 mentoring for realtors selling high-ticket property in Hyderabad.',
  },
  '/consulting': {
    title: 'Real Estate Sales Consulting for Developers, senior sales leadership & top closers. | Rajiv Williams',
    description:
      'A four-phase engagement — audit, process design, deployment, refinement — that rebuilds a developer sales operation around conversion, not discounts.',
  },
  '/realty': {
    title: 'RW Realty — Exclusive Luxury Sales Mandates, Hyderabad',
    description:
      'Full ownership of sales strategy, a dedicated onsite team, and end-to-end funnel management for luxury residential projects across Hyderabad.',
  },
  '/realty/portfolio': {
    title: 'Track Record — 31 Projects, ₹2,700 Cr | Rajiv Williams',
    description:
      'Projects represented and mandated across Hyderabad’s luxury corridor, 27 developer partners, and recommendations from NAR India leadership.',
  },
  '/careers': {
    title: 'Careers — Luxury Real Estate Sales Roles in Hyderabad | Rajiv Williams',
    description:
      'Sales, business development, client relations and operations roles on exclusive luxury mandates. Premium inventory, in-house coaching, uncapped incentives.',
  },
  '/about': {
    title: 'About Rajiv Williams — Luxury Sales Mentor, Hyderabad',
    description:
      'Fifteen years from Dell to developer sales leadership to an independent mentoring practice. TGRERA registered, NAR India and HRA member.',
  },
  '/contact': {
    title: 'Contact Rajiv Williams — Hyderabad',
    description:
      'Speak to Rajiv Williams about coaching, developer consulting, or an exclusive sales mandate. Based in Shaikpet, Hyderabad.',
  },
  '/form': {
    title: 'Pre-Consultation Assessment | Rajiv Williams',
    description: 'A short assessment before we speak — pick coaching, consulting, or an RW Realty mandate.',
  },
  '/assessment': {
    title: 'AI Assessment — 20 Questions, 25 Minutes | Rajiv Williams',
    description:
      'A 20-question, 25-minute AI interview powered by KRISAH before you speak to us. Open to any role, any stage of your career.',
  },
  '/assessment/result': {
    title: 'Course Catalogue After Your AI Assessment | Rajiv Williams',
    description:
      'Sixteen coaching and consulting courses — 90 to 120 minutes each — matched to the gaps your AI assessment report turns up.',
  },
  '/form/coaching': {
    title: 'Coaching Assessment | Rajiv Williams',
    description: 'A short pre-consultation assessment for luxury real estate sales coaching in Hyderabad.',
  },
  '/form/consulting': {
    title: 'Consulting Assessment | Rajiv Williams',
    description: 'A short pre-consultation assessment for developer sales consulting in Hyderabad.',
  },
  '/form/realty': {
    title: 'RW Realty Mandate Assessment | Rajiv Williams',
    description: 'A short pre-consultation assessment for an exclusive RW Realty sales mandate.',
  },
}

/** Project detail pages get their title from API data; this is the shape. */
export function projectSeo(project) {
  const name = project?.title || project?.name || 'Project'
  const area = project?.area || project?.location || 'Hyderabad'
  return {
    title: `${name}, ${area} | Rajiv Williams`,
    description: `${name} in ${area}, Hyderabad. Floor plans, amenities and connectivity, represented by Rajiv Williams and RW Realty.`,
  }
}

export const DEFAULT_SEO = ROUTE_SEO['/']
