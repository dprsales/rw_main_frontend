// No static fallback posts — an empty grid is more honest than fake placeholders.
export const BLOGS = []

export const HERO_COPY =
  '₹2,700 Cr generated. 15 years at the top of Hyderabad real estate.'

// The three services; each `title` is the positioning line, `kicker` is the plain name.
export const WAYS = [
  { k: 'I', kicker: 'Sales Coaching', title: 'Your ticket size is a ceiling you built. Break it.', line: 'For developers, senior sales leadership, and top sales closers done with volume games.', ctaLabel: 'Coaching', to: '/coaching' },
  { k: 'II', kicker: 'Sales Consulting', title: 'Right product, wrong velocity. That is fixable.', line: 'Advisory on the part of the business the brochure never fixes.', ctaLabel: 'Consulting', to: '/consulting' },
  { k: 'III', kicker: 'Sales Mandates', title: 'You build. We sell — end to end.', line: 'Full ownership of sales strategy, a dedicated onsite team, and end-to-end funnel management.', ctaLabel: 'Realty', to: '/realty' },
]

export const HOME_TESTIMONIALS = [
  { text: 'Rajiv negotiates like the asset is his own — his deep understanding of local market dynamics gave us a very good perspective on the opportunities in Hyderabad.', name: 'SANDEEP KYLAS' },
  { text: 'He always says, "do it with your passion and heart or else don’t do it." Having a mentor like him makes you sharper on tasks, skills, focus and life.', name: 'MALLAREDDY PUTLURI' },
  { text: 'His expertise and guidance were instrumental in my professional growth — the best mentor I have come across.', name: 'MOHAMMED SHIRAZ' },
]

export const MARQUEE_ITEMS = [
  'TGRERA registered realtor',
  "Member — HRA, NAR",
  '₹2,700 Cr+ generated',
  '15+ years at the top',
]

// List order = display order (numbers and connector arrows run 1→6).
export const ACHIEVE = [
  { title: 'Increase Sales Revenue', body: 'Move from inconsistent wins to structured, repeatable conversions backed by a clear sales framework.' },
  { title: 'Strengthen Cash Flow & Margins', body: 'Position your product or service with authority so pricing becomes a decision, not a negotiation.' },
  { title: 'Build High Value Clientele', body: 'Learn how to handle premium buyers with clarity, control, and long-term relationship thinking.' },
  { title: 'Operate With Authority', body: 'Develop the confidence, communication discipline, and positioning required to lead in competitive markets.' },
  { title: 'Master Sales Psychology', body: 'Understand how decision-makers think at higher ticket sizes and adapt conversations accordingly.' },
  { title: 'Eliminate Revenue Leaks', body: 'Identify where deals slow down or break and install systems that prevent loss of momentum.' },
]

export const COACHING_PROGRAMS = [
  {
    title: 'The Cohort', subtitle: '(FORMAT 01 · TWELVE WEEKS · SMALL ROOM)',
    description: 'Twelve weeks, small room, live deals on the table. You bring your pipeline; it becomes the syllabus. Nothing theoretical survives the first session.',
    features: ['Outcome: your first high-value closing, inside the program.'],
  },
  {
    title: 'Team Training', subtitle: '(FORMAT 02 · DEVELOPER SALES TEAMS & LEADERSHIP)',
    description: 'For developer sales teams and their leadership. Rajiv rebuilds the sales conversation your team is actually having — scripts, sequencing, and the discipline between calls.',
    features: ['Outcome: a team that qualifies harder and closes higher.'],
  },
  {
    title: 'One-to-One', subtitle: '(FORMAT 03 · SIX MONTHS · BY APPLICATION)',
    description: 'Six months, by application only. A working partnership on your actual book of business. Few seats a year, because Rajiv is still in the market himself.',
    features: ['Outcome: a repositioned practice, not a certificate.'],
  },
]

export const COACHING_TESTIMONIALS = [
  { text: 'Working with Mr. Rajiv Williams is a constant learning experience. He always says, "do it with your passion and heart or else don’t do it." Having a mentor like him makes you perfect in terms of tasks, learning, and focus.', name: 'MALLAREDDY PUTLURI' },
  { text: 'I had the pleasure of being mentored by Mr. Rajiv Williams in developing my interpersonal skills. He pushed me to expand my skills and always made time to offer support. By far the best mentor I have come across.', name: 'MOHAMMED SHIRAZ' },
]

// Pain point and solution paired per row, instead of two separate lists.
export const DEVELOPER_SHIFTS = [
  { n: '01', from: 'Random conversions', to: 'Strategic Sales Architecture', note: 'A defined architecture replaces guesswork.' },
  { n: '02', from: 'Discount-driven closures', to: 'Conversion-First Execution', note: 'Value holds the price, not the discount.' },
  { n: '03', from: 'Team dependency', to: 'Channel & Team Alignment', note: 'The system performs, not just the star closer.' },
  { n: '04', from: 'Poor visibility', to: 'Data-Led Growth & Visibility', note: 'Every stage of the pipeline is measurable.' },
]

// Consulting framework, four phases in the order an engagement runs.
export const ECOSYSTEM = [
  {
    phase: '1', title: 'Audit & Discovery',
    line: 'We map what exists — the process, the tech, the team, the journey — and find where performance leaks.',
    points: [
      'Sales process audit & operational review',
      'CRM, reporting structure & technology assessment',
      'Team capability mapping & gap analysis',
      'Go-to-market strategy & positioning review',
      'Customer journey, site visit & experience evaluation',
    ],
  },
  {
    phase: '2', title: 'Process Design',
    line: 'We design the systems that were missing: strategy, conversion, pipeline, and documented SOPs.',
    points: [
      'End-to-end sales strategy framework design',
      'HNI & Ultra-HNI conversion systems',
      'Lead generation, follow-up & tracking structures',
      'Pipeline visibility & sales forecasting frameworks',
      'SOP creation, process documentation & workflow structuring',
    ],
  },
  {
    phase: '3', title: 'Implementation & Deployment',
    line: 'We deploy the systems into daily operation — CRM, automation, team onboarding, and site experience.',
    points: [
      'CRM setup, onboarding & dashboard integration',
      'Workflow automation & operational process deployment',
      'Team onboarding & execution alignment',
      'HR, HRMS & performance tracking structure',
      'Site experience choreography & customer engagement systems',
    ],
  },
  {
    phase: '4', title: 'Refinement & Scale',
    line: 'We tune against live sales data and align leadership so performance compounds.',
    points: [
      'KPI tracking, review systems & performance analysis',
      'Process refinement through live sales data',
      'Leadership alignment & workforce optimization',
      'Brand narrative, market perception & positioning enhancement',
    ],
  },
]

// "& More" — extra support services, from the brochure's list.
export const SUPPORT_SERVICES = [
  { title: 'Social Media & Brand Presence', desc: 'Built to improve visibility, positioning, and long-term market recall.' },
  { title: 'Performance Marketing', desc: 'Campaigns engineered for reach, lead generation, and qualified conversions.' },
  { title: 'Media & PR Collaborations', desc: 'Strategic visibility partnerships and media collaborations — including platforms like Happening Hyderabad — to strengthen brand reach and market presence.' },
  { title: 'Organic Video Marketing', desc: 'Content designed to improve engagement, trust, and brand perception.' },
  { title: 'Podcasts & Authority Building', desc: 'Positioning founders and leadership voices with stronger market credibility.' },
  { title: 'Channel Partner Networking', desc: 'Broker ecosystem activation, designed to accelerate market movement.' },
  { title: 'Vendor Management', desc: 'Reliable execution enabled through trusted partner ecosystems.' },
  { title: 'Sales Hiring', desc: 'Capability-focused recruitment for high-performance sales environments.' },
  { title: 'Workforce Structuring', desc: 'Operational alignment built for scalable and efficient growth.' },
  { title: 'Brand Positioning & Market Narratives', desc: 'Crafting perception, differentiation, and premium market identity.' },
]

// What an exclusive sales mandate covers, from the brochure's inclusions.
export const MANDATE_SCOPE = [
  { n: '01', title: 'Full ownership of sales strategy, positioning & execution' },
  { n: '02', title: 'A trained, dedicated sales team deployed onsite' },
  { n: '03', title: 'End-to-end funnel management — leads to closure' },
  { n: '04', title: 'Pricing strategy & deal structuring' },
  { n: '05', title: 'High-ticket negotiation support & deal intervention' },
  { n: '06', title: 'Site visit design & conversion optimisation' },
  { n: '07', title: 'CRM setup, management & daily reporting' },
  { n: '08', title: 'Market narrative & perception building with HNI & NRI segments' },
]

// Organisations worked with; names/order follow the client-supplied logo sheet.
export const ORGANISATIONS_WORKED = [
  'Vamsiram', 'Vamsiram Homes', 'The Cascades Neopolis', 'The Trilight', 'Sri Aditya',
  'Blue Fin Realty', 'Tribhuja', 'Candeur Constructions', 'IRA', 'Manbhum',
 'Zuari Infraworld', 'Landmark Group', 'Suchirindia', 'Kolla',
  'Nesta Developers', 'Tejase Developers', 'Haneesh Constructions', 'Vibrant Developers', 'Anantha Projects',
  'Avani', 'Gangothri', 'Identity', 'Rohas Ventures', 'CSK Builders & Developers',
  'Mirai Infracon', 'e-Infra',
]

// Full testimonial wall; `highlight: true` marks lines pulled out large.
export const PORTFOLIO_TESTIMONIALS = [
  { text: "His 'Luxury Sales Mastery' framework is a game-changer — it shifts the focus from chasing the lead to commanding the room, with psychological precision and consultative grace. The result? A massive boost in my conversion rates.", name: 'AMARJEET JAT', role: 'AGM Sales & Hospitality, Moonglade', highlight: true },
  { text: 'Rajiv is exceptional in what he does and consistently goes above and beyond to deliver outstanding results and ensure the success of the projects. I wholeheartedly recommend him.', name: 'SUMANTH REDDY', role: 'Chairman, NAR India', highlight: true },
  { text: "I couldn't have asked for a better advisor. Rajiv's deep understanding of the local market dynamics gave us a very good perspective on the opportunities in Hyderabad.", name: 'SANDEEP KYLAS', role: 'VP, Fintech & Payments, Zenoti · Ex-Amazon', highlight: true },
  { text: 'His ability to streamline systems, build effective strategies, and guide teams with clarity makes a significant impact on organizational success — especially in consultative selling and process-driven execution.', name: 'ARUN KUMAR ADGAPURAM', role: 'Head of Direct Sales, Zuari Infra' },
  { text: "Rajiv's expertise in the luxury real estate market is unparalleled. His ability to connect with clients uniquely, tailoring his approach to their mindset, is truly remarkable.", name: 'CHAKRAVARDHAN REDDY KESARI', role: 'Data Engineering Lead' },
  { text: 'He taught us how to connect with each client uniquely, tailoring our approach based on their background, needs and mindset. His guidance helped us build trust and long-term relationships.', name: 'SHRUTI SHARMA', role: 'Legal Consultant · Real Estate & REIT Compliance' },
  { text: 'He always says, "do it with your passion and heart or else don’t do it." His dedication inspires everyone to give our best. Having a mentor like him makes you perfect in tasks, learning and focus.', name: 'MALLAREDDY PUTLURI', role: 'Sr. Sales Manager, Raghava' },
  { text: "Need market insights? He's got them. Have a real estate query at midnight? Don't be surprised if he replies in seconds. He simplifies things and always delivers with speed and clarity.", name: 'ARUN K GATTU', role: 'VP, Sales & Marketing' },
  { text: 'A professional with a deep understanding of the business and a continuous learner. Very good at relationship management, time and task management, and structured case analysis.', name: 'PRASAD KLNV', role: 'Business Consultant · 25+ Years in Sales & Operations' },
  { text: 'He has an exceptional ability to inspire and motivate. His insights in high-ticket real estate sales are invaluable, and his guidance helped me tackle complex challenges with confidence.', name: 'SUMANA SOUJANYA UNDETI', role: 'Assistant Manager, Sales' },
  { text: 'His expertise and guidance were instrumental in my professional growth — he pushed me to expand my skills and always made time to offer support. By far the best mentor I have come across.', name: 'MOHAMMED SHIRAZ', role: 'Sales & Strategic Management · 14 Years' },
]

// Team Rajiv Williams. No headshots yet — ImageSlot shows a placeholder until `src` is set.
// Roles left blank on purpose; add a `role` string and the card picks it up automatically.
export const TEAM = [
  { name: 'Priyanka Panda', src: undefined },
  { name: 'Sridevi Vinjimur', src: undefined },
  { name: 'Asra Fathima', src: undefined },
  { name: 'Soma Sekhar', src: undefined },
]

// TEAM mapped to ChromaGrid's shape; every card uses the same gold accent, on-brand.
export const TEAM_CHROMA = TEAM.map((member) => ({
  image: member.src,
  title: member.name,
  subtitle: member.role || 'Team Rajiv Williams',
  borderColor: '#C39B53',
  gradient: 'linear-gradient(165deg, rgba(195,155,83,.22), #0B0A09 62%)',
}))

export const CREDENTIALS =['TGRERA Registered', "Member, Hyderabad Realtors' Association", '130+ written recommendations', 'Founder - Design Sharks, Happening hyderabad']

// Careers — copy for /careers.

// Deliberately four reasons, so the grid reads as two even rows at every breakpoint.
export const CAREER_REASONS = [
  { title: 'Premium inventory only', body: 'You sell what the market already respects — luxury and high-ticket projects carried on exclusive mandates, not a scattered listing sheet.' },
  { title: 'Trained, not thrown in', body: 'The coaching practice runs in-house first. Every person on the floor is taken through the same frameworks Rajiv runs with developer sales teams.' },
  { title: 'Earnings without a ceiling', body: 'A fixed base plus an incentive structure written against closings. Higher ticket sizes mean the same effort is worth more.' },
  { title: 'Access to the top of the market', body: 'HNI and NRI buyers, developer leadership, and channel networks — in the room, from your first quarter.' },
]

// Statement band under the intro; kept here so the claim is edited in one place.
export const CAREER_HOOK = {
  lead: 'We don’t hire employees.',
  accent: 'We build closers who become the market.',
}

// Life on the floor — the full-bleed culture band.
export const CAREER_CULTURE = {
  eyebrow: 'THE FLOOR',
  title: 'A culture of standards, not slogans.',
  body: 'Mornings are pipeline review, afternoons are site visits, and the deals that matter are worked jointly. Nobody is left alone with a negotiation they have not been prepared for.',
  cta: 'See how the floor runs',
}

// Role filters; `All` is prepended by the page. Values must match a role's `category` below.
export const CAREER_CATEGORIES = ['Sales', 'Business Development', 'Client Relations', 'Operations']

// Open roles; an empty array renders the "no openings" state.
export const CAREER_ROLES = [
  {
    title: 'Senior Sales Consultant',
    type: 'FULL-TIME · HYDERABAD',
    category: 'Sales',
    level: 'Senior level',
    experience: '3–6 years',
    location: 'Hyderabad',
    description: 'Own high-ticket conversations end to end — qualification, site visits, negotiation, closure — on live luxury mandates.',
    requirements: ['3+ years selling residential or commercial real estate', 'A closing record you can walk through deal by deal', 'Comfort with HNI and NRI buyers'],
  },
  {
    title: 'Marketing & Content Associate',
    type: 'FULL-TIME · HYDERABAD',
    category: 'Business Development',
    level: 'Mid level',
    experience: '2–4 years',
    location: 'Hyderabad',
    description: 'Run the campaign and content engine behind the mandates — performance marketing, project films, and brand presence.',
    requirements: ['2+ years in performance or brand marketing', 'Hands-on with Meta and Google campaign managers', 'An eye for premium visual craft'],
  },
  {
    title: 'Client Relations Executive',
    type: 'FULL-TIME · HYDERABAD',
    category: 'Client Relations',
    level: 'Entry level',
    experience: '1–3 years',
    location: 'Hyderabad',
    description: 'Hold the CRM, the follow-up discipline, and the buyer experience between first enquiry and registration.',
    requirements: ['1+ year in CRM, pre-sales or client servicing', 'Written and spoken fluency in English, Telugu and Hindi', 'Precision with records and reporting'],
  },
  {
    title: 'Brand & Account Manager',
    type: 'FULL-TIME · HYDERABAD',
    category: 'Business Development',
    level: 'Mid level',
    experience: '3–6 years',
    location: 'Hyderabad',
    description: 'Own brand relationships, campaign delivery, and account growth across premium real estate mandates.',
    requirements: ['Experience managing brand or client accounts', 'Strong campaign coordination and communication', 'Confidence presenting work to stakeholders'],
  },
  {
    title: 'Human Resources',
    type: 'FULL-TIME · HYDERABAD',
    category: 'Client Relations',
    level: 'Mid level',
    experience: '2–5 years',
    location: 'Hyderabad',
    description: 'Build a dependable employee experience across hiring, onboarding, people operations, and team culture.',
    requirements: ['Experience across HR operations and recruitment', 'Strong communication and discretion', 'Careful handling of people processes'],
  },
  {
    title: 'Accounts & Finance Executive',
    type: 'FULL-TIME · HYDERABAD',
    category: 'Operations',
    level: 'Mid level',
    experience: '2–5 years',
    location: 'Hyderabad',
    description: 'Keep the commercial engine precise through disciplined reporting, reconciliations, payables, and financial coordination.',
    requirements: ['Experience in accounts or finance operations', 'Comfort with reconciliations, reporting, and documentation', 'Strong attention to detail and confidentiality'],
  },
  {
    title: 'Web Developer',
    type: 'FULL-TIME · HYDERABAD',
    category: 'Business Development',
    level: 'Mid level',
    experience: '2–5 years',
    location: 'Hyderabad',
    description: 'Build and improve the digital experiences that bring our projects, services, and brand to life online.',
    requirements: ['Experience with modern frontend development', 'Strong eye for responsive visual detail', 'Comfort working with APIs and content systems'],
  },
  {
    title: 'Graphic Designer',
    type: 'FULL-TIME · HYDERABAD',
    category: 'Business Development',
    level: 'Mid level',
    experience: '2–5 years',
    location: 'Hyderabad',
    description: 'Create the visual language for project launches, social content, presentations, and the brand system.',
    requirements: ['Strong portfolio across digital and print design', 'Confidence with common design tools', 'An eye for premium visual craft'],
  },
  {
    title: 'Motion Graphic Designer',
    type: 'FULL-TIME · HYDERABAD',
    category: 'Business Development',
    level: 'Mid level',
    experience: '2–5 years',
    location: 'Hyderabad',
    description: 'Turn project stories and brand campaigns into polished motion content for digital channels and launches.',
    requirements: ['Portfolio of motion or video work', 'Strong command of animation and editing tools', 'Good sense of timing, composition, and sound'],
  },
  {
    title: 'Content Strategist',
    type: 'FULL-TIME · HYDERABAD',
    category: 'Business Development',
    level: 'Mid level',
    experience: '3–6 years',
    location: 'Hyderabad',
    description: 'Plan the content engine across project narratives, campaigns, social channels, and brand communications.',
    requirements: ['Experience building content strategies', 'Strong editorial and research skills', 'Portfolio showing clear content outcomes'],
  },
  {
    title: 'SEO Specialist',
    type: 'FULL-TIME · HYDERABAD',
    category: 'Marketing',
    level: 'Mid level',
    experience: '2–5 years',
    location: 'Hyderabad',
    description: 'Grow qualified discovery through technical SEO, content optimisation, and measurable search performance.',
    requirements: ['Hands-on technical and on-page SEO experience', 'Comfort with analytics and search tools', 'Ability to turn data into clear actions'],
  },
  {
    title: 'Senior Sales Executive',
    type: 'FULL-TIME · HYDERABAD',
    category: 'Sales',
    level: 'Senior level',
    experience: '3–6 years',
    location: 'Hyderabad',
    description: 'Lead high-ticket buyer conversations from qualification through negotiation and closure on luxury mandates.',
    requirements: ['Track record in residential or commercial real estate sales', 'Strong closing and negotiation skills', 'Comfort with HNI and NRI buyers'],
  },
]

// The hiring process, stated plainly for candidates.
export const CAREER_PROCESS = [
  { n: '01', title: 'Application', body: 'Send your profile with the role named. Every application is read.' },
  { n: '02', title: 'Screening call', body: 'A twenty-minute conversation on your record and what you want next.' },
  { n: '03', title: 'Working session', body: 'A live pitch or a real scenario from the floor. We watch how you think.' },
  { n: '04', title: 'Offer & onboarding', body: 'Terms, incentive structure, and a two-week induction into the frameworks.' },
]

// Résumé data — carried over from the previous site's Resume page.

// `location` dropped since every role is Hyderabad-based. `phase` groups roles per EXPERIENCE_PHASES.
export const EXPERIENCE = [
  { company: 'Rajiv Williams — Luxury Sales Mastery', role: 'Luxury Sales Mentor · Coach & Consultant', phase: 'practice', current: true },
  { company: 'Dezign Shark', role: 'Business Owner', phase: 'practice' },
  { company: 'Tejase Developers', role: 'Sales Mentor', phase: 'advisory' },
  { company: 'IRA Realty India', role: 'Sales & Marketing Mentor', phase: 'advisory' },
  { company: 'TAR Group', role: 'Organizational Mentor', phase: 'advisory' },
  { company: 'Suchirindia', role: 'Business Mentor', phase: 'advisory' },
  { company: 'Ornate Interiors', role: 'Strategic Partner', phase: 'advisory' },
  { company: 'Landmark Group India', role: 'Organizational Mentor', phase: 'advisory' },
  { company: 'Avani Projects', role: 'Strategic Partner', phase: 'advisory' },
  { company: 'Magnifiq Properties', role: 'Strategic Partner', phase: 'advisory' },
  { company: 'PVR Developers India', role: 'Director — Sales, Marketing & Business Development', phase: 'leadership' },
  { company: 'Systel', role: 'Operations & Client Relations Manager', phase: 'foundations' },
  { company: 'Dell', role: 'Sr. Process Executive', phase: 'foundations' },
]

// Four stages of the track, most recent first. `dense` renders a compact grid.
export const EXPERIENCE_PHASES = [
  { key: 'practice', label: 'The practice today', note: 'Independent mentoring & mandate work' },
  { key: 'advisory', label: 'Mentoring & advisory', note: 'Retained across eight developer and design businesses', dense: true },
  { key: 'leadership', label: 'Developer sales leadership', note: 'Owning the number, not advising on it' },
  { key: 'foundations', label: 'Enterprise foundations', note: 'Where the process discipline came from' },
]

export const ASSOCIATIONS = [
  { name: 'Hyderabad Realtors Association', role: 'Member' },
  { name: 'National Association of Realtors — India', role: 'Member' },
  { name: 'Design Sharks', role: 'Founder' },
  { name: 'Happening Hyderabad', role: 'Founder', desc: "Curated community of GCC around 86,000+ of active followers", href: 'https://www.linkedin.com/company/hyderabad1st/' },
]

// Project portfolio — luxury inventory across Hyderabad.

// Territory map: x/y are percentages on a 100x100 canvas, schematic only (not real coordinates).
export const LOCALITIES = [
  { name: 'Shankarpally', x: 6, y: 26 },
  { name: 'Mokila', x: 19, y: 36 },
  { name: 'Kollur', x: 30, y: 10 },
  { name: 'Neopolis', x: 34, y: 27 },
  { name: 'Gandipet', x: 31, y: 52 },
  { name: 'Kokapet', x: 44, y: 41 },
  { name: 'Manchirevula', x: 43, y: 58 },
  { name: 'Raidurgam', x: 50, y: 16 },
  { name: 'Narsingi', x: 57, y: 49 },
  { name: 'Financial District', x: 56, y: 31 },
  { name: 'Puppalaguda', x: 68, y: 41 },
  { name: 'HITEC City', x: 64, y: 8 },
  { name: 'Shaikpet', x: 76, y: 22 },
  { name: 'TGSPA Junction', x: 58, y: 68 },
  { name: 'APPA Junction', x: 73, y: 58 },
  { name: 'Tukkuguda', x: 90, y: 74 },
  { name: 'Mamidipally', x: 76, y: 84 },
]

// Collapses sub-localities and alternate spellings down to one map node per real place.
export const AREA_TO_LOCALITY = {
  'Kokapet': 'Kokapet',
  'Golden Mile, Kokapet': 'Kokapet',
  'Neopolis': 'Neopolis',
  'Neopolis, Kokapet': 'Neopolis',
  'Financial District': 'Financial District',
  'Narsingi, Financial District': 'Narsingi',
  'Raidurg — Gachibowli': 'Raidurgam',
  'Raidurgam': 'Raidurgam',
  'Green Hills Road, HITEC City': 'HITEC City',
  'Shaikpet': 'Shaikpet',
  'Kollur': 'Kollur',
  'Mokila': 'Mokila',
  'Manchirevula': 'Manchirevula',
  'Gandipet': 'Gandipet',
  'Puppalaguda': 'Puppalaguda',
  'Shankarpally': 'Shankarpally',
  'APPA Junction': 'APPA Junction',
  'TGSPA Junction': 'TGSPA Junction',
  'Tukkuguda': 'Tukkuguda',
  'Mamidipally': 'Mamidipally',
}

export const PROJECTS = [
  { name: 'Acasa', area: 'Kokapet', status: 'Active' },
  { name: 'Amaris', area: 'Financial District', status: 'Active' },
  { name: 'Promenade Villas', area: 'Kollur', status: 'Active' },
  { name: 'Aparna One', area: 'Shaikpet', status: 'Active' },
  { name: 'Niche', area: 'Shaikpet', status: 'Active' },
  { name: 'Palatium', area: 'APPA Junction', status: 'Ready for Interiors' },
  { name: 'Rainbow Waters', area: 'Raidurg — Gachibowli', status: 'Under Construction' },
  { name: 'Megaleio', area: 'TGSPA Junction', status: 'Under Construction' },
  { name: 'Villa Verde', area: 'Green Hills Road, HITEC City', status: 'Mandate' },
  { name: 'MSN One', area: 'Neopolis', status: 'Mandate' },
  { name: 'Skymarq', area: 'Narsingi, Financial District', status: 'Mandate' },
  { name: 'CINQ', area: 'Financial District', status: 'Mandate' },
  { name: 'Sylvanor', area: 'Mokila', status: 'Mandate' },
  { name: 'Iris', area: 'Raidurgam', status: 'Under Construction' },
  { name: 'Trilight', area: 'Golden Mile, Kokapet', status: 'Mandate' },
  { name: 'Skyline', area: 'Financial District', status: 'Under Construction' },
  { name: 'Songs of the Sun', area: 'Financial District', status: 'Under Construction' },
  { name: 'Rise With 9', area: 'Neopolis', status: 'Under Construction' },
  { name: 'Bayleaf', area: 'Manchirevula', status: 'Under Construction' },
  { name: 'Yula Globus', area: 'Neopolis, Kokapet', status: 'Under Construction' },
  { name: 'Sage', area: 'Kollur', status: 'Mandate' },
  { name: 'Bridge Epsilon', area: 'Tukkuguda', status: 'Mandate' },
  { name: 'Allura', area: 'Kokapet', status: 'Mandate' },
  { name: 'Luxury Park II', area: 'Mamidipally', status: 'Mandate' },
  { name: 'ONE OAK', area: 'Manchirevula', status: 'Mandate' },
  { name: 'The Twins', area: 'Puppalaguda', status: 'Mandate' },
  { name: 'Ankura Homes', area: 'Shankarpally', status: 'Mandate' },
  { name: 'Som Boulevard', area: 'Mokila', status: 'Mandate' },
  { name: 'Cascades', area: 'Kokapet', status: 'Mandate' },
  { name: 'Bliss in the Woods', area: 'Kokapet', status: 'Mandate' },
  { name: 'Mirai Mist', area: 'Gandipet', status: 'Mandate' },
]
