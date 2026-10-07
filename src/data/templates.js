/** Operational sheets for a channel partner, broker, or advisory desk.
 *  Grouped by the deal, from the first enquiry to compliance.
 *  Cards are filled on the page. No file URL is published here.
 *  Do not add fields for PAN, Aadhaar, GSTIN, or uploaded proofs. */

export const TEMPLATE_PACKS = [
  'Lead intake',
  'Builder relations',
  'Inventory & mandates',
  'Deal closing',
  'Compliance',
]

export const TEMPLATES = [
  { id: 'client-requirement', pack: 'Lead intake', title: 'Client requirement form', description: 'Budget, preferred area, configuration, timeline, funding, and whether the home is for use or investment.', fields: [
    { name: 'budget', label: 'Budget' },
    { name: 'area', label: 'Preferred area' },
    { name: 'configuration', label: 'Configuration' },
    { name: 'timeline', label: 'Timeline' },
    { name: 'funding', label: 'Funding source' },
    { name: 'purpose', label: 'End-use or investment' },
  ] },
  { id: 'lead-qualification', pack: 'Lead intake', title: 'Lead qualification matrix', description: 'Buyer readiness on budget, authority, need, and timeline, so the day’s follow-ups are in order.', fields: [
    { name: 'budget', label: 'Budget' },
    { name: 'authority', label: 'Authority' },
    { name: 'need', label: 'Need' },
    { name: 'timeline', label: 'Timeline' },
    { name: 'notes', label: 'Priority note' },
  ] },
  { id: 'call-tracker', pack: 'Lead intake', title: 'Daily call tracker', description: 'Call notes, the site visit, the objection, and the next time you will reach them.', fields: [
    { name: 'client', label: 'Client' },
    { name: 'callNote', label: 'Call note' },
    { name: 'visit', label: 'Site visit' },
    { name: 'objection', label: 'Objection' },
    { name: 'nextTouch', label: 'Next touch' },
  ] },

  { id: 'cp-registration', pack: 'Builder relations', title: 'Channel partner registration', description: 'The form a developer asks before you sell for them. The full sheet also carries the firm’s RERA, GST, and PAN.', fields: [
    { name: 'firm', label: 'Firm' },
    { name: 'city', label: 'City' },
    { name: 'developer', label: 'Developer or project' },
    { name: 'contactPerson', label: 'Contact person' },
  ] },
  { id: 'lead-tagging', pack: 'Builder relations', title: 'Site visit tagging slip', description: 'Submitted to the builder before the visit, so the buyer stays on your name and the brokerage stays yours.', fields: [
    { name: 'project', label: 'Project' },
    { name: 'buyer', label: 'Buyer name' },
    { name: 'visitDate', label: 'Visit date' },
    { name: 'firm', label: 'Broker firm' },
  ] },
  { id: 'eoi', pack: 'Builder relations', title: 'Expression of interest', description: 'For a pre-launch or a priority booking. The unit is held against a refundable token.', fields: [
    { name: 'project', label: 'Project' },
    { name: 'unit', label: 'Unit or configuration' },
    { name: 'buyer', label: 'Buyer name' },
    { name: 'token', label: 'Token amount' },
  ] },
  { id: 'commission-invoice', pack: 'Builder relations', title: 'Commission claim invoice', description: 'The claim a developer pays against: slab, and how much falls due on booking and on agreement.', fields: [
    { name: 'project', label: 'Project' },
    { name: 'unit', label: 'Unit' },
    { name: 'slab', label: 'Slab' },
    { name: 'milestone', label: 'Payment milestone' },
    { name: 'amount', label: 'Amount' },
  ] },

  { id: 'listing-agreement', pack: 'Inventory & mandates', title: 'Exclusive listing agreement', description: 'The owner authorises the listing: minimum price, lock-in, and the commission.', fields: [
    { name: 'property', label: 'Property' },
    { name: 'owner', label: 'Owner' },
    { name: 'minimumPrice', label: 'Minimum price' },
    { name: 'lockIn', label: 'Lock-in' },
    { name: 'commission', label: 'Commission' },
  ] },
  { id: 'property-intake', pack: 'Inventory & mandates', title: 'Property intake checklist', description: 'Configuration, carpet and built-up area, age, facing, amenities, and what is known about title, loan, and maintenance.', fields: [
    { name: 'property', label: 'Property' },
    { name: 'configuration', label: 'Configuration' },
    { name: 'area', label: 'Carpet and built-up area' },
    { name: 'age', label: 'Age' },
    { name: 'facing', label: 'Facing' },
    { name: 'notes', label: 'Title, loan, and maintenance' },
  ] },
  { id: 'lease-screening', pack: 'Inventory & mandates', title: 'Lease and tenant screening', description: 'For a rental: who the tenant is, where they work, and the lease they are asking for.', fields: [
    { name: 'property', label: 'Property' },
    { name: 'tenant', label: 'Tenant name' },
    { name: 'employment', label: 'Employment' },
    { name: 'leaseTerm', label: 'Lease term' },
  ] },

  { id: 'visit-feedback', pack: 'Deal closing', title: 'Site visit feedback', description: 'What the buyer thought after the visit: the unit, the price, and what they still want.', fields: [
    { name: 'project', label: 'Project' },
    { name: 'unit', label: 'Unit' },
    { name: 'impression', label: 'Impression' },
    { name: 'price', label: 'Price feedback' },
    { name: 'preference', label: 'Preference' },
  ] },
  { id: 'token-note', pack: 'Deal closing', title: 'Token confirmation', description: 'The note issued when a buyer pays a token to hold intent on a unit.', fields: [
    { name: 'project', label: 'Project' },
    { name: 'unit', label: 'Unit' },
    { name: 'buyer', label: 'Buyer name' },
    { name: 'token', label: 'Token amount' },
    { name: 'paidOn', label: 'Date' },
  ] },
  { id: 'commission-confirmation', pack: 'Deal closing', title: 'Commission confirmation', description: 'Buyer or seller confirms the brokerage on a resale or a lease before anyone is paid.', fields: [
    { name: 'dealType', label: 'Sale or lease' },
    { name: 'property', label: 'Property' },
    { name: 'parties', label: 'Buyer and seller' },
    { name: 'commission', label: 'Commission' },
  ] },
  { id: 'loan-checklist', pack: 'Deal closing', title: 'Home loan checklist', description: 'What the buyer still needs for the loan: income proof, bank statements, tax returns, and KYC. The papers stay with them.', fields: [
    { name: 'buyer', label: 'Buyer name' },
    { name: 'income', label: 'Income proof' },
    { name: 'statements', label: 'Bank statements' },
    { name: 'returns', label: 'Tax returns' },
    { name: 'kyc', label: 'KYC' },
  ] },

  { id: 'associate-empanelment', pack: 'Compliance', title: 'Associate empanelment', description: 'Onboarding for a sub-agent or a freelance advisor: role, and how the commission is shared.', fields: [
    { name: 'associate', label: 'Associate name' },
    { name: 'role', label: 'Role' },
    { name: 'share', label: 'Commission share' },
    { name: 'firm', label: 'Firm' },
  ] },
  { id: 'confidentiality', pack: 'Compliance', title: 'Confidentiality NDA', description: 'Non-compete and confidentiality. Covers the firm’s client list, builder leads, and how long that cover lasts.', fields: [
    { name: 'party', label: 'Associate or firm' },
    { name: 'covers', label: 'What it covers' },
    { name: 'period', label: 'Period' },
  ] },
  { id: 'rera-disclosure', pack: 'Compliance', title: 'RERA disclosure sheet', description: 'The firm’s own state RERA registration, for the footer of marketing and client papers. Leave the number blank until the firm fills it.', fields: [
    { name: 'firm', label: 'Firm' },
    { name: 'state', label: 'State' },
    { name: 'rera', label: 'RERA registration number' },
  ] },
]
