import LegalPage from '../components/LegalPage'
import { PRIVACY_POLICY } from '../data/privacyPolicy'

export default function PrivacyPolicy() {
  return <LegalPage route="/privacy-policy" {...PRIVACY_POLICY} />
}
