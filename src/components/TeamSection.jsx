import ChromaGrid from './ChromaGrid'
import Reveal from './Reveal'
import SectionHead, { SectionCount } from './SectionHead'
import { TEAM, TEAM_CHROMA } from '../data/content'
import { container, sectionRule } from '../styles'

/** Team wall as a cursor-spotlight grid, on Portfolio. No headshots yet, so cards use initials. */
export default function TeamSection() {
  return (
    <section id="team" style={{ ...sectionRule, background: 'var(--chip)' }}>
      <div className="rw-pad" style={{ ...container, padding: 'clamp(80px,10vw,110px) 40px' }}>
        <SectionHead
          eyebrow="TEAM RAJIV WILLIAMS" faded size="lg" titleWidth="14em"
          space="clamp(30px,3.4vw,44px)"
          title="The people that maketh the Team."
          aside={<SectionCount>{String(TEAM.length).padStart(2, '0')} · HYDERABAD</SectionCount>}
        />

        {/* scrim={false}: full-grid desaturation would render as a hard dark panel here. */}
        <Reveal>
          <ChromaGrid items={TEAM_CHROMA} columns={2} radius={320} scrim={false} />
        </Reveal>
      </div>
    </section>
  )
}
