import { forwardRef } from 'react'
import SpecularButton from './SpecularButton'
import { ctaCopper } from '../styles'

/**
 * One button token for every CTA on the site. Renders a real <button>, or an
 * <a> styled exactly like a button when given an href. All primary CTAs share
 * the 48px height / 10px radius uniform across the site.
 *   variant="gold"    filled metallic sweep + dark text (primary action),
 *                     with the animated gold rim + breathing glow when live
 *   variant="outline" the BookButton glass: transparent, specular shader gold
 *                     rim, white text (secondary actions)
 * When an href is passed it renders an anchor carrying the same styling.
 */
const CtaButton = forwardRef(function CtaButton(
  { href, target, rel, variant = 'gold', live = false, className = '', style, children, ...rest },
  ref,
) {
  if (variant === 'outline') {
    return (
      <SpecularButton
        ref={ref}
        href={href}
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