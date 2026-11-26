/** Keep in sync with merchandising_backend/src/listing/commission.ts */
export const COMMISSION_TERMS_VERSION = 'team-rw-3pct-v2'
export const COMMISSION_RENT_TERMS_VERSION = 'team-rw-rent-fee-v1'

export const COMMISSION_TERMS_TEXT_SALE =
  'I understand and agree that if my property is successfully sold with our support, a professional fee of 3% of the total sale value is payable to us.'

export const COMMISSION_TERMS_TEXT_RENT =
  'I understand that this rental listing is free to publish. Any professional fee for a completed tenancy will be confirmed in writing with us before it is payable.'

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
    text: 'I allow this property to be shown on the website.',
  },
  {
    key: 'useDetails',
    text: 'I allow this property’s features and details to be shown with the listing.',
  },
  {
    key: 'useMedia',
    text: 'I allow this property’s images and videos to be used on the website and in promotions.',
  },
  {
    key: 'runAds',
    text: 'I allow this property to be advertised on our channels.',
  },
]
