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
      '₹2,700 Cr generated, 1,200 professionals coached, 16 years in Hyderabad luxury real estate. We coach, consult, and deliver sales mandates and brand work.',
  },
  '/coaching': {
    title: 'Luxury Real Estate Sales Coaching in Hyderabad | Rajiv Williams',
    description:
      '1,200 sales professionals coached across 16 years. Luxury real estate sales coaching in Hyderabad for developers, sales leadership, and top closers.',
  },
  '/luxarysales': {
    title: 'Luxury Sales Mastery | Sales Coaching | Rajiv Williams',
    description:
      'Luxury buyer psychology, premium positioning, and high-value closing for developers and luxury real-estate sales professionals in Hyderabad.',
  },
  '/highticketsales': {
    title: 'High Ticket Sales Mastery | Sales Coaching | Rajiv Williams',
    description:
      'High-ticket conversion, objection handling, negotiation, and closing for developers and real-estate sales professionals in Hyderabad.',
  },
  '/one-to-one': {
    title: 'One-to-One Mentoring | Sales Coaching | Rajiv Williams',
    description:
      'Personalised one-to-one mentoring for CXOs, senior leadership, and ambitious sales professionals.',
  },
  '/investmentadvisory': {
    title: 'Investment Advisory | Projects in Hyderabad | Rajiv Williams',
    description:
      'Browse luxury and premium homes across Hyderabad by area. Open a project for a closer look, or talk to an expert.',
  },
  /* Legacy path; app redirects to /investmentadvisory. */
  '/project-hyderabad': {
    title: 'Investment Advisory | Projects in Hyderabad | Rajiv Williams',
    description:
      'Browse luxury and premium homes across Hyderabad by area. Open a project for a closer look, or talk to an expert.',
  },
  '/consulting': {
    title: 'Real Estate Sales Consulting for Developers, senior sales leadership & top closers. | Rajiv Williams',
    description:
      'Sales consulting: audit, process design, deployment support, and refinement so a developer sales operation converts without living on discounts.',
  },
  '/brandconsulting': {
    title: 'Brand Consulting for Real Estate Developers | Rajiv Williams',
    description:
      '16 years in Hyderabad inventory. Our brand consulting helps developers sell with the right brand language and buyer psychology.',
  },
  '/socialmedia': {
    title: 'Social Media Management for Real Estate Brands | Rajiv Williams',
    description:
      'Our social media management for Hyderabad developers: Instagram, Facebook, YouTube, LinkedIn, X, Threads, creatives, ads, plus SEO and local visibility add-ons.',
  },
  /* Legacy paths; app redirects to /brandconsulting. */
  '/brandingconsulting': {
    title: 'Brand Consulting for Real Estate Developers | Rajiv Williams',
    description:
      '16 years in Hyderabad inventory. Our brand consulting helps developers sell with the right brand language and buyer psychology.',
  },
  '/consulting/brand-consulting': {
    title: 'Brand Consulting for Real Estate Developers | Rajiv Williams',
    description:
      '16 years in Hyderabad inventory. Our brand consulting helps developers sell with the right brand language and buyer psychology.',
  },
  '/realty': {
    title: 'RW Realty | Exclusive Luxury Sales Mandates, Hyderabad',
    description:
      'We take full ownership of sales strategy, a dedicated onsite team, and end-to-end funnel management for luxury residential projects across Hyderabad.',
  },
  '/realty/portfolio': {
    title: 'About Rajiv Williams | Track Record, Hyderabad',
    description:
      '16+ years, ₹2,700 Cr generated, 1,200 professionals coached. We lead coaching and consulting. Our team runs mandates and brand delivery.',
  },
  /* Same page as above; /realty/portfolio redirects to /about. */
  '/realty/listings': {
    title: 'Verified Property Listings in Hyderabad | RW Realty',
    description:
      'Browse verified apartments, villas and plots. Every listing is reviewed by the RW Realty team before it goes live.',
  },
  '/listings': {
    title: 'Upload Your Property Free | RW Realty',
    description:
      'Upload your Hyderabad property free. We market it. 3% professional fee only when the sale closes with us.',
  },
  '/listings/login': {
    title: 'Listing Login | RW Realty',
    description: 'Sign in with a one-time email code to manage your property listings with us.',
  },
  '/listings/dashboard': {
    title: 'Listing Dashboard | RW Realty',
    description: 'Manage your submitted property listings and enquiries.',
  },
  '/careers': {
    title: 'Careers in Luxury Real Estate Sales, Hyderabad | Rajiv Williams',
    description:
      'Sales, business development, client relations and operations roles on exclusive luxury mandates. Premium inventory, in-house coaching, uncapped incentives.',
  },
  '/templates': {
    title: 'Free Realty Forms for Brokers, Hyderabad | Rajiv Williams',
    description:
      'Forms a Hyderabad channel partner or broker fills across the deal: lead intake, builder relations, inventory, closing, and compliance.',
  },
  '/vendorpartner': {
    title: 'Vendor Partner | Share Your Work | Rajiv Williams',
    description:
      'Vendors share a profile photo, what they offer, and links to their work. We review every submission.',
  },
  '/partner': {
    title: 'Channel Partners, Sell Luxury Inventory | Rajiv Williams',
    description:
      'Exclusive RW Realty mandates, golden-rate commissions, in-house sales training and warm leads. Apply to become a channel partner with us.',
  },
  '/articles': {
    title: 'Articles on Luxury Real Estate Sales | Rajiv Williams',
    description:
      'Writing on luxury sales, sales teams, and how we run mandates in Hyderabad.',
  },
  '/content-library': {
    title: 'Sales Carousel Content Library | Rajiv Williams',
    description:
      'Browse our sales carousels for learning. Share your details once, then download the PDFs you need.',
  },
  '/gallery': {
    title: 'Sales Video Gallery | Rajiv Williams',
    description:
      'Watch talks on real estate sales, rejection, objections, negotiation, and revenue systems. Videos and images from our team.',
  },
  '/faqs': {
    title: 'FAQs | Coaching, Consulting, Mandates | Rajiv Williams',
    description:
      'Questions on luxury sales coaching, developer consulting, exclusive mandates, and the KRISAH assessment — grouped by the work.',
  },
  '/about': {
    title: 'About Rajiv Williams | Track Record, Hyderabad',
    description:
      '16+ years, ₹2,700 Cr generated, 1,200 professionals coached. We lead coaching and consulting. Our team runs mandates and brand delivery.',
  },
  '/contact': {
    title: 'Contact Rajiv Williams, Hyderabad',
    description:
      'Sales coaching, consulting, or a sales mandate. Based in Hyderabad, Telangana, India.',
  },
  '/privacy-policy': {
    title: 'Privacy Policy | Team RW · Rajiv Williams',
    description:
      'How Team RW, operated by Rajiv Williams in Hyderabad, collects, uses, stores and shares personal information on rajivwilliams.com.',
  },
  '/terms': {
    title: 'Terms of Use | Team RW · Rajiv Williams',
    description:
      'Terms of Use for the Team RW website, including forms, assessments, chat widgets and related online tools.',
  },
  '/partner/terms': {
    title: 'Channel Partner Terms | Team RW · Rajiv Williams',
    description:
      'Terms for Team RW channel partner applications: eligibility, documents, review, commissions and how a partnership starts.',
  },
  '/start': {
    title: 'Find the Right Service | Rajiv Williams',
    description: 'Answer one to three quick questions and we point you to the right Rajiv Williams service, whether coaching, consulting or an RW Realty mandate.',
  },
  '/form': {
    title: 'Pre-Consultation Assessment | Rajiv Williams',
    description: 'A short assessment before we speak about coaching, developer consulting or an RW Realty mandate.',
  },
  '/assessment': {
    title: 'Discover where you stand before your training begins | Rajiv Williams',
    description:
      'A 20-question, 25-minute AI interview powered by KRISAH before you speak to us. Open to any role, any stage of your career.',
  },
  '/assessment/result': {
    title: 'Sixteen Areas of Specialisation After Your AI Assessment | Rajiv Williams',
    description:
      'The sixteen areas of specialisation, 90 to 120 minutes each, matched to the gaps your AI assessment report turns up. No tiers, no split between coaching and consulting.',
  },
  '/coaching/result': {
    title: 'Your Coaching Assessment Result and Recommended Coaching Areas | Rajiv Williams',
    description:
      'Your assessment score and five recommended coaching starting points, with personalised development areas and all coaching specialisations from Rajiv Williams.',
  },
  '/coaching/purchase': {
    title: 'Buy Coaching Modules, 16 Areas with Live Pricing | Rajiv Williams',
    description:
      'Select coaching modules from the sixteen areas of specialisation with live pricing. Choose fixed packages or build your own selection, then place your purchase request.',
  },
  '/coaching/form': {
    title: 'Coaching Assessment | Rajiv Williams',
    description: 'A short pre-consultation assessment for luxury real estate sales coaching in Hyderabad.',
  },
  '/consulting/form': {
    title: 'Consulting Assessment | Rajiv Williams',
    description: 'A short pre-consultation assessment for developer sales consulting in Hyderabad.',
  },
  '/realty/form': {
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
