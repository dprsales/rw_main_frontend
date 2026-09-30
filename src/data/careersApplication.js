/**
 * Content + scoring for the careers application's character section.
 *
 * Two parts, both required before Submit so the CRM always receives them:
 *  1. CHARACTER_QUESTIONS — short-answer prompts (≈300 chars) that force a concrete
 *     example rather than a generic self-description.
 *  2. HEXACO_TRAITS — a short HEXACO-style Likert self-assessment on a signed
 *     scale (-2..+2). Only the raw answers are collected here; the backend
 *     runs the HEXACO scoring to turn them into a 0–100% match per trait (+ overall).
 *     Those scores and their written read-back are for the hiring team and are
 *     shown in the admin panel, never to the applicant.
 */

export const ANSWER_MAX = 300

export const CHARACTER_QUESTIONS = [
  {
    id: 'qImpact',
    label: 'The biggest impact you made in your previous role',
    placeholder: 'What did you change, and what was the result? Use numbers where you can (revenue, conversion, time saved).',
    required: true,
  },
  {
    id: 'qDuties',
    label: 'Please list your main duties and responsibilities in your previous role',
    placeholder: 'Walk us through a normal working day in your most recent role, start to finish.',
    required: true,
  },
  {
    id: 'qMotivation',
    label: 'Why Team Rajiv Williams, and why this role now?',
    placeholder: 'What draws you to luxury real estate and to us specifically, and why this is the right move at this point in your career.',
    required: true,
  },
  {
    id: 'qIntegrity',
    label: 'A time you could have gained something by bending the truth and chose not to',
    placeholder: 'A moment you could have inflated a number, taken undue credit, or hidden a mistake. What did you do?',
    required: true,
  },
  {
    id: 'qSetback',
    label: 'A target or deal you missed, and what you did differently afterwards',
    placeholder: 'What went wrong, how you responded, and the change you made. We read this for honesty and learning, not perfection.',
    required: false,
  },
  {
    id: 'qLoyalty',
    label: 'What keeps you with an employer long-term, and why you are moving on now',
    placeholder: 'Be honest about what makes you stay, what would make you leave, and your reason for the current move.',
    required: false,
  },
  {
    id: 'qFlexibility',
    label: 'A time your plans or team changed with little warning, and how you adapted',
    placeholder: 'What changed, how you responded, and the outcome.',
    required: false,
  },
]

/* Signed scale, neutral at 0. Reverse-scored items are negated (not `6 − a`),
 * so the raw answer already carries direction. Kept symmetric so it maps cleanly
 * onto a 0–100% trait match. All scoring runs on the backend from the raw
 * answers — nothing is scored in the browser, so the applicant never sees a
 * result and cannot influence the stored one. */
export const LIKERT_MIN = -2
export const LIKERT_MAX = 2
export const LIKERT = [
  { v: -2, label: 'Strongly disagree' },
  { v: -1, label: 'Disagree' },
  { v: 0, label: 'Neutral' },
  { v: 1, label: 'Agree' },
  { v: 2, label: 'Strongly agree' },
]

/** Button face for a scale point: "+2", "+1", "0", "-1", "-2". */
export const likertLabel = (v) => (v > 0 ? `+${v}` : String(v))

/** `reverse: true` statements are negated when scored, so agreeing with everything
 * doesn't inflate the trait — it forces the answers to be internally consistent. */
export const HEXACO_TRAITS = [
  {
    key: 'Integrity',
    field: 'hexacoIntegrity',
    statements: [
      { id: 'int1', text: "I would never take credit for work that wasn't mine, even if no one would find out." },
      { id: 'int2', text: 'If a payout or report had an error in my favour, I would flag it.' },
      { id: 'int3', text: 'Bending the rules a little is fine if it helps hit a target.', reverse: true },
    ],
  },
  {
    key: 'Loyalty',
    field: 'hexacoLoyalty',
    statements: [
      { id: 'loy1', text: 'I stay committed to an employer even when a slightly better offer appears.' },
      { id: 'loy2', text: 'I finish what I start, even when the work stops being exciting.' },
      { id: 'loy3', text: 'If I am unhappy at work, I would rather leave quietly than raise it and try to fix it.', reverse: true },
    ],
  },
  {
    key: 'Flexibility',
    field: 'hexacoFlexibility',
    statements: [
      { id: 'flex1', text: 'I stay calm and effective when priorities change at short notice.' },
      { id: 'flex2', text: 'I am comfortable taking on tasks outside my job description.' },
      { id: 'flex3', text: 'I prefer a fixed routine and dislike sudden changes to my plans.', reverse: true },
    ],
  },
  {
    key: 'Mindset',
    field: 'hexacoMindset',
    statements: [
      { id: 'mind1', text: 'I actively seek out feedback, even when it is uncomfortable to hear.' },
      { id: 'mind2', text: 'When something goes wrong, I focus on what I can change instead of who is to blame.' },
      { id: 'mind3', text: 'I avoid new challenges unless I already know how to do them well.', reverse: true },
    ],
  },
]

/** Flat list of every statement id, for "have all been answered" checks. */
export const HEXACO_STATEMENT_IDS = HEXACO_TRAITS.flatMap((t) => t.statements.map((s) => s.id))
