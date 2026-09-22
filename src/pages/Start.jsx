import { useSearchParams } from 'react-router-dom'
import Footer from '../components/Footer'
import GuidedFinder from '../components/GuidedFinder'
import Header from '../components/Header'
import Seo from '../components/Seo'
import { FOOTER_LINKS } from '../theme'

// /start — the guided finder on its own page. `?who=developer` etc. pre-answers Q1
// (service pages link here with their own persona) so the visitor lands on Q2.
export default function Start() {
  const [params] = useSearchParams()
  const who = params.get('who') || undefined

  return (
    <>
      <Seo route="/start" />
      <Header />
      <GuidedFinder key={who || 'blank'} variant="page" seed={{ who }} location="start" />
      <Footer links={FOOTER_LINKS} />
    </>
  )
}
