import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Footer from '../components/Footer'
import Header from '../components/Header'
import Seo from '../components/Seo'
import { cdn, getBlogBySlug, getErrorMessage } from '../data/api'
import { FOOTER_LINKS, mono, serif } from '../theme'
import { fs, container, note } from '../styles'

export default function Article() {
  const { slug } = useParams()
  const [post, setPost] = useState(null)
  const [failed, setFailed] = useState('')

  useEffect(() => {
    let alive = true
    setPost(null)
    setFailed('')
    getBlogBySlug(slug)
      .then((data) => { if (alive) setPost(data) })
      .catch((err) => { if (alive) setFailed(getErrorMessage(err)) })
    return () => { alive = false }
  }, [slug])

  const title = post?.metaTitle || post?.title
  const cover = cdn(post?.imageurl)

  return (
    <>
      <Seo
        route={`/articles/${slug}`}
        title={title ? `${title} | Rajiv Williams` : undefined}
        description={post?.metaDescription}
        image={cover}
      />
      <Header />

      <section className="rw-pad" style={{ ...container, padding: 'clamp(28px,4vw,48px) 40px clamp(80px,10vw,120px)' }}>
        <p style={{ ...note, fontFamily: mono, fontSize: fs('12px'), letterSpacing: '.1em', marginBottom: 24 }}>
          <Link to="/articles" style={{ color: 'var(--copper)', textDecoration: 'none' }}>ARTICLES</Link>
        </p>

        {failed && (
          <p style={{ ...note, fontFamily: mono, fontSize: fs('13px'), letterSpacing: '.08em' }}>
            {failed === 'Post not found' ? 'This article is not published.' : 'The article could not be loaded. Try again in a moment.'}
          </p>
        )}

        {post && (
          <article>
            <h1 style={{ fontFamily: serif, fontSize: fs('40px'), lineHeight: 1.15, margin: '0 0 20px' }}>
              {post.title}
            </h1>
            {cover && (
              <img
                src={cover}
                alt={post.title}
                style={{ width: '100%', maxHeight: 480, objectFit: 'cover', marginBottom: 36 }}
              />
            )}
            {(post.sections || []).map((section, index) => (
              <section key={`${section.title || 'section'}-${index}`} style={{ marginBottom: 28 }}>
                {section.title && (
                  <h2 style={{ fontFamily: serif, fontSize: fs('24px'), lineHeight: 1.3, margin: '0 0 12px' }}>
                    {section.title}
                  </h2>
                )}
                {section.description && (
                  <p style={{ fontSize: fs('17px'), lineHeight: 1.7, color: 'var(--ink)', whiteSpace: 'pre-wrap' }}>
                    {section.description}
                  </p>
                )}
              </section>
            ))}
            {post.posturl && (
              <p style={{ fontFamily: mono, fontSize: fs('12px'), letterSpacing: '.08em', marginTop: 40 }}>
                <a href={post.posturl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--copper)' }}>
                  Open on LinkedIn
                </a>
              </p>
            )}
          </article>
        )}
      </section>

      <Footer links={FOOTER_LINKS} />
    </>
  )
}
