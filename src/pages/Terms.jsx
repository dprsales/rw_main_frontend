import LegalPage from '../components/LegalPage'
import { TERMS_OF_USE } from '../data/termsOfUse'

export default function Terms() {
  return <LegalPage route="/terms" linkPrivacy {...TERMS_OF_USE} />
}
