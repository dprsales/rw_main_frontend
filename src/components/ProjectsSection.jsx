import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Reveal from './Reveal'
import { AREA_TO_LOCALITY, LOCALITIES, PROJECTS, resolveLocality } from '../data/content'
import { PROJECT_SLUGS, fetchAllProjects, fetchProjectSlugs, projectImage } from '../data/projects'
import { mono, serif, text } from '../theme'
import { container, eyebrowFaded, note, sectionHeadingLg, sectionRule } from '../styles'

// Territory map: west Hyderabad localities as dots scaled by project count, with a caption panel.
// Lifted out of Portfolio so RW Realty can reuse it; owns its state, reads content.js directly.

/** Short codes for the status marks that ride beside each name on the wall. */
const STATUS_MARK = {
  'Active': 'A',
  'Under Construction': 'UC',
  'Mandate': 'M',
  'Ready for Interiors': 'RFI',
}

/** Labels sit left of the node for anything out near the right edge. */
const LABEL_FLIP_X = 68

/**
 * Every locality on this map sits in the west corridor of Hyderabad — that's the
 * roster's real footprint, not a data gap, and the section's own eyebrow already
 * says so ("HYDERABAD · WEST CORRIDOR · SCHEMATIC"). So these quadrant labels are
 * NOT a claim about true city-wide compass geography — Kollur being "North" doesn't
 * mean north Hyderabad. They describe position on THIS schematic diagram, derived
 * from each locality's own x/y here, split around the map's own midpoint. Verify
 * against local knowledge before treating this as authoritative — flagging Kokapet
 * and Neopolis specifically: both sit close to the map's center, where the
 * north/south split is least confident.
 */
const LOCALITY_QUADRANT = {
  'Shankarpally': 'West',
  'Mokila': 'West',
  'Gandipet': 'West',
  'Kollur': 'North',
  'Neopolis': 'North',
  'Kokapet': 'North',
  'Raidurgam': 'North',
  'Financial District': 'North',
  'HITEC City': 'North',
  'Narsingi': 'East',
  'Puppalaguda': 'East',
  'Shaikpet': 'East',
  'APPA Junction': 'East',
  'Tukkuguda': 'East',
  'Manchirevula': 'South',
  'TGSPA Junction': 'South',
  'Mamidipally': 'South',
  'Gaganpahad': 'South',
  'Tellapur': 'North',
}
const QUADRANTS = ['All', 'West', 'East', 'North', 'South']

const MAX_RESULTS = 8

/** Bolds the matched substring in copper — a cheap, honest "yes, this is why it matched". */
function highlightMatch(name, query) {
  const i = name.toLowerCase().indexOf(query.toLowerCase())
  if (i === -1) return name
  return <>{name.slice(0, i)}<mark>{name.slice(i, i + query.length)}</mark>{name.slice(i + query.length)}</>
}

/**
 * Type-ahead by project name — the map below answers "what's in this locality?", but a
 * visitor who already has a name in mind (from a listing, a friend, an ad) shouldn't have
 * to guess which of ten localities to click through first. Same `shown`/`slugs` data the
 * map and panel already use, so search and browse can never disagree with each other.
 */
function ProjectSearch({ shown, slugs }) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [highlight, setHighlight] = useState(-1)
  const wrapRef = useRef(null)
  const navigate = useNavigate()

  // Exact-start matches ("Bay...") read as more relevant than a mid-name hit ("...leaf")
  // and are sorted first; a plain .filter() is plenty fast for a roster this size, so
  // there's no need to reach for a search library or an index.
  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []
    const starts = []
    const contains = []
    for (const p of shown) {
      const n = p.name.toLowerCase()
      if (n.startsWith(q)) starts.push(p)
      else if (n.includes(q)) contains.push(p)
    }
    return [...starts, ...contains].slice(0, MAX_RESULTS)
  }, [query, shown])

  useEffect(() => { setHighlight(results.length ? 0 : -1) }, [results])

  useEffect(() => {
    if (!open) return
    const onDocDown = (e) => { if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', onDocDown)
    return () => document.removeEventListener('mousedown', onDocDown)
  }, [open])

  const goTo = (project) => {
    const slug = slugs[project.name]
    if (!slug) return
    setQuery('')
    setOpen(false)
    navigate(`/projects/${slug}`)
  }

  const onKeyDown = (e) => {
    if (e.key === 'Escape') { setOpen(false); return }
    if (!open || !results.length) return
    if (e.key === 'ArrowDown') { e.preventDefault(); setHighlight((h) => (h + 1) % results.length) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setHighlight((h) => (h - 1 + results.length) % results.length) }
    else if (e.key === 'Enter') {
      e.preventDefault()
      // `highlight` is synced from `results` by an effect a render behind — typing the
      // last character and hitting Enter in the same beat can outrun it, leaving -1
      // even though results exist. Fall back to the top result rather than no-op.
      const idx = highlight >= 0 && highlight < results.length ? highlight : 0
      goTo(results[idx])
    }
  }

  const showPanel = open && query.trim().length > 0

  return (
    <div ref={wrapRef} className="rw-project-search">
      <svg className="rw-project-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </svg>
      <input
        type="text"
        role="combobox"
        aria-expanded={showPanel}
        aria-haspopup="listbox"
        aria-controls="rw-project-search-listbox"
        aria-autocomplete="list"
        aria-activedescendant={highlight >= 0 ? `rw-project-search-option-${highlight}` : undefined}
        className="rw-project-search-input"
        style={{ fontFamily: text }}
        placeholder="Search projects by name…"
        value={query}
        onChange={(e) => { setQuery(e.target.value); setOpen(true) }}
        onFocus={() => query && setOpen(true)}
        onKeyDown={onKeyDown}
      />
      {query && (
        <button
          type="button"
          className="rw-project-search-clear"
          aria-label="Clear search"
          onClick={() => { setQuery(''); setOpen(false) }}
        >
          ×
        </button>
      )}

      {showPanel && (
        <ul id="rw-project-search-listbox" role="listbox" className="rw-project-search-results">
          {results.length ? results.map((p, i) => {
            const slug = slugs[p.name]
            return (
              <li
                key={p.name}
                id={`rw-project-search-option-${i}`}
                role="option"
                aria-selected={i === highlight}
                className={`rw-project-search-item${i === highlight ? ' is-active' : ''}${!slug ? ' is-disabled' : ''}`}
                onMouseEnter={() => setHighlight(i)}
                onMouseDown={(e) => { e.preventDefault(); goTo(p) }}
              >
                <span className="rw-project-search-name" style={{ fontFamily: serif }}>{highlightMatch(p.name, query)}</span>
                <span className="rw-project-search-meta" style={{ fontFamily: mono }}>
                  {slug ? p.area : <em>page coming soon</em>}
                </span>
              </li>
            )
          }) : (
            <li className="rw-project-search-empty" style={{ fontFamily: text }}>
              No projects match &ldquo;{query.trim()}&rdquo;.
            </li>
          )}
        </ul>
      )}
    </div>
  )
}

export default function ProjectsSection() {
  const [active, setActive] = useState('Kokapet')
  const [quadrant, setQuadrant] = useState('All')

  // Seeded from the curated map, then merged with the live index; each fetch never rejects.
  const [slugs, setSlugs] = useState(PROJECT_SLUGS)
  const [liveProjects, setLiveProjects] = useState([])

  useEffect(() => {
    let live = true
    Promise.all([fetchProjectSlugs(), fetchAllProjects()])
      .then(([next, rows]) => {
        if (!live) return
        setSlugs(next)
        setLiveProjects(rows)
      })
    return () => { live = false }
  }, [])

  /* Live rows override the curated list — the portfolio should track everything the
     admin panel has published, not the hand-maintained snapshot in content.js. Rows
     are bridged by slug so curated titles keep their polished casing and status. */
  const shown = useMemo(() => {
    if (!liveProjects.length) return PROJECTS

    const curatedBySlug = new Map(
      PROJECTS.map((p) => [PROJECT_SLUGS[p.name]?.toLowerCase(), p]).filter(([k]) => k),
    )
    return liveProjects.map((row) => {
      const slug = (row.slug || '').trim().toLowerCase()
      const curated = curatedBySlug.get(slug)
      // The curated list is hand-authored copy (name/area/status), never an image —
      // the thumbnail always comes from the live row, curated match or not.
      const image = projectImage(row.projectimage || row.backgroundimage)
      if (curated) return { ...curated, image }
      return {
        name: (row.title || '').trim(),
        area: resolveLocality(row.location),
        status: 'Mandate',
        image,
      }
    })
  }, [liveProjects])

  // Nodes with nothing after a filter stay on the map dimmed — it should re-weight, not reshape.
  const nodes = useMemo(() => {
    const byLocality = new Map(LOCALITIES.map((l) => [l.name, []]))
    for (const p of shown) {
      const key = AREA_TO_LOCALITY[p.area]
      if (byLocality.has(key)) byLocality.get(key).push(p)
    }
    const max = Math.max(1, ...[...byLocality.values()].map((v) => v.length))
    return LOCALITIES.map((l) => {
      // A quadrant filter empties out non-matching localities rather than removing
      // their dots — they fall back to the existing "no projects here" dimmed state
      // (is-empty), so the map's layout never jumps and nothing new to style.
      const inQuadrant = quadrant === 'All' || LOCALITY_QUADRANT[l.name] === quadrant
      const projects = inQuadrant ? byLocality.get(l.name) : []
      // Area, not radius, scales with count — a radius-linear dot would make 5x look 25x.
      const weight = projects.length ? Math.sqrt(projects.length / max) : 0
      return { ...l, projects, r: projects.length ? 1.1 + weight * 2.3 : 0.8 }
    })
  }, [shown, quadrant])

  /* Keep the panel on a locality that still has something in it. */
  const activeNode =
    nodes.find((n) => n.name === active && n.projects.length) ||
    [...nodes].sort((a, b) => b.projects.length - a.projects.length)[0]

  // "All" keeps the original static totals (every project, every named locality);
  // a quadrant filter switches to a live count of what's actually visible now.
  const visibleProjectCount = quadrant === 'All' ? shown.length : nodes.reduce((sum, n) => sum + n.projects.length, 0)
  const visibleLocalityCount = quadrant === 'All' ? LOCALITIES.length : nodes.filter((n) => n.projects.length > 0).length

  return (
    <section id="projects" style={{ ...sectionRule, borderBottom: '1px solid var(--line)' }}>
      {/* Tighter than the site's default section rhythm on purpose: this header carries
          controls, so the stock clamp(90px,11vw,120px) left it floating in dead space. */}
      <div className="rw-pad" style={{ ...container, padding: 'clamp(58px,6vw,80px) 40px' }}>
        {/* Two columns on desktop: the standing copy reads left, the live controls
            sit right. Stacked full-width, a search field stretches past 1200px and
            reads thin rather than premium. Hand-rolled rather than SectionHead —
            no other section pairs its heading with controls like this. */}
        <div className="rw-influence-head">
          <div className="rw-influence-heading">
            <div style={{ ...eyebrowFaded, marginBottom: 14 }}>INVESTMENT ADVISORY</div>
            <h2 style={{ ...sectionHeadingLg, maxWidth: '13em' }}>Area&apos;s of influence.</h2>
          </div>

          <div className="rw-influence-summary">
            {/* Fills the column rather than stopping short at 26em — a narrow measure
                here left ~170px of dead space that read as an oversized column gap. */}
            <p style={{ ...note, maxWidth: '34em' }}>
              A cross-section of the luxury and premium developments across Hyderabad that team RW has represented, mentored, or held sales mandates for.
            </p>

            <div className="rw-influence-stats">
              <div className="rw-influence-stat">
                <span className="rw-influence-stat-num" style={{ fontFamily: serif }}>{visibleProjectCount}</span>
                <span className="rw-influence-stat-label" style={{ fontFamily: mono }}>PROJECTS</span>
              </div>
              <div className="rw-influence-stat">
                <span className="rw-influence-stat-num" style={{ fontFamily: serif }}>{visibleLocalityCount}</span>
                <span className="rw-influence-stat-label" style={{ fontFamily: mono }}>LOCALITIES</span>
              </div>
            </div>
          </div>

          <div id="rw-influence-explore-label" className="rw-influence-explore-label" style={{ fontFamily: mono }}>
            EXPLORE<br />OPPORTUNITIES
          </div>

          <div className="rw-influence-controls" role="group" aria-labelledby="rw-influence-explore-label">
            {/* Know the name already? Skip the map. */}
            <ProjectSearch shown={shown} slugs={slugs} />

            <div className="rw-quadrant-pills" role="group" aria-label="Filter the map by area">
              {QUADRANTS.map((q) => (
                <button
                  key={q}
                  type="button"
                  className={`rw-quadrant-pill${quadrant === q ? ' is-on' : ''}`}
                  style={{ fontFamily: text }}
                  aria-pressed={quadrant === q}
                  onClick={() => setQuadrant(q)}
                >
                  {q === 'All' ? 'All Areas' : q}
                </button>
              ))}
            </div>

            {/* Rides in the controls column's spare height rather than claiming a row
                of its own — the left column runs taller than search + pills anyway. */}
            <div className="rw-influence-caption" style={{ fontFamily: mono }}>
              HYDERABAD · WEST CORRIDOR · SCHEMATIC
            </div>
          </div>
        </div>

        <Reveal className="rw-territory">
          <div className="rw-map">
            <svg viewBox="0 0 100 92" role="img" aria-label="Map of project localities across west Hyderabad">
              {nodes.map((n) => {
                const on = n.name === activeNode?.name
                const empty = n.projects.length === 0
                const flip = n.x > LABEL_FLIP_X
                {/* Tight clusters always collide; single holdings only name themselves on hover. */}
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
                    {/* Generous invisible hit target — the dots are small. */}
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
                    const card = (
                      <>
                        <span className="rw-panel-thumb" aria-hidden>
                          {p.image
                            ? <img src={p.image} alt="" loading="lazy" />
                            : <span className="rw-panel-thumb-fallback" style={{ fontFamily: serif }}>{p.name.charAt(0)}</span>}
                        </span>
                        <span className="rw-panel-text">
                          <span className="rw-panel-item-name" style={{ fontFamily: serif }}>{p.name}</span>
                          <span className="rw-panel-item-meta" style={{ fontFamily: mono }}>
                            {p.area}
                            <span className="rw-panel-status">{STATUS_MARK[p.status || 'Mandate']}</span>
                          </span>
                        </span>
                        {/* Only projects with a published page get a chevron — it marks what's clickable. */}
                        {slug && (
                          <svg className="rw-panel-chevron" aria-hidden viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                            <path d="m9 6 6 6-6 6" />
                          </svg>
                        )}
                      </>
                    )
                    return (
                      <li key={p.name} className="rw-panel-item">
                        {slug ? (
                          <Link to={`/projects/${slug}`} className="rw-panel-link">{card}</Link>
                        ) : (
                          <span className="rw-panel-link is-disabled">{card}</span>
                        )}
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
