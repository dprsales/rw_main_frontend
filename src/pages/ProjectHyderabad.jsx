import Footer from '../components/Footer'
import Header from '../components/Header'
import PageIntro from '../components/PageIntro'
import ProjectsSection from '../components/ProjectsSection'
import Seo from '../components/Seo'
import { BookButton } from '../components/BookingModal'
import { FOOTER_LINKS } from '../theme'
import { ctaCopper, fs } from '../styles'

const HEADLINE = [
  { text: 'Projects across ' },
  { text: 'Hyderabad.', italic: true, copper: true },
]

export default function ProjectHyderabad() {
  return (
    <>
      <Seo route="/project-hyderabad" />
      <Header />

      <PageIntro
        eyebrow="PROPERTIES · HYDERABAD PROJECTS"
        headline={HEADLINE}
        headlineStyle={{ fontSize: fs('clamp(32px,4vw,56px)'), lineHeight: 1.1, maxWidth: '11em' }}
        lede="The Hyderabad developments that Team RW associates with, works on, represents, and mentors."
        intro="We hold strong relationships in these places and these projects. If you are looking for a home, we can help."
        cta={<BookButton interest="Looking for a home" className="rw-cta" style={ctaCopper}>TALK TO AN EXPERT</BookButton>}
      />

      <ProjectsSection id="projects" />

      <Footer links={FOOTER_LINKS} />
    </>
  )
}
