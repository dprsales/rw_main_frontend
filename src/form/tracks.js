/** The three assessment questionnaires behind /form. Question types: pill, check, input, text. */
const CONTACT_QUESTIONS = [
  { id: 'name', type: 'input', inputType: 'text', required: true, title: 'Your full name', placeholder: 'Full name' },
  { id: 'phone', type: 'input', inputType: 'tel', required: true, title: 'Phone number', placeholder: '+91 98765 43210' },
  { id: 'email', type: 'input', inputType: 'email', required: true, title: 'Email address', placeholder: 'you@company.com' },
]

export const ASSESSMENT_TRACKS = {
  coaching: {
    key: 'coaching',
    numeral: 'I',
    label: 'Coaching',
    cardTitle: 'Sales Mastery Coaching',
    cardBody: 'Personalised coaching to sharpen closing skills, build a high-performing team, and grow into luxury real estate sales.',
    cardCta: 'Begin coaching assessment',
    intro: {
      eyebrow: 'RAJIV WILLIAMS COACHING',
      title: 'Welcome to Rajiv Williams Coaching',
      thanks: 'Thank you for choosing Rajiv Williams.',
      lines: [
        'We would like to understand your business, your current challenges, and your goals a little more in detail.',
        'Your responses help us prepare a programme tailored to your situation.',
      ],
      time: 'About 2 minutes',
    },
    confirm: 'We will prepare a personalised coaching recommendation from your responses and be in touch shortly.',
    questions: [
      ...CONTACT_QUESTIONS,
      {
        id: 'role', type: 'pill', required: true,
        title: 'Which of the below best describes your role?',
        options: ['Builder / Developer', 'Sales Head', 'Sales Manager', 'Sales Executive', 'Channel Partner', 'Entrepreneur', 'Other'],
      },
      {
        id: 'experience', type: 'pill', required: true,
        title: 'How long have you been in the real estate industry?',
        options: ['Less than 1 year', '1–3 years', '3–5 years', 'More than 5 years'],
      },
      {
        id: 'projectType', type: 'pill', required: true,
        title: 'What type of projects are you selling?',
        options: ['Apartments', 'Villas', 'Plots', 'Commercial', 'Mixed projects'],
      },
      {
        id: 'challenges', type: 'check', required: true,
        title: 'What is the biggest challenge you are facing in your business?',
        help: 'Choose as many as apply.',
        options: ['Generating quality leads', 'Increasing site visits', 'Improving sales closures', 'Building a strong sales team', 'Handling customer objections', 'Negotiation', 'Follow-up process', 'CRM & automation', 'Other'],
      },
      {
        id: 'goal', type: 'pill', required: true,
        title: 'What would you like to achieve through Rajiv Williams Coaching?',
        options: ['Increase sales', 'Improve closing skills', 'Train my sales team', 'Grow my business', 'Become a better leader', 'Learn luxury real estate sales'],
      },
      {
        id: 'timeline', type: 'pill', required: true,
        title: 'How soon do you wish to get started?',
        options: ['Immediately', 'Within 7 days', 'This month', 'Just exploring'],
      },
      {
        id: 'notes', type: 'text', required: false,
        title: 'Anything specific you would like us to discuss in your coaching session?',
      },
    ],
  },

  consulting: {
    key: 'consulting',
    numeral: 'II',
    label: 'Consulting',
    cardTitle: 'Business & Sales Consulting',
    cardBody: 'Expert guidance on sales setup, branding, hiring, and process — tailored to where your business stands today.',
    cardCta: 'Begin consulting assessment',
    intro: {
      eyebrow: 'RAJIV WILLIAMS CONSULTING',
      title: 'Welcome to Rajiv Williams Consulting',
      thanks: 'Thank you for choosing Rajiv Williams Consulting.',
      lines: [
        'We would like to understand your business, your current challenges, and the areas where you are seeking expert guidance.',
      ],
      time: 'About 2 minutes',
    },
    confirm: 'We will review your business context and follow up to schedule your consulting session.',
    questions: [
      ...CONTACT_QUESTIONS,
      { id: 'orgName', type: 'input', inputType: 'text', required: true, title: 'Please state the name of your organisation' },
      {
        id: 'role', type: 'pill', required: true,
        title: 'What best describes your role?',
        options: ['Builder / Developer', 'Founder / Director', 'Entrepreneur / Owner'],
      },
      {
        id: 'businessStage', type: 'pill', required: true,
        title: 'Which stage is your business currently in?',
        options: ['Planning stage (RERA not received)', 'Project launch (RERA received)', 'Actively selling', 'Ready-to-move project', 'Business expansion'],
      },
      {
        id: 'servicesNeeded', type: 'check', required: true,
        title: 'Which consulting service are you looking for?',
        help: 'Choose as many as apply.',
        options: ['End-to-end sales setup', 'Branding & visibility', 'Sales team hiring', 'Sales process consulting', 'Business growth strategy', 'Not sure (need guidance)'],
      },
      {
        id: 'biggestChallenge', type: 'pill', required: true,
        title: 'What is your biggest challenge right now?',
        options: ['Setting up a sales team', 'Generating quality leads', 'Low sales conversion', 'Brand awareness', 'Hiring the right talent', 'Sales process & CRM', 'Scaling the business', 'Other'],
      },
      {
        id: 'challengeSeverity', type: 'pill', required: true,
        title: 'How severely is this challenge affecting your business?',
        options: ['Slightly', 'Moderately', 'Significantly', 'Critically'],
      },
      {
        id: 'primaryGoal', type: 'pill', required: true,
        title: 'What is your primary goal over the next 6–12 months?',
        options: ['Launch a new project', 'Increase sales', 'Build a high-performing sales team', 'Strengthen brand presence', 'Expand my business', 'Improve overall operations'],
      },
      {
        id: 'hasSalesTeam', type: 'pill', required: true,
        title: 'Do you currently have an in-house sales team?',
        options: ['Yes', 'No', 'In the process of hiring'],
      },
      {
        id: 'triedSolutions', type: 'pill', required: false,
        title: 'What have you already tried to overcome this challenge?',
        options: ['Internal training', 'External coach / consultant', 'Sales hiring', 'CRM / automation'],
      },
      {
        id: 'decisionMaker', type: 'pill', required: true,
        title: 'Who will be the final decision-maker for this engagement?',
        options: ['Myself', 'Founder / Managing Director', 'Partners', 'Sales Head', 'HR', 'Management team'],
      },
      {
        id: 'reachOutReason', type: 'pill', required: true,
        title: 'What made you reach out to Rajiv Williams today?',
        options: ['New project launch', 'Low sales performance', 'Team performance issues', 'Business expansion', 'Referral', 'Social media', 'Other'],
      },
      {
        id: 'investmentPlan', type: 'pill', required: true,
        title: 'Are you planning to invest in solving this challenge?',
        options: ['Yes, immediately', 'Within this month', 'In the next 2–3 months', 'Just exploring'],
      },
      { id: 'successLooksLike', type: 'text', required: false, title: 'What would success look like after working with Rajiv Williams?' },
      { id: 'notes', type: 'text', required: false, title: 'Anything specific our consultants should know before the meeting?' },
    ],
  },

  realty: {
    key: 'realty',
    numeral: 'III',
    label: 'Realty',
    cardTitle: 'RW Realty Services',
    cardBody: 'Hand us your project. We recommend and execute the right sales and marketing strategy to move your inventory.',
    cardCta: 'Begin realty assessment',
    intro: {
      eyebrow: 'RAJIV WILLIAMS REALTY SERVICES',
      title: 'Welcome to Rajiv Williams Realty Services',
      thanks: 'Thank you for reaching out to Rajiv Williams Realty Services.',
      lines: [
        'To help us understand your project and recommend the right sales and marketing strategy, please answer a few quick questions.',
      ],
      time: 'Under 2 minutes',
    },
    confirm: 'We will review your project details and follow up to schedule a consultation.',
    questions: [
      ...CONTACT_QUESTIONS,
      { id: 'orgName', type: 'input', inputType: 'text', required: true, title: 'Please state the name of your organisation' },
      { id: 'projectName', type: 'input', inputType: 'text', required: true, title: 'Please state the name of your project or venture' },
      { id: 'location', type: 'input', inputType: 'text', required: true, title: 'Where is your project located?', placeholder: 'e.g. Kokapet, Hyderabad' },
      { id: 'website', type: 'input', inputType: 'url', required: false, title: 'Do you have a website for your company or project?', placeholder: 'Paste the URL if you have one' },
      { id: 'socialLinks', type: 'text', required: false, title: 'Please share your social media profile links', placeholder: 'Instagram, LinkedIn, Facebook, YouTube…' },
      { id: 'unitsAvailable', type: 'input', inputType: 'text', required: true, title: 'Approximately how many units are currently available for sale?', placeholder: 'e.g. 45 units / 120 plots / 18 villas' },
      {
        id: 'objective', type: 'pill', required: true,
        title: 'What is your primary objective for partnering with RW Realty?',
        options: ['Sell existing inventory', 'Launch a new project', 'Improve sales performance', 'End-to-end sales mandate', 'Marketing support', 'Other'],
      },
      {
        id: 'projectStage', type: 'pill', required: true,
        title: 'What is the current stage of your project?',
        options: ['Pre-launch', 'Newly launched', 'Ongoing sales', 'Near completion', 'Ready to move', 'Completed inventory'],
      },
      {
        id: 'enquirySource', type: 'pill', required: false,
        title: 'Where do most of your enquiries currently come from?',
        options: ['Channel partners', 'Meta / Facebook', 'Google', 'Referrals', 'Walk-ins', 'Cold calling', 'Other'],
      },
      {
        id: 'finalizeTimeline', type: 'pill', required: false,
        title: 'When are you planning to finalise your sales / marketing partner?',
        options: ['Within 7 days', 'Within 15 days', 'Within 30 days', 'Within 3 months', 'Just exploring'],
      },
      {
        id: 'decisionMaker', type: 'pill', required: true,
        title: 'Who will be the final decision-maker for this engagement?',
        options: ['Myself', 'Founder / Managing Director', 'Director / Partner', 'Sales Head', 'Marketing Head', 'Management team', 'Other'],
      },
      {
        id: 'reasonNow', type: 'pill', required: true,
        title: 'Why are you looking for a sales and marketing partner now?',
        options: ['New project launch', 'Sales have slowed', 'Inventory is not moving', 'Existing agency is not delivering', 'Expanding sales team', 'Referral', 'Other'],
      },
      { id: 'notes', type: 'text', required: false, title: 'Anything else you would like us to know about your project?' },
    ],
  },
}

/** Landing order. Keyed rather than an array so a track can be linked directly. */
export const TRACK_ORDER = ['coaching', 'consulting', 'realty']
