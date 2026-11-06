/** Keep in sync with merchandising_backend/src/listing/commission.ts */
export const COMMISSION_TERMS_VERSION = 'team-rw-3pct-v2'
export const COMMISSION_RENT_TERMS_VERSION = 'team-rw-rent-fee-v1'

export const COMMISSION_TERMS_TEXT_SALE =
  'I understand and agree that if my property is successfully sold with Team RW’s support, a professional fee of 3% of the total sale value is payable to Team RW.'

export const COMMISSION_TERMS_TEXT_RENT =
  'I understand that this rental listing is free to publish. Any professional fee for a completed tenancy will be confirmed in writing with Team RW before it is payable.'

export const COMMISSION_TERMS_TEXT = COMMISSION_TERMS_TEXT_SALE

export function commissionTermsFor(listingType) {
  if (listingType === 'Rent') {
    return { version: COMMISSION_RENT_TERMS_VERSION, text: COMMISSION_TERMS_TEXT_RENT }
  }
  return { version: COMMISSION_TERMS_VERSION, text: COMMISSION_TERMS_TEXT_SALE }
}

/** Publish permissions. Separate from the fee. */
export const LISTING_CONSENT_VERSION = 'team-rw-listing-consent-v3'

export const LISTING_CONSENTS = [
  {
    key: 'displayOnWebsite',
    text: 'I permit Team RW to display this property on the website.',
  },
  {
    key: 'useDetails',
    text: 'I permit Team RW to show this property’s features and details with the listing.',
  },
  {
    key: 'useMedia',
    text: 'I permit Team RW to use this property’s images and videos on the website and in promotions.',
  },
  {
    key: 'runAds',
    text: 'I permit Team RW to advertise this property on its own channels.',
  },
]
