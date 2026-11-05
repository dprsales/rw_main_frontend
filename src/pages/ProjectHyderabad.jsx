import { useMemo } from 'react'
import Footer from '../components/Footer'
import Header from '../components/Header'
import PageIntro from '../components/PageIntro'
import ProjectsSection from '../components/ProjectsSection'
import Seo from '../components/Seo'
import { BookButton } from '../components/BookingModal'
import { useLang } from '../i18n/LangProvider'
import { FOOTER_LINKS } from '../theme'
import { ctaCopper, fs } from '../styles'

export default function ProjectHyderabad() {
  const { t } = useLang()
  const headline = useMemo(() => [
    { text: t('projects.h1.a') },
    { text: t('projects.h1.b'), italic: true, copper: true },
  ], [t])

  return (
    <>
      <Seo route="/project-hyderabad" />
      <Header />

      <PageIntro
        eyebrow={t('projects.eyebrow')}
        headline={headline}
        headlineStyle={{ fontSize: fs('clamp(32px,4vw,56px)'), lineHeight: 1.1, maxWidth: '11em' }}
        lede={t('projects.lede')}
        intro={t('projects.intro')}
        cta={<BookButton interest="Looking for a home" className="rw-cta" style={ctaCopper}>{t('projects.cta')}</BookButton>}
      />

      <ProjectsSection id="projects" />

      <Footer links={FOOTER_LINKS} />
    </>
  )
}
