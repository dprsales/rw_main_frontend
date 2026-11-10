import { forwardRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import SpecularButton from './SpecularButton'
import { ctaCopper } from '../styles'

function isFormPath(path) {
  return typeof path === 'string' && /\/form\/?$/.test(path)
}

function withFromState(to, state, pathname, search) {
  if (!isFormPath(to)) return state
  return { from: `${pathname}${search || ''}`, ...state }
}

/**
 * One button token for every CTA on the site. Renders a real <button>, or an
 * <a> styled exactly like a button when given an href (or a router <Link> when
 * given `to`). All primary CTAs share the 48px height / 10px radius uniform.
 *   variant="gold"      filled metallic sweep + dark text (primary action),
 *                       with the animated gold rim + breathing glow when live
 *   variant="outline"   the BookButton glass: transparent, specular shader gold
 *                       rim, white text (secondary actions of equal weight)
 *   variant="secondary" one step down: 42px, hairline gold rim, mono caps — for
 *                       "not sure?", back, skip and browse actions. `arrow`
 *                       ("→" or "←") renders a sliding arrow; "←" puts it first.
 */
const CtaButton = forwardRef(function CtaButton(
  { href, to, target, rel, variant = 'gold', live = false, arrow, className = '', style, state, children, ...rest },
  ref,
) {
  const { pathname, search } = useLocation()
  const linkState = to ? withFromState(to, state, pathname, search) : state

  if (variant === 'outline') {
    // SpecularButton is <a>/<button> only — map `to` onto href for SPA-less form links.
    const outlineHref = href || to
    return (
      <SpecularButton
        ref={ref}
        href={outlineHref}
        target={target}
        rel={rel}
        radius={10}
        lineColor="#E8C97A"
        baseColor="#C39B53"
        textColor="#F2EFE9"
        intensity={1.1}
        shineSize={12}
        shineFade={45}
        proximity={320}
        className={`rw-specular-cta${className ? ` ${className}` : ''}`}
        style={style}
        {...rest}
      >
        {children}
      </SpecularButton>
    )
  }

  if (variant === 'secondary') {
    const classes = ['rw-cta-secondary', arrow === '←' ? 'rw-cta-secondary--back' : '', className].filter(Boolean).join(' ')
    const inner = (
      <>
        {children}
        {arrow && <span className="rw-cta-secondary-arrow" aria-hidden="true">{arrow}</span>}
      </>
    )
    if (to) return <Link ref={ref} to={to} state={linkState} className={classes} style={style} {...rest}>{inner}</Link>
    if (href) return <a ref={ref} href={href} target={target} rel={rel} className={classes} style={style} {...rest}>{inner}</a>
    return <button ref={ref} type={rest.type || 'button'} className={classes} style={style} {...rest}>{inner}</button>
  }

  const Tag = href ? 'a' : 'button'
  const classes = [
    'rw-cta',
    live ? 'rw-cta--live' : '',
    className,
  ].filter(Boolean).join(' ')
  const base = {
    ...ctaCopper,
    ...style,
  }
  if (to) return <Link ref={ref} to={to} state={linkState} className={classes} style={base} {...rest}>{children}</Link>
  return (
    <Tag
      ref={ref}
      href={href}
      target={href ? target : undefined}
      rel={href ? rel : undefined}
      type={href ? undefined : (rest.type || 'button')}
      className={classes}
      style={base}
      {...rest}
    >
      {children}
    </Tag>
  )
})

export default CtaButton
