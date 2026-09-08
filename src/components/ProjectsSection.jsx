import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Reveal from './Reveal'
import SectionHead, { SectionAside } from './SectionHead'
import { AREA_TO_LOCALITY, LOCALITIES, PROJECTS } from '../data/content'
import { PROJECT_SLUGS, fetchProjectSlugs } from '../data/projects'
import { mono, serif } from '../theme'
import { container, sectionRule } from '../styles'

// Territory map of west Hyderabad localities, shared by Portfolio and RW Realty.

/** Short codes for the status marks that ride beside each name on the wall. */
const STATUS_MARK = {
  'Active': 'A',
  'Under Construction': 'UC',
  'Mandate': 'M',
  'Ready for Interiors': 'RFI',
}

/** Labels sit left of the node for anything out near the right edge. */
const LABEL_FLIP_X = 68

export default function ProjectsSection() {
  const [active, setActive] = useState('Kokapet')

  // Seeded with the curated map, then merged with the live index once it loads; a dead endpoint leaves it as-is.
  const [slugs, setSlugs] = useState(PROJECT_SLUGS)

  useEffect(() => {
    let live = true
    fetchProjectSlugs().then((next) => { if (live) setSlugs(next) })
    return () => { live = false }
  }, [])

  const shown = PROJECTS

  // Nodes with nothing left after a filter stay on the map, dimmed, rather than disappearing.
  const nodes = useMemo(() => {
    const byLocality = new Map(LOCALITIES.map((l) => [l.name, []]))
    for (const p of shown) {
      const key = AREA_TO_LOCALITY[p.area]
      if (byLocality.has(key)) byLocality.get(key).push(p)
    }
    const max = Math.max(1, ...[...byLocality.values()].map((v) => v.length))
    return LOCALITIES.map((l) => {
      const projects = byLocality.get(l.name)
      // Area, not radius, scales with count, so five projects isn't drawn 25x the size of one.
      const weight = projects.length ? Math.sqrt(projects.length / max) : 0
      return { ...l, projects, r: projects.length ? 1.1 + weight * 2.3 : 0.8 }
    })
  }, [shown])

  // Keep the panel on a locality that still has something in it.
  const activeNode =
    nodes.find((n) => n.name === active && n.projects.length) ||
    [...nodes].sort((a, b) => b.projects.length - a.projects.length)[0]

  return (
    <section id="projects" style={{ ...sectionRule, borderBottom: '1px solid var(--line)' }}>
      <div className="rw-pad" style={{ ...container, padding: 'clamp(90px,11vw,120px) 40px' }}>
        <SectionHead
          eyebrow="SELECTED INVENTORY" faded size="lg" titleWidth="13em" space={34}
          title="Area of influence."
          aside={(
            <SectionAside width="24em" style={{ marginBottom: -5 }}>
              A cross-section of the luxury and premium developments across Hyderabad that Rajiv&apos;s team has represented, mentored, or held sales mandates for.
            </SectionAside>
          )}
        />

        <div className="rw-index-head" style={{ fontFamily: mono, marginTop: 34 }}>
          <span>{String(shown.length).padStart(2, '0')} PROJECTS · {LOCALITIES.length} LOCALITIES</span>
          <span>HYDERABAD · WEST CORRIDOR · SCHEMATIC</span>
        </div>

        <Reveal className="rw-territory">
          <div className="rw-map">
            <svg viewBox="0 0 100 92" role="img" aria-label="Map of project localities across west Hyderabad">
              {nodes.map((n) => {
                const on = n.name === activeNode?.name
                const empty = n.projects.length === 0
                const flip = n.x > LABEL_FLIP_X
                // Clusters this tight always collide, so single holdings only label themselves on hover/focus.
                const minor = n.projects.length < 2
                return (
                  <g
                    key={n.name}
                    className={`rw-node${on ? ' is-on' : ''}${empty ? ' is-empty' : ''}${minor ? ' is-minor' : ''}`}
                    onMouseEnter={() => !empty && setActive(n.name)}
                    onFocus={() => !empty && setActive(n.name)}
                    tabIndex={empty ? -1 : 0}
                    role="button"
                    aria-label={`${n.name}, ${n.projects.length} projects`}
                  >
                    {/* A generous invisible target — the dots are small. */}
                    <circle className="rw-node-hit" cx={n.x} cy={n.y} r={5.5} />
                    <circle className="rw-node-halo" cx={n.x} cy={n.y} r={n.r + 2.6} />
                    <circle className="rw-node-dot" cx={n.x} cy={n.y} r={n.r} />
                    <text
                      className="rw-node-label"
                      x={flip ? n.x - n.r - 1.9 : n.x + n.r + 1.9}
                      y={n.y + 0.7}
                      textAnchor={flip ? 'end' : 'start'}
                      style={{ fontFamily: mono }}
                    >
                      {n.name}
                      {!empty && <tspan className="rw-node-count" dx="1.6">{n.projects.length}</tspan>}
                    </text>
                  </g>
                )
              })}
            </svg>
          </div>

          <div className="rw-territory-panel">
            {activeNode && (
              <>
                <div className="rw-panel-count" style={{ fontFamily: mono }}>
                  {String(activeNode.projects.length).padStart(2, '0')} {activeNode.projects.length === 1 ? 'PROJECT' : 'PROJECTS'}
                </div>
                <h3 className="rw-panel-name" style={{ fontFamily: serif }}>{activeNode.name}</h3>

                <ul className="rw-panel-list">
                  {activeNode.projects.map((p) => {
                    const slug = slugs[p.name]
                    return (
                      <li key={p.name} className="rw-panel-item">
                        {/* Only projects with a published page become links; arrow marks what's clickable. */}
                        {slug ? (
                          <Link to={`/projects/${slug}`} className="rw-panel-link" style={{ fontFamily: serif, color: 'var(--ink)', display: 'inline-flex', alignItems: 'baseline', gap: 8 }}>
                            {p.name}
                            <span aria-hidden className="rw-panel-go" style={{ fontFamily: mono, fontSize: 11, color: 'var(--copper)' }}>→</span>
                          </Link>
                        ) : (
                          <span style={{ fontFamily: serif }}>{p.name}</span>
                        )}
                        <span className="rw-panel-status" style={{ fontFamily: mono }}>
                          {STATUS_MARK[p.status || 'Mandate']}
                        </span>
                      </li>
                    )
                  })}
                </ul>

                <div className="rw-panel-hint" style={{ fontFamily: mono }}>
                  TAP A PROJECT TO VIEW ITS PAGE
                </div>
              </>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
