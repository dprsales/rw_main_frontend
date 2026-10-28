import LegalPage from '../components/LegalPage'
import { TERMS_OF_USE } from '../data/termsOfUse'

export default function Terms() {
  return <LegalPage route="/terms" {...TERMS_OF_USE} />
}
