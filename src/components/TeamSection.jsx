import ChromaGrid from './ChromaGrid'
import Reveal from './Reveal'
import SectionHead, { SectionCount } from './SectionHead'
import { TEAM, TEAM_CHROMA } from '../data/content'
import { container, sectionRule } from '../styles'

// Team wall grid; cards fall back to initials until headshots are added.
export default function TeamSection() {
  return (
    <section id="team" style={{ ...sectionRule, background: 'var(--chip)' }}>
      <div className="rw-pad" style={{ ...container, padding: 'clamp(80px,10vw,110px) 40px' }}>
        <SectionHead
          eyebrow="TEAM RAJIV WILLIAMS" faded size="lg" titleWidth="14em"
          space="clamp(30px,3.4vw,44px)"
          title="The people behind the mandate."
          aside={<SectionCount>{String(TEAM.length).padStart(2, '0')} · HYDERABAD</SectionCount>}
        />

        {/* scrim={false}: avoids a hard dark panel over this flat background */}
        <Reveal>
          <ChromaGrid items={TEAM_CHROMA} columns={3} radius={320} scrim={false} />
        </Reveal>
      </div>
    </section>
  )
}
