import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Reveal from './Reveal'
import { useLang } from '../i18n/LangProvider'
import { AREA_TO_LOCALITY, LOCALITIES, PROJECTS, resolveLocality } from '../data/content'
import { PROJECT_SLUGS, fetchAllProjects, fetchProjectSlugs, projectImage } from '../data/projects'
import { mono, serif, text } from '../theme'
import { container, eyebrowFaded, note, sectionHeadingLg, sectionRule } from '../styles'

/** Short codes for status marks on each card. */
const STATUS_MARK = {
  Active: 'A',
  'Under Construction': 'UC',
  Mandate: 'M',
  'Ready for Interiors': 'RFI',
}

const LOCALITY_QUADRANT = {
  Shankarpally: 'West',
  Mokila: 'West',
  Gandipet: 'West',
  Kollur: 'North',
  Neopolis: 'North',
  Kokapet: 'North',
  Raidurgam: 'North',
  'Financial District': 'North',
  'HITEC City': 'North',
  Narsingi: 'East',
  Puppalaguda: 'East',
  Shaikpet: 'East',
  'APPA Junction': 'East',
  Tukkuguda: 'East',
  Manchirevula: 'South',
  'TGSPA Junction': 'South',
  Mamidipally: 'South',
  Gaganpahad: 'South',
  Tellapur: 'North',
  Gopanpally: 'North',
}
const QUADRANTS = ['All', 'West', 'East', 'North', 'South']
const MAX_RESULTS = 8

function highlightMatch(name, query) {
  const i = name.toLowerCase().indexOf(query.toLowerCase())
  if (i === -1) return name
  return (
    <>
      {name.slice(0, i)}
      <mark>{name.slice(i, i + query.length)}</mark>
      {name.slice(i + query.length)}
    </>
  )
}

function ProjectSearch({ shown, slugs }) {
  const { t } = useLang()
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [highlight, setHighlight] = useState(-1)
  const wrapRef = useRef(null)
  const navigate = useNavigate()

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

  useEffect(() => {
    setHighlight(results.length ? 0 : -1)
  }, [results])

  useEffect(() => {
    if (!open) return undefined
    const onDocDown = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false)
    }
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
    if (e.key === 'Escape') {
      setOpen(false)
      return
    }
    if (!open || !results.length) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlight((h) => (h + 1) % results.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlight((h) => (h - 1 + results.length) % results.length)
    } else if (e.key === 'Enter') {
      e.preventDefault()
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
        placeholder={t('projects.search.placeholder')}
        value={query}
        onChange={(e) => {
          setQuery(e.target.value)
          setOpen(true)
        }}
        onFocus={() => query && setOpen(true)}
        onKeyDown={onKeyDown}
      />
      {query && (
        <button
          type="button"
          className="rw-project-search-clear"
          aria-label={t('projects.search.clear')}
          onClick={() => {
            setQuery('')
            setOpen(false)
          }}
        >
          ×
        </button>
      )}

      {showPanel && (
        <ul id="rw-project-search-listbox" role="listbox" className="rw-project-search-results">
          {results.length ? (
            results.map((p, i) => {
              const slug = slugs[p.name]
              return (
                <li
                  key={p.name}
                  id={`rw-project-search-option-${i}`}
                  role="option"
                  aria-selected={i === highlight}
                  className={`rw-project-search-item${i === highlight ? ' is-active' : ''}${!slug ? ' is-disabled' : ''}`}
                  onMouseEnter={() => setHighlight(i)}
                  onMouseDown={(e) => {
                    e.preventDefault()
                    goTo(p)
                  }}
                >
                  <span className="rw-project-search-name" style={{ fontFamily: serif }}>
                    {highlightMatch(p.name, query)}
                  </span>
                  <span className="rw-project-search-meta" style={{ fontFamily: mono }}>
                    {slug ? p.area : <em>{t('projects.search.soon')}</em>}
                  </span>
                </li>
              )
            })
          ) : (
            <li className="rw-project-search-empty" style={{ fontFamily: text }}>
              {t('projects.search.empty', { q: query.trim() })}
            </li>
          )}
        </ul>
      )}
    </div>
  )
}

/** Card thumbs only accept a real hero upload path. Gallery/About paths from
 *  the live list API are ignored so empty-hero projects show the letter fallback. */
function heroCardImage(path) {
  const raw = String(path || '').trim()
  if (!raw) return ''
  if (!/\/hero\//i.test(raw) && !/\/dprstorage\/hero\//i.test(raw)) return ''
  return projectImage(raw) || ''
}

function ProjectCard({ project, slug, soonLabel }) {
  const mark = STATUS_MARK[project.status || 'Mandate'] || 'M'
  const body = (
    <>
      <span className="rw-proj-card-media" aria-hidden>
        {project.image ? (
          <img src={project.image} alt="" loading="lazy" decoding="async" />
        ) : (
          <span className="rw-proj-card-fallback" style={{ fontFamily: serif }}>
            {project.name.charAt(0)}
          </span>
        )}
      </span>
      <span className="rw-proj-card-body">
        <span className="rw-proj-card-name" style={{ fontFamily: serif }}>
          {project.name}
        </span>
        <span className="rw-proj-card-meta" style={{ fontFamily: mono }}>
          <span>{project.area}</span>
          <span className="rw-proj-card-status">{mark}</span>
        </span>
        {!slug && (
          <span className="rw-proj-card-soon" style={{ fontFamily: mono }}>
            {soonLabel}
          </span>
        )}
      </span>
    </>
  )

  if (slug) {
    return (
      <Link to={`/projects/${slug}`} className="rw-proj-card">
        {body}
      </Link>
    )
  }

  return <div className="rw-proj-card is-disabled">{body}</div>
}

export default function ProjectsSection({ id = 'projects' }) {
  const { t } = useLang()
  const [quadrant, setQuadrant] = useState('All')
  const [slugs, setSlugs] = useState(PROJECT_SLUGS)
  const [liveProjects, setLiveProjects] = useState([])

  useEffect(() => {
    let live = true
    Promise.all([fetchProjectSlugs(), fetchAllProjects()]).then(([next, rows]) => {
      if (!live) return
      setSlugs(next)
      setLiveProjects(rows)
    })
    return () => {
      live = false
    }
  }, [])

  const shown = useMemo(() => {
    if (!liveProjects.length) return PROJECTS

    const curatedBySlug = new Map(
      PROJECTS.map((p) => [PROJECT_SLUGS[p.name]?.toLowerCase(), p]).filter(([k]) => k),
    )
    return liveProjects.map((row) => {
      const slug = (row.slug || '').trim().toLowerCase()
      const curated = curatedBySlug.get(slug)
      const image = heroCardImage(row.projectimage || row.backgroundimage)
      if (curated) return { ...curated, image }
      return {
        name: (row.title || '').trim(),
        area: resolveLocality(row.location),
        status: 'Mandate',
        image,
      }
    })
  }, [liveProjects])

  const filtered = useMemo(() => {
    if (quadrant === 'All') return shown
    return shown.filter((p) => {
      const locality = AREA_TO_LOCALITY[p.area] || p.area
      return LOCALITY_QUADRANT[locality] === quadrant
    })
  }, [shown, quadrant])

  const localityCount = useMemo(() => {
    const set = new Set()
    for (const p of filtered) {
      const key = AREA_TO_LOCALITY[p.area] || p.area
      if (key) set.add(key)
    }
    return set.size
  }, [filtered])

  const knownLocalities = LOCALITIES.length

  return (
    <section id={id} style={{ ...sectionRule, borderBottom: '1px solid var(--line)' }}>
      <div className="rw-pad" style={{ ...container, padding: 'var(--rw-sy-lg) 40px' }}>
        <div className="rw-influence-head">
          <div className="rw-influence-heading">
            <div style={{ ...eyebrowFaded, marginBottom: 14 }}>{t('projects.map.eyebrow')}</div>
            <h2 style={{ ...sectionHeadingLg, maxWidth: '14em' }}>{t('projects.map.title')}</h2>
          </div>

          <div className="rw-influence-summary">
            <p style={{ ...note, maxWidth: '36em' }}>{t('projects.map.note')}</p>
            <div className="rw-influence-stats">
              <div className="rw-influence-stat">
                <span className="rw-influence-stat-num" style={{ fontFamily: serif }}>
                  {filtered.length}
                </span>
                <span className="rw-influence-stat-label" style={{ fontFamily: mono }}>
                  {t('projects.map.stat.projects')}
                </span>
              </div>
              <div className="rw-influence-stat">
                <span className="rw-influence-stat-num" style={{ fontFamily: serif }}>
                  {quadrant === 'All' ? knownLocalities : localityCount}
                </span>
                <span className="rw-influence-stat-label" style={{ fontFamily: mono }}>
                  {t('projects.map.stat.localities')}
                </span>
              </div>
            </div>
          </div>

          <div id="rw-influence-explore-label" className="rw-influence-explore-label" style={{ fontFamily: mono }}>
            {t('projects.map.explore')}
            <br />
            {t('projects.map.opportunities')}
          </div>

          <div className="rw-influence-controls" role="group" aria-labelledby="rw-influence-explore-label">
            <ProjectSearch shown={shown} slugs={slugs} />

            <div className="rw-quadrant-pills" role="group" aria-label={t('projects.map.filterAria')}>
              {QUADRANTS.map((q) => (
                <button
                  key={q}
                  type="button"
                  className={`rw-quadrant-pill${quadrant === q ? ' is-on' : ''}`}
                  style={{ fontFamily: text }}
                  aria-pressed={quadrant === q}
                  onClick={() => setQuadrant(q)}
                >
                  {q === 'All' ? t('projects.map.all') : t(`projects.map.${q.toLowerCase()}`)}
                </button>
              ))}
            </div>
          </div>
        </div>

        <Reveal>
          <ul className="rw-proj-grid" aria-label={t('projects.map.title')}>
            {filtered.map((project) => (
              <li key={project.name}>
                <ProjectCard
                  project={project}
                  slug={slugs[project.name]}
                  soonLabel={t('projects.search.soon')}
                />
              </li>
            ))}
          </ul>
          {!filtered.length && (
            <p className="rw-proj-grid-empty" style={{ fontFamily: text }}>
              {t('projects.search.empty', { q: quadrant })}
            </p>
          )}
        </Reveal>
      </div>
    </section>
  )
}
