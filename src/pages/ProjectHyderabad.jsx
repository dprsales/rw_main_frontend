import Footer from '../components/Footer'
import Header from '../components/Header'
import PageIntro from '../components/PageIntro'
import ProjectsSection from '../components/ProjectsSection'
import Seo from '../components/Seo'
import { FOOTER_LINKS } from '../theme'
import { fs } from '../styles'

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
        lede="The Hyderabad developments that Team RW has represented, mentored, or held sales mandates for."
      />

      <ProjectsSection id="projects" />

      <Footer links={FOOTER_LINKS} />
    </>
  )
}
