import { useMemo } from 'react'
import ChromaGrid from './ChromaGrid'
import Reveal from './Reveal'
import SectionHead, { SectionCount } from './SectionHead'
import { useLang } from '../i18n/LangProvider'
import { TEAM, TEAM_CHROMA } from '../data/content'
import { container, sectionRule } from '../styles'

/** Team wall as a cursor-spotlight grid, on Portfolio. No headshots yet, so cards use initials. */
export default function TeamSection() {
  const { t } = useLang()
  const items = useMemo(() => TEAM_CHROMA.map((member, i) => ({
    ...member,
    subtitle: t(`portfolio.team.${i}.title`),
    bio: t(`portfolio.team.${i}.bio`),
  })), [t])

  return (
    <section id="team" style={{ ...sectionRule, background: 'var(--chip)' }}>
      <div className="rw-pad" style={{ ...container, padding: 'clamp(80px,10vw,110px) 40px' }}>
        <SectionHead
          eyebrow={t('portfolio.team.eyebrow')} faded size="lg" titleWidth="14em"
          space="clamp(30px,3.4vw,44px)"
          title={t('portfolio.team.title')}
          aside={<SectionCount>{t('portfolio.team.count', { n: String(TEAM.length).padStart(2, '0') })}</SectionCount>}
        />

        {/* scrim={false}: full-grid desaturation would render as a hard dark panel here. */}
        <Reveal>
          <ChromaGrid items={items} columns={2} radius={320} scrim={false} />
        </Reveal>
      </div>
    </section>
  )
}
