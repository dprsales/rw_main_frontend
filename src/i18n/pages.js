/** Day 2 — Home, About, Contact page bodies. Names, phones, emails, URLs, stats stay as stored. */
import { te } from './pages-te'

export const pages = {
  en: {
    'seo.home.title': 'Luxury Real Estate Sales Mentor in Hyderabad | Rajiv Williams',
    'seo.home.desc': '₹2,700 Cr generated, 1,200 professionals coached, 16 years in Hyderabad luxury real estate. Coaching, consulting, and exclusive sales mandates.',
    'seo.about.title': 'About Rajiv Williams | Luxury Sales Mentor, Hyderabad',
    'seo.about.desc': '16+ years, ₹2,700 Cr generated, and 1,200 professionals coached. From Dell to developer sales leadership to an independent mentoring practice.',
    'seo.contact.title': 'Contact Rajiv Williams, Hyderabad',
    'seo.contact.desc': 'Speak to Rajiv Williams about coaching, developer consulting, or an exclusive sales mandate. Based in Hyderabad, Telangana, India.',

    'home.heroAria': 'Homepage hero',
    'home.slidesAria': 'Hero slides',
    'home.prevSlide': 'Previous slide',
    'home.nextSlide': 'Next slide',
    'home.goSlide': 'Go to slide {n}',
    'home.eyebrow': 'RAJIV WILLIAMS · HYDERABAD REAL ESTATE',
    'home.line1': 'The specialist who',
    'home.line2': 'moves markets.',
    'home.lede': '₹2,700 Cr generated. 1,200 professionals coached. 16+ years at the top of Hyderabad real estate.',
    'home.story': 'The story →',
    'home.tgrera': 'TGRERA LICENSED REALTOR',
    'home.member': 'MEMBER',
    'home.alt.lead': 'Rajiv Williams',
    'home.alt.coaching': 'Rajiv Williams presenting to a sales team around a boardroom table',
    'home.alt.consulting': 'Consultant presenting sales performance to a developer leadership pair',
    'home.alt.realty': 'Young family receiving house keys from a salesperson at a luxury villa',
    'home.alt.hra': "Hyderabad Realtors' Association",
    'home.alt.nar': 'National Association of Realtors',
    'home.slide.coaching.eyebrow': 'FOR DEVELOPERS · SALES LEADERSHIP · TOP CLOSERS',
    'home.slide.coaching.line1': 'Sales',
    'home.slide.coaching.line2': 'Coaching',
    'home.slide.coaching.lede': '1,200 professionals coached. Value your team as much as your customers.',
    'home.slide.coaching.cta': 'Explore Sales Coaching',
    'home.slide.consulting.eyebrow': 'FOR DEVELOPERS · SALES LEADERSHIP · TOP CLOSERS',
    'home.slide.consulting.line1': 'Sales',
    'home.slide.consulting.line2': 'Consulting',
    'home.slide.consulting.lede': '₹2,700+ Cr sold, quietly. Built for absorption, not brochures.',
    'home.slide.consulting.cta': 'Explore Sales Consulting',
    'home.slide.realty.eyebrow': 'END-TO-END SALES MANDATE',
    'home.slide.realty.line1': 'Sales',
    'home.slide.realty.line2': 'Mandates',
    'home.slide.realty.lede': 'We take ownership of the sale—from strategy to closure.',
    'home.slide.realty.cta': 'Explore Sales Mandate',
    'home.ways': 'THREE MOVES. ONE OUTCOME. MORE CLOSED.',
    'home.way.1.title': 'Your ticket size is a ceiling you built. Break it.',
    'home.way.1.line': 'For developers, senior sales leadership, and top sales closers done with volume games.',
    'home.way.2.title': 'Right product, wrong velocity. That is fixable.',
    'home.way.2.line': 'Advisory on the part of the business the brochure never fixes.',
    'home.way.3.title': 'You build. We sell, end to end.',
    'home.way.3.line': 'Full ownership of sales strategy, a dedicated onsite team, and end-to-end funnel management.',
    'home.way.alt.1': 'People Growth chart: Listen, Advise, Negotiate, Close',
    'home.way.alt.2': 'Sales System cycle: Audit, Design, Implement, Scale',
    'home.way.alt.3': 'End-to-End Ownership funnel: Leads to Closure',
    'home.words': 'In their words',
    'home.quote': 'I never stopped selling. That is the whole method; everything I pass on was closed first, shared second.',
    'home.more.eyebrow': '& MORE',
    'home.more.title': 'Strategic support, beyond the framework.',
    'home.more.aside': 'Additional services designed to strengthen visibility, accelerate sales movement, and improve operational efficiency.',
    'home.t1': 'Rajiv negotiates like the asset is his own. His deep understanding of local market dynamics gave us a very good perspective on the opportunities in Hyderabad.',
    'home.t2': 'He always says, "do it with your passion and heart or else don’t do it." Having a mentor like him makes you sharper on tasks, skills, focus and life.',
    'home.t3': 'His expertise and guidance were instrumental in my professional growth, the best mentor I have come across.',

    'finder.eyebrow': 'FIND THE RIGHT FIT',
    'finder.title1': 'Tell us who you are. ',
    'finder.title2': 'We’ll point you in the right direction.',
    'finder.lede': 'A few taps. Change an answer any time, or skip and book a call.',
    'finder.browse': 'BROWSE SERVICES ',
    'finder.based': 'BASED ON YOUR ANSWERS',
    'finder.recommend': 'Our recommendation',
    'finder.browseProjects': 'BROWSE THE PROJECTS',
    'finder.startOver': 'start over',
    'finder.step': 'STEP',
    'finder.or': ' or ',
    'finder.q.who': 'What fits you best?',
    'finder.q.challenge': 'What is the problem right now?',
    'finder.q.challenge.developer': 'What is going on with sales?',
    'finder.q.challenge.sales_leader': 'What is the problem right now?',
    'finder.q.challenge.sales_pro': 'What do you want to get better at?',
    'finder.q.goal': 'What would help most?',
    'finder.help.many': 'Pick every one that is true. Then tap Continue.',
    'finder.continue': 'CONTINUE',
    'finder.other.prompt': 'Tell us in a few words',
    'finder.other.placeholder': 'Write it here',
    'finder.change': 'Change answer: {label}',
    'finder.who.developer': 'Developer / Builder',
    'finder.who.sales_leader': 'I lead a sales team',
    'finder.who.sales_pro': 'I sell homes',
    'finder.who.investor': 'I want to buy a home',
    'finder.ch.developer.unsold_inventory': 'Homes are not selling',
    'finder.ch.developer.slow_sales': 'Sales are slow',
    'finder.ch.developer.team_performance': 'My sales team is not doing well',
    'finder.ch.developer.no_sales_setup': 'No sales team yet',
    'finder.ch.developer.positioning': "Buyers don't see why our project is special",
    'finder.ch.developer.all_of_above': 'All of these',
    'finder.ch.developer.other': 'Something else',
    'finder.ch.sales_leader.team_performance': 'Team is not hitting numbers',
    'finder.ch.sales_leader.low_closing': "People enquire, but they don't buy",
    'finder.ch.sales_leader.process_crm': 'No clear sales process',
    'finder.ch.sales_leader.positioning': 'Hard to explain the project / price',
    'finder.ch.sales_leader.all_of_above': 'All of these',
    'finder.ch.sales_leader.other': 'Something else',
    'finder.ch.sales_pro.low_closing': "I don't close enough deals",
    'finder.ch.sales_pro.luxury_skills': 'I want to sell bigger homes',
    'finder.ch.sales_pro.career_growth': 'I want to grow in my job',
    'finder.ch.sales_pro.other': 'Something else',
    'finder.goal.train_team': 'Train my team',
    'finder.goal.fix_process': 'Fix my sales pipeline',
    'finder.goal.hand_over': 'Let RW sell for me',
    'finder.out.coaching': 'Sales Coaching',
    'finder.out.consulting': 'Sales Consulting',
    'finder.out.realty': 'Sales Mandate · RW Realty',
    'finder.out.realty_portfolio': 'RW Realty projects',
    'finder.out.strategy_call': 'A strategy call',
    'finder.cta.coaching': 'See how coaching works',
    'finder.cta.consulting': 'See how consulting works',
    'finder.cta.realty': 'See how a mandate works',
    'finder.cta.realty_portfolio': 'Browse the projects',
    'finder.form.coaching': 'SHARE YOUR COACHING DETAILS',
    'finder.form.consulting': 'SHARE YOUR BUSINESS DETAILS',
    'finder.form.realty': 'SHARE YOUR PROJECT DETAILS',
    'finder.secondary.assessment': 'Take the assessment first',
    'finder.reason.R1': 'You want to buy. Start with the RW Realty projects we sell.',
    'finder.reason.R2': 'A short call will help us pick the right fit together.',
    'finder.reason.R3': 'Coaching helps you close more deals, one person at a time.',
    'finder.reason.R4': 'Coaching is for you. A short form helps us see where to start.',
    'finder.reason.R5': 'Coaching helps your team turn more enquiries into sales.',
    'finder.reason.R6': 'This is about how sales is run, not one person. Consulting looks at the whole setup.',
    'finder.reason.R7': 'This is bigger than selling skill. Consulting looks at the whole sales plan.',
    'finder.reason.R8': 'You want your team to sell better. That is coaching.',
    'finder.reason.R9': 'You want the whole sales system fixed. That is consulting.',
    'finder.reason.R10': 'Coaching or consulting — a short call will make it clear.',
    'finder.reason.R11': 'Keep your team. We will help them sell better. That is coaching.',
    'finder.reason.R12': 'Let us look at how sales is run — team, process, and tools. That is consulting.',
    'finder.reason.R13': 'You build. We sell. That is a sales mandate.',
    'finder.reason.R14': 'Consulting, or we sell for you — a short call will make it clear.',
    'finder.reason.R15': 'You have more than one problem. Consulting looks at the whole picture, not just one skill.',
    'finder.reason.fallback': 'A short call will help us pick the right fit together.',

    'about.eyebrow': 'ABOUT · RAJIV WILLIAMS',
    'about.h1': 'Practitioner first. ',
    'about.h2': 'Teacher because of it.',
    'about.lede': '₹2,700 Cr generated. 1,200 professionals coached. 16+ yrs of live deals.',
    'about.intro': 'Everything taught here was earned in the market first, and taught second. The practice and the teaching run in parallel, with mornings in the market and afternoons with cohorts and boardrooms.',
    'about.apply': 'APPLY TO WORK WITH RAJIV',
    'about.creds': 'CREDENTIALS & MEMBERSHIPS',
    'about.close': 'The story is the credential. The work is the proof.',
    'about.track': 'THE TRACK',
    'about.trackTitle': ' yrs, from the call floor to the boardroom.',
    'about.trackLede': 'A path that runs from enterprise operations through developer sales leadership into independent mentoring and mandate work.',
    'about.allRoles': 'ALL ROLES · HYDERABAD, INDIA',
    'about.current': 'CURRENT',
    'about.phase.practice': 'The practice today',
    'about.phase.practice.note': 'Independent mentoring & mandate work',
    'about.phase.advisory': 'Mentoring & advisory',
    'about.phase.advisory.note': 'Retained across eight developer and design businesses',
    'about.phase.leadership': 'Developer sales leadership',
    'about.phase.leadership.note': 'Owning the number, not advising on it',
    'about.phase.foundations': 'Enterprise foundations',
    'about.phase.foundations.note': 'Where the process discipline came from',
    'about.role.rajiv': 'Luxury Sales Mentor · Coach & Consultant',
    'about.role.dezign': 'Business Owner',
    'about.role.tejase': 'Sales Mentor',
    'about.role.ira': 'Sales & Marketing Mentor',
    'about.role.tar': 'Organizational Mentor',
    'about.role.suchirindia': 'Business Mentor',
    'about.role.ornate': 'Strategic Partner',
    'about.role.landmark': 'Organizational Mentor',
    'about.role.avani': 'Strategic Partner',
    'about.role.magnifiq': 'Strategic Partner',
    'about.role.pvr': 'Director, Sales, Marketing & Business Development',
    'about.role.systel': 'Operations & Client Relations Manager',
    'about.role.dell': 'Sr. Process Executive',
    'about.cred.0': 'TGRERA Licensed Realtor',
    'about.cred.1': "Member, Hyderabad Realtors' Association",
    'about.cred.2': '130+ written recommendations',
    'about.cred.3': 'Founder, Design Sharks, Happening hyderabad',
    'about.assoc.member': 'Member',
    'about.assoc.licensed': 'Licensed Realtor',
    'about.assoc.founder': 'Founder',
    'about.assoc.owner': 'Owner',
    'about.assoc.hh': 'Curated community of GCC around 86,000+ of active followers',

    'contact.eyebrow': 'CONTACT · RAJIV WILLIAMS',
    'contact.h1': 'One form. ',
    'contact.h2': 'Read personally.',
    'contact.lede': 'Coaching applications, developer enquiries, and RW Realty mandates all start here.',
    'contact.intro': 'Book a call directly, or reach out on any of the channels below.',
    'contact.reach': 'REACH RAJIV DIRECTLY',
    'contact.email': 'EMAIL',
    'contact.phone': 'PHONE',
    'contact.whatsapp': 'WHATSAPP',
    'contact.location': 'LOCATION',
    'contact.wa': 'Message on WhatsApp',
    'contact.place': 'Hyderabad, Telangana, India',

    'hire.urgent': 'Urgent hiring',
    'hire.slides': 'Hiring slides',
    'hire.show': 'Show {title}',
    'hire.line.finance': 'Billing, payroll, P&L, and the books.',
    'hire.line.trainee': 'Ops, sales support, and real estate training.',
    'hire.apply': 'Apply',
  },
  te,
}

const ROLE_KEYS = {
  'Rajiv Williams · Luxury Sales Mastery': 'about.role.rajiv',
  'Dezign Shark': 'about.role.dezign',
  'Tejase Developers': 'about.role.tejase',
  'IRA Realty India': 'about.role.ira',
  'TAR Group': 'about.role.tar',
  'Suchirindia': 'about.role.suchirindia',
  'Ornate Interiors': 'about.role.ornate',
  'Landmark Group India': 'about.role.landmark',
  'Avani Projects': 'about.role.avani',
  'Magnifiq Properties': 'about.role.magnifiq',
  'PVR Developers India': 'about.role.pvr',
  'Systel': 'about.role.systel',
  'Dell': 'about.role.dell',
}

const ASSOC_ROLE_KEYS = {
  Member: 'about.assoc.member',
  'Licensed Realtor': 'about.assoc.licensed',
  Founder: 'about.assoc.founder',
  Owner: 'about.assoc.owner',
}

const HIRE_LINE_KEYS = {
  'Finance & Account Manager': 'hire.line.finance',
  'Management Trainee': 'hire.line.trainee',
}

const SEO_ROUTES = {
  '/': 'home',
  '/about': 'about',
  '/contact': 'contact',
}

export function experienceRoleKey(company) {
  return ROLE_KEYS[company]
}

export function associationRoleKey(role) {
  return ASSOC_ROLE_KEYS[role]
}

export function hireLineKey(title) {
  return HIRE_LINE_KEYS[title]
}

export function seoRouteKey(route) {
  return SEO_ROUTES[route]
}

export function finderLabel(t, key, value, who, note) {
  if (!value) return ''
  if (key === 'who') return t(`finder.who.${value}`)
  if (key === 'challenge') {
    const list = Array.isArray(value) ? value : [value]
    const clip = (text) => {
      const clean = String(text || '').trim()
      return clean.length > 56 ? `${clean.slice(0, 55)}…` : clean
    }
    const name = (item) => {
      if (item === 'other' && note) return clip(note)
      if (who) return t(`finder.ch.${who}.${item}`)
      for (const persona of ['developer', 'sales_leader', 'sales_pro']) {
        const hit = t(`finder.ch.${persona}.${item}`)
        if (hit !== `finder.ch.${persona}.${item}`) return hit
      }
      return item
    }
    if (list.includes('all_of_above') && !list.includes('other')) return t(`finder.ch.${who || 'developer'}.all_of_above`)
    if (list.includes('all_of_above') && list.includes('other')) {
      const extra = note ? clip(note) : t(`finder.ch.${who || 'developer'}.other`)
      return `${t(`finder.ch.${who || 'developer'}.all_of_above`)}, ${extra}`
    }
    if (list.length > 1) return list.map(name).join(', ')
    return name(list[0])
  }
  if (key === 'goal') return t(`finder.goal.${value}`)
  return value
}

export function finderOutcomeName(t, key, fallback = '') {
  if (!key) return fallback
  const hit = t(`finder.out.${key}`)
  return hit === `finder.out.${key}` ? fallback : hit
}
