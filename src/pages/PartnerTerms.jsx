import LegalPage from '../components/LegalPage'
import { CHANNEL_PARTNER_TERMS } from '../data/channelPartnerTerms'

export default function PartnerTerms() {
  return <LegalPage route="/partner/terms" {...CHANNEL_PARTNER_TERMS} />
}
