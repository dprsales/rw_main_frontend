import Footer from '../components/Footer'
import Header from '../components/Header'
import PageIntro from '../components/PageIntro'
import ProjectsSection from '../components/ProjectsSection'
import Seo from '../components/Seo'
import { FOOTER_LINKS } from '../theme'

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
        lede="The Hyderabad developments Team RW has represented, mentored, or held sales mandates for."
      />

      <ProjectsSection id="projects" />

      <Footer links={FOOTER_LINKS} />
    </>
  )
}
