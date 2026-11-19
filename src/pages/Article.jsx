import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Footer from '../components/Footer'
import Header from '../components/Header'
import Seo from '../components/Seo'
import { cdn, getBlogBySlug, getErrorMessage } from '../data/api'
import { fetchBlogsOnce } from '../data/blogs'
import { FOOTER_LINKS } from '../theme'
import './article.css'

function paragraphsFrom(raw) {
  return String(raw || '')
    .replace(/\r\n/g, '\n')
    .split(/\n{2,}/)
    .map((block) => block.replace(/\n+/g, ' ').replace(/\s+/g, ' ').trim())
    .filter(Boolean)
}

function normalizeTitle(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

function formatArticleDate(value) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

export default function Article() {
  const { slug } = useParams()
  const [post, setPost] = useState(null)
  const [failed, setFailed] = useState('')
  const [related, setRelated] = useState([])

  useEffect(() => {
    let alive = true
    setPost(null)
    setFailed('')
    getBlogBySlug(slug)
      .then((data) => { if (alive) setPost(data) })
      .catch((err) => { if (alive) setFailed(getErrorMessage(err)) })
    return () => { alive = false }
  }, [slug])

  useEffect(() => {
    let alive = true
    fetchBlogsOnce()
      .then((cards) => {
        if (!alive) return
        setRelated(
          (cards || [])
            .filter((card) => card.slug && card.slug !== slug && String(card.href || '').startsWith('/articles/'))
            .slice(0, 3),
        )
      })
      .catch(() => { if (alive) setRelated([]) })
    return () => { alive = false }
  }, [slug])

  const title = post?.metaTitle || post?.title
  const cover = cdn(post?.imageurl)
  const pageTitleKey = normalizeTitle(post?.title)
  const published = formatArticleDate(post?.createdAt)
  const deck = post?.metaDescription?.trim() || ''
  const sections = useMemo(() => post?.sections || [], [post])

  return (
    <>
      <Seo
        route={`/articles/${slug}`}
        title={title ? `${title} | Rajiv Williams` : undefined}
        description={post?.metaDescription}
        image={cover}
      />
      <Header />

      <main className="rw-article-page">
        <p className="rw-article-crumb">
          <Link to="/articles">Articles</Link>
        </p>

        {failed && (
          <p className="rw-article-status">
            {failed === 'Post not found'
              ? 'This article is not published.'
              : 'The article could not be loaded. Try again in a moment.'}
          </p>
        )}

        {post && (
          <>
            <h1 className="rw-article-title">{post.title}</h1>
            {deck ? <p className="rw-article-deck">{deck}</p> : null}
            <div className="rw-article-byline">
              <strong>Team Rajiv Williams</strong>
              {published ? (
                <>
                  <span className="rw-article-byline-dot" aria-hidden="true" />
                  <span>{published}</span>
                </>
              ) : null}
              {post.posturl ? (
                <>
                  <span className="rw-article-byline-dot" aria-hidden="true" />
                  <span>From LinkedIn</span>
                </>
              ) : null}
            </div>

            {cover ? (
              <div className="rw-article-hero">
                <figure>
                  <img src={cover} alt="" />
                </figure>
              </div>
            ) : null}

            <div className="rw-article-body">
              {sections.map((section, index) => {
                const paras = paragraphsFrom(section.description)
                const sectionTitle = section.title?.trim() || ''
                const hideDuplicateHeading =
                  index === 0 && sectionTitle && normalizeTitle(sectionTitle) === pageTitleKey

                return (
                  <section key={`${section.title || 'section'}-${index}`} className="rw-article-section">
                    {sectionTitle && !hideDuplicateHeading ? (
                      <h2 className="rw-article-heading">{sectionTitle}</h2>
                    ) : null}
                    {paras.map((para, pIndex) => (
                      <p key={`${index}-${pIndex}`} className="rw-article-p">
                        {para}
                      </p>
                    ))}
                  </section>
                )
              })}
            </div>

            <footer className="rw-article-footer">
              <Link to="/articles">← All articles</Link>
              {post.posturl ? (
                <a href={post.posturl} target="_blank" rel="noopener noreferrer">
                  Open on LinkedIn
                </a>
              ) : null}
            </footer>

            {related.length > 0 && (
              <aside className="rw-article-related" aria-label="More reading">
                <p className="rw-article-related-label">More reading</p>
                <div className="rw-article-related-grid">
                  {related.map((card) => (
                    <Link key={card.slug} to={card.href} className="rw-article-related-card">
                      {card.src ? <img src={card.src} alt="" loading="lazy" /> : null}
                      <span>{card.title}</span>
                    </Link>
                  ))}
                </div>
              </aside>
            )}
          </>
        )}
      </main>

      <Footer links={FOOTER_LINKS} />
    </>
  )
}
